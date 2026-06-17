import { redirect } from 'next/navigation'
import { projectServiceSupabase, type Project } from '@/lib/project-service-supabase'
import { WorkRow } from '@/components/sections/WorkRow'

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
    <div style={{ minHeight: 'calc(100vh - 64px - var(--safe-area-top))', padding: '88px 32px 80px' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '8px' }}>
          <h1
            className="font-serif"
            style={{ fontWeight: 700, fontSize: 'clamp(40px, 6vw, 64px)', margin: 0, color: 'var(--text-primary)', lineHeight: 1 }}
          >
            Work
          </h1>
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase',
              margin: '0 0 8px', color: 'var(--text-muted)',
            }}
          >
            {projects.length.toString().padStart(2, '0')} Investigations · 2026
          </p>
        </div>

        <p style={{ fontSize: '17px', maxWidth: '620px', margin: '0 0 8px', color: 'var(--text-secondary)' }}>
          Investigations, research, and analytics — independently conducted and publicly documented.
        </p>

        {/* Case ledger */}
        <div style={{ marginTop: '32px' }}>
          {projects.map((project, i) => (
            <WorkRow key={project.id} project={project} index={i} />
          ))}
          <div style={{ borderTop: '1px solid var(--separator)' }} />
        </div>

      </div>
    </div>
  )
}
