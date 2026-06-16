'use client'

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { ChartType } from '@/types/dune'

// CSS-variable palette for multi-series charts
const SERIES_COLORS = [
  'var(--accent)',
  'var(--text-secondary)',
  'var(--border)',
]

interface DuneChartProps {
  chartType: ChartType
  data: Record<string, unknown>[]
  xKey: string
  yKeys: string[]
  pinnedNote?: string | null
}

export function DuneChart({ chartType, data, xKey, yKeys, pinnedNote }: DuneChartProps) {
  if (!data || data.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-48 text-xs font-mono"
        style={{ color: 'var(--text-muted)', border: '1px dashed var(--border)' }}
      >
        No data yet
      </div>
    )
  }

  const commonAxisProps = {
    tick: { fontSize: 11, fill: 'var(--text-secondary)' },
    axisLine: { stroke: 'var(--border)' },
    tickLine: { stroke: 'var(--border)' },
  }

  const gridProps = {
    strokeDasharray: '3 3',
    stroke: 'var(--border)',
    opacity: 0.5,
  }

  const tooltipStyle = {
    backgroundColor: 'var(--card-bg)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    fontSize: '12px',
    color: 'var(--text-primary)',
  }

  const sharedProps = {
    data,
    margin: { top: 4, right: 16, left: 0, bottom: 4 },
  }

  const renderChart = () => {
    if (chartType === 'pie') {
      return (
        <PieChart>
          <Pie
            data={data}
            dataKey={yKeys[0] ?? 'value'}
            nameKey={xKey}
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={SERIES_COLORS[i % SERIES_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
        </PieChart>
      )
    }

    if (chartType === 'bar') {
      return (
        <BarChart {...sharedProps}>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey={xKey} {...commonAxisProps} />
          <YAxis {...commonAxisProps} />
          <Tooltip contentStyle={tooltipStyle} />
          {yKeys.length > 1 && (
            <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
          )}
          {yKeys.map((key, i) => (
            <Bar key={key} dataKey={key} fill={SERIES_COLORS[i % SERIES_COLORS.length]} radius={[2, 2, 0, 0]} />
          ))}
        </BarChart>
      )
    }

    if (chartType === 'area') {
      return (
        <AreaChart {...sharedProps}>
          <defs>
            {yKeys.map((key, i) => (
              <linearGradient key={key} id={`gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={SERIES_COLORS[i % SERIES_COLORS.length]} stopOpacity={0.15} />
                <stop offset="95%" stopColor={SERIES_COLORS[i % SERIES_COLORS.length]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid {...gridProps} />
          <XAxis dataKey={xKey} {...commonAxisProps} />
          <YAxis {...commonAxisProps} />
          <Tooltip contentStyle={tooltipStyle} />
          {yKeys.length > 1 && (
            <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
          )}
          {yKeys.map((key, i) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
              fill={`url(#gradient-${i})`}
              strokeWidth={1.5}
              dot={false}
            />
          ))}
        </AreaChart>
      )
    }

    // default: line
    return (
      <LineChart {...sharedProps}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey={xKey} {...commonAxisProps} />
        <YAxis {...commonAxisProps} />
        <Tooltip contentStyle={tooltipStyle} />
        {yKeys.length > 1 && (
          <Legend wrapperStyle={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
        )}
        {yKeys.map((key, i) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    )
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={260}>
        {renderChart()}
      </ResponsiveContainer>
      {pinnedNote && (
        <p className="text-xs font-mono mt-3 italic" style={{ color: 'var(--text-muted)' }}>
          {pinnedNote}
        </p>
      )}
    </div>
  )
}
