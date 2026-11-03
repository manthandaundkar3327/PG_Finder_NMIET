import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PGListing, StoredAccount } from '../types.ts';
import { INITIAL_USERS, INITIAL_LISTINGS } from './initialData.ts';
import {
  getSupabaseClient,
  isSupabaseConfigured,
  toSupabaseListing,
  fromSupabaseListing,
  toSupabaseUser,
  fromSupabaseUser,
} from './supabaseClient.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const initialDataFilePath = path.resolve(__dirname, 'initialData.ts');
const listingsJsonFilePath = path.resolve(__dirname, 'listings.json');
const usersJsonFilePath = path.resolve(__dirname, 'users.json');

// Deep clone seed defaults for reset capability
const DEFAULT_SEED_USERS: StoredAccount[] = JSON.parse(JSON.stringify(INITIAL_USERS));
const DEFAULT_SEED_LISTINGS: PGListing[] = JSON.parse(JSON.stringify(INITIAL_LISTINGS));

export interface DataChangeEvent {
  action: string;
  listings: PGListing[];
  users: StoredAccount[];
  timestamp: number;
}

export type DataChangeListener = (event: DataChangeEvent) => void;

class DataStore {
  private listings: PGListing[] = [];
  private users: StoredAccount[] = [];
  private listeners: Set<DataChangeListener> = new Set();
  private supabaseRealtimeSubscribed = false;

  constructor() {
    this.loadInitialData();
    // Connect and synchronize with Supabase Cloud Database if configured
    this.initSupabaseSync();
  }

  public subscribe(listener: DataChangeListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(action: string) {
    const event: DataChangeEvent = {
      action,
      listings: this.getListings(),
      users: this.getUsers(),
      timestamp: Date.now(),
    };

    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (err) {
        console.error('[DataStore] Listener notification error:', err);
      }
    }
  }

  private loadInitialData() {
    try {
      if (fs.existsSync(listingsJsonFilePath)) {
        const raw = fs.readFileSync(listingsJsonFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.listings = parsed;
        }
      }
    } catch (e) {
      console.warn('[DataStore] Failed to read listings.json, falling back to initialData.ts', e);
    }

    if (this.listings.length === 0) {
      this.listings = JSON.parse(JSON.stringify(INITIAL_LISTINGS));
    }

    try {
      if (fs.existsSync(usersJsonFilePath)) {
        const raw = fs.readFileSync(usersJsonFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.users = parsed;
        }
      }
    } catch (e) {
      console.warn('[DataStore] Failed to read users.json, falling back to initialData.ts', e);
    }

    if (this.users.length === 0) {
      this.users = JSON.parse(JSON.stringify(INITIAL_USERS));
    }

    this.saveToFile('init', false);
  }

  private async safeCloudOp(op: () => PromiseLike<any>, desc: string) {
    try {
      const res = await op();
      if (res?.error) {
        console.warn(`[Supabase Cloud] ${desc} warning:`, res.error.message);
      }
    } catch (err) {
      console.error(`[Supabase Cloud] ${desc} error:`, err);
    }
  }

  // --- SUPABASE CLOUD DATABASE SYNC & REALTIME ---

