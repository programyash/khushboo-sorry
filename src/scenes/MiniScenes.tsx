import type { ReactNode } from 'react'
import type { MiniScene as MiniSceneId } from '../data/timeline'
import { Kid } from './Kid'

/** Small illustrated vignettes for timeline years that have no photo. */
export function MiniScene({ id, className }: { id: MiniSceneId; className?: string }) {
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label={LABELS[id]}>
      <rect width="400" height="300" fill={BG[id]} />
      {SCENES[id]}
    </svg>
  )
}

const LABELS: Record<MiniSceneId, string> = {
  bench: 'Illustration: two kids peeking over a shared school desk',
  tiffin: 'Illustration: an open steel tiffin box with a fork sneaking in',
  laugh: 'Illustration: two kids laughing uncontrollably',
  storm: 'Illustration: a storm cloud that turns into sunshine',
  levelup: 'Illustration: a level-up badge',
  chat: 'Illustration: a phone chat that says fine, nothing, okay',
  eyes: 'Illustration: two kids giving each other suspicious side-eye',
}

const BG: Record<MiniSceneId, string> = {
  bench: '#eaf5fd',
  tiffin: '#fff3e8',
  laugh: '#fff0f5',
  storm: '#eef1fb',
  levelup: '#f3eeff',
  chat: '#f6f1ff',
  eyes: '#fff6f9',
}

const Steam = ({ x, y }: { x: number; y: number }) => (
  <g stroke="#c4d6e6" strokeWidth="5" strokeLinecap="round" fill="none" className="loop" style={{ animation: 'float 3s ease-in-out infinite' }}>
    <path d={`M${x} ${y} c -10 -14, 10 -20, 0 -36`} />
    <path d={`M${x + 24} ${y + 4} c -10 -14, 10 -20, 0 -36`} />
    <path d={`M${x + 48} ${y} c -10 -14, 10 -20, 0 -36`} />
  </g>
)

