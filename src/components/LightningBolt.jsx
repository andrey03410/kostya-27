import { useMemo } from 'react'
import { motion } from 'motion/react'

/** Генерирует ломаную «молнию» от левого края к правому (детерминированно по seed). */
function buildBoltPath(width, height, segments, seed) {
  let s = seed
  const rng = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  const midY = height / 2
  const step = width / segments
  let d = `M 0 ${midY}`
  for (let i = 1; i <= segments; i++) {
    const x = step * i
    const jitter = i === segments ? 0 : (rng() - 0.5) * height * 0.8
    d += ` L ${x.toFixed(1)} ${(midY + jitter).toFixed(1)}`
  }
  return d
}

/**
 * Горизонтальный разряд рельсотрона. Рисуется анимацией pathLength.
 * onComplete вызывается по завершении отрисовки.
 */
export default function LightningBolt({
  width = 1000,
  height = 200,
  segments = 12,
  duration = 0.5,
  animate = true,
  onComplete,
  seed = 1,
}) {
  // Детерминированная форма по seed, пересчитывается только при смене параметров.
  const path = useMemo(
    () => buildBoltPath(width, height, segments, seed),
    [width, height, segments, seed],
  )

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <filter id="bolt-glow" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* широкое свечение */}
      <motion.path
        d={path}
        fill="none"
        stroke="var(--color-rg-cyan)"
        strokeWidth="10"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.5"
        filter="url(#bolt-glow)"
        initial={animate ? { pathLength: 0 } : false}
        animate={animate ? { pathLength: 1 } : false}
        transition={{ duration }}
      />
      {/* яркая сердцевина */}
      <motion.path
        d={path}
        fill="none"
        stroke="var(--color-rg-white)"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
        initial={animate ? { pathLength: 0 } : false}
        animate={animate ? { pathLength: 1 } : false}
        transition={{ duration }}
        onAnimationComplete={onComplete}
      />
    </svg>
  )
}
