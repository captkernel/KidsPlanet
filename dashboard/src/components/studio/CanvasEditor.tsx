'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { type CanvasElement } from '@/lib/types/canvas'
import ElementRenderer from '@/components/studio/ElementRenderer'

interface CanvasEditorProps {
  elements: CanvasElement[]
  onElementsChange: (elements: CanvasElement[]) => void
  canvasWidth: number
  canvasHeight: number
  scale: number
  active: boolean
}

interface DragState {
  elementId: string
  startX: number
  startY: number
  origX: number
  origY: number
  started: boolean
}

interface ResizeState {
  elementId: string
  handle: string
  startX: number
  startY: number
  origX: number
  origY: number
  origW: number
  origH: number
}

const DRAG_THRESHOLD = 3
const MIN_SIZE = 20
const MIN_VISIBLE = 20

export default function CanvasEditor({
  elements,
  onElementsChange,
  canvasWidth,
  canvasHeight,
  scale,
  active,
}: CanvasEditorProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  const canvasRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragState = useRef<DragState | null>(null)
  const resizeState = useRef<ResizeState | null>(null)
  const activeElementRef = useRef<HTMLElement | null>(null)

  // Refs to avoid stale closures
  const elementsRef = useRef(elements)
  elementsRef.current = elements
  const selectedIdRef = useRef(selectedId)
  selectedIdRef.current = selectedId
  const editingIdRef = useRef(editingId)
  editingIdRef.current = editingId

  const getCanvasCoords = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return { x: 0, y: 0 }
      return {
        x: (e.clientX - rect.left) / scale,
        y: (e.clientY - rect.top) / scale,
      }
    },
    [scale]
  )

  // Find the wrapper DOM node for an element by data attribute
  const findElementNode = useCallback((elementId: string): HTMLElement | null => {
    return canvasRef.current?.querySelector(
      `[data-element-id="${elementId}"]`
    ) as HTMLElement | null
  }, [])

  // Keyboard listener for Delete/Backspace/Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!active) return

      if (e.key === 'Escape') {
        setEditingId(null)
        setSelectedId(null)
        return
      }

      if (
        (e.key === 'Delete' || e.key === 'Backspace') &&
        selectedIdRef.current &&
        !editingIdRef.current
      ) {
        // Don't delete if focus is in an input/textarea/contenteditable
        const tag = (e.target as HTMLElement)?.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return
        if ((e.target as HTMLElement)?.isContentEditable) return

        const id = selectedIdRef.current
        onElementsChange(elementsRef.current.filter((el) => el.id !== id))
        setSelectedId(null)
        e.preventDefault()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [active, onElementsChange])

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only deselect on direct canvas background click
      if (e.target === canvasRef.current) {
        setSelectedId(null)
        setEditingId(null)
      }
    },
    []
  )

  const handleElementSelect = useCallback((elementId: string) => {
    setSelectedId(elementId)
  }, [])

  const handleElementMouseDown = useCallback(
    (e: React.MouseEvent, elementId: string) => {
      const handle = (e.target as HTMLElement).dataset?.handle
      const coords = getCanvasCoords(e)
      const el = elementsRef.current.find((el) => el.id === elementId)
      if (!el) return

      setSelectedId(elementId)

      const node = findElementNode(elementId)
      activeElementRef.current = node

      if (handle) {
        // Start resize
        resizeState.current = {
          elementId,
          handle,
          startX: coords.x,
          startY: coords.y,
          origX: el.x,
          origY: el.y,
          origW: el.width,
          origH: el.height,
        }
      } else {
        // Start drag tracking
        dragState.current = {
          elementId,
          startX: coords.x,
          startY: coords.y,
          origX: el.x,
          origY: el.y,
          started: false,
        }
      }
    },
    [getCanvasCoords, findElementNode]
  )

  const handleElementDoubleClick = useCallback((elementId: string) => {
    const el = elementsRef.current.find((el) => el.id === elementId)
    if (el?.type === 'text') {
      setEditingId(elementId)
    }
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const coords = getCanvasCoords(e)

      // --- Dragging ---
      if (dragState.current) {
        const ds = dragState.current
        const dx = coords.x - ds.startX
        const dy = coords.y - ds.startY

        if (!ds.started) {
          if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) {
            return
          }
          ds.started = true
        }

        const el = elementsRef.current.find((el) => el.id === ds.elementId)
        let newX = ds.origX + dx
        let newY = ds.origY + dy

        if (el) {
          newX = Math.max(-el.width + MIN_VISIBLE, Math.min(canvasWidth - MIN_VISIBLE, newX))
          newY = Math.max(-el.height + MIN_VISIBLE, Math.min(canvasHeight - MIN_VISIBLE, newY))
        }

        // Update via DOM ref for performance (no React re-render)
        if (activeElementRef.current) {
          activeElementRef.current.style.left = `${newX}px`
          activeElementRef.current.style.top = `${newY}px`
          activeElementRef.current.style.cursor = 'grabbing'
        }
        return
      }

      // --- Resizing ---
      if (resizeState.current) {
        const rs = resizeState.current
        const dx = coords.x - rs.startX
        const dy = coords.y - rs.startY
        const h = rs.handle

        let newX = rs.origX
        let newY = rs.origY
        let newW = rs.origW
        let newH = rs.origH

        // Width changes
        if (h.includes('e')) {
          newW = Math.max(MIN_SIZE, rs.origW + dx)
        } else if (h.includes('w')) {
          newW = Math.max(MIN_SIZE, rs.origW - dx)
          newX = rs.origX + rs.origW - newW
        }

        // Height changes
        if (h.includes('s')) {
          newH = Math.max(MIN_SIZE, rs.origH + dy)
        } else if (h.includes('n')) {
          newH = Math.max(MIN_SIZE, rs.origH - dy)
          newY = rs.origY + rs.origH - newH
        }

        // Aspect ratio lock for images on corner handles (unless Shift held)
        const isCorner = ['nw', 'ne', 'sw', 'se'].includes(h)
        if (isCorner) {
          const el = elementsRef.current.find((el) => el.id === rs.elementId)
          if (el?.type === 'image' && !e.shiftKey) {
            const aspect = rs.origW / rs.origH
            const wFromH = newH * aspect
            const hFromW = newW / aspect
            if (Math.abs(dx) > Math.abs(dy)) {
              newH = Math.max(MIN_SIZE, hFromW)
            } else {
              newW = Math.max(MIN_SIZE, wFromH)
            }
            if (h.includes('w')) newX = rs.origX + rs.origW - newW
            if (h.includes('n')) newY = rs.origY + rs.origH - newH
          }
        }

        // Update via DOM ref (no React re-render)
        if (activeElementRef.current) {
          activeElementRef.current.style.left = `${newX}px`
          activeElementRef.current.style.top = `${newY}px`
          activeElementRef.current.style.width = `${newW}px`
          activeElementRef.current.style.height = `${newH}px`
        }
        return
      }
    },
    [getCanvasCoords, canvasWidth, canvasHeight]
  )

  const computeResize = (
    rs: ResizeState,
    dx: number,
    dy: number,
    shiftKey: boolean
  ) => {
    const h = rs.handle
    let newX = rs.origX
    let newY = rs.origY
    let newW = rs.origW
    let newH = rs.origH

    if (h.includes('e')) newW = Math.max(MIN_SIZE, rs.origW + dx)
    else if (h.includes('w')) {
      newW = Math.max(MIN_SIZE, rs.origW - dx)
      newX = rs.origX + rs.origW - newW
    }

    if (h.includes('s')) newH = Math.max(MIN_SIZE, rs.origH + dy)
    else if (h.includes('n')) {
      newH = Math.max(MIN_SIZE, rs.origH - dy)
      newY = rs.origY + rs.origH - newH
    }

    const isCorner = ['nw', 'ne', 'sw', 'se'].includes(h)
    if (isCorner) {
      const el = elementsRef.current.find((el) => el.id === rs.elementId)
      if (el?.type === 'image' && !shiftKey) {
        const aspect = rs.origW / rs.origH
        const wFromH = newH * aspect
        const hFromW = newW / aspect
        if (Math.abs(dx) > Math.abs(dy)) {
          newH = Math.max(MIN_SIZE, hFromW)
        } else {
          newW = Math.max(MIN_SIZE, wFromH)
        }
        if (h.includes('w')) newX = rs.origX + rs.origW - newW
        if (h.includes('n')) newY = rs.origY + rs.origH - newH
      }
    }

    return { newX, newY, newW, newH }
  }

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      const coords = getCanvasCoords(e)

      // --- Commit drag ---
      if (dragState.current) {
        const ds = dragState.current
        if (ds.started) {
          const dx = coords.x - ds.startX
          const dy = coords.y - ds.startY
          const el = elementsRef.current.find((el) => el.id === ds.elementId)

          if (el) {
            let newX = ds.origX + dx
            let newY = ds.origY + dy
            newX = Math.max(-el.width + MIN_VISIBLE, Math.min(canvasWidth - MIN_VISIBLE, newX))
            newY = Math.max(-el.height + MIN_VISIBLE, Math.min(canvasHeight - MIN_VISIBLE, newY))

            onElementsChange(
              elementsRef.current.map((el) =>
                el.id === ds.elementId ? { ...el, x: newX, y: newY } : el
              )
            )
          }
        }
        if (activeElementRef.current) {
          activeElementRef.current.style.cursor = ''
        }
        dragState.current = null
        activeElementRef.current = null
        return
      }

      // --- Commit resize ---
      if (resizeState.current) {
        const rs = resizeState.current
        const dx = coords.x - rs.startX
        const dy = coords.y - rs.startY
        const { newX, newY, newW, newH } = computeResize(rs, dx, dy, e.shiftKey)

        onElementsChange(
          elementsRef.current.map((el) =>
            el.id === rs.elementId
              ? { ...el, x: newX, y: newY, width: newW, height: newH }
              : el
          )
        )

        resizeState.current = null
        activeElementRef.current = null
        return
      }
    },
    [getCanvasCoords, canvasWidth, canvasHeight, onElementsChange]
  )

  return (
    <div
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: active ? 'auto' : 'none',
      }}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {elements
        .filter((el) => el.visible)
        .map((el) => (
          <div
            key={el.id}
            data-element-id={el.id}
            style={{
              position: 'absolute',
              left: `${el.x}px`,
              top: `${el.y}px`,
              width: `${el.width}px`,
              height: `${el.height}px`,
              zIndex: el.zIndex,
              opacity: el.style.opacity ?? 1,
              pointerEvents: el.locked ? 'none' : 'auto',
              cursor: editingId === el.id ? 'text' : 'grab',
              outline: selectedId === el.id ? '2px solid #3b82f6' : 'none',
              outlineOffset: selectedId === el.id ? '1px' : undefined,
            }}
            onMouseDown={(e) => {
              e.stopPropagation()
              handleElementMouseDown(e, el.id)
            }}
            onDoubleClick={(e) => {
              e.stopPropagation()
              handleElementDoubleClick(el.id)
            }}
          >
            <ElementRenderer
              element={{ ...el, x: 0, y: 0 }}
              selected={selectedId === el.id}
              editing={editingId === el.id}
              onSelect={() => handleElementSelect(el.id)}
              onDoubleClick={() => handleElementDoubleClick(el.id)}
              scale={scale}
            />
          </div>
        ))}

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        tabIndex={-1}
      />
    </div>
  )
}
