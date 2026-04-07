'use client'

import {
  Trash2,
  ArrowUp,
  ArrowDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
} from 'lucide-react'
import { CanvasElement } from '@/lib/types/canvas'

interface FloatingToolbarProps {
  element: CanvasElement
  onUpdate: (updates: Partial<CanvasElement>) => void
  onDelete: () => void
  position: { x: number; y: number }
  elementHeight: number
  canvasTop: number
}

const btnClass =
  'w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors'

export function FloatingToolbar({
  element,
  onUpdate,
  onDelete,
  position,
  elementHeight,
  canvasTop,
}: FloatingToolbarProps) {
  const flipBelow = position.y - canvasTop < 60

  const top = flipBelow
    ? position.y + elementHeight + 8
    : position.y - 48

  const opacity = element.style?.opacity ?? 100

  function updateStyle(styleUpdates: Partial<CanvasElement['style']>) {
    onUpdate({ style: { ...element.style, ...styleUpdates } } as Partial<CanvasElement>)
  }

  return (
    <div
      style={{ top, left: position.x, position: 'fixed', zIndex: 50 }}
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-1 flex items-center gap-1"
    >
      {/* ── Text-specific controls ── */}
      {element.type === 'text' && (
        <>
          {/* Font size */}
          <input
            type="number"
            min={12}
            max={72}
            value={element.style.fontSize ?? 16}
            onChange={(e) => updateStyle({ fontSize: Number(e.target.value) })}
            className="border border-gray-200 rounded-md text-xs text-center"
            style={{ width: 50 }}
            title="Font size"
          />

          {/* Bold */}
          <button
            title="Bold"
            onClick={() =>
              updateStyle({
                fontWeight: element.style.fontWeight === 'bold' ? 'normal' : 'bold',
              })
            }
            className={`${btnClass} font-bold text-sm ${
              element.style.fontWeight === 'bold' ? 'bg-gray-200' : ''
            }`}
          >
            <Bold size={14} />
          </button>

          {/* Italic */}
          <button
            title="Italic"
            onClick={() =>
              updateStyle({
                fontStyle: element.style.fontStyle === 'italic' ? 'normal' : 'italic',
              })
            }
            className={`${btnClass} italic text-sm ${
              element.style.fontStyle === 'italic' ? 'bg-gray-200' : ''
            }`}
          >
            <Italic size={14} />
          </button>

          {/* Color */}
          <input
            type="color"
            value={element.style.color ?? '#000000'}
            onChange={(e) => updateStyle({ color: e.target.value })}
            className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0.5"
            title="Text color"
          />

          {/* Alignment */}
          {(['left', 'center', 'right'] as const).map((align) => {
            const Icon =
              align === 'left' ? AlignLeft : align === 'center' ? AlignCenter : AlignRight
            return (
              <button
                key={align}
                title={`Align ${align}`}
                onClick={() => updateStyle({ textAlign: align })}
                className={`${btnClass} ${
                  (element.style.textAlign ?? 'left') === align ? 'bg-gray-200' : ''
                }`}
              >
                <Icon size={14} />
              </button>
            )
          })}

          <div className="w-px h-5 bg-gray-200 mx-0.5" />
        </>
      )}

      {/* ── Icon color ── */}
      {element.type === 'icon' && (
        <>
          <input
            type="color"
            value={element.style.color ?? '#000000'}
            onChange={(e) => updateStyle({ color: e.target.value })}
            className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0.5"
            title="Icon color"
          />
          <div className="w-px h-5 bg-gray-200 mx-0.5" />
        </>
      )}

      {/* ── Position & Size ── */}
      <div className="flex items-center gap-0.5">
        <span className="text-[10px] text-gray-400 w-2.5">X</span>
        <input
          type="number"
          value={Math.round(element.x)}
          onChange={(e) => onUpdate({ x: Number(e.target.value) })}
          className="border border-gray-200 rounded text-xs text-center tabular-nums"
          style={{ width: 44 }}
          title="X position"
        />
        <span className="text-[10px] text-gray-400 w-2.5 ml-1">Y</span>
        <input
          type="number"
          value={Math.round(element.y)}
          onChange={(e) => onUpdate({ y: Number(e.target.value) })}
          className="border border-gray-200 rounded text-xs text-center tabular-nums"
          style={{ width: 44 }}
          title="Y position"
        />
        <span className="text-[10px] text-gray-400 w-2.5 ml-1">W</span>
        <input
          type="number"
          min={20}
          value={Math.round(element.width)}
          onChange={(e) => onUpdate({ width: Math.max(20, Number(e.target.value)) })}
          className="border border-gray-200 rounded text-xs text-center tabular-nums"
          style={{ width: 44 }}
          title="Width"
        />
        <span className="text-[10px] text-gray-400 w-2.5 ml-1">H</span>
        <input
          type="number"
          min={20}
          value={Math.round(element.height)}
          onChange={(e) => onUpdate({ height: Math.max(20, Number(e.target.value)) })}
          className="border border-gray-200 rounded text-xs text-center tabular-nums"
          style={{ width: 44 }}
          title="Height"
        />
      </div>

      <div className="w-px h-5 bg-gray-200 mx-0.5" />

      {/* ── Common controls ── */}

      {/* Opacity */}
      <input
        type="range"
        min={0}
        max={100}
        value={opacity}
        onChange={(e) => updateStyle({ opacity: Number(e.target.value) })}
        style={{ width: 60 }}
        title="Opacity"
      />

      {/* Bring forward */}
      <button
        title="Bring forward"
        onClick={() => onUpdate({ zIndex: element.zIndex + 1 })}
        className={btnClass}
      >
        <ArrowUp size={14} />
      </button>

      {/* Send backward */}
      <button
        title="Send backward"
        onClick={() => onUpdate({ zIndex: Math.max(0, element.zIndex - 1) })}
        className={btnClass}
      >
        <ArrowDown size={14} />
      </button>

      <div className="w-px h-5 bg-gray-200 mx-0.5" />

      {/* Delete */}
      <button
        title="Delete"
        onClick={onDelete}
        className={`${btnClass} hover:bg-error/10 hover:text-error`}
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}
