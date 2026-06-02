import { useEffect, useRef } from 'react'

// Фоновое поле частиц на canvas.
// theme: 'railgun' (электрические искры вверх, циан) ↔ 'clannad' (лепестки вниз, розовый).
// Между темами плавный кроссфейд через параметр warmth (0→1).

const CYAN = [125, 249, 255]
const PINK = [247, 168, 196]

function lerp(a, b, t) {
  return a + (b - a) * t
}
function mix(c1, c2, t) {
  return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)]
}

export default function ParticleField({ theme = 'railgun', reducedMotion = false }) {
  const canvasRef = useRef(null)
  const themeRef = useRef(theme)

  // Держим актуальную тему в ref, чтобы цикл анимации читал её без перезапуска.
  useEffect(() => {
    themeRef.current = theme
  }, [theme])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext?.('2d')
    if (!ctx) return // jsdom/без поддержки — тихо выходим

    let width = 0
    let height = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let particles = []
    let warmth = themeRef.current === 'clannad' ? 1 : 0
    let raf = 0
    let last = 0

    function resize() {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const target = Math.min(70, Math.floor((width * height) / 22000))
      particles = Array.from({ length: target }, makeParticle)
    }

    function makeParticle() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: 1.5 + Math.random() * 3.5,
        speed: 0.2 + Math.random() * 0.6,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.5 + Math.random(),
        rot: Math.random() * Math.PI,
        twinkle: Math.random() * Math.PI * 2,
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height)
      const color = mix(CYAN, PINK, warmth)
      for (const p of particles) {
        const tw = 0.5 + 0.5 * Math.sin(p.twinkle)
        const alpha = lerp(0.7 * tw, 0.85, warmth)
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.globalAlpha = alpha
        // Свечение сильнее в «электрической» теме
        ctx.shadowBlur = lerp(12, 4, warmth)
        ctx.shadowColor = `rgb(${color[0]},${color[1]},${color[2]})`
        ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`
        const ry = p.size * lerp(1, 1.9, warmth) // искра → лепесток
        ctx.beginPath()
        ctx.ellipse(0, 0, p.size, ry, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
      ctx.globalAlpha = 1
    }

    function step(ts) {
      const dt = last ? Math.min((ts - last) / 1000, 0.05) : 0.016
      last = ts

      // Плавно тянемся к целевой «теплоте»
      const targetWarmth = themeRef.current === 'clannad' ? 1 : 0
      warmth += (targetWarmth - warmth) * Math.min(dt * 1.2, 1)

      for (const p of particles) {
        p.twinkle += dt * 2
        p.sway += dt * p.swaySpeed
        // railgun: вверх; clannad: вниз
        const vy = lerp(-p.speed, p.speed, warmth) * 40
        p.y += vy * dt
        p.x += Math.sin(p.sway) * lerp(4, 18, warmth) * dt
        p.rot += dt * lerp(0.2, 0.6, warmth)

        // оборачивание по краям
        if (p.y < -10) p.y = height + 10
        if (p.y > height + 10) p.y = -10
        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10
      }
      draw()
      raf = requestAnimationFrame(step)
    }

    resize()
    window.addEventListener('resize', resize)

    if (reducedMotion) {
      // Один статичный кадр без анимации
      warmth = themeRef.current === 'clannad' ? 1 : 0
      draw()
    } else {
      raf = requestAnimationFrame(step)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [reducedMotion])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  )
}
