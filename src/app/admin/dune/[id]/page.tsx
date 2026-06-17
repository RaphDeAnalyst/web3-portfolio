'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/admin/toast-container'
import { saveDuneChartAsAdmin } from '@/lib/actions/admin-dune-actions'
import { projectServiceSupabase, type Project } from '@/lib/project-service-supabase'
import type { DuneChart, ChartType, ChartMode } from '@/types/dune'
import { CHART_PALETTE } from '@/lib/chartColors'

const PALETTE_ENTRIES = Object.entries(CHART_PALETTE) as [string, { dark: string; light: string }][]

const CHART_TYPES: ChartType[] = ['line', 'area', 'bar', 'pie']
const CHART_MODES: ChartMode[] = ['snapshot', 'timeseries', 'static']

interface FormState {
  query_id: string
  title: string
  description: string
  chart_type: ChartType
  mode: ChartMode
  project_id: string
  x_key: string
  y_keys: string
  pinned_note: string
  display_order: string
  is_active: boolean
  chart_colors: string[]
}

const DEFAULT_FORM: FormState = {
  query_id: '',
  title: '',
  description: '',
  chart_type: 'line',
  mode: 'snapshot',
  project_id: '',
  x_key: '',
  y_keys: '',
  pinned_note: '',
  display_order: '0',
  is_active: true,
  chart_colors: [],
}

