export interface Sticker {
  id: string
  name: string
  pack: string
  svg: string
}

export const STICKER_PACKS = ['School', 'Celebrations', 'Animals', 'Emoji'] as const

export const STICKERS: Sticker[] = [
  // School pack (5)
  {
    id: 'school-book',
    name: 'Book',
    pack: 'School',
    svg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="8" width="36" height="48" rx="4" fill="#4ECDC4"/><rect x="14" y="8" width="6" height="48" fill="#00B894"/><rect x="18" y="18" width="22" height="3" rx="1.5" fill="white" opacity="0.8"/><rect x="18" y="25" width="22" height="3" rx="1.5" fill="white" opacity="0.8"/><rect x="18" y="32" width="16" height="3" rx="1.5" fill="white" opacity="0.8"/></svg>',
  },
  {
    id: 'school-pencil',
    name: 'Pencil',
    pack: 'School',
    svg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><polygon points="12,52 16,40 24,48" fill="#F38181"/><rect x="14.5" y="16" width="11" height="26" rx="2" transform="rotate(-45 20 29)" fill="#FFE66D"/><rect x="19" y="10" width="11" height="8" rx="2" transform="rotate(-45 24.5 14)" fill="#AA96DA"/><line x1="14" y1="41" x2="22" y2="49" stroke="#95E1D3" stroke-width="1.5"/></svg>',
  },
  {
    id: 'school-backpack',
    name: 'Backpack',
    pack: 'School',
    svg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="14" y="20" width="36" height="36" rx="6" fill="#6C5CE7"/><rect x="24" y="14" width="16" height="12" rx="4" fill="#AA96DA"/><rect x="22" y="34" width="20" height="14" rx="3" fill="#5A4FD4"/><circle cx="32" cy="41" r="3" fill="#AA96DA"/><rect x="28" y="20" width="8" height="3" rx="1.5" fill="#5A4FD4"/></svg>',
  },
  {
    id: 'school-graduation',
    name: 'Graduation Cap',
    pack: 'School',
    svg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><polygon points="32,12 58,24 32,36 6,24" fill="#FF6B6B"/><rect x="29" y="24" width="6" height="22" rx="2" fill="#F38181"/><ellipse cx="32" cy="46" rx="10" ry="5" fill="#FF6B6B"/><circle cx="50" cy="24" r="3" fill="#FFE66D"/><line x1="50" y1="27" x2="50" y2="38" stroke="#FFE66D" stroke-width="2.5"/><circle cx="50" cy="40" r="3" fill="#FFE66D"/></svg>',
  },
  {
    id: 'school-globe',
    name: 'Globe',
    pack: 'School',
    svg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="30" r="22" fill="#4ECDC4"/><ellipse cx="32" cy="30" rx="11" ry="22" fill="none" stroke="white" stroke-width="2" opacity="0.7"/><line x1="10" y1="30" x2="54" y2="30" stroke="white" stroke-width="2" opacity="0.7"/><line x1="14" y1="18" x2="50" y2="18" stroke="white" stroke-width="1.5" opacity="0.5"/><line x1="14" y1="42" x2="50" y2="42" stroke="white" stroke-width="1.5" opacity="0.5"/><rect x="26" y="52" width="12" height="4" rx="2" fill="#00B894"/><rect x="22" y="56" width="20" height="3" rx="1.5" fill="#00B894"/></svg>',
  },

  // Celebrations pack (5)
  {
    id: 'cele-star',
    name: 'Star',
    pack: 'Celebrations',
    svg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><polygon points="32,6 39,24 58,24 43,36 49,54 32,43 15,54 21,36 6,24 25,24" fill="#FFE66D" stroke="#F4C430" stroke-width="1.5"/></svg>',
  },
  {
    id: 'cele-trophy',
    name: 'Trophy',
    pack: 'Celebrations',
    svg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M20 8 h24 v20 a12 12 0 0 1 -24 0 Z" fill="#FFE66D"/><path d="M20 16 h-8 a8 8 0 0 0 8 12 Z" fill="#FFE66D"/><path d="M44 16 h8 a8 8 0 0 1 -8 12 Z" fill="#FFE66D"/><rect x="28" y="36" width="8" height="12" rx="2" fill="#F4C430"/><rect x="20" y="48" width="24" height="5" rx="2.5" fill="#F4C430"/><circle cx="32" cy="22" r="6" fill="white" opacity="0.4"/></svg>',
  },
  {
    id: 'cele-balloon',
    name: 'Balloon',
    pack: 'Celebrations',
    svg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><ellipse cx="32" cy="26" rx="18" ry="22" fill="#FF6B6B"/><ellipse cx="26" cy="18" rx="5" ry="7" fill="white" opacity="0.25"/><path d="M32 48 L30 52 L34 52 Z" fill="#FF6B6B"/><line x1="32" y1="52" x2="32" y2="60" stroke="#AA96DA" stroke-width="2" stroke-dasharray="3,2"/></svg>',
  },
  {
    id: 'cele-medal',
    name: 'Medal',
    pack: 'Celebrations',
    svg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><polygon points="32,6 36,8 32,14 28,8" fill="#6C5CE7"/><polygon points="32,6 28,8 24,6 26,12 32,14 38,12 40,6 36,8" fill="#AA96DA"/><circle cx="32" cy="40" r="18" fill="#FFE66D" stroke="#F4C430" stroke-width="2"/><circle cx="32" cy="40" r="13" fill="none" stroke="#F4C430" stroke-width="1.5"/><text x="32" y="45" text-anchor="middle" font-size="14" font-weight="bold" fill="#F4C430">1</text></svg>',
  },
  {
    id: 'cele-gift',
    name: 'Gift',
    pack: 'Celebrations',
    svg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="28" width="44" height="28" rx="3" fill="#FF6B6B"/><rect x="8" y="20" width="48" height="10" rx="3" fill="#F38181"/><rect x="29" y="20" width="6" height="36" fill="#FFE66D"/><rect x="8" y="23" width="48" height="4" fill="#FFE66D"/><path d="M32 20 C32 20 20 12 24 8 C28 4 32 14 32 14 C32 14 36 4 40 8 C44 12 32 20 32 20Z" fill="#4ECDC4"/></svg>',
  },

  // Animals pack (5)
  {
    id: 'animal-lion',
    name: 'Lion',
    pack: 'Animals',
    svg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="20" fill="#F4C430" opacity="0.5"/><circle cx="32" cy="32" r="24" fill="none" stroke="#F4C430" stroke-width="8" opacity="0.4"/><circle cx="32" cy="32" r="16" fill="#FFE66D"/><circle cx="26" cy="29" r="3" fill="#333"/><circle cx="38" cy="29" r="3" fill="#333"/><circle cx="27" cy="28" r="1" fill="white"/><circle cx="39" cy="28" r="1" fill="white"/><ellipse cx="32" cy="36" rx="5" ry="3" fill="#F38181"/><path d="M28 38 Q32 42 36 38" stroke="#333" stroke-width="1.5" fill="none"/><ellipse cx="25" cy="36" rx="4" ry="2.5" fill="#FFD580"/><ellipse cx="39" cy="36" rx="4" ry="2.5" fill="#FFD580"/></svg>',
  },
  {
    id: 'animal-butterfly',
    name: 'Butterfly',
    pack: 'Animals',
    svg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><ellipse cx="18" cy="24" rx="14" ry="10" fill="#FF6B6B" opacity="0.9" transform="rotate(-20 18 24)"/><ellipse cx="46" cy="24" rx="14" ry="10" fill="#FF6B6B" opacity="0.9" transform="rotate(20 46 24)"/><ellipse cx="20" cy="42" rx="10" ry="8" fill="#FFE66D" opacity="0.9" transform="rotate(20 20 42)"/><ellipse cx="44" cy="42" rx="10" ry="8" fill="#FFE66D" opacity="0.9" transform="rotate(-20 44 42)"/><ellipse cx="18" cy="24" rx="6" ry="4" fill="white" opacity="0.3" transform="rotate(-20 18 24)"/><rect x="30" y="12" width="4" height="40" rx="2" fill="#6C5CE7"/><line x1="28" y1="14" x2="20" y2="8" stroke="#6C5CE7" stroke-width="1.5"/><line x1="36" y1="14" x2="44" y2="8" stroke="#6C5CE7" stroke-width="1.5"/></svg>',
  },
  {
    id: 'animal-bird',
    name: 'Bird',
    pack: 'Animals',
    svg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><ellipse cx="32" cy="36" rx="16" ry="14" fill="#4ECDC4"/><circle cx="32" cy="20" r="12" fill="#4ECDC4"/><circle cx="28" cy="18" r="3" fill="#333"/><circle cx="29" cy="17" r="1" fill="white"/><polygon points="32,22 38,24 32,26" fill="#FFE66D"/><path d="M44 30 Q56 22 56 14 Q48 18 44 26" fill="#95E1D3"/><ellipse cx="26" cy="46" rx="5" ry="3" fill="#3BBAB0"/><ellipse cx="38" cy="46" rx="5" ry="3" fill="#3BBAB0"/><line x1="28" y1="50" x2="24" y2="58" stroke="#FFE66D" stroke-width="2.5"/><line x1="36" y1="50" x2="40" y2="58" stroke="#FFE66D" stroke-width="2.5"/></svg>',
  },
  {
    id: 'animal-rabbit',
    name: 'Rabbit',
    pack: 'Animals',
    svg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><ellipse cx="24" cy="18" rx="6" ry="14" fill="#AA96DA"/><ellipse cx="40" cy="18" rx="6" ry="14" fill="#AA96DA"/><ellipse cx="24" cy="18" rx="3" ry="10" fill="#F38181" opacity="0.6"/><ellipse cx="40" cy="18" rx="3" ry="10" fill="#F38181" opacity="0.6"/><ellipse cx="32" cy="40" rx="18" ry="16" fill="#AA96DA"/><circle cx="27" cy="36" r="3" fill="#333"/><circle cx="28" cy="35" r="1" fill="white"/><circle cx="37" cy="36" r="3" fill="#333"/><circle cx="38" cy="35" r="1" fill="white"/><ellipse cx="32" cy="42" rx="4" ry="2.5" fill="#F38181"/><path d="M29 44 Q32 47 35 44" stroke="#333" stroke-width="1.5" fill="none"/><ellipse cx="46" cy="42" rx="5" ry="3" fill="#95E1D3"/></svg>',
  },
  {
    id: 'animal-bear',
    name: 'Bear',
    pack: 'Animals',
    svg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="18" r="10" fill="#F4C430"/><circle cx="44" cy="18" r="10" fill="#F4C430"/><circle cx="20" cy="18" r="6" fill="#E6B800"/><circle cx="44" cy="18" r="6" fill="#E6B800"/><ellipse cx="32" cy="38" rx="20" ry="18" fill="#F4C430"/><ellipse cx="32" cy="42" rx="10" ry="8" fill="#FFE66D"/><circle cx="26" cy="34" r="3.5" fill="#333"/><circle cx="27" cy="33" r="1.2" fill="white"/><circle cx="38" cy="34" r="3.5" fill="#333"/><circle cx="39" cy="33" r="1.2" fill="white"/><circle cx="32" cy="40" r="2.5" fill="#F38181"/><path d="M28 43 Q32 47 36 43" stroke="#333" stroke-width="2" fill="none"/></svg>',
  },

  // Emoji pack (5)
  {
    id: 'emoji-heart',
    name: 'Heart',
    pack: 'Emoji',
    svg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 54 C32 54 8 38 8 22 C8 14 14 8 22 8 C26 8 30 10 32 14 C34 10 38 8 42 8 C50 8 56 14 56 22 C56 38 32 54 32 54Z" fill="#FF6B6B"/><path d="M20 16 C18 16 14 19 14 24" stroke="white" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.5"/></svg>',
  },
  {
    id: 'emoji-thumbsup',
    name: 'Thumbs Up',
    pack: 'Emoji',
    svg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M28 10 C28 10 22 22 22 30 L10 30 C8 30 7 31 7 33 L7 50 C7 52 8 53 10 53 L42 53 C46 53 50 50 50 46 L54 34 C55 30 52 26 48 26 L36 26 C36 26 38 16 36 12 C34 8 28 10 28 10Z" fill="#FFE66D"/><rect x="7" y="30" width="10" height="23" rx="2" fill="#F4C430"/></svg>',
  },
  {
    id: 'emoji-fire',
    name: 'Fire',
    pack: 'Emoji',
    svg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 6 C32 6 44 20 44 32 C44 32 40 26 34 28 C34 28 42 36 38 46 C36 50 32 54 26 54 C18 54 12 48 12 40 C12 30 20 26 20 26 C20 26 16 36 22 40 C22 40 20 30 28 22 C28 22 24 32 30 36 C30 36 26 26 32 6Z" fill="#FF6B6B"/><path d="M32 32 C32 32 38 38 36 44 C34 48 30 50 26 48 C22 46 20 42 22 38 C22 38 26 42 30 40 C30 40 28 36 32 32Z" fill="#FFE66D"/></svg>',
  },
  {
    id: 'emoji-sparkle',
    name: 'Sparkle',
    pack: 'Emoji',
    svg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M32 4 L36 28 L60 32 L36 36 L32 60 L28 36 L4 32 L28 28 Z" fill="#FFE66D"/><circle cx="14" cy="14" r="4" fill="#FF6B6B" opacity="0.8"/><circle cx="50" cy="14" r="3" fill="#4ECDC4" opacity="0.8"/><circle cx="50" cy="50" r="4" fill="#AA96DA" opacity="0.8"/><circle cx="14" cy="50" r="3" fill="#F38181" opacity="0.8"/></svg>',
  },
  {
    id: 'emoji-rainbow',
    name: 'Rainbow',
    pack: 'Emoji',
    svg: '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M6 44 A26 26 0 0 1 58 44" stroke="#FF6B6B" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M11 44 A21 21 0 0 1 53 44" stroke="#FF9500" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M15 44 A17 17 0 0 1 49 44" stroke="#FFE66D" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M19 44 A13 13 0 0 1 45 44" stroke="#00B894" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M23 44 A9 9 0 0 1 41 44" stroke="#4ECDC4" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M27 44 A5 5 0 0 1 37 44" stroke="#6C5CE7" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="10" cy="50" rx="8" ry="6" fill="white" opacity="0.9"/><ellipse cx="54" cy="50" rx="8" ry="6" fill="white" opacity="0.9"/></svg>',
  },
]
