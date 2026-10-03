import type { ReactNode } from 'react'

/**
 * Chibi characters used in every illustrated memory.
 * Drawn in a 140 × 200 local box (head centre at 70,60) so scenes can place
 * them with a simple translate/scale.
 */
export type KidWho = 'yash' | 'khushboo' | 'stranger'
export type KidMood =
  | 'smile'
  | 'happy'
  | 'laugh'
  | 'angry'
  | 'side'
  | 'shocked'
  | 'calm'
  | 'love'
  | 'forced'
  | 'pout'
  | 'sad'
  | 'innocent'
export type KidArms = 'down' | 'crossed' | 'wave' | 'offer' | 'up' | 'hips' | 'write' | 'none'
export type KidLegs = 'stand' | 'sit' | 'none'

const INK = '#2b1d2f'
const SKIN = '#f7d2b8'
const SKIN_SHADE = '#ebb898'
const BLUSH = '#ff8fb0'
const MOUTH = '#8a2f45'

const PALETTE: Record<KidWho, { shirt: string; bottom: string; hair: string }> = {
  yash: { shirt: '#8cc7f0', bottom: '#3d4f75', hair: '#2c2024' },
  khushboo: { shirt: '#ff9dbb', bottom: '#4a5a86', hair: '#2a1b22' },
  stranger: { shirt: '#cfc8d4', bottom: '#8d8596', hair: '#8b8190' },
}

interface KidProps {
  who: KidWho
  mood?: KidMood
  arms?: KidArms
  legs?: KidLegs
  /** -1 … 1, shifts the pupils horizontally. */
  look?: number
  flip?: boolean
  blinkDelay?: number
  /** Extra SVG drawn on top, in the kid's local coordinates (props, held items). */
  children?: ReactNode
  className?: string
}

export function Kid({ who, mood = 'smile', arms = 'down', legs = 'stand', look = 0, flip, blinkDelay = 0, children, className }: KidProps) {
  const c = PALETTE[who]
  const isK = who === 'khushboo'
  return (
    <g className={className} transform={flip ? 'translate(140 0) scale(-1 1)' : undefined}>
      {/* long hair behind the body */}
      {isK && <path d="M30 58 C 25 100, 27 142, 40 160 C 56 168, 84 168, 100 160 C 113 142, 115 100, 110 58 Z" fill={c.hair} />}

      {legs !== 'none' && <Legs who={who} sit={legs === 'sit'} />}

      {/* torso */}
      <rect x="62" y="86" width="16" height="16" rx="5" fill={SKIN_SHADE} />
      <path d="M36 120 Q36 100 56 98 L84 98 Q104 100 104 120 L106 156 Q70 164 34 156 Z" fill={c.shirt} />
      {who !== 'stranger' && (
        <>
          <path d="M57 98 L70 112 L61 117 Z" fill="#fff" />
          <path d="M83 98 L70 112 L79 117 Z" fill="#fff" />
        </>
      )}
      {who === 'yash' && <path d="M67.5 111 L72.5 111 L75 129 L70 134 L65 129 Z" fill={c.bottom} />}
      {isK && <path d="M62 108 L70 112.5 L62 117 Z M78 108 L70 112.5 L78 117 Z" fill="#f2678f" />}
      {isK && legs !== 'none' && <path d="M38 146 L102 146 L110 176 Q70 186 30 176 Z" fill={c.bottom} />}

      <Arms pose={arms} sleeve={c.shirt} />

      {/* head */}
      <circle cx="31" cy="64" r="7" fill={SKIN} />
      <circle cx="109" cy="64" r="7" fill={SKIN} />
      <circle cx="70" cy="60" r="39" fill={SKIN} />
      <Hair who={who} color={c.hair} />

      <Face mood={mood} look={look} blinkDelay={blinkDelay} />
      {children}
    </g>
  )
}

