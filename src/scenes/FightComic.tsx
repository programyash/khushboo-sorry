import type { ReactNode } from 'react'
import { Kid } from './Kid'
import { Bubble } from './parts'

/** Four-panel comic: the 7-second fight. */
export const FIGHT_PANELS: { id: string; label: string; caption?: string; svg: ReactNode }[] = [
  {
    id: 'p1',
    label: 'Panel 1: Yash, arms crossed and furious, turns away and says “I’m never talking to you again.”',
    svg: (
      <>
        <rect width="400" height="320" fill="#efe8ff" />
        <path d="M290 40 c -14 0 -14 -18 0 -18 c 0 -16 24 -18 28 -4 c 8 -14 34 -8 30 8 c 16 0 16 18 0 18 Z" fill="#8d97b3" />
        <path d="M312 50 l -8 18 h 10 l -6 16" stroke="#ffd36e" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <g transform="translate(40 120) scale(0.95)">
          <Kid who="khushboo" mood="shocked" look={1} arms="down" />
        </g>
        <g transform="translate(220 112)">
          <Kid who="yash" mood="angry" arms="crossed" flip />
        </g>
        <Bubble x={150} y={34} w={216} h={60} text="I’m never talking to you again." size={21} tail="down-right" />
      </>
    ),
  },
  {
    id: 'p2',
    label: 'Panel 2: three seconds later, Khushboo holds out a tiffin and asks “Want some food?”',
    caption: '3 seconds later…',
    svg: (
      <>
        <rect width="400" height="320" fill="#fff3e8" />
        <g transform="translate(40 116)">
          <Kid who="khushboo" mood="happy" arms="offer">
            <g transform="translate(120 98)">
              <rect x="0" y="0" width="44" height="22" rx="6" fill="#cfd8e0" />
              <ellipse cx="22" cy="0" rx="22" ry="7" fill="#f7d38a" stroke="#b8c4ce" strokeWidth="2" />
              <path d="M12 -8 c -4 -6 4 -8 0 -16 M28 -8 c -4 -6 4 -8 0 -16" stroke="#c4d6e6" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>
          </Kid>
        </g>
        <g transform="translate(236 116)">
          <Kid who="yash" mood="side" look={-1} arms="crossed" />
        </g>
        <Bubble x={26} y={40} w={170} h={52} text="Want some food?" size={24} tail="down-left" />
      </>
    ),
  },
  {
    id: 'p3',
    label: 'Panel 3: Yash, with heart eyes, immediately says “…okay.”',
    caption: 'Principles: 0 · Hunger: 100',
    svg: (
      <>
        <rect width="400" height="320" fill="#fff0f5" />
        {Array.from({ length: 14 }).map((_, i) => (
          <path key={i} d="M200 190 L206 0 L194 0 Z" fill="#ffd3e0" transform={`rotate(${i * 25.7} 200 190)`} />
        ))}
        <g transform="translate(110 72) scale(1.25)">
          <Kid who="yash" mood="love" arms="up" />
        </g>
        <Bubble x={250} y={40} w={110} h={52} text="…okay." size={28} tail="down-left" />
      </>
    ),
  },
  {
    id: 'p4',
    label: 'Panel 4: the two of them walk away together, happy, sharing the tiffin',
    caption: 'Fight duration: 7 seconds. A new record.',
    svg: (
      <>
        <rect width="400" height="320" fill="#e8f6ee" />
        <rect y="268" width="400" height="52" fill="#cdeccb" />
        <g fill="#ff8fb0">
          <path d="M80 60 c -4 -6 -12 -2 -8 4 l 8 8 l 8 -8 c 4 -6 -4 -10 -8 -4 Z" />
          <path d="M320 50 c -4 -6 -12 -2 -8 4 l 8 8 l 8 -8 c 4 -6 -4 -10 -8 -4 Z" />
          <path d="M200 30 c -5 -7 -15 -2 -10 5 l 10 10 l 10 -10 c 5 -7 -5 -12 -10 -5 Z" />
        </g>
        <g transform="translate(70 86)">
          <Kid who="khushboo" mood="laugh" arms="down" />
        </g>
        <g transform="translate(190 86)">
          <Kid who="yash" mood="happy" arms="down" />
        </g>
        <g transform="translate(176 230)">
          <rect x="0" y="0" width="40" height="20" rx="6" fill="#cfd8e0" />
          <ellipse cx="20" cy="0" rx="20" ry="6" fill="#f7d38a" stroke="#b8c4ce" strokeWidth="2" />
        </g>
      </>
    ),
  },
]
