import { motion } from 'motion/react'

// Подсказка «листай вниз» с лёгкой анимацией.
export default function ScrollHint({ targetId, label = 'листай вниз' }) {
  return (
    <motion.button
      type="button"
      onClick={() =>
        targetId &&
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' })
      }
      className="flex flex-col items-center gap-1 text-sm text-rg-white/70"
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      aria-label={label}
    >
      <span>{label}</span>
      <span aria-hidden="true" className="text-xl">⌄</span>
    </motion.button>
  )
}
