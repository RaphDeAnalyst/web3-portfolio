import type { Metadata } from 'next'
import { HeroSection } from '@/components/sections/HeroSection'
import { JsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Matthew Raphael Nnamani | Blockchain Intelligence Practitioner',
  description: 'Matthew Raphael Nnamani is a blockchain intelligence practitioner and on-chain investigator based in Lagos, Nigeria. Specialising in AML-aligned fund tracing, KYT, and financial crime investigations across EVM chains.',
  alternates: {
    canonical: 'https://matthewraphael.xyz',
  },
}

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Matthew Raphael Nnamani",
  "url": "https://matthewraphael.xyz",
  "description": "Personal portfolio and investigation record of Matthew Raphael Nnamani, blockchain intelligence practitioner.",
  "author": {
    "@type": "Person",
    "name": "Matthew Raphael Nnamani"
  }
}

export default function Home() {
  return (
    <>
      <JsonLd data={websiteSchema} />
      <HeroSection />
    </>
  )
}
