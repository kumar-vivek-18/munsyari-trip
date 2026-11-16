import { test, expect } from '@playwright/test'

test('overview opens a dedicated day and next chapter', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await expect(page.locator('.chapter-card')).toHaveCount(6)
  await page.locator('.chapter-01').click()
  await expect(page).toHaveURL(/\/day\/01$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Night to the Hills')
  await expect(page.locator('.train-ticket')).toContainText('15013')
  await expect(page.locator('.packing-cards article')).toHaveCount(3)
  await page.locator('.chapter-pagination .next').click()
  await expect(page).toHaveURL(/\/day\/02$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Through Kumaon')
  await expect(page.locator('.roadbook-grid')).toContainText('1.5–2 hrs')
  await expect(page.locator('.roadbook-grid')).toContainText('11:00')
  await expect(page.locator('.leaflet-container')).toBeVisible()
  expect(errors).toEqual([])
})

test('all day URLs load directly with route, schedule, highlights and overnight preparation', async ({ page }) => {
  for (const day of ['01', '02', '03', '04', '05', '06']) {
    await page.goto(`/day/${day}`)
    await expect(page).toHaveTitle(new RegExp(`Day ${day}`))
    await expect(page.locator('.day-route-ribbon')).toBeVisible()
    await expect(page.locator('.mind-map')).toBeVisible()
    await expect(page.locator('.roadbook-grid > button').first()).toBeVisible()
    await expect(page.locator('.destination-grid > article')).toHaveCount(3)
    await expect(page.locator('.overnight-note')).toBeVisible()
    await expect(page.locator('.next-morning')).toBeVisible()
    await expect(page.locator('.readiness-panel > button')).toHaveCount(4)
  }
})

test('daily preparation is saved independently and mind-map nodes remain interactive', async ({ page }) => {
  await page.goto('/day/02')
  const check = page.locator('.readiness-panel > button').first()
  await check.click()
  await expect(check).toHaveAttribute('aria-pressed', 'true')
  await page.reload()
  await expect(check).toHaveAttribute('aria-pressed', 'true')
  await page.locator('.mind-node').nth(1).click()
  await expect(page.locator('.inspector-place strong')).toHaveText('Kainchi Dham')
  await expect(page.locator('.inspector-leg')).toContainText('11:00')
  await page.locator('.chapter-rail').getByRole('link').nth(2).click()
  await expect(page.locator('.readiness-panel > button').first()).toHaveAttribute('aria-pressed', 'false')
})

test('route atlas selects a day and opens its full field guide', async ({ page }) => {
  await page.goto('/route')
  await page.locator('.atlas-day-list > div').nth(3).getByRole('button').click()
  await expect(page.locator('.map-route-card')).toContainText('Munsyari local')
  await page.locator('.atlas-day-list > div').nth(3).getByRole('link').click()
  await expect(page).toHaveURL(/\/day\/04$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('High Country')
})

test('mobile day pages fit without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  for (const path of ['/', '/day/01', '/day/02', '/day/03', '/day/04', '/day/05', '/day/06', '/route']) {
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  }
})

test('chapter overview link restores the overview section and browser back restores the day', async ({ page }) => {
  await page.goto('/day/03')
  await page.locator('.day-back').click()
  await expect(page).toHaveURL('/#plan')
  await expect(page.locator('#plan')).toBeInViewport()
  await page.goBack()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('The Snow Gate')
})

test('invalid day has a way back to the overview', async ({ page }) => {
  await page.goto('/day/99')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('back on the road')
  await expect(page.getByRole('link', { name: 'Journey overview' })).toBeVisible()
})
