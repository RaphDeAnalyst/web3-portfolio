import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BlogSection } from '../BlogSection'

const mockFeaturedPosts = [
  {
    id: '1',
    slug: 'test-post-1',
    title: 'Understanding DeFi Analytics',
    summary: 'A deep dive into decentralized finance analytics',
    category: 'Analytics',
    date: '2024-01-15',
    readTime: '5 min read'
  },
  {
    id: '2', 
    slug: 'test-post-2',
    title: 'Web3 Data Visualization',
    summary: 'Creating compelling visualizations for blockchain data',
    category: 'Visualization',
    date: '2024-01-10',
    readTime: '7 min read'
  }
]

describe('BlogSection', () => {
  it('renders loading state correctly', () => {
    render(<BlogSection loading={true} />)
    
    expect(screen.getByText('Featured')).toBeInTheDocument()
    expect(screen.getByText('Blog Posts')).toBeInTheDocument()
    
    // Should show skeleton loaders
    const skeletons = screen.getAllByRole('generic')
    const loadingSkeletons = skeletons.filter(el => el.classList.contains('animate-pulse'))
    expect(loadingSkeletons.length).toBeGreaterThan(0)
  })

  it('renders featured posts when provided', () => {
    render(<BlogSection featuredPosts={mockFeaturedPosts} loading={false} />)
    
    expect(screen.getByText('Understanding DeFi Analytics')).toBeInTheDocument()
    expect(screen.getByText('Web3 Data Visualization')).toBeInTheDocument()
    
    expect(screen.getByText('A deep dive into decentralized finance analytics')).toBeInTheDocument()
    expect(screen.getByText('Creating compelling visualizations for blockchain data')).toBeInTheDocument()
  })

  it('renders empty state when no featured posts', () => {
    render(<BlogSection featuredPosts={[]} loading={false} />)
    
    expect(screen.getByText('No Featured Blog Posts')).toBeInTheDocument()
    expect(screen.getByText('Featured blog posts will appear here once they\'re selected in the admin panel.')).toBeInTheDocument()
    
    const viewAllButton = screen.getByRole('button', { name: 'View All Posts' })
    expect(viewAllButton).toBeInTheDocument()
  })

  it('renders post categories and metadata correctly', () => {
    render(<BlogSection featuredPosts={mockFeaturedPosts} loading={false} />)
    
    expect(screen.getByText('Analytics')).toBeInTheDocument()
    expect(screen.getByText('Visualization')).toBeInTheDocument()
    expect(screen.getByText('2024-01-15')).toBeInTheDocument()
    expect(screen.getByText('5 min read')).toBeInTheDocument()
  })

  it('renders View All Posts CTA when posts exist', () => {
    render(<BlogSection featuredPosts={mockFeaturedPosts} loading={false} />)
    
    const ctaButtons = screen.getAllByRole('button', { name: 'View All Posts' })
    expect(ctaButtons.length).toBeGreaterThan(0)
    
    const link = ctaButtons[0].closest('a')
    expect(link).toHaveAttribute('href', '/blog')
  })

  it('renders correct post links', () => {
    render(<BlogSection featuredPosts={mockFeaturedPosts} loading={false} />)
    
    const postLinks = screen.getAllByRole('link')
    const postContentLinks = postLinks.filter(link => 
      link.getAttribute('href')?.startsWith('/blog/')
    )
    
    expect(postContentLinks.length).toBe(2)
    expect(postContentLinks[0]).toHaveAttribute('href', '/blog/test-post-1')
    expect(postContentLinks[1]).toHaveAttribute('href', '/blog/test-post-2')
  })
})