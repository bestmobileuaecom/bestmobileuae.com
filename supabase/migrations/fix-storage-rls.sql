-- =====================================================
-- FIX STORAGE RLS POLICIES (v2)
-- =====================================================
-- The issue: storage.objects table may have conflicting or overly restrictive RLS policies
-- This migration ensures proper RLS configuration for storage operations

-- Drop all existing storage object policies to start fresh
DROP POLICY IF EXISTS "Allow authenticated uploads to store-logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read for store-logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to store-logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes from store-logos" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to phone-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read for phone-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;

-- Re-create policies with proper names
-- Policy 1: Allow authenticated users to upload files
CREATE POLICY "authenticated_uploads_v2"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (true);

-- Policy 2: Allow public read access to all files
CREATE POLICY "public_read_v2"
ON storage.objects FOR SELECT TO public
USING (true);

-- Policy 3: Allow authenticated users to update files
CREATE POLICY "authenticated_updates_v2"
ON storage.objects FOR UPDATE TO authenticated
USING (true);

-- Policy 4: Allow authenticated users to delete files
CREATE POLICY "authenticated_deletes_v2"
ON storage.objects FOR DELETE TO authenticated
USING (true);
