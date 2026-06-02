import { motion } from 'motion/react'

// Тематическая кнопка. variant: 'electric' (Railgun) | 'warm' (Clannad) | 'ghost'.
const VARIANTS = {
  electric:
    'bg-rg-blue/20 border-rg-cyan text-rg-white hover:bg-rg-blue/40 shadow-[0_0_20px_rgba(125,249,255,0.35)]',
  warm: 'bg-cl-pink/30 border-cl-pink text-cl-ink hover:bg-cl-pink/50',
  ghost: 'bg-white/5 border-white/30 text-white hover:bg-white/15',
}

export default function Button({
  children,
  variant = 'electric',
  className = '',
  ...props
}) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`rounded-full border px-6 py-3 font-display font-semibold tracking-wide backdrop-blur-sm transition-colors ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
