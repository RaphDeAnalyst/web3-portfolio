'use client'

interface FilterTabsProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
  projectCounts: { [key: string]: number }
}

export function FilterTabs({ categories, activeCategory, onCategoryChange, projectCounts }: FilterTabsProps) {


  // Monochrome design - no category-specific colors

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12 px-4 sm:px-0">
      {categories.map((category) => {
        const isActive = activeCategory === category
        const count = projectCounts[category] || 0
        // All categories use the same monochrome styling
        
        return (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`relative group px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 ${
              isActive
                ? 'bg-transparent text-black dark:text-white border-2 border-black dark:border-white font-bold'
                : 'bg-background/50 text-black/70 dark:text-white/70 border-2 border-border'
            } backdrop-blur-sm`}
          >
            
            {/* Content */}
            <div className="relative z-10 flex items-center space-x-2">
              <span>{category}</span>
              
              {/* Count badge */}
              <div className={`ml-1 sm:ml-1.5 px-1 sm:px-1.5 py-0.5 rounded-full text-xs font-medium ${
                isActive
                  ? 'bg-gray-100 dark:bg-gray-800 text-black dark:text-white'
                  : 'bg-muted text-black/60 dark:text-white/60'
              } transition-colors duration-300`}>
                {count}
              </div>
            </div>

            {/* Active indicator */}
            {isActive && (
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-foreground animate-pulse"></div>
            )}

          </button>
        )
      })}
    </div>
  )
}