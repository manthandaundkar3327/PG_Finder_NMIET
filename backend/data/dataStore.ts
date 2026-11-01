import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PGListing, StoredAccount } from '../types.ts';
import { INITIAL_USERS, INITIAL_LISTINGS } from './initialData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const initialDataFilePath = path.resolve(__dirname, 'initialData.ts');
const listingsJsonFilePath = path.resolve(__dirname, 'listings.json');
const usersJsonFilePath = path.resolve(__dirname, 'users.json');

// Deep clone seed defaults for reset capability
const DEFAULT_SEED_USERS: StoredAccount[] = JSON.parse(JSON.stringify(INITIAL_USERS));
const DEFAULT_SEED_LISTINGS: PGListing[] = JSON.parse(JSON.stringify(INITIAL_LISTINGS));

class DataStore {
  private listings: PGListing[] = [];
  private users: StoredAccount[] = [];

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData() {
    // Try to load from JSON files first if present, otherwise fallback to initialData.ts
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

    // Save initial state to both files on startup
    this.saveToFile();
  }

  /**
   * Persists current memory state directly into backend/data/initialData.ts
   * and auxiliary listings.json & users.json
   */
  public saveToFile(): boolean {
    try {
      const tsContent = `import { PGListing, StoredAccount } from '../types.ts';

export const INITIAL_USERS: StoredAccount[] = ${JSON.stringify(this.users, null, 2)};

export const INITIAL_LISTINGS: PGListing[] = ${JSON.stringify(this.listings, null, 2)};
`;

      fs.writeFileSync(initialDataFilePath, tsContent, 'utf-8');
      fs.writeFileSync(listingsJsonFilePath, JSON.stringify(this.listings, null, 2), 'utf-8');
      fs.writeFileSync(usersJsonFilePath, JSON.stringify(this.users, null, 2), 'utf-8');
      
      console.log(`[DataStore] Persisted ${this.listings.length} listings and ${this.users.length} users to initialData.ts and JSON files.`);
      return true;
    } catch (err) {
      console.error('[DataStore] Error persisting data to files:', err);
      return false;
    }
  }

  // --- LISTINGS OPERATIONS ---

  public getListings(): PGListing[] {
    return [...this.listings];
  }

  public getListingById(id: string): PGListing | undefined {
    return this.listings.find((l) => l.id === id);
  }

  public addListing(newListing: PGListing): PGListing {
    this.listings.unshift(newListing);
    this.saveToFile();
    return newListing;
  }

  public updateListing(id: string, updatedFields: Partial<PGListing>): PGListing | null {
    const index = this.listings.findIndex((l) => l.id === id);
    if (index === -1) return null;

    this.listings[index] = {
      ...this.listings[index],
      ...updatedFields,
      id, // Preserve original ID
    };

    this.saveToFile();
    return this.listings[index];
  }

  public deleteListing(id: string): boolean {
    const initialLen = this.listings.length;
    this.listings = this.listings.filter((l) => l.id !== id);
    if (this.listings.length !== initialLen) {
      this.saveToFile();
      return true;
    }
    return false;
  }

  public toggleAvailability(id: string): boolean | null {
    const listing = this.listings.find((l) => l.id === id);
    if (!listing) return null;
    listing.isAvailable = !listing.isAvailable;
    this.saveToFile();
    return listing.isAvailable;
  }

  public toggleVerified(id: string): boolean | null {
    const listing = this.listings.find((l) => l.id === id);
    if (!listing) return null;
    listing.isVerified = !listing.isVerified;
    this.saveToFile();
    return listing.isVerified;
  }

  // --- USERS OPERATIONS ---

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
    this.saveToFile();
    return user;
  }

  public updateUser(id: string, updatedFields: Partial<StoredAccount>): StoredAccount | null {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    this.users[index] = {
      ...this.users[index],
      ...updatedFields,
      id, // Protect ID
    };

    this.saveToFile();
    return this.users[index];
  }

  public deleteUser(id: string): boolean {
    const target = this.users.find((u) => u.id === id);
    if (!target) return false;
    // Disallow deleting primary admin
    if (target.email.toLowerCase() === 'manthandaundkar33@gmail.com' || target.id === 'demo-user') {
      return false;
    }
    this.users = this.users.filter((u) => u.id !== id);
    this.saveToFile();
    return true;
  }

  public resetPassword(id: string, newPassword: string): boolean {
    const user = this.users.find((u) => u.id === id);
    if (!user) return false;
    user.password = newPassword.trim();
    this.saveToFile();
    return true;
  }

  // --- RESET & IMPORT ---

  public resetToDefaults(): { listings: PGListing[]; users: StoredAccount[] } {
    this.users = JSON.parse(JSON.stringify(DEFAULT_SEED_USERS));
    this.listings = JSON.parse(JSON.stringify(DEFAULT_SEED_LISTINGS));
    this.saveToFile();
    return { listings: this.listings, users: this.users };
  }

  public importData(importedListings?: PGListing[], importedUsers?: StoredAccount[]): boolean {
    if (Array.isArray(importedListings) && importedListings.length > 0) {
      this.listings = importedListings;
    }
    if (Array.isArray(importedUsers) && importedUsers.length > 0) {
      this.users = importedUsers;
    }
    this.saveToFile();
    return true;
  }
}

export const dataStore = new DataStore();

