import { DuneChart } from './DuneChart'
import type { DuneChartWithData } from '@/types/dune'

interface DuneChartCardProps {
  chart: DuneChartWithData
}

export function DuneChartCard({ chart }: DuneChartCardProps) {
  const data = (chart.cache?.result_data ?? []) as Record<string, unknown>[]

  return (
    <div
      className="p-6"
      style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
      }}
    >
      <div className="mb-4">
        <h3 className="font-serif text-base font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          {chart.title}
        </h3>
        {chart.description && (
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
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
      />

      {chart.last_refreshed_at && (
        <p className="text-xs font-mono mt-3" style={{ color: 'var(--text-muted)' }}>
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
