import { test, expect } from '@playwright/test'

test.describe('Theme Toggle', () => {
  test('toggles from light to dark mode', async ({ page }) => {
    await page.goto('/')
    // Force light mode initially
    await page.evaluate(() => {
      localStorage.setItem('theme', 'light')
      document.documentElement.classList.remove('dark')
    })
    await page.reload()
    await page.waitForLoadState('networkidle')

    const html = page.locator('html')
    await expect(html).not.toHaveClass(/dark/)

    // Click the theme toggle
    const toggle = page.getByRole('button', { name: /toggle theme/i }).first()
    await toggle.click()
    await page.waitForTimeout(300)

    await expect(html).toHaveClass(/dark/)
  })

  test('dark mode persists across navigation', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark')
      document.documentElement.classList.add('dark')
    })
    await page.reload()
    await page.waitForLoadState('networkidle')
    await expect(page.locator('html')).toHaveClass(/dark/)

    await page.goto('/about')
    await page.waitForLoadState('networkidle')
    await expect(page.locator('html')).toHaveClass(/dark/)
  })

  test('light mode: bg-primary CSS variable is light', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('theme', 'light')
      document.documentElement.classList.remove('dark')
    })
    await page.reload()
    await page.waitForLoadState('networkidle')

    const bg = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim()
    )
    // Light mode bg-primary is #FAFAF8
    expect(bg).toBe('#FAFAF8')
  })

  test('dark mode: bg-primary CSS variable is dark', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('theme', 'dark')
      document.documentElement.classList.add('dark')
    })
    await page.reload()
    await page.waitForLoadState('networkidle')

    const bg = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim()
    )
    // Dark mode bg-primary is #0A0A0A
    expect(bg).toBe('#0A0A0A')
  })

  test('prose-invert check: work detail page in light mode', async ({ page }) => {
    await page.goto('/work')
    await page.evaluate(() => {
      localStorage.setItem('theme', 'light')
      document.documentElement.classList.remove('dark')
    })
    await page.waitForSelector('a[href^="/work/"]', { timeout: 10000 })
    const firstHref = await page.locator('a[href^="/work/"]').first().getAttribute('href')
    await page.goto(firstHref!)
    await page.waitForLoadState('networkidle')

    // Check if prose-invert is hardcoded (causes white text on white bg in light mode)
    const proseDiv = page.locator('.prose')
    const hasProse = await proseDiv.count()
    if (hasProse > 0) {
      const classes = await proseDiv.first().getAttribute('class')
      // Report whether prose-invert is unconditionally applied
      const hasHardInvert = classes?.includes('prose-invert') && !classes?.includes('dark:prose-invert')
      if (hasHardInvert) {
        console.warn('⚠️ prose-invert is unconditionally applied — text may be invisible in light mode')
      }
    }
  })
})
