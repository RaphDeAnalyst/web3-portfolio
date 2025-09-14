import { supabase } from './supabase'
import { blogService as legacyBlogService } from './blog-service'
import { ProjectService as legacyProjectService } from './project-service'
import { MediaMigration } from './media-migration'

export class DataMigration {
  // Migrate blog posts from localStorage to Supabase
  static async migrateBlogPosts(): Promise<{ success: number; errors: number }> {
    let success = 0
    let errors = 0

    try {
      // Get existing posts from localStorage
      const existingPosts = legacyBlogService.getAllPosts()
      
      if (existingPosts.length === 0) {
        console.log('No blog posts to migrate')
        return { success, errors }
      }

      console.log(`Starting migration of ${existingPosts.length} blog posts...`)

      for (const post of existingPosts) {
        try {
          // Transform to Supabase format
          const blogData = {
            title: post.title,
            slug: post.slug,
            summary: post.summary,
            content: post.content,
            category: post.category,
            tags: post.tags,
            author_name: post.author.name,
            author_avatar: post.author.avatar,
            date: post.date,
            read_time: post.readTime,
            status: post.status,
            featured: post.featured || false,
            featured_image: post.featuredImage,
            views: post.views || 0,
            origin: post.origin || 'user'
          }

          // Check if post already exists
          const { data: existing } = await supabase
            .from('blogs')
            .select('id')
            .eq('slug', post.slug)
            .single()

          if (existing) {
            // Update existing post
            const { error } = await supabase
              .from('blogs')
              .update(blogData)
              .eq('id', existing.id)

            if (error) {
              console.error(`Error updating blog post "${post.title}":`, error)
              errors++
            } else {
              console.log(`Updated blog post: ${post.title}`)
              success++
            }
          } else {
            // Insert new post
            const { error } = await supabase
              .from('blogs')
              .insert([blogData])

            if (error) {
              console.error(`Error inserting blog post "${post.title}":`, error)
              errors++
            } else {
              console.log(`Migrated blog post: ${post.title}`)
              success++
            }
          }
        } catch (error) {
          console.error(`Error migrating blog post "${post.title}":`, error)
          errors++
        }
      }

      console.log(`Blog migration completed: ${success} successful, ${errors} errors`)
      return { success, errors }
    } catch (error) {
      console.error('Error in blog migration:', error)
      return { success, errors }
    }
  }

  // Migrate projects from localStorage to Supabase
  static async migrateProjects(): Promise<{ success: number; errors: number }> {
    let success = 0
    let errors = 0

    try {
      // Get existing projects from localStorage
      const legacyService = new legacyProjectService()
      const existingProjects = legacyService.getAllProjects()
      
      if (existingProjects.length === 0) {
        console.log('No projects to migrate')
        return { success, errors }
      }

      console.log(`Starting migration of ${existingProjects.length} projects...`)

      for (const project of existingProjects) {
        try {
          // Transform to Supabase format
          const projectData = {
            title: project.title,
            description: project.description,
            category: project.category,
            tech_stack: (project as any).techStack || (project as any).tech || [],
            status: project.status,
            featured: project.featured || false,
            github_url: (project as any).github || (project as any).githubUrl,
            demo_url: (project as any).demo || (project as any).demoUrl,
            image: (project as any).image
          }

          // Check if project already exists
          const { data: existing } = await supabase
            .from('projects')
            .select('id')
            .eq('title', project.title)
            .single()

          if (existing) {
            // Update existing project
            const { error } = await supabase
              .from('projects')
              .update(projectData)
              .eq('id', existing.id)

            if (error) {
              console.error(`Error updating project "${project.title}":`, error)
              errors++
            } else {
              console.log(`Updated project: ${project.title}`)
              success++
            }
          } else {
            // Insert new project
            const { error } = await supabase
              .from('projects')
              .insert([projectData])

            if (error) {
              console.error(`Error inserting project "${project.title}":`, error)
              errors++
            } else {
              console.log(`Migrated project: ${project.title}`)
              success++
            }
          }
        } catch (error) {
          console.error(`Error migrating project "${project.title}":`, error)
          errors++
        }
      }

      console.log(`Project migration completed: ${success} successful, ${errors} errors`)
      return { success, errors }
    } catch (error) {
      console.error('Error in project migration:', error)
      return { success, errors }
    }
  }

