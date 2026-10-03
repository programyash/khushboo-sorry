import { useMemo } from 'react'
import { cn, seeded } from '../lib/utils'
import { CloudIcon, HeartIcon, SparkleIcon } from './Doodle'

type Kind = 'heart' | 'sparkle' | 'cloud' | 'dot'

interface AmbientProps {
  count?: number
  kinds?: Kind[]
  seed?: number
  className?: string
  colors?: string[]
  /** 'float' bobs in place, 'rise' drifts upward like balloons. */
  motion?: 'float' | 'rise'
  maxSize?: number
}

/**
 * Restrained background decoration: small hearts, sparkles and clouds that
 * float or twinkle with CSS only (cheap, GPU-friendly). Paused off-screen by
 * the Section's data-active flag.
 */
export function Ambient({
  count = 14,
  kinds = ['heart', 'sparkle'],
  seed = 7,
  className,
  colors = ['#ffb3c9', '#ff8fb0', '#9dd0f6', '#c8b6f6'],
  motion = 'float',
  maxSize = 22,
}: AmbientProps) {
  const items = useMemo(() => {
    const rnd = seeded(seed)
    return Array.from({ length: count }, (_, i) => {
      const kind = kinds[Math.floor(rnd() * kinds.length)]
      const size = kind === 'cloud' ? 60 + rnd() * 70 : 8 + rnd() * (maxSize - 8)
      return {
        i,
        kind,
        size,
        left: rnd() * 100,
        top: rnd() * 100,
        color: colors[Math.floor(rnd() * colors.length)],
        delay: -rnd() * 10,
        dur: kind === 'cloud' ? 9 + rnd() * 6 : 5 + rnd() * 5,
        rot: (rnd() - 0.5) * 40,
        dx: (rnd() - 0.5) * 120,
        opacity: kind === 'cloud' ? 0.9 : 0.45 + rnd() * 0.45,
      }
    })
  }, [count, kinds, seed, colors, maxSize])

  return (
    <div aria-hidden className={cn('ambient pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {items.map((it) => {
        const anim =
          motion === 'rise'
            ? `rise ${it.dur + 6}s linear ${it.delay}s infinite`
            : it.kind === 'sparkle' || it.kind === 'dot'
              ? `twinkle ${it.dur * 0.6}s ease-in-out ${it.delay}s infinite`
              : `float ${it.dur}s ease-in-out ${it.delay}s infinite`
        return (
          <span
            key={it.i}
            className="absolute will-change-transform"
            style={{
              left: `${it.left}%`,
              top: motion === 'rise' ? '105%' : `${it.top}%`,
              width: it.size,
              height: it.kind === 'cloud' ? it.size * 0.56 : it.size,
              opacity: motion === 'rise' ? undefined : it.opacity,
              animation: anim,
              ['--r' as string]: `${it.rot}deg`,
              ['--dx' as string]: `${it.dx}px`,
              ['--o' as string]: it.opacity,
            }}
          >
            {it.kind === 'heart' && <HeartIcon className="h-full w-full" color={it.color} />}
            {it.kind === 'sparkle' && <SparkleIcon className="h-full w-full" color={it.color} />}
            {it.kind === 'cloud' && <CloudIcon className="h-full w-full drop-shadow-[0_6px_10px_rgba(109,182,236,0.18)]" />}
            {it.kind === 'dot' && <span className="block h-full w-full rounded-full" style={{ background: it.color }} />}
          </span>
        )
      })}
    </div>
  )
}
