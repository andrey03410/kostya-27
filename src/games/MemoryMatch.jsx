import { useState, useCallback } from 'react'
import { motion } from 'motion/react'
import { MEMORY_PAIRS } from '../data/memoryCards'
import {
  buildDeck,
  isMatch,
  isDeckComplete,
  starsForMoves,
} from '../lib/memoryEngine'
import { useAppStore } from '../store/useAppStore'
import { useSound } from '../hooks/useSound'
import Button from '../components/Button'

export default function MemoryMatch() {
  const [deck, setDeck] = useState(() => buildDeck(MEMORY_PAIRS))
  const [flipped, setFlipped] = useState([]) // индексы открытых, ещё не подтверждённых
  const [moves, setMoves] = useState(0)
  const [lock, setLock] = useState(false)
  const submitScore = useAppStore((s) => s.submitScore)
  const best = useAppStore((s) => s.bestScores.memory)
  const { sfx } = useSound()

  const won = isDeckComplete(deck)

  const flip = useCallback(
    (index) => {
      if (lock) return
      const card = deck[index]
      if (card.flipped || card.matched) return

      const nextDeck = deck.map((c, i) => (i === index ? { ...c, flipped: true } : c))
      const nextFlipped = [...flipped, index]
      setDeck(nextDeck)
      setFlipped(nextFlipped)
      sfx('pop')

      if (nextFlipped.length === 2) {
        setMoves((m) => m + 1)
        const [a, b] = nextFlipped
        if (isMatch(nextDeck[a], nextDeck[b])) {
          // совпало — фиксируем
          setTimeout(() => {
            setDeck((d) =>
              d.map((c, i) =>
                i === a || i === b ? { ...c, matched: true, flipped: true } : c,
              ),
            )
            setFlipped([])
            sfx('success')
            // проверим завершение на свежей колоде
            const after = nextDeck.map((c, i) =>
              i === a || i === b ? { ...c, matched: true } : c,
            )
            if (isDeckComplete(after)) {
              submitScore('memory', moves + 1)
            }
          }, 350)
        } else {
          // не совпало — закрываем обратно
          setLock(true)
          setTimeout(() => {
            setDeck((d) =>
              d.map((c, i) =>
                i === a || i === b ? { ...c, flipped: false } : c,
              ),
            )
            setFlipped([])
            setLock(false)
          }, 800)
        }
      }
    },
    [deck, flipped, lock, moves, sfx, submitScore],
  )

  function restart() {
    setDeck(buildDeck(MEMORY_PAIRS))
    setFlipped([])
    setMoves(0)
    setLock(false)
  }

  if (won) {
    const stars = starsForMoves(moves, MEMORY_PAIRS.length)
    return (
      <div className="text-center">
        <div className="mb-3 text-4xl">{'⭐'.repeat(stars)}</div>
        <p className="mb-1 text-lg text-rg-cyan">Все пары найдены за {moves} ходов!</p>
        <p className="mb-6 text-sm text-white/60">
          Лучший результат: {best === null ? '—' : `${best} ходов`}
        </p>
        <Button onClick={restart} variant="warm">
          Ещё раз
        </Button>
      </div>
    )
  }

  return (
    <div>
      <p className="mb-4 text-center text-sm text-white/60">Ходов: {moves}</p>
      <div className="mx-auto grid max-w-md grid-cols-4 gap-2 sm:gap-3">
        {deck.map((card, i) => {
          const open = card.flipped || card.matched
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => flip(i)}
              aria-label={open ? card.label : 'Закрытая карточка'}
              className="relative aspect-square"
              style={{ perspective: 600 }}
            >
              <motion.div
                className="relative h-full w-full"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{ rotateY: open ? 180 : 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* рубашка */}
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-xl border border-rg-cyan/40 bg-rg-bg text-2xl"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <span className="opacity-60">⚡</span>
                </div>
                {/* лицо */}
                <div
                  className={`absolute inset-0 flex items-center justify-center rounded-xl border text-3xl sm:text-4xl ${
                    card.matched
                      ? 'border-cl-green bg-cl-green/25'
                      : 'border-cl-pink/50 bg-white/10'
                  }`}
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  {card.emoji}
                </div>
              </motion.div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
