// Данго (Dango Daikazoku) — оригинальный SVG, без внешних ассетов.
// Мягкое тело, глазки-точки и розовые щёчки.

const COLOR_MAP = {
  white: '#faf3e0',
  pink: '#f7a8c4',
  green: '#a8d5ba',
  yellow: '#f6e27a',
  brown: '#c9a27e',
}

export default function Dango({ color = 'pink', size = 56, blink = false, className = '' }) {
  const fill = COLOR_MAP[color] ?? COLOR_MAP.pink
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label={`Данго ${color}`}
    >
      <defs>
        <radialGradient id={`dango-${color}`} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="45%" stopColor={fill} />
          <stop offset="100%" stopColor={fill} />
        </radialGradient>
      </defs>
      {/* тело */}
      <ellipse cx="50" cy="52" rx="42" ry="40" fill={`url(#dango-${color})`} />
      {/* щёчки */}
      <circle cx="30" cy="60" r="8" fill="#ff9bb3" opacity="0.55" />
      <circle cx="70" cy="60" r="8" fill="#ff9bb3" opacity="0.55" />
      {/* глаза */}
      <ellipse cx="38" cy="48" rx="4.5" ry={blink ? 1 : 5.5} fill="#3a2b2b" />
      <ellipse cx="62" cy="48" rx="4.5" ry={blink ? 1 : 5.5} fill="#3a2b2b" />
      {/* улыбка */}
      <path
        d="M42 64 Q50 70 58 64"
        stroke="#3a2b2b"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}
