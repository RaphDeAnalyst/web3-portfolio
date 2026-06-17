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

/** Deterministic seeded LCG node graph for case detail view */
function buildDetailGraph(seed: number) {
  let s = seed
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }

  const W = 880, H = 495, N = 30, pad = 28
  const pts: [number, number][] = []
  for (let i = 0; i < N; i++) {
    pts.push([pad + rnd() * (W - 2 * pad), pad + rnd() * (H - 2 * pad)])
  }

  const order = pts.map((_, i) => i).sort((a, b) => pts[a][0] - pts[b][0])
  const seen: Record<string, boolean> = {}
  const edges: [number, number][] = []
  const addEdge = (a: number, b: number) => {
    if (a === b) return
    const key = `${Math.min(a, b)}-${Math.max(a, b)}`
    if (!seen[key]) { seen[key] = true; edges.push([a, b]) }
  }
  for (let k = 0; k < order.length - 1; k++) {
    addEdge(order[k], order[k + 1])
    if (k + 2 < order.length && rnd() < 0.45) addEdge(order[k], order[k + 2])
  }

  const flagged: Set<number> = new Set()
  for (let i = 0; i < 5; i++) flagged.add(Math.floor(rnd() * N))

  return { pts, edges, flagged, W, H }
}

function CaseGraphFigure({ seed, title }: { seed: number; title: string }) {
  const { pts, edges, flagged, W, H } = buildDetailGraph(seed)
  return (
    <div
      style={{
        position: 'relative', width: '100%', aspectRatio: '16/9',
        borderRadius: '2px', marginBottom: '14px',
        background: 'var(--bg-secondary)', border: '1px solid var(--card-border)',
        overflow: 'hidden', color: 'var(--text-secondary)',
      }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%" height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, opacity: 0.65 }}
      >
        {edges.map(([a, b], i) => (
          <line
            key={`e${i}`}
            x1={pts[a][0]} y1={pts[a][1]}
            x2={pts[b][0]} y2={pts[b][1]}
            stroke="currentColor" strokeWidth={0.7} strokeOpacity={0.55}
          />
        ))}
        {pts.map((p, i) => (
          flagged.has(i) ? (
            <g key={`n${i}`}>
              <circle cx={p[0]} cy={p[1]} r={9} fill="none" stroke="var(--accent)" strokeWidth={0.8} strokeOpacity={0.45} />
              <circle cx={p[0]} cy={p[1]} r={4.5} fill="var(--accent)" className="gpulse" />
            </g>
          ) : (
            <circle key={`n${i}`} cx={p[0]} cy={p[1]} r={2.4} fill="currentColor" />
          )
        ))}
      </svg>
      <span
        style={{
          position: 'absolute', bottom: '14px', left: '16px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '11px', letterSpacing: '0.1em',
          textTransform: 'uppercase', color: 'var(--text-muted)',
        }}
      >
        Fig.1 — Address graph · {title}
      </span>
    </div>
  )
}

export const revalidate = 300

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const project = await projectServiceSupabase.getProjectById(params.id)
  const title = project?.title || 'Project'
  const description = project?.description || 'Work'

  return {
    title: `${title} | Matthew Raphael Nnamani — On-Chain Investigations`,
    description,
    alternates: { canonical: `https://matthewraphael.xyz/work/${params.id}` },
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
  const seenIds = new Set<string>()
  const charts = [...projectCharts, ...blogCharts].filter(c => {
    if (seenIds.has(c.id)) return false
    seenIds.add(c.id)
    return true
  })

  if (error || !project) {
    return (
      <div style={{ minHeight: 'calc(100vh - 64px)', padding: '72px 32px 64px' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <Link href="/work" style={{ fontSize: '14px', opacity: 0.6, display: 'inline-block', marginBottom: '28px', color: 'var(--text-primary)', textDecoration: 'none' }}>
            ← Work
          </Link>
          <div style={{ marginTop: '32px', padding: '16px', background: 'rgba(226,108,90,0.1)', border: '1px solid rgba(226,108,90,0.3)', borderRadius: '2px', color: 'var(--error)', fontSize: '14px' }}>
            {error || 'Project not found'}
          </div>
        </div>
      </div>
    )
  }

  const title = blogPost?.title || project.title
  const tags = blogPost?.tags || project.tech_stack || []
  const hasFeaturedImage = !!blogPost?.featuredImage

  // Use project index as seed for the graph (deterministic per project)
  const graphSeed = params.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 5)

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', padding: '72px 32px 64px' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>

        {/* Back */}
        <Link
          href="/work"
          className="link-fade"
          style={{ fontSize: '14px', display: 'inline-block', marginBottom: '28px', color: 'var(--text-primary)', textDecoration: 'none' }}
        >
          ← Work
        </Link>

        {/* Case meta row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          {project.category && (
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11px', letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--text-muted)',
              }}
            >
              {project.category}
            </span>
          )}
          {(blogPost?.date || blogPost?.readTime) && (
            <>
              <span style={{ width: '14px', height: '1px', background: 'var(--separator)', display: 'inline-block' }} />
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '11px', letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: 'var(--text-muted)',
                }}
              >
                {[blogPost.date, blogPost.readTime].filter(Boolean).join(' · ')}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h1
          className="font-serif"
          style={{
            fontWeight: 700,
            fontSize: 'clamp(32px, 5vw, 52px)',
            lineHeight: 1.08, margin: '0 0 18px',
            color: 'var(--text-primary)',
          }}
        >
          {title}
        </h1>

        {/* Summary / lead */}
        {(blogPost?.summary || project.description) && (
          <p
            style={{
              fontSize: '19px', lineHeight: 1.6, opacity: 0.78,
              margin: '0 0 28px', color: 'var(--text-primary)', maxWidth: '680px',
            }}
          >
            {blogPost?.summary || project.description}
          </p>
        )}

        {/* Featured image or node graph figure */}
        {hasFeaturedImage ? (
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '2px', marginBottom: '14px', background: 'var(--bg-secondary)', overflow: 'hidden' }}>
            <Image
              src={blogPost!.featuredImage!}
              alt={title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 820px"
            />
          </div>
        ) : (
          <CaseGraphFigure seed={graphSeed} title={title} />
        )}

        {/* Tags + external links */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {tags.map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '12px', padding: '4px 10px',
                  border: '1px solid var(--border)', borderRadius: '9999px',
                  color: 'var(--text-secondary)', opacity: 0.7,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <span style={{ marginLeft: 'auto', display: 'inline-flex', gap: '18px' }}>
            {project.file_url && (
              <a
                href={project.file_url}
                target="_blank" rel="noopener noreferrer"
                className="link-fade"
                style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', textDecoration: 'none' }}
              >
                PDF Report ↗
              </a>
            )}
            {project.duneUrl && (
              <a
                href={project.duneUrl}
                target="_blank" rel="noopener noreferrer"
                className="link-fade"
                style={{ fontSize: '15px', fontWeight: 500, color: 'var(--text-primary)', textDecoration: 'none' }}
              >
                {getLinkLabel(project.duneUrl)} ↗
              </a>
            )}
          </span>
        </div>

        {/* Markdown body */}
        {blogPost?.content ? (
          <div style={{ marginTop: '40px' }} className="prose dark:prose-invert max-w-none">
            <MarkdownRenderer content={blogPost.content} />
          </div>
        ) : !project.file_url && !project.duneUrl ? (
          <div style={{ textAlign: 'center', padding: '48px 0', opacity: 0.5 }}>
            <p>No write-up yet. Check back soon.</p>
          </div>
        ) : null}

        {/* On-Chain Data */}
        {charts.length > 0 && (
          <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--separator)' }}>
            <p
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11px', textTransform: 'uppercase',
                letterSpacing: '0.16em', margin: '0 0 24px', color: 'var(--text-muted)',
              }}
            >
              On-Chain Data
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
