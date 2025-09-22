import { Project } from '@/data/projects'
import type { Project as ServiceProject } from '@/types/shared'

interface StructuredDataProps {
  projects: (Project | ServiceProject)[]
  type?: 'portfolio' | 'person' | 'website'
}

export function StructuredData({ projects, type = 'portfolio' }: StructuredDataProps) {
  const baseUrl = 'https://matthewraphael.xyz'

  // Person/Author structured data
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Matthew Raphael',
    jobTitle: 'Web3 Analytics & Data Science Professional',
    description: 'Traditional analytics skills applied to Web3 insights, bridging established data methods with decentralized ecosystems',
    url: baseUrl,
    sameAs: [
      'https://github.com/matthewraphael',
      'https://linkedin.com/in/matthewraphael',
      'https://dune.com/@matthewraphael'
    ],
    knowsAbout: [
      'Web3 Analytics',
      'Data Science',
      'Blockchain Analysis',
      'Dune Analytics',
      'Data Visualization',
      'Traditional Analytics'
    ],
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Data Analyst',
      occupationLocation: {
        '@type': 'Place',
        name: 'Remote'
      }
    }
  }

  // Portfolio/Collection structured data
  const portfolioSchema = {
    '@context': 'https://schema.org',
    '@type': 'Collection',
    name: 'Matthew Raphael - Portfolio',
    description: 'Learning Projects & Case Studies - Explore how I apply traditional analytics skills to Web3 insights',
    url: `${baseUrl}/portfolio`,
    creator: {
      '@type': 'Person',
      name: 'Matthew Raphael'
    },
    numberOfItems: projects.length,
    about: 'Web3 Analytics and Data Science Projects'
  }

  // Individual project structured data
  const projectSchemas = projects
    .filter(project => project.featured)
    .slice(0, 3) // Limit to featured projects to avoid too much structured data
    .map(project => ({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      description: project.description,
      creator: {
        '@type': 'Person',
        name: 'Matthew Raphael'
      },
      dateCreated: project.timeline || '2024',
      genre: project.category,
      keywords: project.tech?.join(', ') || '',
      url: (project as any).blogPostSlug
        ? ((project as any).blogPostSlug.startsWith('http')
          ? (project as any).blogPostSlug
          : `${baseUrl}/blog/${(project as any).blogPostSlug}`)
        : undefined,
      image: project.image || undefined,
      ...(project.status && {
        creativeWorkStatus: project.status
      })
    }))

  // Website structured data
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Matthew Raphael',
    description: 'Web3 Analytics & Data Science Portfolio',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/portfolio?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }

  const getSchemaForType = () => {
    switch (type) {
      case 'person':
        return personSchema
      case 'website':
        return websiteSchema
      case 'portfolio':
      default:
        return [portfolioSchema, ...projectSchemas]
    }
  }

  const schema = getSchemaForType()

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema, null, 2)
      }}
    />
  )
}