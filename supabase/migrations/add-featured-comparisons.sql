-- =====================================================
-- FEATURED COMPARISONS TABLE
-- Controls comparison pairs shown on homepage and phone detail pages
-- =====================================================

-- Featured comparisons table for homepage and phone pages
CREATE TABLE featured_comparisons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone1_id UUID REFERENCES phones(id) ON DELETE CASCADE,
    phone2_id UUID REFERENCES phones(id) ON DELETE CASCADE,
    
    -- Display settings
    title VARCHAR(255), -- Optional custom title like "Budget Battle"
    description TEXT, -- Optional custom description
    
    -- Placement control
    show_on_homepage BOOLEAN DEFAULT false,
    homepage_order INTEGER DEFAULT 0, -- Sort order for homepage display
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure unique pairs (prevent duplicate comparisons)
    UNIQUE(phone1_id, phone2_id)
);

-- Indexes for efficient queries
CREATE INDEX idx_featured_comparisons_homepage ON featured_comparisons(show_on_homepage, homepage_order) WHERE is_active = true;
CREATE INDEX idx_featured_comparisons_phone1 ON featured_comparisons(phone1_id) WHERE is_active = true;
CREATE INDEX idx_featured_comparisons_phone2 ON featured_comparisons(phone2_id) WHERE is_active = true;

-- RLS Policies
ALTER TABLE featured_comparisons ENABLE ROW LEVEL SECURITY;

-- Public can read active comparisons
CREATE POLICY "Public can read active comparisons"
ON featured_comparisons FOR SELECT
USING (is_active = true);

-- Service role can do everything
CREATE POLICY "Service role full access on featured_comparisons"
ON featured_comparisons FOR ALL
USING (true)
WITH CHECK (true);

-- =====================================================
-- VIEW: Get comparison pairs with phone details
-- =====================================================
CREATE OR REPLACE VIEW comparison_pairs AS
SELECT 
    fc.id,
    fc.title,
    fc.description,
    fc.show_on_homepage,
    fc.homepage_order,
    fc.is_active,
    fc.created_at,
    -- Phone 1 details
    p1.id as phone1_id,
    p1.name as phone1_name,
    p1.slug as phone1_slug,
    p1.image_url as phone1_image,
    p1.price_range as phone1_price,
    -- Phone 2 details
    p2.id as phone2_id,
    p2.name as phone2_name,
    p2.slug as phone2_slug,
    p2.image_url as phone2_image,
    p2.price_range as phone2_price
FROM featured_comparisons fc
JOIN phones p1 ON fc.phone1_id = p1.id
JOIN phones p2 ON fc.phone2_id = p2.id
WHERE fc.is_active = true
  AND p1.status = 'published'
  AND p2.status = 'published';
