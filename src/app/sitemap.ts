import { MetadataRoute } from 'next'
import { blogService, projectService } from '@/lib/service-switcher'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://matthewraphael.xyz'

  // Static routes with SEO priorities
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  try {
    // Get dynamic content for sitemap
    const [projects, blogPosts] = await Promise.all([
      projectService.getAllProjects().catch(() => []),
      blogService.getAllPosts().catch(() => []),
    ])

    // Add blog posts to sitemap
    const blogRoutes = blogPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.createdAt || new Date()),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

    // Add individual projects if they have detail pages
    const projectRoutes = projects
      .filter((project) => project.featured || project.demoUrl) // Only include notable projects
      .map((project) => ({
        url: `${baseUrl}/portfolio/${project.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      }))

    return [...staticRoutes, ...blogRoutes, ...projectRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static routes if dynamic content fails
    return staticRoutes
  }
}