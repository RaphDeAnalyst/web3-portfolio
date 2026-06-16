import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { logger } from '@/lib/logger'
import { runQueryToCompletion, DuneQueryError } from '@/lib/dune-service'
import {
  getChartsToRefresh,
  refreshChart,
  pinChart,
  recordError,
  getAllChartsAdmin,
} from '@/lib/dune-cache-service'
import type { DuneRefreshResult } from '@/types/dune'

export const runtime = 'nodejs'
export const maxDuration = 300

// Simple in-memory rate limit: max 1 batch cron per 5 min, max 10 single-chart actions per min
const lastCronRun = { ts: 0 }
const singleActionCounts = new Map<string, { count: number; windowStart: number }>()
const CRON_COOLDOWN_MS = 5 * 60 * 1000
const SINGLE_ACTION_LIMIT = 10
const SINGLE_ACTION_WINDOW_MS = 60 * 1000

function getJwtSecret(): Uint8Array {
  const s = process.env.JWT_SECRET
  if (!s) throw new Error('JWT_SECRET not set')
  return new TextEncoder().encode(s)
}

async function isAuthorized(request: NextRequest): Promise<boolean> {
  // Path 1: CRON_SECRET bearer token (GitHub Actions / cron)
  const authHeader = request.headers.get('Authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret && token === cronSecret) return true
  }

  // Path 2: admin-token cookie (admin UI)
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('admin-token')?.value
    if (token) {
      const { payload } = await jwtVerify(token, getJwtSecret())
      if (payload.role === 'admin') return true
    }
  } catch {
    // invalid or expired token
  }

  return false
}

export async function POST(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { mode?: string; chartId?: string; action?: string; pinnedNote?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  try {
    // ── Cron batch: refresh all non-static active charts ───────────────────
    if (body.mode === 'cron') {
      const now = Date.now()
      if (now - lastCronRun.ts < CRON_COOLDOWN_MS) {
        return NextResponse.json({ error: 'Cron already ran recently — try again later' }, { status: 429 })
      }
      lastCronRun.ts = now
      const charts = await getChartsToRefresh()
      const results: DuneRefreshResult[] = []
      let refreshed = 0
      let failed = 0

      for (const chart of charts) {
        if (chart.is_static) continue
        try {
          const { executionId, rows } = await runQueryToCompletion(chart.query_id)
          await refreshChart(chart, rows, executionId)
          results.push({ chartId: chart.id, title: chart.title, success: true, rowCount: rows.length })
          refreshed++
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err)
          await recordError(chart.id, msg)
          results.push({ chartId: chart.id, title: chart.title, success: false, error: msg })
          failed++
          logger.error(`Dune refresh failed for chart ${chart.title}`, err as Error)
        }
      }

      return NextResponse.json({ refreshed, failed, results })
    }

    // ── Single chart actions ────────────────────────────────────────────────
    // Rate-limit single-chart actions per caller (rough guard for admin UI abuse)
    const callerKey = body.chartId ?? 'unknown'
    const now2 = Date.now()
    const bucket = singleActionCounts.get(callerKey) ?? { count: 0, windowStart: now2 }
    if (now2 - bucket.windowStart > SINGLE_ACTION_WINDOW_MS) {
      bucket.count = 0
      bucket.windowStart = now2
    }
    bucket.count++
    singleActionCounts.set(callerKey, bucket)
    if (bucket.count > SINGLE_ACTION_LIMIT) {
      return NextResponse.json({ error: 'Too many requests — slow down' }, { status: 429 })
    }

    if (!body.chartId) {
      return NextResponse.json({ error: 'chartId is required' }, { status: 400 })
    }

    const charts = await getAllChartsAdmin()
    const chart = charts.find(c => c.id === body.chartId)
    if (!chart) {
      return NextResponse.json({ error: 'Chart not found' }, { status: 404 })
    }

    if (body.action === 'refresh') {
      if (chart.is_static) {
        return NextResponse.json({ error: 'Cannot refresh a pinned static chart' }, { status: 409 })
      }
      const { executionId, rows } = await runQueryToCompletion(chart.query_id)
      await refreshChart(chart, rows, executionId)
      return NextResponse.json({ success: true, rowCount: rows.length })
    }

    if (body.action === 'pin') {
      const { executionId, rows } = await runQueryToCompletion(chart.query_id)
      await pinChart(chart.id, rows, executionId, body.pinnedNote)
      return NextResponse.json({ success: true, rowCount: rows.length })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (err) {
    const msg = err instanceof DuneQueryError
      ? `Dune query error: ${err.message}`
      : `Internal error: ${err instanceof Error ? err.message : String(err)}`

    logger.error('Dune refresh API error', err as Error)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
