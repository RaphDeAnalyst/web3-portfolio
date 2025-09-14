import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SkillsSection } from '../SkillsSection'

describe('SkillsSection', () => {
  it('renders skills section heading', () => {
    render(<SkillsSection />)
    
    expect(screen.getByText('Skills &')).toBeInTheDocument()
    expect(screen.getByText('Expertise')).toBeInTheDocument()
  })

  it('renders skill categories', () => {
    render(<SkillsSection />)
    
    expect(screen.getByText('Core Data Analytics')).toBeInTheDocument()
    expect(screen.getByText('Web3 Analytics')).toBeInTheDocument()
    expect(screen.getByText('Visualization & Tools')).toBeInTheDocument()
  })

  it('renders skill items for each category', () => {
    render(<SkillsSection />)
    
    // Core Data Analytics skills
    expect(screen.getByText('Python')).toBeInTheDocument()
    expect(screen.getByText('SQL')).toBeInTheDocument()
    expect(screen.getByText('Pandas')).toBeInTheDocument()
    
    // Web3 Analytics skills
    expect(screen.getByText('Dune Analytics')).toBeInTheDocument()
    expect(screen.getByText('Flipside Crypto')).toBeInTheDocument()
    
    // Visualization skills
    expect(screen.getByText('D3.js')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('renders category descriptions', () => {
    render(<SkillsSection />)
    
    expect(screen.getByText('Foundation skills from traditional analytics')).toBeInTheDocument()
    expect(screen.getByText('Specialized blockchain and DeFi analysis tools')).toBeInTheDocument()
    expect(screen.getByText('Creating compelling data stories and dashboards')).toBeInTheDocument()
  })

  it('renders CTA button with correct link', () => {
    render(<SkillsSection />)
    
    const ctaButton = screen.getByRole('button', { name: 'Learn More About My Journey' })
    expect(ctaButton).toBeInTheDocument()
    
    const link = ctaButton.closest('a')
    expect(link).toHaveAttribute('href', '/about')
  })

  it('has proper section structure and styling', () => {
    render(<SkillsSection />)
    
    const section = screen.getByRole('region')
    expect(section).toHaveClass('py-32')
    
    const statusBadge = screen.getByText('Technical Arsenal')
    expect(statusBadge).toBeInTheDocument()
  })
})