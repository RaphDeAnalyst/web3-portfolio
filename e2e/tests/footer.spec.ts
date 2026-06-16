import { test, expect } from '@playwright/test'

test.describe('Footer', () => {
  const pages = ['/', '/work', '/about']

  for (const path of pages) {
    test(`footer is present on ${path}`, async ({ page }) => {
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      const footer = page.locator('footer')
      await expect(footer).toBeVisible()
    })

    test(`footer has copyright text on ${path}`, async ({ page }) => {
      await page.goto(path)
      await expect(page.locator('footer').getByText(/matthew raphael/i)).toBeVisible()
    })
  }

  test('footer social links all present on homepage', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('footer')

    const xLink = footer.getByRole('link', { name: /^X/i })
    await expect(xLink).toBeVisible()
    await expect(xLink).toHaveAttribute('href', /x\.com/)
    await expect(xLink).toHaveAttribute('target', '_blank')

    const ghLink = footer.getByRole('link', { name: /github/i })
    await expect(ghLink).toBeVisible()
    await expect(ghLink).toHaveAttribute('href', /github\.com/)

    const duneLink = footer.getByRole('link', { name: /dune/i })
    await expect(duneLink).toBeVisible()
    await expect(duneLink).toHaveAttribute('href', /dune\.com/)

    const liLink = footer.getByRole('link', { name: /linkedin/i })
    await expect(liLink).toBeVisible()
    await expect(liLink).toHaveAttribute('href', /linkedin\.com/)
  })

  test('footer links open in new tab', async ({ page }) => {
    await page.goto('/')
    const footerLinks = page.locator('footer a[target="_blank"]')
    const count = await footerLinks.count()
    expect(count).toBeGreaterThanOrEqual(4)
  })
})
