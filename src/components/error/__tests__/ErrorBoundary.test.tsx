import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ErrorBoundary } from '../ErrorBoundary'
import React from 'react'

// Test component that throws an error
function ThrowError({ shouldThrow = false }: { shouldThrow?: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>Working component</div>
}

// Mock console.error to avoid noise in tests
const originalConsoleError = console.error
beforeEach(() => {
  console.error = vi.fn()
})

afterAll(() => {
  console.error = originalConsoleError
})

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Working component</div>
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Working component')).toBeInTheDocument()
  })

  it('renders error UI when child component throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('An unexpected error occurred.')).toBeInTheDocument()
  })

  it('renders section-specific error message', () => {
    render(
      <ErrorBoundary section="Hero">
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('There was an error loading the Hero section.')).toBeInTheDocument()
  })

  it('renders custom fallback UI when provided', () => {
    const customFallback = <div>Custom error message</div>
    
    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Custom error message')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })

  it('calls onError callback when error occurs', () => {
    const onError = vi.fn()
    
    render(
      <ErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Test error' }),
      expect.objectContaining({ componentStack: expect.any(String) })
    )
  })

  it('renders Try Again button that resets error state', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    
    const tryAgainButton = screen.getByRole('button', { name: 'Try Again' })
    fireEvent.click(tryAgainButton)
    
    // Re-render with no error to simulate successful retry
    rerender(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Working component')).toBeInTheDocument()
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument()
  })

  it('renders Refresh Page button', () => {
    // Mock window.location.reload
    const mockReload = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true,
    })
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    const refreshButton = screen.getByRole('button', { name: 'Refresh Page' })
    fireEvent.click(refreshButton)
    
    expect(mockReload).toHaveBeenCalled()
  })

  it('shows development error details in development mode', () => {
    // Mock development environment
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Error Details (Development)')).toBeInTheDocument()
    
    // Restore original environment
    process.env.NODE_ENV = originalEnv
  })

  it('logs errors with section information', () => {
    const consoleSpy = vi.spyOn(console, 'error')
    
    render(
      <ErrorBoundary section="Test Section">
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error in Test Section:',
      expect.objectContaining({ message: 'Test error' })
    )
  })
})