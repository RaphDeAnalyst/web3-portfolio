'use client'

import { useEffect, useState } from 'react'
import { logger } from '@/lib/logger'
import { profileService } from '@/lib/service-switcher'
import type { ProfileData } from '@/lib/profile-service-supabase'

interface StructuredDataProps {
  type?: 'person' | 'website' | 'project' | 'blog'
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
      "name": profile.name || "Matthew Raphael",
      "alternateName": "RaphDeAnalyst",
      "jobTitle": "Web3 Data Analyst",
      "description": "Web3 Data Analyst specializing in blockchain analytics, DeFi protocols, and on-chain data analysis. Expert in Python, SQL, Dune Analytics with proven Web2 to Web3 transition experience.",
      "url": "https://matthewraphael.xyz",
      "image": profile.avatar || "https://matthewraphael.xyz/profile-image.jpg",
      "email": profile.email || "matthewraphael@matthewraphael.xyz",
      "knowsAbout": [
        "Web3 Data Analysis",
        "Blockchain Analytics",
        "DeFi Protocol Analysis",
        "On-chain Data Analytics",
        "Python Programming",
        "SQL for Blockchain",
        "Dune Analytics",
        "Smart Contract Analytics",
        "Token Economics",
        "NFT Analytics",
        "Data Visualization",
        "Statistical Analysis",
        "Wallet Behavior Analysis",
        "Cryptocurrency Research"
      ],
      "hasSkill": [
        "Python", "SQL", "DuneSQL", "Excel", "Power BI",
        "Data Visualization", "Statistical Modeling", "Blockchain Analytics",
        "Smart Contract Analysis", "DeFi Research", "On-chain Analytics"
      ],
      "sameAs": [
        `https://github.com/${profile.github || 'RaphDeAnalyst'}`,
        `https://twitter.com/${profile.twitter || 'matthew_nnamani'}`,
        `https://linkedin.com/in/${profile.linkedin || 'matthew-nnamani'}`,
        "https://dune.com/raphdeanalyst"
      ],
      "worksFor": {
        "@type": "Organization",
        "name": "Freelance Web3 Analytics"
      },
      "alumniOf": {
        "@type": "EducationalOrganization",
        "name": "Data Analytics Background"
      }
    }
  }

  const generateWebsiteSchema = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Matthew Raphael - Web3 Data Analytics Portfolio",
    "alternateName": "RaphDeAnalyst Portfolio",
    "url": "https://matthewraphael.xyz",
    "description": "Portfolio showcasing Web3 data analytics projects, blockchain dashboards, DeFi analysis, and on-chain insights by Matthew Raphael.",
    "author": {
      "@type": "Person",
      "name": "Matthew Raphael",
      "jobTitle": "Web3 Data Analyst"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://matthewraphael.xyz/portfolio?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "mainEntity": {
      "@type": "Person",
      "name": "Matthew Raphael"
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
        "name": data.author?.name || "Matthew Raphael",
        "jobTitle": "Web3 Data Analyst"
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
      "wordCount": data.content?.split(' ').length || 500
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