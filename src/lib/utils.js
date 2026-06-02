// Маленькие чистые утилиты. Без побочных эффектов — легко тестировать.

/** Ограничивает число диапазоном [min, max]. */
export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

/** Линейная интерполяция. */
export function lerp(a, b, t) {
  return a + (b - a) * t
}

/** Детерминированный ГПСЧ (mulberry32) — для воспроизводимых тестов перемешивания. */
export function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Перемешивание Фишера—Йетса. Возвращает НОВЫЙ массив (исходный не мутируется).
 * rng — функция, возвращающая [0, 1). По умолчанию Math.random (в тестах передаём seed).
 */
export function shuffle(array, rng = Math.random) {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/** Форматирует миллисекунды в "м:сс". */
export function formatTime(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

/** Случайный элемент массива. */
export function pick(array, rng = Math.random) {
  return array[Math.floor(rng() * array.length)]
}
