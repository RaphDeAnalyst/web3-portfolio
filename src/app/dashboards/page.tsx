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

  const [featured, ...rest] = charts

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', padding: '88px 32px 80px' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '8px' }}>
          <h1
            className="font-serif"
            style={{ fontWeight: 700, fontSize: 'clamp(40px, 6vw, 64px)', margin: 0, color: 'var(--text-primary)', lineHeight: 1 }}
          >
            Dashboards
          </h1>
          <p
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase',
              margin: '0 0 8px', color: 'var(--text-muted)',
            }}
          >
            Live · on-chain analytics
          </p>
        </div>

        <p style={{ fontSize: '17px', maxWidth: '620px', margin: '0 0 36px', color: 'var(--text-secondary)' }}>
          On-chain analytics — live metrics and pinned snapshots from active investigations.
        </p>

        {charts.length === 0 ? (
          <div
            style={{
              padding: '80px 0', textAlign: 'center',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '13px', color: 'var(--text-muted)',
              border: '1px dashed var(--card-border)', borderRadius: '2px',
            }}
          >
            No dashboards published yet.
          </div>
        ) : (
          <>
            {/* Featured chart — first chart gets full-width treatment */}
            {featured && (
              <div
                style={{
                  background: 'var(--card-bg)', border: '1px solid var(--card-border)',
                  borderRadius: '2px', padding: '28px', marginBottom: '32px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: '10px', letterSpacing: '0.1em',
                          textTransform: 'uppercase', color: 'var(--accent)',
                        }}
                      >
                        Featured
                      </span>
                      <h3
                        className="font-serif"
                        style={{ fontWeight: 700, fontSize: '20px', margin: 0, color: 'var(--text-primary)' }}
                      >
                        {featured.title}
                      </h3>
                    </div>
                    {featured.description && (
                      <p style={{ fontSize: '13px', margin: 0, color: 'var(--text-secondary)' }}>
                        {featured.description}
                      </p>
                    )}
                  </div>
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em',
                      padding: '3px 9px', border: '1px solid var(--border)',
                      borderRadius: '9999px', color: 'var(--text-secondary)',
                    }}
                  >
                    {featured.mode || 'Snapshot'}
                  </span>
                </div>
                <DuneChartCard chart={featured} titleHidden />
                {featured.last_refreshed_at && (
                  <p
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '12px', margin: '12px 0 0', color: 'var(--text-muted)',
                    }}
                  >
                    Updated {new Date(featured.last_refreshed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>
            )}

            {/* Remaining charts grid */}
            {rest.length > 0 && (
              <div
                className="dash-grid"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}
              >
                {rest.map((chart, i) => (
                  <div
                    key={chart.id}
                    style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '2px', padding: '24px' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: '10px', letterSpacing: '0.08em', color: 'var(--text-muted)',
                        }}
                      >
                        DASH-{String(i + 2).padStart(2, '0')}
                      </span>
                      <h3
                        className="font-serif"
                        style={{ fontWeight: 700, fontSize: '16px', margin: 0, color: 'var(--text-primary)' }}
                      >
                        {chart.title}
                      </h3>
                    </div>
                    {chart.description && (
                      <p style={{ fontSize: '12px', margin: '0 0 16px', color: 'var(--text-secondary)' }}>
                        {chart.description}
                      </p>
                    )}
                    <DuneChartCard chart={chart} titleHidden />
                    {chart.last_refreshed_at && (
                      <p
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: '12px', margin: '14px 0 0', color: 'var(--text-muted)',
                        }}
                      >
                        Updated {new Date(chart.last_refreshed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}
