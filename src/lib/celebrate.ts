import confetti from 'canvas-confetti'

const PALETTE = ['#ff8fb0', '#ffd3e0', '#f2678f', '#9dd0f6', '#c8b6f6', '#ffffff']

let heart: confetti.Shape | undefined
const heartShape = () =>
  (heart ??= confetti.shapeFromPath({
    path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z',
  }))

const base = { disableForReducedMotion: true, zIndex: 120 } as const

/** Normalised (0–1) viewport coords for an element's centre. */
export function originOf(el: Element | null | undefined) {
  if (!el) return { x: 0.5, y: 0.5 }
  const r = el.getBoundingClientRect()
  return { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight }
}

export function sparkle(origin = { x: 0.5, y: 0.5 }) {
  confetti({ ...base, particleCount: 28, spread: 70, startVelocity: 26, gravity: 0.9, scalar: 0.8, ticks: 120, origin, colors: PALETTE })
}

export function heartBurst(origin = { x: 0.5, y: 0.5 }, count = 26) {
  confetti({
    ...base,
    particleCount: count,
    spread: 100,
    startVelocity: 34,
    gravity: 0.7,
    scalar: 1.5,
    ticks: 180,
    origin,
    shapes: [heartShape()],
    colors: ['#ff8fb0', '#f2678f', '#ffb3c9', '#d94a75'],
  })
}

export function confettiShower(origin = { x: 0.5, y: 0.4 }) {
  confetti({ ...base, particleCount: 120, spread: 110, startVelocity: 45, origin, colors: PALETTE, ticks: 220 })
}

export function sideCannons(durationMs = 1800) {
  const end = Date.now() + durationMs
  const frame = () => {
    confetti({ ...base, particleCount: 4, angle: 60, spread: 60, origin: { x: 0, y: 0.75 }, colors: PALETTE })
    confetti({ ...base, particleCount: 4, angle: 120, spread: 60, origin: { x: 1, y: 0.75 }, colors: PALETTE })
    confetti({
      ...base,
      particleCount: 1,
      angle: 90,
      spread: 160,
      origin: { x: Math.random(), y: -0.05 },
      shapes: [heartShape()],
      scalar: 1.6,
      gravity: 0.5,
      colors: ['#f2678f', '#ff8fb0'],
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}

export function grandCelebration() {
  heartBurst({ x: 0.5, y: 0.55 }, 60)
  confettiShower({ x: 0.5, y: 0.5 })
  window.setTimeout(() => sideCannons(2600), 250)
  window.setTimeout(() => heartBurst({ x: 0.25, y: 0.4 }, 30), 700)
  window.setTimeout(() => heartBurst({ x: 0.75, y: 0.4 }, 30), 1000)
}
