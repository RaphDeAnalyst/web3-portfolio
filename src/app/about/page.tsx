import type { Metadata } from 'next'
import { AboutClient } from '@/components/sections/AboutClient'

export const metadata: Metadata = {
  title: 'About Matthew Raphael Nnamani | Blockchain Intelligence Practitioner',
  description: 'About Matthew Raphael Nnamani — blockchain intelligence practitioner, on-chain investigator, and AML compliance analyst. BSc Chemistry, University of Uyo. Independent investigator since 2024.',
  alternates: {
    canonical: 'https://matthewraphael.xyz/about',
  },
  openGraph: {
    title: 'About Matthew Raphael Nnamani — Blockchain Intelligence Practitioner',
    description: 'About Matthew Raphael Nnamani — blockchain intelligence practitioner, on-chain investigator, and AML compliance analyst. BSc Chemistry, University of Uyo. Independent investigator since 2024.',
    url: 'https://matthewraphael.xyz/about',
  },
}

export default function About() {
  return <AboutClient />
}
