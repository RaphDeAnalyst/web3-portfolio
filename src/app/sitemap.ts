import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://web3portfolio.dev'
  
  const routes = [
    '',
    '/about',
    '/portfolio',
    '/blog',
    '/contact',
  ]
  
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/blog' ? 'daily' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }))
}