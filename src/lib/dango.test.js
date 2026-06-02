import { describe, it, expect } from 'vitest'
import { fallSpeed, spawnInterval, isCaught, catchPoints } from './dango'

describe('fallSpeed', () => {
  it('растёт со счётом и ограничена сверху', () => {
    expect(fallSpeed(50)).toBeGreaterThan(fallSpeed(0))
    expect(fallSpeed(1000)).toBeLessThanOrEqual(1.4)
  })
})

describe('spawnInterval', () => {
  it('сокращается со счётом, но не ниже минимума', () => {
    expect(spawnInterval(50)).toBeLessThan(spawnInterval(0))
    expect(spawnInterval(10000)).toBeGreaterThanOrEqual(450)
  })
})

describe('isCaught', () => {
  it('ловит в пределах ширины корзины', () => {
    expect(isCaught(0.5, 0.5, 0.1)).toBe(true)
    expect(isCaught(0.58, 0.5, 0.1)).toBe(true)
    expect(isCaught(0.7, 0.5, 0.1)).toBe(false)
  })
})

describe('catchPoints', () => {
  it('жёлтая данго ценнее', () => {
    expect(catchPoints('yellow')).toBeGreaterThan(catchPoints('pink'))
    expect(catchPoints('white')).toBe(1)
  })
})
