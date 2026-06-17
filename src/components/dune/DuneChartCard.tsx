import { DuneChart } from './DuneChart'
import type { DuneChartWithData } from '@/types/dune'

interface DuneChartCardProps {
  chart: DuneChartWithData
  /** When true, suppresses the built-in title/description/timestamp — for layouts that render those externally */
  titleHidden?: boolean
}

export function DuneChartCard({ chart, titleHidden }: DuneChartCardProps) {
  const data = (chart.cache?.result_data ?? []) as Record<string, unknown>[]

  if (titleHidden) {
    return (
      <DuneChart
        chartType={chart.chart_type}
        data={data}
        xKey={chart.x_key ?? ''}
        yKeys={chart.y_keys ?? []}
        pinnedNote={chart.pinned_note}
        chartColors={chart.chart_colors ?? []}
      />
    )
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '2px',
        padding: '24px',
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <h3 className="font-serif" style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px', color: 'var(--text-primary)' }}>
          {chart.title}
        </h3>
        {chart.description && (
          <p style={{ fontSize: '12px', lineHeight: 1.5, margin: 0, color: 'var(--text-secondary)' }}>
            {chart.description}
          </p>
        )}
      </div>

      <DuneChart
        chartType={chart.chart_type}
        data={data}
        xKey={chart.x_key ?? ''}
        yKeys={chart.y_keys ?? []}
        pinnedNote={chart.pinned_note}
        chartColors={chart.chart_colors ?? []}
      />

      {chart.last_refreshed_at && (
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', margin: '12px 0 0', color: 'var(--text-muted)' }}>
          Updated {new Date(chart.last_refreshed_at).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </p>
      )}
    </div>
  )
}
