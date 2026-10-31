import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { envelope, fixtureResponse, lessons } from '../support/public-fixture'

const readerUrl = '/courses/course-flagship/lessons/lesson-flagship-1'
const evidence = resolve(
  import.meta.dirname,
  '../../test-results/mock-evidence',
)
const publicHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'X-Request-ID': 'frontend-e2e',
}
async function installPublicApi(page: Page) {
  await page.route('**/api/v1/**', async (route) => {
    const response = fixtureResponse(new URL(route.request().url()))
    await route.fulfill({
      status: response.status,
      headers: publicHeaders,
      body: JSON.stringify(response.body),
    })
  })
  await page.route('**/assets/fixture/**', (route) =>
    route.fulfill({
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="120" viewBox="0 0 500 120"><rect width="500" height="120" rx="8" fill="#F7F7F1"/><g fill="#17382F" font-family="sans-serif" font-size="16"><text x="24" y="65">Prompt</text><text x="220" y="65">AI</text><text x="370" y="65">Response</text></g><path d="M110 60h80m90 0h65" stroke="#17382F" stroke-width="2"/></svg>',
    }),
  )
}
async function loaded(page: Page) {
  await expect(
    page.getByRole('link', { name: 'Foundations Path', exact: true }),
  ).toBeVisible()
}
async function noOverflow(page: Page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true)
}

test.beforeEach(async ({ page }) => {
  await installPublicApi(page)
})

test('Guest navigates Path → Course → both free Lessons; flashcard stays local', async ({
  page,
}) => {
  const requests: string[] = []
  page.on('request', (r) => {
    if (r.url().includes('/api/v1/')) requests.push(r.method())
  })
  await page.goto('/catalog')
  await loaded(page)
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
  const reveal = page.getByRole('button', {
    name: 'Lihat penjelasan',
    exact: true,
  })
  await reveal.focus()
  await page.keyboard.press('Enter')
  const hide = page.getByRole('button', { name: 'Sembunyikan penjelasan' })
  await expect(hide).toBeFocused()
  await expect(hide).toHaveAttribute('aria-expanded', 'true')
  await expect(
    page.getByText('A request or instruction to an AI system.'),
  ).toBeVisible()
  await page.reload()
  await expect(reveal).toHaveAttribute('aria-expanded', 'false')
  await page
    .getByRole('link', { name: /Lesson berikutnya.*Safe Practice/ })
    .click()
  await expect(
    page.getByRole('heading', { name: 'Safe Practice', level: 1 }),
  ).toBeVisible()
  await expect(
    page.getByText('Local practice never grants official completion.'),
  ).toBeVisible()
  expect(requests.every((method) => method === 'GET')).toBe(true)
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([])
  await noOverflow(page)
})

test('200% text, 320px reflow, and reduced motion retain all controls', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 })
  await page.goto('/catalog')
  await loaded(page)
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%'
  })
  await noOverflow(page)
  const search = page.getByLabel('Cari judul atau ringkasan')
  await search.fill('Foundations')
  await page.getByRole('button', { name: 'Cari', exact: true }).click()
  await loaded(page)
  await page.goto(readerUrl)
  await page.evaluate(() => {
    document.documentElement.style.fontSize = '200%'
  })
  const reveal = page.getByRole('button', { name: 'Lihat penjelasan' })
  await expect(reveal).toBeVisible()
  await noOverflow(page)
  await reveal.focus()
  await page.keyboard.press('Space')
  await expect(
    page.getByRole('button', { name: 'Sembunyikan penjelasan' }),
  ).toBeFocused()
  await noOverflow(page)
  expect(
    await page
      .getByRole('button', { name: 'Sembunyikan penjelasan' })
      .evaluate((element) => getComputedStyle(element).transitionDuration),
  ).toBe('0s')
})

