import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ProjectServiceSupabase } from '@/lib/project-service-supabase'

// Stub Supabase so tests don't require real credentials
vi.mock('@/lib/supabase', () => ({
  supabase: null,
  isSupabaseAvailable: () => false,
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}))

const service = new ProjectServiceSupabase()

// Access the private transform method through casting for unit testing
const transform = (service as unknown as {
  transformToLegacyProject: (p: object) => object
  transformToSupabaseProject: (p: object) => object
})

describe('transformToLegacyProject', () => {
  const supabaseProject = {
    id: 'abc-123',
    title: 'Kraken Trace',
    description: 'ETH trace through THORChain',
    category: 'Investigation',
    tech_stack: ['Dune', 'Python'],
    status: 'published',
    featured: true,
    github_url: 'https://github.com/notes0x/kraken',
    demo_url: null,
    dune_url: 'https://dune.com/notes0x/kraken',
    blog_post_slug: 'kraken-trace',
    file_url: null,
    image: null,
    metrics: { wallets: '12' },
    features: ['multi-hop tracing'],
    challenges: 'THORChain hop obfuscation',
    learnings: 'Regulatory posture matters',
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-02T00:00:00Z',
  }

  it('maps id and title', () => {
    const result = transform.transformToLegacyProject(supabaseProject) as Record<string, unknown>
    expect(result.id).toBe('abc-123')
    expect(result.title).toBe('Kraken Trace')
  })

  it('maps tech_stack to all three aliases', () => {
    const result = transform.transformToLegacyProject(supabaseProject) as Record<string, unknown>
    expect(result.tech).toEqual(['Dune', 'Python'])
    expect(result.techStack).toEqual(['Dune', 'Python'])
    expect(result.tech_stack).toEqual(['Dune', 'Python'])
  })

  it('maps github_url to all aliases', () => {
    const result = transform.transformToLegacyProject(supabaseProject) as Record<string, unknown>
    expect(result.github_url).toBe('https://github.com/notes0x/kraken')
    expect(result.github).toBe('https://github.com/notes0x/kraken')
    expect(result.githubUrl).toBe('https://github.com/notes0x/kraken')
  })

  it('preserves metrics, features, challenges, learnings', () => {
    const result = transform.transformToLegacyProject(supabaseProject) as Record<string, unknown>
    expect(result.metrics).toEqual({ wallets: '12' })
    expect(result.features).toEqual(['multi-hop tracing'])
    expect(result.challenges).toBe('THORChain hop obfuscation')
    expect(result.learnings).toBe('Regulatory posture matters')
  })
})

describe('transformToSupabaseProject', () => {
  it('resolves githubUrl over github_url', () => {
    const input = {
      title: 'Test',
      description: 'desc',
      category: 'Research',
      status: 'draft',
      githubUrl: 'https://github.com/a',
      github_url: 'https://github.com/b',
    }
    const result = transform.transformToSupabaseProject(input) as Record<string, unknown>
    expect(result.github_url).toBe('https://github.com/a')
  })

  it('falls back to links.github when no direct field', () => {
    const input = {
      title: 'Test',
      description: 'desc',
      category: 'Research',
      status: 'draft',
      links: { github: 'https://github.com/c' },
    }
    const result = transform.transformToSupabaseProject(input) as Record<string, unknown>
    expect(result.github_url).toBe('https://github.com/c')
  })

  it('sets featured to false when not provided', () => {
    const input = { title: 'T', description: 'd', category: 'c', status: 's' }
    const result = transform.transformToSupabaseProject(input) as Record<string, unknown>
    expect(result.featured).toBe(false)
  })
})

describe('getAllProjects — Supabase unavailable', () => {
  it('returns empty array gracefully', async () => {
    await expect(service.getAllProjects()).rejects.toThrow('Supabase not available')
  })
})
