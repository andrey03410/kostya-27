import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('монтируется и рендерит все секции', () => {
    const { container } = render(<App />)
    expect(container.querySelector('#hero')).toBeInTheDocument()
    expect(container.querySelector('#greeting')).toBeInTheDocument()
    expect(container.querySelector('#games')).toBeInTheDocument()
    expect(container.querySelector('#finale')).toBeInTheDocument()
  })

  it('показывает тумблер музыки', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /музык/i })).toBeInTheDocument()
  })
})
