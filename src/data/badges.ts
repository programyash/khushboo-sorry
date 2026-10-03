export type BadgeId = 'survived' | 'fighter' | 'idiot' | 'crime' | 'pasta' | 'hunter' | 'friends'

export interface Badge {
  id: BadgeId
  emoji: string
  title: string
  how: string
}

export const BADGES: Badge[] = [
  { id: 'survived', emoji: '🏆', title: 'Survived 10 Years', how: 'Made it through the whole timeline.' },
  { id: 'fighter', emoji: '⚔️', title: 'Professional Fighter', how: 'Witnessed the 7-second fight.' },
  { id: 'idiot', emoji: '😂', title: 'Certified Idiot', how: 'Found guilty by the Friendship Court.' },
  { id: 'crime', emoji: '🔥', title: 'Crime Partner Energy', how: 'Identified the bench partner in crime.' },
  { id: 'pasta', emoji: '🍝', title: 'Pasta Witness', how: 'Remembered the tiffin.' },
  { id: 'hunter', emoji: '🕵️', title: 'Evidence Hunter', how: 'Found something hidden.' },
  { id: 'friends', emoji: '❤️', title: 'Still Friends', how: 'Pressed the right button.' },
]

export const badgeById = Object.fromEntries(BADGES.map((b) => [b.id, b])) as Record<BadgeId, Badge>
