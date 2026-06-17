import type { Metadata, Viewport } from "next";
import { Playfair_Display, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const ibmPlex = IBM_Plex_Sans({
  variable: "--font-ibm-plex",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF8" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
};

export const metadata: Metadata = {
  manifest: "/site.webmanifest",
  title: "Matthew Raphael Nnamani | Blockchain Intelligence Practitioner",
  description: "Matthew Raphael Nnamani is a blockchain intelligence practitioner and on-chain investigator based in Lagos, Nigeria. Specialising in AML-aligned fund tracing, KYT, and financial crime investigations across EVM chains.",
  icons: {
    icon: [
      { url: "/favicon_light.ico", media: "(prefers-color-scheme: light)" },
      { url: "/favicon_dark.ico", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/apple-touch-icon-dark.png",
  },
  alternates: {
    canonical: "https://matthewraphael.xyz",
  },
  openGraph: {
    title: "Matthew Raphael Nnamani — Blockchain Intelligence Practitioner",
    description: "Matthew Raphael Nnamani is a blockchain intelligence practitioner and on-chain investigator based in Lagos, Nigeria. Specialising in AML-aligned fund tracing, KYT, and financial crime investigations across EVM chains.",
    url: "https://matthewraphael.xyz",
    type: "website",
    images: [
      {
        url: "https://matthewraphael.xyz/og_image.png",
        width: 1584,
        height: 396,
        alt: "Matthew Raphael Nnamani — Blockchain Intelligence Practitioner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Matthew Raphael Nnamani — Blockchain Intelligence Practitioner",
    description: "On-chain investigator. AML fund tracing, KYT, and financial crime investigations across EVM chains. Lagos.",
    images: ["https://matthewraphael.xyz/og_image.png"],
    creator: "@0x_note",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Matthew Raphael Nnamani",
  "alternateName": ["Matthew Raphael", "0x_note", "notes0x"],
  "url": "https://matthewraphael.xyz",
  "email": "matthewraphael@matthewraphael.xyz",
  "jobTitle": "Blockchain Intelligence Practitioner",
  "description": "On-chain investigator and blockchain intelligence analyst specialising in AML-aligned fund tracing, KYT, and financial crime investigations across EVM chains.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Lagos",
    "addressCountry": "NG"
  },
  "sameAs": [
    "https://x.com/0x_note",
    "https://linkedin.com/in/matthew-nnamani",
    "https://github.com/notes0x",
    "https://dune.com/notes0x",
    "https://paragraph.com/@notes0x"
  ],
  "knowsAbout": [
    "Blockchain Intelligence",
    "On-Chain Investigation",
    "Anti-Money Laundering",
    "Know Your Transaction",
    "USDT Flow Analysis",
    "FATF Compliance",
    "OFAC Sanctions Screening",
    "Multi-Hop Fund Tracing",
    "Dune Analytics",
    "Trino SQL",
    "EVM Chains"
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon-dark.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${playfair.variable} ${ibmPlex.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
