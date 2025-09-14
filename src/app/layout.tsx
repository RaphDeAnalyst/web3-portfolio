import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-provider";
import { Web3Provider } from "@/lib/web3-context";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  fallback: ["Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
});

export const metadata: Metadata = {
  title: "Web3 Data Analyst | Matthew Raphael | Blockchain & On-chain Analytics Portfolio",
  description: "Portfolio of Matthew Raphael, Web3 Data Analyst skilled in SQL, Python, and Dune Analytics. Explore blockchain dashboards, DeFi analytics, wallet profiling, and on-chain data insights. Bridging traditional analytics with Web3 innovation.",
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
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider
          defaultTheme="dark"
          storageKey="web3-portfolio-theme"
        >
          <Web3Provider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 pt-16">
                {children}
              </main>
              <Footer />
            </div>
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
