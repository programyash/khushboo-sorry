import { useRef, type ElementType, type ReactNode } from 'react'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { useExperience } from '../context/Experience'

type RevealMood = 'soft' | 'bouncy' | 'cinematic' | 'rise'

interface RevealProps {
  as?: ElementType
  children: ReactNode
  className?: string
  /** What to split into. Avoid `chars` on text containing emoji. */
  split?: 'words' | 'chars' | 'lines'
  mood?: RevealMood
  start?: string
  delay?: number
  stagger?: number
  id?: string
}

const FROM: Record<RevealMood, gsap.TweenVars> = {
  soft: { opacity: 0, y: 22, filter: 'blur(8px)', duration: 1.3, ease: 'power2.out' },
  bouncy: { opacity: 0, y: 40, rotate: () => gsap.utils.random(-12, 12), scale: 0.6, duration: 0.8, ease: 'back.out(2.4)' },
  cinematic: { opacity: 0, y: 30, scale: 1.08, filter: 'blur(14px)', duration: 2, ease: 'expo.out' },
  rise: { yPercent: 110, duration: 1.1, ease: 'expo.out' },
}

/**
 * Splits text with GSAP SplitText and reveals it when scrolled into view.
 * SplitText keeps the original text available to screen readers.
 */
export function Reveal({ as: Tag = 'p', children, className, split = 'words', mood = 'soft', start = 'top 82%', delay = 0, stagger, id }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const { reduced } = useExperience()

  useGSAP(
    () => {
      const el = ref.current
      if (reduced || !el) return
      const s = SplitText.create(el, {
        type: split === 'chars' ? 'words,chars' : split,
        mask: mood === 'rise' ? (split === 'lines' ? 'lines' : 'words') : undefined,
      })
      const targets = split === 'chars' ? s.chars : split === 'lines' ? s.lines : s.words
      gsap.from(targets, {
        ...FROM[mood],
        delay,
        stagger: stagger ?? (split === 'chars' ? 0.025 : split === 'lines' ? 0.12 : 0.06),
        scrollTrigger: { trigger: el, start, toggleActions: 'play none none none' },
      })
      return () => s.revert()
    },
    { dependencies: [reduced], scope: ref },
  )

  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  )
}
