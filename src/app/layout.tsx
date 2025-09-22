import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-provider";
import { Web3Provider } from "@/lib/web3-context";
import { NotificationProvider } from "@/lib/notification-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { GlobalNotificationContainer } from "@/components/ui/notification";
import { CanonicalLink } from "@/components/seo/CanonicalLink";
import dynamic from 'next/dynamic';

// Deferred analytics loading for better performance
const DeferredAnalytics = dynamic(() => import('@/components/analytics/DeferredAnalytics').then(mod => ({ default: mod.DeferredAnalytics })), {
  ssr: false
});

// PWA install prompt
const InstallPrompt = dynamic(() => import('@/components/pwa/install-prompt').then(mod => ({ default: mod.InstallPrompt })), {
  ssr: false
});

import '@/lib/sw-registration';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  weight: ["400", "500", "600", "700"], // Only load needed weights
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false, // Only preload primary font
  adjustFontFallback: true,
  weight: ["400", "500"], // Minimal weights for code
  fallback: ["Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
});

export const metadata: Metadata = {
  title: "Web3 Data Analyst | Matthew Raphael | Blockchain & On-chain Analytics Portfolio",
  description: "Portfolio of Matthew Raphael, Web3 Data Analyst skilled in SQL, Python, and Dune Analytics. Explore blockchain dashboards, DeFi analytics, wallet profiling, and on-chain data insights. Bridging traditional analytics with Web3 innovation.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: "cover"
  },
  keywords: [
    // Core Identity Keywords
    "Web3 Data Analyst", "Blockchain Analyst", "On-chain Data Analytics", "DeFi Analytics",
    "Crypto Data Insights", "Smart Contract Analytics", "Wallet Tracking & Profiling", "Blockchain Research",

    // Skills / Tools Keywords
    "SQL for Blockchain Analytics", "Python for Data Analysis", "Dune Analytics", "DuneSQL",
    "Power BI", "Data Visualization", "On-chain Dashboards", "Token & Transaction Analysis",
    "NFT Analytics", "Data-driven Web3 Research",

    // Transition / Background Keywords
    "Data Analyst Web2 Web3", "Transitioning from Web2 to Web3 Analytics",
    "Traditional Data Analysis Skills applied to Blockchain", "Excel SQL Python in Web3",
    "From Web2 Data Insights to Web3 Innovation",

    // Portfolio / Service Keywords
    "Blockchain Data Dashboards", "Web3 Portfolio Projects", "Crypto Research & Reporting",
    "Decentralized Finance DeFi Trends", "Token Economy Insights", "Wallet Behavior Analysis",
    "On-chain Cohort Analysis", "Web3 Growth Metrics",

    // Name and Location
    "Matthew Raphael", "RaphDeAnalyst"
  ],
  authors: [{ name: "Matthew Raphael", url: "https://matthewraphael.xyz" }],
  creator: "Matthew Raphael",
  publisher: "Matthew Raphael",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://matthewraphael.xyz",
    title: "Web3 Data Analyst | Matthew Raphael | Blockchain & On-chain Analytics Portfolio",
    description: "Portfolio of Matthew Raphael, Web3 Data Analyst specialized in blockchain analytics, DeFi protocols, and on-chain data analysis. Expert in Python, SQL, Dune Analytics with proven Web2 to Web3 transition experience.",
    siteName: "Matthew Raphael - Web3 Data Analytics Portfolio",
    images: [
      {
        url: "https://matthewraphael.xyz/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Matthew Raphael - Web3 Data Analyst and Blockchain Analytics Specialist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web3 Data Analyst | Matthew Raphael | Blockchain & On-chain Analytics Portfolio",
    description: "Specialized in blockchain analytics, DeFi protocols, and on-chain data analysis. Expert in Python, SQL, and Dune Analytics. Explore my Web3 dashboards and case studies.",
    creator: "@matthew_nnamani",
    images: ["https://matthewraphael.xyz/og-image.jpg"],
  },
  alternates: {
    canonical: "https://matthewraphael.xyz",
  },
  category: "Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Resource hints for performance - optimized for Core Web Vitals */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />


        <link rel="dns-prefetch" href="https://vercel.live" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
        <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />

        {/* Performance optimizations for external services */}
        <link rel="preconnect" href="https://i.ibb.co" />
        <link rel="dns-prefetch" href="https://api.imgbb.com" />

        {/* Primary favicon - ICO format for best compatibility */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon_dark-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon_dark-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon-dark.png" sizes="180x180" />

        {/* High-res icons for various devices */}
        <link rel="icon" href="/favicon_dark-192x192.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/favicon_dark-512x512.png" type="image/png" sizes="512x512" />

        {/* Web App Manifest */}
        <link rel="manifest" href="/site.webmanifest" />

        {/* Canonical URL */}
        <CanonicalLink />

        {/* Additional meta tags for better browser support */}
        <meta name="msapplication-TileColor" content="#666666" />
        <meta name="theme-color" content="#666666" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* No-flash script for theme - prevents FOUC */}
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                var theme = localStorage.getItem('web3-portfolio-theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                } else {
                  document.documentElement.classList.add('light');
                  document.documentElement.style.colorScheme = 'light';
                }
              } catch (e) {}
            })();
          `
        }} />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider
          defaultTheme="dark"
          storageKey="web3-portfolio-theme"
        >
          <Web3Provider>
            <NotificationProvider>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
                <GlobalNotificationContainer />
              </div>
            </NotificationProvider>
          </Web3Provider>
        </ThemeProvider>
        <DeferredAnalytics />
        <InstallPrompt />
      </body>
    </html>
  );
}
