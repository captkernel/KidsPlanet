'use client'

import { useEffect, useRef, useState } from 'react'
import { Plus, ImagePlus, Type, Sparkles, Sticker } from 'lucide-react'

interface AddMenuProps {
  onAddImage: () => void
  onAddText: () => void
  onOpenIconPicker: () => void
  onOpenStickerPicker: () => void
}

export function AddMenu({ onAddImage, onAddText, onOpenIconPicker, onOpenStickerPicker }: AddMenuProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  function handle(fn: () => void) {
    setOpen(false)
    fn()
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        <Plus size={16} />
        Add
      </button>

      {open && (
        <div className="absolute top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-200 py-1 w-48 z-50">
          <button
            onClick={() => handle(onAddImage)}
            className="px-3 py-2.5 flex items-center gap-3 hover:bg-gray-50 cursor-pointer text-sm w-full text-left"
          >
            <ImagePlus size={16} className="text-text-muted" />
            Image
          </button>
          <button
            onClick={() => handle(onAddText)}
            className="px-3 py-2.5 flex items-center gap-3 hover:bg-gray-50 cursor-pointer text-sm w-full text-left"
          >
            <Type size={16} className="text-text-muted" />
            Text
          </button>
          <button
            onClick={() => handle(onOpenIconPicker)}
            className="px-3 py-2.5 flex items-center gap-3 hover:bg-gray-50 cursor-pointer text-sm w-full text-left"
          >
            <Sparkles size={16} className="text-text-muted" />
            Icon
          </button>
          <button
            onClick={() => handle(onOpenStickerPicker)}
            className="px-3 py-2.5 flex items-center gap-3 hover:bg-gray-50 cursor-pointer text-sm w-full text-left"
          >
            <Sticker size={16} className="text-text-muted" />
            Sticker
          </button>
        </div>
      )}
    </div>
  )
}
