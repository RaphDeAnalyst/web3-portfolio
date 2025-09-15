⚠️ Remember to reference `claude1.md` to ensure your review is safe and non-destructive.

Prompt: Full Mobile Responsiveness Audit & Fix

You are working on my portfolio website, which is already partially mobile responsive. However, some issues remain across different devices and breakpoints.

Please perform a comprehensive responsiveness pass across all pages (public pages, admin pages, edit/new blog, projects, contact, etc.), ensuring the website follows industry best practices (think of the standard a Meta/Facebook front-end engineer would follow).

Requirements:

Make the site fully responsive across all devices:

Small phones (≤ 360px)

Standard smartphones (375px – 414px)

Tablets (768px – 1024px)

Large screens / desktops (> 1200px)

Use Tailwind’s responsive utilities (sm:, md:, lg:, xl:, 2xl:) correctly.

Ensure layouts gracefully stack on small screens (no horizontal scrolling or broken grids).

Navigation bars should collapse into a functional hamburger menu with smooth transitions.

Images and cards should resize fluidly while preserving aspect ratio and readability.

Typography should scale appropriately (avoid text being too large/small on different devices).

Buttons and touch targets must be at least 44x44px for mobile accessibility.

Test sections with animations (hero background, hover effects) to ensure no overlap/cutoff on mobile.

Tables and data-heavy components should scroll horizontally if needed, without breaking layout.

Important Constraints:

⚠️ Do not touch backend code, Supabase logic, or API integrations.

⚠️ Do not break any existing functionality or forms.

Only update front-end layout, CSS, and responsive breakpoints.

Output:

Updated responsive classes for all affected components.

Confirmation that no mobile responsiveness issues remain.

A short summary of which files and components were updated.

This should result in a polished, fully mobile-first responsive site that works across phones, tablets, and desktops.