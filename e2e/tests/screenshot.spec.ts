import { test } from '@playwright/test'

test('screenshots', async ({ page }) => {
  // Light mode - homepage
  await page.goto('http://localhost:4000')
  await page.evaluate(() => { localStorage.setItem('theme','light'); document.documentElement.classList.remove('dark') })
  await page.reload()
  await page.waitForLoadState('networkidle')
  await page.screenshot({ path: '/tmp/home-light.png', fullPage: true })

  // Dark mode - homepage
  await page.evaluate(() => { localStorage.setItem('theme','dark'); document.documentElement.classList.add('dark') })
  await page.waitForTimeout(300)
  await page.screenshot({ path: '/tmp/home-dark.png', fullPage: true })

  // Work detail in light mode (prose-invert check)
  await page.evaluate(() => { localStorage.setItem('theme','light'); document.documentElement.classList.remove('dark') })
  await page.goto('http://localhost:4000/work')
  await page.waitForSelector('a[href^="/work/"]', { timeout: 10000 })
  const href = await page.locator('a[href^="/work/"]').first().getAttribute('href')
  await page.goto(`http://localhost:4000${href}`)
  await page.waitForLoadState('networkidle')
  await page.screenshot({ path: '/tmp/work-detail-light.png', fullPage: true })

  // Mobile viewport
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('http://localhost:4000/work')
  await page.waitForLoadState('networkidle')
  await page.screenshot({ path: '/tmp/work-mobile.png', fullPage: true })
})
