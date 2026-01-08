# Copilot Instructions for Best Mobile UAE

## Project Overview
UAE-focused mobile phone comparison website built with **Next.js 16** (App Router), **Supabase** (PostgreSQL + Auth), **Tailwind CSS v4**, and **shadcn/ui** (new-york style, JavaScript). Uses **Biome** for linting/formatting instead of ESLint.

## Architecture

### Directory Structure
- `app/` - Next.js App Router pages (Server Components by default)
- `app/admin/` - Protected admin dashboard (requires Supabase auth)
- `app/api/` - API routes for phones, articles, price alerts, search
- `components/admin/` - Admin-only components with barrel exports via `index.js`
- `components/features/` - Domain-specific components grouped by feature (home, phones, compare, blogs)
- `components/common/` - Shared layout components (Header, Footer, PublicLayout)
- `components/ui/` - shadcn/ui primitives (Button, Input, Sheet)
- `lib/data/` - Supabase data fetching functions with transformation logic
- `lib/supabase/` - Client/server Supabase instances
- `supabase/` - Database schema and migrations

### Phone Detail Page Structure (MVP)
Simplified structure following "one strong opinion per section" principle:
1. **Header** - Image, price, score, CTA buttons
2. **Should You Buy?** - 2 bullets only (Yes if... / No if...)
3. **Where to Buy** - Affiliate links (💰 money section)
4. **Price Alert** - Email subscription for price drops
5. **Verdict Scores** - 5 metrics: Design, Performance, Camera, Connectivity, Battery
6. **Similar Phones** - Auto-linked alternatives
7. **Specifications** - Collapsed by default (SEO content)
8. **FAQs** - Template-based, reuse across similar phones

### Data Flow Pattern
1. **Server Components** fetch data via `lib/data/*.js` functions using server Supabase client
2. Data is **transformed** from snake_case DB schema to camelCase frontend format in `lib/data/phones.js`
3. **Client Components** (marked `"use client"`) use browser Supabase client for mutations
4. Admin operations use `createAdminClient()` (service role, bypasses RLS)

## Conventions

### Component Patterns
```jsx
// Client components: prefix with "use client"
"use client";
export default function PhoneFormClient({ user, brands, phone }) { ... }

// Server components: async, fetch data directly
export default async function PhoneDetail({ params }) {
  const phone = await getPhoneBySlug(slug);
  return <PhoneDetailPage phone={phone} />;
}
```

### Admin Form Pattern
- **NO auto-save** - Explicit Save Draft / Publish buttons at top
- Collapsible `SectionCard` components for organization
- Form state managed with `useState`, no complex form libraries

### Scoring System (5 metrics, 0-10 scale)
```jsx
scores: {
  design: 9.2,       // Design & Materials
  performance: 8.3,  // Performance & Hardware
  camera: 8.3,       // Camera
  connectivity: 9.2, // Connectivity
  battery: 6.0,      // Battery
}
```

### Barrel Exports
Use `index.js` files for clean imports:
```jsx
import { AdminLayoutWrapper, SectionCard, InputField } from "@/components/admin";
```

## Commands
```bash
npm run dev      # Start development server
npm run build    # Production build
npm run lint     # Biome check (replaces ESLint)
npm run format   # Biome format --write
```

## Supabase Patterns

### Client Usage
```jsx
// Server-side (Server Components, API routes)
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();

// Client-side (Client Components)
import { createClient } from "@/lib/supabase/client";
const supabase = createClient(); // No await

// Admin operations (bypasses RLS)
import { createAdminClient } from "@/lib/supabase/server";
const supabase = createAdminClient();
```

### Content Status
Phones/articles use `status` field: `'draft'`, `'preview'`, `'published'`
- Public pages query `status = 'published'`
- Preview mode adds `?preview=true` to include `'preview'` status

## Key Files Reference
- [lib/data/phones.js](lib/data/phones.js) - Phone data fetching and transformation
- [components/features/phones/PhoneDetailPage.jsx](components/features/phones/PhoneDetailPage.jsx) - MVP phone page structure
- [app/admin/phones/PhoneFormClientNew.jsx](app/admin/phones/PhoneFormClientNew.jsx) - Simplified admin form
- [supabase/migrations/simplify-phone-scores.sql](supabase/migrations/simplify-phone-scores.sql) - Score migration
