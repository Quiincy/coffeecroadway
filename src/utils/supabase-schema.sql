-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safely add columns to categories in case it already existed
ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Optional: add unique constraint to slug if you want
-- ALTER TABLE categories ADD CONSTRAINT categories_slug_key UNIQUE (slug);

CREATE TABLE IF NOT EXISTS items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safely add columns to items
ALTER TABLE items
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS slug TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS weight TEXT,
  ADD COLUMN IF NOT EXISTS image_urls TEXT[],
  ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS characteristics JSONB DEFAULT '[]'::jsonb;


-- 3. orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT,
  comment TEXT,
  items JSONB NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  delivery_cost DECIMAL(10, 2) DEFAULT 0,
  distance_km DECIMAL(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'preparing', 'delivering', 'delivered', 'cancelled')),
  payment_method TEXT DEFAULT 'cash'
);

-- 4. site_settings
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE,
  value TEXT,
  contact_phone TEXT,
  contact_address TEXT,
  social_instagram TEXT,
  social_facebook TEXT,
  telegram_bot_token TEXT,
  telegram_chat_id TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. menu_stop_list
CREATE TABLE IF NOT EXISTS menu_stop_list (
  item_id UUID REFERENCES items(id) ON DELETE CASCADE PRIMARY KEY,
  is_available BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- Setup Row Level Security (RLS)

-- categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access to categories" ON categories;
CREATE POLICY "Public read access to categories" ON categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin full access to categories" ON categories;
CREATE POLICY "Admin full access to categories" ON categories FOR ALL USING (auth.role() = 'authenticated');

-- items
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access to items" ON items;
CREATE POLICY "Public read access to items" ON items FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin full access to items" ON items;
CREATE POLICY "Admin full access to items" ON items FOR ALL USING (auth.role() = 'authenticated');

-- orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public insert access to orders" ON orders;
CREATE POLICY "Public insert access to orders" ON orders FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admin full access to orders" ON orders;
CREATE POLICY "Admin full access to orders" ON orders FOR ALL USING (auth.role() = 'authenticated');

-- site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access to site_settings" ON site_settings;
CREATE POLICY "Public read access to site_settings" ON site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin full access to site_settings" ON site_settings;
CREATE POLICY "Admin full access to site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- menu_stop_list
ALTER TABLE menu_stop_list ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access to menu_stop_list" ON menu_stop_list;
CREATE POLICY "Public read access to menu_stop_list" ON menu_stop_list FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admin full access to menu_stop_list" ON menu_stop_list;
CREATE POLICY "Admin full access to menu_stop_list" ON menu_stop_list FOR ALL USING (auth.role() = 'authenticated');


-- Enable Realtime for orders table (this might error if already enabled, but it's fine to try or we can use a PL/pgSQL block if needed)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE orders;
  END IF;
END
$$;


-- Create Storage Bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true) ON CONFLICT (id) DO NOTHING;

-- Setup Storage RLS
DROP POLICY IF EXISTS "Public read access to images" ON storage.objects;
CREATE POLICY "Public read access to images" ON storage.objects FOR SELECT USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Admin insert to images" ON storage.objects;
CREATE POLICY "Admin insert to images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin update to images" ON storage.objects;
CREATE POLICY "Admin update to images" ON storage.objects FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin delete from images" ON storage.objects;
CREATE POLICY "Admin delete from images" ON storage.objects FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');

-- 6. reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES items(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reply_text TEXT,
  reply_created_at TIMESTAMP WITH TIME ZONE
);

-- Setup RLS for reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access to reviews" ON reviews;
CREATE POLICY "Public read access to reviews" ON reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert access to reviews" ON reviews;
-- Allow anyone to insert, but they cannot set reply_text or reply_created_at
CREATE POLICY "Public insert access to reviews" ON reviews FOR INSERT WITH CHECK (reply_text IS NULL AND reply_created_at IS NULL);

DROP POLICY IF EXISTS "Admin full access to reviews" ON reviews;
CREATE POLICY "Admin full access to reviews" ON reviews FOR ALL USING (auth.role() = 'authenticated');
