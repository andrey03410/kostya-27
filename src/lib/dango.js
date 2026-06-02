import { clamp } from './utils'

// Логика мини-игры «Лови данго».

export const DANGO_COLORS = ['white', 'pink', 'green', 'yellow', 'brown']
export const GAME_DURATION_MS = 45000 // 45 секунд
export const START_LIVES = 3

/** Скорость падения (доля высоты поля в секунду) растёт со счётом. */
export function fallSpeed(score) {
  return clamp(0.35 + score * 0.012, 0.35, 1.4)
}

/** Интервал появления новых данго (мс) сокращается со счётом. */
export function spawnInterval(score) {
  return clamp(1100 - score * 18, 450, 1100)
}

/**
 * Поймана ли данго корзинкой.
 * Все координаты — доли ширины поля 0..1. catcherHalfWidth — половина ширины корзины.
 */
export function isCaught(dangoX, catcherX, catcherHalfWidth) {
  return Math.abs(dangoX - catcherX) <= catcherHalfWidth
}

/** Очки за пойманную данго (бонус за «золотую» жёлтую). */
export function catchPoints(color) {
  return color === 'yellow' ? 3 : 1
}
