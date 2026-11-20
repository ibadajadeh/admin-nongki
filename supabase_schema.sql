-- ===================================================
-- SCHEMA DATABASE SUPABASE UNTUK ADMIN PANEL NONGKI
-- ===================================================

-- 1. Tabel Profil Pengguna (Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'customer', -- admin, merchant, cashier, customer
    store_id VARCHAR(100),
    store_name VARCHAR(255),
    avatar_url TEXT,
    status VARCHAR(50) DEFAULT 'active', -- active, inactive
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Tempat Nongki (Places / Cafes)
CREATE TABLE IF NOT EXISTS public.places (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    image_url TEXT,
    image_urls TEXT[] DEFAULT '{}',
    rating NUMERIC(2,1) DEFAULT 4.5,
    review_count INT DEFAULT 0,
    price_min INT DEFAULT 10000,
    price_max INT DEFAULT 45000,
    opening_hours VARCHAR(100) DEFAULT '09:00 - 22:00 WIB',
    is_open BOOLEAN DEFAULT true,
    facilities TEXT[] DEFAULT '{}',
    latitude NUMERIC,
    longitude NUMERIC,
    accepts_order BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Pesanan (Orders)
CREATE TABLE IF NOT EXISTS public.orders (
    id VARCHAR(100) PRIMARY KEY,
    order_number VARCHAR(100) NOT NULL UNIQUE,
    user_id VARCHAR(100) NOT NULL,
    place_id VARCHAR(100) NOT NULL,
    place_name VARCHAR(255) NOT NULL,
    place_address TEXT,
    place_image_url TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    subtotal NUMERIC(12,2) DEFAULT 0,
    service_fee NUMERIC(12,2) DEFAULT 2000,
    total NUMERIC(12,2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'qris',
    payment_status VARCHAR(50) DEFAULT 'paid',
    status VARCHAR(50) DEFAULT 'processing', -- pending, processing, completed, cancelled
    dining_option VARCHAR(50) DEFAULT 'dine_in', -- dine_in, takeaway
    table_number VARCHAR(50),
    notes TEXT,
    has_reviewed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabel Ulasan (Reviews)
CREATE TABLE IF NOT EXISTS public.reviews (
    id VARCHAR(100) PRIMARY KEY,
    place_id VARCHAR(100) NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_avatar TEXT,
    order_id VARCHAR(100),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow Public Access
CREATE POLICY "Akses Penuh Profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Akses Penuh Places" ON public.places FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Akses Penuh Orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Akses Penuh Reviews" ON public.reviews FOR ALL USING (true) WITH CHECK (true);
