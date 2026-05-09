# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Web3 Portfolio** is a production-grade full-stack portfolio platform built with Next.js 14, TypeScript, and Supabase. It features a public-facing portfolio and blog system alongside a comprehensive admin dashboard for content management.

**Target User:** Matthew Raphael Nnamani (Blockchain Intelligence Practitioner)  
**Primary URL:** [matthewraphael.xyz](https://matthewraphael.xyz)  
**Deployment:** Vercel (connected to this repository)

## Development Commands

```bash
# Development
npm run dev                  # Start dev server (localhost:3000)

# Building & Production
npm run build               # Build for production
npm run start               # Run production server (requires build first)
npm run analyze             # Analyze bundle size (ANALYZE=true next build)

# Code Quality
npm run lint                # Run ESLint checks

# Testing
npm run test                # Run unit tests (Vitest)
npm run test:ui             # Run tests with interactive UI
npm run test:coverage       # Generate coverage report

# Maintenance
npm run keep-alive          # Ping Supabase to prevent free-tier sleep
npm run supabase:ping       # Alias for keep-alive
```

## Architecture

### Tech Stack
- **Framework:** Next.js 14 (App Router with React Server Components)
- **Language:** TypeScript 5 (strict mode)
- **Database & Auth:** Supabase (PostgreSQL + Auth)
- **Styling:** Tailwind CSS 3.3 with Lucide icons
- **Testing:** Vitest (unit tests with jsdom)
- **Monitoring:** Vercel Analytics & Speed Insights
- **Deployment:** Vercel (auto-deploy on push to `main`)

### Directory Structure
```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth pages (login, register)
│   ├── admin/               # Protected admin dashboard
│   ├── api/                 # API routes (edge functions)
│   ├── blog/                # Blog post pages (SSG with ISR)
│   ├── work/                # Portfolio/project showcase
│   ├── about/               # About page
│   └── contact/             # Contact form
├── components/
│   ├── admin/               # Admin-specific components
│   ├── blog/                # Blog components (embeds, renderers)
│   ├── layout/              # Navbar, Footer, Sidebar
│   ├── sections/            # Homepage sections
│   ├── ui/                  # Base UI components
│   ├── seo/                 # Meta tags, structured data
│   └── pwa/                 # PWA manifest, service worker
├── lib/
│   ├── supabase.ts          # Supabase client singleton
│   ├── auth.ts              # Auth utilities (getUser, getSession)
│   ├── actions/             # Server actions
│   ├── utils/               # Helper functions
│   └── *-service.ts         # Business logic (blog, dashboard, media)
├── types/                   # Shared TypeScript interfaces
├── data/                    # Static data exports
└── hooks/                   # React hooks
```

### Key Design Patterns

**Server Components First:** Pages and layouts use Server Components by default; only leaf components are `'use client'` when needed for interactivity.

**Service Layer:** Business logic is isolated in `*-service.ts` files (e.g., `blog-service.ts`, `dashboard-service-supabase.ts`). These abstract Supabase queries and transformations, keeping components focused on UI.

**Authentication Middleware:** Protected routes check `getUser()` in server components or use middleware for API routes. Admin routes require authentication + role checks.

**Content Caching:** Blog posts use ISR (revalidation every 5 minutes). Database queries in services are cached via `unstable_cache` where appropriate.

**Database Queries:** Use the Supabase client from `lib/supabase.ts` with proper type inference from the database schema.

## Important Notes

### Known Technical Debt
See `claude.md` in the repo root for a detailed cleanup audit. High-priority items:
- Replace `any` types (481+ ESLint errors) with proper interfaces
- Remove unused packages: `autoprefixer`, `critters`, `postcss` (1.4MB reduction)
- Remove console statements and browser alerts from production code
- Extract complex transformations from components into service layer

### Environment Variables
Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `YOUTUBE_API_KEY` - (optional) for video metadata fetching

Vercel dashboard manages production env vars automatically.

### Database Schema
Migrations in `database/migrations/`. Key tables:
- `profiles` - User profiles (Supabase Auth extension)
- `posts` - Blog posts with markdown content
- `projects` - Portfolio projects
- `dashboards` - Dune Analytics embeds
- `media` - Media library with metadata

Row-level security (RLS) enforces admin-only access to sensitive tables.

### Testing Strategy
- Unit tests for utilities and server actions use Vitest + jsdom
- Component tests use React Test Library (minimal)
- E2E tests are not yet implemented

### SEO & PWA
- Metadata handled via `generateMetadata()` in layout files (Next.js best practice)
- Open Graph and Twitter cards for blog posts
- PWA manifest and service worker for offline support

### Performance
- Images: remote CDN with responsive sizing via Next.js Image component
- CSS: Tailwind with unused class purging
- Bundling: Webpack optimization enabled in `next.config.js`
- Bundle analyzer: `npm run analyze` to visualize chunks

## Code Style & Conventions

**Naming:** PascalCase for components/types, camelCase for functions/variables, UPPER_SNAKE_CASE for constants.

**Imports:** Use absolute imports with `@/` alias (configured in `tsconfig.json`). Prefer specific imports over wildcard imports.

**Type Safety:** Avoid `any` types. Use proper interfaces, discriminated unions for variant data, and `satisfies` for const assertions.

**Async/Await:** Prefer async/await over `.then()` chains. Use `try/catch` in server actions.

**Components:** Functional components with TypeScript interfaces for props. Keep components focused on presentation; move logic to server actions or services.

**Comments:** Add JSDoc for public APIs and functions. Inline comments only when the **why** is non-obvious (hidden constraints, workarounds for specific bugs).

## Common Tasks

**Adding a Blog Post**  
1. Create markdown file in `src/app/blog/[slug]/page.tsx` or add to database via admin dashboard
2. Add frontmatter metadata (title, date, excerpt, featured_image)
3. Use `<MarkdownRenderer>` component to render content
4. Embedded Dune dashboards and YouTube videos are handled by special embed components

**Creating an Admin Page**  
1. Create route under `src/app/admin/[feature]`
2. Wrap with `<ProtectedRoute>` or check `getUser()` in server component
3. Use form components from `src/components/admin/`
4. Call service layer functions for data mutations
5. Handle errors with toast notifications (Sonner)

**Adding an API Route**  
1. Create file under `src/app/api/[route]/route.ts`
2. Export `GET`, `POST`, etc. handlers
3. Verify auth token in request (JWT from Supabase)
4. Return JSON with proper status codes
5. API routes run on Vercel as Edge Functions

**Updating the Database Schema**  
1. Create `.sql` migration file in `database/migrations/`
2. Include up/down migrations for reversibility
3. Test locally in Supabase Studio
4. Run migration in production after merging to `main`
5. Update TypeScript types in `src/types/` to match schema changes

## Debugging & Logs

- **Supabase errors:** Check RLS policies and auth state in Supabase Studio
- **Build errors:** Run `npm run build` locally to reproduce
- **Type errors:** Use `tsc --noEmit` for full type checking
- **Logging:** Use `logger.error()` from `src/lib/logger.ts` (not `console.log`)

## Vercel & Deployment

Deployment happens automatically on push to `main`. Check:
- Vercel dashboard for build logs and preview URLs
- Environment variables are synced (use `npm run env:pull` if needed)
- Speed Insights dashboard at vercel.com for real-world performance

Keep-alive script runs via GitHub Actions daily to prevent Supabase free-tier sleep.
