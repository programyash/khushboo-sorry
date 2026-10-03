/**
 * Photo inventory.
 *
 * Source: the 20 screenshots in the project root. One (214004) was an unusable
 * fragment and was dropped; the rest were cropped (Instagram dots, arrows, frames
 * and "Play" labels removed) and exported to WebP in two sizes.
 *
 * Every photo is of Khushboo on her own, so captions only joke about what is
 * actually visible — no invented events.
 */
const files = import.meta.glob('../assets/photos/*.webp', { eager: true, import: 'default' }) as Record<string, string>

export type PhotoCategory =
  | 'festive'
  | 'travel'
  | 'rooftop'
  | 'night'
  | 'glam'
  | 'selfie'
  | 'celebration'
  | 'cafe'
  | 'adventure'
  | 'casual'

export type PhotoId =
  | 'river-mountains'
  | 'lehenga-pose'
  | 'lehenga-twirl'
  | 'lehenga-side'
  | 'rooftop-teal'
  | 'rooftop-flowers'
  | 'night-stripes'
  | 'armchair-stripes'
  | 'wall-lean'
  | 'red-dress'
  | 'mirror-floral'
  | 'mirror-leaves'
  | 'snow-lake'
  | 'birthday-white'
  | 'cafe-cocoa'
  | 'hearts-selfie'
  | 'red-cafe'
  | 'bike-night'
  | 'bike-pov'

export interface Photo {
  id: PhotoId
  src: string
  srcSm: string
  w: number
  h: number
  /** Average colour, used as the placeholder while the image loads. */
  color: string
  alt: string
  caption: string
  /** Museum plaque "medium" line. */
  medium: string
  category: PhotoCategory
  /** object-position that keeps the face in frame when cropped. */
  focus?: string
}

type RawPhoto = Omit<Photo, 'src' | 'srcSm'>

