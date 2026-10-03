/**
 * The motion language of the site. Every animation picks one of these moods
 * instead of inventing its own timing, so the whole story feels coherent.
 */
export const mood = {
  /** Emotional moments: slow, soft, smooth. */
  soft: { ease: 'power2.out', duration: 1.6 },
  /** Funny moments: fast, bouncy, elastic. */
  bouncy: { ease: 'back.out(2.2)', duration: 0.7 },
  elastic: { ease: 'elastic.out(1, 0.5)', duration: 1.1 },
  /** Memories: paper-like, a little weight and a little turn. */
  paper: { ease: 'power3.inOut', duration: 1.1 },
  /** Quiz: snappy, game-like. */
  game: { ease: 'expo.out', duration: 0.5 },
  /** Finale: cinematic and slow. */
  cinematic: { ease: 'expo.inOut', duration: 2.2 },
} as const

/** Same moods for Motion (framer) springs. */
export const springs = {
  bouncy: { type: 'spring', stiffness: 420, damping: 18 },
  soft: { type: 'spring', stiffness: 120, damping: 22 },
  game: { type: 'spring', stiffness: 520, damping: 32 },
} as const
