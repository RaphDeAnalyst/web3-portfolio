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
  title: "Data Analyst Portfolio | Web2 to Web3 Transition",
  description: "Portfolio showcasing the transition from traditional data analytics to Web3 blockchain analytics, featuring Python, SQL, Dune Analytics, and statistical modeling skills.",
  keywords: ["Data Analytics", "Web3", "Blockchain Analytics", "Python", "SQL", "Dune Analytics", "Statistical Analysis", "Portfolio", "Career Transition"],
  authors: [{ name: "Data Analyst" }],
  creator: "Transitioning Data Analyst",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Data Analyst Portfolio | Web2 to Web3 Transition",
    description: "Portfolio showcasing the transition from traditional data analytics to Web3 blockchain analytics and statistical modeling.",
    siteName: "Data Analytics Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Analyst Portfolio | Web2 to Web3 Transition",
    description: "Portfolio showcasing the transition from traditional data analytics to Web3 blockchain analytics and statistical modeling.",
    creator: "@yourhandle",
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