function Legs({ who, sit }: { who: KidWho; sit: boolean }) {
  const top = 150
  const len = sit ? 34 : 38
  const pants = PALETTE[who].bottom
  if (who === 'khushboo') {
    return (
      <g>
        <rect x="53" y={top + 6} width="13" height={len} rx="6" fill={SKIN} />
        <rect x="74" y={top + 6} width="13" height={len} rx="6" fill={SKIN} />
        <rect x="52" y={top + len - 4} width="15" height="9" rx="3" fill="#fff" />
        <rect x="73" y={top + len - 4} width="15" height="9" rx="3" fill="#fff" />
        <ellipse cx="58" cy={top + len + 8} rx="11" ry="6" fill="#3a2a30" />
        <ellipse cx="82" cy={top + len + 8} rx="11" ry="6" fill="#3a2a30" />
      </g>
    )
  }
  return (
    <g>
      <rect x="49" y={top} width="18" height={len + 2} rx="7" fill={pants} />
      <rect x="73" y={top} width="18" height={len + 2} rx="7" fill={pants} />
      <ellipse cx="57" cy={top + len + 4} rx="12" ry="6" fill="#3a2a30" />
      <ellipse cx="83" cy={top + len + 4} rx="12" ry="6" fill="#3a2a30" />
    </g>
  )
}

const ARM_PATHS: Record<Exclude<KidArms, 'none'>, { l: string; r: string; hl: [number, number]; hr: [number, number] }> = {
  down: { l: 'M44 112 Q31 132 35 151', r: 'M96 112 Q109 132 105 151', hl: [35, 154], hr: [105, 154] },
  crossed: { l: 'M44 112 Q38 136 76 131', r: 'M96 112 Q102 138 64 134', hl: [78, 131], hr: [62, 134] },
  wave: { l: 'M44 112 Q31 132 35 151', r: 'M96 112 Q118 100 119 76', hl: [35, 154], hr: [120, 71] },
  offer: { l: 'M44 112 Q31 132 35 151', r: 'M96 114 Q116 126 128 118', hl: [35, 154], hr: [131, 116] },
  up: { l: 'M44 112 Q23 98 22 74', r: 'M96 112 Q117 98 118 74', hl: [21, 70], hr: [119, 70] },
  hips: { l: 'M44 112 Q24 126 40 140', r: 'M96 112 Q116 126 100 140', hl: [41, 141], hr: [99, 141] },
  write: { l: 'M44 112 Q44 134 60 140', r: 'M96 112 Q96 134 80 140', hl: [62, 141], hr: [78, 141] },
}

function Arms({ pose, sleeve }: { pose: KidArms; sleeve: string }) {
  if (pose === 'none') return null
  const a = ARM_PATHS[pose]
  return (
    <g strokeLinecap="round" fill="none">
      <path d={a.l} stroke={sleeve} strokeWidth="13" />
      <path d={a.r} stroke={sleeve} strokeWidth="13" />
      <circle cx={a.hl[0]} cy={a.hl[1]} r="7.5" fill={SKIN} />
      <circle cx={a.hr[0]} cy={a.hr[1]} r="7.5" fill={SKIN} />
    </g>
  )
}

function Hair({ who, color }: { who: KidWho; color: string }) {
  if (who === 'yash') {
    return (
      <g fill={color}>
        <path d="M31 62 C 27 30, 48 15, 70 15 C 95 15, 113 31, 109 62 C 105 49, 97 42, 89 39 C 85 46, 75 47, 70 40 C 64 47, 54 47, 50 40 C 42 44, 35 51, 31 62 Z" />
        <path d="M70 17 C 64 6, 75 1, 80 7" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      </g>
    )
  }
  if (who === 'khushboo') {
    return (
      <g>
        <path
          d="M29 70 C 25 31, 48 15, 70 15 C 93 15, 115 31, 111 70 C 107 52, 100 42, 90 36 C 84 45, 74 47, 70 38 C 64 47, 50 47, 46 40 C 38 48, 32 58, 29 70 Z"
          fill={color}
        />
        <path d="M96 27 C 92 21, 85 25, 89 30 L 96 36 L 103 30 C 107 25, 100 21, 96 27 Z" fill="#f2678f" />
      </g>
    )
  }
  return <path d="M33 58 C 30 28, 50 18, 70 18 C 92 18, 110 28, 107 58 C 96 44, 86 40, 70 40 C 54 40, 44 44, 33 58 Z" fill={color} />
}

