export interface Sticker {
  id: string
  name: string
  pack: string
  svg: string
}

export const STICKER_PACKS = ['Fun', 'Shapes', 'Nature'] as const
export type StickerPack = typeof STICKER_PACKS[number]

export const STICKERS: Sticker[] = [
  {
    id: 'star-burst',
    name: 'Star Burst',
    pack: 'Fun',
    svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="#FFD700"/></svg>',
  },
  {
    id: 'heart',
    name: 'Heart',
    pack: 'Fun',
    svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 88 C25 65 5 50 5 30 C5 15 17 5 30 5 C38 5 46 10 50 18 C54 10 62 5 70 5 C83 5 95 15 95 30 C95 50 75 65 50 88Z" fill="#FF6B6B"/></svg>',
  },
  {
    id: 'smiley',
    name: 'Smiley',
    pack: 'Fun',
    svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#FFE066"/><circle cx="35" cy="40" r="5" fill="#333"/><circle cx="65" cy="40" r="5" fill="#333"/><path d="M30 60 Q50 80 70 60" stroke="#333" stroke-width="3" fill="none"/></svg>',
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    pack: 'Nature',
    svg: '<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><path d="M10 55 A40 40 0 0 1 90 55" stroke="#FF0000" stroke-width="4" fill="none"/><path d="M14 55 A36 36 0 0 1 86 55" stroke="#FF7F00" stroke-width="4" fill="none"/><path d="M18 55 A32 32 0 0 1 82 55" stroke="#FFFF00" stroke-width="4" fill="none"/><path d="M22 55 A28 28 0 0 1 78 55" stroke="#00FF00" stroke-width="4" fill="none"/><path d="M26 55 A24 24 0 0 1 74 55" stroke="#0000FF" stroke-width="4" fill="none"/><path d="M30 55 A20 20 0 0 1 70 55" stroke="#8B00FF" stroke-width="4" fill="none"/></svg>',
  },
  {
    id: 'cloud',
    name: 'Cloud',
    pack: 'Nature',
    svg: '<svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="40" rx="35" ry="18" fill="white" stroke="#ccc" stroke-width="1"/><ellipse cx="35" cy="32" rx="20" ry="16" fill="white" stroke="#ccc" stroke-width="1"/><ellipse cx="65" cy="32" rx="20" ry="16" fill="white" stroke="#ccc" stroke-width="1"/><ellipse cx="50" cy="25" rx="18" ry="15" fill="white" stroke="#ccc" stroke-width="1"/></svg>',
  },
  {
    id: 'ribbon',
    name: 'Ribbon',
    pack: 'Shapes',
    svg: '<svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg"><polygon points="0,5 10,0 10,40 0,35" fill="#E74C3C"/><rect x="10" y="0" width="100" height="40" rx="2" fill="#E74C3C"/><polygon points="110,0 120,5 120,35 110,40" fill="#E74C3C"/><polygon points="0,5 10,20 0,35" fill="#C0392B"/><polygon points="120,5 110,20 120,35" fill="#C0392B"/></svg>',
  },
  {
    id: 'confetti',
    name: 'Confetti',
    pack: 'Fun',
    svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="10" width="6" height="12" rx="1" fill="#FF6B6B" transform="rotate(30 18 16)"/><rect x="45" y="5" width="6" height="12" rx="1" fill="#4ECDC4" transform="rotate(-20 48 11)"/><rect x="75" y="15" width="6" height="12" rx="1" fill="#FFE066" transform="rotate(45 78 21)"/><rect x="25" y="50" width="6" height="12" rx="1" fill="#A78BFA" transform="rotate(-15 28 56)"/><rect x="60" y="45" width="6" height="12" rx="1" fill="#F97316" transform="rotate(60 63 51)"/><rect x="85" y="55" width="6" height="12" rx="1" fill="#3B82F6" transform="rotate(-40 88 61)"/><rect x="10" y="80" width="6" height="12" rx="1" fill="#10B981" transform="rotate(25 13 86)"/><rect x="50" y="75" width="6" height="12" rx="1" fill="#EC4899" transform="rotate(-50 53 81)"/><rect x="80" y="85" width="6" height="12" rx="1" fill="#FFD700" transform="rotate(35 83 91)"/></svg>',
  },
  {
    id: 'trophy',
    name: 'Trophy',
    pack: 'Fun',
    svg: '<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg"><path d="M20 10 h40 v30 c0 15 -10 25 -20 30 c-10 -5 -20 -15 -20 -30 z" fill="#FFD700"/><rect x="30" y="70" width="20" height="10" fill="#DAA520"/><rect x="22" y="80" width="36" height="8" rx="2" fill="#DAA520"/><path d="M20 15 H8 c0 20 8 25 12 28" fill="#FFD700"/><path d="M60 15 H72 c0 20 -8 25 -12 28" fill="#FFD700"/></svg>',
  },
  {
    id: 'circle',
    name: 'Circle',
    pack: 'Shapes',
    svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#4ECDC4"/></svg>',
  },
  {
    id: 'diamond',
    name: 'Diamond',
    pack: 'Shapes',
    svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 95,50 50,95 5,50" fill="#A78BFA"/></svg>',
  },
  {
    id: 'sun',
    name: 'Sun',
    pack: 'Nature',
    svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="20" fill="#FFD700"/><line x1="50" y1="5" x2="50" y2="20" stroke="#FFD700" stroke-width="4" stroke-linecap="round"/><line x1="50" y1="80" x2="50" y2="95" stroke="#FFD700" stroke-width="4" stroke-linecap="round"/><line x1="5" y1="50" x2="20" y2="50" stroke="#FFD700" stroke-width="4" stroke-linecap="round"/><line x1="80" y1="50" x2="95" y2="50" stroke="#FFD700" stroke-width="4" stroke-linecap="round"/><line x1="18" y1="18" x2="29" y2="29" stroke="#FFD700" stroke-width="4" stroke-linecap="round"/><line x1="71" y1="71" x2="82" y2="82" stroke="#FFD700" stroke-width="4" stroke-linecap="round"/><line x1="82" y1="18" x2="71" y2="29" stroke="#FFD700" stroke-width="4" stroke-linecap="round"/><line x1="18" y1="82" x2="29" y2="71" stroke="#FFD700" stroke-width="4" stroke-linecap="round"/></svg>',
  },
]
