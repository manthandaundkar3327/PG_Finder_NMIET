import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { PGListing, StoredAccount } from '../types.ts';

dotenv.config();

let cachedClient: SupabaseClient | null = null;

export function getSupabaseCredentials() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    '';
  return { url: url.trim(), key: key.trim() };
}

export function isSupabaseConfigured(): boolean {
  const { url, key } = getSupabaseCredentials();
  return Boolean(
    url &&
    key &&
    !url.includes('your_supabase') &&
    url.startsWith('https://')
  );
}

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient) return cachedClient;

  const { url, key } = getSupabaseCredentials();
  if (isSupabaseConfigured()) {
    try {
      cachedClient = createClient(url, key, {
        auth: { persistSession: false },
      });
      console.log(`[Supabase Cloud] Successfully connected to project: ${url.replace(/^(https:\/\/[^.]+).*/, '$1.supabase.co')}`);
    } catch (err) {
      console.error('[Supabase Cloud] Failed to initialize client:', err);
      cachedClient = null;
    }
  }
  return cachedClient;
}

export function resetSupabaseClient() {
  cachedClient = null;
}

// Convert a PGListing into Supabase table columns
export function toSupabaseListing(l: PGListing) {
  return {
    id: l.id,
    title: l.title,
    type: l.type,
    sharing: String(l.sharing),
    room_type: l.roomType || '2 BHK',
    rent: Number(l.rent) || 0,
    deposit: Number(l.deposit) || 0,
    distance_meters: Number(l.distanceMeters) || 500,
    address: l.address,
    landmark: l.landmark || '',
    food_option: l.foodOption || '',
    amenities: l.amenities || [],
    images: l.images || [],
    contact_name: l.contactName || '',
    contact_phone: l.contactPhone || '',
    contact_whatsapp: l.contactWhatsapp || l.contactPhone || '',
    is_available: l.isAvailable !== undefined ? Boolean(l.isAvailable) : true,
    posted_by: l.postedBy || 'demo-user',
    posted_by_name: l.postedByName || 'Student Host',
    posted_date: l.postedDate || 'Today',
    description: l.description || '',
    rules: l.rules || [],
    rating: Number(l.rating || 4.8),
    reviews_count: Number(l.reviewsCount || 1),
    is_verified: l.isVerified !== undefined ? Boolean(l.isVerified) : true,
    room_size_sq_ft: l.roomSizeSqFt ? Number(l.roomSizeSqFt) : null,
    electricity_charges: l.electricityCharges || 'Included in rent',
    notice_period_days: Number(l.noticePeriodDays || 30),
    updated_at: new Date().toISOString(),
  };
}

// Convert Supabase table row (supporting both snake_case and camelCase) into PGListing
export function fromSupabaseListing(row: any): PGListing {
  return {
    id: String(row.id),
    title: String(row.title || ''),
    type: row.type || 'boys',
    sharing: row.sharing || 'double',
    roomType: row.room_type || row.roomType || '2 BHK',
    rent: Number(row.rent) || 0,
    deposit: Number(row.deposit) || 0,
    distanceMeters: Number(row.distance_meters ?? row.distanceMeters ?? 500),
    address: String(row.address || ''),
    landmark: String(row.landmark || ''),
    foodOption: String(row.food_option || row.foodOption || ''),
    amenities: Array.isArray(row.amenities) ? row.amenities : [],
    images: Array.isArray(row.images) ? row.images : [],
    contactName: String(row.contact_name || row.contactName || ''),
    contactPhone: String(row.contact_phone || row.contactPhone || ''),
    contactWhatsapp: String(row.contact_whatsapp || row.contactWhatsapp || ''),
    isAvailable: Boolean(row.is_available ?? row.isAvailable ?? true),
    postedBy: String(row.posted_by || row.postedBy || 'demo-user'),
    postedByName: String(row.posted_by_name || row.postedByName || 'Student Host'),
    postedDate: String(row.posted_date || row.postedDate || 'Today'),
    description: String(row.description || ''),
    rules: Array.isArray(row.rules) ? row.rules : [],
    rating: Number(row.rating || 4.8),
    reviewsCount: Number(row.reviews_count ?? row.reviewsCount ?? 1),
    isVerified: Boolean(row.is_verified ?? row.isVerified ?? false),
    roomSizeSqFt: row.room_size_sq_ft ?? row.roomSizeSqFt,
    electricityCharges: row.electricity_charges || row.electricityCharges || 'Included in rent',
    noticePeriodDays: Number(row.notice_period_days ?? row.noticePeriodDays ?? 30),
  };
}

// Convert a StoredAccount into Supabase table columns
export function toSupabaseUser(u: StoredAccount) {
  return {
    id: u.id,
    name: u.name,
    email: u.email.trim().toLowerCase(),
    phone: u.phone || '',
    role: u.role || 'student',
    college_branch: u.collegeBranch || '',
    year: u.year || '',
    password: u.password || 'password123',
    created_at: u.createdAt || '',
    updated_at: new Date().toISOString(),
  };
}

// Convert Supabase table row into StoredAccount
export function fromSupabaseUser(row: any): StoredAccount {
  return {
    id: String(row.id),
    name: String(row.name || ''),
    email: String(row.email || '').toLowerCase(),
    phone: String(row.phone || ''),
    role: row.role || 'student',
    collegeBranch: row.college_branch || row.collegeBranch || '',
    year: row.year || '',
    password: row.password || 'password123',
    createdAt: row.created_at || row.createdAt || '',
  };
}

