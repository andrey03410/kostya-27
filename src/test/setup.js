import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Чистим DOM между тестами
afterEach(() => {
  cleanup()
})

// jsdom не реализует эти API — мокаем, чтобы анимации/частицы не падали в тестах.
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

window.scrollTo = window.scrollTo || vi.fn()

if (!window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}

if (!window.IntersectionObserver) {
  window.IntersectionObserver = class {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return []
    }
  }
}

// Canvas 2d-контекст — заглушка (jsdom его не реализует; возвращаем null,
// компоненты с canvas корректно это обрабатывают).
HTMLCanvasElement.prototype.getContext = () => null

// requestAnimationFrame в jsdom есть, но подстрахуемся.
window.requestAnimationFrame =
  window.requestAnimationFrame || ((cb) => setTimeout(() => cb(Date.now()), 16))
window.cancelAnimationFrame = window.cancelAnimationFrame || ((id) => clearTimeout(id))
