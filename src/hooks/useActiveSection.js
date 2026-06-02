import { useEffect, useState } from 'react'

/**
 * Следит, какая секция сейчас в центре экрана (через IntersectionObserver).
 * sectionIds — массив id секций по порядку. Возвращает id активной.
 */
export function useActiveSection(sectionIds) {
  const [active, setActive] = useState(sectionIds[0])

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        // Берём наиболее видимую секцию.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { threshold: [0.4, 0.6], rootMargin: '-10% 0px -10% 0px' },
    )

    const els = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean)
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [sectionIds])

  return active
}