const SCENES: Record<MiniSceneId, ReactNode> = {
  bench: (
    <g>
      <rect x="40" y="40" width="320" height="110" rx="10" fill="#2f4a43" />
      <rect x="40" y="40" width="320" height="110" rx="10" fill="none" stroke="#c79a6b" strokeWidth="8" />
      <text x="200" y="104" textAnchor="middle" fill="#fff" opacity=".85" fontFamily="Caveat Variable, cursive" fontSize="34">seating plan v1.0</text>
      <g transform="translate(78 120) scale(0.9)">
        <Kid who="khushboo" mood="smile" look={0.8} arms="none" legs="none" />
      </g>
      <g transform="translate(196 120) scale(0.9)">
        <Kid who="yash" mood="side" look={0.6} arms="none" legs="none" blinkDelay={1.2} flip />
      </g>
      <rect x="40" y="226" width="320" height="22" rx="6" fill="#d9a77a" />
      <rect x="56" y="248" width="14" height="52" fill="#b98457" />
      <rect x="330" y="248" width="14" height="52" fill="#b98457" />
      <text x="120" y="242" fill="#8b5e3c" fontFamily="Caveat Variable, cursive" fontSize="18">K</text>
      <text x="270" y="242" fill="#8b5e3c" fontFamily="Caveat Variable, cursive" fontSize="18">Y</text>
    </g>
  ),
  tiffin: (
    <g>
      <ellipse cx="200" cy="246" rx="150" ry="22" fill="#f0dcc8" />
      <rect x="110" y="140" width="180" height="100" rx="20" fill="#cfd8e0" />
      <rect x="110" y="140" width="180" height="100" rx="20" fill="url(#steel)" />
      <ellipse cx="200" cy="140" rx="90" ry="22" fill="#e9eef2" stroke="#b8c4ce" strokeWidth="3" />
      <ellipse cx="200" cy="140" rx="74" ry="15" fill="#f7d38a" />
      <circle cx="182" cy="138" r="8" fill="#f3b24f" />
      <circle cx="206" cy="142" r="7" fill="#f3b24f" />
      <circle cx="222" cy="134" r="6" fill="#f3b24f" />
      <text x="200" y="146" textAnchor="middle" fontFamily="Plus Jakarta Sans Variable, sans-serif" fontWeight="800" fontSize="13" fill="#b23661" letterSpacing="2">CLASSIFIED</text>
      <Steam x={168} y={108} />
      <g transform="rotate(-28 320 100)">
        <rect x="300" y="40" width="12" height="120" rx="6" fill="#9aa8b4" />
        <path d="M292 40 L292 10 M302 40 L302 6 M312 40 L312 6 M322 40 L322 10" stroke="#9aa8b4" strokeWidth="6" strokeLinecap="round" />
      </g>
      <defs>
        <linearGradient id="steel" x1="0" x2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".5" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#7d8a96" stopOpacity=".25" />
        </linearGradient>
      </defs>
    </g>
  ),
  laugh: (
    <g>
      <g transform="translate(64 70) scale(1.15)">
        <g className="loop" style={{ animation: 'bob .5s ease-in-out infinite' }}>
          <Kid who="khushboo" mood="laugh" arms="none" legs="none" />
        </g>
      </g>
      <g transform="translate(176 76) scale(1.15)">
        <g className="loop" style={{ animation: 'bob .55s ease-in-out .1s infinite' }}>
          <Kid who="yash" mood="laugh" arms="none" legs="none" />
        </g>
      </g>
      <g fontFamily="Caveat Variable, cursive" fontWeight="700" fill="#f2678f">
        <text x="30" y="60" fontSize="40" transform="rotate(-12 30 60)">HAHA</text>
        <text x="290" y="56" fontSize="36" transform="rotate(10 290 56)">HAHA</text>
        <text x="300" y="250" fontSize="22" fill="#8b7a8f">(nobody else got it)</text>
      </g>
    </g>
  ),
  storm: (
    <g>
      <g className="loop" style={{ animation: 'spin 20s linear infinite', transformOrigin: '300px 90px' }}>
        {Array.from({ length: 10 }).map((_, i) => (
          <path key={i} d="M300 90 L304 40 L296 40 Z" fill="#ffd36e" transform={`rotate(${i * 36} 300 90)`} />
        ))}
      </g>
      <circle cx="300" cy="90" r="34" fill="#ffc94a" />
      <path d="M70 170 C 40 170, 40 130, 72 130 C 72 96, 120 88, 134 116 C 146 84, 206 90, 200 130 C 236 126, 240 170, 206 170 Z" fill="#8d97b3" />
      <path d="M128 172 L112 210 L132 210 L118 250" stroke="#ffd36e" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <g stroke="#9dd0f6" strokeWidth="5" strokeLinecap="round">
        <path d="M80 190 l-6 16" />
        <path d="M160 188 l-6 16" />
        <path d="M190 196 l-6 16" />
      </g>
      <text x="285" y="262" textAnchor="middle" fontFamily="Caveat Variable, cursive" fontSize="27" fill="#2b1d2f">lasted until lunch.</text>
    </g>
  ),
  levelup: (
    <g>
      <path d="M200 40 L300 90 L300 190 L200 250 L100 190 L100 90 Z" fill="#c8b6f6" />
      <path d="M200 62 L280 102 L280 180 L200 228 L120 180 L120 102 Z" fill="#fff" />
      <path d="M200 92 L240 140 L216 140 L216 186 L184 186 L184 140 L160 140 Z" fill="#9a7ee6" />
      <text x="200" y="282" textAnchor="middle" fontFamily="Plus Jakarta Sans Variable, sans-serif" fontWeight="800" fontSize="24" letterSpacing="6" fill="#2b1d2f">LEVEL UP</text>
      {[
        [70, 70],
        [330, 60],
        [340, 220],
        [60, 230],
      ].map(([x, y], i) => (
        <path
          key={i}
          d={`M${x} ${y - 14} C ${x + 1} ${y - 4}, ${x + 4} ${y - 1}, ${x + 14} ${y} C ${x + 4} ${y + 1}, ${x + 1} ${y + 4}, ${x} ${y + 14} C ${x - 1} ${y + 4}, ${x - 4} ${y + 1}, ${x - 14} ${y} C ${x - 4} ${y - 1}, ${x - 1} ${y - 4}, ${x} ${y - 14} Z`}
          fill="#ffb3c9"
          className="loop"
          style={{ animation: `twinkle 2.4s ease-in-out ${i * 0.4}s infinite`, transformBox: 'fill-box', transformOrigin: 'center' }}
        />
      ))}
    </g>
  ),
  chat: (
    <g>
      <rect x="120" y="20" width="160" height="270" rx="28" fill="#2b1d2f" />
      <rect x="130" y="40" width="140" height="232" rx="16" fill="#fff" />
      <g fontFamily="Plus Jakarta Sans Variable, sans-serif" fontSize="15" fontWeight="600">
        <rect x="142" y="58" width="74" height="30" rx="15" fill="#eef1f6" />
        <text x="156" y="78" fill="#2b1d2f">what?</text>
        <rect x="200" y="98" width="58" height="30" rx="15" fill="#ff8fb0" />
        <text x="214" y="118" fill="#fff">fine.</text>
        <rect x="142" y="138" width="110" height="30" rx="15" fill="#eef1f6" />
        <text x="156" y="158" fill="#2b1d2f">what happened</text>
        <rect x="186" y="178" width="72" height="30" rx="15" fill="#ff8fb0" />
        <text x="198" y="198" fill="#fff">nothing.</text>
        <rect x="142" y="218" width="44" height="30" rx="15" fill="#eef1f6" />
        <text x="156" y="238" fill="#2b1d2f">ok.</text>
      </g>
      <text x="292" y="150" fontFamily="Caveat Variable, cursive" fontSize="26" fill="#9a7ee6" transform="rotate(8 292 150)">it was</text>
      <text x="292" y="178" fontFamily="Caveat Variable, cursive" fontSize="26" fill="#9a7ee6" transform="rotate(8 292 178)">not nothing</text>
    </g>
  ),
  eyes: (
    <g>
      <g transform="translate(40 70) scale(1.2)">
        <Kid who="khushboo" mood="side" look={1} arms="none" legs="none" />
      </g>
      <g transform="translate(192 70) scale(1.2)">
        <Kid who="yash" mood="side" look={1} arms="none" legs="none" flip />
      </g>
      <text x="200" y="64" textAnchor="middle" fontSize="38">👀</text>
    </g>
  ),
}
