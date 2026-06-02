import { describe, it, expect } from 'vitest'
import {
  buildDeck,
  isMatch,
  isDeckComplete,
  starsForMoves,
} from './memoryEngine'
import { mulberry32 } from './utils'

const PAIRS = [
  { pairId: 'a', emoji: '🅰️' },
  { pairId: 'b', emoji: '🅱️' },
  { pairId: 'c', emoji: '🇨' },
]

describe('buildDeck', () => {
  it('создаёт по две карточки на пару с уникальными id', () => {
    const deck = buildDeck(PAIRS, mulberry32(1))
    expect(deck).toHaveLength(6)
    const ids = deck.map((c) => c.id)
    expect(new Set(ids).size).toBe(6)
    const aCards = deck.filter((c) => c.pairId === 'a')
    expect(aCards).toHaveLength(2)
  })

  it('все карточки закрыты и не совпавшие в начале', () => {
    const deck = buildDeck(PAIRS, mulberry32(2))
    expect(deck.every((c) => !c.flipped && !c.matched)).toBe(true)
  })

  it('детерминирован при одинаковом seed', () => {
    const a = buildDeck(PAIRS, mulberry32(9)).map((c) => c.id)
    const b = buildDeck(PAIRS, mulberry32(9)).map((c) => c.id)
    expect(a).toEqual(b)
  })
})

describe('isMatch', () => {
  const a1 = { id: 'a-a', pairId: 'a' }
  const a2 = { id: 'a-b', pairId: 'a' }
  const b1 = { id: 'b-a', pairId: 'b' }

  it('совпадение по pairId', () => {
    expect(isMatch(a1, a2)).toBe(true)
  })
  it('разные пары не совпадают', () => {
    expect(isMatch(a1, b1)).toBe(false)
  })
  it('одна и та же карточка не совпадает сама с собой', () => {
    expect(isMatch(a1, a1)).toBe(false)
  })
  it('null безопасен', () => {
    expect(isMatch(a1, null)).toBe(false)
  })
})

describe('isDeckComplete', () => {
  it('false если не все найдены', () => {
    expect(isDeckComplete([{ matched: true }, { matched: false }])).toBe(false)
  })
  it('true когда все matched', () => {
    expect(isDeckComplete([{ matched: true }, { matched: true }])).toBe(true)
  })
  it('пустая колода — false', () => {
    expect(isDeckComplete([])).toBe(false)
  })
})

describe('starsForMoves', () => {
  it('меньше ходов = больше звёзд', () => {
    expect(starsForMoves(4, 3)).toBe(3)
    expect(starsForMoves(6, 3)).toBe(2)
    expect(starsForMoves(20, 3)).toBe(1)
  })
})