test('search, membership filtering, no-match reset, and history work', async ({
  page,
}) => {
  await page.goto('/catalog?type=courses')
  await expect(
    page.getByRole('link', { name: 'Focused Practice', exact: true }),
  ).toBeVisible()
  await page.getByLabel('Dalam learning path').selectOption('path-foundations')
  await expect(
    page.getByRole('link', { name: 'Focused Practice', exact: true }),
  ).toHaveCount(0)
  await page.getByLabel('Cari judul atau ringkasan').fill('zznone')
  await page.getByRole('button', { name: 'Cari', exact: true }).click()
  await expect(page.getByText('Belum menemukan yang cocok?')).toBeVisible()
  await page.goBack()
  await expect(
    page.getByRole('link', { name: 'Menguasai ChatGPT dari Nol', exact: true }),
  ).toBeVisible()
  await expect(page.getByLabel('Cari judul atau ringkasan')).toHaveValue('')
  await page.getByRole('button', { name: 'Hapus pencarian dan filter' }).click()
  await expect(
    page.getByRole('link', { name: 'Focused Practice', exact: true }),
  ).toBeVisible()
})

test('opaque cursor pagination appends and a new query resets it', async ({
  page,
}) => {
  const cursors: string[] = []
  page.on('request', (r) => {
    const url = new URL(r.url())
    if (url.searchParams.has('cursor'))
      cursors.push(url.searchParams.get('cursor')!)
  })
  await page.goto('/catalog?limit=1')
  await loaded(page)
  await expect(
    page.getByRole('link', { name: 'Practice Path', exact: true }),
  ).toHaveCount(0)
  await page.getByRole('button', { name: 'Muat lagi', exact: true }).click()
  await expect(
    page.getByRole('link', { name: 'Practice Path', exact: true }),
  ).toBeVisible()
  expect(cursors).toEqual(['test_opaque_page_2'])
  await page.getByLabel('Cari judul atau ringkasan').fill('Foundations')
  await page.getByRole('button', { name: 'Cari', exact: true }).click()
  await expect(
    page.getByRole('link', { name: 'Practice Path', exact: true }),
  ).toHaveCount(0)
  await expect(
    page.getByRole('button', { name: 'Muat lagi', exact: true }),
  ).toHaveCount(0)
})

test('loading, error, empty, and invalid cursor preserve recovery', async ({
  page,
}) => {
  let fail = true
  await page.route('**/api/v1/catalog/paths*', async (route) => {
    await new Promise((r) => setTimeout(r, 400))
    if (fail)
      await route.fulfill({
        status: 500,
        headers: publicHeaders,
        body: JSON.stringify({
          title: 'private-marker',
          detail: 'internal stack private-marker',
        }),
      })
    else await route.fallback()
  })
  await page.goto('/catalog')
  await expect(page.getByText('Memuat katalog…')).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Materi belum bisa dimuat' }),
  ).toBeVisible()
  await expect(page.locator('body')).not.toContainText('private-marker')
  fail = false
  await page.getByRole('button', { name: 'Coba lagi', exact: true }).click()
  await loaded(page)
  await page.goto('/catalog?limit=1')
  await loaded(page)
  await page.route('**/api/v1/catalog/paths*cursor=*', (route) =>
    route.fulfill({ status: 400, headers: publicHeaders, body: '{}' }),
  )
  await page.getByRole('button', { name: 'Muat lagi', exact: true }).click()
  await expect(page.getByText('Daftar perlu dimuat ulang')).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'Foundations Path', exact: true }),
  ).toBeVisible()
  await page.getByRole('button', { name: 'Muat ulang daftar' }).click()
  await expect(page.getByText('Daftar perlu dimuat ulang')).toHaveCount(0)
  await page.getByLabel('Cari judul atau ringkasan').fill('zznone')
  await page.getByRole('button', { name: 'Cari', exact: true }).click()
  await expect(page.getByText('Belum menemukan yang cocok?')).toBeVisible()
})

