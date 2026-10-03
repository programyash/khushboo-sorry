export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ')
}

/** Small deterministic PRNG so decorative layouts are stable between renders. */
export function seeded(seed: number) {
  let s = seed >>> 0 || 1
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

/** Points on the classic parametric heart, normalised to roughly [-1, 1]. */
export function heartPoint(t: number) {
  const x = 16 * Math.sin(t) ** 3
  const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)
  return { x: x / 17, y: -y / 17 }
}
