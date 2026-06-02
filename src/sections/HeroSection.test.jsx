import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import HeroSection from './HeroSection'
import { BIRTHDAY } from '../data/messages'

describe('HeroSection', () => {
  beforeEach(() => {
    // Включаем prefers-reduced-motion → интро сразу показывает финальный кадр
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes('reduce'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
  })

  it('при reduced-motion сразу показывает имя и возраст', async () => {
    render(<HeroSection nextId="greeting" />)
    expect(await screen.findByText(`${BIRTHDAY.name}!`)).toBeInTheDocument()
    expect(screen.getByText(String(BIRTHDAY.age))).toBeInTheDocument()
  })
})
