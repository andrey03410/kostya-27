import { motion } from 'motion/react'

// Полноэкранная модалка для мини-игры. Рендерится внутри AnimatePresence родителя.
export default function GameShell({ title, onClose, accent = 'electric', children }) {
  const ring =
    accent === 'warm' ? 'border-cl-pink/60 shadow-[0_0_40px_rgba(247,168,196,0.3)]' : 'border-rg-cyan/60 shadow-[0_0_40px_rgba(125,249,255,0.3)]'

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <motion.div
        className={`relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border bg-rg-deep/95 ${ring}`}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      >
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <h3 className="font-display text-lg text-rg-white">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть игру"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg text-white transition-colors hover:bg-white/20"
          >
            ✕
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </motion.div>
    </motion.div>
  )
}