  public async initSupabaseSync(): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      console.log('[Supabase Cloud] No cloud credentials detected yet. Operating in synchronized local fallback mode.');
      return false;
    }

    const client = getSupabaseClient();
    if (!client) return false;

    console.log('[Supabase Cloud] Fetching authoritative source data from cloud PostgreSQL database...');

    try {
      // 1. Fetch Listings from Cloud
      const { data: cloudListings, error: lErr } = await client.from('listings').select('*');
      if (lErr) {
        console.warn('[Supabase Cloud] Listings read error:', lErr.message);
      } else if (Array.isArray(cloudListings) && cloudListings.length > 0) {
        this.listings = cloudListings.map(fromSupabaseListing);
        console.log(`[Supabase Cloud] Loaded ${this.listings.length} live listings from Cloud Database!`);
      } else if (Array.isArray(cloudListings) && cloudListings.length === 0 && this.listings.length > 0) {
        // Cloud is empty -> auto seed from current dataset
        console.log('[Supabase Cloud] Cloud listings table is empty. Auto-seeding initial vacancies to Cloud Database...');
        await client.from('listings').upsert(this.listings.map(toSupabaseListing));
      }

      // 2. Fetch Users from Cloud
      const { data: cloudUsers, error: uErr } = await client.from('users').select('*');
      if (uErr) {
        console.warn('[Supabase Cloud] Users read error:', uErr.message);
      } else if (Array.isArray(cloudUsers) && cloudUsers.length > 0) {
        this.users = cloudUsers.map(fromSupabaseUser);
        console.log(`[Supabase Cloud] Loaded ${this.users.length} live user accounts from Cloud Database!`);
      } else if (Array.isArray(cloudUsers) && cloudUsers.length === 0 && this.users.length > 0) {
        console.log('[Supabase Cloud] Cloud users table is empty. Auto-seeding initial users to Cloud Database...');
        await client.from('users').upsert(this.users.map(toSupabaseUser));
      }

      // Save local snapshot & notify all connected SSE clients
      this.saveToFile('cloud_sync', true);

      // 3. Setup Supabase Realtime channel for instant cross-device updates
      this.setupSupabaseRealtime(client);
      return true;
    } catch (err) {
      console.error('[Supabase Cloud] Synchronization error:', err);
      return false;
    }
  }

  private setupSupabaseRealtime(client: ReturnType<typeof getSupabaseClient>) {
    if (!client || this.supabaseRealtimeSubscribed) return;
    this.supabaseRealtimeSubscribed = true;

    try {
      client
        .channel('cloud-pg-finder-live')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, async (payload) => {
          console.log('[Supabase Cloud Realtime] Remote listing change detected:', payload.eventType);
          const { data } = await client.from('listings').select('*');
          if (Array.isArray(data)) {
            this.listings = data.map(fromSupabaseListing);
            this.saveToFile('cloud_realtime_listing_update', true);
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, async (payload) => {
          console.log('[Supabase Cloud Realtime] Remote user change detected:', payload.eventType);
          const { data } = await client.from('users').select('*');
          if (Array.isArray(data)) {
            this.users = data.map(fromSupabaseUser);
            this.saveToFile('cloud_realtime_user_update', true);
          }
        })
        .subscribe((status) => {
          console.log(`[Supabase Cloud Realtime] Channel subscription status: ${status}`);
        });
    } catch (err) {
      console.warn('[Supabase Cloud Realtime] Subscription error:', err);
    }
  }

  /**
   * Pushes all local listings and users to Supabase Cloud
   */
  public async syncAllToSupabase(): Promise<{ success: boolean; message: string }> {
    const client = getSupabaseClient();
    if (!client) {
      return { success: false, message: 'Supabase credentials not configured in .env' };
    }

    try {
      const listingRows = this.listings.map(toSupabaseListing);
      const userRows = this.users.map(toSupabaseUser);

      const { error: lErr } = await client.from('listings').upsert(listingRows);
      if (lErr) throw lErr;

      const { error: uErr } = await client.from('users').upsert(userRows);
      if (uErr) throw uErr;

      return {
        success: true,
        message: `Successfully uploaded ${listingRows.length} listings and ${userRows.length} users to Supabase Cloud Database!`,
      };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to sync to Supabase' };
    }
  }

  /**
   * Persists current state directly to initialData.ts, listings.json, and users.json
   */
  public saveToFile(action = 'update', shouldNotify = true): boolean {
    try {
      const tsContent = `import { PGListing, StoredAccount } from '../types.ts';

export const INITIAL_USERS: StoredAccount[] = ${JSON.stringify(this.users, null, 2)};

export const INITIAL_LISTINGS: PGListing[] = ${JSON.stringify(this.listings, null, 2)};
`;

      fs.writeFileSync(initialDataFilePath, tsContent, 'utf-8');
      fs.writeFileSync(listingsJsonFilePath, JSON.stringify(this.listings, null, 2), 'utf-8');
      fs.writeFileSync(usersJsonFilePath, JSON.stringify(this.users, null, 2), 'utf-8');

      if (shouldNotify) {
        this.notify(action);
      }
      return true;
    } catch (err) {
      console.error('[DataStore] Error persisting data to files:', err);
      return false;
    }
  }

  // --- LISTINGS OPERATIONS (Cloud + Memory + File) ---

  public getListings(): PGListing[] {
    return [...this.listings];
  }

  public getListingById(id: string): PGListing | undefined {
    return this.listings.find((l) => l.id === id);
  }

  public addListing(newListing: PGListing): PGListing {
    this.listings.unshift(newListing);
    this.saveToFile('listing_added');

    // Write to Supabase Cloud Database
    const client = getSupabaseClient();
    if (client) {
      this.safeCloudOp(
        () => client.from('listings').upsert(toSupabaseListing(newListing)),
        `Save vacancy ${newListing.title}`
      );
    }

    return newListing;
  }

  public updateListing(id: string, updatedFields: Partial<PGListing>): PGListing | null {
    const index = this.listings.findIndex((l) => l.id === id);
    if (index === -1) return null;

    this.listings[index] = {
      ...this.listings[index],
      ...updatedFields,
      id,
    };

    const updated = this.listings[index];
    this.saveToFile('listing_updated');

    // Update in Supabase Cloud Database
    const client = getSupabaseClient();
    if (client) {
      this.safeCloudOp(
        () => client.from('listings').update(toSupabaseListing(updated)).eq('id', id),
        `Update vacancy ${updated.title}`
      );
    }

    return updated;
  }

  public deleteListing(id: string): boolean {
    const initialLen = this.listings.length;
    this.listings = this.listings.filter((l) => l.id !== id);
    if (this.listings.length !== initialLen) {
      this.saveToFile('listing_deleted');

      // Delete from Supabase Cloud Database
      const client = getSupabaseClient();
      if (client) {
        this.safeCloudOp(
          () => client.from('listings').delete().eq('id', id),
          `Delete vacancy ${id}`
        );
      }

      return true;
    }
    return false;
  }

  public toggleAvailability(id: string): boolean | null {
    const listing = this.listings.find((l) => l.id === id);
    if (!listing) return null;
    listing.isAvailable = !listing.isAvailable;
    this.saveToFile('availability_toggled');

    const client = getSupabaseClient();
    if (client) {
      this.safeCloudOp(
        () =>
          client
            .from('listings')
            .update({ is_available: listing.isAvailable, updated_at: new Date().toISOString() })
            .eq('id', id),
        `Toggle availability for ${id}`
      );
    }

    return listing.isAvailable;
  }

  public toggleVerified(id: string): boolean | null {
    const listing = this.listings.find((l) => l.id === id);
    if (!listing) return null;
    listing.isVerified = !listing.isVerified;
    this.saveToFile('verified_toggled');

    const client = getSupabaseClient();
    if (client) {
      this.safeCloudOp(
        () =>
          client
            .from('listings')
            .update({ is_verified: listing.isVerified, updated_at: new Date().toISOString() })
            .eq('id', id),
        `Toggle verified for ${id}`
      );
    }

    return listing.isVerified;
  }

  // --- USERS OPERATIONS (Cloud + Memory + File) ---

  public getUsers(): StoredAccount[] {
    return [...this.users];
  }

  public getUserById(id: string): StoredAccount | undefined {
    return this.users.find((u) => u.id === id);
  }

  public getUserByEmail(email: string): StoredAccount | undefined {
    const cleanEmail = email.trim().toLowerCase();
    return this.users.find((u) => u.email.trim().toLowerCase() === cleanEmail);
  }

  public addUser(user: StoredAccount): StoredAccount {
    this.users.push(user);
    this.saveToFile('user_added');

    const client = getSupabaseClient();
    if (client) {
      this.safeCloudOp(
        () => client.from('users').upsert(toSupabaseUser(user)),
        `Insert user ${user.name}`
      );
    }

    return user;
  }

  public updateUser(id: string, updatedFields: Partial<StoredAccount>): StoredAccount | null {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    this.users[index] = {
      ...this.users[index],
      ...updatedFields,
      id,
    };

    const updated = this.users[index];
    this.saveToFile('user_updated');

    const client = getSupabaseClient();
    if (client) {
      this.safeCloudOp(
        () => client.from('users').update(toSupabaseUser(updated)).eq('id', id),
        `Update user ${updated.name}`
      );
    }

    return updated;
  }

  public deleteUser(id: string): boolean {
    const target = this.users.find((u) => u.id === id);
    if (!target) return false;
    if (target.email.toLowerCase() === 'manthandaundkar33@gmail.com' || target.id === 'demo-user') {
      return false;
    }
    this.users = this.users.filter((u) => u.id !== id);
    this.saveToFile('user_deleted');

    const client = getSupabaseClient();
    if (client) {
      this.safeCloudOp(
        () => client.from('users').delete().eq('id', id),
        `Delete user ${id}`
      );
    }

    return true;
  }

  public resetPassword(id: string, newPassword: string): boolean {
    const user = this.users.find((u) => u.id === id);
    if (!user) return false;
    user.password = newPassword.trim();
    this.saveToFile('password_reset');

    const client = getSupabaseClient();
    if (client) {
      this.safeCloudOp(
        () =>
          client
            .from('users')
            .update({ password: user.password, updated_at: new Date().toISOString() })
            .eq('id', id),
        `Reset password for ${id}`
      );
    }

    return true;
  }

  // --- RESET & IMPORT ---

  public resetToDefaults(): { listings: PGListing[]; users: StoredAccount[] } {
    this.users = JSON.parse(JSON.stringify(DEFAULT_SEED_USERS));
    this.listings = JSON.parse(JSON.stringify(DEFAULT_SEED_LISTINGS));
    this.saveToFile('reset_to_defaults');

    const client = getSupabaseClient();
    if (client) {
      this.safeCloudOp(
        () => client.from('listings').upsert(this.listings.map(toSupabaseListing)),
        'Reset listings cloud'
      );
      this.safeCloudOp(
        () => client.from('users').upsert(this.users.map(toSupabaseUser)),
        'Reset users cloud'
      );
    }

    return { listings: this.listings, users: this.users };
  }

  public importData(importedListings?: PGListing[], importedUsers?: StoredAccount[]): boolean {
    if (Array.isArray(importedListings) && importedListings.length > 0) {
      this.listings = importedListings;
    }
    if (Array.isArray(importedUsers) && importedUsers.length > 0) {
      this.users = importedUsers;
    }
    this.saveToFile('data_imported');

    const client = getSupabaseClient();
    if (client) {
      if (Array.isArray(importedListings)) {
        this.safeCloudOp(
          () => client.from('listings').upsert(importedListings.map(toSupabaseListing)),
          'Import listings cloud'
        );
      }
      if (Array.isArray(importedUsers)) {
        this.safeCloudOp(
          () => client.from('users').upsert(importedUsers.map(toSupabaseUser)),
          'Import users cloud'
        );
      }
    }

    return true;
  }
}

export const dataStore = new DataStore();
