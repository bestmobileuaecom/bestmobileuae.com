-- =====================================================
-- MIGRATION: Allow decimal values for scores and prices
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Change verdict scores from INTEGER to DECIMAL (allows 6.9, 7.5, etc.)
ALTER TABLE phones 
  ALTER COLUMN score_design TYPE DECIMAL(3,1),
  ALTER COLUMN score_performance TYPE DECIMAL(3,1),
  ALTER COLUMN score_camera TYPE DECIMAL(3,1),
  ALTER COLUMN score_connectivity TYPE DECIMAL(3,1),
  ALTER COLUMN score_battery TYPE DECIMAL(3,1);

-- 2. Update constraints to allow decimals (drop old integer constraints, add new ones)
ALTER TABLE phones 
  DROP CONSTRAINT IF EXISTS phones_score_camera_check,
  DROP CONSTRAINT IF EXISTS phones_score_battery_check,
  DROP CONSTRAINT IF EXISTS phones_score_performance_check,
  DROP CONSTRAINT IF EXISTS phones_score_design_check,
  DROP CONSTRAINT IF EXISTS phones_score_connectivity_check;

ALTER TABLE phones 
  ADD CONSTRAINT phones_score_design_check CHECK (score_design >= 0 AND score_design <= 10),
  ADD CONSTRAINT phones_score_performance_check CHECK (score_performance >= 0 AND score_performance <= 10),
  ADD CONSTRAINT phones_score_camera_check CHECK (score_camera >= 0 AND score_camera <= 10),
  ADD CONSTRAINT phones_score_connectivity_check CHECK (score_connectivity >= 0 AND score_connectivity <= 10),
  ADD CONSTRAINT phones_score_battery_check CHECK (score_battery >= 0 AND score_battery <= 10);

-- 3. Change price columns to DECIMAL for fils support (899.95 AED)
ALTER TABLE phones 
  ALTER COLUMN price TYPE DECIMAL(10,2);

ALTER TABLE phone_store_prices 
  ALTER COLUMN price_value TYPE DECIMAL(10,2);

-- Done! Now you can save:
-- - Scores like 6.9, 7.5, 8.2
-- - Prices like 899.95, 1199.50
