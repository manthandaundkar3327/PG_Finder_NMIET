-- ============================================================
-- PG Finder NMIET - Supabase Cloud Database Schema & Setup
-- Run this in your Supabase Dashboard -> SQL Editor
-- ============================================================

-- 1. Create the `listings` table for PG accommodations
CREATE TABLE IF NOT EXISTS public.listings (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  sharing TEXT NOT NULL,
  room_type TEXT DEFAULT '2 BHK',
  rent NUMERIC NOT NULL,
  deposit NUMERIC NOT NULL,
  distance_meters NUMERIC NOT NULL,
  address TEXT NOT NULL,
  landmark TEXT,
  food_option TEXT,
  amenities JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  contact_name TEXT,
  contact_phone TEXT NOT NULL,
  contact_whatsapp TEXT,
  is_available BOOLEAN DEFAULT true,
  posted_by TEXT,
  posted_by_name TEXT,
  posted_date TEXT,
  description TEXT,
  rules JSONB DEFAULT '[]'::jsonb,
  rating NUMERIC DEFAULT 4.8,
  reviews_count INTEGER DEFAULT 1,
  is_verified BOOLEAN DEFAULT true,
  room_size_sq_ft NUMERIC,
  electricity_charges TEXT DEFAULT 'Included in rent',
  notice_period_days INTEGER DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create the `users` table for Student & Admin accounts
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'student',
  college_branch TEXT DEFAULT 'Computer Engineering',
  year TEXT DEFAULT 'Third Year (TE)',
  password TEXT DEFAULT 'password123',
  created_at TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Realtime Replication for both tables so all users receive instant live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.listings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;

-- 4. Enable Row Level Security (RLS) with full read/write access for platform users
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on listings" 
  ON public.listings FOR SELECT USING (true);

CREATE POLICY "Allow public insert access on listings" 
  ON public.listings FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access on listings" 
  ON public.listings FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access on listings" 
  ON public.listings FOR DELETE USING (true);

CREATE POLICY "Allow public read access on users" 
  ON public.users FOR SELECT USING (true);

CREATE POLICY "Allow public insert access on users" 
  ON public.users FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access on users" 
  ON public.users FOR UPDATE USING (true);

CREATE POLICY "Allow public delete access on users" 
  ON public.users FOR DELETE USING (true);

-- 5. Seed initial data
INSERT INTO public.users (id, name, email, phone, role, college_branch, year, password, created_at)
VALUES 
  ('demo-user', 'Manthan Daundkar', 'manthandaundkar33@gmail.com', '+91 97654 32190', 'admin', 'Computer Engineering', 'Third Year (TE)', 'manthan', '01 Nov 2026'),
  ('student-tanmay', 'Tanmay Joshi', 'tanmay.joshi@nmiet.edu.in', '+91 91580 44221', 'student', 'Information Technology', 'Final Year (BE)', 'password123', '01 Nov 2026'),
  ('student-shreya', 'Shreya Kulkarni', 'shreya.k@nmiet.edu.in', '+91 98220 55114', 'student', 'Computer Engineering', 'Second Year (SE)', 'password123', '01 Nov 2026'),
  ('student-rohit', 'Rohit Sharma', 'rohit.sharma@nmiet.edu.in', '+91 98231 77620', 'student', 'Mechanical Engineering', 'Third Year (TE)', 'password123', '01 Nov 2026')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.listings (id, title, type, sharing, room_type, rent, deposit, distance_meters, address, landmark, food_option, amenities, contact_name, contact_phone, contact_whatsapp, is_available, posted_by, posted_by_name, posted_date, description, is_verified)
VALUES
  ('pg-1', 'Sai Krupa Boys PG', 'boys', 'double', '2 BHK', 4200, 5000, 350, 'Plot 14, Samarth Colony, Near NMIET North Gate, Talegaon Dabhade', 'Behind NMIET Sports Ground', 'Available (Mess downstairs @ ₹2400/mo)', '["High-Speed Wi-Fi", "Geyser / Hot Water", "RO Purified Water", "Daily Room Cleaning", "Individual Study Table", "Lockable Wardrobe", "CCTV & Biometric Access", "Bike Parking"]'::jsonb, 'Manthan (Student Host)', '+91 97654 32190', '919765432190', true, 'demo-user', 'Manthan (NMIET Student)', '30 Oct 2026', 'Purpose-built student living space just a 4-minute walk from NMIET college gate. Spacious twin-sharing rooms with individual study tables, ergonomic chairs, mattress, and large cupboards. 24/7 solar hot water, 100 Mbps Wi-Fi, and peaceful atmosphere for engineering students.', true),
  ('pg-2', 'Radha Krishna Girls PG', 'girls', 'double', '2 BHK', 4800, 6000, 450, 'Bungalow 7, Shanti Heights Road, Talegaon Dabhade', 'Opposite Maruti Mandir, near NMIET Bus Stop', 'Pure Veg Mess Included (Breakfast & Dinner)', '["High-Speed Wi-Fi", "Home-cooked Veg Meals", "24/7 Security Guard & CCTV", "Hot Water Geyser", "RO Drinking Water", "Washing Machine", "Attached Washroom", "Backup Inverter"]'::jsonb, 'Sunita Deshmukh (Warden)', '+91 94235 67812', '919423567812', true, 'demo-user', 'Manthan (NMIET Student)', '01 Nov 2026', 'Safe, hygienic, and student-focused girls PG with round-the-clock security and CCTV monitoring. Nutritious home-cooked Maharashtrian breakfast, lunch box packing, and dinner provided. Twin-sharing rooms with attached clean bathrooms and balcony.', true),
  ('pg-7', 'Shivneri Shared Flat', 'unisex', 'double', '2 BHK', 3900, 5000, 700, 'Flat 302, Shivneri Park, Station Road, Talegaon Dabhade', 'Near SBI Bank Branch', 'Modular Kitchen for Self-Cooking', '["High-Speed Wi-Fi", "Fully Equipped Kitchen", "Refrigerator", "Washing Machine", "Geyser / Hot Water", "RO Purified Water", "Sofa & Dining Area", "Bike & Car Parking"]'::jsonb, 'Manthan (NMIET Final Year)', '+91 97654 32190', '919765432190', true, 'demo-user', 'Manthan (NMIET Student)', '26 Oct 2026', 'We have one bed vacant in a very peaceful 2BHK flat. Looking for a neat and disciplined roommate (fellow engineering student or intern). Fully furnished flat with fridge, washing machine, gas stove, and high-speed Wi-Fi.', true)
ON CONFLICT (id) DO NOTHING;

