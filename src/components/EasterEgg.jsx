import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import LightningBolt from './LightningBolt'
import { useSound } from '../hooks/useSound'

const SECRET = 'misaka'

// Пасхалка: набери "misaka" — экран прошивает разряд рельсотрона.
export default function EasterEgg() {
  const [active, setActive] = useState(false)
  const bufferRef = useRef('')
  const { sfx } = useSound()

  useEffect(() => {
    const onKey = (e) => {
      if (e.key.length !== 1) return
      bufferRef.current = (bufferRef.current + e.key.toLowerCase()).slice(-SECRET.length)
      if (bufferRef.current === SECRET) {
        bufferRef.current = ''
        setActive(true)
        sfx('zap')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sfx])

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          data-testid="easter-egg"
          className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onAnimationComplete={() => setActive(false)}
        >
          <motion.div
            className="absolute inset-0 bg-rg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0] }}
            transition={{ duration: 0.6, times: [0, 0.2, 1] }}
          />
          <div className="absolute inset-x-0 top-1/3 h-48">
            <LightningBolt width={1400} height={300} segments={18} duration={0.4} seed={7} />
          </div>
          <div className="absolute inset-x-0 top-1/2 h-48">
            <LightningBolt width={1400} height={300} segments={16} duration={0.45} seed={21} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
