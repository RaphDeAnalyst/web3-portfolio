import { test, expect } from '@playwright/test'

test.describe('About Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about')
  })

  test('page title is correct', async ({ page }) => {
    await expect(page).toHaveTitle(/About.*Matthew Raphael/)
  })

  test('name and title header render', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /Matthew Raphael Nnamani/ })).toBeVisible()
    await expect(page.getByText('Blockchain Intelligence Practitioner').first()).toBeVisible()
  })

  test('avatar initials render', async ({ page }) => {
    await expect(page.getByText('MR')).toBeVisible()
  })

  test('bio paragraph is present', async ({ page }) => {
    await expect(page.getByText(/on-chain investigator/i)).toBeVisible()
  })

  test('Principles section is rendered', async ({ page }) => {
    await expect(page.getByText('Principles')).toBeVisible()
    await expect(page.getByText(/Assert only what the data supports/i)).toBeVisible()
    await expect(page.getByText(/Slow movement beats no movement/i)).toBeVisible()
    await expect(page.getByText(/Automation leaves fingerprints/i)).toBeVisible()
  })

  test('Methods tags are present', async ({ page }) => {
    await expect(page.getByText('Methods')).toBeVisible()
    const methods = ['On-chain investigation', 'KYT / Transaction monitoring', 'Dune Analytics', 'Trino SQL']
    for (const method of methods) {
      await expect(page.getByText(method)).toBeVisible()
    }
  })

  test('contact section renders email', async ({ page }) => {
    const emailLink = page.getByRole('link', { name: /matthewraphael@matthewraphael\.xyz/i })
    await expect(emailLink).toBeVisible()
    await expect(emailLink).toHaveAttribute('href', 'mailto:matthewraphael@matthewraphael.xyz')
  })

  test('contact social links (X, LinkedIn) are present', async ({ page }) => {
    const xLink = page.locator('a[href*="x.com"]').last()
    await expect(xLink).toBeVisible()
    const linkedinLink = page.locator('a[href*="linkedin.com"]').last()
    await expect(linkedinLink).toBeVisible()
  })

  test('no console errors on about page', async ({ page }) => {
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    await page.goto('/about')
    await page.waitForLoadState('networkidle')
    const critical = errors.filter(e => !e.includes('favicon'))
    expect(critical).toHaveLength(0)
  })
})
