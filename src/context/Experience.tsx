import Lenis from 'lenis'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { badgeById, type BadgeId } from '../data/badges'
import { gsap, ScrollTrigger } from '../lib/gsap'
import { sound } from '../lib/sound'
import { useReducedMotion } from '../hooks/useMedia'

export interface Toast {
  id: number
  kind: 'badge' | 'note'
  emoji: string
  title: string
  sub?: string
}

interface ScrollOpts {
  offset?: number
  immediate?: boolean
  duration?: number
}

interface Experience {
  reduced: boolean
  started: boolean
  start: () => void
  accepted: boolean
  accept: () => void
  soundOn: boolean
  toggleSound: () => void
  badges: BadgeId[]
  unlock: (id: BadgeId) => void
  toasts: Toast[]
  dismissToast: (id: number) => void
  notify: (emoji: string, title: string, sub?: string) => void
  quizFacts: number
  setQuizFacts: (n: number) => void
  pastaRevealed: boolean
  revealPasta: () => void
  scrollTo: (target: string | number | HTMLElement, opts?: ScrollOpts) => void
  lenis: Lenis | null
}

const Ctx = createContext<Experience | null>(null)

export function useExperience() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useExperience must be used inside <ExperienceProvider>')
  return ctx
}

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const [started, setStarted] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [soundOn, setSoundOn] = useState(false)
  const [badges, setBadges] = useState<BadgeId[]>([])
  const [toasts, setToasts] = useState<Toast[]>([])
  const [quizFacts, setQuizFacts] = useState(0)
  const [pastaRevealed, setPastaRevealed] = useState(false)
  const toastId = useRef(0)
  const badgeRef = useRef<BadgeId[]>([])

  // The story always begins at the opening scene.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  // Smooth scrolling (skipped entirely for reduced motion).
  useEffect(() => {
    if (reduced) return
    const l = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.95, touchMultiplier: 1.3 })
    l.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => l.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    setLenis(l)
    return () => {
      gsap.ticker.remove(raf)
      l.destroy()
      setLenis(null)
    }
  }, [reduced])

  // Lock scrolling until the opening button is pressed.
  useEffect(() => {
    const html = document.documentElement
    if (!started) {
      html.classList.add('is-locked')
      lenis?.stop()
    } else {
      html.classList.remove('is-locked')
      lenis?.start()
    }
  }, [started, lenis])

  const scrollTo = useCallback<Experience['scrollTo']>(
    (target, opts = {}) => {
      if (lenis) {
        lenis.scrollTo(target, {
          offset: opts.offset ?? 0,
          immediate: opts.immediate,
          duration: opts.duration ?? 1.8,
          force: true,
        })
        return
      }
      const behavior: ScrollBehavior = opts.immediate || reduced ? 'auto' : 'smooth'
      if (typeof target === 'number') window.scrollTo({ top: target, behavior })
      else {
        const el = typeof target === 'string' ? document.querySelector(target) : target
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + (opts.offset ?? 0), behavior })
      }
    },
    [lenis, reduced],
  )

  const pushToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = ++toastId.current
    setToasts((all) => [...all.slice(-2), { ...t, id }])
    window.setTimeout(() => setToasts((all) => all.filter((x) => x.id !== id)), 3800)
  }, [])

  const unlock = useCallback(
    (id: BadgeId) => {
      if (badgeRef.current.includes(id)) return
      badgeRef.current = [...badgeRef.current, id]
      setBadges(badgeRef.current)
      const b = badgeById[id]
      sound.chime()
      pushToast({ kind: 'badge', emoji: b.emoji, title: b.title, sub: 'Achievement unlocked' })
    },
    [pushToast],
  )

  const notify = useCallback(
    (emoji: string, title: string, sub?: string) => {
      sound.pop()
      pushToast({ kind: 'note', emoji, title, sub })
    },
    [pushToast],
  )

  const toggleSound = useCallback(() => {
    const next = !sound.enabled
    sound.setEnabled(next)
    if (next) sound.pop()
    setSoundOn(next)
  }, [])

  const value = useMemo<Experience>(
    () => ({
      reduced,
      started,
      start: () => setStarted(true),
      accepted,
      accept: () => setAccepted(true),
      soundOn,
      toggleSound,
      badges,
      unlock,
      toasts,
      dismissToast: (id) => setToasts((all) => all.filter((x) => x.id !== id)),
      notify,
      quizFacts,
      setQuizFacts,
      pastaRevealed,
      revealPasta: () => setPastaRevealed(true),
      scrollTo,
      lenis,
    }),
    [reduced, started, accepted, soundOn, toggleSound, badges, unlock, toasts, notify, quizFacts, pastaRevealed, scrollTo, lenis],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
