import { test, expect } from '@playwright/test'

const ROUTES = ['/', '/work', '/about']

test.describe('Console Errors — All Pages', () => {
  for (const route of ROUTES) {
    test(`no JS errors on ${route}`, async ({ page }) => {
      const errors: string[] = []
      page.on('console', msg => {
        if (msg.type() === 'error') {
          const text = msg.text()
          // Ignore favicon 404s and known third-party noise
          if (!text.includes('favicon') && !text.includes('ERR_BLOCKED_BY_CLIENT')) {
            errors.push(text)
          }
        }
      })
      page.on('pageerror', err => {
        errors.push(`PageError: ${err.message}`)
      })
      await page.goto(route)
      await page.waitForLoadState('networkidle')
      if (errors.length > 0) {
        console.warn(`Errors on ${route}:`, errors)
      }
      expect(errors, `Console errors on ${route}: ${errors.join('\n')}`).toHaveLength(0)
    })
  }
})

test.describe('React Hydration — All Pages', () => {
  for (const route of ROUTES) {
    test(`no hydration errors on ${route}`, async ({ page }) => {
      const hydrationErrors: string[] = []
      page.on('console', msg => {
        const text = msg.text()
        if (
          msg.type() === 'error' &&
          (text.includes('Hydration') ||
           text.includes('hydrat') ||
           text.includes('did not match') ||
           text.includes('Text content does not match'))
        ) {
          hydrationErrors.push(text)
        }
      })
      await page.goto(route)
      await page.waitForLoadState('networkidle')
      expect(hydrationErrors, `Hydration errors on ${route}:\n${hydrationErrors.join('\n')}`).toHaveLength(0)
    })
  }
})

test.describe('Network 404s — All Pages', () => {
  for (const route of ROUTES) {
    test(`no failed network requests on ${route}`, async ({ page }) => {
      const failed404s: string[] = []
      page.on('response', res => {
        if (res.status() === 404) {
          const url = res.url()
          if (!url.includes('favicon')) {
            failed404s.push(`404: ${url}`)
          }
        }
      })
      await page.goto(route)
      await page.waitForLoadState('networkidle')
      if (failed404s.length > 0) {
        console.warn(`404s on ${route}:`, failed404s)
      }
      expect(failed404s, `404 requests on ${route}:\n${failed404s.join('\n')}`).toHaveLength(0)
    })
  }
})

test.describe('Accessibility — Core ARIA', () => {
  test('homepage has single h1', async ({ page }) => {
    await page.goto('/')
    const h1s = page.locator('h1')
    await expect(h1s).toHaveCount(1)
  })

  test('/work page has single h1', async ({ page }) => {
    await page.goto('/work')
    await page.waitForLoadState('networkidle')
    const h1s = page.locator('h1')
    await expect(h1s).toHaveCount(1)
  })

  test('/about page has single h1', async ({ page }) => {
    await page.goto('/about')
    const h1s = page.locator('h1')
    await expect(h1s).toHaveCount(1)
  })

  test('all images have alt text', async ({ page }) => {
    await page.goto('/')
    const imgs = page.locator('img:not([alt])')
    const count = await imgs.count()
    expect(count, `${count} images missing alt text`).toBe(0)
  })

  test('nav has proper landmark role', async ({ page }) => {
    await page.goto('/')
    const nav = page.getByRole('navigation')
    await expect(nav).toBeVisible()
  })
})

test.describe('SEO — Meta Tags', () => {
  test('homepage has canonical link', async ({ page }) => {
    await page.goto('/')
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toContain('matthewraphael.xyz')
  })

  test('homepage has OG image meta', async ({ page }) => {
    await page.goto('/')
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')
    expect(ogImage).toBeTruthy()
  })

  test('/work page has correct OG URL', async ({ page }) => {
    await page.goto('/work')
    const ogUrl = await page.locator('meta[property="og:url"]').getAttribute('content')
    expect(ogUrl).toContain('/work')
  })

  test('twitter card meta is set', async ({ page }) => {
    await page.goto('/')
    const twitterCard = await page.locator('meta[name="twitter:card"]').getAttribute('content')
    expect(twitterCard).toBe('summary_large_image')
  })

  test('JSON-LD structured data is present', async ({ page }) => {
    await page.goto('/')
    const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent()
    const data = JSON.parse(jsonLd ?? '{}')
    expect(data['@type']).toBe('Person')
    expect(data.name).toContain('Matthew Raphael')
  })
})
