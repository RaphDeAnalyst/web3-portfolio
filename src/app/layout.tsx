import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover"
};

export const metadata: Metadata = {
  title: "Matthew Raphael | Web3 Data Analyst",
  description: "Web3 Data Analyst specializing in on-chain analytics, DeFi protocols, and L2 networks. Based in Lagos.",
  openGraph: {
    title: "Matthew Raphael | Web3 Data Analyst",
    description: "Web3 Data Analyst specializing in on-chain analytics, DeFi protocols, and L2 networks.",
    url: "https://matthewraphael.xyz",
    type: "website",
  },
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
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider defaultTheme="light" storageKey="web3-portfolio-theme">
          <div className="min-h-screen flex flex-col bg-background text-foreground">
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
