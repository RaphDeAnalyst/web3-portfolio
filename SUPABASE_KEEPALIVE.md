# Supabase Keep-Alive System

This system prevents your Supabase free plan from being suspended due to 7 days of inactivity by running lightweight database queries periodically.

## 📋 Overview

The keep-alive system includes multiple redundancy layers:

1. **Primary**: Vercel Cron Jobs (daily at 12:00 UTC)
2. **Backup**: GitHub Actions (daily at 6:00 UTC)
3. **Manual**: Local development scripts

## 🚀 Setup Instructions

### 1. Vercel Deployment (Primary Method)

The system is automatically configured when you deploy to Vercel:

```bash
# Deploy to Vercel
vercel --prod
```

**Automatic Configuration:**
- `vercel.json` configures the cron job
- `/api/keep-alive` endpoint is created
- Runs daily at 12:00 UTC

### 2. GitHub Actions (Backup Method)

Set up GitHub repository secrets:

1. Go to your GitHub repository → Settings → Secrets and variables → Actions
2. Add these secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `VERCEL_DEPLOYMENT_URL` (optional): Your Vercel deployment URL

The GitHub Action will run automatically daily at 6:00 UTC.

### 3. Manual Testing

Test the keep-alive system locally:

```bash
# Install dependencies (if not already done)
npm install

# Run the keep-alive script
npm run keep-alive

# Alternative commands
npm run test:keep-alive
npm run supabase:ping
```

## 🔧 Configuration

### Vercel Cron Schedule

Edit `vercel.json` to change the schedule:

```json
{
  "crons": [
    {
      "path": "/api/keep-alive",
      "schedule": "0 12 * * *"  // Daily at 12:00 UTC
    }
  ]
}
```

### GitHub Actions Schedule

Edit `.github/workflows/supabase-keep-alive.yml`:

```yaml
on:
  schedule:
    - cron: '0 6 * * *'  # Daily at 6:00 AM UTC
```

## 📊 Monitoring

### Check Vercel Cron Logs

1. Go to Vercel Dashboard → Your Project → Functions
2. Find the `/api/keep-alive` function
3. View logs to see execution history

### Check GitHub Actions

1. Go to your GitHub repository → Actions
2. Find "Supabase Keep-Alive" workflow
3. View run history and logs

### Manual Endpoint Test

Test the API endpoint directly:

```bash
curl https://your-domain.vercel.app/api/keep-alive
```

Expected response:
```json
{
  "success": true,
  "message": "Database keep-alive successful",
  "timestamp": "2024-01-15T12:00:00.000Z",
  "query_result": {...}
}
```

## 🛠 Troubleshooting

### Common Issues

**1. Environment Variables Missing**
```bash
# Check your .env.local file contains:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**2. Vercel Cron Not Running**
- Ensure you're on a Vercel Pro plan (required for cron jobs)
- Check `vercel.json` is in the root directory
- Redeploy after making changes

**3. API Route Not Found**
- Ensure `src/pages/api/keep-alive.ts` exists
- Check file path is correct for your Next.js setup

**4. Database Connection Failed**
- Verify Supabase credentials are correct
- Check if your Supabase project is active
- Ensure RLS policies allow anonymous access (if using RLS)

### Debug Mode

Run the local script with verbose output:

```javascript
// In scripts/keep-alive.js, add at the top:
process.env.DEBUG = 'true';
```

## 📈 Query Details

The system uses minimal queries to avoid resource consumption:

1. **Primary Query**: `SELECT count FROM profiles LIMIT 1`
2. **Fallback**: Connection test via `supabase.auth.getSession()`

These queries:
- ✅ Count as database activity
- ✅ Use minimal resources
- ✅ Don't affect your data
- ✅ Work with any table structure

## 🔒 Security

- Uses read-only anonymous key
- No sensitive data in queries
- Rate limiting on API endpoint
- Secure environment variable handling

## 📅 Schedule Summary

| Method | Time (UTC) | Frequency | Purpose |
|--------|------------|-----------|----------|
| GitHub Actions | 6:00 AM | Daily | Primary backup |
| Vercel Cron | 12:00 PM | Daily | Main execution |

This 6-hour separation ensures redundancy while avoiding conflicts.

## 🎯 Success Criteria

Your Supabase database will stay active if you see:
- ✅ Successful cron job executions
- ✅ HTTP 200 responses from `/api/keep-alive`
- ✅ No suspension emails from Supabase
- ✅ Continuous database accessibility

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review Vercel and GitHub Actions logs
3. Test the local script: `npm run keep-alive`
4. Verify your Supabase project status

---

*This keep-alive system ensures your Supabase free plan remains active without manual intervention.*