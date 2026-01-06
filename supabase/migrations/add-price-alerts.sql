-- =====================================================
-- PRICE ALERTS - Migration Script
-- Run this in Supabase SQL Editor to add price alert functionality
-- =====================================================

-- 1. Add last_price column to phones table for price drop detection
ALTER TABLE phones ADD COLUMN IF NOT EXISTS last_price INTEGER;

-- 2. Create price_alerts table
CREATE TABLE IF NOT EXISTS price_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_id UUID NOT NULL REFERENCES phones(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_notified_price INTEGER, -- To avoid duplicate notifications
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (phone_id, user_email)
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_price_alerts_phone ON price_alerts(phone_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_email ON price_alerts(user_email);
CREATE INDEX IF NOT EXISTS idx_price_alerts_active ON price_alerts(is_active) WHERE is_active = true;

-- 3. Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_price_alerts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS price_alerts_updated_at ON price_alerts;
CREATE TRIGGER price_alerts_updated_at
    BEFORE UPDATE ON price_alerts
    FOR EACH ROW
    EXECUTE FUNCTION update_price_alerts_updated_at();
