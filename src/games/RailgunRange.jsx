import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { scoreShot, markerSpeed, totalRounds, isRangeOver } from '../lib/railgun'
import { useAppStore } from '../store/useAppStore'
import { useSound } from '../hooks/useSound'
import Button from '../components/Button'
import Coin from '../components/Coin'

const TOTAL = totalRounds()

// Треугольная волна 0..1 для пинг-понг движения маркера.
function triangle(phase) {
  const m = ((phase % 2) + 2) % 2
  return m < 1 ? m : 2 - m
}

export default function RailgunRange() {
  const [round, setRound] = useState(0)
  const [points, setPoints] = useState(0)
  const [result, setResult] = useState(null) // {points,label} последнего выстрела
  const [finished, setFinished] = useState(false)
  const markerRef = useRef(null)
  const posRef = useRef(0.5)
  const phaseRef = useRef(0)
  const pausedRef = useRef(false)

  const submitScore = useAppStore((s) => s.submitScore)
  const best = useAppStore((s) => s.bestScores.railgun)
  const { sfx } = useSound()

  // Анимация маркера
  useEffect(() => {
    if (finished) return
    let raf = 0
    let last = 0
    const speed = markerSpeed(round)
    const loop = (ts) => {
      const dt = last ? (ts - last) / 1000 : 0.016
      last = ts
      if (!pausedRef.current) {
        phaseRef.current += speed * dt
        posRef.current = triangle(phaseRef.current)
        if (markerRef.current) {
          markerRef.current.style.left = `${posRef.current * 100}%`
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [round, finished])

  const fire = useCallback(() => {
    if (finished || pausedRef.current) return
    pausedRef.current = true
    const shot = scoreShot(posRef.current)
    sfx(shot.points >= 60 ? 'zap' : 'fail')
    setResult(shot)
    const newPoints = points + shot.points
    setPoints(newPoints)

    setTimeout(() => {
      const nextRound = round + 1
      if (isRangeOver(nextRound)) {
        setFinished(true)
        submitScore('railgun', newPoints)
      } else {
        setRound(nextRound)
        phaseRef.current = 0
        pausedRef.current = false
        setResult(null)
      }
    }, 750)
  }, [finished, points, round, sfx, submitScore])

  // Управление: пробел / Enter
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        fire()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [fire])

  function restart() {
    setRound(0)
    setPoints(0)
    setResult(null)
    setFinished(false)
    phaseRef.current = 0
    posRef.current = 0.5
    pausedRef.current = false
  }

  if (finished) {
    return (
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-2 text-5xl font-display font-bold text-glow"
        >
          {points}
        </motion.div>
        <p className="mb-1 text-lg text-rg-cyan">очков</p>
        <p className="mb-6 text-sm text-white/60">Рекорд: {best}</p>
        <Button onClick={restart}>Ещё выстрел!</Button>
      </div>
    )
  }

  return (
    <div className="text-center">
      <div className="mb-4 flex justify-between text-sm text-white/70">
        <span>Раунд {round + 1} / {TOTAL}</span>
        <span className="text-rg-cyan">Очки: {points}</span>
      </div>

      {/* Шкала прицеливания */}
      <div className="relative mx-auto mb-6 h-16 max-w-lg rounded-full border border-rg-cyan/40 bg-rg-bg/60">
        {/* центральная «идеальная» зона */}
        <div className="absolute left-1/2 top-0 h-full w-[8%] -translate-x-1/2 rounded-full bg-rg-cyan/20" />
        <div className="absolute left-1/2 top-0 h-full w-[1px] -translate-x-1/2 bg-rg-cyan" />
        {/* маркер-монетка */}
        <div
          ref={markerRef}
          className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ left: '50%' }}
        >
          <motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>
            <Coin size={44} />
          </motion.div>
        </div>
      </div>

      <div className="relative mb-4 h-8">
        <AnimatePresence>
          {result && (
            <motion.div
              key={round}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-xl font-display font-bold text-rg-cyan text-glow"
            >
              {result.label} +{result.points}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Button onClick={fire} className="w-48">
        🔫 Выстрел!
      </Button>
      <p className="mt-3 text-xs text-white/40">или нажми пробел</p>
    </div>
  )
}
