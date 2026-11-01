import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { completedPublicRead } from '../support/completed-response'

// Actual Go responses through Nginx: no routing interception or test doubles.
const lesson = '/courses/course-flagship/lessons/lesson-flagship-1'
const privateMarkers = [
  'synthetic-private-answer-marker', 'Private Course Marker',
  'Private Path Marker', 'Draft Flagship Revision', 'draft-v2',
  'assessment-hidden',
]

test('proxy preserves public contracts, signed cursors and safe errors', async ({ request }, info) => {
  const observed: Record<string, number> = {}
  for (const path of [
    '/healthz', '/api/v1/catalog/paths', '/api/v1/catalog/courses',
    '/api/v1/paths/path-foundations', '/api/v1/courses/course-flagship',
    `/api/v1${lesson}`,
  ]) {
    const response = await request.get(path)
    observed[path] = response.status()
    expect(response.status()).toBe(200)
    const text = await response.text()
    expect(privateMarkers.some((marker) => text.includes(marker))).toBe(false)
    if (path.startsWith('/api/')) {
      const body = JSON.parse(text)
      expect(body.meta.snapshotId).toBe('pub-v1')
      expect(Object.keys(body.data)).not.toContain('officialProgress')
    }
  }
  const first = await (await request.get('/api/v1/catalog/paths?limit=1')).json()
  const cursor = first.page.nextCursor as string
  expect(cursor).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/)
  const next = await request.get(`/api/v1/catalog/paths?limit=1&cursor=${encodeURIComponent(cursor)}`)
  expect(next.status()).toBe(200)
  expect((await next.json()).data[0].id).toBe('path-practice')
  for (const query of [
    'cursor=malformed', `limit=1&cursor=${encodeURIComponent(cursor + 'x')}`,
    `limit=2&cursor=${encodeURIComponent(cursor)}`,
    `limit=1&q=changed&cursor=${encodeURIComponent(cursor)}`,
  ]) expect((await request.get(`/api/v1/catalog/paths?${query}`)).status()).toBe(400)
  expect((await request.get(`/api/v1/catalog/courses?limit=1&cursor=${encodeURIComponent(cursor)}`)).status()).toBe(400)
  for (const path of [
    '/api', '/api/v1/unknown', '/api/v1/paths/path-hidden',
    '/api/v1/courses/course-hidden',
    '/api/v1/courses/course-flagship/lessons/lesson-draft',
    '/api/v1/courses/course-flagship/lessons/lesson-focus-1',
    '/assets/fixture/manifest.json',
  ]) {
    const response = await request.get(path)
    observed[path] = response.status()
    expect(response.status()).toBe(404)
    expect(response.headers()['content-type']).not.toContain('text/html')
    const text = await response.text()
    expect(text).not.toContain('<!doctype html>')
    expect(privateMarkers.some((marker) => text.includes(marker))).toBe(false)
    expect(Object.keys(JSON.parse(text)).sort()).toEqual(['requestId', 'status', 'title', 'type'])
  }
  const media = await request.get('/assets/fixture/diagram.svg')
  expect(media.status()).toBe(200)
  expect(media.headers()['content-type']).toBe('image/svg+xml')
  expect(media.headers()['x-content-type-options']).toBe('nosniff')
  expect((await request.get('/assets/fixture/diagram.svg?file=private')).status()).toBe(400)
  expect((await request.get('/assets/missing.js')).status()).toBe(404)
  expect((await request.post('/api/v1/catalog/paths')).status()).toBe(405)
  expect((await request.post('/api/v1/me/activity-evidence', { data: { passed: true } })).status()).toBe(404)
  expect((await request.get('/api/v1/catalog/paths', { headers: { Accept: 'text/html' } })).status()).toBe(406)
  await info.attach('http-contracts', { body: JSON.stringify(observed, null, 2), contentType: 'application/json' })
})

