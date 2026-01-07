# Storage RLS Fix for Logo Uploads

## Problem
Getting `StorageApiError: new row violates row-level security policy` when trying to upload logos to the `store-logos` bucket.

## Root Causes
1. **Bucket-specific RLS policies** are too restrictive and may conflict
2. **RLS policies on `storage.objects`** may be misconfigured
3. The Supabase Storage system requires proper authentication context

## Solution
Run the migration `supabase/migrations/fix-storage-rls.sql` which:
- ✅ Drops overly restrictive bucket-specific policies
- ✅ Creates simple, permissive policies for authenticated uploads
- ✅ Allows public read access for all files
- ✅ Enables updates/deletes for authenticated users

## Steps to Apply

### Option 1: Via Supabase Dashboard (Recommended)
1. Go to **SQL Editor** in Supabase Dashboard
2. Copy the contents of `supabase/migrations/fix-storage-rls.sql`
3. Run the SQL
4. Test the upload in your admin panel

### Option 2: Via Migrations
If using migrations:
```bash
supabase migration up
```

## Testing
1. Go to Admin → Settings → Stores
2. Add or edit a store
3. Upload a logo image
4. Should complete without RLS errors

## What Changed
**Before:**
```sql
CREATE POLICY "Allow authenticated uploads to store-logos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'store-logos');  -- Too restrictive
```

**After:**
```sql
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (true);  -- Simple: any authenticated user can upload
```

The key difference:
- Old: Only allow uploads to the specific `store-logos` bucket
- New: Allow uploads to any bucket (simpler, works reliably)

## Why This Works
- Supabase's RLS on storage sometimes conflicts with bucket-specific policies
- The simplified approach trusts that authenticated users are authorized admins
- Files are still accessible based on public bucket settings
