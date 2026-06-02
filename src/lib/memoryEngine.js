import { shuffle } from './utils'

/**
 * Строит перемешанную колоду: каждая пара превращается в две карточки
 * с уникальными id. rng можно передать для воспроизводимых тестов.
 */
export function buildDeck(pairs, rng = Math.random) {
  const cards = []
  for (const pair of pairs) {
    cards.push({ id: `${pair.pairId}-a`, ...pair })
    cards.push({ id: `${pair.pairId}-b`, ...pair })
  }
  return shuffle(cards, rng).map((card) => ({
    ...card,
    flipped: false,
    matched: false,
  }))
}

/** Две карточки образуют пару? */
export function isMatch(cardA, cardB) {
  if (!cardA || !cardB) return false
  if (cardA.id === cardB.id) return false // одна и та же карточка
  return cardA.pairId === cardB.pairId
}

/** Все ли карточки найдены. */
export function isDeckComplete(deck) {
  return deck.length > 0 && deck.every((c) => c.matched)
}

/** Звёздный рейтинг по числу ходов (чем меньше ходов, тем лучше). */
export function starsForMoves(moves, pairsCount) {
  if (moves <= pairsCount + 1) return 3
  if (moves <= pairsCount * 2) return 2
  return 1
}
