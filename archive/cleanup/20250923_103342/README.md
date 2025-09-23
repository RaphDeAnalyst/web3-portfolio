# Cleanup Archive - 2025-09-23

## Files Moved to Archive

### SQL Files (Database migration/setup scripts)
- `add-profile-columns.sql` - Database schema change script
- `complete-category-fix.sql` - Category constraint fix script  
- `dashboards-schema.sql` - Dashboard table schema
- `fix-category-constraint.sql` - Category constraint fix
- `fix-existing-categories.sql` - Category data fix script
- `remove-category-constraint.sql` - Category constraint removal
- `supabase-schema.sql` - Supabase schema definition

### Documentation Files
- `dune-dash-plan.md` - Planning document for Dune dashboard system
- `example-dune-blog-post.md` - Example blog post with Dune embeds

## Reason for Archival
These files appear to be temporary development/migration files that were left in the project root. They are not referenced by the application code and should be archived rather than remaining in the project root to keep the codebase clean.

## Static Analysis Performed
- ✅ No imports or requires found for these files
- ✅ No references in source code  
- ✅ No build system dependencies

## Rollback Instructions
If any of these files are needed, they can be restored from this archive directory to the project root.