function Face({ mood, look, blinkDelay }: { mood: KidMood; look: number; blinkDelay: number }) {
  const dx = look * 3
  const eyes = (() => {
    switch (mood) {
      case 'happy':
      case 'laugh':
        return (
          <g stroke={INK} strokeWidth="3.4" strokeLinecap="round" fill="none">
            <path d="M49 66 Q56 58 63 66" />
            <path d="M77 66 Q84 58 91 66" />
          </g>
        )
      case 'calm':
        return (
          <g stroke={INK} strokeWidth="3.2" strokeLinecap="round" fill="none">
            <path d="M49 63 Q56 69 63 63" />
            <path d="M77 63 Q84 69 91 63" />
          </g>
        )
      case 'love':
        return (
          <g fill="#f2678f">
            <path d="M56 61 C 53 56, 46 59, 50 65 L 56 71 L 62 65 C 66 59, 59 56, 56 61 Z" />
            <path d="M84 61 C 81 56, 74 59, 78 65 L 84 71 L 90 65 C 94 59, 87 56, 84 61 Z" />
          </g>
        )
      case 'shocked':
        return (
          <g>
            <circle cx="56" cy="63" r="7.5" fill="#fff" stroke={INK} strokeWidth="2.2" />
            <circle cx="84" cy="63" r="7.5" fill="#fff" stroke={INK} strokeWidth="2.2" />
            <circle cx={56 + dx} cy="63" r="2.8" fill={INK} />
            <circle cx={84 + dx} cy="63" r="2.8" fill={INK} />
          </g>
        )
      case 'side':
        return (
          <g>
            <ellipse cx={59 + dx} cy="65" rx="4.2" ry="3.6" fill={INK} />
            <ellipse cx={87 + dx} cy="65" rx="4.2" ry="3.6" fill={INK} />
            <path d="M48 61 L64 61 M76 61 L92 61" stroke={INK} strokeWidth="3.6" strokeLinecap="round" />
          </g>
        )
      case 'innocent':
        return (
          <g fill={INK}>
            <ellipse cx="56" cy="62" rx="4.4" ry="5.4" />
            <ellipse cx="84" cy="62" rx="4.4" ry="5.4" />
            <circle cx="57.5" cy="59.5" r="1.7" fill="#fff" />
            <circle cx="85.5" cy="59.5" r="1.7" fill="#fff" />
          </g>
        )
      default:
        return (
          <g fill={INK}>
            <ellipse cx={56 + dx} cy="64" rx="4.6" ry="5.6" />
            <ellipse cx={84 + dx} cy="64" rx="4.6" ry="5.6" />
            <circle cx={57.6 + dx} cy="61.6" r="1.7" fill="#fff" />
            <circle cx={85.6 + dx} cy="61.6" r="1.7" fill="#fff" />
          </g>
        )
    }
  })()

  const brows = (() => {
    switch (mood) {
      case 'angry':
        return 'M47 51 L63 57 M93 51 L77 57'
      case 'side':
        return 'M47 53 L63 55 M77 55 L93 52'
      case 'sad':
        return 'M47 56 L62 51 M93 56 L78 51'
      case 'shocked':
        return 'M47 49 Q55 44 63 49 M77 49 Q85 44 93 49'
      case 'forced':
        return 'M48 53 Q55 50 62 53 M78 51 L92 55'
      default:
        return null
    }
  })()

  const mouth = (() => {
    switch (mood) {
      case 'happy':
      case 'love':
        return <path d="M59 77 Q70 89 81 77" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      case 'laugh':
        return (
          <g>
            <path d="M57 75 Q70 98 83 75 Z" fill={MOUTH} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
            <path d="M63 85 Q70 92 77 85 Q70 81 63 85 Z" fill={BLUSH} />
          </g>
        )
      case 'angry':
      case 'sad':
        return <path d="M61 85 Q70 77 79 85" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      case 'side':
        return <path d="M63 83 L77 80" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      case 'shocked':
        return <ellipse cx="70" cy="84" rx="5.5" ry="7.5" fill={MOUTH} stroke={INK} strokeWidth="2" />
      case 'calm':
        return <path d="M63 79 Q70 85 77 79" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      case 'forced':
        return (
          <g>
            <path d="M57 77 L83 77 Q81 91 70 91 Q59 91 57 77 Z" fill="#fff" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M58 83 L82 83 M64 77 L64 90 M70 77 L70 91 M76 77 L76 90" stroke={INK} strokeWidth="1.4" />
          </g>
        )
      case 'pout':
        return <path d="M63 82 Q66.5 78 70 82 Q73.5 86 77 82" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
      case 'innocent':
        return <ellipse cx="72" cy="83" rx="3.4" ry="3.8" fill={MOUTH} />
      default:
        return <path d="M62 78 Q70 86 78 78" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
    }
  })()

  return (
    <g>
      <g className="kid-eyes" style={{ ['--blink-delay' as string]: `${blinkDelay}s` }}>
        {eyes}
      </g>
      {brows && <path d={brows} stroke={INK} strokeWidth="3.4" strokeLinecap="round" fill="none" />}
      <ellipse cx="45" cy="76" rx="7" ry="4" fill={mood === 'angry' ? '#ff6b8f' : BLUSH} opacity={mood === 'angry' ? 0.75 : 0.5} />
      <ellipse cx="95" cy="76" rx="7" ry="4" fill={mood === 'angry' ? '#ff6b8f' : BLUSH} opacity={mood === 'angry' ? 0.75 : 0.5} />
      {mouth}
      {(mood === 'forced' || mood === 'side') && (
        <path d="M110 34 C 103 46, 106 53, 111 53 C 116 53, 118 46, 110 34 Z" fill="#9dd0f6" stroke="#4a9fdf" strokeWidth="1.2" />
      )}
      {mood === 'angry' && (
        <g stroke="#e5484d" strokeWidth="3" strokeLinecap="round" fill="none">
          <path d="M100 22 Q104 26 108 22 M100 30 Q104 26 108 30" />
        </g>
      )}
    </g>
  )
}

