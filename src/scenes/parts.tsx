import { useEffect, useRef, type RefObject } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'

/** SVG speech bubble. (x, y) is the top-left corner. */
export function Bubble({
  x,
  y,
  w,
  h = 46,
  text,
  tail = 'down-left',
  size = 26,
  className,
  fill = '#fff',
  color = '#2b1d2f',
}: {
  x: number
  y: number
  w: number
  h?: number
  text: string
  tail?: 'down-left' | 'down-right' | 'left' | 'right'
  size?: number
  className?: string
  fill?: string
  color?: string
}) {
  const tails = {
    'down-left': `M${x + 22} ${y + h - 2} L${x + 14} ${y + h + 16} L${x + 38} ${y + h - 2}`,
    'down-right': `M${x + w - 38} ${y + h - 2} L${x + w - 14} ${y + h + 16} L${x + w - 22} ${y + h - 2}`,
    left: `M${x + 2} ${y + h / 2 - 8} L${x - 16} ${y + h / 2 + 6} L${x + 2} ${y + h / 2 + 8}`,
    right: `M${x + w - 2} ${y + h / 2 - 8} L${x + w + 16} ${y + h / 2 + 6} L${x + w - 2} ${y + h / 2 + 8}`,
  }
  return (
    <g className={className}>
      <rect x={x + 4} y={y + 4} width={w} height={h} rx="16" fill={color} />
      <path d={tails[tail]} fill={fill} stroke={color} strokeWidth="3" strokeLinejoin="round" />
      <rect x={x} y={y} width={w} height={h} rx="16" fill={fill} stroke={color} strokeWidth="3" />
      <path d={tails[tail]} fill={fill} stroke="none" transform="translate(0 -3)" />
      <text x={x + w / 2} y={y + h / 2 + size * 0.34} textAnchor="middle" fontFamily="Caveat Variable, cursive" fontWeight="700" fontSize={size} fill={color}>
        {text}
      </text>
    </g>
  )
}

/**
 * Builds a looping GSAP timeline for an illustrated scene that only plays
 * while the scene is on screen (and never with reduced motion).
 */
export function useSceneLoop(
  ref: RefObject<Element | null>,
  build: (tl: gsap.core.Timeline, q: (sel: string) => Element[]) => void,
  enabled: boolean,
) {
  const buildRef = useRef(build)
  buildRef.current = build
  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(el)
      const tl = gsap.timeline({ repeat: -1, paused: true, repeatDelay: 0.6 })
      buildRef.current(tl, q)
      ScrollTrigger.create({
        trigger: el,
        start: 'top 90%',
        end: 'bottom top',
        onToggle: (self) => (self.isActive ? tl.play() : tl.pause()),
      })
    }, el)
    return () => ctx.revert()
  }, [ref, enabled])
}
