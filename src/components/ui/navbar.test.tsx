/**
 * @vitest-environment jsdom
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { usePathname } from 'next/navigation'
import { Navbar } from './navbar'

// Mock Next.js hooks
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}))

// Mock theme toggle component
vi.mock('./theme-toggle', () => ({
  ThemeToggle: () => <button data-testid="theme-toggle">Theme Toggle</button>
}))

// Mock navbar avatar component
vi.mock('./profile-avatar', () => ({
  NavbarAvatar: () => <div data-testid="navbar-avatar">Avatar</div>
}))

// Mock framer-motion for testing
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => {
      const { variants, initial, animate, exit, transition, layoutId, ...divProps } = props
      return <div {...divProps}>{children}</div>
    },
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

const mockUsePathname = usePathname as vi.MockedFunction<typeof usePathname>

// Mock next-themes useTheme hook
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
    themes: ['light', 'dark'],
  }),
}))

// Helper function to render navbar
const renderNavbar = () => {
  return render(<Navbar />)
}

describe('Navbar Component', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    user = userEvent.setup()
    mockUsePathname.mockReturnValue('/')

    // Mock window.scrollY
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
    })

    // Mock scrollTo for smooth behavior
    window.scrollTo = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
  })

  describe('Desktop Navigation', () => {
    it('renders all navigation links', () => {
      renderNavbar()

      const navItems = ['Home', 'About', 'Portfolio', 'Blog', 'Contact']
      navItems.forEach(item => {
        expect(screen.getByRole('link', { name: item })).toBeInTheDocument()
      })
    })

    it('highlights active page correctly', () => {
      mockUsePathname.mockReturnValue('/about')
      renderNavbar()

      const aboutLink = screen.getByRole('link', { name: 'About' })
      expect(aboutLink).toHaveAttribute('aria-current', 'page')
      expect(aboutLink).toHaveClass('text-primary-600')
    })

    it('renders logo with correct link', () => {
      renderNavbar()

      const logoLink = screen.getByRole('link', { name: 'Navigate to homepage' })
      expect(logoLink).toHaveAttribute('href', '/')
      expect(within(logoLink).getByTestId('navbar-avatar')).toBeInTheDocument()
    })

    it('renders theme toggle', () => {
      renderNavbar()

      expect(screen.getByTestId('theme-toggle')).toBeInTheDocument()
    })
  })

  describe('Mobile Navigation', () => {
    it('shows hamburger button on mobile', () => {
      renderNavbar()

      const hamburgerButton = screen.getByRole('button', { name: 'Open mobile menu' })
      expect(hamburgerButton).toBeInTheDocument()
      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false')
    })

    it('toggles mobile menu when hamburger is clicked', async () => {
      renderNavbar()

      const hamburgerButton = screen.getByRole('button', { name: 'Open mobile menu' })

      // Menu should be closed initially
      expect(screen.queryByRole('menu')).not.toBeInTheDocument()

      // Click to open menu
      await user.click(hamburgerButton)

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument()
        expect(hamburgerButton).toHaveAttribute('aria-expanded', 'true')
        expect(hamburgerButton).toHaveAccessibleName('Close mobile menu')
      })

      // Click to close menu
      await user.click(hamburgerButton)

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
        expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false')
        expect(hamburgerButton).toHaveAccessibleName('Open mobile menu')
      })
    })

    it('closes mobile menu when a link is clicked', async () => {
      renderNavbar()

      const hamburgerButton = screen.getByRole('button', { name: 'Open mobile menu' })
      await user.click(hamburgerButton)

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument()
      })

      const aboutLink = within(screen.getByRole('menu')).getByRole('menuitem', { name: 'About' })
      await user.click(aboutLink)

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      })
    })

    it('shows correct active state in mobile menu', async () => {
      mockUsePathname.mockReturnValue('/portfolio')
      renderNavbar()

      const hamburgerButton = screen.getByRole('button', { name: 'Open mobile menu' })
      await user.click(hamburgerButton)

      await waitFor(() => {
        const menu = screen.getByRole('menu')
        const portfolioLink = within(menu).getByRole('menuitem', { name: 'Portfolio' })
        expect(portfolioLink).toHaveAttribute('aria-current', 'page')
        expect(portfolioLink).toHaveClass('text-primary-600')
      })
    })
  })

  describe('Keyboard Navigation', () => {
    it('closes mobile menu when Escape is pressed', async () => {
      renderNavbar()

      const hamburgerButton = screen.getByRole('button', { name: 'Open mobile menu' })
      await user.click(hamburgerButton)

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument()
      })

      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      })

      // Focus should return to hamburger button
      expect(hamburgerButton).toHaveFocus()
    })

    it('supports tab navigation in mobile menu', async () => {
      renderNavbar()

      const hamburgerButton = screen.getByRole('button', { name: 'Open mobile menu' })
      await user.click(hamburgerButton)

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument()
      })

      // Tab should navigate through menu items
      await user.tab()
      const homeLink = screen.getByRole('menuitem', { name: 'Home' })
      expect(homeLink).toHaveFocus()

      await user.tab()
      const aboutLink = screen.getByRole('menuitem', { name: 'About' })
      expect(aboutLink).toHaveFocus()
    })

    it('supports focus trapping in mobile menu', async () => {
      renderNavbar()

      const hamburgerButton = screen.getByRole('button', { name: 'Open mobile menu' })
      await user.click(hamburgerButton)

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument()
      })

      // Navigate to last item
      const contactLink = screen.getByRole('menuitem', { name: 'Contact' })
      contactLink.focus()

      // Tab from last item should go to first item (focus trap)
      await user.tab()
      const homeLink = screen.getByRole('menuitem', { name: 'Home' })
      expect(homeLink).toHaveFocus()

      // Shift+Tab from first item should go to last item
      await user.keyboard('{Shift>}{Tab}{/Shift}')
      expect(contactLink).toHaveFocus()
    })
  })

  describe('Accessibility Features', () => {
    it('has proper ARIA labels and attributes', () => {
      renderNavbar()

      const nav = screen.getByRole('navigation', { name: 'Main navigation' })
      expect(nav).toBeInTheDocument()

      const hamburgerButton = screen.getByRole('button', { name: 'Open mobile menu' })
      expect(hamburgerButton).toHaveAttribute('aria-controls', 'mobile-menu')
      expect(hamburgerButton).toHaveAttribute('aria-expanded', 'false')
    })

    it('supports screen readers with proper role attributes', async () => {
      renderNavbar()

      const hamburgerButton = screen.getByRole('button', { name: 'Open mobile menu' })
      await user.click(hamburgerButton)

      await waitFor(() => {
        const mobileMenu = screen.getByRole('menu')
        expect(mobileMenu).toHaveAttribute('role', 'menu')
        expect(mobileMenu).toHaveAttribute('aria-orientation', 'vertical')
        expect(mobileMenu).toHaveAttribute('aria-labelledby', 'mobile-menu-button')

        const menuItems = within(mobileMenu).getAllByRole('menuitem')
        expect(menuItems).toHaveLength(5)
      })
    })

    it('provides proper focus indicators', async () => {
      renderNavbar()

      const homeLink = screen.getAllByRole('link', { name: 'Home' })[0]
      homeLink.focus()

      expect(homeLink).toHaveClass('focus:outline-none')
      expect(homeLink).toHaveClass('focus:ring-2')
      expect(homeLink).toHaveClass('focus:ring-primary-500')
    })
  })

  describe('Scroll Behavior', () => {
    it('updates navbar appearance on scroll', async () => {
      renderNavbar()

      const navbar = screen.getByRole('navigation')

      // Initially should have light background
      expect(navbar).toHaveClass('bg-white/80')

      // Simulate scroll
      Object.defineProperty(window, 'scrollY', { value: 50, writable: true })
      fireEvent.scroll(window)

      await waitFor(() => {
        expect(navbar).toHaveClass('bg-white/95')
        expect(navbar).toHaveClass('backdrop-blur-md')
        expect(navbar).toHaveClass('shadow-lg')
      })
    })
  })

  describe('Click Outside Behavior', () => {
    it('closes mobile menu when clicking outside', async () => {
      renderNavbar()

      const hamburgerButton = screen.getByRole('button', { name: 'Open mobile menu' })
      await user.click(hamburgerButton)

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument()
      })

      // Click outside the menu
      fireEvent.mouseDown(document.body)

      await waitFor(() => {
        expect(screen.queryByRole('menu')).not.toBeInTheDocument()
      })
    })

    it('does not close menu when clicking inside menu', async () => {
      renderNavbar()

      const hamburgerButton = screen.getByRole('button', { name: 'Open mobile menu' })
      await user.click(hamburgerButton)

      await waitFor(() => {
        expect(screen.getByRole('menu')).toBeInTheDocument()
      })

      const menu = screen.getByRole('menu')
      fireEvent.mouseDown(menu)

      // Menu should still be open
      expect(menu).toBeInTheDocument()
    })
  })

  describe('Route Matching', () => {
    it('correctly identifies active routes for nested paths', () => {
      mockUsePathname.mockReturnValue('/portfolio/project-1')
      renderNavbar()

      const portfolioLink = screen.getByRole('link', { name: 'Portfolio' })
      expect(portfolioLink).toHaveAttribute('aria-current', 'page')
      expect(portfolioLink).toHaveClass('text-primary-600')
    })

    it('only highlights home for exact root match', () => {
      mockUsePathname.mockReturnValue('/about')
      renderNavbar()

      const homeLink = screen.getByRole('link', { name: 'Home' })
      expect(homeLink).not.toHaveAttribute('aria-current', 'page')
      expect(homeLink).not.toHaveClass('text-primary-600')
    })
  })
})

/**
 * Manual Testing Instructions for Chrome DevTools
 *
 * 1. Mobile View Testing (375px width):
 *    - Open DevTools and set device to "iPhone SE"
 *    - Verify hamburger menu appears
 *    - Click hamburger to open menu
 *    - Test all navigation links work
 *    - Verify menu closes when clicking links
 *    - Test ESC key closes menu
 *    - Verify clicking outside closes menu
 *
 * 2. Tablet View Testing (768px width):
 *    - Set device to "iPad"
 *    - Verify horizontal navigation appears
 *    - Test all links work correctly
 *    - Verify active states show correctly
 *
 * 3. Desktop View Testing (1200px+ width):
 *    - Set to desktop view
 *    - Test hover effects on navigation links
 *    - Verify active link indicators appear
 *    - Test theme toggle functionality
 *    - Test scroll effects on navbar background
 *
 * 4. Accessibility Testing:
 *    - Use keyboard navigation only (Tab, Shift+Tab, Enter, ESC)
 *    - Verify focus indicators are visible
 *    - Test with screen reader (if available)
 *    - Check color contrast in both light/dark modes
 *
 * 5. Animation Testing:
 *    - Test smooth menu open/close animations
 *    - Verify hamburger icon transforms properly
 *    - Check active link indicator animation
 *    - Test scroll-triggered background changes
 */