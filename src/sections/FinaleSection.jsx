import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import confetti from 'canvas-confetti'
import Cake from '../components/Cake'
import Dango from '../components/Dango'
import Button from '../components/Button'
import { FINALE_MESSAGE, BIRTHDAY } from '../data/messages'
import { useAppStore } from '../store/useAppStore'
import { useSound } from '../hooks/useSound'

const PARADE = ['pink', 'green', 'yellow', 'white', 'brown', 'pink', 'green']

// canvas-confetti требует рабочий 2d-контекст. В средах без него (jsdom-тесты)
// пропускаем салют, иначе библиотека асинхронно упадёт в rAF.
function canvasSupported() {
  try {
    return !!document.createElement('canvas').getContext('2d')
  } catch {
    return false
  }
}

function fireConfetti() {
  if (!canvasSupported()) return
  try {
    const burst = (opts) => confetti({ particleCount: 80, spread: 70, ...opts })
    burst({ origin: { x: 0.2, y: 0.7 } })
    burst({ origin: { x: 0.8, y: 0.7 } })
    setTimeout(() => burst({ origin: { x: 0.5, y: 0.6 }, particleCount: 120 }), 250)
  } catch {
    /* нет canvas — пропускаем */
  }
}

export default function FinaleSection() {
  const [candles, setCandles] = useState(() => Array(BIRTHDAY.age).fill(true))
  const completeFinale = useAppStore((s) => s.completeFinale)
  const { sfx } = useSound()
  const celebratedRef = useRef(false)

  const allBlown = candles.every((c) => !c)

  function blow(index) {
    setCandles((prev) => {
      if (!prev[index]) return prev
      const next = [...prev]
      next[index] = false
      return next
    })
    sfx('pop')
  }

  function blowAll() {
    setCandles((prev) => prev.map(() => false))
  }

  // Празднуем один раз, когда все свечи задуты
  useEffect(() => {
    if (allBlown && !celebratedRef.current) {
      celebratedRef.current = true
      completeFinale()
      sfx('success')
      fireConfetti()
    }
  }, [allBlown, completeFinale, sfx])

  const litCount = candles.filter(Boolean).length

  return (
    <div className="theme-clannad mx-auto flex w-full max-w-3xl flex-col items-center px-6 py-24 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-3 text-4xl font-display font-bold text-cl-sakura sm:text-5xl"
      >
        Загадай желание 🌸
      </motion.h2>
      <p className="mb-10 text-rg-white/70">
        {litCount > 0
          ? `Задуй все свечи — осталось ${litCount}`
          : 'С Днём Рождения! 🎉'}
      </p>

      <Cake candles={candles} onBlow={blow} />

      {!allBlown && (
        <Button variant="warm" onClick={blowAll} className="mt-8">
          🎂 Задуть все свечи
        </Button>
      )}

      {/* Финальное сообщение + парад данго */}
      <AnimatePresence>
        {allBlown && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col items-center gap-4"
          >
            {FINALE_MESSAGE.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.4 }}
                className={
                  i === FINALE_MESSAGE.length - 1
                    ? 'text-2xl font-display font-bold text-cl-sakura'
                    : 'text-lg text-rg-white/80'
                }
              >
                {line}
              </motion.p>
            ))}

            <div className="mt-6 flex items-end gap-1 overflow-hidden">
              {PARADE.map((color, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -14, 0] }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: 'easeInOut',
                  }}
                >
                  <Dango color={color} size={44} />
                </motion.div>
              ))}
            </div>

            <Button variant="warm" className="mt-8" onClick={fireConfetti}>
              🎉 Ещё салют!
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
