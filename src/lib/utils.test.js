import { describe, it, expect } from 'vitest'
import { clamp, lerp, mulberry32, shuffle, formatTime, pick } from './utils'

describe('clamp', () => {
  it('ограничивает снизу и сверху', () => {
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(-3, 0, 10)).toBe(0)
    expect(clamp(42, 0, 10)).toBe(10)
  })
})

describe('lerp', () => {
  it('интерполирует концы и середину', () => {
    expect(lerp(0, 10, 0)).toBe(0)
    expect(lerp(0, 10, 1)).toBe(10)
    expect(lerp(0, 10, 0.5)).toBe(5)
  })
})

describe('shuffle', () => {
  it('не мутирует исходный массив и сохраняет элементы', () => {
    const src = [1, 2, 3, 4, 5]
    const out = shuffle(src, mulberry32(123))
    expect(src).toEqual([1, 2, 3, 4, 5])
    expect(out).toHaveLength(5)
    expect([...out].sort()).toEqual([1, 2, 3, 4, 5])
  })

  it('детерминирован при одинаковом seed', () => {
    const a = shuffle([1, 2, 3, 4, 5, 6], mulberry32(7))
    const b = shuffle([1, 2, 3, 4, 5, 6], mulberry32(7))
    expect(a).toEqual(b)
  })
})

describe('formatTime', () => {
  it('форматирует мс в м:сс', () => {
    expect(formatTime(0)).toBe('0:00')
    expect(formatTime(5000)).toBe('0:05')
    expect(formatTime(65000)).toBe('1:05')
    expect(formatTime(-100)).toBe('0:00')
  })
})

describe('pick', () => {
  it('возвращает элемент массива', () => {
    const arr = ['a', 'b', 'c']
    expect(arr).toContain(pick(arr, mulberry32(1)))
  })
})
