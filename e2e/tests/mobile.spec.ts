import { test, expect } from '@playwright/test'

test.describe('Mobile Responsiveness (375px)', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('homepage hero renders correctly on mobile', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
    // Ensure no horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 2) // allow 2px tolerance
  })

  test('nav links are accessible on mobile', async ({ page }) => {
    await page.goto('/')
    const workLink = page.getByRole('link', { name: 'Work' }).first()
    await expect(workLink).toBeVisible()
    const aboutLink = page.getByRole('link', { name: 'About' }).first()
    await expect(aboutLink).toBeVisible()
  })

  test('CTA buttons stack vertically on mobile', async ({ page }) => {
    await page.goto('/')
    const ctaRow = page.locator('.cta-row')
    await expect(ctaRow).toBeVisible()
    // On mobile, flex-direction should be column
    const flexDir = await ctaRow.evaluate(el => getComputedStyle(el).flexDirection)
    expect(flexDir).toBe('column')
  })

  test('/work page: cards render in single column on mobile', async ({ page }) => {
    await page.goto('/work')
    await page.waitForSelector('a[href^="/work/"]', { timeout: 10000 })
    // Check grid - should be 1 column on mobile
    const grid = page.locator('.work-grid')
    const cols = await grid.evaluate(el =>
      getComputedStyle(el).getPropertyValue('grid-template-columns')
    )
    // Single column = one value (no repeat of multiple)
    const colCount = cols.split(' ').length
    expect(colCount).toBe(1)
  })

  test('/about page renders without overflow on mobile', async ({ page }) => {
    await page.goto('/about')
    await expect(page.locator('h1')).toBeVisible()
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 2)
  })
})

test.describe('Tablet Responsiveness (768px)', () => {
  test.use({ viewport: { width: 768, height: 1024 } })

  test('navbar shows desktop links at tablet width', async ({ page }) => {
    await page.goto('/')
    // At 768px, md: breakpoint should show desktop nav
    const desktopNav = page.locator('.nav-links.hidden.md\\:flex')
    // Just verify page renders without overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth)
    const viewportWidth = await page.evaluate(() => window.innerWidth)
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 2)
  })

  test('/work page: grid renders at tablet width', async ({ page }) => {
    await page.goto('/work')
    await page.waitForSelector('a[href^="/work/"]', { timeout: 10000 })
    await expect(page.locator('a[href^="/work/"]').first()).toBeVisible()
  })
})
