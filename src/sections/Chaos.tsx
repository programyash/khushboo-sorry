import { useRef, useState } from 'react'
import { Section } from '../components/Section'
import { useExperience } from '../context/Experience'
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap'
import { sound } from '../lib/sound'
import { FIGHT_PANELS } from '../scenes/FightComic'
import { JealousyScene } from '../scenes/JealousyScene'
import type { KidMood } from '../scenes/Kid'

/** Friendship Chaos: the 7-second fight (comic) and the jealousy arc (with meters). */
export function Chaos() {
  const { reduced, unlock, notify } = useExperience()
  const root = useRef<HTMLElement>(null)
  const [yMood, setYMood] = useState<KidMood>(reduced ? 'forced' : 'side')

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      if (reduced) {
        ScrollTrigger.create({ trigger: q('.fc-grid')[0], start: 'top 60%', once: true, onEnter: () => unlock('fighter') })
        gsap.set([q('.jl-fine'), q('.jl-eyes')], { autoAlpha: 1 })
        gsap.set(q('.jl-yash'), { x: 120 })
        q('.meter-anger-n').forEach((n) => (n.textContent = '97'))
        gsap.set(q('.meter-anger'), { scaleX: 0.97 })
        return
      }

      // ── the fight comic: panels pop in like a comic being drawn ──
      const comic = gsap.timeline({
        scrollTrigger: { trigger: q('.fc-grid')[0], start: 'top 70%' },
        onComplete: () => unlock('fighter'),
      })
      q('.fc-panel').forEach((panel, i) => {
        comic.from(panel, { scale: 0.6, rotate: i % 2 ? 10 : -10, autoAlpha: 0, duration: 0.6, ease: 'back.out(2.2)', onStart: () => sound.pop() }, i * 0.75)
        const cap = panel.querySelector('.fc-cap')
        if (cap) comic.from(cap, { y: -16, autoAlpha: 0, duration: 0.4, ease: 'back.out(3)' }, i * 0.75 + 0.35)
      })

      // ── jealousy: creep, peek, "I'm completely fine", meters ──
      gsap.set(q('.jl-yash'), { x: -70 })
      gsap.set(q('.meter-anger'), { scaleX: 0 })
      const jl = gsap.timeline({ scrollTrigger: { trigger: q('.jl-stage')[0], start: 'top 65%' } })
      const anger = { v: 0 }
      jl.from(q('.jl-chat > *'), { scale: 0.4, autoAlpha: 0, stagger: 0.35, duration: 0.5, ease: 'back.out(3)', transformOrigin: '50% 100%' })
        .to(q('.jl-yash'), { x: 0, duration: 1.4, ease: 'power1.inOut' }, 0.9)
        .to(q('.jl-yash'), { x: 30, duration: 0.6, ease: 'power2.out' }, 2.6)
        .to(q('.jl-eyes'), { autoAlpha: 1, duration: 0.2 }, 2.7)
        .from(q('.jl-eyes'), { scale: 0.2, duration: 0.5, ease: 'back.out(3)', transformOrigin: '150px 150px' }, 2.7)
        .to(q('.jl-eyes'), { autoAlpha: 0, duration: 0.3 }, 3.6)
        .call(() => setYMood('forced'), undefined, 3.7)
        .to(q('.jl-yash'), { x: 120, duration: 0.5, ease: 'back.out(1.8)' }, 3.7)
        .fromTo(q('.jl-fine'), { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(3)', transformOrigin: '175px 150px' }, 4.1)
        .from(q('.meter-card'), { x: 60, autoAlpha: 0, stagger: 0.25, duration: 0.6, ease: 'back.out(2)' }, 4.4)
        .to(q('.meter-anger'), { scaleX: 0.97, duration: 1.6, ease: 'power2.out' }, 4.8)
        .to(anger, { v: 97, duration: 1.6, ease: 'power2.out', onUpdate: () => q('.meter-anger-n').forEach((n) => (n.textContent = String(Math.round(anger.v)))) }, 4.8)
        .to(q('.meter-classified'), { duration: 1.2, scrambleText: { text: 'CLASSIFIED', chars: '█▓▒░#?!', speed: 0.6 } }, 5)
        .add(() => sound.boing(), 6.2)
        .add(() => overthink.play(), 6.4)

      // the overthinking meter never stops climbing
      const over = { v: 100 }
      const overthink = gsap.timeline({ paused: true, repeat: -1, repeatDelay: 0.8 })
      overthink
        .set(over, { v: 100 })
        .to(over, {
          v: 999,
          duration: 3.2,
          ease: 'power2.in',
          onUpdate: () => q('.meter-over-n').forEach((n) => (n.textContent = `${Math.round(over.v)}%`)),
        })
        .to(q('.meter-over'), { scaleX: 1, duration: 3.2, ease: 'power2.in' }, 0)
        .to(q('.meter-over-n'), { duration: 0.6, scrambleText: { text: 'ERROR: meter broke', chars: '!?#', speed: 1 } })
        .to(q('.meter-over'), { scaleX: 0.2, duration: 0.4 }, '+=1.4')
      ScrollTrigger.create({
        trigger: q('.jl-stage')[0],
        start: 'top bottom',
        end: 'bottom top',
        onLeave: () => overthink.pause(),
        onLeaveBack: () => overthink.pause(),
        onEnter: () => jl.progress() === 1 && overthink.play(),
        onEnterBack: () => jl.progress() === 1 && overthink.play(),
      })
    },
    { scope: root, dependencies: [reduced] },
  )

  return (
    <Section id="chaos" sectionRef={root} className="relative overflow-hidden bg-white px-4 py-24 sm:py-32">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_40%_at_10%_0%,#f1ebff_0%,transparent_70%),radial-gradient(50%_40%_at_100%_40%,#fff0f5_0%,transparent_70%)]" />
      <div className="relative mx-auto max-w-6xl">
        <header className="text-center">
          <p className="eyebrow text-lilac-500">Chapter: the chaos years</p>
          <h2 className="display mt-3 text-[clamp(2.6rem,7vw,5.2rem)] text-ink">
            Friendship <em className="text-lilac-500">chaos</em>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">A documentary in two parts. Based on true events. Dramatised only slightly.</p>
        </header>

        {/* ── Part 1: the fight ── */}
        <div className="mt-16 flex items-end justify-between gap-4 sm:mt-20">
          <div>
            <p className="eyebrow text-blush-600">Part 1</p>
            <h3 className="display mt-1 text-3xl text-ink sm:text-4xl">The fight (a classic)</h3>
          </div>
          <button
            type="button"
            onClick={() => notify('😤', 'The argument department is currently closed.', 'Complaints desk')}
            aria-label="An angry face sticker"
            className="sticker shrink-0 text-4xl transition-transform hover:scale-110 sm:text-5xl"
          >
            😤
          </button>
        </div>

        <div className="fc-grid mt-6 grid gap-5 sm:grid-cols-2 lg:gap-7">
          {FIGHT_PANELS.map((p, i) => (
            <figure
              key={p.id}
              className="fc-panel relative overflow-hidden rounded-[20px] border-[3px] border-ink bg-white shadow-[6px_6px_0_#2b1d2f]"
              style={{ rotate: `${[-1, 1.2, 0.8, -1.2][i]}deg` }}
            >
              <svg viewBox="0 0 400 320" className="block h-auto w-full" role="img" aria-label={p.label}>
                {p.svg}
              </svg>
              <span className="absolute top-3 left-3 grid h-8 w-8 place-items-center rounded-full border-2 border-ink bg-white text-sm font-black">{i + 1}</span>
              {p.caption && (
                <figcaption className="fc-cap absolute right-3 bottom-3 left-3 rounded-xl border-2 border-ink bg-[#fff3a8] px-3 py-1.5 text-center text-sm font-bold text-ink sm:text-[0.95rem]">
                  {p.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>

        {/* ── Part 2: jealousy ── */}
        <div className="mt-28 sm:mt-36">
          <p className="eyebrow text-blush-600">Part 2</p>
          <h3 className="display mt-1 text-3xl text-ink sm:text-4xl">The jealousy arc</h3>
          <p className="mt-2 max-w-lg text-ink-soft">Scene: one of us is talking to someone else. The other one is “completely fine.”</p>

          <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1.6fr_1fr]">
            <figure className="jl-stage overflow-hidden rounded-[28px] border-[6px] border-white bg-white shadow-[0_40px_80px_-40px_rgba(43,29,47,.45)]">
              <JealousyScene yMood={yMood} className="block h-auto w-full" />
            </figure>

            <div className="space-y-4" aria-live="off">
              <div className="meter-card rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
                <div className="flex items-baseline justify-between">
                  <p className="text-xs font-extrabold tracking-[0.2em] text-ink">ANGER LEVEL</p>
                  <p className="font-mono text-2xl font-bold text-alert">
                    <span className="meter-anger-n">0</span>%
                  </p>
                </div>
                <div className="mt-3 h-3 overflow-hidden rounded-full bg-ink/5">
                  <div className="meter-anger h-full origin-left rounded-full bg-gradient-to-r from-[#ffb36b] to-alert" />
                </div>
              </div>
              <div className="meter-card rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
                <p className="text-xs font-extrabold tracking-[0.2em] text-ink">JEALOUSY LEVEL</p>
                <p className="mt-2 inline-block rounded bg-ink px-3 py-1 font-mono text-xl font-bold tracking-widest text-white">
                  <span className="meter-classified">██████████</span>
                </p>
              </div>
              <div className="meter-card rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-xs font-extrabold tracking-[0.2em] text-ink">OVERTHINKING</p>
                  <p className="meter-over-n font-mono text-sm font-bold text-lilac-500">100%</p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink/5">
                  <div className="meter-over h-full origin-left rounded-full bg-lilac-300" style={{ transform: 'scaleX(0.2)' }} />
                </div>
              </div>
              <p className="hand px-1 text-xl text-ink-mute">*this happened in both directions. nobody here is innocent.</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}
