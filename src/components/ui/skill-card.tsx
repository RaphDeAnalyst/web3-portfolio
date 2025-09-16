'use client'

import { useState } from 'react'

interface SkillCardProps {
  title: string
  skills: string[]
  icon: React.ReactNode
  color: string
  gradient: string
  description: string
  level?: 'Learning' | 'Proficient' | 'Advanced'
  progress?: number
}

export function SkillCard({ title, skills, icon, color, gradient, description, level = 'Advanced', progress = 90 }: SkillCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  
  const getWidthClass = (progress: number) => {
    if (progress >= 90) return 'w-[90%]'
    if (progress >= 85) return 'w-[85%]'
    if (progress >= 80) return 'w-[80%]'
    if (progress >= 70) return 'w-[70%]'
    if (progress >= 60) return 'w-[60%]'
    if (progress >= 50) return 'w-[50%]'
    if (progress >= 40) return 'w-[40%]'
    if (progress >= 30) return 'w-[30%]'
    return 'w-[20%]'
  }

  return (
    <div
      className="group relative p-4 sm:p-6 lg:p-8 bg-card border border-border hover:border-border-hover card-hover backdrop-blur-sm transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle hover background */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-card-hover"></div>
      
      {/* Content */}
      <div className="relative z-10 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-start sm:items-center space-x-3 sm:space-x-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/20 text-primary">
            <div className="w-5 h-5 sm:w-6 sm:h-6">
              {icon}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200 leading-tight">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-foreground/60 mt-1 leading-relaxed">{description}</p>
          </div>
        </div>

        {/* Skills List */}
        <div className="space-y-2 sm:space-y-3">
          {skills.map((skill, index) => (
            <div
              key={skill}
              className={`flex items-center space-x-2 sm:space-x-3 transition-all duration-300 ${
                isHovered ? 'animate-slide-in-left' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full opacity-60 flex-shrink-0 bg-primary"></div>
              <span className="text-sm sm:text-base text-foreground/80 group-hover:text-foreground transition-colors duration-200 leading-tight">
                {skill}
              </span>
            </div>
          ))}
        </div>

        {/* Skill Level Indicator */}
        <div className="pt-3 sm:pt-4 border-t border-text-light-primary/10 dark:border-text-dark-primary/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm text-foreground/60">Expertise Level</span>
            <span className="text-xs sm:text-sm font-medium text-primary">{level}</span>
          </div>
          <div className="h-1.5 sm:h-2 bg-border rounded-full overflow-hidden">
            <div
              className={`h-full bg-primary rounded-full transition-all duration-1000 ${
                isHovered ? getWidthClass(progress) : 'w-0'
              }`}
            ></div>
          </div>
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-2 h-2 sm:w-3 sm:h-3 rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-200 bg-primary"></div>
    </div>
  )
}