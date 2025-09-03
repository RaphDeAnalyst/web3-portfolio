'use client'

import { useState } from 'react'

interface FilterTabsProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
  projectCounts: { [key: string]: number }
}

export function FilterTabs({ categories, activeCategory, onCategoryChange, projectCounts }: FilterTabsProps) {
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)

  const categoryIcons = {
    'All': '🌟',
    'Analytics': '📊',
    'Smart Contracts': '📜',
    'Dashboards': '📈',
    'AI x Web3': '🤖',
    'DeFi': '💎',
    'Infrastructure': '🏗️'
  }

  const categoryColors = {
    'All': 'cyber-500',
    'Analytics': 'cyber-500',
    'Smart Contracts': 'primary-500',
    'Dashboards': 'purple-500',
    'AI x Web3': 'yellow-500',
    'DeFi': 'green-500',
    'Infrastructure': 'blue-500'
  }

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {categories.map((category) => {
        const isActive = activeCategory === category
        const isHovered = hoveredTab === category
        const count = projectCounts[category] || 0
        const color = categoryColors[category as keyof typeof categoryColors] || 'cyber-500'
        
        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            onMouseEnter={() => setHoveredTab(category)}
            onMouseLeave={() => setHoveredTab(null)}
            className={`relative group px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              isActive
                ? `bg-${color}/20 text-${color} border-2 border-${color}/40 shadow-lg shadow-${color}/20`
                : 'bg-background/50 text-foreground/70 border-2 border-border hover:border-border-hover'
            } backdrop-blur-sm`}
          >
            {/* Background glow effect */}
            <div className={`absolute inset-0 rounded-full bg-${color}/10 opacity-0 ${
              isActive || isHovered ? 'opacity-100' : ''
            } transition-opacity duration-300`}></div>
            
            {/* Content */}
            <div className="relative z-10 flex items-center space-x-2">
              <span className="text-lg">
                {categoryIcons[category as keyof typeof categoryIcons] || '📁'}
              </span>
              <span>{category}</span>
              
              {/* Count badge */}
              <div className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                isActive 
                  ? `bg-${color}/30 text-${color}`
                  : 'bg-muted text-foreground/60'
              } transition-colors duration-300`}>
                {count}
              </div>
            </div>

            {/* Active indicator */}
            {isActive && (
              <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-${color} animate-pulse`}></div>
            )}

            {/* Hover effect */}
            <div className={`absolute inset-0 rounded-full border-2 border-${color}/30 opacity-0 ${
              isHovered && !isActive ? 'opacity-100' : ''
            } transition-opacity duration-200`}></div>
          </button>
        )
      })}
    </div>
  )
}