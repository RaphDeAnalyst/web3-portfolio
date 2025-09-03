'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  systemTheme: 'dark' | 'light'
  effectiveTheme: 'dark' | 'light'
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  systemTheme: 'light',
  effectiveTheme: 'light',
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  storageKey = 'web3-portfolio-theme',
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Server-side safe initialization
    if (typeof window === 'undefined') return defaultTheme
    
    try {
      const stored = localStorage?.getItem(storageKey) as Theme
      return stored || defaultTheme
    } catch {
      return defaultTheme
    }
  })

  const [systemTheme, setSystemTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  const [mounted, setMounted] = useState(false)

  const effectiveTheme: 'dark' | 'light' = theme === 'system' ? systemTheme : theme

  // FOUC Prevention: Apply theme immediately on mount
  useEffect(() => {
    setMounted(true)
  }, [])

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    const body = window.document.body

    // Disable transitions temporarily to prevent flash
    if (disableTransitionOnChange) {
      const css = document.createElement('style')
      css.appendChild(
        document.createTextNode(
          `*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}`
        )
      )
      document.head.appendChild(css)

      // Re-enable transitions after a short delay
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          document.head.removeChild(css)
        })
      })
    }

    // Remove all theme classes
    root.classList.remove('light', 'dark')
    body.classList.remove('light', 'dark')

    // Apply new theme
    const themeToApply = effectiveTheme
    root.classList.add(themeToApply)
    body.classList.add(themeToApply)

    // Update CSS custom properties for smooth transitions
    root.style.setProperty('--theme-transition-duration', '200ms')
    root.style.setProperty('--theme-transition-timing', 'cubic-bezier(0.4, 0, 0.2, 1)')

    // Set color scheme for browser chrome
    root.style.colorScheme = themeToApply
  }, [effectiveTheme, mounted, disableTransitionOnChange])

  // Listen for system theme changes
  useEffect(() => {
    if (!enableSystem || !mounted) return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    
    const updateSystemTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    // Set initial value
    updateSystemTheme(media)

    // Listen for changes
    if (media.addEventListener) {
      media.addEventListener('change', updateSystemTheme)
      return () => media.removeEventListener('change', updateSystemTheme)
    } else {
      // Fallback for older browsers
      media.addListener(updateSystemTheme)
      return () => media.removeListener(updateSystemTheme)
    }
  }, [enableSystem, mounted])

  // Listen for reduced motion preference
  useEffect(() => {
    if (!mounted) return

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateReducedMotion = (e: MediaQueryListEvent | MediaQueryList) => {
      const root = window.document.documentElement
      if (e.matches) {
        root.classList.add('reduce-motion')
      } else {
        root.classList.remove('reduce-motion')
      }
    }

    updateReducedMotion(media)

    if (media.addEventListener) {
      media.addEventListener('change', updateReducedMotion)
      return () => media.removeEventListener('change', updateReducedMotion)
    } else {
      media.addListener(updateReducedMotion)
      return () => media.removeListener(updateReducedMotion)
    }
  }, [mounted])

  const value = {
    theme,
    systemTheme,
    effectiveTheme,
    setTheme: (newTheme: Theme) => {
      try {
        if (typeof window !== 'undefined') {
          localStorage?.setItem(storageKey, newTheme)
        }
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error)
      }
      setTheme(newTheme)
    },
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className={`${defaultTheme}`} style={{ colorScheme: defaultTheme }}>
        {children}
      </div>
    )
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}

// Utility hook for theme-aware components
export const useThemeAware = () => {
  const { effectiveTheme, systemTheme } = useTheme()
  
  return {
    isDark: effectiveTheme === 'dark',
    isLight: effectiveTheme === 'light',
    isSystemDark: systemTheme === 'dark',
    effectiveTheme,
    systemTheme,
  }
}