import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import GamesSection from './GamesSection'
import { useAppStore } from '../store/useAppStore'

beforeEach(() => {
  useAppStore.setState({
    bestScores: { railgun: 0, dango: 0, memory: null, quiz: 0 },
  })
})

describe('GamesSection', () => {
  it('показывает заголовок и четыре игры', () => {
    render(<GamesSection />)
    expect(screen.getByText(/активности/i)).toBeInTheDocument()
    expect(screen.getByText('Рельсотрон-тир')).toBeInTheDocument()
    expect(screen.getByText('Лови данго')).toBeInTheDocument()
    expect(screen.getByText('Найди пару')).toBeInTheDocument()
    expect(screen.getByText('Аниме-квиз')).toBeInTheDocument()
  })

  it('открывает модалку игры по клику на карточку', () => {
    render(<GamesSection />)
    fireEvent.click(screen.getByText('Аниме-квиз'))
    expect(screen.getByRole('dialog', { name: 'Аниме-квиз' })).toBeInTheDocument()
  })
})
