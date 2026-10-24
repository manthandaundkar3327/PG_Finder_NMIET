export type GenderType = 'boys' | 'girls' | 'unisex';
export type SharingType = 'single' | 'double' | 'triple' | 'four';

export interface PGListing {
  id: string;
  title: string;
  type: GenderType;
  sharing: SharingType;
  roomType?: string;
  rent: number;
  deposit: number;
  distanceMeters: number;
  address: string;
  landmark: string;
  foodOption: string;
  amenities: string[];
  images?: string[];
  contactName: string;
  contactPhone: string;
  contactWhatsapp: string;
  isAvailable: boolean;
  postedBy: string;
  postedByName: string;
  postedDate: string;
  description: string;
  rules?: string[];
  rating?: number;
  reviewsCount?: number;
  isVerified?: boolean;
  roomSizeSqFt?: number;
  electricityCharges?: string;
  noticePeriodDays?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'student' | 'owner';
  collegeBranch?: string;
  year?: string;
}

export interface StoredAccount extends UserProfile {
  password?: string;
}
