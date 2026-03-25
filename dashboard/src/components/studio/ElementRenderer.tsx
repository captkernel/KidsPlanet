'use client'

import { type CanvasElement } from '@/lib/types/canvas'
import { STICKERS } from '@/data/stickers'
import { icons } from 'lucide-react'

interface ElementRendererProps {
  element: CanvasElement
  selected: boolean
  editing: boolean
  onSelect: () => void
  onDoubleClick: () => void
  scale: number
}

interface HandlePosition {
  key: string
  top?: number | string
  left?: number | string
  right?: number
  bottom?: number
  cursor: string
  ml?: number
  mt?: number
}

const HANDLE_POSITIONS: HandlePosition[] = [
  { key: 'nw', top: -4, left: -4, cursor: 'nwse-resize' },
  { key: 'n', top: -4, left: '50%', cursor: 'ns-resize', ml: -4 },
  { key: 'ne', top: -4, right: -4, cursor: 'nesw-resize' },
  { key: 'e', top: '50%', right: -4, cursor: 'ew-resize', mt: -4 },
  { key: 'se', bottom: -4, right: -4, cursor: 'nwse-resize' },
  { key: 's', bottom: -4, left: '50%', cursor: 'ns-resize', ml: -4 },
  { key: 'sw', bottom: -4, left: -4, cursor: 'nesw-resize' },
  { key: 'w', top: '50%', left: -4, cursor: 'ew-resize', mt: -4 },
]

function kebabToPascal(str: string): string {
  return str
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function renderContent(element: CanvasElement, editing: boolean) {
  switch (element.type) {
    case 'image':
      return (
        <img
          src={element.content}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          draggable={false}
        />
      )

    case 'text': {
      const { fontSize, fontWeight, fontStyle, textAlign, color } = element.style
      return (
        <div
          contentEditable={editing}
          suppressContentEditableWarning
          style={{
            fontSize: fontSize ? `${fontSize}px` : undefined,
            fontWeight: fontWeight ?? undefined,
            fontStyle: fontStyle ?? undefined,
            textAlign: textAlign ?? undefined,
            color: color ?? undefined,
            width: '100%',
            height: '100%',
            outline: 'none',
            overflow: 'hidden',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {element.content}
        </div>
      )
    }

    case 'icon': {
      const pascalName = kebabToPascal(element.content)
      const IconComponent = icons[pascalName as keyof typeof icons]
      if (!IconComponent) return null
      return (
        <IconComponent
          style={{
            width: '100%',
            height: '100%',
            color: element.style.color ?? '#000000',
          }}
        />
      )
    }

    case 'sticker': {
      const sticker = STICKERS.find((s) => s.id === element.content)
      if (!sticker) return null
      return (
        <div
          style={{ width: '100%', height: '100%' }}
          dangerouslySetInnerHTML={{ __html: sticker.svg }}
        />
      )
    }
  }
}

export default function ElementRenderer({
  element,
  selected,
  editing,
  onSelect,
  onDoubleClick,
  scale,
}: ElementRendererProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        zIndex: element.zIndex,
        opacity: element.style.opacity ?? 1,
        display: element.visible ? 'block' : 'none',
        pointerEvents: element.locked ? 'none' : 'auto',
        cursor: editing ? 'text' : 'grab',
        outline: selected ? '2px solid #3b82f6' : 'none',
        outlineOffset: selected ? '1px' : undefined,
      }}
      onMouseDown={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      onDoubleClick={(e) => {
        e.stopPropagation()
        onDoubleClick()
      }}
    >
      {renderContent(element, editing)}

      {selected && (
        <>
          {HANDLE_POSITIONS.map((h) => (
            <div
              key={h.key}
              data-handle={h.key}
              style={{
                position: 'absolute',
                width: `${8 / scale}px`,
                height: `${8 / scale}px`,
                backgroundColor: 'white',
                border: '1px solid #3b82f6',
                cursor: h.cursor,
                top: h.top,
                left: h.left,
                right: h.right,
                bottom: h.bottom,
                marginLeft: h.ml,
                marginTop: h.mt,
                zIndex: 9999,
                pointerEvents: 'auto',
              }}
            />
          ))}
        </>
      )}
    </div>
  )
}
