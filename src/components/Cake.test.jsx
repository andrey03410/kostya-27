import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Cake from './Cake'

describe('Cake', () => {
  it('рендерит по свече на каждый элемент массива', () => {
    render(<Cake candles={[true, true, true]} onBlow={() => {}} />)
    expect(screen.getAllByRole('button', { name: /задуть свечу/i })).toHaveLength(3)
  })

  it('задутая свеча меняет подпись', () => {
    render(<Cake candles={[true, false]} onBlow={() => {}} />)
    expect(screen.getByRole('button', { name: /свеча задута/i })).toBeInTheDocument()
  })

  it('клик по свече вызывает onBlow с индексом', () => {
    const onBlow = vi.fn()
    render(<Cake candles={[true, true]} onBlow={onBlow} />)
    fireEvent.click(screen.getAllByRole('button', { name: /задуть свечу/i })[1])
    expect(onBlow).toHaveBeenCalledWith(1)
  })
})
