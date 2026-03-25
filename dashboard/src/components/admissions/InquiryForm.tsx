'use client'

import { useState } from 'react'
import { FormField } from '@/components/shared/FormField'

export interface InquiryFormData {
  parent_name: string
  parent_phone: string
  parent_email: string
  child_name: string
  child_dob: string
  class_sought: string
  source: string
  notes: string
  follow_up_date: string
}

const EMPTY_FORM: InquiryFormData = {
  parent_name: '',
  parent_phone: '',
  parent_email: '',
  child_name: '',
  child_dob: '',
  class_sought: '',
  source: '',
  notes: '',
  follow_up_date: '',
}

interface InquiryFormProps {
  initialData?: InquiryFormData
  onSubmit: (data: InquiryFormData) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

export function InquiryForm({ initialData, onSubmit, onCancel, submitLabel = 'Save' }: InquiryFormProps) {
  const [form, setForm] = useState<InquiryFormData>(initialData ?? EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const update = (field: keyof InquiryFormData) => (value: string) =>
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
      <FormField label="Parent Name" name="parent_name" value={form.parent_name} onChange={update('parent_name')} required />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Parent Phone" name="parent_phone" type="tel" value={form.parent_phone} onChange={update('parent_phone')} />
        <FormField label="Parent Email" name="parent_email" type="email" value={form.parent_email} onChange={update('parent_email')} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Child Name" name="child_name" value={form.child_name} onChange={update('child_name')} />
        <FormField label="Child DOB" name="child_dob" type="date" value={form.child_dob} onChange={update('child_dob')} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField label="Class Sought" name="class_sought" value={form.class_sought} onChange={update('class_sought')} placeholder="e.g. Nursery, LKG" />
        <FormField
          label="Source"
          name="source"
          type="select"
          value={form.source}
          onChange={update('source')}
          options={[
            { value: 'walkin', label: 'Walk-in' },
            { value: 'referral', label: 'Referral' },
            { value: 'website', label: 'Website' },
            { value: 'social_media', label: 'Social Media' },
            { value: 'other', label: 'Other' },
          ]}
        />
      </div>
      <FormField label="Follow-up Date" name="follow_up_date" type="date" value={form.follow_up_date} onChange={update('follow_up_date')} />
      <FormField label="Notes" name="notes" type="textarea" value={form.notes} onChange={update('notes')} rows={3} />

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
