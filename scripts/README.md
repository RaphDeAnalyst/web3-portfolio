# Scripts Directory

## 🔄 keep-alive.js

**Purpose**: Prevents Supabase free plan suspension by maintaining database activity.

### Quick Usage
```bash
# Test locally
npm run keep-alive

# Alternative commands
npm run test:keep-alive
npm run supabase:ping
```

### Features
- ✅ Minimal resource usage (`SELECT count` query)
- ✅ Automatic fallback methods
- ✅ Colorized console output
- ✅ Detailed logging and error handling
- ✅ Environment variable detection

### Output Example
```
🎯 Supabase Keep-Alive Script
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Starting Supabase keep-alive...
📡 Connecting to Supabase: https://your-project.supabase.co
🔍 Executing keep-alive query...
✅ Keep-alive successful (profiles query) - 156ms
📊 Query result: [...]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 Keep-alive completed successfully!
```

### Dependencies
- `@supabase/supabase-js` (already installed)
- `dotenv` (optional, will fallback to env variables)

---

For complete setup instructions, see [SUPABASE_KEEPALIVE.md](../SUPABASE_KEEPALIVE.md)