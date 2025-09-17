'use client'

import { useTheme } from '@/lib/theme-provider'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sun, Moon, Monitor, Check, Shield } from 'lucide-react'

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
  const [isLongPressing, setIsLongPressing] = useState(false)
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null)
  const [pressProgress, setPressProgress] = useState(0)
  const [showAdminHint, setShowAdminHint] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Long press admin access handlers
  const handleLongPressStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    setIsLongPressing(true)
    setPressProgress(0)

    // Start progress animation
    const progressInterval = setInterval(() => {
      setPressProgress(prev => {
        const newProgress = prev + (100 / 30) // 3 seconds = 30 intervals of 100ms
        if (newProgress >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return newProgress
      })
    }, 100)

    // Set timer for admin access (3 seconds)
    const timer = setTimeout(() => {
      clearInterval(progressInterval)
      setIsLongPressing(false)
      setPressProgress(0)
      setShowAdminHint(true)

      // Haptic feedback on mobile
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100, 50, 100])
      }

      // Navigate to admin after brief hint
      setTimeout(() => {
        setShowAdminHint(false)
        router.push('/admin')
      }, 1500)
    }, 3000)

    setLongPressTimer(timer)
  }

  const handleLongPressEnd = () => {
    setIsLongPressing(false)
    setPressProgress(0)
    if (longPressTimer) {
      clearTimeout(longPressTimer)
      setLongPressTimer(null)
    }
  }

  // Regular click handler for theme changing
  const handleThemeClick = (e: React.MouseEvent) => {
    // Only change theme if it's a quick click (not a long press)
    if (!isLongPressing) {
      setIsOpen(!isOpen)
    }
  }

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
      // Cleanup timer on unmount
      if (longPressTimer) {
        clearTimeout(longPressTimer)
      }
    }
  }, [theme, setTheme, longPressTimer])

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
      {/* Admin Access Hint */}
      {showAdminHint && (
        <div className="absolute -top-12 right-0 z-50 animate-bounce-in">
          <div className="bg-green-600 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>🔓 Admin access activated</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={handleThemeClick}
        onMouseDown={handleLongPressStart}
        onMouseUp={handleLongPressEnd}
        onMouseLeave={handleLongPressEnd}
        onTouchStart={handleLongPressStart}
        onTouchEnd={handleLongPressEnd}
        onTouchCancel={handleLongPressEnd}
        className={`relative w-9 h-9 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-storj-blue transition-all duration-200 flex items-center justify-center group bg-white dark:bg-gray-900 shadow-sm hover:shadow-md ${
          isLongPressing ? 'scale-110 border-green-500 shadow-lg shadow-green-500/20' : ''
        }`}
        aria-label={`Current theme: ${currentOption.label}. Click to change theme`}
        title={`${currentOption.label} theme (Alt+T) | Hold 3s for admin`}
      >
        <div className="relative w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-storj-blue transition-colors duration-200">
          {/* Dynamic icon based on effective theme */}
          {theme === 'system' ? (
            <div className="flex items-center justify-center">
              {currentOption.icon}
              <div className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-gray-500 border border-white dark:border-gray-900" />
            </div>
          ) : (
            currentOption.icon
          )}
        </div>

        {/* Progress Ring for Long Press */}
        {isLongPressing && (
          <div className="absolute inset-0 rounded-lg">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="100.53"
                strokeDashoffset={100.53 - (pressProgress * 100.53) / 100}
                className="text-green-500 transition-all duration-100 ease-linear"
              />
            </svg>
          </div>
        )}

        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-lg transition-opacity duration-200 ${
          isLongPressing
            ? 'bg-green-500 opacity-20'
            : 'bg-storj-blue opacity-0 group-hover:opacity-10'
        }`} />
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
                  isActive ? 'bg-storj-blue/5 text-storj-blue' : 'text-gray-700 dark:text-gray-300'
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
                  <div className="flex-shrink-0 w-4 h-4 text-storj-blue">
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