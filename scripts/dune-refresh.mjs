/**
 * Dune Cache Refresh Script
 * Runs in GitHub Actions daily — executes Dune queries and writes results to Supabase.
 * Skips charts with is_static = true.
 */

import { createClient } from '@supabase/supabase-js'

const DUNE_API_BASE = 'https://api.dune.com/api/v1'
const MAX_WAIT_MS = 240_000
const POLL_INTERVAL_MS = 3_000
const MAX_POLL_INTERVAL_MS = 10_000
const INTER_QUERY_DELAY_MS = 2_000
const MAX_RETRIES = 3

function getEnv(key) {
  const val = process.env[key]
  if (!val) throw new Error(`Missing required environment variable: ${key}`)
  return val
}

function getSupabaseAdmin() {
  return createClient(
    getEnv('NEXT_PUBLIC_SUPABASE_URL'),
    getEnv('SUPABASE_SERVICE_ROLE_KEY'),
    { auth: { persistSession: false, autoRefreshToken: false } },
  )
}

async function duneRequest(method, path, body, attempt = 1) {
  const res = await fetch(`${DUNE_API_BASE}${path}`, {
    method,
    headers: {
      'X-Dune-API-Key': getEnv('DUNE_API_KEY'),
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 429 || res.status >= 500) {
    if (attempt >= MAX_RETRIES) throw new Error(`Dune API ${res.status} after ${MAX_RETRIES} retries`)
    const retryAfter = res.headers.get('Retry-After')
    const delay = retryAfter ? parseInt(retryAfter) * 1000 : 2 ** attempt * 1000
    console.log(`  ⏳ Rate limited, retrying in ${delay}ms...`)
    await sleep(delay)
    return duneRequest(method, path, body, attempt + 1)
  }

  if (!res.ok) throw new Error(`Dune API error ${res.status}: ${await res.text().catch(() => '')}`)
  return res.json()
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

async function runQueryToCompletion(queryId) {
  const { execution_id } = await duneRequest('POST', `/query/${queryId}/execute`)
  console.log(`  ▶ Executing query ${queryId} (execution: ${execution_id})`)

  const deadline = Date.now() + MAX_WAIT_MS
  let interval = POLL_INTERVAL_MS

  while (Date.now() < deadline) {
    await sleep(interval)
    interval = Math.min(interval * 1.5, MAX_POLL_INTERVAL_MS)

    const status = await duneRequest('GET', `/execution/${execution_id}/status`)
    const state = status.state

    if (['QUERY_STATE_PENDING', 'QUERY_STATE_EXECUTING'].includes(state)) continue

    if (state !== 'QUERY_STATE_COMPLETED') {
      throw new Error(`Query ${queryId} ended with state ${state}`)
    }

    const results = await duneRequest('GET', `/execution/${execution_id}/results`)
    return {
      executionId: execution_id,
      rows: results.result.rows,
      rowCount: results.result.metadata.row_count,
    }
  }

  throw new Error(`Query ${queryId} timed out after ${MAX_WAIT_MS}ms`)
}

async function refreshTimeseries(admin, chart, newRows) {
  const xKey = chart.x_key
  if (!xKey) throw new Error(`Chart ${chart.id} is timeseries but has no x_key`)

  const { data: existing } = await admin
    .from('dune_cache')
    .select('result_data')
    .eq('chart_id', chart.id)
    .maybeSingle()

  const existingRows = existing?.result_data ?? []
  const existingKeys = new Set(existingRows.map(r => String(r[xKey])))
  const dedupedNew = newRows.filter(r => !existingKeys.has(String(r[xKey])))

  if (dedupedNew.length === 0) {
    console.log(`  ℹ No new timeseries rows for chart ${chart.title}`)
    return
  }

  const merged = [...existingRows, ...dedupedNew].sort((a, b) => {
    const av = a[xKey]
    const bv = b[xKey]
    if (typeof av === 'number' && typeof bv === 'number') return av - bv
    return String(av) < String(bv) ? -1 : 1
  })

  const { error } = await admin.from('dune_cache').upsert(
    { chart_id: chart.id, result_data: merged, row_count: merged.length, fetched_at: new Date().toISOString() },
    { onConflict: 'chart_id' },
  )
  if (error) throw new Error(`Cache upsert failed: ${error.message}`)
  console.log(`  ✅ Appended ${dedupedNew.length} rows (total: ${merged.length})`)
}

async function refreshSnapshot(admin, chart, rows, executionId) {
  if (rows.length === 0) {
    console.log(`  ⚠ Skipping empty result for ${chart.title}`)
    return
  }
  const { error } = await admin.from('dune_cache').upsert(
    { chart_id: chart.id, execution_id: executionId, result_data: rows, row_count: rows.length, fetched_at: new Date().toISOString() },
    { onConflict: 'chart_id' },
  )
  if (error) throw new Error(`Cache upsert failed: ${error.message}`)
  console.log(`  ✅ Snapshot saved (${rows.length} rows)`)
}

async function main() {
  console.log(`\n🔄 Dune Cache Refresh — ${new Date().toISOString()}\n`)

  const admin = getSupabaseAdmin()

  const { data: charts, error } = await admin
    .from('dune_charts')
    .select('*')
    .eq('is_active', true)
    .eq('is_static', false)

  if (error) {
    console.error('❌ Failed to fetch charts:', error.message)
    process.exit(1)
  }

  if (!charts || charts.length === 0) {
    console.log('ℹ No non-static active charts to refresh.')
    return
  }

  console.log(`Found ${charts.length} chart(s) to refresh.\n`)

  let refreshed = 0
  let failed = 0

  for (const chart of charts) {
    // Double guard — SQL already excludes static, but defensive check
    if (chart.is_static) {
      console.log(`⏭ Skipping static chart: ${chart.title}`)
      continue
    }

    console.log(`\n📊 ${chart.title} (query: ${chart.query_id}, mode: ${chart.mode})`)

    try {
      const { executionId, rows, rowCount } = await runQueryToCompletion(chart.query_id)
      console.log(`  📥 Fetched ${rowCount} rows`)

      if (chart.mode === 'timeseries') {
        await refreshTimeseries(admin, chart, rows)
      } else {
        await refreshSnapshot(admin, chart, rows, executionId)
      }

      await admin
        .from('dune_charts')
        .update({ last_refreshed_at: new Date().toISOString(), last_error: null })
        .eq('id', chart.id)

      refreshed++
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`  ❌ Failed: ${msg}`)
      await admin.from('dune_charts').update({ last_error: msg }).eq('id', chart.id)
      failed++
    }

    if (charts.indexOf(chart) < charts.length - 1) {
      await sleep(INTER_QUERY_DELAY_MS)
    }
  }

  console.log(`\n─────────────────────────────`)
  console.log(`✅ Refreshed: ${refreshed}  ❌ Failed: ${failed}`)

  if (failed > 0 && refreshed === 0) {
    process.exit(1)
  }
}

main()
