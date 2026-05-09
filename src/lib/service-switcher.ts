// Direct re-exports of Supabase services.
// The localStorage fallback layer has been removed — Supabase is the sole backend.
// Legacy service files (blog-service.ts, project-service.ts, profile-service.ts)
// are retained only for data-migration.ts and shared type imports.

export { blogServiceSupabase as blogService } from './blog-service-supabase'
export { projectServiceSupabase as projectService } from './project-service-supabase'
export { profileServiceSupabase as profileService } from './profile-service-supabase'
export { dashboardServiceSupabase as dashboardService } from './dashboard-service-supabase'
