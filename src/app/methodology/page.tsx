import type { Metadata } from 'next'
import { MethodologyClient } from '@/components/sections/MethodologyClient'

export const metadata: Metadata = {
  title: 'Methodology | Matthew Raphael Nnamani — Blockchain Intelligence',
  description: 'How Matthew Raphael Nnamani investigates on-chain financial crime — from initial address to attributed entity. Four-phase process covering address clustering, graph traversal, exchange attribution, and confidence-graded reporting.',
  alternates: { canonical: 'https://matthewraphael.xyz/methodology' },
  openGraph: {
    title: 'Methodology — Matthew Raphael Nnamani',
    description: 'How I investigate on-chain financial crime — from initial address to attributed entity.',
    url: 'https://matthewraphael.xyz/methodology',
  },
}

export default function Methodology() {
  return <MethodologyClient />
}
