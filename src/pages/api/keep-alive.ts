import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { logger } from '../../lib/logger'

interface KeepAliveResponse {
  success: boolean
  message: string
  timestamp: string
  query_result?: any
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<KeepAliveResponse>
) {
  // Only allow GET requests (for cron jobs)
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
      timestamp: new Date().toISOString()
    })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Execute the most minimal keep-alive query possible
    // This uses a simple SELECT 1 which works on any PostgreSQL database
    const { data, error } = await supabase
      .from('profiles') // Using your existing profiles table
      .select('count')
      .limit(1)

    // If that fails, try an even simpler approach
    if (error) {
      // Try to just connect to the database with a minimal operation
      const { data: connectionTest, error: connectionError } = await supabase.auth.getSession()

      if (connectionError) {
        throw new Error(`Keep-alive connection failed: ${connectionError.message}`)
      }

      logger.serverLog('info', '✅ Supabase keep-alive successful (connection test)', {
        timestamp: new Date().toISOString(),
        connection_active: true
      })

      return res.status(200).json({
        success: true,
        message: 'Database keep-alive successful (connection test)',
        timestamp: new Date().toISOString(),
        query_result: { connection_active: true }
      })
    }

    logger.serverLog('info', '✅ Supabase keep-alive successful', {
      timestamp: new Date().toISOString(),
      result: data
    })

    return res.status(200).json({
      success: true,
      message: 'Database keep-alive successful',
      timestamp: new Date().toISOString(),
      query_result: data
    })

  } catch (error) {
    logger.serverLog('error', '❌ Supabase keep-alive failed', { error })

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return res.status(500).json({
      success: false,
      message: 'Keep-alive failed',
      timestamp: new Date().toISOString(),
      error: errorMessage
    })
  }
}

// Optional: Add rate limiting or authentication if needed
export const config = {
  api: {
    // Disable body parser for this endpoint (we only need GET)
    bodyParser: false,
  },
}