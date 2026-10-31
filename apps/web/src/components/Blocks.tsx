import { useId, useState } from 'react'
import Markdown from 'react-markdown'
import { apiBaseUrl, safeMediaPath, type PublicBlock } from '../lib/api/public'
import { Badge, Icon } from './ui'

export function safeLink(url: string): string {
  if (
    !url ||
    [...url].some(
      (character) =>
        character.charCodeAt(0) <= 32 || character.charCodeAt(0) === 127,
    ) ||
    url.includes('\\') ||
    url.startsWith('//')
  )
    return ''
  if (url.startsWith('#') || /^\/(?!\/)/.test(url)) return url
  try {
    const value = new URL(url)
    return ['https:', 'http:', 'mailto:'].includes(value.protocol) &&
      !value.username &&
      !value.password
      ? url
      : ''
  } catch {
    return ''
  }
}
export function SafeMarkdown({ markdown }: { markdown: string }) {
  return (
    <div className="prose">
      <Markdown
        skipHtml
        urlTransform={safeLink}
        allowedElements={[
          'p',
          'strong',
          'em',
          'a',
          'ul',
          'ol',
          'li',
          'blockquote',
          'h1',
          'h2',
          'h3',
          'h4',
          'h5',
          'h6',
          'pre',
          'code',
          'hr',
          'br',
        ]}
        components={{
          h1: ({ children }) => <h2>{children}</h2>,
          h2: ({ children }) => <h3>{children}</h3>,
          h3: ({ children }) => <h4>{children}</h4>,
          h4: ({ children }) => <h5>{children}</h5>,
          h5: ({ children }) => <h6>{children}</h6>,
          h6: ({ children }) => <h6>{children}</h6>,
          a: ({ children, href }) =>
            href ? <a href={href}>{children}</a> : <span>{children}</span>,
          pre: ({ children }) => (
            <pre tabIndex={0} aria-label="Contoh kode">
              {children}
            </pre>
          ),
        }}
      >
        {markdown}
      </Markdown>
    </div>
  )
}
export function Flashcard({ front, back }: { front: string; back: string }) {
  const [expanded, setExpanded] = useState(false),
    id = useId()
  return (
    <section className="flashcard" aria-labelledby={`${id}-title`}>
      <div className="flashcard-header">
        <Badge tone="peach">Latihan lokal</Badge>
        <Icon name="book" size={24} />
      </div>
      <h2 id={`${id}-title`}>Pikirkan sebentar.</h2>
      <p className="flashcard-front">{front}</p>
      <button
        className="button button--secondary"
        aria-expanded={expanded}
        aria-controls={`${id}-back`}
        onClick={() => setExpanded((value) => !value)}
      >
        {expanded ? 'Sembunyikan penjelasan' : 'Lihat penjelasan'}
        <Icon name={expanded ? 'close' : 'arrow'} size={18} />
      </button>
      <div className="flashcard-back" id={`${id}-back`} hidden={!expanded}>
        <h3>Penjelasan</h3>
        <p>{back}</p>
      </div>
      <p className="practice-note">
        Latihan ini tidak menghasilkan nilai atau kelulusan resmi.
      </p>
    </section>
  )
}
function Media({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false),
    [attempt, setAttempt] = useState(0)
  if (!safeMediaPath(src)) return <Unavailable />
  return (
    <figure className="lesson-media">
      {failed ? (
        <div className="media-fallback" role="status">
          <Icon name="info" />
          <p>Gambar belum bisa dimuat.</p>
          <p>{alt}</p>
          <button
            className="button button--secondary"
            onClick={() => {
              setFailed(false)
              setAttempt((n) => n + 1)
            }}
          >
            Coba muat gambar lagi
          </button>
        </div>
      ) : (
        <img
          key={attempt}
          src={new URL(src, apiBaseUrl).href}
          alt={alt}
          onError={() => setFailed(true)}
          loading="lazy"
        />
      )}
    </figure>
  )
}
function Unavailable() {
  return (
    <div className="block-unavailable" role="status">
      <Icon name="info" />
      <p>Bagian materi ini belum tersedia. Bagian lain tetap dapat dibaca.</p>
    </div>
  )
}
export function Block({ block }: { block: PublicBlock }) {
  switch (block.type) {
    case 'richText':
      return <SafeMarkdown markdown={block.payload.markdown} />
    case 'code':
      return (
        <div className="code-block">
          <div className="code-caption">
            <span>Contoh kode</span>
            <span>{block.payload.language}</span>
          </div>
          <pre tabIndex={0} aria-label="Contoh kode, hanya untuk dibaca">
            <code>{block.payload.text}</code>
          </pre>
        </div>
      )
    case 'callout':
      return (
        <aside className="callout">
          <Icon name="info" />
          <p>{block.payload.text}</p>
        </aside>
      )
    case 'flashcard':
      return <Flashcard front={block.payload.front} back={block.payload.back} />
    case 'media':
      return <Media src={block.payload.src} alt={block.payload.alt} />
    default:
      return <Unavailable />
  }
}
