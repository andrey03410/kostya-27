import { useEffect, useState } from 'react'

function getInitial() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** true, если пользователь предпочитает уменьшенное движение. */
export function useReducedMotion() {
  // Инициализируемся синхронно — без setState в теле эффекта.
  const [reduced, setReduced] = useState(getInitial)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e) => setReduced(e.matches)
    mq.addEventListener?.('change', handler)
    return () => mq.removeEventListener?.('change', handler)
  }, [])

  return reduced
}
