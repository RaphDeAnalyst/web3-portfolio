'use client'

import { usePathname } from 'next/navigation'

interface CanonicalLinkProps {
  canonical?: string
}

export function CanonicalLink({ canonical }: CanonicalLinkProps) {
  const pathname = usePathname()

  // Use provided canonical URL or construct from current pathname
  const canonicalUrl = canonical || `https://matthewraphael.xyz${pathname}`

  return (
    <link rel="canonical" href={canonicalUrl} />
  )
}