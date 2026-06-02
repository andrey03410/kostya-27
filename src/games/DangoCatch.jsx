import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'motion/react'
import {
  DANGO_COLORS,
  GAME_DURATION_MS,
  fallSpeed,
  spawnInterval,
  isCaught,
  catchPoints,
} from '../lib/dango'
import { clamp, formatTime } from '../lib/utils'
import { useAppStore } from '../store/useAppStore'
import { useSound } from '../hooks/useSound'
import Button from '../components/Button'
import Dango from '../components/Dango'

const CATCH_LINE = 0.84 // доля высоты, где «дно корзины»
const BASKET_HALF = 0.1 // половина ширины корзины (доля ширины поля)

export default function DangoCatch() {
  const [phase, setPhase] = useState('ready') // ready | playing | over
  const [dangos, setDangos] = useState([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_MS)
  const [catcherX, setCatcherX] = useState(0.5)

  const fieldRef = useRef(null)
  const dangosRef = useRef([])
  const catcherRef = useRef(0.5)
  const scoreRef = useRef(0)
  const idRef = useRef(0)

  const submitScore = useAppStore((s) => s.submitScore)
  const best = useAppStore((s) => s.bestScores.dango)
  const { sfx } = useSound()

  // Игровой цикл: запускается, пока phase === 'playing'.
  useEffect(() => {
    if (phase !== 'playing') return
    let raf = 0
    let startTs = 0
    let lastTs = 0
    let lastSpawn = 0

    function loop(ts) {
      const dt = clamp((ts - lastTs) / 1000, 0, 0.05)
      lastTs = ts

      const remaining = GAME_DURATION_MS - (ts - startTs)
      if (remaining <= 0) {
        setTimeLeft(0)
        setPhase('over')
        submitScore('dango', scoreRef.current)
        return
      }
      setTimeLeft(remaining)

      // спавн новых данго
      if (ts - lastSpawn >= spawnInterval(scoreRef.current)) {
        lastSpawn = ts
        idRef.current += 1
        dangosRef.current.push({
          id: idRef.current,
          x: 0.08 + Math.random() * 0.84,
          y: -0.05,
          color: DANGO_COLORS[Math.floor(Math.random() * DANGO_COLORS.length)],
        })
      }

      // движение + ловля
      const speed = fallSpeed(scoreRef.current)
      const next = []
      for (const d of dangosRef.current) {
        const y = d.y + speed * dt
        if (y >= CATCH_LINE && isCaught(d.x, catcherRef.current, BASKET_HALF)) {
          scoreRef.current += catchPoints(d.color)
          setScore(scoreRef.current)
          sfx('pop')
          continue // поймана
        }
        if (y > 1.08) continue // упала мимо
        next.push({ ...d, y })
      }
      dangosRef.current = next
      setDangos(next)

      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame((ts) => {
      startTs = ts
      lastTs = ts
      lastSpawn = ts
      loop(ts)
    })
    return () => cancelAnimationFrame(raf)
  }, [phase, submitScore, sfx])

  function start() {
    dangosRef.current = []
    scoreRef.current = 0
    catcherRef.current = 0.5
    idRef.current = 0
    setScore(0)
    setDangos([])
    setCatcherX(0.5)
    setTimeLeft(GAME_DURATION_MS)
    setPhase('playing')
  }

  // Управление корзиной — указатель/касание
  const moveTo = useCallback((clientX) => {
    const rect = fieldRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = clamp((clientX - rect.left) / rect.width, 0, 1)
    catcherRef.current = x
    setCatcherX(x)
  }, [])

  // Клавиатура
  useEffect(() => {
    if (phase !== 'playing') return
    const onKey = (e) => {
      if (e.code === 'ArrowLeft') {
        catcherRef.current = clamp(catcherRef.current - 0.06, 0, 1)
        setCatcherX(catcherRef.current)
      } else if (e.code === 'ArrowRight') {
        catcherRef.current = clamp(catcherRef.current + 0.06, 0, 1)
        setCatcherX(catcherRef.current)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase])

  return (
    <div className="text-center">
      <div className="mb-3 flex justify-between text-sm text-white/70">
        <span>🍡 Очки: <span className="text-cl-pink font-bold">{score}</span></span>
        <span>⏱ {formatTime(timeLeft)}</span>
        <span className="text-white/50">Рекорд: {best}</span>
      </div>

      <div
        ref={fieldRef}
        onPointerMove={(e) => phase === 'playing' && moveTo(e.clientX)}
        onTouchMove={(e) => phase === 'playing' && moveTo(e.touches[0].clientX)}
        className="relative mx-auto aspect-[3/4] max-h-[60vh] w-full max-w-sm touch-none overflow-hidden rounded-2xl border border-cl-pink/40 bg-gradient-to-b from-rg-bg/40 to-cl-pink/10"
      >
        {/* падающие данго */}
        {dangos.map((d) => (
          <div
            key={d.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${d.x * 100}%`, top: `${d.y * 100}%` }}
          >
            <Dango color={d.color} size={40} />
          </div>
        ))}

        {/* корзина */}
        <div
          className="absolute bottom-2 -translate-x-1/2 text-4xl"
          style={{ left: `${catcherX * 100}%` }}
          aria-hidden="true"
        >
          🧺
        </div>

        {/* оверлеи состояния */}
        {phase === 'ready' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-rg-deep/70">
            <p className="px-6 text-sm text-white/80">
              Лови падающие данго корзинкой! Двигай мышкой, пальцем или стрелками.
              Жёлтые — ценнее.
            </p>
            <Button onClick={start} variant="warm">Старт</Button>
          </div>
        )}

        {phase === 'over' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-rg-deep/80"
          >
            <div className="text-4xl font-display font-bold text-cl-pink">{score}</div>
            <p className="text-sm text-white/70">данго поймано!</p>
            <Button onClick={start} variant="warm" className="mt-2">Ещё раз</Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
