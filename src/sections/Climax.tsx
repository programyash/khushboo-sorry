import { useRef } from 'react'
import { Ambient } from '../components/Ambient'
import { Section } from '../components/Section'
import { useExperience } from '../context/Experience'
import { gsap, useGSAP } from '../lib/gsap'
import { cn } from '../lib/utils'

type Beat = { lines: string[]; style: 'hand' | 'body' | 'long' | 'big' | 'final' }

const BEATS: Beat[] = [
  { lines: ['Jokes aside…'], style: 'hand' },
  { lines: ['You’ve been a part of my life for ten years.'], style: 'body' },
  { lines: ['That’s not a small thing.'], style: 'body' },
  {
    lines: [
      'You’ve seen the stupid version of me, the confused version, the angry version, the happy version — and probably a few versions that should never have existed.',
    ],
    style: 'long',
  },
  { lines: ['And somehow, you stayed.'], style: 'body' },
  { lines: ['So yes…'], style: 'hand' },
  { lines: ['I’m really sorry.'], style: 'big' },
  { lines: ['Not because I want to erase the past.', 'But because I never want my mistakes to make you feel less valued.'], style: 'long' },
  { lines: ['You matter to me.'], style: 'final' },
]

const STYLE: Record<Beat['style'], string> = {
  hand: 'hand text-[clamp(2.4rem,7vw,4.6rem)] text-lilac-200',
  body: 'display text-[clamp(2rem,5.6vw,4.2rem)] leading-[1.1] text-white',
  long: 'display text-[clamp(1.5rem,3.6vw,2.6rem)] leading-[1.3] text-white/90',
  big: 'display text-glow text-[clamp(3.4rem,11vw,8.4rem)] leading-[0.95] text-blush-300 italic',
  final: 'display text-glow text-[clamp(2.8rem,8vw,6rem)] leading-none text-white italic',
}

/** "Jokes aside…" — the UI steps back, the light dims, one sentence at a time. */
export function Climax() {
  const { reduced } = useExperience()
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (reduced) return
      const q = gsap.utils.selector(root)
      const beats = q('.cx-beat')
      gsap.set(beats, { autoAlpha: 0 })
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, pin: true, start: 'top top', end: `+=${BEATS.length * 85}%`, scrub: 1.2 },
      })
      beats.forEach((b, i) => {
        const at = i * 3
        const last = i === beats.length - 1
        tl.fromTo(b, { autoAlpha: 0, y: 40, filter: 'blur(14px)', scale: 1.04 }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', scale: 1, duration: 1.2, ease: 'power2.out' }, at)
        tl.to(q(`.cx-dot[data-i="${i}"]`), { backgroundColor: '#ff8fb0', scale: 1.4, duration: 0.4 }, at)
        if (!last) tl.to(b, { autoAlpha: 0, y: -40, filter: 'blur(10px)', duration: 0.9, ease: 'power2.in' }, at + 2.1)
      })
      const big = BEATS.findIndex((b) => b.style === 'big')
      tl.to(q('.cx-glow'), { scale: 1.6, opacity: 0.9, duration: 1.5 }, big * 3)
        .to(q('.cx-glow'), { scale: 1.1, opacity: 0.55, duration: 1.5 }, big * 3 + 2.4)
        .from(q('.cx-heart'), { scale: 0, autoAlpha: 0, duration: 1, ease: 'back.out(2)' }, (beats.length - 1) * 3 + 0.8)
        .to({}, { duration: 1.4 })
    },
    { scope: root, dependencies: [reduced] },
  )

  return (
    <Section id="climax" sectionRef={root} className={cn('relative overflow-hidden bg-night', reduced ? 'py-28' : 'h-[100svh]')}>
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_50%,#2b1e3b_0%,#1c1427_70%)]" />
      <Ambient count={30} kinds={['dot']} seed={91} colors={['#ffffff', '#ffd3e0']} maxSize={5} />
      <div aria-hidden className="cx-glow absolute top-1/2 left-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush-400/30 opacity-50 blur-[90px]" />

      {reduced ? (
        <div className="relative mx-auto max-w-3xl space-y-14 px-6 text-center">
          {BEATS.map((b, i) => (
            <div key={i} className="space-y-4">
              {b.lines.map((l) => (
                <p key={l} className={STYLE[b.style]}>
                  {l}
                </p>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="relative h-full">
            {BEATS.map((b, i) => (
              <div key={i} className="cx-beat invisible absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center">
                {b.lines.map((l) => (
                  <p key={l} className={cn('max-w-4xl', STYLE[b.style])}>
                    {l}
                  </p>
                ))}
                {b.style === 'final' && (
                  <span className="cx-heart mt-4 inline-block" aria-hidden>
                    <span className="inline-block animate-beat text-6xl text-blush-400">♥</span>
                  </span>
                )}
              </div>
            ))}
          </div>
          <div aria-hidden className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
            {BEATS.map((_, i) => (
              <span key={i} data-i={i} className="cx-dot h-1.5 w-1.5 rounded-full bg-white/25" />
            ))}
          </div>
        </>
      )}
    </Section>
  )
}
