'use client'

import { useEffect, useRef, useState } from 'react'
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
import { useTheme } from 'next-themes'
import type { ChartType } from '@/types/dune'
import { resolveSeriesColors } from '@/lib/chartColors'

// Recharts YAxis defaults to width=60 regardless of tick content.
// For charts with small values (e.g. max=155) that wastes ~30 px of left gutter;
// for charts with 8-digit values it can be too narrow. Derive width from the
// actual data so the axis never reserves more space than its labels need.
function yAxisWidth(data: Record<string, unknown>[], keys: string[]): number {
  let maxAbs = 0
  let hasNeg = false
  for (const row of data) {
    for (const k of keys) {
      const v = Number(row[k])
      if (!isFinite(v)) continue
      if (v < 0) hasNeg = true
      if (Math.abs(v) > maxAbs) maxAbs = Math.abs(v)
    }
  }
  // Recharts rounds tick values to nice numbers slightly above the data max,
  // so the tick string length matches the data max string length in practice.
  const chars = String(Math.round(maxAbs)).length + (hasNeg ? 1 : 0)
  // ~7 px per char at 11 px sans-serif, +8 px internal padding
  return Math.max(28, chars * 7 + 8)
}

interface DuneChartProps {
  chartType: ChartType
  data: Record<string, unknown>[]
  xKey: string
  yKeys: string[]
  pinnedNote?: string | null
  chartColors?: string[]
}

export function DuneChart({ chartType, data, xKey, yKeys, pinnedNote, chartColors = [] }: DuneChartProps) {
  const { resolvedTheme } = useTheme()
  const activeTheme = resolvedTheme === 'light' ? 'light' : 'dark'
  const SERIES_COLORS = resolveSeriesColors(chartColors, activeTheme)

  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    setContainerWidth(el.getBoundingClientRect().width)
    const ro = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
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

  const yWidth = yAxisWidth(data, yKeys)

  const sharedProps = {
    data,
    margin: { top: 4, right: 16, left: 0, bottom: 4 },
  }

  const renderChart = () => {
    if (chartType === 'pie') {
      const showPieLabels = containerWidth === 0 || containerWidth >= 500
      // Recharts nameKey lookup is falsy-sensitive: boolean `false`, 0, or "" all
      // cause it to fall back to the dataKey name as the legend label. Stringify
      // the category column so every value is a non-empty string before recharts
      // touches it.
      const pieData = data.map(row => ({ ...row, [xKey]: String(row[xKey] ?? '') }))
      return (
        <PieChart>
          <Pie
            data={pieData}
            dataKey={yKeys[0] ?? 'value'}
            nameKey={xKey}
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={showPieLabels ? ({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%` : false}
            labelLine={showPieLabels}
          >
            {pieData.map((_, i) => (
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
          <YAxis {...commonAxisProps} width={yWidth} />
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
          <YAxis {...commonAxisProps} width={yWidth} />
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
        <YAxis {...commonAxisProps} width={yWidth} />
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
    <div ref={containerRef}>
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
