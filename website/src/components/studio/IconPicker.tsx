'use client'

import { useState } from 'react'
import { icons } from 'lucide-react'
import { Modal } from '@/components/shared/Modal'
import { CURATED_ICONS } from '@/data/curated-icons'

interface IconPickerProps {
  open: boolean
  onClose: () => void
  onSelect: (iconName: string) => void
}

function toPascalCase(str: string) {
  return str.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')
}

export function IconPicker({ open, onClose, onSelect }: IconPickerProps) {
  const [search, setSearch] = useState('')

  const filtered = search.trim()
    ? CURATED_ICONS.filter(name => name.includes(search.trim().toLowerCase()))
    : CURATED_ICONS

  function handleSelect(iconName: string) {
    onSelect(iconName)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Pick an Icon" size="lg">
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Search icons..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <div className="grid grid-cols-8 gap-1">
          {filtered.map(iconName => {
            const pascalName = toPascalCase(iconName)
            const IconComponent = (icons as Record<string, React.ComponentType<{ size?: number }>>)[pascalName]
            if (!IconComponent) return null
            return (
              <button
                key={iconName}
                title={iconName}
                onClick={() => handleSelect(iconName)}
                className="w-12 h-12 rounded-xl flex items-center justify-center hover:bg-green-50 cursor-pointer transition-colors"
              >
                <IconComponent size={24} />
              </button>
            )
          })}
        </div>
      </div>
    </Modal>
  )
}
