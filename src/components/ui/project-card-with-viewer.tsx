'use client'

import { ProjectCard } from './project-card'
import { ImageViewer } from './image-viewer'
import { useState } from 'react'

interface ProjectCardProps {
  title: string
  description: string
  image?: string
  tech: string[]
  category: string
  status: 'Live' | 'Development' | 'Beta' | 'Completed' | 'Learning' | 'Complete'
  demoUrl?: string
  githubUrl?: string
  duneUrl?: string
  blogPostSlug?: string
  metrics?: Record<string, string>
  features?: string[]
  challenges?: string
  learnings?: string
  featured?: boolean
  timeline?: '2022-2023' | '2024' | '2025'
  phase?: 'Traditional Analytics' | 'Exploratory Phase' | 'Web3 Analytics'
  featuredCount?: number
}

export function ProjectCardWithViewer(props: ProjectCardProps) {
  const [showImageViewer, setShowImageViewer] = useState(false)

  const handleImageClick = () => {
    setShowImageViewer(true)
  }

  return (
    <>
      <ProjectCard {...props} onImageClick={handleImageClick} />
      {props.image && (
        <ImageViewer
          src={props.image}
          alt={`${props.title} project screenshot`}
          isOpen={showImageViewer}
          onClose={() => setShowImageViewer(false)}
        />
      )}
    </>
  )
}