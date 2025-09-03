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
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Matthew Raphael | Web3 Data Analyst & Blockchain Analytics Specialist",
  description: "Matthew Raphael - Web3 Data Analyst specializing in blockchain analytics, DeFi protocols, and on-chain data analysis. Expert in Python, SQL, Dune Analytics, and statistical modeling. Transitioning from traditional analytics to Web3 insights.",
  keywords: ["Matthew Raphael", "Web3 Data Analyst", "Blockchain Analytics", "DeFi Analytics", "Dune Analytics", "On-chain Data", "Python", "SQL", "Statistical Analysis", "Ethereum", "Data Visualization", "Smart Contract Analysis", "Cryptocurrency Analysis", "NFT Analytics", "Web2 to Web3", "Portfolio Tracking"],
  authors: [{ name: "Matthew Raphael" }],
  creator: "Matthew Raphael",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://matthewraphael.xyz",
    title: "Matthew Raphael | Web3 Data Analyst & Blockchain Analytics Specialist",
    description: "Matthew Raphael - Specialized in blockchain analytics, DeFi protocols, and on-chain data analysis. Transitioning from traditional data analytics to Web3 insights with proven expertise in Python, SQL, and Dune Analytics.",
    siteName: "Matthew Raphael - Web3 Analytics",
  },
  twitter: {
    card: "summary_large_image",
    title: "Matthew Raphael | Web3 Data Analyst & Blockchain Analytics Specialist",
    description: "Specialized in blockchain analytics, DeFi protocols, and on-chain data analysis. Expert in Python, SQL, and Dune Analytics with traditional analytics background.",
    creator: "@matthew_nnamani",
  },
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
