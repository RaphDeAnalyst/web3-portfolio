# matthewraphael.xyz

> Portfolio and investigation platform for Matthew Raphael Nnamani, Blockchain Intelligence Practitioner — publicly showcasing on-chain investigations, research, and analytics, with a client intake form and a private admin dashboard for content management.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)

**Live site:** [matthewraphael.xyz](https://matthewraphael.xyz)

---

## Overview

Personal portfolio and investigation platform. The public site showcases on-chain intelligence work across three content types — investigations, research, and analytics dashboards. A `/services` page with a live Resend-powered intake form handles client inquiries. All content is managed through a protected admin dashboard backed by Supabase.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, React Server Components) |
| Language | TypeScript 5 (strict mode) |
| Database & Auth | Supabase (PostgreSQL + Row Level Security) |
| Styling | Tailwind CSS 3.3 + CSS custom properties |
| Theming | next-themes (dark/light mode) |
| Charts | Recharts (bar, line, area, pie via DuneChart wrapper) |
| Email | Resend |
| Icons | Lucide React |
| Testing | Vitest |
| Monitoring | Vercel Analytics + Speed Insights |
| Deployment | Vercel (auto-deploy on push to `main`) |

---

## Routes

| Route | Description |
|---|---|
| `/` | Homepage — hero, featured work, CTAs |
| `/work` | Investigation and research ledger |
| `/work/[id]` | Individual investigation, research, or analytics project |
| `/about` | Bio, methods, and methodology link |
| `/methodology` | Four-phase on-chain investigation methodology |
| `/services` | Service tiers and client intake form |
| `/dashboards` | Embedded Dune Analytics dashboards |
| `/admin` | Protected admin dashboard (content management) |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/            # Login / register
│   ├── admin/             # Protected admin dashboard and sub-routes
│   ├── api/
│   │   ├── admin/         # Admin API routes
│   │   ├── dune/          # Dune Analytics proxy / cache routes
│   │   └── inquiry/       # POST — intake form, routed via Resend
│   ├── work/
│   │   └── [id]/          # Individual project / investigation pages
│   ├── about/
│   ├── dashboards/
│   ├── methodology/
│   └── services/
│
├── components/
│   ├── admin/             # Admin UI components
│   ├── analytics/         # Analytics wrappers
│   ├── blog/              # Blog embeds and renderers
│   ├── dune/              # DuneChart — Recharts wrapper for chart types
│   ├── error/             # Error boundary components
│   ├── layout/            # Navbar, Footer
│   ├── performance/       # Performance monitoring components
│   ├── pwa/               # PWA manifest and install prompt
│   ├── sections/          # Page-level client components
│   ├── seo/               # Metadata, Open Graph, structured data
│   └── ui/                # Base UI components (MarkdownRenderer, etc.)
│
├── lib/
│   ├── supabase.ts        # Supabase client singleton
│   ├── auth.ts            # Auth utilities
│   ├── logger.ts          # Logger
│   ├── actions/           # Next.js server actions
│   ├── utils/             # Helper functions
│   └── *-service.ts       # Service layer (blog, projects, media, dashboard)
│
└── types/                 # Shared TypeScript interfaces

database/
└── migrations/            # SQL migration files — apply in order (001–008)

.github/
└── workflows/
    ├── supabase-keep-alive.yml   # Daily cron — prevents Supabase free-tier sleep
    └── dune-refresh.yml          # Dune Analytics data refresh workflow
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9
- Supabase project (free tier works)
- Resend account with a verified sending domain (for the `/services` intake form)

### Installation

```bash
git clone https://github.com/RaphDeAnalyst/web3-portfolio.git
cd web3-portfolio
npm install
```

### Environment Variables

Create `.env.local` in the project root:

```bash
# Supabase — required
# https://app.supabase.com/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Resend — required for /services intake form
# https://resend.com/api-keys
RESEND_API_KEY=your_resend_api_key

# YouTube — optional, enables video metadata fetching
# https://console.cloud.google.com/apis/credentials
YOUTUBE_API_KEY=your_youtube_api_key

# Production only — set in Vercel dashboard
NEXT_PUBLIC_SITE_URL=https://matthewraphael.xyz
```

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `RESEND_API_KEY` | Yes | Routes intake form emails |
| `YOUTUBE_API_KEY` | Optional | Fetches video metadata for embeds |
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical URL for SEO metadata |

### Database Setup

Run migrations in order using Supabase Studio or the Supabase CLI:

```bash
supabase db push
```

Migration files are in `database/migrations/` (001 through 008).

### Start the Dev Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## Development Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server on `localhost:3000` |
| `npm run build` | Production build |
| `npm run start` | Serve production build (requires `build` first) |
| `npm run lint` | ESLint |
| `npm run test` | Vitest unit tests |
| `npm run test:ui` | Vitest interactive UI |
| `npm run test:coverage` | Coverage report |
| `npm run analyze` | Webpack bundle visualizer (`ANALYZE=true next build`) |
| `npm run keep-alive` | Manually ping Supabase (also runs via GitHub Actions daily) |
| `npm run supabase:ping` | Alias for `keep-alive` |

---

## Deployment

Auto-deploys to Vercel on every push to `main`. Production environment variables are managed in the Vercel dashboard — do not commit `.env.local`.

| Environment | Branch | Domain |
|---|---|---|
| Production | `main` | matthewraphael.xyz |
| Preview | Feature branches | `*.vercel.app` |
| Development | Local | localhost:3000 |

**GitHub Actions:**
- `supabase-keep-alive.yml` — runs daily at 06:00 UTC, pings Supabase to keep the free-tier project awake
- `dune-refresh.yml` — refreshes cached Dune Analytics data

---

## Performance

- **Incremental Static Regeneration (ISR):** Blog posts revalidate every 5 minutes
- **Next.js Image component:** Responsive sizing, WebP/AVIF, lazy loading
- **Route-based code splitting:** Automatic chunk separation per page
- **Vendor chunking:** `node_modules` separated from application code
- **Bundle analyzer:** `npm run analyze` to visualize chunk composition

---

## Security

- **Row Level Security (RLS):** Enforced at the Supabase/PostgreSQL layer — admin-only tables cannot be read or written by anonymous keys
- **Supabase Auth:** Session management with JWT via `jose`; protected routes verify the session server-side before rendering
- **Environment variable isolation:** No secrets exposed to the client bundle — `RESEND_API_KEY` and Supabase service keys are server-only

---

## License

Private. All rights reserved.

© 2026 Matthew Raphael Nnamani. Unauthorized copying or distribution is prohibited.

---

## Contact

**Matthew Raphael Nnamani** — Blockchain Intelligence Practitioner

| | |
|---|---|
| Website | [matthewraphael.xyz](https://matthewraphael.xyz) |
| GitHub | [@notes0x](https://github.com/notes0x) |
| X | [@0x_note](https://x.com/0x_note) |
| Dune | [notes0x](https://dune.com/notes0x) |
| LinkedIn | [matthew-nnamani](https://linkedin.com/in/matthew-nnamani) |
| Email | matthewraphael@matthewraphael.xyz |
