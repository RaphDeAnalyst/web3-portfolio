'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { logger } from '../logger'

/**
 * Server action to invalidate blog post caches when dashboards are updated
 */
export async function invalidateBlogCache(dashboardId?: string) {
  try {
    // Revalidate all blog posts since we can't easily determine which ones use specific dashboards
    revalidatePath('/blog', 'page')
    revalidatePath('/blog/[slug]', 'page')

    // Also revalidate the homepage and portfolio if they use dashboards
    revalidatePath('/', 'page')
    revalidatePath('/portfolio', 'page')

    logger.info(`Cache invalidated for dashboard updates${dashboardId ? ` (dashboard: ${dashboardId})` : ''}`)
  } catch (error) {
    logger.error('Failed to invalidate cache:', error)
  }
}

/**
 * Server action to invalidate blog post caches when content is updated
 */
export async function invalidateBlogPostCache(slug?: string) {
  try {
    // Revalidate specific blog post if slug provided
    if (slug) {
      revalidatePath(`/blog/${slug}`, 'page')
    }

    // Revalidate blog listing and related pages
    revalidatePath('/blog', 'page')
    revalidatePath('/blog/[slug]', 'page')
    revalidatePath('/admin/posts', 'page')

    // Also revalidate the homepage if it displays blog posts
    revalidatePath('/', 'page')

    logger.info(`Blog post cache invalidated${slug ? ` (post: ${slug})` : ''}`)
  } catch (error) {
    logger.error('Failed to invalidate blog post cache:', error)
  }
}

/**
 * Server action to invalidate project caches when content is updated
 */
export async function invalidateProjectCache() {
  try {
    // Revalidate portfolio and related pages
    revalidatePath('/portfolio', 'page')
    revalidatePath('/admin/projects', 'page')

    // Also revalidate the homepage if it displays projects
    revalidatePath('/', 'page')

    logger.info('Project cache invalidated')
  } catch (error) {
    logger.error('Failed to invalidate project cache:', error)
  }
}

/**
 * Server action to invalidate dashboard-specific caches
 */
export async function invalidateDashboardCache() {
  try {
    revalidatePath('/admin/dashboards', 'page')
    revalidateTag('dashboards')

    logger.info('Dashboard cache invalidated')
  } catch (error) {
    logger.error('Failed to invalidate dashboard cache:', error)
  }
}