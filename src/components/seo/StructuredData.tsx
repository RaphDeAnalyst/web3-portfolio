'use client'

import { useEffect, useState } from 'react'
import { logger } from '@/lib/logger'
import { profileService } from '@/lib/service-switcher'
import type { ProfileData } from '@/types/shared'

interface StructuredDataProps {
  type?: 'person' | 'website' | 'project' | 'blog' | 'faq' | 'localbusiness'
  data?: any
}

export function StructuredData({ type = 'person', data }: StructuredDataProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await profileService.getProfile()
        setProfile(profileData)
      } catch (error) {
        logger.error('Error loading profile for structured data', error)
      }
    }

    if (type === 'person' || type === 'website') {
      loadProfile()
    }
  }, [type])

  const generatePersonSchema = () => {
    if (!profile) return null

    return {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": profile.name || "Matthew Raphael Nnamani",
      "alternateName": "notes0x",
      "jobTitle": "Blockchain Intelligence Practitioner",
      "description": "Blockchain intelligence practitioner conducting on-chain investigations, AML-aligned fund tracing, and KYT analysis across EVM chains. Based in Lagos.",
      "url": "https://matthewraphael.xyz",
      "image": profile.avatar || "https://matthewraphael.xyz/profile-image.jpg",
      "email": profile.email || "matthewraphael@matthewraphael.xyz",
      "knowsAbout": [
        "Blockchain Intelligence",
        "On-Chain Investigation",
        "AML Compliance",
        "KYT Transaction Monitoring",
        "Fund Flow Tracing",
        "OFAC Sanctions Screening",
        "Cross-Chain Analysis",
        "Wallet Behavioral Profiling",
        "Dune Analytics",
        "Trino SQL",
        "EVM Chain Analysis"
      ],
      "hasSkill": [
        "On-Chain Investigation", "KYT / Transaction Monitoring", "Multi-Hop Fund Tracing",
        "AML/CTF Compliance", "OFAC Sanctions Screening", "Trino SQL",
        "Dune Analytics", "Python", "Etherscan V2", "Breadcrumbs"
      ],
      "sameAs": [
        `https://github.com/${profile.github || 'notes0x'}`,
        `https://x.com/${profile.twitter || '0x_note'}`,
        `https://linkedin.com/in/${profile.linkedin || 'matthew-nnamani'}`,
        "https://dune.com/notes0x",
        "https://paragraph.com/@notes0x"
      ],
      "worksFor": {
        "@type": "Organization",
        "name": "Blockchain Intelligence"
      },
      "alumniOf": {
        "@type": "EducationalOrganization",
        "name": "University of Uyo"
      },
      "homeLocation": {
        "@type": "Place",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Lagos",
          "addressRegion": "Lagos State",
          "addressCountry": "Nigeria"
        }
      },
      "workLocation": [
        {
          "@type": "Place",
          "name": "Global Remote"
        },
        {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "Nigeria"
          }
        }
      ],
      "nationality": {
        "@type": "Country",
        "name": "Nigeria"
      },
      "seekingWorkType": [
        "Full-time",
        "Contract",
        "Freelance",
        "Remote",
        "Consulting"
      ],
      "availableChannel": [
        {
          "@type": "ServiceChannel",
          "name": "Remote Collaboration",
          "availableLanguage": "English"
        },
        {
          "@type": "ServiceChannel",
          "name": "Global Timezone Flexibility",
          "serviceArea": ["US Eastern Time", "UK GMT", "EU CET", "West Africa Time"]
        }
      ]
    }
  }

  const generateWebsiteSchema = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Matthew Raphael Nnamani — Blockchain Intelligence Practitioner",
    "alternateName": "notes0x",
    "url": "https://matthewraphael.xyz",
    "description": "Blockchain intelligence practitioner conducting on-chain investigations, AML-aligned fund tracing, and KYT analysis across EVM chains.",
    "author": {
      "@type": "Person",
      "name": "Matthew Raphael Nnamani",
      "jobTitle": "Blockchain Intelligence Practitioner"
    },
    "mainEntity": {
      "@type": "Person",
      "name": "Matthew Raphael Nnamani"
    }
  })

  const generateProjectSchema = () => {
    if (!data) return null

    return {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "name": data.title,
      "description": data.description,
      "url": data.demoUrl || `https://matthewraphael.xyz/portfolio/${data.id}`,
      "author": {
        "@type": "Person",
        "name": "Matthew Raphael"
      },
      "genre": "Web3 Analytics Project",
      "keywords": data.tech?.join(', ') || "Web3, Blockchain Analytics, DeFi",
      "dateCreated": data.createdAt || new Date().toISOString(),
      "programmingLanguage": data.tech?.filter((tech: string) =>
        ['Python', 'SQL', 'JavaScript', 'TypeScript'].includes(tech)
      )
    }
  }

  const generateBlogSchema = () => {
    if (!data) return null

    const wordCount = data.content?.split(/\s+/).filter((word: string) => word.length > 0).length || 500
    const readingTime = Math.max(1, Math.ceil(wordCount / 200)) // Average 200 words per minute

    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": data.title,
      "description": data.summary || data.description,
      "url": `https://matthewraphael.xyz/blog/${data.slug}`,
      "datePublished": data.date || data.createdAt,
      "dateModified": data.updatedAt || data.date || data.createdAt,
      "author": {
        "@type": "Person",
        "name": data.author?.name || "Matthew Raphael Nnamani",
        "jobTitle": "Blockchain Intelligence Practitioner"
      },
      "publisher": {
        "@type": "Person",
        "name": "Matthew Raphael"
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://matthewraphael.xyz/blog/${data.slug}`
      },
      "keywords": data.tags?.join(', ') || "Web3, Blockchain Analytics, DeFi",
      "articleSection": data.category || "Web3 Analytics",
      wordCount,
      "timeRequired": `PT${readingTime}M`,
      "inLanguage": "en-US",
      "isAccessibleForFree": true
    }
  }

  const generateFAQSchema = () => {
    if (!data || !Array.isArray(data)) return null

    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": data.map((faq: { question: string; answer: string }) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }
  }

  const generateLocalBusinessSchema = () => {
    if (!profile) return null

    return {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "Matthew Raphael Nnamani — Blockchain Intelligence",
      "alternateName": "notes0x",
      "description": "Blockchain intelligence practitioner conducting on-chain investigations, AML-aligned fund tracing, and KYT analysis across EVM chains.",
      "url": "https://matthewraphael.xyz",
      "email": profile.email || "matthewraphael@matthewraphael.xyz",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Lagos",
        "addressRegion": "Lagos State",
        "addressCountry": "Nigeria"
      },
      "founder": {
        "@type": "Person",
        "name": "Matthew Raphael"
      },
      "serviceArea": [
        {
          "@type": "Country",
          "name": "United States"
        },
        {
          "@type": "Country",
          "name": "United Kingdom"
        },
        {
          "@type": "Country",
          "name": "Canada"
        },
        {
          "@type": "Country",
          "name": "Australia"
        },
        {
          "@type": "Country",
          "name": "Nigeria"
        },
        {
          "@type": "Continent",
          "name": "Europe"
        },
        {
          "@type": "Continent",
          "name": "North America"
        },
        {
          "@type": "Continent",
          "name": "Africa"
        },
        {
          "@type": "Place",
          "name": "Global Remote"
        }
      ],
      "areaServed": [
        {
          "@type": "Country",
          "name": "United States"
        },
        {
          "@type": "Country",
          "name": "United Kingdom"
        },
        {
          "@type": "Country",
          "name": "Canada"
        },
        {
          "@type": "Country",
          "name": "Australia"
        },
        {
          "@type": "Country",
          "name": "Germany"
        },
        {
          "@type": "Country",
          "name": "Netherlands"
        },
        {
          "@type": "Country",
          "name": "Singapore"
        },
        {
          "@type": "Country",
          "name": "Nigeria"
        },
        {
          "@type": "Place",
          "name": "Worldwide"
        }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Web3 Analytics Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Blockchain Data Analysis",
              "description": "Custom blockchain analytics and on-chain data insights"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "DeFi Protocol Analysis",
              "description": "In-depth analysis of DeFi protocols and smart contracts"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Dune Analytics Dashboards",
              "description": "Custom dashboard development using Dune Analytics"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Remote Web3 Analytics Consulting",
              "description": "Full-time and freelance Web3 data analysis services available globally"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Contract Blockchain Data Analysis",
              "description": "Short-term and long-term contract opportunities for blockchain analytics projects"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Blockchain Intelligence Consulting",
              "description": "Available for blockchain intelligence, AML compliance, and on-chain investigation engagements"
            }
          }
        ]
      },
      "priceRange": "$$"
    }
  }

  const getSchemaData = () => {
    switch (type) {
      case 'person':
        return generatePersonSchema()
      case 'website':
        return generateWebsiteSchema()
      case 'project':
        return generateProjectSchema()
      case 'blog':
        return generateBlogSchema()
      case 'faq':
        return generateFAQSchema()
      case 'localbusiness':
        return generateLocalBusinessSchema()
      default:
        return null
    }
  }

  const schemaData = getSchemaData()

  if (!schemaData) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData, null, 2)
      }}
    />
  )
}

// Breadcrumb structured data component
export function BreadcrumbStructuredData({ items }: { items: Array<{ name: string; url: string }> }) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbSchema, null, 2)
      }}
    />
  )
}