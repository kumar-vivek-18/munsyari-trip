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
  await expect(page.locator('.ordered-route')).toContainText('1.5–2 hrs')
  await expect(page.locator('.ordered-route')).toContainText('11:00')
  await expect(page.locator('.leaflet-container')).toBeVisible()
  expect(errors).toEqual([])
})

test('all day URLs load directly with route, schedule, highlights and overnight preparation', async ({ page }) => {
  for (const day of ['01', '02', '03', '04', '05', '06']) {
    await page.goto(`/day/${day}`)
    await expect(page).toHaveTitle(new RegExp(`Day ${day}`))
    await expect(page.locator('.day-route-ribbon')).toBeVisible()
    await expect(page.locator('.day-path')).toBeVisible()
    await expect(page.locator('.path-stop').first()).toBeVisible()
    await expect(page.locator('.destination-grid > article')).toHaveCount(3)
    await expect(page.locator('.overnight-note')).toBeVisible()
    await expect(page.locator('.next-morning')).toBeVisible()
    await expect(page.locator('.readiness-panel > button')).toHaveCount(4)
  }
})

test('daily preparation is saved independently and route stops open their details', async ({ page }) => {
  await page.goto('/day/02')
  const check = page.locator('.readiness-panel > button').first()
  await check.click()
  await expect(check).toHaveAttribute('aria-pressed', 'true')
  await page.reload()
  await expect(check).toHaveAttribute('aria-pressed', 'true')
  await page.locator('.path-stop').nth(1).click()
  await expect(page.getByRole('dialog')).toHaveAccessibleName('Kainchi Dham')
  await expect(page.locator('.stop-dialog-timing')).toContainText('11:00')
  await page.getByRole('button', { name: 'Close stop details' }).click()
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

test('ordered stop dialog supports next, previous, saved tasks and keyboard dismissal', async ({ page }) => {
  await page.goto('/day/01')
  await expect(page.locator('.path-stop h4')).toHaveText(['Old Delhi Station', 'Ranikhet Express 15013', 'Kathgodam Station', 'Bike pickup'])
  const opener = page.getByRole('button', { name: 'Open stop 1: Old Delhi Station', exact: true })
  await opener.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toHaveAccessibleName('Old Delhi Station')
  await expect(dialog.getByRole('button', { name: 'Previous', exact: true })).toBeDisabled()
  await dialog.locator('.stop-task-list button').first().click()
  await expect(dialog.locator('.stop-task-list button').first()).toHaveAttribute('aria-pressed', 'true')
  await dialog.getByRole('button', { name: 'Next stop', exact: true }).click()
  await expect(dialog).toHaveAccessibleName('Ranikhet Express 15013')
  await expect(dialog.locator('.stop-next-preview')).toContainText('Kathgodam Station')
  await dialog.getByRole('button', { name: 'Previous', exact: true }).click()
  await expect(dialog.locator('.stop-task-list button').first()).toHaveAttribute('aria-pressed', 'true')
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(opener).toBeFocused()
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden')
  await page.reload()
  await opener.click()
  await expect(page.getByRole('dialog').locator('.stop-task-list button').first()).toHaveAttribute('aria-pressed', 'true')
})

test('mobile stop sheet stays within viewport and final step closes back to route', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/day/02')
  await page.locator('.path-stop').last().click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toHaveAccessibleName('Bageshwar')
  const box = await dialog.boundingBox()
  expect(box!.x).toBeGreaterThanOrEqual(0)
  expect(box!.y).toBeGreaterThanOrEqual(0)
  expect(box!.x + box!.width).toBeLessThanOrEqual(390)
  expect(box!.y + box!.height).toBeLessThanOrEqual(845)
  await dialog.getByRole('button', { name: 'Back to the route' }).click()
  await expect(dialog).not.toBeVisible()
})
