import Link from 'next/link'
import { ExternalLink, FileText } from 'lucide-react'
import type { Project } from '@/lib/project-service-supabase'

interface WorkCardProps {
  project: Project
}

export function WorkCard({ project }: WorkCardProps) {
  return (
    <div className="group relative transition-all duration-200 hover:translate-y-[-2px]">
      <Link
        href={`/work/${project.id}`}
        className="block work-card p-8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [border-color:var(--card-border)] hover:[border-color:var(--border)] transition-colors duration-200"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderWidth: '1px',
        }}
      >
        {/* Title */}
        <h2 className="font-serif text-xl font-bold mb-3 pr-12 transition-opacity group-hover:opacity-75" style={{ color: 'var(--text-primary)' }}>
          {project.title}
        </h2>

        {/* Description */}
        <p className="text-sm mb-5 line-clamp-3 leading-relaxed work-card-description" style={{ color: 'var(--text-secondary)' }}>
          {project.description}
        </p>

        {/* Tags */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.tech_stack.map((tag) => (
              <span
                key={tag}
                className="work-tag text-xs px-2.5 py-1 transition-opacity group-hover:opacity-75"
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

      {/* Icon overlay — lives outside the Link to avoid nested interactive elements */}
      <div className="absolute top-6 right-6 flex items-center gap-2 pointer-events-none">
        {project.file_url && (
          <a
            href={project.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto transition-opacity hover:opacity-100"
            style={{ color: 'var(--text-secondary)', opacity: 0.4 }}
            aria-label="Open PDF report"
            title="Open PDF report"
          >
            <FileText className="w-4 h-4" />
          </a>
        )}
        <ExternalLink className="w-4 h-4" style={{ color: 'var(--text-secondary)', opacity: 0.4 }} />
      </div>
    </div>
  )
}
