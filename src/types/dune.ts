export type ChartMode = 'snapshot' | 'timeseries' | 'static'
export type ChartType = 'line' | 'area' | 'bar' | 'pie'

export interface DuneChart {
  id: string
  query_id: number
  title: string
  description: string | null
  chart_type: ChartType
  mode: ChartMode
  project_id: string | null
  blog_id: string | null
  x_key: string | null
  y_keys: string[]
  chart_colors: string[]
  is_static: boolean
  pinned_at: string | null
  pinned_note: string | null
  display_order: number
  is_active: boolean
  last_refreshed_at: string | null
  last_error: string | null
  created_at: string
  updated_at: string
}

export interface DuneCacheRow {
  id: string
  chart_id: string
  execution_id: string | null
  result_data: Record<string, unknown>[]
  row_count: number
  fetched_at: string
}

export interface DuneChartWithData extends DuneChart {
  cache: DuneCacheRow | null
}

export interface CreateDuneChartInput {
  query_id: number
  title: string
  description?: string
  chart_type: ChartType
  mode: ChartMode
  project_id?: string | null
  blog_id?: string | null
  x_key?: string | null
  y_keys?: string[]
  chart_colors?: string[]
  pinned_note?: string | null
  display_order?: number
  is_active?: boolean
}

export interface UpdateDuneChartInput extends Partial<CreateDuneChartInput> {
  id: string
}

export interface DuneRefreshResult {
  chartId: string
  title: string
  success: boolean
  rowCount?: number
  error?: string
}

export interface DuneBatchRefreshResult {
  refreshed: number
  failed: number
  results: DuneRefreshResult[]
}

// Dune API types
export interface DuneExecutionResponse {
  execution_id: string
  query_id: number
  state: DuneExecutionState
}

export type DuneExecutionState =
  | 'QUERY_STATE_PENDING'
  | 'QUERY_STATE_EXECUTING'
  | 'QUERY_STATE_COMPLETED'
  | 'QUERY_STATE_FAILED'
  | 'QUERY_STATE_CANCELLED'
  | 'QUERY_STATE_EXPIRED'

export interface DuneStatusResponse {
  execution_id: string
  query_id: number
  state: DuneExecutionState
  submitted_at: string
  expires_at?: string
  execution_started_at?: string
  execution_ended_at?: string
}

export interface DuneResultsResponse {
  execution_id: string
  query_id: number
  state: DuneExecutionState
  result: {
    rows: Record<string, unknown>[]
    metadata: {
      column_names: string[]
      row_count: number
      result_set_bytes: number
      total_row_count: number
    }
  }
}
