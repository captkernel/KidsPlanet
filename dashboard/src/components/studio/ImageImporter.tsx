'use client'

import { useCallback, useRef } from 'react'

interface ImportResult {
  dataUrl: string
  width: number
  height: number
}

export function useImageImporter(
  canvasWidth: number,
  canvasHeight: number,
  onImport?: (result: ImportResult) => void,
) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(
    (file: File): Promise<ImportResult | null> => {
      return new Promise((resolve) => {
        if (file.size > 5 * 1024 * 1024) {
          alert('Image must be under 5MB')
          resolve(null)
          return
        }

        const reader = new FileReader()
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string
          const img = new Image()
          img.onload = () => {
            const maxW = canvasWidth * 0.5
            const maxH = canvasHeight * 0.5
            let w = img.width
            let h = img.height
            if (w > maxW || h > maxH) {
              const ratio = Math.min(maxW / w, maxH / h)
              w = Math.round(w * ratio)
              h = Math.round(h * ratio)
            }
            resolve({ dataUrl, width: w, height: h })
          }
          img.src = dataUrl
        }
        reader.readAsDataURL(file)
      })
    },
    [canvasWidth, canvasHeight],
  )

  const importFromFile = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        const result = await processFile(file)
        if (result && onImport) onImport(result)
      }
      e.target.value = ''
    },
    [processFile, onImport],
  )

  const importFromDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      const file = e.dataTransfer.files[0]
      if (file?.type.startsWith('image/')) {
        return await processFile(file)
      }
      return null
    },
    [processFile],
  )

  const handlePaste = useCallback(
    async (e: ClipboardEvent) => {
      if (document.activeElement?.getAttribute('contenteditable') === 'true') return null

      const items = e.clipboardData?.items
      if (!items) return null
      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) return await processFile(file)
        }
      }
      return null
    },
    [processFile],
  )

  return { importFromFile, importFromDrop, handlePaste, handleFileChange, fileInputRef }
}
