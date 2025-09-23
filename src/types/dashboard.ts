export interface Dashboard {
  id: string
  dashboard_id: string
  query_id?: string
  visualization_id?: string
  title: string
  description?: string
  category?: string
  tags?: string[]
  featured?: boolean
  complexity?: string
  parameters?: Record<string, any>
  thumbnail_url?: string
  dune_url?: string
  embed_url?: string
  sort_order?: number
  is_active?: boolean
  created_at?: string
  updated_at?: string
  report_key_finding?: string
  report_business_impact?: string
  report_methodology?: string
  report_timeframe?: string
  report_confidence_level?: string
  report_business_context?: string
  report_key_insights?: string[]
  report_data_sources?: string[]
  report_analytical_approach?: string
  report_assumptions?: string[]
  report_limitations?: string[]
  report_recommendations_protocols?: string[]
  report_recommendations_investors?: string[]
  report_recommendations_strategic?: string[]
  report_technical_implementation_link?: string
  report_code_repository_link?: string
  report_related_projects?: string[]
  report_reading_time?: number
  report_update_frequency?: string
  has_custom_report?: boolean
}

export interface CreateDashboardInput {
  dashboard_id: string
  query_id?: string
  visualization_id?: string
  title: string
  description?: string
  category?: string
  tags?: string[]
  featured?: boolean
  complexity?: string
  parameters?: Record<string, any>
  thumbnail_url?: string
  dune_url?: string
  embed_url?: string
  sort_order?: number
  is_active?: boolean
  report_key_finding?: string
  report_business_impact?: string
  report_methodology?: string
  report_timeframe?: string
  report_confidence_level?: string
  report_business_context?: string
  report_key_insights?: string[]
  report_data_sources?: string[]
  report_analytical_approach?: string
  report_assumptions?: string[]
  report_limitations?: string[]
  report_recommendations_protocols?: string[]
  report_recommendations_investors?: string[]
  report_recommendations_strategic?: string[]
  report_technical_implementation_link?: string
  report_code_repository_link?: string
  report_related_projects?: string[]
  report_reading_time?: number
  report_update_frequency?: string
  has_custom_report?: boolean
}

export interface UpdateDashboardInput extends Partial<CreateDashboardInput> {
  id: string
}

export interface DuneEmbedProps {
  embedUrl: string
  title?: string
  caption?: string
  width?: string
  height?: string
  className?: string
  lazy?: boolean
  dashboard?: Dashboard
}

export interface PlaceholderMatch {
  placeholder: string
  dashboardId: string
  startIndex: number
  endIndex: number
}

export interface ParsedContent {
  content: string
  placeholders: PlaceholderMatch[]
  dashboards: Dashboard[]
}

export interface DashboardFormData {
  dashboard_id: string
  title: string
  description?: string
  category?: string
  tags: string[]
  embed_url?: string
  dune_url?: string
  featured: boolean
  is_active: boolean
  complexity?: string
  sort_order?: number
}

export type DashboardCategory =
  | 'defi'
  | 'nft'
  | 'gaming'
  | 'infrastructure'
  | 'analytics'
  | 'governance'
  | 'trading'
  | 'yield'
  | 'security'
  | 'metrics'
  | 'other'

export type DashboardComplexity =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'expert'