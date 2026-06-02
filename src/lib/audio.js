/**
 * Аудио-движок.
 * - SFX: короткие звуки на Web Audio API (монетка, разряд, поп, успех) — без файлов.
 * - Музыка: трек «fripSide — Only my Railgun» (опенинг Railgun) через Howler.js.
 *
 * Всё аккуратно защищено: если AudioContext недоступен (например, в jsdom-тестах),
 * функции просто ничего не делают и не бросают исключений.
 */

import { Howl } from 'howler'
import railgunTrack from '../assets/only-my-railgun.mp3'

let ctx = null
let masterGain = null
let music = null
let ambientOn = false

function hasAudio() {
  return typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)
}

/** Лениво создаёт AudioContext (нужен пользовательский жест на старте). */
export function ensureAudio() {
  if (!hasAudio()) return null
  if (!ctx) {
    const Ctor = window.AudioContext || window.webkitAudioContext
    ctx = new Ctor()
    masterGain = ctx.createGain()
    masterGain.gain.value = 0.35
    masterGain.connect(ctx.destination)
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

/** Короткий звуковой эффект. type: 'coin' | 'zap' | 'pop' | 'success' | 'fail'. */
export function playSfx(type) {
  const audio = ensureAudio()
  if (!audio) return
  const now = audio.currentTime
  const gain = audio.createGain()
  gain.connect(masterGain)

  const beep = (freq, start, dur, kind = 'sine', peak = 0.5) => {
    const osc = audio.createOscillator()
    const g = audio.createGain()
    osc.type = kind
    osc.frequency.setValueAtTime(freq, now + start)
    g.gain.setValueAtTime(0.0001, now + start)
    g.gain.exponentialRampToValueAtTime(peak, now + start + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, now + start + dur)
    osc.connect(g)
    g.connect(gain)
    osc.start(now + start)
    osc.stop(now + start + dur + 0.02)
  }

  switch (type) {
    case 'coin':
      beep(988, 0, 0.08, 'square', 0.3)
      beep(1319, 0.07, 0.12, 'square', 0.3)
      break
    case 'zap': {
      const osc = audio.createOscillator()
      const g = audio.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(1200, now)
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.18)
      g.gain.setValueAtTime(0.4, now)
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.2)
      osc.connect(g)
      g.connect(gain)
      osc.start(now)
      osc.stop(now + 0.22)
      break
    }
    case 'pop':
      beep(440, 0, 0.09, 'triangle', 0.4)
      break
    case 'success':
      beep(523, 0, 0.12, 'sine', 0.35)
      beep(659, 0.1, 0.12, 'sine', 0.35)
      beep(784, 0.2, 0.18, 'sine', 0.35)
      break
    case 'fail':
      beep(196, 0, 0.25, 'sawtooth', 0.3)
      break
    default:
      break
  }
}

/** Лениво создаёт Howl с треком (без автозапуска). */
function ensureMusic() {
  if (music) return music
  // В jsdom (тесты) Howler не сможет проиграть звук — оборачиваем на всякий случай.
  try {
    music = new Howl({
      src: [railgunTrack],
      loop: true,
      volume: 0.5,
      html5: true, // потоковое воспроизведение крупного mp3 без полной предзагрузки
    })
  } catch {
    music = null
  }
  return music
}

/** Запускает фоновую музыку — «Only my Railgun». */
export function startAmbient() {
  if (ambientOn) return
  ambientOn = true
  const m = ensureMusic()
  if (!m) return
  m.volume(0.5)
  if (!m.playing()) m.play()
}

/** Останавливает фоновую музыку (с плавным затуханием). */
export function stopAmbient() {
  ambientOn = false
  const m = music
  if (!m || !m.playing()) return
  const from = m.volume()
  m.fade(from, 0, 600)
  m.once('fade', () => {
    if (!ambientOn) m.pause()
  })
}

export function isAmbientPlaying() {
  return ambientOn
}
