import { getResearchCharts } from '@/lib/dune-cache-service'
import { DuneChartCard } from '@/components/dune/DuneChartCard'

export const revalidate = 300

export const metadata = {
  title: 'Dashboards | Matthew Raphael Nnamani — On-Chain Analytics',
  description: 'Live and pinned on-chain analytics dashboards by Matthew Raphael Nnamani — built on Dune Analytics data, covering EVM fund flows, AML metrics, and blockchain intelligence.',
  alternates: {
    canonical: 'https://matthewraphael.xyz/dashboards',
  },
  openGraph: {
    title: 'Dashboards | Matthew Raphael Nnamani — On-Chain Analytics',
    description: 'Live and pinned on-chain analytics dashboards — EVM fund flows, AML metrics, and blockchain intelligence.',
    url: 'https://matthewraphael.xyz/dashboards',
  },
}

export default async function DashboardsPage() {
  const charts = await getResearchCharts()

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16 page-header">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4 page-title">Dashboards</h1>
          <p className="text-lg opacity-75 max-w-2xl">
            On-chain analytics — live metrics and pinned snapshots from active investigations.
          </p>
        </div>

        {charts.length === 0 ? (
          <div
            className="py-20 text-center text-sm font-mono"
            style={{ color: 'var(--text-muted)', border: '1px dashed var(--border)' }}
          >
            No dashboards published yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {charts.map(chart => (
              <DuneChartCard key={chart.id} chart={chart} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
