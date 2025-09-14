'use client'

interface FilterTabsProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
  projectCounts: { [key: string]: number }
}

export function FilterTabs({ categories, activeCategory, onCategoryChange, projectCounts }: FilterTabsProps) {


  const categoryColors = {
    'All': 'primary-500',
    'Analytics': 'primary-600',
    'Smart Contracts': 'primary-500',
    'Dashboards': 'primary-400',
    'AI x Web3': 'primary-600',
    'DeFi': 'primary-500',
    'Learning': 'primary-400',
    'Infrastructure': 'primary-600'
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 px-4 sm:px-0">
      {categories.map((category) => {
        const isActive = activeCategory === category
        const count = projectCounts[category] || 0
        const color = categoryColors[category as keyof typeof categoryColors] || 'primary-500'
        
        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`relative group px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
              isActive
                ? 'bg-primary-500/20 text-primary-500 border-2 border-primary-500/40 shadow-lg shadow-primary-500/20'
                : 'bg-background/50 text-foreground/70 border-2 border-border'
            } backdrop-blur-sm`}
          >
            {/* Background glow effect - only for active */}
            <div className={`absolute inset-0 rounded-lg bg-primary-500/10 opacity-0 ${
              isActive ? 'opacity-100' : ''
            } transition-opacity duration-300`}></div>
            
            {/* Content */}
            <div className="relative z-10 flex items-center space-x-2">
              <span>{category}</span>
              
              {/* Count badge */}
              <div className={`ml-1 sm:ml-1.5 px-1 sm:px-1.5 py-0.5 rounded-full text-xs font-medium ${
                isActive
                  ? 'bg-primary-500/30 text-primary-500'
                  : 'bg-muted text-foreground/60'
              } transition-colors duration-300`}>
                {count}
              </div>
            </div>

            {/* Active indicator */}
            {isActive && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
            )}

          </button>
        )
      })}
    </div>
  )
}