  // Migrate activities from localStorage to Supabase
  static async migrateActivities(): Promise<{ success: number; errors: number }> {
    let success = 0
    let errors = 0

    try {
      // Get existing activities from localStorage
      const existingActivities = JSON.parse(localStorage.getItem('portfolio_activities') || '[]')
      
      if (existingActivities.length === 0) {
        console.log('No activities to migrate')
        return { success, errors }
      }

      console.log(`Starting migration of ${existingActivities.length} activities...`)

      for (const activity of existingActivities) {
        try {
          // Transform to Supabase format
          const activityData = {
            date: activity.date,
            type: activity.type,
            title: activity.title,
            intensity: activity.intensity
          }

          // Check if activity already exists
          const { data: existing } = await supabase
            .from('activities')
            .select('id')
            .eq('date', activity.date)
            .eq('title', activity.title)
            .single()

          if (!existing) {
            // Insert new activity
            const { error } = await supabase
              .from('activities')
              .insert([activityData])

            if (error) {
              console.error(`Error inserting activity "${activity.title}":`, error)
              errors++
            } else {
              console.log(`Migrated activity: ${activity.title}`)
              success++
            }
          } else {
            console.log(`Activity already exists: ${activity.title}`)
            success++
          }
        } catch (error) {
          console.error(`Error migrating activity "${activity.title}":`, error)
          errors++
        }
      }

      console.log(`Activity migration completed: ${success} successful, ${errors} errors`)
      return { success, errors }
    } catch (error) {
      console.error('Error in activity migration:', error)
      return { success, errors }
    }
  }

  // Migrate media files from localStorage to Supabase
  static async migrateMediaFiles(): Promise<{ success: number; errors: number }> {
    console.log('Starting media file migration...')
    const result = await MediaMigration.migrateAll()
    return {
      success: result.success,
      errors: result.errors
    }
  }

  // Run full migration
  static async migrateAll(): Promise<void> {
    console.log('Starting full data migration to Supabase...')

    const blogResults = await this.migrateBlogPosts()
    const projectResults = await this.migrateProjects()
    const activityResults = await this.migrateActivities()
    const mediaResults = await this.migrateMediaFiles()

    const totalSuccess = blogResults.success + projectResults.success + activityResults.success + mediaResults.success
    const totalErrors = blogResults.errors + projectResults.errors + activityResults.errors + mediaResults.errors

    console.log(`Migration completed:`)
    console.log(`- Total successful: ${totalSuccess}`)
    console.log(`- Total errors: ${totalErrors}`)
    console.log(`- Blog posts: ${blogResults.success} successful, ${blogResults.errors} errors`)
    console.log(`- Projects: ${projectResults.success} successful, ${projectResults.errors} errors`)
    console.log(`- Activities: ${activityResults.success} successful, ${activityResults.errors} errors`)
    console.log(`- Media files: ${mediaResults.success} successful, ${mediaResults.errors} errors`)

    if (totalErrors === 0) {
      console.log('✅ All data migrated successfully!')
    } else {
      console.log('⚠️  Migration completed with some errors. Check the logs above.')
    }
  }

  // Check if migration is needed
  static async needsMigration(): Promise<boolean> {
    try {
      // Check if localStorage has data but Supabase doesn't
      const hasLocalData = (
        localStorage.getItem('blog_posts') ||
        localStorage.getItem('portfolio_projects') ||
        localStorage.getItem('portfolio_activities')
      ) !== null

      if (!hasLocalData) {
        return false
      }

      // Check if Supabase has any user-created data
      const { data: blogs } = await supabase
        .from('blogs')
        .select('id')
        .eq('origin', 'user')
        .limit(1)

      const { data: projects } = await supabase
        .from('projects')
        .select('id')
        .limit(1)

      return hasLocalData && (!blogs || blogs.length === 0) && (!projects || projects.length === 0)
    } catch (error) {
      console.error('Error checking migration status:', error)
      return false
    }
  }
}