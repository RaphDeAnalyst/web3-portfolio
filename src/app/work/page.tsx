import Link from 'next/link'
import { redirect } from 'next/navigation'
import { projectServiceSupabase, type Project } from '@/lib/project-service-supabase'
import { WorkCard } from '@/components/sections/WorkCard'

export const revalidate = 300

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
    <div className="min-h-screen pt-24 pb-20 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16 page-header">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4 page-title">Work</h1>
          <p className="text-lg opacity-75 max-w-2xl">
            Investigations, research, and analytics — independently conducted and publicly documented.
          </p>
        </div>

        {/* Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 work-grid">
          {projects.map((project) => (
            <WorkCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}
