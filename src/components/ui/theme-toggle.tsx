'use client'

import { useTheme } from '@/lib/theme-provider'
import { useEffect, useState } from 'react'
import { Sun, Moon, Monitor, Check } from 'lucide-react'

type ThemeOption = {
  value: 'light' | 'dark' | 'system'
  label: string
  icon: React.ReactNode
  description: string
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Keyboard shortcut: Alt+T (less conflicting)
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 't' && !e.ctrlKey && !e.shiftKey) {
        e.preventDefault()
        const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system']
        const currentIndex = themes.indexOf(theme)
        const nextIndex = (currentIndex + 1) % themes.length
        setTheme(themes[nextIndex])
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element
      if (!target.closest('[data-theme-toggle]')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyboard)
    document.addEventListener('keydown', handleEscape)
    document.addEventListener('click', handleClickOutside)
    
    return () => {
      document.removeEventListener('keydown', handleKeyboard)
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [theme, setTheme])

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-800 animate-pulse" />
    )
  }

  const themeOptions: ThemeOption[] = [
    {
      value: 'light',
      label: 'Light',
      description: 'Use light theme',
      icon: <Sun className="w-4 h-4" />,
    },
    {
      value: 'dark',
      label: 'Dark',
      description: 'Use dark theme',
      icon: <Moon className="w-4 h-4" />,
    },
    {
      value: 'system',
      label: 'System',
      description: 'Use system preference',
      icon: <Monitor className="w-4 h-4" />,
    },
  ]

  const currentOption = themeOptions.find(option => option.value === theme) || themeOptions[2]
  const systemTheme = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    : 'light'

  const getEffectiveTheme = () => {
    return theme === 'system' ? systemTheme : theme
  }

  return (
    <div className="relative" data-theme-toggle>
      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-cyber-500 dark:hover:border-cyber-400 transition-all duration-200 flex items-center justify-center group bg-white dark:bg-gray-900 shadow-sm hover:shadow-md"
        aria-label={`Current theme: ${currentOption.label}. Click to change theme`}
        title={`${currentOption.label} theme (Alt+T)`}
      >
        <div className="relative w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-cyber-500 dark:group-hover:text-cyber-400 transition-colors duration-200">
          {/* Dynamic icon based on effective theme */}
          {theme === 'system' ? (
            <div className="flex items-center justify-center">
              {currentOption.icon}
              <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-blue-500 border border-white dark:border-gray-900" />
            </div>
          ) : (
            currentOption.icon
          )}
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-lg bg-cyber-500 opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-lg shadow-gray-900/10 dark:shadow-black/20 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {themeOptions.map((option) => {
            const isActive = theme === option.value
            const isEffectiveTheme = getEffectiveTheme() === option.value

            return (
              <button
                key={option.value}
                onClick={() => {
                  setTheme(option.value)
                  setIsOpen(false)
                }}
                className={`w-full px-3 py-2 flex items-center space-x-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 ${
                  isActive ? 'bg-cyber-500/5 text-cyber-600 dark:text-cyber-400' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                <div className="flex-shrink-0 w-4 h-4">
                  {option.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">{option.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {option.description}
                    {option.value === 'system' && ` (${systemTheme})`}
                  </div>
                </div>
                {isActive && (
                  <div className="flex-shrink-0 w-4 h-4 text-cyber-500">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            )
          })}

          {/* Separator */}
          <div className="my-1 h-px bg-gray-200 dark:bg-gray-800" />
          
          {/* Keyboard Shortcut Hint */}
          <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
            Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">Alt+T</kbd> to cycle
          </div>
        </div>
      )}
    </div>
  )
}