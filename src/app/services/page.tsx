import type { Metadata } from 'next'
import { ServicesClient } from '@/components/sections/ServicesClient'

export const metadata: Metadata = {
  title: 'Services | Matthew Raphael Nnamani — Blockchain Intelligence',
  description: 'Wallet screening, fund tracing, and AML-aligned investigation services from Matthew Raphael Nnamani, blockchain intelligence practitioner.',
  alternates: { canonical: 'https://matthewraphael.xyz/services' },
  openGraph: {
    title: 'Services — Matthew Raphael Nnamani',
    description: 'Wallet screening, fund tracing, and AML-aligned investigation services.',
    url: 'https://matthewraphael.xyz/services',
  },
}

export default function Services() {
  return <ServicesClient />
}