export default function DuneChartEditorPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast, showSuccess, showError, showLoading, dismiss } = useToast()
  const isNew = params.id === 'new'

  const [form, setForm] = useState<FormState>(DEFAULT_FORM)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [availableColumns, setAvailableColumns] = useState<string[]>([])
  const [dataRowCount, setDataRowCount] = useState(0)

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm(prev => ({ ...prev, [field]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value }))

  const updateColorSlot = (index: number, key: string) =>
    setForm(prev => {
      const next = [...prev.chart_colors]
      while (next.length <= index) next.push('')
      next[index] = key
      return { ...prev, chart_colors: next }
    })

  const addColorSlot = () =>
    setForm(prev => ({ ...prev, chart_colors: [...prev.chart_colors, ''] }))

  const removeColorSlot = (index: number) =>
    setForm(prev => {
      const next = [...prev.chart_colors]
      next.splice(index, 1)
      return { ...prev, chart_colors: next }
    })

  const loadData = useCallback(async () => {
    const [projs] = await Promise.all([
      projectServiceSupabase.getAllProjects().catch(() => []),
    ])
    setProjects(projs)

    if (!isNew) {
      try {
        const res = await fetch('/api/admin/dune/charts')
        const data = await res.json()
        const chart: DuneChart | undefined = data.charts?.find((c: DuneChart) => c.id === params.id)
        if (chart) {
          setForm({
            query_id: String(chart.query_id),
            title: chart.title,
            description: chart.description ?? '',
            chart_type: chart.chart_type,
            mode: chart.mode,
            project_id: chart.project_id ?? '',
            x_key: chart.x_key ?? '',
            y_keys: (chart.y_keys ?? []).join(', '),
            pinned_note: chart.pinned_note ?? '',
            display_order: String(chart.display_order),
            is_active: chart.is_active,
            chart_colors: chart.chart_colors ?? [],
          })
          // Load available columns from cached data if it exists
          const cacheRow = (data.charts as (DuneChart & { cache?: { result_data: Record<string, unknown>[] } })[])
            .find(c => c.id === params.id)?.cache
          if (cacheRow?.result_data?.length) {
            setAvailableColumns(Object.keys(cacheRow.result_data[0]))
            setDataRowCount(cacheRow.result_data.length)
          }
        }
      } catch {
        showError('Failed to load chart')
      } finally {
        setLoading(false)
      }
    }
  }, [isNew, params.id, showError])

  useEffect(() => { loadData() }, [loadData])

  const handleSave = async () => {
    if (!form.query_id || !form.title) {
      showError('Query ID and title are required')
      return
    }

    setSaving(true)
    showLoading('Saving...')

    const input = {
      ...(!isNew && { id: params.id }),
      query_id: parseInt(form.query_id, 10),
      title: form.title,
      description: form.description || undefined,
      chart_type: form.chart_type,
      mode: form.mode,
      project_id: form.project_id || null,
      blog_id: null,
      x_key: form.x_key || null,
      y_keys: form.y_keys ? form.y_keys.split(',').map(s => s.trim()).filter(Boolean) : [],
      chart_colors: form.chart_colors,
      pinned_note: form.pinned_note || null,
      display_order: parseInt(form.display_order, 10) || 0,
      is_active: form.is_active,
    }

    const result = await saveDuneChartAsAdmin(input)
    setSaving(false)

    if (result.success) {
      showSuccess('Chart saved')
      router.push('/admin/dune')
    } else {
      showError(result.error ?? 'Save failed')
    }
  }

  const yKeysList = form.y_keys.split(',').map(s => s.trim()).filter(Boolean)
  const pieSlotCount = Math.max(dataRowCount, form.chart_colors.length, 1)
  const colorSlots = form.chart_type === 'pie'
    ? Array.from({ length: pieSlotCount }, (_, i) => form.chart_colors[i] ?? '')
    : Array.from({ length: Math.max(yKeysList.length, 1) }, (_, i) => form.chart_colors[i] ?? '')

  const fieldClass = "w-full text-sm p-2.5 font-mono"
  const fieldStyle = {
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
  }
  const labelClass = "block text-xs font-mono uppercase tracking-wider mb-1.5"
  const labelStyle = { color: 'var(--text-muted)' }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
        <p className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <ToastContainer toast={toast} onDismiss={dismiss} />
      <div className="max-w-2xl mx-auto">

        <div className="mb-8">
          <Link href="/admin/dune" className="text-xs font-mono opacity-50 hover:opacity-100 mb-2 inline-block">
            ← Dune Charts
          </Link>
          <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {isNew ? 'New chart' : 'Edit chart'}
          </h1>
        </div>

        <div className="space-y-5">
          <div>
            <label className={labelClass} style={labelStyle}>Dune Query ID *</label>
            <input type="number" value={form.query_id} onChange={set('query_id')}
              placeholder="e.g. 3844537" className={fieldClass} style={fieldStyle} />
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Found in the Dune query URL: dune.com/queries/<strong>[this number]</strong>
            </p>
          </div>

          <div>
            <label className={labelClass} style={labelStyle}>Title *</label>
            <input type="text" value={form.title} onChange={set('title')}
              placeholder="USDT Flow — EVM Chains" className={fieldClass} style={fieldStyle} />
          </div>

          <div>
            <label className={labelClass} style={labelStyle}>Description</label>
            <textarea value={form.description} onChange={set('description')} rows={2}
              placeholder="Brief description shown under the chart title" className={`${fieldClass} resize-none`} style={fieldStyle} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={labelStyle}>Chart type</label>
              <select value={form.chart_type} onChange={set('chart_type')} className={fieldClass} style={fieldStyle}>
                {CHART_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>Mode</label>
              <select value={form.mode} onChange={set('mode')} className={fieldClass} style={fieldStyle}>
                {CHART_MODES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {form.mode === 'snapshot' && 'Daily overwrite'}
                {form.mode === 'timeseries' && 'Daily append, deduped by x_key'}
                {form.mode === 'static' && 'Frozen — use Pin button to set data'}
              </p>
            </div>
          </div>

          {/* Available columns from cached data */}
          {availableColumns.length > 0 && (
            <div className="p-3" style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <p className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                Available columns from Dune result
              </p>
              <div className="flex flex-wrap gap-2">
                {availableColumns.map(col => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => {
                      if (!form.x_key) {
                        setForm(prev => ({ ...prev, x_key: col }))
                      } else {
                        const existing = form.y_keys ? form.y_keys.split(',').map(s => s.trim()).filter(Boolean) : []
                        if (!existing.includes(col)) {
                          setForm(prev => ({ ...prev, y_keys: [...existing, col].join(', ') }))
                        }
                      }
                    }}
                    className="text-xs font-mono px-2 py-1 transition-opacity hover:opacity-100"
                    style={{ border: '1px solid var(--accent)', color: 'var(--accent)', opacity: 0.8 }}
                    title="Click to set as X key (if empty) or add to Y keys"
                  >
                    {col}
                  </button>
                ))}
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                Click a column: sets X key first (if empty), then adds to Y keys
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={labelStyle}>
                {form.chart_type === 'pie' ? 'Category key' : 'X axis key'}
              </label>
              <input type="text" value={form.x_key} onChange={set('x_key')}
                placeholder={form.chart_type === 'pie' ? 'status' : 'day'} className={fieldClass} style={fieldStyle} />
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {form.chart_type === 'pie' ? 'Column whose values label each slice — one row = one slice' : 'Column name for X axis'}
              </p>
            </div>
            <div>
              <label className={labelClass} style={labelStyle}>
                {form.chart_type === 'pie' ? 'Value key' : 'Y axis keys'}
              </label>
              <input type="text" value={form.y_keys} onChange={set('y_keys')}
                placeholder={form.chart_type === 'pie' ? 'total_txn' : 'volume, transfers'} className={fieldClass} style={fieldStyle} />
              {form.chart_type === 'pie' ? (
                <>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Single column — the numeric value for each slice</p>
                  {yKeysList.length > 1 && (
                    <p className="text-xs mt-1 font-mono" style={{ color: '#d97706' }}>
                      ⚠ Pie charts use one value column. Only the first entry (&quot;{yKeysList[0]}&quot;) will be used — remove the rest.
                    </p>
                  )}
                </>
              ) : (
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Comma-separated column names</p>
              )}
            </div>
          </div>

          {/* Color swatch picker */}
          <div>
            <label className={labelClass} style={labelStyle}>Series colors</label>
            <div className="space-y-2.5">
              {colorSlots.map((selected, i) => {
                const label = form.chart_type === 'pie'
                  ? `Slice ${i + 1}`
                  : (yKeysList[i] ?? `Series ${i + 1}`)
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-mono w-20 shrink-0 truncate" style={{ color: 'var(--text-muted)' }}>
                      {label}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {PALETTE_ENTRIES.map(([name, hex]) => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => updateColorSlot(i, name)}
                          title={name}
                          style={{
                            width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                            backgroundColor: hex.dark,
                            border: selected === name ? '2px solid var(--text-primary)' : '2px solid transparent',
                            boxShadow: selected === name ? '0 0 0 1px var(--card-bg)' : 'none',
                          }}
                        />
                      ))}
                      {selected && (
                        <button
                          type="button"
                          onClick={() => updateColorSlot(i, '')}
                          className="text-xs ml-1"
                          title="Clear"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    {form.chart_type === 'pie' && (
                      <button
                        type="button"
                        onClick={() => removeColorSlot(i)}
                        className="text-xs"
                        style={{ color: 'var(--text-muted)' }}
                      >
                        remove
                      </button>
                    )}
                  </div>
                )
              })}
              {form.chart_type === 'pie' && (
                <button
                  type="button"
                  onClick={addColorSlot}
                  className="text-xs font-mono mt-1"
                  style={{ color: 'var(--accent)' }}
                >
                  + add slice
                </button>
              )}
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              Unset slots fall back to palette order. Swatches shown in dark preview.
            </p>
          </div>

          <div>
            <label className={labelClass} style={labelStyle}>Link to project (optional)</label>
            <select value={form.project_id} onChange={set('project_id')} className={fieldClass} style={fieldStyle}>
              <option value="">— Global /dashboards chart —</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              Chart appears on the selected work page. Leave blank for the global Dashboards page.
              To link to a blog post, set this after creating the chart via the API or database.
            </p>
          </div>

          <div>
            <label className={labelClass} style={labelStyle}>Pinned note (for static charts)</label>
            <input type="text" value={form.pinned_note} onChange={set('pinned_note')}
              placeholder="Captured May 11, 2026 — state at time of investigation" className={fieldClass} style={fieldStyle} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass} style={labelStyle}>Display order</label>
              <input type="number" value={form.display_order} onChange={set('display_order')}
                className={fieldClass} style={fieldStyle} />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer text-sm" style={{ color: 'var(--text-secondary)' }}>
                <input type="checkbox" checked={form.is_active}
                  onChange={e => setForm(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="w-4 h-4" />
                Active (visible on site)
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2.5 text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-40"
              style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
            >
              {saving ? 'Saving...' : 'Save chart'}
            </button>
            <Link
              href="/admin/dune"
              className="px-6 py-2.5 text-sm transition-opacity hover:opacity-80"
              style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
