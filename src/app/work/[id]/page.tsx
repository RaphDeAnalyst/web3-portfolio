import Image from 'next/image'
import Link from 'next/link'
import { projectServiceSupabase } from '@/lib/project-service-supabase'
import { blogServiceSupabase } from '@/lib/blog-service-supabase'
import { getChartsForProject, getChartsForBlog } from '@/lib/dune-cache-service'
import { MarkdownRenderer } from '@/components/ui/markdown-renderer'
import { DuneChartCard } from '@/components/dune/DuneChartCard'
import type { Project } from '@/lib/project-service-supabase'
import type { BlogPostData } from '@/lib/blog-service-supabase'
import type { Metadata } from 'next'

function getLinkLabel(url: string): string {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname.toLowerCase()

    if (hostname.includes('dune.com')) return 'View on Dune'
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'View on X'
    if (hostname.includes('github.com')) return 'View on GitHub'
    if (hostname.includes('etherscan.io') || hostname.includes('basescan.org') || hostname.includes('arbiscan.io')) return 'View on Block Explorer'
    if (hostname.includes('linkedin.com')) return 'View on LinkedIn'

    return 'View Link'
  } catch {
    return 'View Link'
  }
}

export const revalidate = 300

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const project = await projectServiceSupabase.getProjectById(params.id)
  const title = project?.title || 'Project'
  const description = project?.description || 'Work'

  return {
    title: `${title} | Matthew Raphael Nnamani — On-Chain Investigations`,
    description,
    alternates: {
      canonical: `https://matthewraphael.xyz/work/${params.id}`,
    },
    openGraph: {
      title,
      description,
      url: `https://matthewraphael.xyz/work/${params.id}`,
    },
  }
}

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  let project: Project | null = null
  let blogPost: BlogPostData | null = null
  let error: string | null = null

  try {
    project = await projectServiceSupabase.getProjectById(params.id)
    if (!project) {
      error = 'Project not found'
    } else if (project.blogPostSlug) {
      blogPost = await blogServiceSupabase.getPostBySlug(project.blogPostSlug) || null
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load project'
  }

  const [projectCharts, blogCharts] = await Promise.all([
    project ? getChartsForProject(params.id).catch(() => []) : Promise.resolve([]),
    blogPost?.id ? getChartsForBlog(blogPost.id).catch(() => []) : Promise.resolve([]),
  ])
  // merge, deduplicate by chart id
  const seenIds = new Set<string>()
  const charts = [...projectCharts, ...blogCharts].filter(c => {
    if (seenIds.has(c.id)) return false
    seenIds.add(c.id)
    return true
  })

  if (error || !project) {
    return (
      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/work" className="text-sm opacity-60 hover:opacity-100 mb-4 inline-block">
            ← Work
          </Link>
          <div className="mt-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300">
            {error || 'Project not found'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link href="/work" className="text-sm opacity-60 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground mb-8 inline-block transition-opacity rounded">
          ← Work
        </Link>

        {/* Project header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            {blogPost?.title || project.title}
          </h1>

          {/* Blog metadata */}
          {blogPost && (
            <div className="flex items-center gap-4 text-sm opacity-65 mb-4">
              {blogPost.date && <span>{blogPost.date}</span>}
              {blogPost.readTime && (
                <>
                  <span>•</span>
                  <span>{blogPost.readTime}</span>
                </>
              )}
              {blogPost.category && (
                <>
                  <span>•</span>
                  <span>{blogPost.category}</span>
                </>
              )}
            </div>
          )}

          {/* Summary */}
          {blogPost?.summary && (
            <p className="text-lg opacity-75 mb-6">
              {blogPost.summary}
            </p>
          )}

          {/* Featured Image */}
          {blogPost?.featuredImage && (
            <div className="mb-8 rounded-lg overflow-hidden bg-gray-900">
              <Image
                src={blogPost.featuredImage}
                alt={blogPost.title}
                width={800}
                height={450}
                priority
                className="w-full h-auto object-cover"
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          )}

          {/* Tags and Links */}
          <div className="flex flex-wrap items-center gap-3">
            {((blogPost?.tags?.length ?? 0) > 0 || (project?.tech_stack?.length ?? 0) > 0) && (
              <div className="flex flex-wrap gap-2">
                {(blogPost?.tags || project?.tech_stack || []).map((tag) => (
                  <span
                    key={tag}
                    className="inline-block text-xs font-medium px-2 py-1 rounded"
                    style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {project?.file_url && (
              <a
                href={project.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-medium opacity-60 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-opacity rounded"
              >
                PDF Report ↗
              </a>
            )}
            {project?.duneUrl && (
              <a
                href={project.duneUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-medium opacity-60 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-opacity rounded"
              >
                {getLinkLabel(project.duneUrl)} ↗
              </a>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="prose dark:prose-invert max-w-none">
          {blogPost && blogPost.content ? (
            <MarkdownRenderer content={blogPost.content} />
          ) : project?.file_url || project?.duneUrl ? (
            <div className="py-12">
              <p className="text-lg opacity-75 leading-relaxed">
                {project.description}
              </p>
            </div>
          ) : (
            <div className="text-center py-12 opacity-50">
              <p>No write-up yet. Check back soon!</p>
            </div>
          )}
        </div>

        {/* Dune charts linked to this project */}
        {charts.length > 0 && (
          <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--separator)' }}>
            <p className="text-xs font-mono uppercase tracking-wider mb-6" style={{ color: 'var(--text-muted)' }}>
              On-Chain Data
            </p>
            <div className="grid grid-cols-1 gap-6">
              {charts.map(chart => (
                <DuneChartCard key={chart.id} chart={chart} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
