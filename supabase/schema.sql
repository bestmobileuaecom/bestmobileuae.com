-- =====================================================
-- BEST MOBILE UAE - DATABASE SCHEMA
-- Copy and paste this entire file into Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. BRANDS TABLE
-- =====================================================
CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. PHONES TABLE (Main phone data)
-- =====================================================
CREATE TABLE phones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
    image_url TEXT DEFAULT '/mobile1.jpg',
    price INTEGER NOT NULL, -- Price in AED
    price_range VARCHAR(50), -- Display format like "AED 1,199"
    release_date DATE,
    category VARCHAR(50) CHECK (category IN ('budget', 'mid-range', 'flagship', 'premium')),
    
    -- Badge & Marketing
    badge VARCHAR(100), -- e.g., "Best Battery Life"
    badge_color VARCHAR(50) DEFAULT 'emerald',
    why_pick TEXT, -- One-line reason to pick this phone
    best_for TEXT[], -- Array: ["battery", "daily-use", "updates"]
    verdict TEXT, -- Short verdict text
    identity TEXT, -- Full identity description
    
    -- Overall Score
    overall_score_rating DECIMAL(3,1) CHECK (overall_score_rating >= 0 AND overall_score_rating <= 10),
    overall_score_label VARCHAR(50), -- "Excellent", "Very Good", etc.
    
    -- Category Scores (1-10)
    score_camera INTEGER CHECK (score_camera >= 0 AND score_camera <= 10),
    score_battery INTEGER CHECK (score_battery >= 0 AND score_battery <= 10),
    score_performance INTEGER CHECK (score_performance >= 0 AND score_performance <= 10),
    score_display INTEGER CHECK (score_display >= 0 AND score_display <= 10),
    score_value INTEGER CHECK (score_value >= 0 AND score_value <= 10),
    
    -- Arrays for pros/cons/highlights
    highlights TEXT[],
    pros TEXT[],
    cons TEXT[],
    tags TEXT[], -- ["5g", "amoled", "good-battery"]
    
    -- Detailed scores for phone detail page (JSON)
    detailed_scores JSONB, -- [{label, icon, rating}]
    
    -- Trust Signals (JSON)
    trust_signals JSONB, -- [{icon, label}]
    
    -- Storage & Color Options
    storage_options TEXT[],
    color_options JSONB, -- [{name, hex}]
    
    -- Buy/Skip Reasons
    buy_reasons TEXT[],
    skip_reasons TEXT[],
    
    -- Key Differences (JSON)
    key_differences JSONB, -- [{icon, title, points[]}]
    
    -- Price Comparison Points
    price_comparison JSONB, -- [{type, label, text}]
    
    -- Final Recommendation
    final_recommendation TEXT,
    
    -- Related Links for SEO
    related_links JSONB, -- [{href, label}]
    
    -- Specs (Nested JSON)
    specs JSONB,
    
    -- FAQs
    faqs JSONB, -- [{question, answer}]
    
    -- Alternatives (references to other phones)
    alternatives JSONB, -- [{slug, reason}]
    
    -- Publishing Status
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'preview', 'published')),
    published_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for common queries
CREATE INDEX idx_phones_status ON phones(status);
CREATE INDEX idx_phones_brand ON phones(brand_id);
CREATE INDEX idx_phones_category ON phones(category);
CREATE INDEX idx_phones_price ON phones(price);
CREATE INDEX idx_phones_slug ON phones(slug);

-- =====================================================
-- 3. PHONE STORE PRICES (Where to buy)
-- =====================================================
CREATE TABLE phone_store_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_id UUID REFERENCES phones(id) ON DELETE CASCADE,
    store_name VARCHAR(100) NOT NULL,
    price VARCHAR(50) NOT NULL, -- "AED 1,179"
    price_value INTEGER, -- Numeric for sorting
    url TEXT,
    region VARCHAR(50) DEFAULT 'UAE',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_store_prices_phone ON phone_store_prices(phone_id);

