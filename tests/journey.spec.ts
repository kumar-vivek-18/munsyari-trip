import { test, expect } from '@playwright/test'

test('overview has six day plans with working next-day navigation', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await expect(page.locator('.overview-day-card')).toHaveCount(6)
  await page.locator('.overview-day-card').first().click()
  await expect(page).toHaveURL(/\/day\/01$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Night to the Hills')
  await page.locator('.planner-day-pagination .next').click()
  await expect(page).toHaveURL(/\/day\/02$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Through Kumaon')
  await expect(page.locator('.ordered-route')).toContainText('1.5–2 hrs')
  await expect(page.locator('.ordered-route')).toContainText('11:00')
  await expect(page.locator('.leaflet-container')).toBeVisible()
  expect(errors).toEqual([])
})

test('all days expose one schedule with separate places and preparation tabs', async ({ page }) => {
  for (const day of ['01', '02', '03', '04', '05', '06']) {
    await page.goto(`/day/${day}`)
    await expect(page).toHaveTitle(new RegExp(`Day ${day}`))
    await expect(page.locator('.compact-path')).toHaveCount(1)
    await expect(page.locator('.path-stop').first()).toBeVisible()
    await expect(page.locator('.planner-tabs button')).toHaveCount(3)
    await page.getByRole('button', { name: 'Places to visit', exact: true }).click()
    await expect(page.locator('.place-row')).toHaveCount(3)
    await expect(page.locator('.compact-path')).toHaveCount(0)
    await page.getByRole('button', { name: /^(Train|Stay) & preparation$/ }).click()
    await expect(page.locator('.planner-checklist > button')).toHaveCount(4)
    await expect(page.locator('.stay-summary')).toBeVisible()
    await expect(page.locator('.tomorrow-summary')).toBeVisible()
  }
})

test('preparation deep links persist across reload and checklists stay day-specific', async ({ page }) => {
  await page.goto('/day/01?view=prepare')
  await expect(page.locator('.train-summary')).toContainText('15013')
  await expect(page.locator('.packing-summary article')).toHaveCount(3)
  const check = page.locator('.planner-checklist > button').first()
  await check.click()
  await expect(check).toHaveAttribute('aria-pressed', 'true')
  await page.reload()
  await expect(check).toHaveAttribute('aria-pressed', 'true')
  await page.goto('/day/02?view=prepare')
  await expect(check).toHaveAttribute('aria-pressed', 'false')
})

test('route atlas selects a stage and opens its guide', async ({ page }) => {
  await page.goto('/route')
  await page.locator('.atlas-stages > div').nth(4).getByRole('button').click()
  await expect(page.locator('.map-route-card')).toContainText('Munsyari local')
  await page.locator('.atlas-stages > div').nth(4).getByRole('link').click()
  await expect(page).toHaveURL(/\/day\/04$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('High Country')
})

test('mobile pages and preparation tabs have no horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  for (const path of ['/', '/day/01', '/day/02', '/day/03', '/day/04', '/day/05', '/day/06', '/route', '/day/01?view=prepare', '/day/03?view=places']) {
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  }
})

test('all days link returns to overview and browser back restores day', async ({ page }) => {
  await page.goto('/day/03')
  await page.locator('.planner-back').click()
  await expect(page).toHaveURL('/#plan')
  await expect(page.locator('#plan')).toBeInViewport()
  await page.goBack()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The Snow Gate')
})

test('invalid day has a route back home', async ({ page }) => {
  await page.goto('/day/99')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('back to the trip')
  await expect(page.locator('.planner-empty a')).toHaveAttribute('href', '/')
})

test('stop panel supports next, previous, saved tasks and keyboard dismissal', async ({ page }) => {
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

test('mobile stop sheet fits and returns to its route', async ({ page }) => {
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

test('destination images, credits and place links work while train uses an icon', async ({ page }) => {
  await page.goto('/day/02?view=places')
  const place = page.locator('.place-row').first()
  await expect(place.getByRole('img')).toHaveAttribute('src', '/places/kainchi.jpg')
  await expect.poll(() => place.getByRole('img').evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)
  await expect(place.locator('.place-photo-credit')).toContainText('Manvikesarwani09')
  await expect(place.getByRole('link', { name: 'View Kainchi Dham on Google Maps' })).toHaveAttribute('href', /google\.com\/maps\/search\/.+Kainchi/)
  await page.goto('/day/01')
  await page.getByRole('button', { name: 'Open stop 2: Ranikhet Express 15013' }).click()
  await expect(page.getByRole('dialog').locator('.stop-photo-block img')).toHaveCount(0)
  await expect(page.getByRole('dialog').locator('.place-illustration-rail')).toBeVisible()
  await expect(page.getByRole('dialog').locator('.place-map-link')).toHaveAttribute('href', /Delhi/)
})

test('failed photos fall back gracefully without blocking stop tasks', async ({ page }) => {
  await page.route('**/places/kainchi.jpg', (route) => route.abort())
  await page.goto('/day/02')
  await page.getByRole('button', { name: 'Open stop 2: Kainchi Dham' }).click()
  await expect(page.getByRole('dialog').locator('.place-illustration-temple')).toBeVisible()
  await expect(page.getByRole('dialog').locator('.stop-task-list button')).toHaveCount(3)
  await expect(page.getByRole('dialog').locator('.stop-dialog-timing')).toContainText('1.5–2 hrs')
})
