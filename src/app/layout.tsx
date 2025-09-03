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
  title: "Web3 Data Analyst | Turning Blockchain Data into Insights",
  description: "Web3 Data Analyst specializing in blockchain analytics, DeFi protocols, and on-chain data analysis. Expert in Python, SQL, Dune Analytics, and statistical modeling. Built 8+ dashboards tracking $100M+ in DeFi volumes.",
  keywords: ["Web3 Data Analyst", "Blockchain Analytics", "DeFi Analytics", "Dune Analytics", "On-chain Data", "Python", "SQL", "Statistical Analysis", "Ethereum", "Data Visualization", "Smart Contract Analysis", "Cryptocurrency Analysis", "NFT Analytics", "Yield Farming Analysis", "Portfolio Tracking"],
  authors: [{ name: "Web3 Data Analyst" }],
  creator: "Web3 Data & AI Specialist",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Web3 Data Analyst | Turning Blockchain Data into Insights",
    description: "Specialized in blockchain analytics, DeFi protocols, and on-chain data analysis. Built 8+ Dune Analytics dashboards tracking $100M+ in DeFi volumes. Expert in Python, SQL, and statistical modeling.",
    siteName: "Web3 Data Analytics Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Web3 Data Analyst | Turning Blockchain Data into Insights",
    description: "Specialized in blockchain analytics, DeFi protocols, and on-chain data analysis. Built 8+ Dune Analytics dashboards tracking $100M+ in DeFi volumes.",
    creator: "@web3_analyst",
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
