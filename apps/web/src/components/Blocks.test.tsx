import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Block, Flashcard, SafeMarkdown } from './Blocks'
import { parseBlock } from '../lib/api/public'

afterEach(cleanup)
describe('safe public Blocks', () => {
  it('does not execute HTML or activate unsafe Markdown links or images', () => {
    const { container } = render(
      <SafeMarkdown
        markdown={
          '# Heading\n\n<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>\n\n[unsafe](javascript:alert(1)) [encoded](java&#x73;cript:alert(1)) ![remote](https://example.test/image.png)\n\n[safe](https://example.test)'
        }
      />,
    )
    expect(
      screen.getByRole('heading', { level: 2, name: 'Heading' }),
    ).toBeInTheDocument()
    expect(
      container.querySelector('script,img,[onerror],[href^="javascript:"]'),
    ).toBeNull()
    expect(screen.getByRole('link', { name: 'safe' })).toHaveAttribute(
      'href',
      'https://example.test',
    )
  })
  it.each([
    'javascript:alert(1)',
    '//private.test/x',
    '/assets/fixture/../private.svg',
    '/assets/fixture/x.svg?token=x',
    'https://private.test/x',
    '/assets/fixture/%2e%2e/private.svg',
  ])('never requests an unsafe media source %s', (src) => {
    const block = parseBlock({
      id: 'media',
      position: 1,
      type: 'media',
      payload: { src, alt: 'Unsafe image' },
    })
    const { container } = render(<Block block={block} />)
    expect(container.querySelector('img')).toBeNull()
    expect(
      screen.getByText(/Bagian materi ini belum tersedia/),
    ).toBeInTheDocument()
  })
  it('toggles disclosure semantically without creating any persisted proof', () => {
    render(<Flashcard front="A question" back="Authored explanation" />)
    const button = screen.getByRole('button', { name: 'Lihat penjelasan' })
    const back = document.getElementById(button.getAttribute('aria-controls')!)!
    expect(back).not.toBeVisible()
    fireEvent.click(button)
    expect(back).toBeVisible()
    fireEvent.click(button)
    expect(back).not.toBeVisible()
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })
})