-- =====================================================
-- 4. ARTICLES/BLOGS TABLE
-- =====================================================
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(500) NOT NULL,
    excerpt TEXT,
    content TEXT, -- Full article content (Markdown or HTML)
    category VARCHAR(50) CHECK (category IN ('Review', 'News', 'Guide', 'Comparison')),
    read_time VARCHAR(20), -- "8 min"
    phone_name VARCHAR(255), -- Related phone name
    phone_id UUID REFERENCES phones(id) ON DELETE SET NULL, -- Optional link to phone
    image_url TEXT DEFAULT '/mobile1.jpg',
    author VARCHAR(100) DEFAULT 'Tech Team',
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    -- Publishing Status
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'preview', 'published')),
    published_at TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_slug ON articles(slug);

-- =====================================================
-- 5. SITE SETTINGS (General site configuration)
-- =====================================================
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) NOT NULL UNIQUE,
    value JSONB,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (key, value, description) VALUES
('hero', '{"title": "Find Your Perfect Phone in UAE", "subtitle": "Compare prices, specs, and reviews to make the right choice", "showSearch": true}', 'Homepage hero section'),
('footer', '{"copyright": "© 2025 Best Mobile UAE. All rights reserved.", "socialLinks": []}', 'Footer settings'),
('seo', '{"siteTitle": "Best Mobile UAE", "defaultDescription": "Compare mobile phone prices and specs in UAE"}', 'SEO defaults');

-- =====================================================
-- 6. PAGE CONTENT (For static pages like About, How to Use)
-- =====================================================
CREATE TABLE pages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    content TEXT, -- Markdown or HTML content
    meta_title VARCHAR(255),
    meta_description TEXT,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'preview', 'published')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default pages
INSERT INTO pages (slug, title, status) VALUES
('about', 'About Us', 'draft'),
('how-to-use', 'How to Use', 'draft');

-- =====================================================
-- 7. COMPARISONS (Saved phone comparisons)
-- =====================================================
CREATE TABLE comparisons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    title VARCHAR(255),
    phone_ids UUID[], -- Array of phone UUIDs
    is_featured BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'preview', 'published')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 8. UPDATED_AT TRIGGER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_brands_updated_at BEFORE UPDATE ON brands FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_phones_updated_at BEFORE UPDATE ON phones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_phone_store_prices_updated_at BEFORE UPDATE ON phone_store_prices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comparisons_updated_at BEFORE UPDATE ON comparisons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 9. ROW LEVEL SECURITY (RLS)
-- =====================================================
-- Enable RLS on all tables
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE phones ENABLE ROW LEVEL SECURITY;
ALTER TABLE phone_store_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparisons ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can view active brands" ON brands FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view published phones" ON phones FOR SELECT USING (status IN ('published', 'preview'));
CREATE POLICY "Public can view published phone prices" ON phone_store_prices FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view published articles" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view site settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public can view published pages" ON pages FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view published comparisons" ON comparisons FOR SELECT USING (status = 'published');

-- Admin full access (authenticated users)
CREATE POLICY "Admin full access brands" ON brands FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access phones" ON phones FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access phone_store_prices" ON phone_store_prices FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access articles" ON articles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access site_settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access pages" ON pages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access comparisons" ON comparisons FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 10. SAMPLE DATA (Optional - Remove in production)
-- =====================================================
-- Insert sample brands
INSERT INTO brands (name, slug, sort_order) VALUES
('Samsung', 'samsung', 1),
('Apple', 'apple', 2),
('Google', 'google', 3),
('OnePlus', 'oneplus', 4),
('Xiaomi', 'xiaomi', 5),
('Nothing', 'nothing', 6),
('Oppo', 'oppo', 7),
('Vivo', 'vivo', 8),
('Huawei', 'huawei', 9),
('Realme', 'realme', 10);

-- =====================================================
-- DONE! Your database is ready.
-- =====================================================
