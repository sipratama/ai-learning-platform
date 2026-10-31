import { useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { PublicApiError } from '../lib/api/public'

export function Icon({
  name,
  size = 20,
}: {
  name:
    | 'arrow'
    | 'book'
    | 'route'
    | 'search'
    | 'menu'
    | 'close'
    | 'chevron'
    | 'info'
    | 'retry'
  size?: number
}) {
  const paths = {
    arrow: (
      <>
        <path d="M4 12h15M13 6l6 6-6 6" />
      </>
    ),
    book: (
      <>
        <path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1Zm0 0v15" />
      </>
    ),
    route: (
      <>
        <circle cx="5" cy="5" r="2" />
        <circle cx="19" cy="19" r="2" />
        <path d="M7 5h8a4 4 0 0 1 0 8H9a4 4 0 0 0 0 8h8" />
      </>
    ),
    search: (
      <>
        <circle cx="10" cy="10" r="6" />
        <path d="m15 15 5 5" />
      </>
    ),
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    chevron: <path d="m8 5 7 7-7 7" />,
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v6M12 7h.01" />
      </>
    ),
    retry: (
      <>
        <path d="M4 10a8 8 0 1 1 1 8M4 4v6h6" />
      </>
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'lime' | 'sky' | 'peach'
}) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}

export function Breadcrumbs({
  items,
}: {
  items: { label: string; to?: string }[]
}) {
  return (
    <nav className="breadcrumbs" aria-label="Jejak navigasi">
      <ol>
        {items.map((item, i) => (
          <li key={i}>
            {i > 0 && <Icon name="chevron" size={14} />}
            {item.to ? (
              <Link to={item.to}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function PageTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = `${title} — AI Learning`
  }, [title])
  return null
}

export function Loading({
  label = 'Memuat materi…',
  cards = false,
}: {
  label?: string
  cards?: boolean
}) {
  return (
    <div className="loading-region" aria-busy="true" aria-label={label}>
      <p role="status" className="loading-label">
        <span className="loading-dot" />
        {label}
      </p>
      <div
        className={cards ? 'card-grid' : 'skeleton-stack'}
        aria-hidden="true"
      >
        {[1, 2].map((n) => (
          <div className="skeleton-card" key={n}>
            <span />
            <span />
            <span />
          </div>
        ))}
      </div>
    </div>
  )
}

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string
  children?: ReactNode
  action?: ReactNode
}) {
  return (
    <section className="status-panel">
      <span className="status-icon">
        <Icon name="book" size={28} />
      </span>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
      {action}
    </section>
  )
}

export function ErrorState({
  error,
  retry,
  back = '/catalog',
  compact = false,
}: {
  error: PublicApiError
  retry?: () => void
  back?: string
  compact?: boolean
}) {
  const missing = error.status === 404 || error.status === 403
  const invalid = error.status === 400
  return (
    <section
      className={`status-panel status-panel--error ${compact ? 'status-panel--compact' : ''}`}
      role="alert"
    >
      <Icon name="info" size={28} />
      <h2>
        {missing
          ? 'Materi tidak tersedia'
          : invalid
            ? 'Daftar perlu dimuat ulang'
            : 'Materi belum bisa dimuat'}
      </h2>
      <p>
        {missing
          ? 'Coba pilih materi lain dari katalog.'
          : invalid
            ? 'Pencarian atau halaman daftar sudah tidak berlaku. Mulai lagi dari daftar materi.'
            : error.status === 429
              ? 'Permintaan sedang dibatasi. Silakan coba lagi beberapa saat lagi.'
              : 'Periksa koneksi Anda, lalu coba lagi.'}
      </p>
      <div className="button-row">
        {retry && !missing && (
          <button className="button button--secondary" onClick={retry}>
            <Icon name="retry" />
            {invalid ? 'Muat ulang daftar' : 'Coba lagi'}
          </button>
        )}
        {!compact && (
          <Link className="text-link" to={back}>
            Kembali ke {back === '/catalog' ? 'katalog' : 'course'}
          </Link>
        )}
      </div>
      {error.requestId && (
        <p className="request-id">ID permintaan: {error.requestId}</p>
      )}
    </section>
  )
}
