'use client'

interface FilterTabsProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
  projectCounts: { [key: string]: number }
}

export function FilterTabs({ categories, activeCategory, onCategoryChange, projectCounts }: FilterTabsProps) {


  const categoryColors = {
    'All': 'cyber-500',
    'Analytics': 'cyber-500',
    'Smart Contracts': 'primary-500',
    'Dashboards': 'purple-500',
    'AI x Web3': 'yellow-500',
    'DeFi': 'green-500',
    'Learning': 'orange-500',
    'Infrastructure': 'blue-500'
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 px-4 sm:px-0">
      {categories.map((category) => {
        const isActive = activeCategory === category
        const count = projectCounts[category] || 0
        const color = categoryColors[category as keyof typeof categoryColors] || 'cyber-500'
        
        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`relative group px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
              isActive
                ? `bg-${color}/20 text-${color} border-2 border-${color}/40 shadow-lg shadow-${color}/20`
                : 'bg-background/50 text-foreground/70 border-2 border-border'
            } backdrop-blur-sm`}
          >
            {/* Background glow effect - only for active */}
            <div className={`absolute inset-0 rounded-lg bg-${color}/10 opacity-0 ${
              isActive ? 'opacity-100' : ''
            } transition-opacity duration-300`}></div>
            
            {/* Content */}
            <div className="relative z-10 flex items-center space-x-2">
              <span>{category}</span>
              
              {/* Count badge */}
              <div className={`ml-1 sm:ml-1.5 px-1 sm:px-1.5 py-0.5 rounded-full text-xs font-medium ${
                isActive 
                  ? `bg-${color}/30 text-${color}`
                  : 'bg-muted text-foreground/60'
              } transition-colors duration-300`}>
                {count}
              </div>
            </div>

            {/* Active indicator */}
            {isActive && (
              <div className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-${color} animate-pulse`}></div>
            )}

          </button>
        )
      })}
    </div>
  )
}