# Database Migrations

This directory contains SQL migration files for setting up and updating the Web3 Portfolio database schema.

## Migration Order

Migrations must be run in numerical order:

1. **`001_initial_schema.sql`** - Creates all base tables, indexes, RLS policies, and triggers
2. **`002_add_media_metadata.sql`** - Adds enhanced metadata columns to the media table
3. **`003_add_pdf_report_support.sql`** - Adds file_url column to projects table for hosting PDF investigation reports

## How to Run Migrations

### Option 1: Supabase Dashboard (Recommended)

1. Log in to your [Supabase Dashboard](https://app.supabase.com/)
2. Navigate to your project
3. Go to **SQL Editor**
4. Open and execute `001_initial_schema.sql`
5. Wait for completion, then execute `002_add_media_metadata.sql`

### Option 2: Supabase CLI

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### Option 3: psql (Direct PostgreSQL Connection)

```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres" \
  -f database/migrations/001_initial_schema.sql

psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres" \
  -f database/migrations/002_add_media_metadata.sql
```

## Database Schema Overview

### Tables

| Table | Purpose | Row Count |
|-------|---------|-----------|
| **blogs** | Blog posts and articles | Variable |
| **projects** | Portfolio projects | Variable |
| **dashboards** | Dune Analytics dashboards | Variable |
| **profile** | User profile information | 1 (singleton) |
| **media** | Media files and assets | Variable |
| **activities** | Activity tracking data | Variable |

### Key Features

- **UUID Primary Keys** - All tables use UUIDs for primary keys
- **Timestamps** - Automatic `created_at` and `updated_at` tracking
- **Row Level Security (RLS)** - Enabled on all tables with policies for public read and authenticated write access
- **Indexes** - Performance-optimized indexes on frequently queried columns
- **GIN Indexes** - Full-text search support for array columns (tags, tech_stack, etc.)
- **Triggers** - Auto-update `updated_at` timestamps on record changes
- **Comments** - Comprehensive schema documentation

## Security

### Row Level Security Policies

All tables have RLS enabled with the following policies:

**Public Access (Unauthenticated):**
- ✅ Read published blogs
- ✅ Read all projects
- ✅ Read active dashboards
- ✅ Read profile
- ✅ Read media
- ✅ Read activities

**Authenticated Access (Admin):**
- ✅ Full CRUD access to all tables

### Authentication

The database uses Supabase Auth for authentication. Configure your authentication providers in the Supabase Dashboard:

- Settings → Authentication → Providers

## Backup and Restore

### Backup

```bash
# Using Supabase CLI
supabase db dump -f backup.sql

# Using pg_dump
pg_dump "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres" > backup.sql
```

### Restore

```bash
# Using Supabase CLI
supabase db push --file backup.sql

# Using psql
psql "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres" < backup.sql
```

## Troubleshooting

### Common Issues

**Error: "relation already exists"**
- Some tables may already exist in your database
- You can skip those CREATE TABLE statements or drop existing tables first
- To drop all tables: **⚠️ WARNING - This deletes all data!**
  ```sql
  DROP TABLE IF EXISTS blogs CASCADE;
  DROP TABLE IF EXISTS projects CASCADE;
  DROP TABLE IF EXISTS dashboards CASCADE;
  DROP TABLE IF EXISTS profile CASCADE;
  DROP TABLE IF EXISTS media CASCADE;
  DROP TABLE IF EXISTS activities CASCADE;
  ```

**Error: "uuid-ossp extension does not exist"**
- Run this first: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
- This is included in the migration file, but may need manual execution

**RLS Policies Block Access**
- Ensure you're authenticated when performing admin operations
- Check your Supabase auth configuration
- Verify policies match your authentication setup

## PDF Report Hosting (Migration 003)

The `003_add_pdf_report_support.sql` migration adds support for hosting PDF investigation reports in Supabase Storage.

### Setup Instructions

1. **Create Storage Bucket**
   - Go to Supabase Dashboard → Storage
   - Click "Create a new bucket"
   - Name: `reports`
   - Make it **public** (enable public read access)

2. **Set Bucket Policy** (via SQL Editor in Supabase Dashboard)
   ```sql
   CREATE POLICY "Public read access for reports"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'reports');
   ```

3. **Upload PDF Files**
   - In Supabase Dashboard: Storage → reports bucket
   - Click "Upload file" and select your PDF
   - ⚠️ **Important**: Before uploading, redact sensitive information:
     - Remove victim wallet addresses
     - Remove personal identifying information
     - Keep: attacker addresses, transaction hashes, public analysis

4. **Get Public URL**
   - Click the file you uploaded
   - Copy the **Public URL**
   - Paste into the project editor's "PDF Report URL" field

### Field Structure

| Field | Type | Purpose |
|-------|------|---------|
| `file_url` | TEXT | Public Supabase Storage URL for hosted PDF reports |
| Related `url` | TEXT | External links (kept separate for flexibility) |

### Frontend Display

- **WorkCard component**: Shows PDF icon (📄) alongside external link arrow
- **Project detail page**: Shows "PDF Report ↗" link with external icon
- **Graceful fallback**: If no PDF is uploaded, field is simply omitted

## Development Workflow

### Creating New Migrations

When adding new features that require schema changes:

1. Create a new migration file with incremental numbering:
   - `003_add_feature_name.sql`
2. Include both `UP` (apply changes) and `DOWN` (rollback) logic if possible
3. Test the migration on a development database first
4. Document the changes in this README
5. Commit the migration file to version control

### Migration Best Practices

- ✅ Always use `IF NOT EXISTS` for idempotent operations
- ✅ Include comments explaining complex changes
- ✅ Test migrations on a copy of production data
- ✅ Keep migrations small and focused
- ✅ Never modify existing migration files once deployed
- ✅ Use transactions where possible for atomic changes

## Environment Variables

Ensure these environment variables are set in your application:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Support

For issues or questions:
- **GitHub Issues**: https://github.com/RaphDeAnalyst/web3-portfolio/issues
- **Email**: matthewraphael@matthewraphael.xyz
- **Supabase Docs**: https://supabase.com/docs

---

**Last Updated**: May 2026
**Schema Version**: 003
**Maintained by**: Matthew Raphael (RaphDeAnalyst)
