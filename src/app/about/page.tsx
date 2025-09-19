import type { Metadata } from 'next'
import AboutClient from './about-client'

export const metadata: Metadata = {
  title: 'About Matthew Raphael | Web3 Data Analyst Journey & Background',
  description: 'Learn about Matthew Raphael\'s transition from traditional data analytics to Web3 blockchain analytics. Discover his journey, skills in Python/SQL/Dune Analytics, and expertise in DeFi protocol analysis.',
  keywords: [
    'Matthew Raphael About', 'Web3 Data Analyst Background', 'Blockchain Analytics Journey',
    'DeFi Analytics Expert', 'Data Analyst Transition Web2 Web3', 'Dune Analytics Specialist',
    'SQL Python Blockchain', 'On-chain Data Analysis Experience', 'Web3 Analytics Career',
    'Blockchain Data Scientist Bio', 'Traditional to Crypto Analytics', 'DeFi Protocol Analyst'
  ],
  openGraph: {
    title: 'About Matthew Raphael | Web3 Data Analyst Journey & Background',
    description: 'Learn about Matthew Raphael\'s transition from traditional data analytics to Web3 blockchain analytics. Expert in Python, SQL, and Dune Analytics with proven DeFi analysis experience.',
    url: 'https://matthewraphael.xyz/about',
    type: 'website',
  },
  twitter: {
    title: 'About Matthew Raphael | Web3 Data Analyst Journey & Background',
    description: 'Learn about Matthew Raphael\'s transition from traditional data analytics to Web3 blockchain analytics. Expert in Python, SQL, and Dune Analytics.',
  },
  alternates: {
    canonical: 'https://matthewraphael.xyz/about',
  },
}

export default function About() {
  return <AboutClient />
}