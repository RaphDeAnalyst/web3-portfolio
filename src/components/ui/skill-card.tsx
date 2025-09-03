'use client'

import { useState } from 'react'

interface SkillCardProps {
  title: string
  skills: string[]
  icon: string
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
      className={`group relative p-8 rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-gradient-to-br ${gradient} card-hover backdrop-blur-sm transition-all duration-300`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background glow effect */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
        color === 'cyber-500' ? 'bg-cyber-500/10' :
        color === 'primary-500' ? 'bg-primary-500/10' :
        'bg-purple-500/10'
      }`}></div>
      
      {/* Content */}
      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
            color === 'cyber-500' ? 'bg-cyber-500/20' :
            color === 'primary-500' ? 'bg-primary-500/20' :
            'bg-purple-500/20'
          }`}>
            {icon}
          </div>
          <div>
            <h3 className={`text-xl font-bold text-foreground transition-colors duration-200 ${
              color === 'cyber-500' ? 'group-hover:text-cyber-500' :
              color === 'primary-500' ? 'group-hover:text-primary-500' :
              'group-hover:text-purple-500'
            }`}>
              {title}
            </h3>
            <p className="text-sm text-foreground/60">{description}</p>
          </div>
        </div>

        {/* Skills List */}
        <div className="space-y-3">
          {skills.map((skill, index) => (
            <div
              key={skill}
              className={`flex items-center space-x-3 transition-all duration-300 ${
                isHovered ? 'animate-slide-in-left' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-2 h-2 rounded-full opacity-60 ${
                color === 'cyber-500' ? 'bg-cyber-500' :
                color === 'primary-500' ? 'bg-primary-500' :
                'bg-purple-500'
              }`}></div>
              <span className="text-foreground/80 group-hover:text-foreground transition-colors duration-200">
                {skill}
              </span>
            </div>
          ))}
        </div>

        {/* Skill Level Indicator */}
        <div className="pt-4 border-t border-gray-200/30 dark:border-gray-800/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-foreground/60">Expertise Level</span>
            <span className={`text-sm font-medium ${
              color === 'cyber-500' ? 'text-cyber-500' :
              color === 'primary-500' ? 'text-primary-500' :
              'text-purple-500'
            }`}>{level}</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${
                isHovered ? getWidthClass(progress) : 'w-0'
              } ${
                color === 'cyber-500' ? 'bg-gradient-to-r from-cyber-500 to-cyber-500/70' :
                color === 'primary-500' ? 'bg-gradient-to-r from-primary-500 to-primary-500/70' :
                'bg-gradient-to-r from-purple-500 to-purple-500/70'
              }`}
            ></div>
          </div>
        </div>
      </div>

      {/* Corner accent */}
      <div className={`absolute top-4 right-4 w-3 h-3 rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-200 ${
        color === 'cyber-500' ? 'bg-cyber-500' :
        color === 'primary-500' ? 'bg-primary-500' :
        'bg-purple-500'
      }`}></div>
    </div>
  )
}