'use client'

import { useState } from 'react'
import Link from 'next/link'

interface ProjectCardProps {
  title: string
  description: string
  image?: string
  tech: string[]
  category: string
  status: 'Live' | 'Development' | 'Beta' | 'Completed'
  demoUrl?: string
  githubUrl?: string
  metrics?: {
    users?: string
    volume?: string
    contracts?: string
    performance?: string
  }
  featured?: boolean
}

export function ProjectCard({ 
  title, 
  description, 
  image, 
  tech, 
  category, 
  status, 
  demoUrl, 
  githubUrl, 
  metrics,
  featured = false 
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const statusColors = {
    'Live': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Development': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Beta': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Completed': 'bg-purple-500/20 text-purple-400 border-purple-500/30'
  }

  const categoryColors = {
    'Analytics': 'cyber-500',
    'Smart Contracts': 'primary-500',
    'Dashboards': 'purple-500',
    'AI x Web3': 'yellow-500',
    'DeFi': 'green-500',
    'Infrastructure': 'blue-500'
  }

  const cardSize = featured ? 'lg:col-span-2 lg:row-span-2' : ''

  return (
    <div 
      className={`group relative ${cardSize} rounded-2xl border border-gray-200/50 dark:border-gray-800/50 bg-background/50 backdrop-blur-sm card-hover overflow-hidden ${
        featured ? 'p-8' : 'p-6'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br from-${categoryColors[category as keyof typeof categoryColors] || 'cyber-500'}/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 right-4 z-20">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-primary-500 to-cyber-500 text-white text-xs font-medium">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            <span>Featured</span>
          </div>
        </div>
      )}

      {/* Project Image/Preview */}
      <div className={`relative ${featured ? 'h-64 mb-6' : 'h-48 mb-4'} rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900`}>
        {image ? (
          <>
            <img 
              src={image} 
              alt={title}
              className={`w-full h-full object-cover transition-all duration-300 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              } ${isHovered ? 'scale-110' : ''}`}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-cyber-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className={`w-16 h-16 mx-auto rounded-xl bg-gradient-to-r from-${categoryColors[category as keyof typeof categoryColors] || 'cyber-500'} to-${categoryColors[category as keyof typeof categoryColors] || 'cyber-500'}/70 flex items-center justify-center text-white text-2xl`}>
                {category === 'Analytics' && '📊'}
                {category === 'Smart Contracts' && '⚡'}
                {category === 'Dashboards' && '📈'}
                {category === 'AI x Web3' && '🤖'}
                {category === 'DeFi' && '💎'}
                {category === 'Infrastructure' && '🏗️'}
              </div>
              <div className="text-sm text-foreground/60">Project Preview</div>
            </div>
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className={`absolute inset-0 bg-black/50 flex items-center justify-center space-x-4 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          {demoUrl && (
            <Link href={demoUrl} target="_blank">
              <button className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white font-medium hover:bg-white/30 transition-colors duration-200">
                Live Demo
              </button>
            </Link>
          )}
          {githubUrl && (
            <Link href={githubUrl} target="_blank">
              <button className="px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white font-medium hover:bg-white/30 transition-colors duration-200">
                GitHub
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-full bg-${categoryColors[category as keyof typeof categoryColors] || 'cyber-500'}/10 text-${categoryColors[category as keyof typeof categoryColors] || 'cyber-500'}`}>
                {category}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full border ${statusColors[status]}`}>
                {status}
              </span>
            </div>
            <h3 className={`${featured ? 'text-2xl' : 'text-xl'} font-bold text-foreground group-hover:text-${categoryColors[category as keyof typeof categoryColors] || 'cyber-500'} transition-colors duration-200`}>
              {title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className={`text-foreground/70 leading-relaxed ${featured ? 'text-base' : 'text-sm'}`}>
          {description}
        </p>

        {/* Metrics (if provided) */}
        {metrics && (
          <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-200/30 dark:border-gray-800/30">
            {Object.entries(metrics).map(([key, value]) => (
              <div key={key} className="text-center space-y-1">
                <div className={`text-${categoryColors[category as keyof typeof categoryColors] || 'cyber-500'} font-bold ${featured ? 'text-lg' : 'text-sm'}`}>
                  {value}
                </div>
                <div className="text-xs text-foreground/60 capitalize">{key}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2">
          {tech.map((technology, index) => (
            <span
              key={index}
              className={`text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-foreground/70 hover:bg-${categoryColors[category as keyof typeof categoryColors] || 'cyber-500'}/10 hover:text-${categoryColors[category as keyof typeof categoryColors] || 'cyber-500'} transition-colors duration-200 cursor-default`}
            >
              {technology}
            </span>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-2">
          {demoUrl && (
            <Link href={demoUrl} target="_blank" className="flex-1">
              <button className={`w-full px-4 py-3 rounded-lg bg-gradient-to-r from-${categoryColors[category as keyof typeof categoryColors] || 'cyber-500'} to-${categoryColors[category as keyof typeof categoryColors] || 'cyber-500'}/70 text-white font-medium hover:scale-105 transition-transform duration-200 shadow-lg`}>
                View Project
              </button>
            </Link>
          )}
          {githubUrl && (
            <Link href={githubUrl} target="_blank">
              <button className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 text-foreground hover:border-cyber-500 hover:text-cyber-500 transition-colors duration-200">
                <span className="text-lg">⚡</span>
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Corner Accent */}
      <div className={`absolute top-4 left-4 w-2 h-2 rounded-full bg-${categoryColors[category as keyof typeof categoryColors] || 'cyber-500'} opacity-60 group-hover:opacity-100 transition-opacity duration-200`}></div>
    </div>
  )
}