import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CourseCard, PathCard } from '../components/ContentCards'
import {
  Badge,
  EmptyState,
  ErrorState,
  Icon,
  Loading,
  PageTitle,
} from '../components/ui'
import {
  hasControlCharacters,
  parseCourse,
  parsePath,
  publicList,
  PublicApiError,
  validId,
  type CourseSummary,
  type PathSummary,
  type PublicResponse,
} from '../lib/api/public'
import { useResource } from '../lib/useResource'

type Item = CourseSummary | PathSummary
export function Catalog() {
  const [params, setParams] = useSearchParams()
  const kind = params.get('type') === 'courses' ? 'courses' : 'paths'
  const q = (params.get('q') ?? '').trim(),
    filterKey = kind === 'paths' ? 'courseId' : 'pathId'
  const filter = params.get(filterKey) ?? ''
  const query = new URLSearchParams()
  if (q) query.set('q', q)
  if (filter) query.set(filterKey, filter)
  if (params.has('limit')) query.set('limit', params.get('limit')!)
  const requestKey = `/catalog/${kind}?${query}`
  const parse =
    kind === 'paths'
      ? (value: unknown): Item => parsePath(value)
      : (value: unknown): Item => parseCourse(value)
  const invalid =
    [...q].length > 100 ||
    hasControlCharacters(q) ||
    (filter && !validId(filter)) ||
    (params.has('limit') &&
      !/^(?:[1-9]|[1-4][0-9]|50)$/.test(params.get('limit')!)) ||
    ['q', filterKey, 'limit'].some((key) => params.getAll(key).length > 1)
  const resource = useResource<Item[]>(
    `${requestKey}:${invalid ? 'invalid' : 'valid'}`,
    async (signal) => {
      if (invalid) throw new PublicApiError(400)
      return publicList(requestKey, parse, signal)
    },
  )
  const options = useResource<{ id: string; title: string }[]>(
    `options:${kind}`,
    async (signal) => {
      const endpoint = kind === 'paths' ? '/catalog/courses' : '/catalog/paths'
      const items: { id: string; title: string }[] = []
      let cursor: string | null = null,
        snapshot: string | undefined
      const seen = new Set<string>()
      do {
        const result: PublicResponse<Item[]> = await publicList<Item>(
          `${endpoint}${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''}`,
          kind === 'paths' ? parseCourse : parsePath,
          signal,
        )
        if (snapshot && snapshot !== result.snapshotId)
          throw new PublicApiError(400)
        snapshot = result.snapshotId
        items.push(...result.data.map(({ id, title }) => ({ id, title })))
        cursor = result.nextCursor
        if (cursor && seen.has(cursor)) throw new PublicApiError(502)
        if (cursor) seen.add(cursor)
      } while (cursor)
      return { data: items, snapshotId: snapshot!, nextCursor: null }
    },
  )
  const [draft, setDraft] = useState(q),
    [validation, setValidation] = useState('')
  const [extra, setExtra] = useState<{
    key: string
    items: Item[]
    cursor: string | null
  }>({ key: '', items: [], cursor: null })
  const [append, setAppend] = useState<{
    key: string
    busy: boolean
    error?: PublicApiError
  }>({ key: '', busy: false })
  const appendController = useRef<AbortController | null>(null)
  useEffect(() => {
    setDraft(q)
    setValidation('')
  }, [q, kind])
  useEffect(
    () => () => {
      appendController.current?.abort()
    },
    [requestKey],
  )
  useEffect(() => {
    if (resource.value) window.dispatchEvent(new Event('learning:ready'))
  }, [resource.value])
  const activeExtra = extra.key === requestKey ? extra : undefined
  const items = [...(resource.value?.data ?? []), ...(activeExtra?.items ?? [])]
  const nextCursor = activeExtra
    ? activeExtra.cursor
    : resource.value?.nextCursor
  const appendState = append.key === requestKey ? append : undefined
  function update(values: { q?: string; filter?: string }) {
    const next = new URLSearchParams({ type: kind })
    const search = values.q ?? q,
      member = values.filter ?? filter
    if (search) next.set('q', search)
    if (member) next.set(filterKey, member)
    if (params.has('limit')) next.set('limit', params.get('limit')!)
    setParams(next)
  }
  function submit(event: FormEvent) {
    event.preventDefault()
    if ([...draft.trim()].length > 100 || hasControlCharacters(draft)) {
      setValidation('Gunakan hingga 100 karakter tanpa karakter kontrol.')
      return
    }
    setValidation('')
    update({ q: draft.trim() })
  }
  async function loadMore() {
    if (!nextCursor || appendState?.busy) return
    const controller = new AbortController()
    appendController.current = controller
    setAppend({ key: requestKey, busy: true })
    try {
      const next = new URLSearchParams(query)
      next.set('cursor', nextCursor)
      const result = await publicList<Item>(
        `/catalog/${kind}?${next}`,
        parse,
        controller.signal,
      )
      if (controller.signal.aborted) return
      if (result.snapshotId !== resource.value?.snapshotId)
        throw new PublicApiError(400)
      const ids = new Set(items.map((item) => item.id))
      if (
        result.data.some((item) => ids.has(item.id)) ||
        result.nextCursor === nextCursor
      )
        throw new PublicApiError(502)
      setExtra({
        key: requestKey,
        items: [...(activeExtra?.items ?? []), ...result.data],
        cursor: result.nextCursor,
      })
      setAppend({ key: requestKey, busy: false })
    } catch (error) {
      if (!controller.signal.aborted)
        setAppend({
          key: requestKey,
          busy: false,
          error:
            error instanceof PublicApiError ? error : new PublicApiError(0),
        })
    }
  }
  function reset() {
    setExtra({ key: '', items: [], cursor: null })
    if (invalid || resource.error?.status === 400) setParams({ type: kind })
    else resource.retry()
  }
  const filterTitle = options.value?.data.find(
    (option) => option.id === filter,
  )?.title
  return (
    <div className="page catalog-page">
      <PageTitle title="Katalog belajar" />
      <section className="catalog-hero" aria-labelledby="catalog-title">
        <div className="hero-copy">
          <h1 id="catalog-title">
            Mulai dengan
            <br />
            <span>rasa ingin tahu.</span>
          </h1>
          <p>
            Temukan jalur belajar AI, buka materi gratis, dan beri ruang untuk
            mencoba.
          </p>
          <div className="hero-footnote">
            <span className="mini-book">
              <Icon name="book" size={17} />
            </span>
            Belajar tanpa akun. Selangkah demi selangkah.
          </div>
        </div>
        <div className="learning-note" aria-hidden="true">
          <span className="note-clip" />
          <div className="note-line">
            <Icon name="route" size={24} />
            <span>Temukan arah.</span>
          </div>
          <div className="note-line">
            <Icon name="book" size={24} />
            <span>Pahami idenya.</span>
          </div>
          <div className="note-line note-line--lime">
            <Icon name="arrow" size={24} />
            <span>Coba sendiri.</span>
          </div>
          <span className="note-caption">
            Satu pertanyaan, banyak kemungkinan.
          </span>
        </div>
      </section>
      <section className="catalog-section" aria-labelledby="collection-title">
        <div className="collection-heading">
          <h2 id="collection-title">Pilih langkah pertamamu</h2>
          <span className="collection-description">
            Materi untuk dijelajahi
          </span>
        </div>
        <nav className="type-nav" aria-label="Jenis katalog">
          <Link
            to={`?${new URLSearchParams({ type: 'paths', ...(q ? { q } : {}) })}`}
            aria-current={kind === 'paths' ? 'page' : undefined}
          >
            <Icon name="route" />
            Learning Path
          </Link>
          <Link
            to={`?${new URLSearchParams({ type: 'courses', ...(q ? { q } : {}) })}`}
            aria-current={kind === 'courses' ? 'page' : undefined}
          >
            <Icon name="book" />
            Course
          </Link>
        </nav>
        <form
          className="catalog-form"
          onSubmit={submit}
          role="search"
          aria-label="Cari materi"
        >
          <div className="field search-field">
            <label htmlFor="catalog-search">Cari judul atau ringkasan</label>
            <div className="search-input">
              <Icon name="search" />
              <input
                id="catalog-search"
                type="search"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Apa yang ingin kamu pelajari?"
                aria-invalid={!!validation}
                aria-describedby={validation ? 'search-error' : undefined}
              />
              <button className="button button--primary" type="submit">
                Cari
                <Icon name="arrow" size={18} />
              </button>
            </div>
            {validation && (
              <p className="field-error" id="search-error" role="alert">
                {validation}
              </p>
            )}
          </div>
          <div className="field filter-field">
            <label htmlFor="membership-filter">
              {kind === 'paths' ? 'Memuat course' : 'Dalam learning path'}
            </label>
            <select
              id="membership-filter"
              value={filter}
              disabled={!options.value}
              onChange={(e) => update({ filter: e.target.value })}
              aria-describedby={options.error ? 'filter-error' : undefined}
            >
              <option value="">
                {options.loading
                  ? 'Memuat pilihan…'
                  : options.error
                    ? 'Pilihan belum tersedia'
                    : 'Semua materi'}
              </option>
              {filter && !filterTitle && (
                <option value={filter}>Filter aktif</option>
              )}
              {options.value?.data.map((option) => (
                <option value={option.id} key={option.id}>
                  {option.title}
                </option>
              ))}
            </select>
            {options.error && (
              <p id="filter-error" className="field-error">
                Filter belum bisa dimuat.{' '}
                <button
                  type="button"
                  className="inline-button"
                  onClick={options.retry}
                >
                  Coba lagi
                </button>
              </p>
            )}
          </div>
        </form>
        {(q || filter) && (
          <div className="active-filters">
            <Badge tone="lime">Pencarian aktif</Badge>
            <button
              className="text-button"
              onClick={() => {
                setDraft('')
                update({ q: '', filter: '' })
              }}
            >
              Hapus pencarian dan filter
              <Icon name="close" size={16} />
            </button>
          </div>
        )}
        {resource.loading ? (
          <Loading cards label="Memuat katalog…" />
        ) : resource.error ? (
          <ErrorState error={resource.error} retry={reset} />
        ) : (
          <>
            <p className="results-status" role="status">
              {items.length
                ? `${items.length} ${kind === 'paths' ? 'learning path' : 'course'} ditampilkan`
                : q || filter
                  ? 'Tidak ada hasil yang cocok'
                  : 'Belum ada materi tersedia'}
            </p>
            {!items.length ? (
              <EmptyState
                title={
                  q || filter
                    ? 'Belum menemukan yang cocok?'
                    : 'Materi sedang disiapkan'
                }
                action={
                  q || filter ? (
                    <button
                      className="button button--secondary"
                      onClick={() => update({ q: '', filter: '' })}
                    >
                      Hapus filter
                      <Icon name="arrow" />
                    </button>
                  ) : undefined
                }
              >
                {q || filter
                  ? 'Coba kata lain atau jelajahi semua materi.'
                  : 'Kembali lagi nanti untuk menjelajahi materi yang tersedia.'}
              </EmptyState>
            ) : (
              <div className="card-grid">
                {items.map((item) =>
                  'courseCount' in item ? (
                    <PathCard key={item.id} path={item} />
                  ) : (
                    <CourseCard key={item.id} course={item} />
                  ),
                )}
              </div>
            )}
            {appendState?.error && (
              <ErrorState
                compact
                error={appendState.error}
                retry={appendState.error.status === 400 ? reset : loadMore}
              />
            )}
            {nextCursor && (
              <div className="pagination">
                <button
                  className="button button--secondary"
                  onClick={loadMore}
                  disabled={appendState?.busy}
                >
                  {appendState?.busy ? 'Memuat materi…' : 'Muat lagi'}
                  <Icon name="arrow" />
                </button>
                <span role="status" className="sr-only">
                  {appendState?.busy ? 'Memuat halaman berikutnya' : ''}
                </span>
              </div>
            )}
          </>
        )}
      </section>
      <aside className="catalog-bottom-note">
        <Icon name="info" />
        <p>
          <strong>Mulai dengan membaca.</strong> Lesson gratis bisa dibuka
          langsung. Latihan lokal tidak menghasilkan nilai atau kelulusan resmi.
        </p>
      </aside>
    </div>
  )
}
