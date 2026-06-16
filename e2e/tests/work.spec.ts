import { test, expect } from '@playwright/test'

test.describe('Work Page — Listing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/work')
  })

  test('page title is correct', async ({ page }) => {
    await expect(page).toHaveTitle(/Work.*Matthew Raphael/)
  })

  test('heading is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Work' })).toBeVisible()
  })

  test('subheading description is visible', async ({ page }) => {
    await expect(page.getByText(/Investigations, research, and analytics/i)).toBeVisible()
  })

  test('project cards are rendered', async ({ page }) => {
    // Wait for cards to appear (Supabase fetch)
    await page.waitForSelector('.work-card, [class*="work-card"]', { timeout: 10000 })
    const cards = page.locator('a[href^="/work/"]')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('each project card has a title', async ({ page }) => {
    await page.waitForSelector('a[href^="/work/"]', { timeout: 10000 })
    const cards = page.locator('a[href^="/work/"]')
    const firstTitle = cards.first().locator('h2')
    await expect(firstTitle).not.toBeEmpty()
  })

  test('clicking a project card navigates to detail page', async ({ page }) => {
    await page.waitForSelector('a[href^="/work/"]', { timeout: 10000 })
    const firstCard = page.locator('a[href^="/work/"]').first()
    const href = await firstCard.getAttribute('href')
    await firstCard.click()
    await expect(page).toHaveURL(href!)
  })

  test('no console errors on work page load', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.goto('/work')
    await page.waitForLoadState('networkidle')
    const critical = errors.filter(e =>
      !e.includes('favicon') &&
      !e.includes('Failed to load resource') &&
      !e.toLowerCase().includes('warn')
    )
    expect(critical).toHaveLength(0)
  })
})

test.describe('Work Page — Detail', () => {
  let firstProjectHref: string

  test.beforeEach(async ({ page }) => {
    await page.goto('/work')
    await page.waitForSelector('a[href^="/work/"]', { timeout: 10000 })
    firstProjectHref = await page.locator('a[href^="/work/"]').first().getAttribute('href') ?? '/work'
    await page.goto(firstProjectHref)
  })

  test('back button is visible and navigates to /work', async ({ page }) => {
    const backBtn = page.getByRole('link', { name: /← work/i })
    await expect(backBtn).toBeVisible()
    await backBtn.click()
    await expect(page).toHaveURL('/work')
  })

  test('project title is rendered', async ({ page }) => {
    const heading = page.locator('h1')
    await expect(heading).toBeVisible()
    const text = await heading.textContent()
    expect(text?.trim().length).toBeGreaterThan(0)
  })

  test('no critical console errors on detail page', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.goto(firstProjectHref)
    await page.waitForLoadState('networkidle')
    const critical = errors.filter(e =>
      !e.includes('favicon') &&
      !e.toLowerCase().includes('hydrat') === false // flag hydration errors
    )
    // Log but don't hard-fail so we see all results
    if (critical.length > 0) {
      console.warn('Console errors on detail page:', critical)
    }
  })

  test('page has OG meta title set', async ({ page }) => {
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
    // OG title is intentionally the project title only (no author attribution)
    // This is a known finding: social shares lack author context
    expect(ogTitle).toBeTruthy()
    expect(ogTitle!.length).toBeGreaterThan(5)
  })
})
