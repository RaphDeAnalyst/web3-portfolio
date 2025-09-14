#!/usr/bin/env node

/**
 * Supabase Keep-Alive Script
 *
 * This script can be run locally to test the Supabase keep-alive functionality
 * or deployed as a standalone solution on any server with cron.
 *
 * Usage:
 *   node scripts/keep-alive.js
 *   npm run keep-alive
 */

const { createClient } = require('@supabase/supabase-js')

// Try to load dotenv if available, otherwise use environment variables
try {
  require('dotenv').config({ path: '.env.local' })
} catch (error) {
  console.log('Note: dotenv not available, using environment variables directly')
}

// ANSI color codes for pretty console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = colors.reset) {
  const timestamp = new Date().toISOString()
  console.log(`${color}[${timestamp}] ${message}${colors.reset}`)
}

async function keepAlive() {
  log('🚀 Starting Supabase keep-alive...', colors.blue)

  try {
    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
    }

    log(`📡 Connecting to Supabase: ${supabaseUrl}`, colors.cyan)

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    })

    // Method 1: Try a simple query on profiles table
    log('🔍 Executing keep-alive query...', colors.yellow)

    const startTime = Date.now()
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)

    const queryTime = Date.now() - startTime

    if (error) {
      log(`⚠️ Primary query failed: ${error.message}`, colors.yellow)
      log('🔄 Trying connection test fallback...', colors.yellow)

      // Fallback: Simple connection test
      const { data: connectionTest, error: connectionError } = await supabase.auth.getSession()

      if (connectionError) {
        throw new Error(`Connection test failed: ${connectionError.message}`)
      }

      log(`✅ Keep-alive successful (connection test) - ${queryTime}ms`, colors.green)
      return {
        success: true,
        method: 'connection_test',
        queryTime,
        timestamp: new Date().toISOString()
      }
    }

    log(`✅ Keep-alive successful (profiles query) - ${queryTime}ms`, colors.green)
    log(`📊 Query result: ${JSON.stringify(data)}`, colors.magenta)

    return {
      success: true,
      method: 'profiles_query',
      queryTime,
      data,
      timestamp: new Date().toISOString()
    }

  } catch (error) {
    log(`❌ Keep-alive failed: ${error.message}`, colors.red)

    // Log additional debugging info
    if (error.code) {
      log(`🔍 Error code: ${error.code}`, colors.red)
    }
    if (error.details) {
      log(`🔍 Error details: ${error.details}`, colors.red)
    }

    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
}

// Main execution
async function main() {
  log('🎯 Supabase Keep-Alive Script', colors.bright)
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.bright)

  const result = await keepAlive()

  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', colors.bright)

  if (result.success) {
    log('🎉 Keep-alive completed successfully!', colors.green)
    log(`📈 Stats: ${JSON.stringify(result, null, 2)}`, colors.cyan)
    process.exit(0)
  } else {
    log('💥 Keep-alive failed!', colors.red)
    log(`📉 Error: ${JSON.stringify(result, null, 2)}`, colors.red)
    process.exit(1)
  }
}

// Handle script execution vs module import
if (require.main === module) {
  main().catch((error) => {
    log(`💥 Unexpected error: ${error.message}`, colors.red)
    process.exit(1)
  })
} else {
  // Export for use as module
  module.exports = { keepAlive, log, colors }
}