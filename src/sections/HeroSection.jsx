import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Coin from '../components/Coin'
import LightningBolt from '../components/LightningBolt'
import ScrollHint from '../components/ScrollHint'
import { HERO_TITLE, BIRTHDAY } from '../data/messages'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useSound } from '../hooks/useSound'

// Стадии интро: coin → bolt → reveal
export default function HeroSection({ nextId }) {
  const reduced = useReducedMotion()
  // reduced известен синхронно (useReducedMotion инициализируется лениво),
  // поэтому при уменьшенном движении сразу показываем финальный кадр интро.
  const [stage, setStage] = useState(() => (reduced ? 'reveal' : 'coin'))
  const { sfx } = useSound()

  // звуки на переходах
  useEffect(() => {
    if (stage === 'bolt') sfx('coin')
    if (stage === 'reveal') sfx('zap')
  }, [stage, sfx])

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* монетка взлетает и замирает */}
      <AnimatePresence>
        {stage === 'coin' && (
          <motion.div
            initial={{ y: 260, scale: 0.4, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1, rotateY: 720 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            onAnimationComplete={() => setStage('bolt')}
            className="absolute"
          >
            <Coin size={120} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* разряд рельсотрона поперёк экрана */}
      <AnimatePresence>
        {stage === 'bolt' && (
          <motion.div
            className="pointer-events-none absolute inset-x-0 top-1/2 h-40 -translate-y-1/2"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LightningBolt
              width={1200}
              height={240}
              segments={14}
              duration={0.45}
              onComplete={() => setStage('reveal')}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* вспышка */}
      <AnimatePresence>
        {stage === 'bolt' && (
          <motion.div
            className="pointer-events-none absolute inset-0 bg-rg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ duration: 0.5, times: [0, 0.3, 1] }}
          />
        )}
      </AnimatePresence>

      {/* раскрытие заголовка */}
      {stage === 'reveal' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-rg-white/80 sm:text-3xl"
          >
            {HERO_TITLE}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, type: 'spring', stiffness: 200, damping: 12 }}
            className="text-6xl font-display font-bold text-rg-cyan text-glow sm:text-8xl"
          >
            {BIRTHDAY.name}!
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: 'spring', stiffness: 260, damping: 14 }}
            className="mt-2 flex items-center gap-3 rounded-full border border-rg-cyan/50 bg-rg-blue/15 px-6 py-2 backdrop-blur-sm"
          >
            <span className="text-3xl font-display font-bold text-rg-white">
              {BIRTHDAY.age}
            </span>
            <span className="text-rg-white/70">лет ⚡</span>
          </motion.div>
        </motion.div>
      )}

      {/* подсказка прокрутки */}
      {stage === 'reveal' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-10"
        >
          <ScrollHint targetId={nextId} />
        </motion.div>
      )}
    </div>
  )
}