test('Guest journey, local practice, media and nested refresh work', async ({ page }) => {
  const external = new Set<string>()
  const errors: string[] = []
  let dialogs = 0
  page.on('request', (request) => {
    const url = new URL(request.url())
    if (url.protocol.startsWith('http') && url.origin !== 'http://127.0.0.1:8088') external.add(url.origin)
  })
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('dialog', async (dialog) => { dialogs++; await dialog.dismiss() })
  await page.goto('/catalog')
  await page.getByRole('link', { name: 'Foundations Path', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Foundations Path' })).toBeVisible()
  await page.getByRole('link', { name: 'Menguasai ChatGPT dari Nol', exact: true }).click()
  await page.getByRole('link', { name: 'Baca lesson pertama' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'First Steps' })).toBeVisible()
  await expect(page.locator('article code')).toHaveText("<script>alert('literal only')</script>")
  expect(await page.locator('article script, article [onerror], article a[href^="javascript:"]').count()).toBe(0)
  const image = page.getByRole('img', { name: 'Synthetic learning diagram' })
  await image.scrollIntoViewIfNeeded()
  await expect.poll(() => image.evaluate((el) => (el as HTMLImageElement).naturalWidth)).toBe(240)
  await page.getByRole('button', { name: 'Lihat penjelasan' }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByText('A request or instruction to an AI system.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Sembunyikan penjelasan' })).toBeFocused()
  await page.reload()
  await expect(page.getByRole('button', { name: 'Lihat penjelasan' })).toHaveAttribute('aria-expanded', 'false')
  await page.getByRole('link', { name: /Lesson berikutnya.*Safe Practice/ }).click()
  await expect(page.getByText('Local practice never grants official completion.')).toBeVisible()
  await page.goBack()
  await expect(page.getByRole('heading', { level: 1, name: 'First Steps' })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { level: 1, name: 'First Steps' })).toBeVisible()
  expect(dialogs).toBe(0)
  expect(errors).toEqual([])
  expect([...external]).toEqual([])
})

test('catalog switches, search, membership, empty state and pagination work', async ({ page }) => {
  await page.goto('/catalog')
  await page.getByRole('navigation', { name: 'Jenis katalog' }).getByRole('link', { name: 'Course', exact: true }).click()
  await expect(page.getByRole('link', { name: 'Focused Practice', exact: true })).toBeVisible()
  await page.getByLabel('Dalam learning path').selectOption('path-foundations')
  await expect(page.getByRole('link', { name: 'Focused Practice', exact: true })).toHaveCount(0)
  await page.getByLabel('Cari judul atau ringkasan').fill('ChatGPT')
  await page.getByRole('button', { name: 'Cari', exact: true }).click()
  await expect(page.getByRole('link', { name: 'Menguasai ChatGPT dari Nol', exact: true })).toBeVisible()
  await page.getByLabel('Cari judul atau ringkasan').fill('zz-no-match')
  await page.getByRole('button', { name: 'Cari', exact: true }).click()
  await expect(page.getByText('Belum menemukan yang cocok?')).toBeVisible()
  await page.getByRole('button', { name: 'Hapus filter', exact: true }).click()
  await expect(page.getByRole('link', { name: 'Focused Practice', exact: true })).toBeVisible()
  const url = new URL('/api/v1/catalog/paths?limit=1', page.url())
  const [{ body: first }] = await Promise.all([
    completedPublicRead(page, url.href), page.goto('/catalog?limit=1'),
  ])
  expect(first.data).toHaveLength(1)
  url.searchParams.set('cursor', first.page.nextCursor)
  const [{ body: second }] = await Promise.all([
    completedPublicRead(page, url.href),
    page.getByRole('button', { name: 'Muat lagi', exact: true }).click(),
  ])
  expect(second.data[0].id).toBe('path-practice')
  await expect(page.getByRole('link', { name: 'Practice Path', exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Muat lagi', exact: true })).toHaveCount(0)
  await page.goto('/courses/course-hidden')
  await expect(page.getByText('Materi tidak tersedia')).toBeVisible()
  await page.getByRole('link', { name: 'Kembali ke katalog', exact: true }).first().click()
  await expect(page.getByRole('link', { name: 'Foundations Path', exact: true })).toBeVisible()
})

test('desktop/mobile layouts, keyboard, automated accessibility and screenshots', async ({ page }, info) => {
  for (const [name, path, heading] of [
    ['catalog', '/catalog', 'Mulai dengan rasa ingin tahu.'],
    ['path', '/paths/path-practice', 'Practice Path'],
    ['course', '/courses/course-flagship', 'Menguasai ChatGPT dari Nol'],
    ['reader', lesson, 'First Steps'],
  ]) {
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible()
    if (name === 'reader') await page.getByRole('button', { name: 'Lihat penjelasan' }).click()
    await page.evaluate(() => document.fonts.ready)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.evaluate(() => scrollTo(0, 0))
    const screenshot = info.outputPath(`${name}.png`)
    await page.screenshot({ path: screenshot, fullPage: true })
    await info.attach(name, { path: screenshot, contentType: 'image/png' })
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
    expect(axe.violations.map((v) => v.id)).toEqual([])
  }
  await page.goto('/catalog')
  await expect(page.getByRole('link', { name: 'Foundations Path', exact: true })).toBeVisible()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('link', { name: 'Lewati ke konten utama' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()
  if (info.project.name === 'preview-mobile') {
    const menu = page.getByRole('button', { name: 'Menu', exact: true })
    await menu.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(menu).toBeFocused()
    await page.setViewportSize({ width: 320, height: 720 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})
