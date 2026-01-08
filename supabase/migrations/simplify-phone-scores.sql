-- =====================================================
-- MIGRATION: Simplify Phone Scores to 5 Metrics
-- 
-- New score fields (0-10 scale):
-- 1. score_design - Design & Materials
-- 2. score_performance - Performance & Hardware (renamed from score_performance)
-- 3. score_camera - Camera (existing)
-- 4. score_connectivity - Connectivity (new)
-- 5. score_battery - Battery (existing)
-- 
-- Removed fields:
-- - score_display (merged into design)
-- - score_value (removed - was subjective)
-- - buy_reasons (now single buy_reason)
-- - skip_reasons (now single skip_reason)
-- - key_differences (removed)
-- - price_comparison (removed)
-- - final_recommendation (removed)
-- - related_links (removed)
-- - verdict (replaced by buy_reason/skip_reason)
-- =====================================================

-- Add new score field
ALTER TABLE phones ADD COLUMN IF NOT EXISTS score_design INTEGER CHECK (score_design >= 0 AND score_design <= 10);
ALTER TABLE phones ADD COLUMN IF NOT EXISTS score_connectivity INTEGER CHECK (score_connectivity >= 0 AND score_connectivity <= 10);

-- Add simplified buy/skip reasons (single text each instead of arrays)
ALTER TABLE phones ADD COLUMN IF NOT EXISTS buy_reason TEXT;
ALTER TABLE phones ADD COLUMN IF NOT EXISTS skip_reason TEXT;

-- Migrate existing data: take first buy_reason/skip_reason if arrays exist
UPDATE phones 
SET buy_reason = buy_reasons[1]
WHERE buy_reasons IS NOT NULL AND array_length(buy_reasons, 1) > 0 AND buy_reason IS NULL;

UPDATE phones 
SET skip_reason = skip_reasons[1]
WHERE skip_reasons IS NOT NULL AND array_length(skip_reasons, 1) > 0 AND skip_reason IS NULL;

-- Migrate score_display to score_design (use display score as design baseline)
UPDATE phones 
SET score_design = score_display
WHERE score_display IS NOT NULL AND score_design IS NULL;

-- Set default connectivity score based on category
UPDATE phones 
SET score_connectivity = 8
WHERE score_connectivity IS NULL AND category IN ('flagship', 'premium');

UPDATE phones 
SET score_connectivity = 7
WHERE score_connectivity IS NULL AND category = 'mid-range';

UPDATE phones 
SET score_connectivity = 6
WHERE score_connectivity IS NULL AND category = 'budget';

-- Comment on new structure
COMMENT ON COLUMN phones.score_design IS 'Design & Materials score (0-10)';
COMMENT ON COLUMN phones.score_performance IS 'Performance & Hardware score (0-10)';
COMMENT ON COLUMN phones.score_camera IS 'Camera score (0-10)';
COMMENT ON COLUMN phones.score_connectivity IS 'Connectivity score (0-10)';
COMMENT ON COLUMN phones.score_battery IS 'Battery score (0-10)';
COMMENT ON COLUMN phones.buy_reason IS 'Single sentence: Yes, if you want...';
COMMENT ON COLUMN phones.skip_reason IS 'Single sentence: No, if you want...';

-- =====================================================
-- NOTE: Old columns are kept for backward compatibility
-- but should be ignored in new code:
-- - score_display, score_value (use new 5 scores)
-- - buy_reasons, skip_reasons (use buy_reason, skip_reason)
-- - key_differences, price_comparison, final_recommendation
-- - related_links, verdict
-- 
-- These can be dropped in a future migration once confirmed
-- all data has been migrated.
-- =====================================================
