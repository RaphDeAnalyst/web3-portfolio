'use client'

import Link from 'next/link'
import { ExternalLink, FileText } from 'lucide-react'
import type { Project } from '@/lib/project-service-supabase'

interface WorkCardProps {
  project: Project
}

export function WorkCard({ project }: WorkCardProps) {
  return (
    <Link
      href={`/work/${project.id}`}
      className="group relative block p-8 transition-all duration-200 hover:translate-y-[-2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--card-border)',
        borderWidth: '1px',
      }}
      onMouseEnter={(e) => {
        const elem = e.currentTarget as HTMLElement
        elem.style.borderColor = 'var(--border)'
      }}
      onMouseLeave={(e) => {
        const elem = e.currentTarget as HTMLElement
        elem.style.borderColor = 'var(--card-border)'
      }}
    >
      {/* Link icons - top right */}
      <div className="absolute top-6 right-6 flex items-center gap-2 transition-opacity duration-200">
        {project.file_url && (
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              window.open(project.file_url, '_blank')
            }}
            className="transition-opacity hover:opacity-100 cursor-pointer bg-none border-none p-0"
            style={{ color: 'var(--text-secondary)', opacity: 0.4 }}
            aria-label="Open PDF report"
            title="Open PDF report"
          >
            <FileText className="w-4 h-4" />
          </button>
        )}
        <ExternalLink className="w-4 h-4" style={{ color: 'var(--text-secondary)', opacity: 0.4 }} />
      </div>

      {/* Title */}
      <h2 className="font-serif text-xl font-bold mb-3 pr-8 transition-opacity group-hover:opacity-75" style={{ color: 'var(--text-primary)' }}>
        {project.title}
      </h2>

      {/* Description */}
      <p className="text-sm mb-5 line-clamp-3 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {project.description}
      </p>

      {/* Tags */}
      {project.tech_stack && project.tech_stack.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {project.tech_stack.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 transition-opacity group-hover:opacity-75"
              style={{
                borderColor: 'var(--border)',
                borderWidth: '1px',
                color: 'var(--text-secondary)',
                opacity: 0.6,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  )
}
