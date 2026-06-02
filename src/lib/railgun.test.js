import { describe, it, expect } from 'vitest'
import { scoreShot, markerSpeed, totalRounds, isRangeOver } from './railgun'

describe('scoreShot', () => {
  it('идеальный центр даёт максимум очков', () => {
    const r = scoreShot(0.5)
    expect(r.points).toBe(100)
    expect(r.accuracy).toBeCloseTo(1, 5)
    expect(r.label).toMatch(/perfect/i)
  })

  it('края дают мало очков и низкую точность', () => {
    const r = scoreShot(0.0)
    expect(r.points).toBe(10)
    expect(r.accuracy).toBeCloseTo(0, 5)
  })

  it('точность симметрична относительно центра', () => {
    expect(scoreShot(0.4).accuracy).toBeCloseTo(scoreShot(0.6).accuracy, 5)
  })

  it('очки монотонно не растут с удалением от центра', () => {
    expect(scoreShot(0.5).points).toBeGreaterThanOrEqual(scoreShot(0.58).points)
    expect(scoreShot(0.58).points).toBeGreaterThanOrEqual(scoreShot(0.75).points)
  })
})

describe('markerSpeed', () => {
  it('растёт с раундом', () => {
    expect(markerSpeed(5)).toBeGreaterThan(markerSpeed(0))
  })
})

describe('isRangeOver', () => {
  it('заканчивается на последнем раунде', () => {
    expect(isRangeOver(totalRounds() - 1)).toBe(false)
    expect(isRangeOver(totalRounds())).toBe(true)
  })
})
