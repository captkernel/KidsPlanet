'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { type CanvasElement } from '@/lib/types/canvas'
import ElementRenderer from '@/components/studio/ElementRenderer'
import {
  Copy,
  Trash2,
  ArrowUpToLine,
  ArrowDownToLine,
  Lock,
  Unlock,
} from 'lucide-react'

interface CanvasEditorProps {
  elements: CanvasElement[]
  onElementsChange: (elements: CanvasElement[]) => void
  canvasWidth: number
  canvasHeight: number
  scale: number
  active: boolean
  onSelectionChange?: (ids: string[]) => void
}

interface DragState {
  startX: number
  startY: number
  origPositions: Record<string, { x: number; y: number }>
  primaryId: string
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

interface SnapGuides {
  vertical: number | null
  horizontal: number | null
}

interface ContextMenuState {
  x: number
  y: number
  elementId: string
}

const DRAG_THRESHOLD = 3
const MIN_SIZE = 20
const MIN_VISIBLE = 20
const SNAP_THRESHOLD = 5
const NUDGE_SMALL = 1
const NUDGE_LARGE = 10

export default function CanvasEditor({
  elements,
  onElementsChange,
  canvasWidth,
  canvasHeight,
  scale,
  active,
  onSelectionChange,
}: CanvasEditorProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [snapGuides, setSnapGuides] = useState<SnapGuides>({ vertical: null, horizontal: null })
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null)

  const canvasRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragState = useRef<DragState | null>(null)
  const resizeState = useRef<ResizeState | null>(null)

  // Refs to avoid stale closures
  const elementsRef = useRef(elements)
  elementsRef.current = elements
  const selectedIdsRef = useRef(selectedIds)
  selectedIdsRef.current = selectedIds
  const editingIdRef = useRef(editingId)
  editingIdRef.current = editingId

  // Notify parent of selection changes
  const updateSelection = useCallback(
    (ids: string[]) => {
      setSelectedIds(ids)
      onSelectionChange?.(ids)
    },
    [onSelectionChange]
  )

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

  // Snap guides — canvas center, canvas edges, and other element centers/edges
  const calcSnap = useCallback(
    (elW: number, elH: number, rawX: number, rawY: number, excludeIds: string[] = []) => {
      const guides: SnapGuides = { vertical: null, horizontal: null }
      let snappedX = rawX
      let snappedY = rawY

      const elCX = rawX + elW / 2
      const elCY = rawY + elH / 2
      const elL = rawX
      const elR = rawX + elW
      const elT = rawY
      const elB = rawY + elH
      const cCX = canvasWidth / 2
      const cCY = canvasHeight / 2
      const excludeSet = new Set(excludeIds)

      // Snap to canvas center
      if (Math.abs(elCX - cCX) < SNAP_THRESHOLD) {
        snappedX = cCX - elW / 2
        guides.vertical = cCX
      }
      if (Math.abs(elCY - cCY) < SNAP_THRESHOLD) {
        snappedY = cCY - elH / 2
        guides.horizontal = cCY
      }

      // Snap to canvas edges
      if (!guides.vertical) {
        if (Math.abs(elL) < SNAP_THRESHOLD) {
          snappedX = 0
          guides.vertical = 0
        } else if (Math.abs(elR - canvasWidth) < SNAP_THRESHOLD) {
          snappedX = canvasWidth - elW
          guides.vertical = canvasWidth
        }
      }
      if (!guides.horizontal) {
        if (Math.abs(elT) < SNAP_THRESHOLD) {
          snappedY = 0
          guides.horizontal = 0
        } else if (Math.abs(elB - canvasHeight) < SNAP_THRESHOLD) {
          snappedY = canvasHeight - elH
          guides.horizontal = canvasHeight
        }
      }

      // Snap to other elements (centers + edges)
      for (const other of elementsRef.current) {
        if (!other.visible || excludeSet.has(other.id)) continue
        const oCX = other.x + other.width / 2
        const oCY = other.y + other.height / 2
        const oL = other.x
        const oR = other.x + other.width
        const oT = other.y
        const oB = other.y + other.height

        if (!guides.vertical) {
          if (Math.abs(elCX - oCX) < SNAP_THRESHOLD) {
            snappedX = oCX - elW / 2
            guides.vertical = oCX
          } else if (Math.abs(elL - oL) < SNAP_THRESHOLD) {
            snappedX = oL
            guides.vertical = oL
          } else if (Math.abs(elR - oR) < SNAP_THRESHOLD) {
            snappedX = oR - elW
            guides.vertical = oR
          } else if (Math.abs(elL - oR) < SNAP_THRESHOLD) {
            snappedX = oR
            guides.vertical = oR
          } else if (Math.abs(elR - oL) < SNAP_THRESHOLD) {
            snappedX = oL - elW
            guides.vertical = oL
          }
        }

        if (!guides.horizontal) {
          if (Math.abs(elCY - oCY) < SNAP_THRESHOLD) {
            snappedY = oCY - elH / 2
            guides.horizontal = oCY
          } else if (Math.abs(elT - oT) < SNAP_THRESHOLD) {
            snappedY = oT
            guides.horizontal = oT
          } else if (Math.abs(elB - oB) < SNAP_THRESHOLD) {
            snappedY = oB - elH
            guides.horizontal = oB
          } else if (Math.abs(elT - oB) < SNAP_THRESHOLD) {
            snappedY = oB
            guides.horizontal = oB
          } else if (Math.abs(elB - oT) < SNAP_THRESHOLD) {
            snappedY = oT - elH
            guides.horizontal = oT
          }
        }
      }

      return { snappedX, snappedY, guides }
    },
    [canvasWidth, canvasHeight]
  )

