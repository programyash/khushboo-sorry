import { useRef } from 'react'
import { Ambient } from '../components/Ambient'
import { PhotoImg } from '../components/PhotoImg'
import { Section } from '../components/Section'
import { useExperience } from '../context/Experience'
import { photos } from '../data/photos'
import { gsap, SplitText, useGSAP } from '../lib/gsap'
import { TalkScene } from '../scenes/TalkScene'
import { cn } from '../lib/utils'

const THINGS = ['Random thoughts.', 'Secrets.', 'Problems.', 'Stupid jokes.', 'Serious conversations.', 'Things that made absolutely no sense.']

const FLOATS = photos(['cafe-cocoa', 'snow-lake', 'lehenga-side', 'red-cafe', 'rooftop-teal'])
const FLOAT_LAYOUT = [
  { cls: 'top-[22%] left-[3%] w-[24vw] max-w-[220px] lg:left-[6%]', speed: 1.2, rot: -6, mobile: true },
  { cls: 'top-[30%] right-[3%] w-[26vw] max-w-[240px] lg:right-[7%]', speed: 0.7, rot: 5, mobile: true },
  { cls: 'top-[47%] left-[10%] w-[18vw] max-w-[200px]', speed: 1.5, rot: 4, mobile: false },
  { cls: 'top-[54%] right-[12%] w-[18vw] max-w-[190px]', speed: 1, rot: -4, mobile: false },
  { cls: 'top-[64%] left-[4%] w-[22vw] max-w-[210px] lg:left-[16%]', speed: 0.8, rot: -3, mobile: true },
]

/**
 * The slow, quiet section. The page darkens to night, the words arrive one
 * at a time, photos float like memories, and two kids talk on a terrace.
 */
export function QuietPart() {
  const { reduced } = useExperience()
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (reduced) return
      const q = gsap.utils.selector(root)
      const intro = SplitText.create(q('.qp-intro'), { type: 'words' })
      gsap.from(intro.words, {
        autoAlpha: 0,
        y: 18,
        filter: 'blur(10px)',
        stagger: 0.12,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: q('.qp-intro')[0], start: 'top 75%' },
      })
      q('.qp-thing').forEach((t, i) => {
        gsap.from(t, {
          autoAlpha: 0,
          x: i % 2 ? 60 : -60,
          filter: 'blur(12px)',
          duration: 1.8,
          ease: 'power2.out',
          scrollTrigger: { trigger: t, start: 'top 82%' },
        })
      })
      q('.qp-float').forEach((f) => {
        const speed = Number((f as HTMLElement).dataset.speed)
        gsap.fromTo(f, { yPercent: 40 * speed }, { yPercent: -60 * speed, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } })
        gsap.from(f.firstElementChild, { autoAlpha: 0, scale: 0.85, duration: 2, ease: 'power2.out', scrollTrigger: { trigger: f, start: 'top 90%' } })
      })
      gsap.from(q('.qp-scene'), { autoAlpha: 0, y: 60, duration: 1.8, ease: 'power2.out', scrollTrigger: { trigger: q('.qp-scene')[0], start: 'top 85%' } })
      const end = SplitText.create(q('.qp-end'), { type: 'words' })
      gsap.from(end.words, {
        autoAlpha: 0,
        y: 30,
        scale: 1.1,
        filter: 'blur(14px)',
        stagger: 0.25,
        duration: 2.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: q('.qp-end')[0], start: 'top 78%' },
      })
      return () => {
        intro.revert()
        end.revert()
      }
    },
    { scope: root, dependencies: [reduced] },
  )

  return (
    <Section id="quiet" sectionRef={root} className="relative overflow-hidden bg-night text-white">
      {/* dusk: fade from the light page into night */}
      <div aria-hidden className="h-[40vh] bg-gradient-to-b from-cloud-50 via-[#8f7aa8] to-night" />
      <Ambient count={40} kinds={['dot', 'sparkle']} seed={44} colors={['#ffffff', '#ffd3e0', '#c4e3fb']} maxSize={10} className="top-[30vh]" />
      <div aria-hidden className="pointer-events-none absolute top-[45%] left-1/2 h-[70vh] w-[70vw] -translate-x-1/2 rounded-full bg-[#ff8fb0]/10 blur-[120px]" />

      {/* floating memories */}
      {FLOATS.map((p, i) => {
        const l = FLOAT_LAYOUT[i]
        return (
          <div key={p.id} data-speed={l.speed} className={cn('qp-float absolute z-0', l.cls, !l.mobile && 'hidden md:block')}>
            <div className="rounded-xl bg-white/90 p-1.5 shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)]" style={{ rotate: `${l.rot}deg` }}>
              <PhotoImg photo={p} className="aspect-[4/5] rounded-lg opacity-90 saturate-[.85]" sizes="220px" />
            </div>
          </div>
        )
      })}

      <div className="relative z-10 mx-auto max-w-4xl px-6 pt-16 pb-32 text-center sm:pt-24 sm:pb-40">
        <p className="hand text-2xl text-lilac-300">a little slower now.</p>
        <p className="qp-intro display mx-auto mt-6 max-w-3xl text-[clamp(1.9rem,4.6vw,3.4rem)] leading-[1.15] text-white">
          There were things we could say to each other that we couldn’t explain to everyone else.
        </p>

        <ul className="mt-24 space-y-14 sm:mt-32 sm:space-y-20">
          {THINGS.map((t, i) => (
            <li
              key={t}
              className={cn(
                'qp-thing display leading-tight',
                i === THINGS.length - 1
                  ? 'text-center text-[clamp(1.4rem,3.4vw,2.4rem)] text-white/80'
                  : cn('text-[clamp(1.8rem,5vw,3.6rem)] italic', i % 2 ? 'text-right text-blush-200' : 'text-left text-cloud-200'),
              )}
            >
              {t}
            </li>
          ))}
        </ul>

        <figure className="qp-scene mx-auto mt-28 max-w-3xl overflow-hidden rounded-[28px] border border-white/10 shadow-[0_40px_100px_-40px_rgba(255,143,176,.35)]">
          <TalkScene className="block h-auto w-full" />
        </figure>

        <p className="qp-end display text-glow mt-28 text-[clamp(2.6rem,8vw,6.2rem)] leading-[1.02] text-white italic sm:mt-36">
          And somehow, <span className="text-blush-300">you understood.</span>
        </p>
      </div>
    </Section>
  )
}
