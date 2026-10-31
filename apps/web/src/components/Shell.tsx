import { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation, useNavigationType } from 'react-router-dom'
import { Icon } from './ui'

function Brand() {
  return (
    <Link className="brand" to="/catalog" aria-label="AI Learning, katalog">
      <span className="brand-mark">
        <Icon name="book" size={24} />
      </span>
      <span>
        AI<span className="brand-light">Learning</span>
      </span>
    </Link>
  )
}

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname, search } = useLocation()
  const type =
    new URLSearchParams(search).get('type') === 'courses' ? 'courses' : 'paths'
  return (
    <nav aria-label="Navigasi utama" className="primary-nav">
      <Link
        to="/catalog?type=paths"
        onClick={onNavigate}
        aria-current={
          pathname === '/catalog' && type === 'paths' ? 'page' : undefined
        }
      >
        <Icon name="route" />
        Learning Path
        <Icon name="arrow" size={16} />
      </Link>
      <Link
        to="/catalog?type=courses"
        onClick={onNavigate}
        aria-current={
          pathname === '/catalog' && type === 'courses' ? 'page' : undefined
        }
      >
        <Icon name="book" />
        Course
        <Icon name="arrow" size={16} />
      </Link>
    </nav>
  )
}

const scrollPositions = new Map<string, number>()
export function Shell() {
  const location = useLocation(),
    navigationType = useNavigationType()
  const main = useRef<HTMLElement>(null),
    dialog = useRef<HTMLDialogElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastPath = useRef('')
  useEffect(() => {
    const key = location.key
    const restore = () => {
      const y = navigationType === 'POP' ? (scrollPositions.get(key) ?? 0) : 0
      window.scrollTo({ top: y, behavior: 'instant' })
    }
    const pathChanged = lastPath.current !== location.pathname
    if (pathChanged) {
      if (lastPath.current) main.current?.focus({ preventScroll: true })
      restore()
      lastPath.current = location.pathname
    }
    // Reapply restoration once asynchronous content has arrived.
    if (pathChanged)
      window.addEventListener('learning:ready', restore, { once: true })
    return () => {
      scrollPositions.set(key, window.scrollY)
      window.removeEventListener('learning:ready', restore)
    }
  }, [location.key, location.pathname, navigationType])

  const closeForNavigation = () => {
    dialog.current?.close()
    // A menu selection moves into content, including query-only Catalog routes.
    main.current?.focus({ preventScroll: true })
  }
  return (
    <div className="app-shell">
      <a href="#main" className="skip-link">
        Lewati ke konten utama
      </a>
      <aside className="desktop-sidebar">
        <Brand />
        <div className="sidebar-section">
          <p className="nav-label">Jelajahi materi</p>
          <Navigation />
        </div>
        <div className="sidebar-note">
          <span className="note-tab" aria-hidden="true" />
          <Icon name="info" />
          <p>
            Ruang untuk
            <br />
            <strong>rasa ingin tahu.</strong>
          </p>
          <p>Temukan materi, buka lesson gratis, dan coba latihan lokal.</p>
        </div>
        <div className="guest-note">
          <span className="guest-dot" />
          Anda belajar sebagai Guest
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="mobile-brand">
            <Brand />
          </div>
          <div className="desktop-topbar-label">Ruang belajar terbuka</div>
          <span className="topbar-note">Baca materi gratis tanpa akun</span>
          <button
            className="button button--secondary menu-trigger"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            onClick={() => {
              dialog.current?.showModal()
              setMenuOpen(true)
            }}
          >
            <Icon name="menu" />
            Menu
          </button>
        </header>
        <main id="main" ref={main} tabIndex={-1}>
          <Outlet />
        </main>
        <footer className="site-footer">
          <span>AI Learning</span>
          <span>Belajar dimulai dari satu pertanyaan.</span>
          <Link to="/catalog">
            Kembali ke katalog <Icon name="arrow" size={16} />
          </Link>
        </footer>
      </div>
      <dialog
        ref={dialog}
        className="mobile-menu"
        aria-labelledby="menu-title"
        onClose={() => {
          // Native dialog already restored focus before this queued event.
          setMenuOpen(false)
        }}
      >
        <div className="drawer-heading">
          <h2 id="menu-title">Jelajahi AI Learning</h2>
          <button
            className="button button--icon"
            aria-label="Tutup menu"
            onClick={() => dialog.current?.close()}
          >
            <Icon name="close" />
          </button>
        </div>
        <Navigation onNavigate={closeForNavigation} />
        <p className="muted">Buka materi gratis tanpa membuat akun.</p>
      </dialog>
    </div>
  )
}