  // Find the wrapper DOM node for an element
  const findElementNode = useCallback(
    (elementId: string): HTMLElement | null => {
      return canvasRef.current?.querySelector(
        `[data-element-id="${elementId}"]`
      ) as HTMLElement | null
    },
    []
  )

  // ── Keyboard shortcuts ──
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!active) return

      if (e.key === 'Escape') {
        setContextMenu(null)
        setEditingId(null)
        updateSelection([])
        return
      }

      // Skip if focus is in an input/textarea/contenteditable
      const tag = (e.target as HTMLElement)?.tagName
      const isInput =
        tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable
      if (isInput) return

      // Delete/Backspace — remove all selected
      if (
        (e.key === 'Delete' || e.key === 'Backspace') &&
        selectedIdsRef.current.length > 0 &&
        !editingIdRef.current
      ) {
        const ids = new Set(selectedIdsRef.current)
        onElementsChange(elementsRef.current.filter((el) => !ids.has(el.id)))
        updateSelection([])
        e.preventDefault()
      }

      // Arrow key nudging — move all selected
      if (
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) &&
        selectedIdsRef.current.length > 0 &&
        !editingIdRef.current
      ) {
        const step = e.shiftKey ? NUDGE_LARGE : NUDGE_SMALL
        const ids = new Set(selectedIdsRef.current)

        onElementsChange(
          elementsRef.current.map((el) => {
            if (!ids.has(el.id)) return el
            let x = el.x
            let y = el.y
            if (e.key === 'ArrowUp') y -= step
            if (e.key === 'ArrowDown') y += step
            if (e.key === 'ArrowLeft') x -= step
            if (e.key === 'ArrowRight') x += step
            x = Math.max(-el.width + MIN_VISIBLE, Math.min(canvasWidth - MIN_VISIBLE, x))
            y = Math.max(-el.height + MIN_VISIBLE, Math.min(canvasHeight - MIN_VISIBLE, y))
            return { ...el, x, y }
          })
        )
        e.preventDefault()
      }

      // Ctrl+D — duplicate all selected
      if (
        e.key === 'd' &&
        (e.ctrlKey || e.metaKey) &&
        selectedIdsRef.current.length > 0 &&
        !editingIdRef.current
      ) {
        const ids = new Set(selectedIdsRef.current)
        const maxZ = Math.max(...elementsRef.current.map((e) => e.zIndex))
        const clones: CanvasElement[] = []
        const newIds: string[] = []
        let zOff = 1

        for (const el of elementsRef.current) {
          if (!ids.has(el.id)) continue
          const clone: CanvasElement = {
            ...el,
            id: crypto.randomUUID(),
            x: el.x + 20,
            y: el.y + 20,
            zIndex: maxZ + zOff++,
          }
          clones.push(clone)
          newIds.push(clone.id)
        }

        onElementsChange([...elementsRef.current, ...clones])
        updateSelection(newIds)
        e.preventDefault()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [active, onElementsChange, canvasWidth, canvasHeight, updateSelection])

  // ── Mouse handlers ──

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === canvasRef.current) {
        updateSelection([])
        setEditingId(null)
        setContextMenu(null)
      }
    },
    [updateSelection]
  )

  const handleElementMouseDown = useCallback(
    (e: React.MouseEvent, elementId: string) => {
      if (e.button === 2) return // right-click handled by context menu handler
      setContextMenu(null)

      const handle = (e.target as HTMLElement).dataset?.handle
      const coords = getCanvasCoords(e)
      const el = elementsRef.current.find((el) => el.id === elementId)
      if (!el) return

      // Resize — single element only
      if (handle) {
        updateSelection([elementId])
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
        return
      }

      // Multi-select with Shift
      if (e.shiftKey) {
        const current = selectedIdsRef.current
        if (current.includes(elementId)) {
          updateSelection(current.filter((id) => id !== elementId))
        } else {
          updateSelection([...current, elementId])
        }
      } else if (!selectedIdsRef.current.includes(elementId)) {
        // Clicking an unselected element — single select
        updateSelection([elementId])
      }
      // else: clicking an already-selected element in a group — keep group

      // Start drag for all selected elements
      const idsToMove = selectedIdsRef.current.includes(elementId)
        ? selectedIdsRef.current
        : [elementId]

      const origPositions: Record<string, { x: number; y: number }> = {}
      for (const id of idsToMove) {
        const elem = elementsRef.current.find((e) => e.id === id)
        if (elem) origPositions[id] = { x: elem.x, y: elem.y }
      }

      dragState.current = {
        startX: coords.x,
        startY: coords.y,
        origPositions,
        primaryId: elementId,
        started: false,
      }
    },
    [getCanvasCoords, updateSelection]
  )

  const handleElementDoubleClick = useCallback((elementId: string) => {
    const el = elementsRef.current.find((el) => el.id === elementId)
    if (el?.type === 'text') {
      setEditingId(elementId)
    }
  }, [])

  // ── Right-click context menu ──

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, elementId: string) => {
      e.preventDefault()
      e.stopPropagation()
      if (!selectedIdsRef.current.includes(elementId)) {
        updateSelection([elementId])
      }
      setContextMenu({ x: e.clientX, y: e.clientY, elementId })
    },
    [updateSelection]
  )

  const ctxDuplicate = useCallback(() => {
    const ids = new Set(selectedIdsRef.current)
    const maxZ = Math.max(...elementsRef.current.map((e) => e.zIndex))
    const clones: CanvasElement[] = []
    const newIds: string[] = []
    let zOff = 1
    for (const el of elementsRef.current) {
      if (!ids.has(el.id)) continue
      const clone: CanvasElement = {
        ...el,
        id: crypto.randomUUID(),
        x: el.x + 20,
        y: el.y + 20,
        zIndex: maxZ + zOff++,
      }
      clones.push(clone)
      newIds.push(clone.id)
    }
    onElementsChange([...elementsRef.current, ...clones])
    updateSelection(newIds)
    setContextMenu(null)
  }, [onElementsChange, updateSelection])

  const ctxDelete = useCallback(() => {
    const ids = new Set(selectedIdsRef.current)
    onElementsChange(elementsRef.current.filter((el) => !ids.has(el.id)))
    updateSelection([])
    setContextMenu(null)
  }, [onElementsChange, updateSelection])

  const ctxBringToFront = useCallback(() => {
    const maxZ = Math.max(...elementsRef.current.map((e) => e.zIndex))
    const ids = new Set(selectedIdsRef.current)
    onElementsChange(
      elementsRef.current.map((el) =>
        ids.has(el.id) ? ({ ...el, zIndex: maxZ + 1 } as CanvasElement) : el
      )
    )
    setContextMenu(null)
  }, [onElementsChange])

  const ctxSendToBack = useCallback(() => {
    const minZ = Math.min(...elementsRef.current.map((e) => e.zIndex))
    const ids = new Set(selectedIdsRef.current)
    onElementsChange(
      elementsRef.current.map((el) =>
        ids.has(el.id)
          ? ({ ...el, zIndex: Math.max(0, minZ - 1) } as CanvasElement)
          : el
      )
    )
    setContextMenu(null)
  }, [onElementsChange])

  const ctxToggleLock = useCallback(() => {
    if (!contextMenu) return
    const el = elementsRef.current.find((e) => e.id === contextMenu.elementId)
    if (!el) return
    onElementsChange(
      elementsRef.current.map((e) =>
        e.id === contextMenu.elementId
          ? ({ ...e, locked: !e.locked } as CanvasElement)
          : e
      )
    )
    setContextMenu(null)
  }, [contextMenu, onElementsChange])

  // ── Drag & Resize movement ──

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const coords = getCanvasCoords(e)

      // --- Dragging (multi-select aware) ---
      if (dragState.current) {
        const ds = dragState.current
        const dx = coords.x - ds.startX
        const dy = coords.y - ds.startY

        if (!ds.started) {
          if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return
          ds.started = true
        }

        // Calculate snap offset from the primary (clicked) element
        const primaryOrig = ds.origPositions[ds.primaryId]
        const primaryEl = elementsRef.current.find((el) => el.id === ds.primaryId)
        let snapDx = dx
        let snapDy = dy

        if (primaryOrig && primaryEl) {
          let rawX = primaryOrig.x + dx
          let rawY = primaryOrig.y + dy
          rawX = Math.max(
            -primaryEl.width + MIN_VISIBLE,
            Math.min(canvasWidth - MIN_VISIBLE, rawX)
          )
          rawY = Math.max(
            -primaryEl.height + MIN_VISIBLE,
            Math.min(canvasHeight - MIN_VISIBLE, rawY)
          )

          const { snappedX, snappedY, guides } = calcSnap(
            primaryEl.width,
            primaryEl.height,
            rawX,
            rawY,
            Object.keys(ds.origPositions)
          )
          snapDx = snappedX - primaryOrig.x
          snapDy = snappedY - primaryOrig.y
          setSnapGuides(guides)
        }

        // Move all selected elements via DOM for performance
        for (const [id, orig] of Object.entries(ds.origPositions)) {
          const el = elementsRef.current.find((e) => e.id === id)
          const node = findElementNode(id)
          if (!node || !el) continue

          const newX = Math.max(
            -el.width + MIN_VISIBLE,
            Math.min(canvasWidth - MIN_VISIBLE, orig.x + snapDx)
          )
          const newY = Math.max(
            -el.height + MIN_VISIBLE,
            Math.min(canvasHeight - MIN_VISIBLE, orig.y + snapDy)
          )

          node.style.left = `${newX}px`
          node.style.top = `${newY}px`
          node.style.cursor = 'grabbing'
          if (id === ds.primaryId) {
            node.style.filter = 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))'
            node.style.opacity = '0.9'
          }
        }
        return
      }

      // --- Resizing ---
      if (resizeState.current) {
        const rs = resizeState.current
        const rdx = coords.x - rs.startX
        const rdy = coords.y - rs.startY
        const h = rs.handle
        const node = findElementNode(rs.elementId)

        let newX = rs.origX
        let newY = rs.origY
        let newW = rs.origW
        let newH = rs.origH

        if (h.includes('e')) newW = Math.max(MIN_SIZE, rs.origW + rdx)
        else if (h.includes('w')) {
          newW = Math.max(MIN_SIZE, rs.origW - rdx)
          newX = rs.origX + rs.origW - newW
        }

        if (h.includes('s')) newH = Math.max(MIN_SIZE, rs.origH + rdy)
        else if (h.includes('n')) {
          newH = Math.max(MIN_SIZE, rs.origH - rdy)
          newY = rs.origY + rs.origH - newH
        }

        const isCorner = ['nw', 'ne', 'sw', 'se'].includes(h)
        if (isCorner) {
          const el = elementsRef.current.find((el) => el.id === rs.elementId)
          if (el?.type === 'image' && !e.shiftKey) {
            const aspect = rs.origW / rs.origH
            const wFromH = newH * aspect
            const hFromW = newW / aspect
            if (Math.abs(rdx) > Math.abs(rdy)) {
              newH = Math.max(MIN_SIZE, hFromW)
            } else {
              newW = Math.max(MIN_SIZE, wFromH)
            }
            if (h.includes('w')) newX = rs.origX + rs.origW - newW
            if (h.includes('n')) newY = rs.origY + rs.origH - newH
          }
        }

        if (node) {
          node.style.left = `${newX}px`
          node.style.top = `${newY}px`
          node.style.width = `${newW}px`
          node.style.height = `${newH}px`
        }
        return
      }
    },
    [getCanvasCoords, canvasWidth, canvasHeight, calcSnap, findElementNode]
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
          const primaryOrig = ds.origPositions[ds.primaryId]
          const primaryEl = elementsRef.current.find((el) => el.id === ds.primaryId)
          let snapDx = dx
          let snapDy = dy

          if (primaryOrig && primaryEl) {
            let rawX = primaryOrig.x + dx
            let rawY = primaryOrig.y + dy
            rawX = Math.max(
              -primaryEl.width + MIN_VISIBLE,
              Math.min(canvasWidth - MIN_VISIBLE, rawX)
            )
            rawY = Math.max(
              -primaryEl.height + MIN_VISIBLE,
              Math.min(canvasHeight - MIN_VISIBLE, rawY)
            )
            const { snappedX, snappedY } = calcSnap(
              primaryEl.width,
              primaryEl.height,
              rawX,
              rawY,
              Object.keys(ds.origPositions)
            )
            snapDx = snappedX - primaryOrig.x
            snapDy = snappedY - primaryOrig.y
          }

          onElementsChange(
            elementsRef.current.map((el) => {
              const orig = ds.origPositions[el.id]
              if (!orig) return el
              const newX = Math.max(
                -el.width + MIN_VISIBLE,
                Math.min(canvasWidth - MIN_VISIBLE, orig.x + snapDx)
              )
              const newY = Math.max(
                -el.height + MIN_VISIBLE,
                Math.min(canvasHeight - MIN_VISIBLE, orig.y + snapDy)
              )
              return { ...el, x: newX, y: newY }
            })
          )
        }

        // Clear visual feedback
        for (const id of Object.keys(ds.origPositions)) {
          const node = findElementNode(id)
          if (node) {
            node.style.cursor = ''
            node.style.filter = ''
            node.style.opacity = ''
          }
        }

        setSnapGuides({ vertical: null, horizontal: null })
        dragState.current = null
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
        return
      }
    },
    [getCanvasCoords, canvasWidth, canvasHeight, onElementsChange, calcSnap, findElementNode]
  )

  // Close context menu on outside click
  useEffect(() => {
    if (!contextMenu) return
    const handler = () => setContextMenu(null)
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [contextMenu])

  const ctxLockedElement = contextMenu
    ? elementsRef.current.find((e) => e.id === contextMenu.elementId)
    : null
  const isLocked = ctxLockedElement?.locked ?? false

  const ctxMenuContent = contextMenu && (
    <div
      style={{
        position: 'fixed',
        left: contextMenu.x,
        top: contextMenu.y,
        zIndex: 100000,
      }}
      className="bg-white rounded-lg shadow-xl border border-gray-200 py-1 min-w-[160px] text-sm"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={ctxDuplicate}
        className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-50 text-left"
      >
        <Copy size={14} className="text-gray-400" /> Duplicate
      </button>
      <button
        onClick={ctxDelete}
        className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-red-50 text-left text-red-600"
      >
        <Trash2 size={14} /> Delete
      </button>
      <div className="h-px bg-gray-100 my-1" />
      <button
        onClick={ctxBringToFront}
        className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-50 text-left"
      >
        <ArrowUpToLine size={14} className="text-gray-400" /> Bring to Front
      </button>
      <button
        onClick={ctxSendToBack}
        className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-50 text-left"
      >
        <ArrowDownToLine size={14} className="text-gray-400" /> Send to Back
      </button>
      <div className="h-px bg-gray-100 my-1" />
      <button
        onClick={ctxToggleLock}
        className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-gray-50 text-left"
      >
        {isLocked ? (
          <Unlock size={14} className="text-gray-400" />
        ) : (
          <Lock size={14} className="text-gray-400" />
        )}
        {isLocked ? 'Unlock' : 'Lock'}
      </button>
    </div>
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
        .map((el) => {
          const isSelected = selectedIds.includes(el.id)
          const isHovered = hoveredId === el.id && !isSelected
          return (
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
                outline: isSelected
                  ? '2px solid #3b82f6'
                  : isHovered
                    ? '1.5px solid #93c5fd'
                    : 'none',
                outlineOffset: isSelected || isHovered ? '1px' : undefined,
                borderRadius: isHovered ? '2px' : undefined,
                transition: dragState.current ? 'none' : 'outline 0.15s ease',
              }}
              onMouseDown={(e) => {
                e.stopPropagation()
                handleElementMouseDown(e, el.id)
              }}
              onMouseEnter={() => setHoveredId(el.id)}
              onMouseLeave={() => setHoveredId(null)}
              onDoubleClick={(e) => {
                e.stopPropagation()
                handleElementDoubleClick(el.id)
              }}
              onContextMenu={(e) => handleContextMenu(e, el.id)}
            >
              <ElementRenderer
                element={{ ...el, x: 0, y: 0 }}
                selected={isSelected}
                editing={editingId === el.id}
                onSelect={() => updateSelection([el.id])}
                onDoubleClick={() => handleElementDoubleClick(el.id)}
                scale={scale}
              />
            </div>
          )
        })}

      {/* Snap guide lines */}
      {snapGuides.vertical !== null && (
        <div
          style={{
            position: 'absolute',
            left: `${snapGuides.vertical}px`,
            top: 0,
            width: 0,
            height: '100%',
            borderLeft: '1px dashed #f43f5e',
            pointerEvents: 'none',
            zIndex: 99999,
          }}
        />
      )}
      {snapGuides.horizontal !== null && (
        <div
          style={{
            position: 'absolute',
            top: `${snapGuides.horizontal}px`,
            left: 0,
            height: 0,
            width: '100%',
            borderTop: '1px dashed #f43f5e',
            pointerEvents: 'none',
            zIndex: 99999,
          }}
        />
      )}

      {/* Context menu — portal to body to escape CSS transforms */}
      {ctxMenuContent && typeof document !== 'undefined' && createPortal(ctxMenuContent, document.body)}

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
