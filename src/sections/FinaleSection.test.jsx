import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FinaleSection from './FinaleSection'
import { BIRTHDAY, FINALE_MESSAGE } from '../data/messages'
import { useAppStore } from '../store/useAppStore'

beforeEach(() => {
  useAppStore.setState({ finaleCompleted: false })
})

describe('FinaleSection', () => {
  it('рендерит торт с 27 свечами', () => {
    render(<FinaleSection />)
    expect(screen.getAllByRole('button', { name: /задуть свечу/i })).toHaveLength(
      BIRTHDAY.age,
    )
  })

  it('кнопка «задуть все» открывает финальное сообщение и отмечает прохождение', async () => {
    render(<FinaleSection />)
    fireEvent.click(screen.getByRole('button', { name: /задуть все свечи/i }))
    const lastLine = FINALE_MESSAGE[FINALE_MESSAGE.length - 1]
    expect(await screen.findByText(lastLine)).toBeInTheDocument()
    expect(useAppStore.getState().finaleCompleted).toBe(true)
  })
})
