import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { completedPublicRead } from '../support/completed-response'

// No page.route/context.route/API interception is permitted in this suite.
const evidence = resolve(
  import.meta.dirname,
  '../../../../docs/vs01a-integration/evidence',
)
const lesson = '/courses/course-flagship/lessons/lesson-flagship-1'
const privateMarkers = [
  'synthetic-private-answer-marker',
  'Private Course Marker',
  'Private Path Marker',
  'Draft Flagship Revision',
  'draft-v2',
  'assessment-hidden',
]
async function ready(page: Page) {
  await expect(
    page.getByRole('link', { name: 'Foundations Path', exact: true }),
  ).toBeVisible()
}
async function noOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true)
}

test('FT-001–003: actual Go public reads support the complete Guest journey', async ({
  page,
  request,
}, info) => {
  const observed = new Map<
    string,
    { status: number; snapshotId: unknown; requestId: string | undefined }
  >()
  const pending: Promise<void>[] = []
  page.on('response', (response) => {
    const url = new URL(response.url())
    if (!url.pathname.startsWith('/api/v1/')) return
    pending.push(
      (async () => {
        let body
        try {
          body = await response.json()
        } catch {
          return
        } // StrictMode/navigation can cancel a read; required completed endpoints are asserted below.
        expect(
          privateMarkers.some((marker) =>
            JSON.stringify(body).includes(marker),
          ),
          'private material in public HTTP response',
        ).toBe(false)
        observed.set(url.pathname, {
          status: response.status(),
          snapshotId: body.meta?.snapshotId,
          requestId: response.headers()['x-request-id'],
        })
      })(),
    )
  })
  await page.goto('/catalog')
  await ready(page)
  await expect(page.getByLabel('Memuat course')).toBeEnabled()
  await Promise.all(pending)
  await page
    .getByRole('link', { name: 'Foundations Path', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { level: 1, name: 'Foundations Path' }),
  ).toBeVisible()
  await page
    .getByRole('link', { name: 'Menguasai ChatGPT dari Nol', exact: true })
    .click()
  await expect(
    page.getByRole('heading', { level: 1, name: 'Menguasai ChatGPT dari Nol' }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Baca lesson pertama' }).click()
  await page.getByRole('button', { name: 'Lihat penjelasan' }).focus()
  await page.keyboard.press('Enter')
  await expect(
    page.getByText('A request or instruction to an AI system.'),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Sembunyikan penjelasan' }),
  ).toBeFocused()
  await page.reload()
  await expect(
    page.getByRole('button', { name: 'Lihat penjelasan' }),
  ).toHaveAttribute('aria-expanded', 'false')
  await page
    .getByRole('link', { name: /Lesson berikutnya.*Safe Practice/ })
    .click()
  await expect(
    page.getByRole('heading', { level: 1, name: 'Safe Practice' }),
  ).toBeVisible()
  await expect(
    page.getByText('Local practice never grants official completion.'),
  ).toBeVisible()
  await Promise.all(pending)
  for (const path of [
    '/api/v1/catalog/paths',
    '/api/v1/catalog/courses',
    '/api/v1/paths/path-foundations',
    '/api/v1/courses/course-flagship',
    '/api/v1/courses/course-flagship/lessons/lesson-flagship-1',
  ]) {
    expect(observed.get(path)?.status).toBe(200)
    expect(observed.get(path)?.snapshotId).toBe('pub-v1')
    expect(observed.get(path)?.requestId).toMatch(
      /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/,
    )
  }
  const direct = await request.get(
    'http://127.0.0.1:18081/api/v1/courses/course-flagship',
  )
  expect(direct.status()).toBe(200)
  expect((await direct.json()).data.title).toBe('Menguasai ChatGPT dari Nol')
  await mkdir(evidence, { recursive: true })
  await writeFile(
    resolve(evidence, `${info.project.name}-http.json`),
    JSON.stringify(
      {
        fixture: 'vs01a-guest-proof@1.0.0',
        source: 'real Go 1.27.3 via Vite proxy; no interception',
        requests: Object.fromEntries(observed),
      },
      null,
      2,
    ),
  )
})

test('FT-001 / N07–11: search, membership and real signed cursor pagination', async ({
  page,
  request,
}) => {
  await page.goto('/catalog?type=courses')
  await expect(
    page.getByRole('link', { name: 'Focused Practice', exact: true }),
  ).toBeVisible()
  await page.getByLabel('Dalam learning path').selectOption('path-foundations')
  await expect(
    page.getByRole('link', { name: 'Focused Practice', exact: true }),
  ).toHaveCount(0)
  await page.getByLabel('Cari judul atau ringkasan').fill('zz-no-match')
  await page.getByRole('button', { name: 'Cari', exact: true }).click()
  await expect(page.getByText('Belum menemukan yang cocok?')).toBeVisible()
  await page.getByRole('button', { name: 'Hapus filter', exact: true }).click()
  await expect(
    page.getByRole('link', { name: 'Focused Practice', exact: true }),
  ).toBeVisible()
  const initialURL = new URL('/api/v1/catalog/paths?limit=1', page.url()).href
  const [{ body: first }] = await Promise.all([
    completedPublicRead(page, initialURL),
    page.goto('/catalog?limit=1'),
  ])
  await ready(page)
  expect(first.meta.snapshotId).toBe('pub-v1')
  expect(first.data).toHaveLength(1)
  expect(first.data[0].id).toBe('path-foundations')
  await expect(
    page.getByRole('link', { name: first.data[0].title, exact: true }),
  ).toHaveAttribute('href', `/paths/${first.data[0].id}`)
  await expect(page.getByText(first.data[0].summary, { exact: true })).toBeVisible()
  const cursor = first.page.nextCursor as string
  expect(cursor).toMatch(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/)
  const nextURL = new URL(initialURL)
  nextURL.searchParams.set('cursor', cursor)
  const [{ body: second }] = await Promise.all([
    completedPublicRead(page, nextURL.href),
    page.getByRole('button', { name: 'Muat lagi', exact: true }).click(),
  ])
  expect(second.meta.snapshotId).toBe(first.meta.snapshotId)
  expect(second.data).toHaveLength(1)
  expect(second.data[0].id).toBe('path-practice')
  expect(second.page.nextCursor).toBeNull()
  await expect(
    page.getByRole('link', { name: second.data[0].title, exact: true }),
  ).toHaveAttribute('href', `/paths/${second.data[0].id}`)
  await expect(
    page.getByRole('link', { name: 'Practice Path', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Muat lagi', exact: true }),
  ).toHaveCount(0)
  for (const path of [
    `/api/v1/catalog/paths?limit=1&cursor=${encodeURIComponent(cursor + 'x')}`,
    `/api/v1/catalog/courses?limit=1&cursor=${encodeURIComponent(cursor)}`,
    `/api/v1/catalog/paths?limit=2&cursor=${encodeURIComponent(cursor)}`,
    `/api/v1/catalog/paths?limit=1&q=changed&cursor=${encodeURIComponent(cursor)}`,
  ]) {
    const response = await request.get(path)
    expect(response.status()).toBe(400)
  }
  const replay = await request.get(
    `/api/v1/catalog/paths?limit=1&cursor=${encodeURIComponent(cursor)}`,
  )
  expect(replay.status()).toBe(200)
  expect((await replay.json()).data[0].id).toBe('path-practice')
  await page.getByLabel('Cari judul atau ringkasan').fill('Foundations')
  await page.getByRole('button', { name: 'Cari', exact: true }).click()
  await expect(
    page.getByRole('link', { name: 'Practice Path', exact: true }),
  ).toHaveCount(0)
})

test('ST-008 / N01–06,N14–17: hidden, draft and official outcomes remain unavailable', async ({
  page,
  request,
}) => {
  for (const path of [
    '/api/v1/paths/path-hidden',
    '/api/v1/courses/course-hidden',
    '/api/v1/courses/course-flagship/lessons/lesson-draft',
    '/api/v1/courses/course-flagship/lessons/lesson-focus-1',
  ]) {
    const response = await request.get(path)
    expect(response.status()).toBe(404)
    expect(
      privateMarkers.some((marker) =>
        (response.headers()['x-request-id'] || '').includes(marker),
      ),
    ).toBe(false)
    const body = await response.json()
    expect(Object.keys(body).sort()).toEqual([
      'requestId',
      'status',
      'title',
      'type',
    ])
    expect(
      privateMarkers.some((marker) => JSON.stringify(body).includes(marker)),
    ).toBe(false)
  }
  expect((await request.post('/api/v1/catalog/paths')).status()).toBe(405)
  expect(
    (
      await request.get('/api/v1/catalog/paths', {
        headers: { Accept: 'text/html' },
      })
    ).status(),
  ).toBe(406)
  expect((await request.get('/api/v1/catalog/courses?limit=51')).status()).toBe(
    400,
  )
  expect((await request.get('/api/v1/catalog/courses?q=x&q=y')).status()).toBe(
    400,
  )
  const invalid = await request.get('/api/v1/catalog/paths', {
    headers: { 'X-Request-ID': 'invalid request id' },
  })
  expect(invalid.headers()['x-request-id']).not.toBe('invalid request id')
  expect(invalid.headers()['x-request-id']).toMatch(
    /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/,
  )
  await page.goto('/courses/course-hidden')
  await expect(page.getByText('Materi tidak tersedia')).toBeVisible()
  await page
    .getByRole('link', { name: 'Kembali ke katalog', exact: true })
    .first()
    .click()
  await ready(page)
  await page.evaluate(() => localStorage.setItem('officialCompletion', 'true'))
  await page.goto(lesson)
  await expect(
    page.getByRole('button', { name: 'Lihat penjelasan' }),
  ).toBeVisible()
  for (const path of [
    '/api/v1/me/activity-evidence',
    '/api/v1/me/course-completions/course-flagship',
  ])
    expect(
      (await request.post(path, { data: { passed: true } })).status(),
    ).toBe(404)
  const content = await request.get('/api/v1/courses/course-flagship')
  const keys = Object.keys((await content.json()).data)
  expect(
    keys.some((key) =>
      ['progress', 'grade', 'completion', 'enrollment'].includes(key),
    ),
  ).toBe(false)
})

test('ST-013 / N12–13: real fixture rich content and public media stay safe', async ({
  page,
  request,
}) => {
  let dialogs = 0
  page.on('dialog', async (dialog) => {
    dialogs++
    await dialog.dismiss()
  })
  await page.goto(lesson)
  await expect(page.locator('article code')).toHaveText(
    "<script>alert('literal only')</script>",
  )
  expect(
    await page
      .locator(
        'article script, article [onerror], article a[href^="javascript:"]',
      )
      .count(),
  ).toBe(0)
  const image = page.getByRole('img', { name: 'Synthetic learning diagram' })
  await image.scrollIntoViewIfNeeded()
  await expect
    .poll(() =>
      image.evaluate((element) => (element as HTMLImageElement).naturalWidth),
    )
    .toBe(240)
  const media = await request.get('/assets/fixture/diagram.svg')
  expect(media.status()).toBe(200)
  expect(media.headers()['content-type']).toBe('image/svg+xml')
  expect(media.headers()['x-content-type-options']).toBe('nosniff')
  expect((await request.get('/assets/fixture/manifest.json')).status()).toBe(
    404,
  )
  expect(
    (await request.get('/assets/fixture/diagram.svg?file=private')).status(),
  ).toBe(400)
  expect(dialogs).toBe(0)
})

test('real desktop/mobile keyboard, layouts and screenshots preserve the original UI', async ({
  page,
}, info) => {
  await mkdir(evidence, { recursive: true })
  const pages = [
    ['catalog', '/catalog', 'Mulai dengan rasa ingin tahu.'],
    ['path', '/paths/path-practice', 'Practice Path'],
    ['course', '/courses/course-flagship', 'Menguasai ChatGPT dari Nol'],
    ['reader', lesson, 'First Steps'],
  ]
  for (const [name, path, heading] of pages) {
    await page.goto(path)
    await expect(
      page.getByRole('heading', { level: 1, name: heading }),
    ).toBeVisible()
    if (name === 'catalog') await ready(page)
    if (name === 'reader')
      await page.getByRole('button', { name: 'Lihat penjelasan' }).click()
    await page.evaluate(() => document.fonts.ready)
    await noOverflow(page)
    await page.evaluate(() => scrollTo(0, 0))
    await page.screenshot({
      path: resolve(evidence, `${info.project.name}-${name}.png`),
      fullPage: true,
    })
    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(axe.violations.map((v) => v.id)).toEqual([])
  }
  await page.goto('/catalog')
  await ready(page)
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('link', { name: 'Lewati ke konten utama' }),
  ).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()
  if (info.project.name === 'real-mobile') {
    const menu = page.getByRole('button', { name: 'Menu', exact: true })
    await menu.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(menu).toBeFocused()
  }
})
