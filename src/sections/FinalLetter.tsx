import { useRef } from 'react'
import { Doodle } from '../components/Doodle'
import { Polaroid } from '../components/Polaroid'
import { Section } from '../components/Section'
import { useExperience } from '../context/Experience'
import { photo } from '../data/photos'
import { gsap, useGSAP } from '../lib/gsap'

/** Paragraphs of the final letter. Strings inside arrays render as separate short lines. */
const LETTER: (string | string[])[] = [
  'Ten years is a ridiculously long time.',
  'We’ve shared classrooms, tiffins, secrets, jokes, arguments, jealousy, random thoughts, emotional breakdowns, completely pointless conversations — and memories that probably wouldn’t make sense to anyone else.',
  ['We’ve annoyed each other.', 'We’ve fought.', 'We’ve misunderstood each other.', 'We’ve probably both thought, at some point, “I am so done with this person.”'],
  'And yet… here we are.',
  'That’s what makes this friendship special to me. It was never perfect. It was real.',
  ['So I’m sorry.', 'For the things I did.', 'For the things I said.', 'For the moments I didn’t understand you.', 'And for every time I made you feel like your feelings mattered less. They never did.'],
  'I can’t go back and change those moments. But I can be better from here — and I want to be.',
  'And honestly, after surviving ten years of each other’s nonsense, I think we’re already overqualified for another ten.',
  [
    'Thank you for being my friend.',
    'Thank you for all the memories.',
    'Thank you for understanding me even when I didn’t explain myself properly.',
    'And thank you for still being here.',
  ],
]

/** The final letter — written for one reader. */
export function FinalLetter() {
  const { reduced } = useExperience()
  const root = useRef<HTMLElement>(null)
  const flowers = photo('rooftop-flowers')

  useGSAP(
    () => {
      if (reduced) return
      const q = gsap.utils.selector(root)
      gsap.from(q('.fl-paper'), { y: 120, rotate: -2, autoAlpha: 0, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: q('.fl-paper')[0], start: 'top 85%' } })
      q('.fl-p').forEach((p) => {
        gsap.fromTo(
          p,
          { autoAlpha: 0, y: 18, clipPath: 'inset(0% 100% 0% 0%)' },
          { autoAlpha: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power2.inOut', scrollTrigger: { trigger: p, start: 'top 86%' } },
        )
      })
      gsap.from(q('.fl-sign'), { autoAlpha: 0, y: 20, duration: 1.2, ease: 'power2.out', scrollTrigger: { trigger: q('.fl-sign')[0], start: 'top 90%' } })
      gsap.from(q('.fl-seal'), { scale: 2.4, rotate: -30, autoAlpha: 0, duration: 0.8, ease: 'back.out(2)', scrollTrigger: { trigger: q('.fl-seal')[0], start: 'top 92%' } })
      gsap.from(q('.fl-clip'), { y: -60, rotate: 20, autoAlpha: 0, duration: 1.1, ease: 'back.out(1.6)', scrollTrigger: { trigger: q('.fl-paper')[0], start: 'top 60%' } })
    },
    { scope: root, dependencies: [reduced] },
  )

  return (
    <Section id="letter" sectionRef={root} className="relative overflow-hidden bg-blush-50 px-4 pb-28 sm:pb-40">
      <div aria-hidden className="h-[30vh] bg-gradient-to-b from-night via-[#a77c9b] to-blush-50" />
      <div aria-hidden className="dots-bg absolute inset-x-0 top-[30vh] bottom-0 opacity-50" />

      <div className="relative mx-auto max-w-2xl">
        <p className="eyebrow text-center text-blush-600">The letter</p>
        <h2 className="display mt-3 text-center text-[clamp(2.2rem,6vw,4rem)] text-ink">The part I actually wanted to say</h2>

        <article className="fl-paper paper relative mt-12 rounded-[30px] px-6 py-12 shadow-[0_50px_100px_-50px_rgba(178,54,97,.55)] sm:px-14 sm:py-16">
          <span className="tape -top-3 left-12 -rotate-6" />
          <span className="tape -top-3 right-12 rotate-3" style={{ ['--tape' as string]: 'rgba(157,208,246,.8)' }} />
          {flowers && (
            <div className="fl-clip absolute -top-14 -right-6 hidden w-40 lg:-right-28 lg:block">
              <Polaroid photo={flowers} rotate={8} tape="none" caption="you deserve flowers." sizes="160px" />
              <span aria-hidden className="absolute -top-4 left-8 h-12 w-4 rounded-full border-[3px] border-[#9aa8b4]" />
            </div>
          )}

          <p className="fl-p hand text-5xl text-ink">Khushboo,</p>

          <div className="mt-8 space-y-7 text-[1.15rem] leading-[1.8] text-ink-soft sm:text-[1.25rem]">
            {LETTER.map((para, i) =>
              Array.isArray(para) ? (
                <div key={i} className="fl-p space-y-1">
                  {para.map((line) => (
                    <p key={line} className={line.startsWith('So I’m sorry') ? 'font-semibold text-ink' : undefined}>
                      {line}
                    </p>
                  ))}
                </div>
              ) : (
                <p key={i} className="fl-p">
                  {para}
                </p>
              ),
            )}
          </div>

          <div className="fl-sign mt-12 space-y-3">
            <p className="display text-3xl text-ink italic sm:text-4xl">
              I’m sorry. <span className="text-blush-500 not-italic">❤️</span>
            </p>
            <p className="text-lg font-semibold text-ink">And yes — unfortunately for both of us — you’re stuck with me.</p>
            <div className="pt-4">
              <p className="hand text-5xl text-blush-600">— Yash</p>
              <Doodle name="underline" className="-mt-1 w-44 text-blush-400" strokeWidth={3} />
            </div>
          </div>

          <div className="fl-seal absolute -bottom-8 left-1/2 grid h-16 w-16 -translate-x-1/2 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#ff8fb0,#d94a75_70%)] text-2xl text-white shadow-[0_6px_14px_rgba(178,54,97,.5),inset_0_-3px_6px_rgba(0,0,0,.15)]">
            ♥
          </div>
        </article>
      </div>
    </Section>
  )
}
