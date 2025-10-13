# Web3 Portfolio

> A production-grade, full-stack portfolio platform built with Next.js 14, TypeScript, and Supabase, featuring a comprehensive admin dashboard, blog system, and advanced SEO optimizations.

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.57-green?logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
- [Development](#development)
  - [Available Scripts](#available-scripts)
  - [Project Structure](#project-structure)
  - [Code Quality](#code-quality)
- [Testing](#testing)
- [Deployment](#deployment)
- [Performance](#performance)
- [Security](#security)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

This project is a **professional Web3-focused portfolio platform** designed to showcase projects, write technical blog posts, and manage content through a comprehensive admin dashboard. Built with modern web technologies and industry best practices, it delivers exceptional performance, security, and user experience.

**Live Demo:** [matthewraphael.xyz](https://matthewraphael.xyz)

### Key Highlights

- **🚀 Performance:** Optimized bundle splitting, lazy loading, and edge caching
- **🔐 Security:** Production-grade CSP headers, authentication, and data protection
- **📱 Progressive Web App:** Installable with offline capabilities
- **🎨 Modern UI:** Responsive design with dark mode support
- **📊 Analytics:** Integrated Vercel Analytics and Speed Insights
- **🔍 SEO:** Comprehensive multi-market SEO targeting (US, UK, EU, Nigeria)

---

## Features

### Public-Facing Features

- **Portfolio Showcase**
  - Project gallery with detailed case studies
  - Technology stack visualization
  - Live demo and GitHub repository links
  - Interactive project filters and categories

- **Technical Blog**
  - Markdown-based content with syntax highlighting
  - Dune Analytics dashboard embeds
  - YouTube video integration
  - Google Drive document viewer
  - Reading time estimation
  - Social sharing integration

- **About & Contact**
  - Professional bio and experience timeline
  - Skills visualization
  - Direct contact form
  - Social media integration

- **Progressive Web App**
  - Installable on mobile and desktop
  - Offline support with service workers
  - App-like experience
  - Custom install prompts

### Admin Dashboard Features

- **Content Management**
  - Full CRUD operations for blog posts and projects
  - Rich markdown editor with live preview
  - Media library with cloud storage integration
  - Bulk operations and batch processing

- **Media Management**
  - Upload and organize media files
  - YouTube metadata fetching
  - Thumbnail generation
  - Storage analytics and usage tracking

- **Authentication & Authorization**
  - Supabase-powered authentication
  - Secure session management
  - Role-based access control
  - Protected API routes

- **Analytics Dashboard**
  - Real-time content performance metrics
  - User engagement tracking
  - Traffic analytics
  - Export capabilities

---

## Tech Stack

### Core Framework
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - UI library with Server Components
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe development

### Backend & Database
- **[Supabase](https://supabase.com/)** - PostgreSQL database, authentication, and storage
- **[Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions)** - Serverless API routes

### Styling & UI
- **[Tailwind CSS 3.3](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Lucide React](https://lucide.dev/)** - Icon library
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Dark mode support

### Developer Experience
- **[Vitest](https://vitest.dev/)** - Unit testing framework
- **[ESLint](https://eslint.org/)** - Code linting with Next.js config
- **[Bundle Analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)** - Webpack bundle analysis

### Monitoring & Analytics
- **[Vercel Analytics](https://vercel.com/analytics)** - Real-time analytics
- **[Vercel Speed Insights](https://vercel.com/docs/speed-insights)** - Performance monitoring

### Authentication & Security
- **[Supabase Auth](https://supabase.com/docs/guides/auth)** - Authentication provider
- **[Jose](https://github.com/panva/jose)** - JWT token handling

---

## Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Client Layer                         │
│  (Next.js App Router + React Server Components)         │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────────┐
│                  API Layer (Edge)                        │
│  • REST endpoints        • Authentication middleware     │
│  • File uploads          • Rate limiting                 │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────────┐
│               Data Layer (Supabase)                      │
│  • PostgreSQL Database   • Row Level Security           │
│  • Cloud Storage         • Real-time subscriptions      │
└─────────────────────────────────────────────────────────┘
```

### Key Design Patterns

- **Server-Side Rendering (SSR):** Dynamic content with optimal performance
- **Static Site Generation (SSG):** Pre-rendered pages for blog posts
- **Incremental Static Regeneration (ISR):** Automatic cache revalidation
- **Service Layer Pattern:** Abstracted database operations
- **Component-Based Architecture:** Modular, reusable UI components
- **API Route Protection:** Middleware-based authentication

---

## Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 or **pnpm** >= 8.0.0
- **Git** >= 2.40.0
- **Supabase Account** (free tier available)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/RaphDeAnalyst/web3-portfolio.git
cd web3-portfolio
```

2. **Install dependencies**

```bash
npm install
# or
pnpm install
```

3. **Set up environment variables**

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration (see [Environment Configuration](#environment-configuration))

4. **Set up Supabase**

- Create a new project at [supabase.com](https://supabase.com)
- Run the database migrations from `database/migrations/`
- Configure authentication providers
- Set up storage buckets for media uploads

5. **Start the development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

---

### Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
# Get these from: https://app.supabase.com/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# YouTube API (Optional - for video metadata)
# Get from: https://console.cloud.google.com/apis/credentials
YOUTUBE_API_KEY=your_youtube_api_key

# Deployment (Vercel)
# Automatically set by Vercel, no manual configuration needed
VERCEL_URL=auto
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

#### Required Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ Yes |
| `YOUTUBE_API_KEY` | YouTube Data API v3 key | ⚠️ Optional |
| `NEXT_PUBLIC_SITE_URL` | Production domain URL | ⚠️ Production only |

---

## Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on `localhost:3000` |
| `npm run build` | Build production-optimized bundle |
| `npm run start` | Start production server (requires build first) |
| `npm run lint` | Run ESLint code quality checks |
| `npm run test` | Run unit tests with Vitest |
| `npm run test:ui` | Run tests with interactive UI |
| `npm run test:coverage` | Generate test coverage report |
| `npm run analyze` | Analyze webpack bundle size |
| `npm run keep-alive` | Ping Supabase to prevent database sleep |

### Project Structure

```
web3-portfolio/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/             # Authentication routes
│   │   ├── admin/              # Admin dashboard
│   │   ├── api/                # API endpoints
│   │   ├── blog/               # Blog pages
│   │   ├── portfolio/          # Portfolio showcase
│   │   ├── about/              # About page
│   │   ├── contact/            # Contact page
│   │   └── layout.tsx          # Root layout
│   │
│   ├── components/             # React components
│   │   ├── admin/              # Admin-specific components
│   │   ├── blog/               # Blog components
│   │   ├── layout/             # Layout components (Navbar, Footer)
│   │   ├── sections/           # Homepage sections
│   │   ├── ui/                 # Reusable UI components
│   │   ├── pwa/                # PWA components
│   │   ├── seo/                # SEO components
│   │   └── error/              # Error boundaries
│   │
│   ├── lib/                    # Utility libraries
│   │   ├── supabase.ts         # Supabase client
│   │   ├── auth.ts             # Authentication utilities
│   │   ├── logger.ts           # Logging utilities
│   │   └── utils.ts            # Helper functions
│   │
│   └── types/                  # TypeScript type definitions
│
├── public/                     # Static assets
│   ├── icons/                  # PWA icons
│   ├── manifest.json           # PWA manifest
│   └── sw.js                   # Service worker
│
├── database/                   # Database schema and migrations
│   └── migrations/             # SQL migration files
│
├── .github/                    # GitHub configuration
│   └── workflows/              # CI/CD workflows
│       └── supabase-keep-alive.yml
│
├── next.config.js              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Project dependencies
```

### Code Quality

This project enforces code quality through:

- **TypeScript strict mode** - Type safety across the codebase
- **ESLint** - Linting with Next.js and accessibility rules
- **Component testing** - Vitest for unit and integration tests
- **Git hooks** - Pre-commit checks (optional)

---

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Structure

Tests are colocated with components using the following naming convention:

```
component-name.tsx
component-name.test.tsx
```

### Test Coverage Goals

- **Unit tests:** >= 80% coverage for utilities and services
- **Integration tests:** Critical user flows (auth, content management)
- **E2E tests:** Core user journeys (planned)

---

## Deployment

### Vercel Deployment (Recommended)

This project is optimized for Vercel deployment:

1. **Connect your repository** to Vercel
2. **Configure environment variables** in Vercel dashboard
3. **Deploy** - Automatic deployments on every push to `main`

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/RaphDeAnalyst/web3-portfolio)

### GitHub Actions Workflows

- **Supabase Keep-Alive:** Daily cron job to prevent database sleep (free tier)
  - Runs daily at 6:00 AM UTC
  - Queries database to maintain active connection
  - Located: `.github/workflows/supabase-keep-alive.yml`

### Environment-Specific Configuration

| Environment | Branch | Domain | Cache Strategy |
|-------------|--------|--------|----------------|
| Production | `main` | matthewraphael.xyz | ISR + Edge Cache |
| Preview | Feature branches | `*.vercel.app` | No cache |
| Development | Local | localhost:3000 | No cache |

---

## Performance

### Optimization Techniques

This project implements industry-standard performance optimizations:

#### Bundle Optimization
- **Code splitting** - Automatic route-based splitting
- **Tree shaking** - Eliminates unused code
- **Dynamic imports** - Lazy loading for non-critical components
- **Vendor chunking** - Separate chunks for node_modules
- **Icon optimization** - Selective imports from Lucide React

#### Image Optimization
- **Next.js Image component** - Automatic optimization
- **Modern formats** - WebP and AVIF support
- **Responsive images** - Adaptive sizing
- **Lazy loading** - Below-the-fold images

#### Caching Strategy
- **Static pages:** ISR with 5-minute revalidation
- **API routes:** Aggressive edge caching
- **Media assets:** CDN caching with long TTL
- **Admin pages:** No caching for fresh content

#### Performance Metrics

Target metrics (Lighthouse scores):

- **Performance:** >= 95
- **Accessibility:** >= 95
- **Best Practices:** >= 95
- **SEO:** >= 95

### Bundle Analysis

Analyze bundle size with:

```bash
npm run analyze
```

This generates a visual report of your webpack bundle composition.

---

## Security

### Security Features

- **Content Security Policy (CSP)** - Strict CSP headers
- **HTTPS enforcement** - HSTS with preload
- **XSS protection** - Input sanitization and validation
- **CSRF protection** - Token-based verification
- **SQL injection prevention** - Parameterized queries via Supabase
- **Authentication** - Secure session management with Supabase Auth
- **Rate limiting** - API route protection
- **Environment variable security** - No secrets in client-side code

### Security Headers

Configured in `next.config.js`:

```javascript
{
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Content-Security-Policy': '...'
}
```

### Reporting Security Issues

If you discover a security vulnerability, please email: **matthewraphael@matthewraphael.xyz**

**Do not** create a public GitHub issue for security vulnerabilities.

---

## Contributing

Contributions are welcome! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** with clear, descriptive commits
4. **Write or update tests** for your changes
5. **Ensure all tests pass** (`npm run test`)
6. **Run linting** (`npm run lint`)
7. **Submit a pull request**

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: resolve bug
docs: update documentation
style: format code
refactor: restructure code
test: add tests
chore: update dependencies
```

### Code Style

- **TypeScript:** Use strict mode, avoid `any` types
- **Components:** Functional components with TypeScript interfaces
- **Naming:** Descriptive, PascalCase for components, camelCase for functions
- **Comments:** JSDoc for public APIs, inline for complex logic
- **Imports:** Absolute imports using `@/` alias

---

## License

This project is **private and proprietary**. All rights reserved.

© 2024 Matthew Raphael. Unauthorized copying or distribution is prohibited.

---

## Contact & Support

**Developer:** Matthew Raphael (RaphDeAnalyst)
**Email:** matthewraphael@matthewraphael.xyz
**GitHub:** [@RaphDeAnalyst](https://github.com/RaphDeAnalyst)
**Website:** [matthewraphael.xyz](https://matthewraphael.xyz)

---

## Acknowledgments

- Built with [Next.js](https://nextjs.org/) by Vercel
- Database and auth powered by [Supabase](https://supabase.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)

---

**Made with ❤️ and ☕ by RaphDeAnalyst**

