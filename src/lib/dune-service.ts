import type {
  DuneExecutionResponse,
  DuneExecutionState,
  DuneStatusResponse,
  DuneResultsResponse,
} from '@/types/dune'
import { logger } from '@/lib/logger'

const DUNE_API_BASE = 'https://api.dune.com/api/v1'
const MAX_WAIT_MS = 240_000   // 4 minutes
const POLL_INTERVAL_MS = 3_000
const MAX_POLL_INTERVAL_MS = 10_000
const MAX_RETRIES = 3

export class DuneQueryError extends Error {
  constructor(
    message: string,
    public readonly executionId?: string,
    public readonly queryId?: number,
  ) {
    super(message)
    this.name = 'DuneQueryError'
  }
}

function getApiKey(): string {
  const key = process.env.DUNE_API_KEY
  if (!key) throw new Error('DUNE_API_KEY environment variable is not set')
  return key
}

async function duneRequest<T>(
  method: 'GET' | 'POST',
  path: string,
  body?: unknown,
  attempt = 1,
): Promise<T> {
  const res = await fetch(`${DUNE_API_BASE}${path}`, {
    method,
    headers: {
      'X-Dune-API-Key': getApiKey(),
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  if (res.status === 429 || res.status >= 500) {
    if (attempt >= MAX_RETRIES) {
      throw new DuneQueryError(`Dune API returned ${res.status} after ${MAX_RETRIES} attempts`)
    }
    const retryAfter = res.headers.get('Retry-After')
    const delay = retryAfter ? parseInt(retryAfter, 10) * 1000 : 2 ** attempt * 1000
    await new Promise(r => setTimeout(r, delay))
    return duneRequest<T>(method, path, body, attempt + 1)
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new DuneQueryError(`Dune API error ${res.status}: ${text}`)
  }

  return res.json() as Promise<T>
}

export async function executeQuery(queryId: number): Promise<string> {
  const data = await duneRequest<DuneExecutionResponse>('POST', `/query/${queryId}/execute`)
  return data.execution_id
}

export async function getExecutionStatus(executionId: string): Promise<DuneStatusResponse> {
  return duneRequest<DuneStatusResponse>('GET', `/execution/${executionId}/status`)
}

export async function getExecutionResults(executionId: string): Promise<DuneResultsResponse> {
  return duneRequest<DuneResultsResponse>('GET', `/execution/${executionId}/results`)
}

const TERMINAL_STATES: DuneExecutionState[] = [
  'QUERY_STATE_COMPLETED',
  'QUERY_STATE_FAILED',
  'QUERY_STATE_CANCELLED',
  'QUERY_STATE_EXPIRED',
]

export async function runQueryToCompletion(
  queryId: number,
  maxWaitMs = MAX_WAIT_MS,
): Promise<{ executionId: string; rows: Record<string, unknown>[]; rowCount: number }> {
  const executionId = await executeQuery(queryId)
  logger.info(`Dune query ${queryId} executing`, { executionId })

  const deadline = Date.now() + maxWaitMs
  let pollInterval = POLL_INTERVAL_MS

  while (Date.now() < deadline) {
    await new Promise(r => setTimeout(r, pollInterval))
    pollInterval = Math.min(pollInterval * 1.5, MAX_POLL_INTERVAL_MS)

    const status = await getExecutionStatus(executionId)

    if (!TERMINAL_STATES.includes(status.state)) continue

    if (status.state !== 'QUERY_STATE_COMPLETED') {
      throw new DuneQueryError(
        `Query ended with state ${status.state}`,
        executionId,
        queryId,
      )
    }

    const results = await getExecutionResults(executionId)
    const rows = results.result.rows
    const rowCount = results.result.metadata.row_count

    logger.success(`Dune query ${queryId} completed`, { executionId, rowCount })
    return { executionId, rows, rowCount }
  }

  throw new DuneQueryError(
    `Query ${queryId} did not complete within ${maxWaitMs}ms`,
    executionId,
    queryId,
  )
}
