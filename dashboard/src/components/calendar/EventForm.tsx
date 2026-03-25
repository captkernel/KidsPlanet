'use client'

import { useState } from 'react'
import { FormField } from '@/components/shared/FormField'

export interface EventFormData {
  title: string
  description: string
  date: string
  end_date: string
  type: string
  audience: string
}

interface EventFormProps {
  initialData?: EventFormData
  onSubmit: (data: EventFormData) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

export function EventForm({ initialData, onSubmit, onCancel, submitLabel = 'Save' }: EventFormProps) {
  const [form, setForm] = useState<EventFormData>(
    initialData ?? { title: '', description: '', date: '', end_date: '', type: '', audience: 'all' }
  )
  const [saving, setSaving] = useState(false)

  const update = (field: keyof EventFormData) => (value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSubmit(form)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Title" name="title" value={form.title} onChange={update('title')} required />
      <FormField
        label="Event Type"
        name="type"
        type="select"
        value={form.type}
        onChange={update('type')}
        options={[
          { value: 'holiday', label: 'Holiday' },
          { value: 'event', label: 'Event' },
          { value: 'pta_meeting', label: 'PTA Meeting' },
          { value: 'exam', label: 'Exam' },
          { value: 'field_trip', label: 'Field Trip' },
        ]}
        required
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Start Date" name="date" type="date" value={form.date} onChange={update('date')} required />
        <FormField label="End Date" name="end_date" type="date" value={form.end_date} onChange={update('end_date')} />
      </div>
      <FormField
        label="Audience"
        name="audience"
        type="select"
        value={form.audience}
        onChange={update('audience')}
        options={[
          { value: 'all', label: 'Everyone' },
          { value: 'staff', label: 'Staff Only' },
          { value: 'parents', label: 'Parents Only' },
          { value: 'class', label: 'Specific Class' },
        ]}
      />
      <FormField label="Description" name="description" type="textarea" value={form.description} onChange={update('description')} rows={3} />

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary flex-1" disabled={saving}>
          {saving ? 'Saving...' : submitLabel}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
      </div>
    </form>
  )
}
