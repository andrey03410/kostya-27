import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import EasterEgg from './EasterEgg'

function type(text) {
  for (const ch of text) {
    fireEvent.keyDown(window, { key: ch })
  }
}

describe('EasterEgg', () => {
  it('по умолчанию ничего не показывает', () => {
    render(<EasterEgg />)
    expect(screen.queryByTestId('easter-egg')).not.toBeInTheDocument()
  })

  it('срабатывает на набор "misaka"', () => {
    render(<EasterEgg />)
    type('misaka')
    expect(screen.getByTestId('easter-egg')).toBeInTheDocument()
  })

  it('игнорирует посторонние символы между нужными', () => {
    render(<EasterEgg />)
    type('mixsaka') // лишняя x сбивает последовательность
    expect(screen.queryByTestId('easter-egg')).not.toBeInTheDocument()
    type('misaka')
    expect(screen.getByTestId('easter-egg')).toBeInTheDocument()
  })
})
