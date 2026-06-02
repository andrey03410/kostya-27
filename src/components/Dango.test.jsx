import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Dango from './Dango'

describe('Dango', () => {
  it('рендерит SVG с подписью цвета', () => {
    render(<Dango color="green" />)
    expect(screen.getByRole('img', { name: /данго green/i })).toBeInTheDocument()
  })

  it('неизвестный цвет не падает', () => {
    render(<Dango color="rainbow" />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
