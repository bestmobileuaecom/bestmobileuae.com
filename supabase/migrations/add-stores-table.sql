-- =====================================================
-- STORES TABLE - Manage UAE Stores with Logos
-- =====================================================

CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    logo_url TEXT,
    website_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
CREATE INDEX idx_stores_active ON stores(is_active);
CREATE INDEX idx_stores_sort ON stores(sort_order);

-- Enable RLS
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Anyone can read stores
CREATE POLICY "Public read access for stores"
ON stores FOR SELECT
TO public
USING (true);

-- Authenticated users can manage stores
CREATE POLICY "Authenticated users can insert stores"
ON stores FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update stores"
ON stores FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete stores"
ON stores FOR DELETE
TO authenticated
USING (true);

-- =====================================================
-- UPDATE phone_store_prices to reference stores table
-- =====================================================

-- Add store_id column (optional, for linking to stores table)
ALTER TABLE phone_store_prices 
ADD COLUMN store_id UUID REFERENCES stores(id) ON DELETE SET NULL;

-- Create index for store_id
CREATE INDEX idx_store_prices_store ON phone_store_prices(store_id);

-- =====================================================
-- SEED DEFAULT UAE STORES
-- =====================================================
INSERT INTO stores (name, slug, website_url, sort_order) VALUES
('Noon', 'noon', 'https://www.noon.com', 1),
('Amazon', 'amazon', 'https://www.amazon.ae', 2),
('Sharaf DG', 'sharaf-dg', 'https://www.sharafdg.com', 3),
('Virgin Megastore', 'virgin-megastore', 'https://www.virginmegastore.ae', 4),
('Apple Store', 'apple-store', 'https://www.apple.com/ae/', 5),
('Samsung Store', 'samsung-store', 'https://www.samsung.com/ae/', 6),
('Jumbo Electronics', 'jumbo-electronics', 'https://www.jumbo.ae', 7),
('Emax', 'emax', 'https://www.emaxme.com', 8),
('Carrefour', 'carrefour', 'https://www.carrefouruae.com', 9),
('Lulu Hypermarket', 'lulu', 'https://www.luluhypermarket.com', 10)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- STORAGE BUCKET FOR STORE LOGOS
-- =====================================================
-- Create bucket 'store-logos' via Supabase Dashboard:
-- 1. Go to Storage > New bucket
-- 2. Name: store-logos
-- 3. Public: Yes
-- 4. Create bucket

-- Then add these policies (or run via Dashboard):
-- INSERT INTO storage.buckets (id, name, public) VALUES ('store-logos', 'store-logos', true);

-- Storage policies for store-logos bucket:
-- CREATE POLICY "Allow authenticated uploads to store-logos"
-- ON storage.objects FOR INSERT TO authenticated
-- WITH CHECK (bucket_id = 'store-logos');

-- CREATE POLICY "Allow public read for store-logos"
-- ON storage.objects FOR SELECT TO public
-- USING (bucket_id = 'store-logos');

-- CREATE POLICY "Allow authenticated updates to store-logos"
-- ON storage.objects FOR UPDATE TO authenticated
-- USING (bucket_id = 'store-logos');

-- CREATE POLICY "Allow authenticated deletes from store-logos"
-- ON storage.objects FOR DELETE TO authenticated
-- USING (bucket_id = 'store-logos');
