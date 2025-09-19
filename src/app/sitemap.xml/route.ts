export async function GET() {
  // Always use canonical domain (no www)
  const baseUrl = 'https://matthewraphael.xyz'
  const lastModified = new Date().toISOString()

  // Canonical URLs - ensuring no trailing slashes and HTTPS
  const urls = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  function xmlEscape(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>'
  const comment = '<!-- Canonical URLs only - no www variants, no trailing slashes -->'
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  const urlsetClose = '</urlset>'

  const urlElements = urls
    .map((entry) => {
      return `  <url>
    <loc>${xmlEscape(entry.url)}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
    })
    .join('\n')

  const sitemap = `${xmlDeclaration}
${comment}
${urlsetOpen}
${urlElements}
${urlsetClose}`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}