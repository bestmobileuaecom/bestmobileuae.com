# Best Mobile UAE - Admin Setup Guide

## Quick Start

### 1. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Project Settings > API** and copy:
   - Project URL
   - Anon/Public key
   - Service Role key

3. Create `.env.local` file (copy from `.env.local.example`):
```bash
cp .env.local.example .env.local
```

4. Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Set Up Database

1. Go to Supabase Dashboard > **SQL Editor**
2. Copy the contents of `supabase/schema.sql`
3. Paste and run in the SQL Editor
4. This creates all tables, indexes, and RLS policies

### 3. Create Admin User

1. Go to Supabase Dashboard > **Authentication > Users**
2. Click **Add User** > **Create New User**
3. Enter your email and password
4. ✅ Check "Auto Confirm User"
5. Click **Create User**

### 4. Run the App

```bash
npm run dev
```

Visit:
- Frontend: http://localhost:3000
- Admin: http://localhost:3000/admin

---

## Admin Features

### Dashboard (`/admin`)
- Overview of phones and articles
- Quick stats (total/published counts)
- Quick action buttons

### Phones Management (`/admin/phones`)
- List all phones with filters (status, brand)
- Add new phones with full details
- Edit existing phones
- **Preview** before publishing
- **Publish** to make visible on frontend
- **Unpublish** to hide from frontend

### Articles Management (`/admin/articles`)
- List all articles with filters
- Add/edit articles with rich content
- Categories: Review, News, Guide, Comparison
- Preview and publish workflow

### Settings (`/admin/settings`)
- Manage phone brands
- Site settings (JSON configuration)

---

## Preview/Publish System

### Status Types
1. **Draft** - Only visible in admin
2. **Preview** - Visible at `/phones/[slug]?preview=true`
3. **Published** - Visible to all users

### How to Use
1. Create/edit a phone or article
2. Click **"Save as Preview"** to test how it looks
3. Visit the preview URL to check
4. When ready, click **"Publish"**

### Preview URLs
- Phone: `http://localhost:3000/phones/samsung-galaxy-a35-5g?preview=true`
- Article: `http://localhost:3000/blogs/my-article?preview=true`

---

## Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `brands` | Phone brands (Samsung, Apple, etc.) |
| `phones` | Main phone data with all specs |
| `phone_store_prices` | Where to buy (Noon, Amazon, etc.) |
| `articles` | Blog posts, reviews, guides |
| `site_settings` | Global settings (JSON) |
| `pages` | Static pages (About, How to Use) |
| `comparisons` | Saved phone comparisons |

### Row Level Security (RLS)
- **Public users**: Can only see `published` content
- **Authenticated users**: Full access to all content

---

## File Structure

```
app/
├── admin/
│   ├── layout.js          # Admin layout
│   ├── page.js             # Dashboard
│   ├── AdminDashboard.jsx  # Dashboard UI
│   ├── login/
│   │   └── page.js         # Login page
│   ├── phones/
│   │   ├── page.js         # Phones list
│   │   ├── PhonesListClient.jsx
│   │   ├── PhoneFormClient.jsx
│   │   ├── new/
│   │   │   └── page.js     # Add phone
│   │   └── [id]/
│   │       └── page.js     # Edit phone
│   ├── articles/
│   │   ├── page.js         # Articles list
│   │   ├── ArticlesListClient.jsx
│   │   ├── ArticleFormClient.jsx
│   │   ├── new/
│   │   │   └── page.js     # Add article
│   │   └── [id]/
│   │       └── page.js     # Edit article
│   └── settings/
│       ├── page.js         # Settings
│       └── SettingsClient.jsx
├── api/
│   ├── phones/
│   │   └── route.js        # Phones API
│   └── articles/
│       └── route.js        # Articles API
lib/
├── supabase/
│   ├── client.js           # Browser client
│   ├── server.js           # Server client
│   └── middleware.js       # Auth middleware
├── data/
│   ├── phones.js           # Phone data fetching
│   ├── articles.js         # Article data fetching
│   └── index.js
components/
└── admin/
    ├── AdminSidebar.jsx
    ├── AdminLayoutWrapper.jsx
    └── index.js
supabase/
└── schema.sql              # Database schema
middleware.js               # Next.js middleware (protects /admin)
.env.local.example          # Environment template
```

---

## Troubleshooting

### "Invalid login credentials"
- Check email/password in Supabase Auth > Users
- Make sure user is confirmed

### "Permission denied" errors
- Run the RLS policies from schema.sql
- Check if user is authenticated

### Data not showing on frontend
- Make sure content is set to "published" status
- Check browser console for errors

### Supabase not configured
- The app falls back to static data in `/lib/phones-data.js` and `/lib/blogs-data.js`
- This is useful for development without Supabase

---

## Production Deployment

1. Deploy to Vercel/Netlify
2. Set environment variables in deployment settings
3. Run schema.sql in production Supabase project
4. Create admin user in production

---

## Security Notes

- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client
- The anon key is safe to expose (used for public reads)
- All admin routes are protected by middleware
- RLS policies ensure users only see published content
