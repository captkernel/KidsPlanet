'use client'

import { Image, Type, Sparkles, Smile, ArrowUp, ArrowDown, Eye, EyeOff, Lock, Unlock } from 'lucide-react'
import { CanvasElement } from '@/lib/types/canvas'

interface LayerPanelProps {
  elements: CanvasElement[]
  selectedId: string | null
  onSelect: (id: string) => void
  onReorder: (id: string, direction: 'up' | 'down') => void
  onToggleVisible: (id: string) => void
  onToggleLock: (id: string) => void
}

function typeIcon(type: CanvasElement['type']) {
  switch (type) {
    case 'image':
      return <Image size={14} />
    case 'text':
      return <Type size={14} />
    case 'icon':
      return <Sparkles size={14} />
    case 'sticker':
      return <Smile size={14} />
  }
}

function elementLabel(el: CanvasElement): string {
  switch (el.type) {
    case 'text':
      return el.content ? el.content.slice(0, 20) || 'Text Block' : 'Text Block'
    case 'image':
      return 'Image'
    case 'icon':
      return el.content || 'Icon'
    case 'sticker':
      return el.content || 'Sticker'
  }
}

const btnClass =
  'w-6 h-6 rounded flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0'

export function LayerPanel({
  elements,
  selectedId,
  onSelect,
  onReorder,
  onToggleVisible,
  onToggleLock,
}: LayerPanelProps) {
  // Display highest z-index first (top layer at top of list)
  const sorted = [...elements].sort((a, b) => b.zIndex - a.zIndex)

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-2 w-64">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-2 mb-1">
        Layers
      </p>

      {sorted.length === 0 && (
        <p className="text-xs text-gray-400 px-2 py-2">No elements yet.</p>
      )}

      {sorted.map((el) => {
        const isSelected = el.id === selectedId

        return (
          <div
            key={el.id}
            onClick={() => onSelect(el.id)}
            className={`h-9 px-2 flex items-center gap-2 rounded-lg hover:bg-gray-50 cursor-pointer text-sm ${
              isSelected ? 'bg-blue-50 border-l-2 border-blue-500' : ''
            }`}
          >
            {/* Type icon */}
            <span className="text-gray-400 flex-shrink-0">{typeIcon(el.type)}</span>

            {/* Label */}
            <span
              className={`flex-1 truncate text-xs ${
                !el.visible ? 'opacity-40' : ''
              }`}
            >
              {elementLabel(el)}
            </span>

            {/* Reorder up */}
            <button
              title="Move up"
              onClick={(e) => {
                e.stopPropagation()
                onReorder(el.id, 'up')
              }}
              className={btnClass}
            >
              <ArrowUp size={12} />
            </button>

            {/* Reorder down */}
            <button
              title="Move down"
              onClick={(e) => {
                e.stopPropagation()
                onReorder(el.id, 'down')
              }}
              className={btnClass}
            >
              <ArrowDown size={12} />
            </button>

            {/* Visibility toggle */}
            <button
              title={el.visible ? 'Hide' : 'Show'}
              onClick={(e) => {
                e.stopPropagation()
                onToggleVisible(el.id)
              }}
              className={`${btnClass} ${!el.visible ? 'text-gray-300' : 'text-gray-500'}`}
            >
              {el.visible ? <Eye size={12} /> : <EyeOff size={12} />}
            </button>

            {/* Lock toggle */}
            <button
              title={el.locked ? 'Unlock' : 'Lock'}
              onClick={(e) => {
                e.stopPropagation()
                onToggleLock(el.id)
              }}
              className={`${btnClass} ${el.locked ? 'text-blue-500' : 'text-gray-400'}`}
            >
              {el.locked ? <Lock size={12} /> : <Unlock size={12} />}
            </button>
          </div>
        )
      })}
    </div>
  )
}
