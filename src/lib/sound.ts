/**
 * Tiny synthesized sound kit (no audio files). Everything is muted until the
 * visitor turns sound on, and the AudioContext is only created after that click,
 * so browser autoplay rules are respected.
 */
type ToneOpts = {
  type?: OscillatorType
  gain?: number
  attack?: number
  when?: number
  slideTo?: number
  dest?: AudioNode
}

const PENTATONIC = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51]

class SoundEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private echo: GainNode | null = null
  private ambientTimer: number | undefined
  enabled = false

  private ensure() {
    if (!this.ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AC) return null
      const ctx = new AC()
      const master = ctx.createGain()
      master.gain.value = 0.55
      master.connect(ctx.destination)
      // A soft feedback delay gives the music box a little room.
      const delay = ctx.createDelay(1)
      delay.delayTime.value = 0.36
      const feedback = ctx.createGain()
      feedback.gain.value = 0.32
      const wet = ctx.createGain()
      wet.gain.value = 0.35
      delay.connect(feedback).connect(delay)
      delay.connect(wet).connect(master)
      const echo = ctx.createGain()
      echo.connect(delay)
      echo.connect(master)
      this.echo = echo
      this.ctx = ctx
      this.master = master
      document.addEventListener('visibilitychange', () => {
        if (!this.ctx) return
        if (document.hidden) void this.ctx.suspend()
        else if (this.enabled) void this.ctx.resume()
      })
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume()
    return this.ctx
  }

  setEnabled(on: boolean) {
    this.enabled = on
    if (on) {
      this.ensure()
      this.startAmbient()
    } else {
      this.stopAmbient()
    }
  }

  private tone(freq: number, dur: number, o: ToneOpts = {}) {
    if (!this.enabled) return
    const ctx = this.ensure()
    if (!ctx || !this.master) return
    const t0 = ctx.currentTime + (o.when ?? 0)
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = o.type ?? 'sine'
    osc.frequency.setValueAtTime(freq, t0)
    if (o.slideTo) osc.frequency.exponentialRampToValueAtTime(o.slideTo, t0 + dur)
    const peak = o.gain ?? 0.2
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(peak, t0 + (o.attack ?? 0.006))
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
    osc.connect(g).connect(o.dest ?? this.master)
    osc.start(t0)
    osc.stop(t0 + dur + 0.05)
  }

  private noise(dur: number, freq: number, gain = 0.2, when = 0) {
    if (!this.enabled) return
    const ctx = this.ensure()
    if (!ctx || !this.master) return
    const t0 = ctx.currentTime + when
    const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
    const src = ctx.createBufferSource()
    src.buffer = buffer
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = freq
    filter.Q.value = 0.8
    const g = ctx.createGain()
    g.gain.value = gain
    src.connect(filter).connect(g).connect(this.master)
    src.start(t0)
  }

  pop() {
    this.tone(480, 0.14, { slideTo: 1100, gain: 0.16 })
  }
  click() {
    this.tone(1500, 0.05, { type: 'triangle', gain: 0.05 })
  }
  tick() {
    this.tone(2200, 0.03, { type: 'square', gain: 0.02 })
  }
  chime() {
    const notes = [1046.5, 1318.51, 1567.98]
    notes.forEach((f, i) => this.tone(f, 0.6, { when: i * 0.07, gain: 0.09, dest: this.echo ?? undefined }))
  }
  boing() {
    this.tone(320, 0.4, { slideTo: 90, type: 'triangle', gain: 0.18 })
  }
  page() {
    this.noise(0.32, 1800, 0.22)
  }
  whoosh() {
    this.noise(0.6, 700, 0.18)
  }
  gavel() {
    this.tone(150, 0.3, { slideTo: 55, gain: 0.5 })
    this.noise(0.09, 400, 0.4)
  }
  stamp() {
    this.tone(110, 0.18, { slideTo: 60, gain: 0.35 })
    this.noise(0.06, 900, 0.25)
  }
  celebrate() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98, 2093]
    notes.forEach((f, i) => this.tone(f, 0.7, { when: i * 0.08, gain: 0.1, dest: this.echo ?? undefined }))
    for (let i = 0; i < 8; i++) this.tone(2400 + Math.random() * 1600, 0.2, { when: 0.6 + i * 0.07, gain: 0.03 })
  }

  private startAmbient() {
    if (this.ambientTimer !== undefined) return
    const play = () => {
      if (!this.enabled) return
      const f = PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)]
      this.tone(f, 1.6, { gain: 0.028, attack: 0.01, dest: this.echo ?? undefined })
      if (Math.random() < 0.3) this.tone(f / 2, 2.2, { gain: 0.018, attack: 0.02, dest: this.echo ?? undefined })
      this.ambientTimer = window.setTimeout(play, 850 + Math.random() * 1100)
    }
    this.ambientTimer = window.setTimeout(play, 400)
  }

  private stopAmbient() {
    if (this.ambientTimer !== undefined) window.clearTimeout(this.ambientTimer)
    this.ambientTimer = undefined
  }
}

export const sound = new SoundEngine()
