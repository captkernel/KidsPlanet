'use client'

import { useState, useRef } from 'react'
import { Upload, X, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface FileUploadProps {
  bucket: string
  path: string
  accept?: string
  onUpload: (url: string) => void
  label?: string
}

export function FileUpload({ bucket, path, accept = 'image/*', onUpload, label = 'Upload file' }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)
    setFileName(file.name)

    const filePath = `${path}/${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file)

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    onUpload(publicUrl)
    setUploading(false)
  }

  return (
    <div>
      <label className="label">{label}</label>
      <div
        className="border-2 border-dashed border-surface-muted rounded-xl p-6 text-center cursor-pointer hover:border-primary/30 transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleUpload}
        />

        {uploading ? (
          <div className="text-text-muted text-sm">Uploading...</div>
        ) : fileName ? (
          <div className="flex items-center justify-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-primary" />
            <span>{fileName}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setFileName(null)
              }}
              className="w-5 h-5 flex items-center justify-center"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 text-text-muted mx-auto mb-2" />
            <p className="text-sm text-text-muted">Tap to upload</p>
          </>
        )}
      </div>
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  )
}
