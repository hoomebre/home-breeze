-- 1. CATEGORIES TABLE
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. PRODUCTS TABLE
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  price DECIMAL(12, 2) NOT NULL,
  compare_at_price DECIMAL(12, 2),
  sku TEXT UNIQUE,
  stock_quantity INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  rating DECIMAL(3, 2) DEFAULT 0,
  review_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. PRODUCT IMAGES
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  aspect_ratio TEXT, -- Store target or observed ratio
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. PRODUCT SPECIFICATIONS
CREATE TABLE product_specifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  spec_name TEXT NOT NULL,
  spec_value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. DISCOUNT CODES
CREATE TABLE discount_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT UNIQUE NOT NULL,
  type TEXT CHECK (type IN ('percentage', 'fixed')),
  value DECIMAL(12, 2) NOT NULL,
  min_order_amount DECIMAL(12, 2) DEFAULT 0,
  usage_limit INT,
  used_count INT DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. ORDERS
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. ORDER ITEMS
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INT NOT NULL,
  price DECIMAL(12, 2) NOT NULL
);

-- 8. SITE SETTINGS (Logo, Hero, Contact, Deals)
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL, -- e.g., 'logo', 'hero', 'contact', 'deals'
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- INITIAL SETTINGS DATA
INSERT INTO site_settings (key, value) VALUES 
('logo', '{"url": "", "alt": "Saintry Logo"}'),
('hero', '{"image_url": "", "title": "Transform Your Bathroom Dreams", "subtitle": "Premium luxury products for your home", "button_text": "Shop Now"}'),
('contact', '{"phone": "", "email": "", "address": "" }'),
('deals', '{"active": true, "banner_text": "Special Offer: 10% off on first order!", "banner_color": "#D4AF37"}');

-- Enable RLS (Disable for MVP if user prefers simplicity, but standard is enabled)
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- For now, let's keep it simple for the user setup.

-- 9. STORAGE SETUP
-- Create the 'saintry' bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('saintry', 'saintry', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for Storage
-- Allow public access to view images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'saintry' );

-- Allow authenticated users (admin) to upload images
CREATE POLICY "Admin Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'saintry' );

-- Allow authenticated users (admin) to update/delete images
CREATE POLICY "Admin Update/Delete"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'saintry' );

CREATE POLICY "Admin Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'saintry' );

