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

const CORNER_HANDLES: HandlePosition[] = [
  { key: 'nw', top: -5, left: -5, cursor: 'nwse-resize' },
  { key: 'ne', top: -5, right: -5, cursor: 'nesw-resize' },
  { key: 'se', bottom: -5, right: -5, cursor: 'nwse-resize' },
  { key: 'sw', bottom: -5, left: -5, cursor: 'nesw-resize' },
]

const EDGE_HANDLES: HandlePosition[] = [
  { key: 'n', top: -3, left: '50%', cursor: 'ns-resize', ml: -3 },
  { key: 'e', top: '50%', right: -3, cursor: 'ew-resize', mt: -3 },
  { key: 's', bottom: -3, left: '50%', cursor: 'ns-resize', ml: -3 },
  { key: 'w', top: '50%', left: -3, cursor: 'ew-resize', mt: -3 },
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
  // NOTE: Do NOT add onMouseDown/onDoubleClick handlers here.
  // The parent CanvasEditor wrapper div handles all mouse interaction
  // (selection, drag, resize). Adding stopPropagation here would
  // block the drag/resize from initializing.
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
      }}
    >
      {renderContent(element, editing)}

      {selected && (
        <>
          {/* Corner handles — larger, rounded squares */}
          {CORNER_HANDLES.map((h) => (
            <div
              key={h.key}
              data-handle={h.key}
              style={{
                position: 'absolute',
                width: `${10 / scale}px`,
                height: `${10 / scale}px`,
                backgroundColor: 'white',
                border: '2px solid #3b82f6',
                borderRadius: `${2 / scale}px`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
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
          {/* Edge handles — smaller, circular */}
          {EDGE_HANDLES.map((h) => (
            <div
              key={h.key}
              data-handle={h.key}
              style={{
                position: 'absolute',
                width: `${6 / scale}px`,
                height: `${6 / scale}px`,
                backgroundColor: 'white',
                border: '1.5px solid #3b82f6',
                borderRadius: '50%',
                boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
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
