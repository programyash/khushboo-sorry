import { useInView } from '../hooks/useInView'
import { cn } from '../lib/utils'

export type DoodleName =
  | 'heart'
  | 'star'
  | 'sparkle'
  | 'swirl'
  | 'arrow'
  | 'underline'
  | 'circle'
  | 'squiggle'
  | 'burst'
  | 'flower'
  | 'cloud'
  | 'loop'
  | 'ring'

const PATHS: Record<DoodleName, { vb: string; d: string[] }> = {
  heart: { vb: '0 0 48 44', d: ['M24 40 C 8 28, 2 18, 6 10 C 10 2, 20 2, 24 11 C 28 2, 38 2, 42 10 C 46 18, 40 28, 24 40 Z'] },
  star: { vb: '0 0 48 48', d: ['M24 4 L29 18 L44 19 L32 28 L36 43 L24 34 L12 43 L16 28 L4 19 L19 18 Z'] },
  sparkle: { vb: '0 0 40 40', d: ['M20 3 C 21 14, 26 19, 37 20 C 26 21, 21 26, 20 37 C 19 26, 14 21, 3 20 C 14 19, 19 14, 20 3 Z'] },
  swirl: { vb: '0 0 80 60', d: ['M8 40 C 14 10, 50 6, 54 28 C 57 44, 36 50, 32 36 C 29 26, 44 20, 52 30 C 60 40, 70 42, 76 34'] },
  arrow: { vb: '0 0 120 60', d: ['M6 42 C 30 10, 70 6, 106 30', 'M90 17 L108 31 L88 39'] },
  underline: { vb: '0 0 200 20', d: ['M4 12 C 40 4, 80 18, 120 9 C 150 3, 175 14, 196 8'] },
  circle: { vb: '0 0 220 90', d: ['M120 8 C 50 2, 6 26, 10 50 C 14 78, 90 88, 160 76 C 210 66, 218 34, 180 16 C 150 4, 100 6, 70 12'] },
  squiggle: { vb: '0 0 120 24', d: ['M2 12 Q 12 2, 22 12 T 42 12 T 62 12 T 82 12 T 102 12 T 118 12'] },
  burst: { vb: '0 0 60 60', d: ['M30 4 L30 16', 'M30 44 L30 56', 'M4 30 L16 30', 'M44 30 L56 30', 'M12 12 L20 20', 'M40 40 L48 48', 'M48 12 L40 20', 'M20 40 L12 48'] },
  flower: {
    vb: '0 0 60 60',
    d: ['M24 30 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0', 'M30 24 C 20 6, 40 6, 30 24', 'M36 30 C 54 20, 54 40, 36 30', 'M30 36 C 40 54, 20 54, 30 36', 'M24 30 C 6 40, 6 20, 24 30'],
  },
  cloud: { vb: '0 0 100 56', d: ['M18 48 C 4 48, 4 30, 18 30 C 18 14, 40 10, 46 24 C 52 8, 80 10, 78 30 C 96 28, 98 48, 82 48 Z'] },
  ring: { vb: '0 0 100 100', d: ['M62 8 C 28 2, 4 26, 7 54 C 10 82, 42 97, 68 90 C 92 83, 99 56, 91 33 C 84 14, 62 5, 36 12'] },
  loop: { vb: '0 0 160 50', d: ['M4 38 C 30 38, 40 8, 56 12 C 72 16, 56 44, 44 34 C 34 26, 60 10, 90 24 C 110 34, 130 30, 156 14'] },
}

interface DoodleProps {
  name: DoodleName
  className?: string
  stroke?: string
  fill?: string
  strokeWidth?: number
  delay?: number
  /** Draw on scroll (default) or show immediately. */
  draw?: boolean
}

/** Hand-drawn doodle that draws itself in when it scrolls into view. */
export function Doodle({ name, className, stroke = 'currentColor', fill = 'none', strokeWidth = 3, delay = 0, draw = true }: DoodleProps) {
  const [ref, inView] = useInView<SVGSVGElement>({ rootMargin: '0px 0px -8% 0px', threshold: 0 })
  const p = PATHS[name]
  return (
    <svg
      ref={ref}
      viewBox={p.vb}
      aria-hidden
      className={cn(draw && 'draw', draw && inView && 'is-drawn', className)}
      style={{ ['--d' as string]: `${delay}s` }}
      fill="none"
    >
      {p.d.map((d, i) => (
        <path
          key={i}
          d={d}
          pathLength={1}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={fill}
          style={fill !== 'none' ? { fillOpacity: inView || !draw ? 1 : 0, transition: `fill-opacity .6s ${delay + 0.9}s` } : undefined}
        />
      ))}
    </svg>
  )
}

/** Tiny solid icons used by ambient decoration. */
export function HeartIcon({ className, color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 48 44" className={className} aria-hidden>
      <path d="M24 41 C 8 29, 1 19, 5 10 C 9 1, 20 1, 24 10 C 28 1, 39 1, 43 10 C 47 19, 40 29, 24 41 Z" fill={color} />
    </svg>
  )
}

export function SparkleIcon({ className, color = 'currentColor' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <path d="M20 2 C 21 14, 26 19, 38 20 C 26 21, 21 26, 20 38 C 19 26, 14 21, 2 20 C 14 19, 19 14, 20 2 Z" fill={color} />
    </svg>
  )
}

export function CloudIcon({ className, color = '#fff' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 56" className={className} aria-hidden>
      <path d="M18 50 C 3 50, 3 30, 18 30 C 18 13, 41 9, 47 23 C 53 7, 82 9, 79 30 C 98 28, 99 50, 82 50 Z" fill={color} />
    </svg>
  )
}
