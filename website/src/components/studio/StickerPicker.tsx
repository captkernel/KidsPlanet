'use client'

import { useState } from 'react'
import { Modal } from '@/components/shared/Modal'
import { STICKERS, STICKER_PACKS } from '@/data/stickers'

interface StickerPickerProps {
  open: boolean
  onClose: () => void
  onSelect: (stickerId: string) => void
}

export function StickerPicker({ open, onClose, onSelect }: StickerPickerProps) {
  const [activePack, setActivePack] = useState<string>(STICKER_PACKS[0])

  const filtered = STICKERS.filter(s => s.pack === activePack)

  function handleSelect(stickerId: string) {
    onSelect(stickerId)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Pick a Sticker" size="md">
      <div className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          {STICKER_PACKS.map(pack => (
            <button
              key={pack}
              onClick={() => setActivePack(pack)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activePack === pack
                  ? 'bg-primary text-white'
                  : 'bg-surface-muted text-text-muted hover:bg-gray-200'
              }`}
            >
              {pack}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-2">
          {filtered.map(sticker => (
            <button
              key={sticker.id}
              onClick={() => handleSelect(sticker.id)}
              className="w-16 h-16 rounded-xl flex flex-col items-center justify-center hover:bg-green-50 cursor-pointer p-2 transition-colors"
            >
              <div
                className="w-12 h-12"
                dangerouslySetInnerHTML={{ __html: sticker.svg }}
              />
              <span className="text-[10px] text-center text-text-muted leading-tight mt-0.5 truncate w-full">
                {sticker.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  )
}
