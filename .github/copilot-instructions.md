# Copilot Instructions for Best Mobile UAE

## Project Overview
UAE-focused mobile phone comparison website built with **Next.js 16** (App Router), **Supabase** (PostgreSQL + Auth), **Tailwind CSS v4**, and **shadcn/ui** (new-york style, JavaScript). Uses **Biome** for linting/formatting instead of ESLint/Prettier. React Compiler enabled in production.

## Tech Stack & Key Dependencies
- **Framework**: Next.js 16 (App Router, React 19, React Compiler)
- **Database**: Supabase (PostgreSQL + Auth + Storage + RLS)
- **Styling**: Tailwind CSS v4, shadcn/ui (new-york), lucide-react icons
- **Linting**: Biome (replaces ESLint + Prettier)
- **Content**: Markdown rendering with react-markdown + remark-gfm

## Architecture

### Directory Structure
- `app/` - Next.js App Router pages (Server Components by default)
  - `app/admin/` - Protected admin dashboard (requires Supabase auth)
  - `app/api/` - API routes for phones, articles, price alerts, search
  - `app/phones/[slug]/` - Dynamic phone detail pages with metadata
- `components/` - Component library organized by purpose:
  - `components/admin/` - Admin-only components with barrel exports via `index.js`
  - `components/features/` - Domain components by feature (home, phones, compare, blogs)
  - `components/common/` - Shared layout components (Header, Footer, PublicLayout)
  - `components/ui/` - shadcn/ui primitives (Button, Input, Sheet)
- `lib/` - Business logic and utilities:
  - `lib/data/` - Supabase data fetching with **snake_case → camelCase transformation**
  - `lib/supabase/` - Supabase client factories (server, client, admin)
  - `lib/admin/` - Admin-specific utilities (form helpers, slug generation)
- `supabase/` - Database schema and migrations
  - `supabase/schema.sql` - Main database schema
  - `supabase/migrations/` - SQL migrations (scores, RLS, storage)

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

See [components/features/phones/PhoneDetailPage.jsx](components/features/phones/PhoneDetailPage.jsx) for implementation.

### Data Flow Pattern (Critical)
1. **Server Components** (pages, layouts) fetch data via `lib/data/*.js` using `await createClient()` from server
2. **Data transformation** happens in `lib/data/phones.js`:
   - DB returns snake_case (e.g., `overall_score_rating`, `phone_store_prices`)
   - Transforms to camelCase for frontend (e.g., `overallScore.rating`, `storePrices`)
   - Calculates dynamic fields (lowest price from store prices)
3. **Client Components** (forms, interactive UI) use `createClient()` from client (no await)
4. **Admin mutations** use `createAdminClient()` (service role key, bypasses RLS)
5. **API routes** handle external operations (price alerts, scraping) using admin client

Example transformation in `lib/data/phones.js`:
```js
// DB schema (snake_case)
{ overall_score_rating: 9.2, phone_store_prices: [...] }

// Frontend format (camelCase)
{ overallScore: { rating: 9.2 }, storePrices: [...] }
```

## Conventions

### Next.js 15+ Async Params Pattern
Dynamic routes must await params and searchParams:
```jsx
// CORRECT - await params
export default async function PhonePage({ params }) {
  const { slug } = await params;
  const phone = await getPhoneBySlug(slug);
}

// CORRECT - await searchParams
export default async function AlertPage({ searchParams }) {
  const params = await searchParams;
  const success = params.success;
}
```

### Component Patterns
```jsx
// Client components: prefix with "use client"
"use client";
export default function PhoneFormClient({ user, brands, phone }) { ... }

// Server components: async, fetch data directly
export default async function PhoneDetail({ params }) {
  const { slug } = await params;
  const phone = await getPhoneBySlug(slug);
  return <PhoneDetailPage phone={phone} />;
}
```

### Import Aliases & Barrel Exports
Use `@/` for absolute imports from root (configured in `jsconfig.json`):
```jsx
import { createClient } from "@/lib/supabase/server";
import { AdminLayoutWrapper, SectionCard } from "@/components/admin";
import { PhoneCard } from "@/components/features/phones";
```

Barrel exports via `index.js` files maintain clean imports - see:
- `components/admin/index.js` - Admin components + form helpers
- `components/features/index.js` - Feature components by domain
- `components/common/header/index.js`, `footer/index.js` - Layout subcomponents

### Admin Form Pattern
- **NO auto-save** - Explicit Save Draft / Publish buttons at top
- Collapsible `SectionCard` components for organization
- Form state managed with `useState`, no complex form libraries
- See [app/admin/phones/PhoneFormClientNew.jsx](app/admin/phones/PhoneFormClientNew.jsx) for reference

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

### Styling Utilities
Use `cn()` helper for conditional classes (Tailwind + clsx):
```jsx
import { cn } from "@/lib/utils";
<div className={cn("base-class", isActive && "active-class")} />
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

### When to Use Admin Client
Use `createAdminClient()` (service role) for:
- API routes that need to bypass RLS (e.g., price alerts, notifications)
- Operations on behalf of users without session context
- Background jobs and cron tasks
- NEVER expose service role key to client-side code

Examples in codebase:
- [app/api/price-alert/route.js](app/api/price-alert/route.js) - Price alert subscriptions
- [app/api/price-alert/notify/route.js](app/api/price-alert/notify/route.js) - Email notifications

### Content Status
Phones/articles use `status` field: `'draft'`, `'preview'`, `'published'`
- Public pages query `status = 'published'`
- Preview mode adds `?preview=true` to include `'preview'` status

## Database Schema (Core Tables)
- **brands** - Phone manufacturers
- **phones** - Main product catalog with scores, specs, pricing
- **phone_store_prices** - Multi-store pricing (for calculating lowest price)
- **articles** - Blog posts and reviews
- **comparisons** - Curated phone comparisons (featured on detail pages)
- **price_alerts** - User email subscriptions for price drops
- **site_settings** - JSON configuration storage

See [supabase/schema.sql](supabase/schema.sql) for full schema and RLS policies.

## Environment Setup
Required `.env.local` variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Server-only, never expose!
```

Setup guide: [ADMIN_SETUP.md](ADMIN_SETUP.md)

## Key Files Reference
- [lib/data/phones.js](lib/data/phones.js) - Phone data fetching and transformation
- [components/features/phones/PhoneDetailPage.jsx](components/features/phones/PhoneDetailPage.jsx) - MVP phone page structure
- [app/admin/phones/PhoneFormClientNew.jsx](app/admin/phones/PhoneFormClientNew.jsx) - Simplified admin form
- [supabase/migrations/simplify-phone-scores.sql](supabase/migrations/simplify-phone-scores.sql) - Score migration
