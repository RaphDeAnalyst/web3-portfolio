'use client'

import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import type { Project } from '@/lib/project-service-supabase'

interface WorkCardProps {
  project: Project
}

export function WorkCard({ project }: WorkCardProps) {
  return (
    <Link
      href={`/work/${project.id}`}
      className="group relative block p-8 border border-border bg-background/50 hover:border-foreground/30 transition-all duration-200 hover:translate-y-[-2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {/* External link icon - top right */}
      <div className="absolute top-6 right-6 opacity-40 group-hover:opacity-100 transition-opacity duration-200">
        <ExternalLink className="w-4 h-4" />
      </div>

      {/* Title */}
      <h2 className="font-serif text-xl font-bold mb-3 pr-8 group-hover:opacity-75 transition-opacity">
        {project.title}
      </h2>

      {/* Description */}
      <p className="text-sm opacity-70 mb-5 line-clamp-3 leading-relaxed">
        {project.description}
      </p>

      {/* Tags */}
      {project.tech_stack && project.tech_stack.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {project.tech_stack.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 border border-border/50 opacity-60 group-hover:opacity-75 transition-opacity"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}
