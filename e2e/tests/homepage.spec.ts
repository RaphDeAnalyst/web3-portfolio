import { test, expect } from '@playwright/test'

test.describe('Homepage — Hero Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders full hero with name, tagline, description', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Matthew Raphael Nnamani')
    await expect(page.getByText('Blockchain Intelligence Practitioner')).toBeVisible()
    await expect(page.getByText(/investigate on-chain financial crime/i)).toBeVisible()
  })

  test('location label is visible', async ({ page }) => {
    await expect(page.getByText(/Lagos, Nigeria/i)).toBeVisible()
  })

  test('CTA buttons are visible and point to correct destinations', async ({ page }) => {
    const viewWorkBtn = page.getByRole('link', { name: /view work/i })
    await expect(viewWorkBtn).toBeVisible()
    await expect(viewWorkBtn).toHaveAttribute('href', '/work')

    // Scope to main content only — Research link also appears in navbar
    const researchLink = page.locator('main, section').getByRole('link', { name: /research/i }).first()
    await expect(researchLink).toBeVisible()
    await expect(researchLink).toHaveAttribute('href', /paragraph\.com/)
  })

  test('chain pills are visible', async ({ page }) => {
    const chains = ['Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Base', 'Optimism']
    for (const chain of chains) {
      await expect(page.getByText(chain)).toBeVisible()
    }
  })

  test('page title is correct', async ({ page }) => {
    await expect(page).toHaveTitle(/Matthew Raphael Nnamani/)
  })

  test('no console errors on load', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0)
  })

  test('CTA "View work" navigates to /work', async ({ page }) => {
    await page.getByRole('link', { name: /view work/i }).click()
    await expect(page).toHaveURL('/work')
  })
})
