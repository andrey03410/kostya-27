import { motion } from 'motion/react'

// Боковая навигация-точки. Подсвечивает активную секцию, скроллит к выбранной.
export default function ScrollNav({ sections, activeId }) {
  return (
    <nav
      aria-label="Навигация по разделам"
      className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 sm:flex"
    >
      {sections.map((s) => {
        const active = s.id === activeId
        return (
          <button
            key={s.id}
            type="button"
            aria-label={s.label}
            aria-current={active ? 'true' : undefined}
            onClick={() =>
              document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })
            }
            className="group relative flex items-center justify-end"
          >
            <span className="pointer-events-none absolute right-6 whitespace-nowrap rounded-full bg-rg-deep/80 px-2 py-1 text-xs text-rg-white opacity-0 transition-opacity group-hover:opacity-100">
              {s.label}
            </span>
            <motion.span
              className="block rounded-full border border-rg-cyan/70"
              animate={{
                width: active ? 16 : 10,
                height: active ? 16 : 10,
                backgroundColor: active
                  ? 'rgb(125,249,255)'
                  : 'rgba(125,249,255,0.15)',
              }}
            />
          </button>
        )
      })}
    </nav>
  )
}