const RAW: RawPhoto[] = [
  {
    id: 'river-mountains', w: 801, h: 803, color: '#ccc8b9', category: 'travel', focus: '50% 40%',
    alt: 'Khushboo on a rocky riverbank with green mountains behind her, wearing sunglasses and a pink top',
    caption: 'Main character energy. The mountains were just extras.',
    medium: 'Sunglasses, river, confidence',
  },
  {
    id: 'lehenga-pose', w: 541, h: 760, color: '#564c44', category: 'festive', focus: '50% 22%',
    alt: 'Khushboo in a teal lehenga with silver jewellery, playing with her hair',
    caption: 'Festival mode: activated.',
    medium: 'Lehenga, jhumkas, zero chill',
  },
  {
    id: 'lehenga-twirl', w: 490, h: 762, color: '#3e413f', category: 'festive', focus: '50% 18%',
    alt: 'Khushboo smiling mid-twirl in a flared teal lehenga',
    caption: 'The twirl. Witnesses confirm it was elite.',
    medium: 'Pure spin',
  },
  {
    id: 'lehenga-side', w: 481, h: 721, color: '#61554d', category: 'festive', focus: '50% 20%',
    alt: 'Khushboo in a teal lehenga looking away from the camera with a hand in her hair',
    caption: 'Pretending not to notice the camera. Classic.',
    medium: 'Acting skills (Oscar pending)',
  },
  {
    id: 'rooftop-teal', w: 532, h: 736, color: '#849da2', category: 'rooftop', focus: '55% 30%',
    alt: 'Khushboo on a rooftop terrace in a long teal dress holding a white handbag, city skyline behind',
    caption: 'Looks calm. Do not be fooled.',
    medium: 'Teal, skyline, suspicious calm',
  },
  {
    id: 'rooftop-flowers', w: 496, h: 705, color: '#809eaa', category: 'rooftop', focus: '50% 35%',
    alt: 'Khushboo smiling in sunglasses on a rooftop, holding a small bouquet of red and white flowers',
    caption: 'Someone deserved flowers. Correct.',
    medium: 'Bouquet, sunglasses, blue sky',
  },
  {
    id: 'night-stripes', w: 508, h: 758, color: '#79705d', category: 'night', focus: '50% 30%',
    alt: 'Khushboo at night in a black and white striped jacket outside a glowing building',
    caption: 'Dressed like the plot twist.',
    medium: 'Stripes, city lights',
  },
  {
    id: 'armchair-stripes', w: 506, h: 772, color: '#9f927d', category: 'casual', focus: '50% 25%',
    alt: 'Khushboo sitting cross-legged in a floral armchair wearing a striped jacket',
    caption: 'Sitting like she owns the place. She might.',
    medium: 'Armchair diplomacy',
  },
  {
    id: 'wall-lean', w: 369, h: 762, color: '#af9f97', category: 'casual', focus: '50% 18%',
    alt: 'Khushboo leaning against a wall on a terrace in a tie-dye shrug, smiling',
    caption: 'This was before the argument.',
    medium: 'Wall, lean, innocence (fake)',
  },
  {
    id: 'red-dress', w: 463, h: 601, color: '#917465', category: 'glam', focus: '50% 25%',
    alt: 'Khushboo in a red dress tucking her hair behind her ear',
    caption: 'No further questions.',
    medium: 'Red, unbothered',
  },
  {
    id: 'mirror-floral', w: 455, h: 610, color: '#95958c', category: 'selfie', focus: '50% 30%',
    alt: 'Khushboo taking a mirror selfie in a floral top and sunglasses, holding a brown bag',
    caption: 'The mirror was also impressed.',
    medium: 'Mirror, phone, sunglasses indoors',
  },
  {
    id: 'mirror-leaves', w: 463, h: 601, color: '#857c74', category: 'selfie', focus: '50% 25%',
    alt: 'Khushboo taking a mirror selfie in a rust top in front of leafy wallpaper',
    caption: 'Mirror selfie no. 4,281. Still iconic.',
    medium: 'Bathroom lighting (elite)',
  },
  {
    id: 'snow-lake', w: 463, h: 624, color: '#9a9696', category: 'travel', focus: '50% 40%',
    alt: 'Khushboo in a striped dress by a fence at a frozen mountain lake with snowy peaks',
    caption: 'Colder than you during a fight. Barely.',
    medium: 'Snow, lake, iconic boots',
  },
  {
    id: 'birthday-white', w: 467, h: 599, color: '#915241', category: 'celebration', focus: '50% 22%',
    alt: 'Khushboo in a white dress in front of a red brick wall with gold letter balloons',
    caption: 'Celebration certified. Cake status: unknown.',
    medium: 'Gold balloons, white dress',
  },
  {
    id: 'cafe-cocoa', w: 337, h: 583, color: '#a5969a', category: 'cafe', focus: '50% 40%',
    alt: 'Khushboo at a café table with a hot chocolate, mehendi on her hands, looking to the side and smiling',
    caption: 'Hot chocolate + mehendi + that smile. Dangerous combo.',
    medium: 'Cocoa, mehendi, side-eye',
  },
  {
    id: 'hearts-selfie', w: 343, h: 615, color: '#373636', category: 'selfie', focus: '50% 30%',
    alt: 'Black and white selfie of Khushboo smiling with a crown of pink hearts above her head',
    caption: 'Evidence.',
    medium: 'Black & white, hearts included',
  },
  {
    id: 'red-cafe', w: 462, h: 586, color: '#735d56', category: 'glam', focus: '50% 25%',
    alt: 'Khushboo in a red off-shoulder top sitting cross-legged on a pink café chair',
    caption: 'Posing like the bill is my problem.',
    medium: 'Red, legs crossed, bill pending',
  },
  {
    id: 'bike-night', w: 473, h: 532, color: '#585158', category: 'adventure', focus: '40% 50%',
    alt: 'Khushboo riding a motorbike on a road at night',
    caption: 'WANTED: for riding cooler than me.',
    medium: 'Bike, night, audacity',
  },
  {
    id: 'bike-pov', w: 468, h: 522, color: '#736d65', category: 'adventure', focus: '50% 50%',
    alt: 'View over Khushboo’s shoulder as she rides a motorbike down a quiet country road',
    caption: 'POV: you’re braver than me and you know it.',
    medium: 'Open road, zero fear',
  },
]

function resolve(id: string, small: boolean) {
  return files[`../assets/photos/${id}${small ? '-sm' : ''}.webp`]
}

export const PHOTOS: Photo[] = RAW.flatMap((p) => {
  const src = resolve(p.id, false)
  if (!src) {
    if (import.meta.env.DEV) console.warn(`[photos] missing image for "${p.id}" — skipped`)
    return []
  }
  return [{ ...p, src, srcSm: resolve(p.id, true) ?? src }]
})

const byId = new Map(PHOTOS.map((p) => [p.id, p]))

export function photo(id: PhotoId): Photo | undefined {
  return byId.get(id)
}

/** Resolve a list of ids, silently dropping any that failed to load at build time. */
export function photos(ids: PhotoId[]): Photo[] {
  return ids.map((id) => byId.get(id)).filter((p): p is Photo => Boolean(p))
}

/** Photos reserved for hidden easter eggs (kept out of the main museum). */
export const SECRET_PHOTO: PhotoId = 'hearts-selfie'
export const STAFF_ONLY_PHOTO: PhotoId = 'bike-night'
