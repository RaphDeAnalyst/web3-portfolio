'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'
import { getColorsForRoute } from '@/lib/color-system'

interface NavLinkProps {
  href: string
  children: ReactNode
  className?: string
  activeClassName?: string
  inactiveClassName?: string
  exact?: boolean
  variant?: 'default' | 'sidebar' | 'mobile' | 'tab'
  onClick?: () => void
}

export function NavLink({
  href,
  children,
  className = '',
  activeClassName,
  inactiveClassName,
  exact = true,
  variant = 'default',
  onClick,
}: NavLinkProps) {
  const pathname = usePathname()

  // Determine if this link is active
  const isActive = exact
    ? pathname === href
    : pathname?.startsWith(href) && href !== '/' // Special case for root path

  // Get dynamic colors for this route
  const routeColors = getColorsForRoute(href)

  // Define variant-specific styles with dynamic colors
  const getVariantStyles = () => {
    switch (variant) {
      case 'sidebar':
        return {
          base: 'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 w-full',
          active: routeColors
            ? `font-bold border-l-2`
            : 'bg-foreground/10 text-foreground font-bold border-l-2 border-foreground',
          inactive: 'text-foreground/70 hover:bg-foreground/5 hover:text-foreground'
        }
      case 'mobile':
        return {
          base: 'block px-4 py-3 rounded-lg font-medium transition-all duration-200 w-full',
          active: routeColors
            ? `font-bold border-l-2`
            : 'text-foreground bg-foreground/10 border-l-2 border-foreground font-bold',
          inactive: 'text-foreground/80 hover:text-foreground hover:bg-foreground/5'
        }
      case 'tab':
        return {
          base: 'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative',
          active: routeColors
            ? `font-bold`
            : 'bg-foreground/10 text-foreground font-bold',
          inactive: 'text-foreground/70 hover:text-foreground hover:bg-foreground/5'
        }
      default:
        return {
          base: 'px-4 py-2 rounded-lg font-medium transition-all duration-200 relative group',
          active: routeColors
            ? `font-bold`
            : 'text-foreground bg-foreground/10 font-bold',
          inactive: 'text-foreground/80 hover:text-foreground hover:bg-foreground/5'
        }
    }
  }

  const styles = getVariantStyles()

  // Build dynamic style object for active state
  const dynamicStyle = isActive && routeColors ? {
    color: routeColors.primary,
    backgroundColor: routeColors.primary + '15', // 15 = ~8% opacity in hex
    borderColor: routeColors.primary
  } : {}

  // Build dynamic hover style
  const dynamicHoverClass = routeColors && !isActive
    ? 'hover:text-[' + routeColors.primaryHover + '] hover:bg-[' + routeColors.primary + '10]'
    : ''

  // Build the final className
  const finalClassName = [
    styles.base,
    isActive ? (activeClassName || styles.active) : (inactiveClassName || styles.inactive),
    dynamicHoverClass,
    className
  ].filter(Boolean).join(' ')

  return (
    <Link
      href={href}
      className={finalClassName}
      style={dynamicStyle}
      onClick={onClick}
    >
      {children}

      {/* Active indicator for default variant - dynamic color */}
      {variant === 'default' && isActive && (
        <div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full"
          style={{ backgroundColor: routeColors?.primary || 'currentColor' }}
        />
      )}

      {/* Hover effect for default variant - dynamic color */}
      {variant === 'default' && (
        <span
          className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
          style={{ backgroundColor: routeColors?.primary || 'currentColor' }}
        />
      )}
    </Link>
  )
}

// Specialized variants for common use cases
export function SidebarNavLink({ href, children, className, onClick }: Omit<NavLinkProps, 'variant'>) {
  return (
    <NavLink
      href={href}
      variant="sidebar"
      className={className}
      onClick={onClick}
    >
      {children}
    </NavLink>
  )
}

export function MobileNavLink({ href, children, className, onClick }: Omit<NavLinkProps, 'variant'>) {
  return (
    <NavLink
      href={href}
      variant="mobile"
      className={className}
      onClick={onClick}
    >
      {children}
    </NavLink>
  )
}

export function TabNavLink({ href, children, className, onClick }: Omit<NavLinkProps, 'variant'>) {
  return (
    <NavLink
      href={href}
      variant="tab"
      className={className}
      onClick={onClick}
    >
      {children}
    </NavLink>
  )
}