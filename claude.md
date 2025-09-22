Claude Code Prompt — Final Production Audit

Act as a Meta/Amazon/Google senior frontend engineer.
You need to audit the entire project codebase against the Final Production Checklist below.

For each item:

Check compliance in the codebase.

List findings in a structured report (✅ compliant / ⚠️ needs work).

For ⚠️ items, propose fixes first, then implement them safely.

Follow best practices only — do not touch or refactor any core functionalities, business logic, or experimental features (wallet connect, newsletter, etc.).

✅ Final Production Checklist
1. Codebase & Architecture

Remove unused components, dead code, stray logs, redundant dependencies.

Enforce Prettier + ESLint rules, TypeScript strict mode.

Ensure tree-shaking for icons, libraries, and UI components.

Maintain modular architecture (no oversized components).

2. Performance Optimization

Lighthouse ≥ 90 on Desktop/Mobile.

LCP < 2.5s, TBT minimized, CLS < 0.1.

Compress images, preload fonts, lazy-load offscreen elements.

Validate bundle size < 300KB initial load.

3. Responsive & Cross-Device Testing

Validate layouts on desktop, tablet, mobile.

Check cross-browser rendering (Chrome, Safari, Firefox, Edge).

Ensure mobile gestures and touch targets work properly.

4. PWA Optimization

Validate manifest.json (icons, theme, display mode, start URL).

Check service worker caching strategies (static vs API calls).

Confirm offline fallback page works.

Ensure “Add to Home Screen” works.

5. Accessibility (WCAG 2.1 AA)

Screen reader compatibility (VoiceOver, NVDA).

Proper ARIA labels for all interactive elements.

Contrast ratio ≥ 4.5:1.

Tab navigation order correct.

Visible focus states.

6. SEO & Metadata

Validate meta tags (description, OG, Twitter, canonical).

Ensure structured data (JSON-LD) for portfolio/blog items.

No # placeholders in links.

Verify sitemap + robots.txt.

Preload critical assets.

7. Security & Best Practices

Add CSP headers (script-src, object-src, etc.).

Validate CORS configs.

HTTPS enforced.

Supabase endpoints secured with RLS.

Remove exposed secrets.

Run vulnerability scan (npm audit).

8. Analytics & Monitoring

Enable Vercel Analytics + Vercel Speed Insights.

Integrate Sentry with source maps for error tracking.

Add custom event logging (dashboard_viewed, report_downloaded, contact_form_submitted).

Document monitoring setup in MONITORING_SETUP.md.

9. Testing & QA

Unit tests for critical components.

Integration tests for forms, modals, navigation.

E2E tests for portfolio → analytics → contact form flow.

Test under slow network & offline.

Test with CPU throttling.

10. Deployment & CI/CD

GitHub Actions / Vercel CI pipeline with Lighthouse checks.

Separate staging vs production environments.

Verify cache invalidation on deploy.

Enable rollback strategy.

⚡ Instructions

Perform this audit step by step (not all at once).

Always summarize changes after each section before proceeding.

Do not alter core logic or experimental features — improvements should focus only on best practices, performance, accessibility, and maintainability.