test('keyboard skip link, focus and native mobile dialog are operable', async ({
  page,
}, testInfo) => {
  await page.goto('/catalog')
  await loaded(page)
  await page.keyboard.press('Tab')
  await expect(
    page.getByRole('link', { name: 'Lewati ke konten utama' }),
  ).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('main')).toBeFocused()
  if (testInfo.project.name !== 'desktop') {
    const menu = page.getByRole('button', { name: 'Menu', exact: true })
    await menu.focus()
    await page.keyboard.press('Enter')
    const dialog = page.getByRole('dialog', { name: 'Jelajahi AI Learning' })
    await expect(dialog).toBeVisible()
    for (let n = 0; n < 6; n++) await page.keyboard.press('Tab')
    expect(
      await page.evaluate(() => !!document.activeElement?.closest('dialog')),
    ).toBe(true)
    await page.keyboard.press('Escape')
    await expect(menu).toBeFocused()
  }
  const search = page.getByLabel('Cari judul atau ringkasan')
  await search.focus()
  expect(await search.evaluate((el) => getComputedStyle(el).outlineStyle)).toBe(
    'solid',
  )
  await noOverflow(page)
})

test('unsafe Markdown/media stay inert and mismatched/private links stay generic', async ({
  page,
}) => {
  let dialogCount = 0
  page.on('dialog', async (d) => {
    dialogCount++
    await d.dismiss()
  })
  await page.route(
    '**/api/v1/courses/course-flagship/lessons/lesson-flagship-1',
    (route) =>
      route.fulfill({
        headers: publicHeaders,
        body: JSON.stringify(
          envelope({
            ...lessons['lesson-flagship-1'],
            blocks: [
              {
                id: 'rich',
                position: 1,
                type: 'richText',
                payload: {
                  markdown:
                    '# Safe heading\n\n<script>alert(1)</script>\n\n<img src=x onerror=alert(2)>\n\n[unsafe](javascript:alert(3)) [safe](https://example.test)',
                },
              },
              {
                id: 'media',
                position: 2,
                type: 'media',
                payload: { src: '//private.invalid/file', alt: 'Unsafe media' },
              },
              {
                id: 'code',
                position: 3,
                type: 'code',
                payload: {
                  language: 'text',
                  text: '<script>alert(4)</script>',
                },
              },
            ],
          }),
        ),
      }),
  )
  await page.goto(readerUrl)
  await expect(
    page.getByRole('heading', { name: 'Safe heading' }),
  ).toBeVisible()
  expect(
    await page
      .locator(
        'article script,article img,article [onerror],article a[href^="javascript:"]',
      )
      .count(),
  ).toBe(0)
  await expect(page.getByText('<script>alert(4)</script>')).toBeVisible()
  expect(dialogCount).toBe(0)
  await page.goto('/courses/course-flagship/lessons/lesson-focus-1')
  await expect(page.getByText('Materi tidak tersedia')).toBeVisible()
  await expect(page.locator('body')).not.toContainText('Focus Lesson')
  await page.goto('/courses/course-hidden')
  await expect(page.getByText('Materi tidak tersedia')).toBeVisible()
})

test('rendered screens pass automated accessibility and produce screenshot evidence', async ({
  page,
}, testInfo) => {
  await mkdir(evidence, { recursive: true })
  const routes = [
    ['catalog', '/catalog', 'Mulai dengan rasa ingin tahu.'],
    ['path', '/paths/path-practice', 'Practice Path'],
    ['course', '/courses/course-flagship', 'Menguasai ChatGPT dari Nol'],
    ['reader', readerUrl, 'First Steps'],
  ]
  for (const [name, url, heading] of routes) {
    await page.goto(url)
    await expect(
      page.getByRole('heading', { name: heading, level: 1 }),
    ).toBeVisible()
    if (name === 'catalog') await loaded(page)
    if (name === 'reader')
      await page.getByRole('button', { name: 'Lihat penjelasan' }).click()
    await page.evaluate(() => document.fonts.ready)
    await noOverflow(page)
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.screenshot({
      path: resolve(evidence, `${testInfo.project.name}-${name}.png`),
      fullPage: true,
    })
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(
      results.violations,
      JSON.stringify(
        results.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
      ),
    ).toEqual([])
  }
  await page.setViewportSize({ width: 320, height: 900 })
  await page.goto('/catalog')
  await loaded(page)
  await noOverflow(page)
  await page.goto(readerUrl)
  await expect(
    page.getByRole('button', { name: 'Lihat penjelasan' }),
  ).toBeVisible()
  await noOverflow(page)
})
