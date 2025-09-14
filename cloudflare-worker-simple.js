/**
 * SIMPLIFIED Cloudflare Worker for Supabase Keep-Alive
 *
 * Use this if the main worker has SSL issues.
 * This is a minimal implementation that should work on any Cloudflare account.
 */

addEventListener('scheduled', event => {
  event.waitUntil(handleScheduled(event));
});

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleScheduled(event) {
  console.log('🚀 Scheduled keep-alive triggered');

  try {
    const response = await fetch('https://matthewraphael.xyz/api/keep-alive', {
      method: 'GET',
      headers: {
        'User-Agent': 'CF-Worker-KeepAlive',
      },
    });

    if (response.ok) {
      console.log('✅ Keep-alive successful');
    } else {
      console.log('❌ Keep-alive failed:', response.status);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

async function handleRequest(request) {
  const url = new URL(request.url);

  if (url.pathname === '/test' || url.pathname === '/') {
    try {
      const response = await fetch('https://matthewraphael.xyz/api/keep-alive', {
        method: 'GET',
        headers: {
          'User-Agent': 'CF-Worker-Test',
        },
      });

      const result = {
        success: response.ok,
        status: response.status,
        message: response.ok ? 'Keep-alive test successful' : 'Keep-alive test failed',
        timestamp: new Date().toISOString(),
        worker: 'Simplified Cloudflare Worker'
      };

      return new Response(JSON.stringify(result, null, 2), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }, null, 2), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response('Supabase Keep-Alive Worker Active', {
    headers: { 'Content-Type': 'text/plain' },
  });
}

/**
 * DEPLOYMENT STEPS:
 *
 * 1. Go to https://dash.cloudflare.com
 * 2. Click "Workers & Pages" in the left sidebar
 * 3. Click "Create application"
 * 4. Click "Create Worker"
 * 5. Give it a simple name like "supabase-backup"
 * 6. Replace ALL the default code with this script
 * 7. Click "Save and Deploy"
 * 8. Copy the worker URL (should be: https://supabase-backup.YOUR_ACCOUNT.workers.dev)
 * 9. Test by visiting: YOUR_WORKER_URL/test
 * 10. If it works, add cron trigger: 0 18 * * *
 */