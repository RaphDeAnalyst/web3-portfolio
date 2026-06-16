import { test, expect } from '@playwright/test'

test.describe('Navbar', () => {
  test('logo renders and links to homepage', async ({ page }) => {
    await page.goto('/work')
    const logo = page.getByRole('link', { name: /matthew raphael/i }).first()
    await expect(logo).toBeVisible()
    await logo.click()
    await expect(page).toHaveURL('/')
  })

  test('Work nav link is active when on /work', async ({ page }) => {
    await page.goto('/work')
    const workLink = page.getByRole('link', { name: 'Work' }).first()
    // Active state = border-b-2 applied
    await expect(workLink).toHaveClass(/border-b-2/)
  })

  test('About nav link navigates to /about', async ({ page }) => {
    await page.goto('/')
    const aboutLink = page.getByRole('link', { name: 'About' }).first()
    await expect(aboutLink).toBeVisible()
    await aboutLink.click()
    await expect(page).toHaveURL('/about')
  })

  test('Research external link is present in nav', async ({ page }) => {
    await page.goto('/')
    const researchLink = page.locator('nav').getByRole('link', { name: /research/i })
    await expect(researchLink).toBeVisible()
    await expect(researchLink).toHaveAttribute('href', /paragraph\.com/)
    await expect(researchLink).toHaveAttribute('target', '_blank')
  })

  test('theme toggle button is present', async ({ page }) => {
    await page.goto('/')
    const toggleBtn = page.getByRole('button', { name: /toggle theme/i }).first()
    await expect(toggleBtn).toBeVisible()
  })

  test('navbar has background after scrolling', async ({ page }) => {
    await page.goto('/')
    // Use mouse wheel to trigger real scroll event (programmatic scrollTo doesn't fire React listener)
    await page.mouse.wheel(0, 300)
    await page.waitForTimeout(500)
    const nav = page.locator('nav')
    await expect(nav).toHaveClass(/border-b/)
  })
})
