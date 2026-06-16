import { test } from '@playwright/test'

test('verify all fixes', async ({ page }) => {
  // --- Light mode: homepage ---
  await page.goto('http://localhost:4000')
  await page.evaluate(() => { localStorage.setItem('theme','light'); document.documentElement.classList.remove('dark') })
  await page.reload(); await page.waitForLoadState('networkidle')
  await page.screenshot({ path: '/tmp/fix-home-light.png' })

  // --- Dark mode: homepage ---
  await page.evaluate(() => { localStorage.setItem('theme','dark'); document.documentElement.classList.add('dark') })
  await page.waitForTimeout(300)
  await page.screenshot({ path: '/tmp/fix-home-dark.png' })

  // --- Work detail: light mode (prose-invert fix) ---
  await page.evaluate(() => { localStorage.setItem('theme','light'); document.documentElement.classList.remove('dark') })
  await page.goto('http://localhost:4000/work'); await page.waitForSelector('a[href^="/work/"]', { timeout: 10000 })
  const href = await page.locator('a[href^="/work/"]').first().getAttribute('href')
  await page.goto(`http://localhost:4000${href}`); await page.waitForLoadState('networkidle')
  await page.screenshot({ path: '/tmp/fix-detail-light.png', fullPage: true })

  // --- Work detail: dark mode ---
  await page.evaluate(() => { localStorage.setItem('theme','dark'); document.documentElement.classList.add('dark') })
  await page.waitForTimeout(300)
  await page.screenshot({ path: '/tmp/fix-detail-dark.png', fullPage: true })

  // --- Mobile: work page (active nav + card layout) ---
  await page.setViewportSize({ width: 375, height: 812 })
  await page.evaluate(() => { localStorage.setItem('theme','light'); document.documentElement.classList.remove('dark') })
  await page.goto('http://localhost:4000/work'); await page.waitForLoadState('networkidle')
  await page.screenshot({ path: '/tmp/fix-work-mobile.png', fullPage: true })

  // --- Mobile: active nav on /about ---
  await page.goto('http://localhost:4000/about'); await page.waitForLoadState('networkidle')
  await page.screenshot({ path: '/tmp/fix-about-mobile.png' })
})
