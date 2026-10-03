import { useRef } from 'react'
import { Ambient } from '../components/Ambient'
import { Polaroid } from '../components/Polaroid'
import { Section } from '../components/Section'
import { useExperience } from '../context/Experience'
import { photos } from '../data/photos'
import { gsap, useGSAP } from '../lib/gsap'

const LINE_1 = ['But', 'I’m', 'not', 'sorry']
const LINE_2 = ['that', 'I', 'met', 'you.']
const FLOATERS = photos(['lehenga-twirl', 'cafe-cocoa', 'snow-lake'])

/** The one line that gets the full cinematic treatment. */
export function NotSorry() {
  const { reduced } = useExperience()
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (reduced) return
      const q = gsap.utils.selector(root)
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root.current, pin: true, start: 'top top', end: '+=200%', scrub: 1 },
      })
      tl.fromTo(q('.ns-bg'), { scale: 0.2, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 2, ease: 'power2.out' }, 0)
      q('.ns-word').forEach((w, i) => {
        tl.from(w, { autoAlpha: 0, y: 50, scale: 1.4, filter: 'blur(16px)', duration: 0.9, ease: 'power3.out' }, 0.3 + i * 0.45)
      })
      tl.fromTo(q('.ns-circle path'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.8, ease: 'power2.inOut' }, 2.2)
        .from(q('.ns-heart'), { scale: 0, rotate: -30, duration: 0.6, ease: 'back.out(3)' }, 3.9)
        .from(q('.ns-you'), { color: '#2b1d2f', textShadow: '0 0 0 rgba(255,143,176,0)', duration: 0.8 }, 3.8)
        .from(q('.ns-photo'), { y: '60vh', rotate: (i: number) => [-30, 25, -20][i], autoAlpha: 0, stagger: 0.3, duration: 1.4, ease: 'power3.out' }, 3.2)
        .from(q('.ns-note'), { autoAlpha: 0, y: 20, duration: 0.6 }, 4.8)
        .to({}, { duration: 0.6 })
    },
    { scope: root, dependencies: [reduced] },
  )

  return (
    <Section id="notSorry" sectionRef={root} className="relative flex h-[100svh] min-h-[600px] items-center justify-center overflow-hidden bg-white">
      <div aria-hidden className="ns-bg absolute inset-[-20%] bg-[radial-gradient(closest-side,#ffd3e0_0%,#ffe8ef_45%,#ffffff_100%)]" />
      <Ambient count={16} kinds={['heart']} motion="rise" seed={21} colors={['#ffb3c9', '#ff8fb0', '#f2678f']} maxSize={26} />

      {/* drifting polaroids */}
      {FLOATERS[0] && (
        <div className="ns-photo absolute top-[8%] left-[4%] hidden w-[clamp(120px,15vw,210px)] md:block">
          <Polaroid photo={FLOATERS[0]} rotate={-8} caption="" tape="top" sizes="210px" />
        </div>
      )}
      {FLOATERS[1] && (
        <div className="ns-photo absolute top-[10%] right-[5%] w-[clamp(96px,14vw,190px)]">
          <Polaroid photo={FLOATERS[1]} rotate={7} caption="" tape="corners" sizes="190px" />
        </div>
      )}
      {FLOATERS[2] && (
        <div className="ns-photo absolute bottom-[7%] left-[8%] w-[clamp(104px,15vw,200px)] md:right-[10%] md:left-auto">
          <Polaroid photo={FLOATERS[2]} rotate={-5} caption="" tape="top" tapeColor="rgba(157,208,246,.8)" sizes="200px" />
        </div>
      )}

      <h2 className="display relative z-10 px-6 text-center text-[clamp(2.7rem,8.5vw,7rem)] leading-[1.02] text-ink">
        <span className="block">
          {LINE_1.map((w) => (
            <span key={w} className="ns-word relative mr-[0.22em] inline-block last:mr-0">
              {w === 'sorry' ? (
                <span className="relative inline-block italic">
                  sorry
                  <svg viewBox="0 0 220 90" preserveAspectRatio="none" className="ns-circle absolute -inset-x-[12%] -inset-y-[18%] h-[136%] w-[124%]" aria-hidden>
                    <path d="M120 8 C 50 2, 6 26, 10 50 C 14 78, 90 88, 160 76 C 210 66, 218 34, 180 16 C 150 4, 100 6, 70 12" stroke="#f2678f" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </svg>
                </span>
              ) : (
                w
              )}
            </span>
          ))}
        </span>
        <span className="block">
          {LINE_2.map((w) => (
            <span key={w} className={`ns-word relative mr-[0.22em] inline-block last:mr-0 ${w === 'you.' ? 'ns-you text-glow text-blush-500 italic' : ''}`}>
              {w}
              {w === 'you.' && (
                <span className="ns-heart absolute -top-[0.35em] -right-[0.5em] text-[0.45em] text-blush-500" aria-hidden>
                  ♥
                </span>
              )}
            </span>
          ))}
        </span>
        <span className="ns-note hand mt-6 block text-[clamp(1.4rem,3vw,2rem)] text-ink-mute not-italic">(not even a tiny bit.)</span>
      </h2>
    </Section>
  )
}
