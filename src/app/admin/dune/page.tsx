'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/admin/toast-container'
import { DeleteConfirmButton } from '@/components/admin/delete-confirm-button'
import { deleteDuneChartAsAdmin, reorderDuneChartsAsAdmin } from '@/lib/actions/admin-dune-actions'
import type { DuneChartWithData } from '@/types/dune'

export default function AdminDunePage() {
  const { toast, showSuccess, showError, showLoading, dismiss } = useToast()
  const [charts, setCharts] = useState<DuneChartWithData[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshingId, setRefreshingId] = useState<string | null>(null)
  const [pinningId, setPinningId] = useState<string | null>(null)
  const [pinNote, setPinNote] = useState('')
  const [pinTargetId, setPinTargetId] = useState<string | null>(null)

  const loadCharts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/dune/charts')
      const data = await res.json()
      setCharts(data.charts ?? [])
    } catch {
      showError('Failed to load charts')
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => { loadCharts() }, [loadCharts])

  const handleDelete = async (id: string) => {
    showLoading('Deleting chart...')
    const result = await deleteDuneChartAsAdmin(id)
    if (result.success) {
      showSuccess('Chart deleted')
      setCharts(prev => prev.filter(c => c.id !== id))
    } else {
      showError(result.error ?? 'Delete failed')
    }
  }

  const handleRefresh = async (id: string) => {
    setRefreshingId(id)
    try {
      const res = await fetch('/api/dune/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chartId: id, action: 'refresh' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      showSuccess(`Refreshed — ${data.rowCount} rows`)
      await loadCharts()
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Refresh failed')
    } finally {
      setRefreshingId(null)
    }
  }

  const handlePin = async () => {
    if (!pinTargetId) return
    setPinningId(pinTargetId)
    try {
      const res = await fetch('/api/dune/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chartId: pinTargetId, action: 'pin', pinnedNote: pinNote }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      showSuccess('Chart pinned — data frozen')
      setPinTargetId(null)
      setPinNote('')
      await loadCharts()
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Pin failed')
    } finally {
      setPinningId(null)
    }
  }

  const handleMove = async (id: string, direction: 'up' | 'down') => {
    const idx = charts.findIndex(c => c.id === id)
    if (idx < 0) return
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === charts.length - 1) return
    const reordered = [...charts]
    const swap = direction === 'up' ? idx - 1 : idx + 1
    ;[reordered[idx], reordered[swap]] = [reordered[swap], reordered[idx]]
    setCharts(reordered)
    await reorderDuneChartsAsAdmin(reordered.map(c => c.id))
  }

  const modeBadge = (mode: string) => {
    const styles: Record<string, string> = {
      snapshot: 'background: var(--bg-secondary); color: var(--text-secondary)',
      timeseries: 'background: var(--bg-secondary); color: var(--accent)',
      static: 'background: var(--bg-secondary); color: var(--text-muted)',
    }
    return (
      <span
        className="text-xs font-mono px-2 py-0.5"
        style={{ border: '1px solid var(--border)', ...Object.fromEntries((styles[mode] ?? styles.snapshot).split(';').map(s => s.split(':').map(p => p.trim()))) }}
      >
        {mode}
      </span>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <ToastContainer toast={toast} onDismiss={dismiss} />
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/admin" className="text-xs font-mono opacity-50 hover:opacity-100 mb-2 inline-block">
              ← Admin
            </Link>
            <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Dune Charts
            </h1>
          </div>
          <Link
            href="/admin/dune/new"
            className="text-sm px-4 py-2 transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
          >
            + New chart
          </Link>
        </div>

        {loading ? (
          <p className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>Loading...</p>
        ) : charts.length === 0 ? (
          <div
            className="py-16 text-center text-sm font-mono"
            style={{ color: 'var(--text-muted)', border: '1px dashed var(--border)' }}
          >
            No charts yet. <Link href="/admin/dune/new" className="underline">Add one.</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {charts.map((chart, idx) => (
              <div
                key={chart.id}
                className="flex items-start gap-4 p-4"
                style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
              >
                {/* Reorder */}
                <div className="flex flex-col gap-1 pt-0.5">
                  <button onClick={() => handleMove(chart.id, 'up')} disabled={idx === 0}
                    className="text-xs opacity-40 hover:opacity-100 disabled:opacity-10" title="Move up">▲</button>
                  <button onClick={() => handleMove(chart.id, 'down')} disabled={idx === charts.length - 1}
                    className="text-xs opacity-40 hover:opacity-100 disabled:opacity-10" title="Move down">▼</button>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-serif text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                      {chart.title}
                    </span>
                    {modeBadge(chart.mode)}
                    {chart.is_static && (
                      <span className="text-xs font-mono px-2 py-0.5" style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                        pinned
                      </span>
                    )}
                    {!chart.is_active && (
                      <span className="text-xs font-mono px-2 py-0.5" style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                        inactive
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                    query: {chart.query_id} · {chart.chart_type}
                    {chart.project_id && ' · project'}
                    {chart.blog_id && ' · blog'}
                    {!chart.project_id && !chart.blog_id && ' · global'}
                  </p>
                  {chart.last_refreshed_at && (
                    <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      updated {new Date(chart.last_refreshed_at).toLocaleString()}
                    </p>
                  )}
                  {chart.last_error && (
                    <p className="text-xs font-mono mt-1" style={{ color: '#ef4444' }}>
                      ⚠ {chart.last_error}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link
                    href={`/admin/dune/${chart.id}`}
                    className="text-xs px-3 py-1.5 transition-opacity hover:opacity-80"
                    style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                  >
                    Edit
                  </Link>
                  {!chart.is_static && (
                    <button
                      onClick={() => handleRefresh(chart.id)}
                      disabled={refreshingId === chart.id}
                      className="text-xs px-3 py-1.5 transition-opacity hover:opacity-80 disabled:opacity-40"
                      style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
                    >
                      {refreshingId === chart.id ? '...' : 'Refresh'}
                    </button>
                  )}
                  {!chart.is_static && (
                    <button
                      onClick={() => setPinTargetId(chart.id)}
                      className="text-xs px-3 py-1.5 transition-opacity hover:opacity-80"
                      style={{ border: '1px solid var(--accent)', color: 'var(--accent)' }}
                    >
                      Pin
                    </button>
                  )}
                  <DeleteConfirmButton onConfirm={() => handleDelete(chart.id)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pin modal */}
      {pinTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <div className="w-full max-w-md p-6 mx-4" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border)' }}>
            <h2 className="font-serif text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Pin this chart
            </h2>
            <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
              This will fetch data once from Dune and freeze it permanently. Add an optional note to explain when/why it was captured.
            </p>
            <textarea
              value={pinNote}
              onChange={e => setPinNote(e.target.value)}
              placeholder="e.g. Captured May 11, 2026 — state at time of $200K drain investigation"
              rows={3}
              className="w-full text-xs font-mono p-3 resize-none mb-4"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
              }}
            />
            <div className="flex gap-3">
              <button
                onClick={handlePin}
                disabled={pinningId !== null}
                className="flex-1 py-2 text-sm transition-opacity hover:opacity-80 disabled:opacity-40"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}
              >
                {pinningId ? 'Pinning...' : 'Pin chart'}
              </button>
              <button
                onClick={() => { setPinTargetId(null); setPinNote('') }}
                className="px-4 py-2 text-sm transition-opacity hover:opacity-80"
                style={{ border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
