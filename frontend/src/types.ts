export type GenderType = 'boys' | 'girls' | 'unisex';
export type SharingType = number | 'single' | 'double' | 'triple' | 'four';

export const ROOM_TYPE_OPTIONS = [
  '1 RK',
  '1 BHK',
  '2 BHK',
  '3 BHK',
  '4 BHK',
  'Studio / Single Room',
] as const;

export type RoomType = (typeof ROOM_TYPE_OPTIONS)[number] | string;

export interface PGListing {
  id: string;
  title: string;
  type: GenderType;
  sharing: SharingType;
  roomType?: string; // e.g. 1BHK, 2BHK, 3BHK, etc.
  rent: number;
  deposit: number;
  distanceMeters: number; // in meters from NMIET campus
  address: string;
  landmark: string;
  foodOption: string;
  amenities: string[];
  images?: string[];
  contactName: string;
  contactPhone: string;
  contactWhatsapp: string;
  isAvailable: boolean;
  postedBy: string; // user id / email
  postedByName: string;
  postedDate: string;
  description: string;
  rules: string[];
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  roomSizeSqFt?: number;
  electricityCharges?: string;
  noticePeriodDays?: number;
}

export interface FilterState {
  searchQuery: string;
  gender: GenderType | 'all';
  sharing: SharingType | 'all';
  roomType?: string | 'all';
  maxRent: number;
  maxDistanceMeters: number;
  foodRequired: boolean;
  selectedAmenities: string[];
  sortBy: 'recommended' | 'rent-asc' | 'rent-desc' | 'distance-asc' | 'rating-desc';
}

export type TabType = 'explore' | 'find' | 'create' | 'my-posts' | 'saved' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: 'student' | 'admin';
  collegeBranch?: string;
  year?: string;
}

export interface StoredAccount extends UserProfile {
  password?: string;
}
