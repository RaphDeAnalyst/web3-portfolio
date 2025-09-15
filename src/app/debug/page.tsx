'use client'

import { useEffect, useState } from 'react'
import { supabase, isSupabaseAvailable } from '../../lib/supabase'

export default function DebugPage() {
  const [status, setStatus] = useState<any>({})

  useEffect(() => {
    const checkEnvironment = () => {
      const envVars = {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        NEXT_PUBLIC_USE_SUPABASE: process.env.NEXT_PUBLIC_USE_SUPABASE,
        NEXT_PUBLIC_USE_SUPABASE_BLOG: process.env.NEXT_PUBLIC_USE_SUPABASE_BLOG,
        isSupabaseAvailable: isSupabaseAvailable(),
        supabaseInstance: !!supabase
      }

      setStatus(envVars)
    }

    checkEnvironment()
  }, [])

  const testSupabaseConnection = async () => {
    try {
      if (!supabase) {
        setStatus(prev => ({ ...prev, connectionTest: 'Supabase client not available' }))
        return
      }

      const { data, error } = await supabase.from('blogs').select('id').limit(1)

      if (error) {
        setStatus(prev => ({ ...prev, connectionTest: `Error: ${error.message}` }))
      } else {
        setStatus(prev => ({ ...prev, connectionTest: `Success: Found ${data?.length || 0} blogs` }))
      }
    } catch (err) {
      setStatus(prev => ({ ...prev, connectionTest: `Exception: ${err}` }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Environment Debug Page</h1>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
            {JSON.stringify(status, null, 2)}
          </pre>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Connection Test</h2>
          <button
            onClick={testSupabaseConnection}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test Supabase Connection
          </button>
          {status.connectionTest && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <strong>Result:</strong> {status.connectionTest}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}