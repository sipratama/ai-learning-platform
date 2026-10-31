import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { App } from './App'

describe('App', () => {
  it('renders a clearly labeled bootstrap page with a main landmark', () => {
    render(<App />)
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'AI Learning Platform' })).toBeInTheDocument()
    expect(screen.getByText(/development placeholder/i)).toBeInTheDocument()
  })
})
