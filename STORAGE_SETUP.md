# Supabase Storage Setup for Phone Images

This guide explains how to set up Supabase Storage for phone image uploads and store logos.

## Storage Buckets Required

| Bucket Name | Purpose | Public |
|-------------|---------|--------|
| `phone-images` | Phone product images | Yes |
| `store-logos` | Store logos (Noon, Amazon, etc.) | Yes |

---

## Step 1: Create the Storage Buckets

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Storage** in the left sidebar

### Bucket 1: phone-images
4. Click **"New bucket"**
5. Configure:
   - **Name**: `phone-images`
   - **Public bucket**: ✅ **Enable**
   - **File size limit**: 5MB (optional)
6. Click **"Create bucket"**

### Bucket 2: store-logos
7. Click **"New bucket"** again
8. Configure:
   - **Name**: `store-logos`
   - **Public bucket**: ✅ **Enable**
   - **File size limit**: 2MB (optional)
9. Click **"Create bucket"**

## Step 2: Configure Storage Policies (RLS)

After creating both buckets, set up Row Level Security policies for each:

### Option A: Via Supabase Dashboard (Recommended)

1. Go to **Storage** → **Policies**
2. Click on the `phone-images` bucket
3. Add the following policies:

#### Policy 1: Allow authenticated uploads
- **Name**: `Allow authenticated uploads`
- **Allowed operation**: `INSERT`
- **Target roles**: `authenticated`
- **WITH CHECK expression**: `true`

#### Policy 2: Allow authenticated updates
- **Name**: `Allow authenticated updates`
- **Allowed operation**: `UPDATE`
- **Target roles**: `authenticated`
- **USING expression**: `true`

#### Policy 3: Allow authenticated deletes
- **Name**: `Allow authenticated deletes`
- **Allowed operation**: `DELETE`
- **Target roles**: `authenticated`
- **USING expression**: `true`

#### Policy 4: Allow public read access
- **Name**: `Allow public read access`
- **Allowed operation**: `SELECT`
- **Target roles**: `public`
- **USING expression**: `true`

### Option B: Via SQL Editor

Run the SQL migration file in your Supabase SQL Editor:

```sql
-- See: supabase/migrations/add-storage-bucket.sql
```

## Step 3: Verify Setup

1. Go to the admin panel and edit a phone
2. In the "Basic Info" section, you should see the image upload area
3. Try uploading an image:
   - Click or drag-drop an image file
   - Wait for upload to complete
   - The image preview should appear

## Troubleshooting

### "new row violates row-level security policy"
- Make sure you're logged in as an admin
- Check that the storage policies are correctly configured

### "Bucket not found"
- Ensure the bucket name is exactly `phone-images`
- Verify the bucket was created successfully

### Image not displaying
- Check if the bucket is set to **public**
- Verify the image URL is correct in the database

### Upload fails with size error
- Our frontend limits files to 5MB
- If you need larger files, update `ImageUpload.jsx` and bucket settings

## Image URL Format

After upload, images are stored with URLs like:
```
https://[your-project-ref].supabase.co/storage/v1/object/public/phone-images/[timestamp]-[random].jpg
```

This URL is automatically saved to the `image_url` field in the phones table.

## Folder Organization (Optional)

You can organize images into folders by modifying the `folder` prop in `BasicInfoSection.jsx`:

```jsx
<ImageUpload 
  label="Phone Image" 
  value={formData.image_url} 
  onChange={(v) => updateField("image_url", v)}
  bucket="phone-images"
  folder="phones"  // Images will be stored in phone-images/phones/
/>
```
