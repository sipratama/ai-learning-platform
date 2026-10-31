import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { Shell } from './Shell'

const showModal = Object.getOwnPropertyDescriptor(
  HTMLDialogElement.prototype,
  'showModal',
)

beforeEach(() => {
  vi.stubGlobal('scrollTo', vi.fn())
  // jsdom has no native dialog implementation. Browser E2E checks its behavior;
  // this test controls the gap before the queued close event reaches React.
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.open = true
    },
  })
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  if (showModal)
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', showModal)
  else Reflect.deleteProperty(HTMLDialogElement.prototype, 'showModal')
})

it('does not steal a new focus target when the native close event arrives later', () => {
  render(
    <MemoryRouter initialEntries={['/catalog']}>
      <Routes>
        <Route element={<Shell />}>
          <Route path="/catalog" element={<input aria-label="Search" />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
  const menu = screen.getByRole('button', { name: 'Menu' })
  menu.focus()
  fireEvent.click(menu)
  const dialog = screen.getByRole('dialog') as HTMLDialogElement
  const search = screen.getByRole('textbox', { name: 'Search' })

  // Native close removes open and restores the opener before dispatching close.
  dialog.open = false
  menu.focus()
  search.focus()
  fireEvent(dialog, new Event('close'))

  expect(menu).toHaveAttribute('aria-expanded', 'false')
  expect(search).toHaveFocus()
})
