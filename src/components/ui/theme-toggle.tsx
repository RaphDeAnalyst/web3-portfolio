'use client'

import { useTheme } from '@/lib/theme-provider'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-md border border-gray-300 dark:border-gray-700" />
    )
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative w-9 h-9 rounded-md border border-gray-300 dark:border-gray-700 hover:border-cyber-500 transition-colors duration-200 flex items-center justify-center group"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5">
        {/* Sun icon */}
        <div className={`absolute inset-0 transition-all duration-300 ${theme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`}>
          <div className="w-full h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-lg" />
          <div className="absolute inset-0 rounded-full animate-pulse bg-yellow-300 opacity-50" />
        </div>
        
        {/* Moon icon */}
        <div className={`absolute inset-0 transition-all duration-300 ${theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`}>
          <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg" />
          <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-gray-800 shadow-inner" />
        </div>
      </div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-md bg-cyber-500 opacity-0 group-hover:opacity-20 transition-opacity duration-200 glow-effect" />
    </button>
  )
}