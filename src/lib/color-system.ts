// Shared color system for navigation and page sections
// This ensures consistent theming across navbar and page cards

import { User, FolderOpen, BookOpen, MessageCircle } from 'lucide-react'

export interface SectionColors {
  name: string
  href: string
  icon: any // Lucide icon component

  // Base colors
  primary: string         // Main color for text/borders
  primaryHover: string    // Lighter shade for hover states
  primaryActive: string   // Active/pressed state

  // Background gradients
  gradient: string        // Light background gradient
  hoverGradient: string   // Enhanced hover gradient

  // Tailwind classes for dynamic usage
  bgClass: string         // Background class
  textClass: string       // Text color class
  borderClass: string     // Border color class

  // For card-specific styling
  cardGradient: string    // Card gradient colors
}

export const navigationColors: Record<string, SectionColors> = {
  '/': {
    name: 'Home',
    href: '/',
    icon: null, // Home doesn't need an icon in cards
    primary: '#6366f1', // Indigo
    primaryHover: '#818cf8',
    primaryActive: '#4f46e5',
    gradient: 'from-indigo-500/10 to-purple-600/10',
    hoverGradient: 'from-indigo-500/20 to-purple-600/20',
    bgClass: 'bg-indigo-500/10',
    textClass: 'text-indigo-500',
    borderClass: 'border-indigo-500',
    cardGradient: 'from-indigo-500 to-purple-600'
  },

  '/about': {
    name: 'About',
    href: '/about',
    icon: User,
    primary: '#3b82f6', // Blue
    primaryHover: '#60a5fa',
    primaryActive: '#2563eb',
    gradient: 'from-blue-500/10 to-purple-600/10',
    hoverGradient: 'from-blue-500/20 to-purple-600/20',
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-500',
    borderClass: 'border-blue-500',
    cardGradient: 'from-blue-500 to-purple-600'
  },

  '/portfolio': {
    name: 'Portfolio',
    href: '/portfolio',
    icon: FolderOpen,
    primary: '#10b981', // Green
    primaryHover: '#34d399',
    primaryActive: '#059669',
    gradient: 'from-green-500/10 to-emerald-600/10',
    hoverGradient: 'from-green-500/20 to-emerald-600/20',
    bgClass: 'bg-green-500/10',
    textClass: 'text-green-500',
    borderClass: 'border-green-500',
    cardGradient: 'from-green-500 to-emerald-600'
  },

  '/blog': {
    name: 'Blog',
    href: '/blog',
    icon: BookOpen,
    primary: '#f97316', // Orange
    primaryHover: '#fb923c',
    primaryActive: '#ea580c',
    gradient: 'from-orange-500/10 to-red-600/10',
    hoverGradient: 'from-orange-500/20 to-red-600/20',
    bgClass: 'bg-orange-500/10',
    textClass: 'text-orange-500',
    borderClass: 'border-orange-500',
    cardGradient: 'from-orange-500 to-red-600'
  },

  '/contact': {
    name: 'Contact',
    href: '/contact',
    icon: MessageCircle,
    primary: '#8b5cf6', // Purple
    primaryHover: '#a78bfa',
    primaryActive: '#7c3aed',
    gradient: 'from-purple-500/10 to-pink-600/10',
    hoverGradient: 'from-purple-500/20 to-pink-600/20',
    bgClass: 'bg-purple-500/10',
    textClass: 'text-purple-500',
    borderClass: 'border-purple-500',
    cardGradient: 'from-purple-500 to-pink-600'
  }
}

// Helper function to get colors for a specific route
export function getColorsForRoute(pathname: string): SectionColors | null {
  // Handle exact matches first
  if (navigationColors[pathname]) {
    return navigationColors[pathname]
  }

  // Handle nested routes (e.g., /blog/some-post should use /blog colors)
  const baseRoute = Object.keys(navigationColors).find(route => {
    if (route === '/') return pathname === '/'
    return pathname.startsWith(route)
  })

  return baseRoute ? navigationColors[baseRoute] : null
}

// Get all navigation items for components that need the full list
export function getAllNavigationItems(): SectionColors[] {
  return Object.values(navigationColors).filter(item => item.href !== '/') // Exclude home from main nav
}