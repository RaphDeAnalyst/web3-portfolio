import { supabase } from '@/lib/supabase'
import { getSupabaseAdminClient } from '@/lib/supabase-admin'
import { logger } from '@/lib/logger'
import type {
  DuneChart,
  DuneChartWithData,
  CreateDuneChartInput,
  UpdateDuneChartInput,
} from '@/types/dune'

// ─── Public read functions (anon client, respects RLS) ───────────────────────

export async function getResearchCharts(): Promise<DuneChartWithData[]> {
  const { data, error } = await supabase
    .from('dune_charts')
    .select('*, cache:dune_cache(*)')
    .eq('is_active', true)
    .is('project_id', null)
    .is('blog_id', null)
    .order('display_order', { ascending: true })

  if (error) {
    logger.error('Failed to fetch research charts', error)
    return []
  }

  return (data ?? []) as DuneChartWithData[]
}

export async function getChartsForProject(projectId: string): Promise<DuneChartWithData[]> {
  const { data, error } = await supabase
    .from('dune_charts')
    .select('*, cache:dune_cache(*)')
    .eq('is_active', true)
    .eq('project_id', projectId)
    .order('display_order', { ascending: true })

  if (error) {
    logger.error('Failed to fetch charts for project', error, { projectId })
    return []
  }

  return (data ?? []) as DuneChartWithData[]
}

export async function getChartsForBlog(blogId: string): Promise<DuneChartWithData[]> {
  const { data, error } = await supabase
    .from('dune_charts')
    .select('*, cache:dune_cache(*)')
    .eq('is_active', true)
    .eq('blog_id', blogId)
    .order('display_order', { ascending: true })

  if (error) {
    logger.error('Failed to fetch charts for blog', error, { blogId })
    return []
  }

  return (data ?? []) as DuneChartWithData[]
}

// ─── Admin read functions (service role, bypasses RLS) ───────────────────────

export async function getAllChartsAdmin(): Promise<DuneChartWithData[]> {
  const admin = getSupabaseAdminClient()
  const { data, error } = await admin
    .from('dune_charts')
    .select('*, cache:dune_cache(*)')
    .order('display_order', { ascending: true })

  if (error) throw new Error(`Failed to fetch all charts: ${error.message}`)
  return (data ?? []) as DuneChartWithData[]
}

export async function getChartsToRefresh(): Promise<DuneChart[]> {
  const admin = getSupabaseAdminClient()
  const { data, error } = await admin
    .from('dune_charts')
    .select('*')
    .eq('is_active', true)
    .eq('is_static', false)

  if (error) throw new Error(`Failed to fetch charts to refresh: ${error.message}`)
  return (data ?? []) as DuneChart[]
}

// ─── Cache write functions ────────────────────────────────────────────────────

export async function refreshChart(
  chart: DuneChart,
  rows: Record<string, unknown>[],
  executionId: string,
): Promise<void> {
  const admin = getSupabaseAdminClient()

  if (chart.mode === 'timeseries' && chart.x_key) {
    await refreshTimeseries(admin, chart, rows)
  } else {
    // snapshot or static — upsert one row
    if (rows.length === 0) {
      logger.warn(`Skipping empty result for chart ${chart.id} (${chart.title})`)
      return
    }
    const { error } = await admin.from('dune_cache').upsert(
      {
        chart_id: chart.id,
        execution_id: executionId,
        result_data: rows,
        row_count: rows.length,
        fetched_at: new Date().toISOString(),
      },
      { onConflict: 'chart_id' },
    )
    if (error) throw new Error(`Failed to upsert cache for chart ${chart.id}: ${error.message}`)
  }

  const { error: chartError } = await admin
    .from('dune_charts')
    .update({ last_refreshed_at: new Date().toISOString(), last_error: null })
    .eq('id', chart.id)

  if (chartError) logger.error('Failed to update last_refreshed_at', chartError)
}

async function refreshTimeseries(
  admin: ReturnType<typeof getSupabaseAdminClient>,
  chart: DuneChart,
  newRows: Record<string, unknown>[],
): Promise<void> {
  const xKey = chart.x_key!

  const { data: existing } = await admin
    .from('dune_cache')
    .select('result_data')
    .eq('chart_id', chart.id)
    .maybeSingle()

  const existingRows: Record<string, unknown>[] = (existing?.result_data ?? []) as Record<string, unknown>[]
  const existingKeys = new Set(existingRows.map(r => String(r[xKey])))

  const dedupedNew = newRows.filter(r => !existingKeys.has(String(r[xKey])))
  if (dedupedNew.length === 0) return

  const merged = [...existingRows, ...dedupedNew].sort((a, b) => {
    const av = a[xKey]
    const bv = b[xKey]
    if (typeof av === 'number' && typeof bv === 'number') return av - bv
    return String(av) < String(bv) ? -1 : 1
  })

  const { error } = await admin.from('dune_cache').upsert(
    {
      chart_id: chart.id,
      result_data: merged,
      row_count: merged.length,
      fetched_at: new Date().toISOString(),
    },
    { onConflict: 'chart_id' },
  )
  if (error) throw new Error(`Failed to upsert timeseries for chart ${chart.id}: ${error.message}`)
}

export async function pinChart(
  chartId: string,
  rows: Record<string, unknown>[],
  executionId: string,
  pinnedNote?: string,
): Promise<void> {
  const admin = getSupabaseAdminClient()

  const { error: cacheError } = await admin.from('dune_cache').upsert(
    {
      chart_id: chartId,
      execution_id: executionId,
      result_data: rows,
      row_count: rows.length,
      fetched_at: new Date().toISOString(),
    },
    { onConflict: 'chart_id' },
  )
  if (cacheError) throw new Error(`Failed to write cache for pin: ${cacheError.message}`)

  const { error: chartError } = await admin
    .from('dune_charts')
    .update({
      is_static: true,
      pinned_at: new Date().toISOString(),
      pinned_note: pinnedNote ?? null,
      last_refreshed_at: new Date().toISOString(),
      last_error: null,
    })
    .eq('id', chartId)

  if (chartError) throw new Error(`Failed to set is_static: ${chartError.message}`)
}

export async function recordError(chartId: string, message: string): Promise<void> {
  const admin = getSupabaseAdminClient()
  await admin
    .from('dune_charts')
    .update({ last_error: message })
    .eq('id', chartId)
}

// ─── Admin CRUD ───────────────────────────────────────────────────────────────

export async function createDuneChart(input: CreateDuneChartInput): Promise<DuneChart> {
  const admin = getSupabaseAdminClient()
  const { data, error } = await admin
    .from('dune_charts')
    .insert({ ...input, updated_at: new Date().toISOString() })
    .select()
    .single()

  if (error) throw new Error(`Failed to create chart: ${error.message}`)
  return data as DuneChart
}

export async function updateDuneChart(input: UpdateDuneChartInput): Promise<DuneChart> {
  const admin = getSupabaseAdminClient()
  const { id, ...fields } = input
  const { data, error } = await admin
    .from('dune_charts')
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`Failed to update chart: ${error.message}`)
  return data as DuneChart
}

export async function deleteDuneChart(id: string): Promise<void> {
  const admin = getSupabaseAdminClient()
  const { error } = await admin.from('dune_charts').delete().eq('id', id)
  if (error) throw new Error(`Failed to delete chart: ${error.message}`)
}

export async function reorderDuneCharts(orderedIds: string[]): Promise<void> {
  const admin = getSupabaseAdminClient()
  await Promise.all(
    orderedIds.map((id, index) =>
      admin.from('dune_charts').update({ display_order: index }).eq('id', id),
    ),
  )
}
