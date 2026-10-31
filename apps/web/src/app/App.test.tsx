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
