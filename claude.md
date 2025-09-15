⚠️ Remember to reference `claude1.md` to ensure your review is safe and non-destructive.

My deployed website: "WebFetch(domain:matthewraphael.xyz)",
Model website: "WebFetch(domain:www.storj.io)"

Complete Storj Website Recreation Prompt

Color Scheme & Design System:
Primary Navy: hsl(220, 54%, 23%) - Deep navy blue for backgrounds and headers
Secondary Blue: hsl(214, 84%, 56%) - Bright blue for CTAs and accents
Gradient Background: Leae the background as is
Text Colors: Pure white on dark backgrounds, hsl(220, 9%, 46%) for muted text
Logo Blue: hsl(214, 84%, 56%) - Bright blue for the Storj logo
Header Design:
Clean white background with subtle shadow
Center: Horizontal navigation menu (Products, Solutions, Pricing, Resources, Company) with dropdown arrows
Right: "Sign in" link + "Get started" button (navy background, white text, rounded corners)
Sticky navigation, 80px height
Hero Section Layout:
Background: Leave the current background as is
Left Column (60% width):
Massive white heading: "The fastest media cloud on the planet." (split across 3 lines)
"on the planet." text should have blue gradient effect
White subheading: "Get blazing fast global access to S3-compatible object storage and compute at the cost of a single region with Storj."
Blue "Get started" button with hover effect
Right Column (40% width):
Floating, overlapping interface mockups showing:
File browser with video thumbnails
Geographic distribution map
Download progress indicators
Semi-transparent white cards with rounded corners and shadows
Trust Section:
Light gray background hsl(210, 17%, 96%)
Centered text: "Trusted by teams all over the world."
Horizontal scroll of company logos in grayscale: CloudWave, Vivint, Gabb, TrueNAS, Caltech, Treatment Studios
Logos should be muted gray with hover effects
Typography:
Font family: Inter or system font stack
Hero heading: 72px, font-weight 700, line-height 1.1
Subheading: 20px, font-weight 400, line-height 1.5
Navigation: 16px, font-weight 500
Spacing & Layout:
Container max-width: 1200px, centered
Hero section padding: 120px vertical, 80px horizontal
Section gaps: 80px between major sections
Button padding: 16px 32px
Border radius: 8px for buttons, 12px for cards
Interactive Elements:
Smooth hover transitions (200ms ease)
Button hover: slight color darkening + subtle lift shadow
Navigation hover: blue underline animation
Logo hover: slight scale up (1.05x)
Responsive Behavior:
Mobile: Stack hero columns vertically, reduce font sizes
Tablet: Maintain layout but adjust spacing
Desktop: Full multi-column layout as described
Generate the complete landing page with proper React components, Tailwind CSS classes, and ensure pixel-perfect recreation of the Storj design aesthetic.




⚠️ My website may not have all the section outlined in this prompt but just get the cue from this and implement accordingly

⚠️ Important: Do not only update the Tailwind config. You must also update every component that references old color classes, even if it means manually replacing them. Search the entire codebase for color values (hex codes, rgb values, Tailwind classes like blue-500) and replace them.

After changes, generate a summary list of all files updated and confirm that no non-grayscale colors remain in the codebase.

⚠️ Remember to reference `claude1.md` to ensure your review is safe and non-destructive.
