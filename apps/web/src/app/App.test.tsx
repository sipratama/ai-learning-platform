import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from './App'
import {
  envelope,
  fixtureResponse,
  lessons,
  paths,
} from '../../tests/support/public-fixture'

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn())
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({
        matches: true,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    )
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        const response = fixtureResponse(new URL(url))
        return new Response(JSON.stringify(response.body), {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        })
      }),
    )
  })
  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })
  function app(url = '/catalog') {
    return render(
      <MemoryRouter initialEntries={[url]}>
        <AppRoutes />
      </MemoryRouter>,
    )
  }
  it('offers the public catalog with a main landmark and no account gate', async () => {
    app()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 1, name: /Mulai dengan/ }),
    ).toBeInTheDocument()
    expect(
      await screen.findByRole('link', { name: 'Foundations Path' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: /login|daftar/i }),
    ).not.toBeInTheDocument()
  })
  it('submits search and resets a no-match filter', async () => {
    app()
    await screen.findByRole('link', { name: 'Foundations Path' })
    fireEvent.change(screen.getByLabelText('Cari judul atau ringkasan'), {
      target: { value: 'zznone' },
    })
    fireEvent.submit(screen.getByRole('search'))
    expect(
      await screen.findByText('Belum menemukan yang cocok?'),
    ).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Hapus filter' }))
    expect(
      await screen.findByRole('link', { name: 'Foundations Path' }),
    ).toBeInTheDocument()
  })
  it('reads a direct Lesson and reveals only local ungraded content', async () => {
    app('/courses/course-flagship/lessons/lesson-flagship-1')
    const button = await screen.findByRole('button', {
      name: 'Lihat penjelasan',
    })
    expect(button).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(
      screen.getByText('A request or instruction to an AI system.'),
    ).toBeVisible()
    expect(
      screen.getByText("<script>alert('literal only')</script>"),
    ).toBeInTheDocument()
    expect(document.querySelector('article script')).toBeNull()
    expect(
      vi.mocked(fetch).mock.calls.every(([, init]) => init?.method === 'GET'),
    ).toBe(true)
  })
  it('clears stale pagination errors after each completed replacement and uses its new cursor', async () => {
    const original = vi.mocked(fetch).getMockImplementation()!
    let generation = 0
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string, init?: RequestInit) => {
        const request = new URL(url)
        if (request.pathname !== '/api/v1/catalog/paths')
          return original(url, init)
        const cursor = request.searchParams.get('cursor')
        if (cursor?.endsWith('-expired'))
          return new Response('{}', { status: 400 })
        return new Response(
          JSON.stringify(
            cursor
              ? envelope([paths[1]], `cursor-${generation}-expired`)
              : envelope(
                  [{ ...paths[0], title: `Foundations generation ${generation}` }],
                  `cursor-${generation}`,
                ),
          ),
          { headers: { 'Content-Type': 'application/json' } },
        )
      }),
    )
    app('/catalog?limit=1')
    for (let cycle = 0; cycle < 2; cycle++) {
      await screen.findByRole('link', {
        name: `Foundations generation ${generation}`,
      })
      fireEvent.click(screen.getByRole('button', { name: 'Muat lagi' }))
      await screen.findByRole('link', { name: 'Practice Path' })
      fireEvent.click(screen.getByRole('button', { name: 'Muat lagi' }))
      await screen.findByRole('heading', { name: 'Daftar perlu dimuat ulang' })
      generation++
      fireEvent.click(screen.getByRole('button', { name: 'Muat ulang daftar' }))
      // A new title proves this assertion observes the settled replacement,
      // rather than the transient loading state that hides the old alert.
      await screen.findByRole('link', {
        name: `Foundations generation ${generation}`,
      })
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: 'Muat ulang daftar' }),
      ).not.toBeInTheDocument()
      expect(
        screen.queryByRole('link', { name: 'Practice Path' }),
      ).not.toBeInTheDocument()
    }
    fireEvent.click(screen.getByRole('button', { name: 'Muat lagi' }))
    await screen.findByRole('link', { name: 'Practice Path' })
    const appendedURL = new URL(vi.mocked(fetch).mock.calls.at(-1)![0] as string)
    expect(appendedURL.searchParams.get('cursor')).toBe('cursor-2')
    expect(screen.getByRole('button', { name: 'Muat lagi' })).toBeEnabled()
  })
  it('shows a genuine replacement failure and allows recovery without resurrecting the append error', async () => {
    const original = vi.mocked(fetch).getMockImplementation()!
    let failReload = false
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string, init?: RequestInit) => {
        const request = new URL(url)
        if (request.pathname !== '/api/v1/catalog/paths')
          return original(url, init)
        if (request.searchParams.has('cursor'))
          return new Response('{}', { status: 400 })
        if (failReload)
          return new Response('{"detail":"private-reload-detail"}', {
            status: 500,
          })
        return original(url, init)
      }),
    )
    app('/catalog?limit=1')
    await screen.findByRole('link', { name: 'Foundations Path' })
    fireEvent.click(screen.getByRole('button', { name: 'Muat lagi' }))
    await screen.findByRole('heading', { name: 'Daftar perlu dimuat ulang' })
    failReload = true
    fireEvent.click(screen.getByRole('button', { name: 'Muat ulang daftar' }))
    await screen.findByRole('heading', { name: 'Materi belum bisa dimuat' })
    expect(screen.getByRole('alert')).toBeVisible()
    expect(
      screen.queryByRole('link', { name: 'Foundations Path' }),
    ).not.toBeInTheDocument()
    expect(document.body).not.toHaveTextContent('private-reload-detail')
    failReload = false
    fireEvent.click(screen.getByRole('button', { name: 'Coba lagi' }))
    await screen.findByRole('link', { name: 'Foundations Path' })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Muat ulang daftar' }),
    ).not.toBeInTheDocument()
  })
  it('keeps errors generic even when a server sends private details', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              detail: 'private-draft-answer',
              title: 'internal stack',
            }),
            { status: 404 },
          ),
      ),
    )
    app('/courses/missing')
    expect(await screen.findByText('Materi tidak tersedia')).toBeInTheDocument()
    expect(document.body).not.toHaveTextContent('private-draft-answer')
  })
  it('fails closed on mismatched Course versions', async () => {
    const original = vi.mocked(fetch).getMockImplementation()!
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string, init?: RequestInit) =>
        url.endsWith('/lessons/lesson-flagship-1')
          ? new Response(
              JSON.stringify(
                envelope({
                  ...lessons['lesson-flagship-1'],
                  courseVersionId: 'pub-other',
                }),
              ),
              { headers: { 'Content-Type': 'application/json' } },
            )
          : original(url, init),
      ),
    )
    app('/courses/course-flagship/lessons/lesson-flagship-1')
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
    expect(
      screen.queryByRole('button', { name: 'Lihat penjelasan' }),
    ).not.toBeInTheDocument()
  })
})
