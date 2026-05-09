import { MetadataRoute } from 'next'
import { projectServiceSupabase } from '@/lib/project-service-supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://matthewraphael.xyz'

  // Fetch all projects from Supabase for sitemap
  let projectUrls: MetadataRoute.Sitemap = []
  try {
    const projects = await projectServiceSupabase.getAllProjects()
    projectUrls = projects.map((project) => ({
      url: `${baseUrl}/work/${project.id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  } catch (error) {
    // If projects fail to load, continue with empty project list
    console.error('Failed to fetch projects for sitemap:', error)
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...projectUrls,
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]
}
