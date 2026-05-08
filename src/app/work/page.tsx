import Link from 'next/link'
import { redirect } from 'next/navigation'
import { projectServiceSupabase, type Project } from '@/lib/project-service-supabase'

export const revalidate = 3600

export const metadata = {
  title: 'Work | Matthew Raphael Nnamani — On-Chain Investigations',
  description: 'Investigations and research by Matthew Raphael Nnamani — including the Kraken $18.2M theft trace, LastPass drain cluster analysis, and the Coordinated ETH Distribution Network behavioral taxonomy series.',
  alternates: {
    canonical: 'https://matthewraphael.xyz/work',
  },
  openGraph: {
    title: 'Work | Matthew Raphael Nnamani — On-Chain Investigations',
    description: 'Investigations and research by Matthew Raphael Nnamani — including the Kraken $18.2M theft trace, LastPass drain cluster analysis, and the Coordinated ETH Distribution Network behavioral taxonomy series.',
    url: 'https://matthewraphael.xyz/work',
  },
}

export default async function WorkPage() {
  let projects: Project[] = []

  try {
    projects = await projectServiceSupabase.getAllProjects()
  } catch {
    projects = []
  }

  if (projects.length === 0) {
    redirect('/')
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold">Work</h1>
        </div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/work/${project.id}`}
              className="group block p-6 sm:p-8 border border-border rounded hover:border-foreground hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground transition-all duration-300"
            >
              {/* Project Name */}
              <h2 className="text-xl font-semibold mb-3 group-hover:opacity-70 transition-opacity">
                {project.title}
              </h2>

              {/* Description */}
              <p className="text-sm sm:text-base opacity-70 mb-4 line-clamp-3">
                {project.description}
              </p>

              {/* Tags and Dune link */}
              <div className="flex flex-wrap items-center gap-3 justify-between">
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block text-xs font-medium px-2 py-1 bg-foreground/10 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                {project.duneUrl && (
                  <span className="text-xs opacity-60">Dune ↗</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
