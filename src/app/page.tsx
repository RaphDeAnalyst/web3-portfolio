import { logger } from '@/lib/logger'
import { blogService, projectService, profileService } from '@/lib/service-switcher'
import { HomeClient } from './home-client'

// Server-side data fetching for homepage with ISR
export const revalidate = 300 // Revalidate every 5 minutes

export default async function Home() {
  try {
    const [projects, posts, profile] = await Promise.all([
      projectService.getFeaturedProjects(),
      blogService.getFeaturedPosts(),
      profileService.getProfile()
    ])

    return (
      <HomeClient
        initialFeaturedProjects={projects}
        initialFeaturedPosts={posts}
        profile={profile}
      />
    )
  } catch (error) {
    logger.error('Error loading homepage data', error)

    // Fallback to original posts if profile loading fails
    try {
      const [projects, posts] = await Promise.all([
        projectService.getFeaturedProjects(),
        blogService.getFeaturedPosts()
      ])

      return (
        <HomeClient
          initialFeaturedProjects={projects}
          initialFeaturedPosts={posts}
          profile={{ name: 'Matthew Raphael', avatar: null }}
        />
      )
    } catch (fallbackError) {
      logger.error('Error loading fallback homepage data', fallbackError)

      // Final fallback with empty data
      return (
        <HomeClient
          initialFeaturedProjects={[]}
          initialFeaturedPosts={[]}
          profile={{ name: 'Matthew Raphael', avatar: null }}
        />
      )
    }
  }
}