/** Back view (for the late-night talk scene). */
export function KidBack({ who }: { who: Exclude<KidWho, 'stranger'> }) {
  const c = PALETTE[who]
  return (
    <g>
      <path d="M36 120 Q36 100 56 98 L84 98 Q104 100 104 120 L106 158 Q70 166 34 158 Z" fill={c.shirt} />
      <circle cx="31" cy="66" r="7" fill={SKIN} />
      <circle cx="109" cy="66" r="7" fill={SKIN} />
      <circle cx="70" cy="60" r="39" fill={c.hair} />
      {who === 'khushboo' && (
        <>
          <path d="M33 64 C 30 110, 38 140, 54 150 L 86 150 C 102 140, 110 110, 107 64 Z" fill={c.hair} />
          <path d="M96 27 C 92 21, 85 25, 89 30 L 96 36 L 103 30 C 107 25, 100 21, 96 27 Z" fill="#f2678f" />
        </>
      )}
      {who === 'yash' && <path d="M70 21 C 64 10, 75 4, 80 10" stroke={c.hair} strokeWidth="3.5" fill="none" strokeLinecap="round" />}
    </g>
  )
}

/** A head-only portrait in its own <svg>, handy for icons and mini scenes. */
export function KidHead({ who, mood = 'smile', look = 0, className, title }: { who: KidWho; mood?: KidMood; look?: number; className?: string; title?: string }) {
  return (
    <svg viewBox="22 10 96 94" className={className} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true}>
      {title && <title>{title}</title>}
      <Kid who={who} mood={mood} look={look} arms="none" legs="none" />
    </svg>
  )
}
