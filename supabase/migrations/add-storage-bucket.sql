-- Supabase Storage Bucket Setup for Phone Images
-- Run this in Supabase SQL Editor or use Supabase Dashboard

-- Note: Storage buckets are typically created via Supabase Dashboard or API
-- This SQL creates the necessary RLS policies for the bucket

-- First, create the bucket via Supabase Dashboard:
-- 1. Go to Storage in your Supabase Dashboard
-- 2. Click "New bucket"
-- 3. Name it: phone-images
-- 4. Make it PUBLIC (so images can be viewed without authentication)
-- 5. Click "Create bucket"

-- After creating the bucket, run these policies:

-- Allow authenticated users to upload images
CREATE POLICY "Allow authenticated uploads"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'phone-images');

-- Allow authenticated users to update their uploads
CREATE POLICY "Allow authenticated updates"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'phone-images');

-- Allow authenticated users to delete images
CREATE POLICY "Allow authenticated deletes"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'phone-images');

-- Allow public read access (since bucket is public)
CREATE POLICY "Allow public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'phone-images');
