'use client'

import dynamic from 'next/dynamic'
import { memo } from 'react'

const ProjectCard = dynamic(() => import('./project-card').then(mod => ({ default: mod.ProjectCard })), {
  loading: () => (
    <div className="h-full rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" style={{ minHeight: '600px' }}>
      <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-t-xl"></div>
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </div>
      </div>
    </div>
  ),
  ssr: false
})

export const ProjectCardLazy = memo(ProjectCard)