'use client'

import { useState } from 'react'
import { FormField } from '@/components/shared/FormField'
import type { Class } from '@/lib/types/database'

export interface StaffFormData {
  full_name: string
  phone: string
  designation: string
  class_id: string
  date_of_joining: string
  salary: string
  emergency_contact: string
  address: string
}

const EMPTY_FORM: StaffFormData = {
  full_name: '',
  phone: '',
  designation: '',
  class_id: '',
  date_of_joining: '',
  salary: '',
  emergency_contact: '',
  address: '',
}

interface StaffFormProps {
  initialData?: StaffFormData
  classes: Class[]
  onSubmit: (data: StaffFormData) => Promise<void>
  onCancel: () => void
  submitLabel?: string
}

export function StaffForm({ initialData, classes, onSubmit, onCancel, submitLabel = 'Save' }: StaffFormProps) {
  const [form, setForm] = useState<StaffFormData>(initialData ?? EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  const update = (field: keyof StaffFormData) => (value: string) =>
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
      <FormField label="Full Name" name="full_name" value={form.full_name} onChange={update('full_name')} required />
      <FormField label="Phone" name="phone" type="tel" value={form.phone} onChange={update('phone')} />
      <FormField
        label="Designation"
        name="designation"
        type="select"
        value={form.designation}
        onChange={update('designation')}
        options={[
          { value: 'teacher', label: 'Teacher' },
          { value: 'assistant', label: 'Assistant' },
          { value: 'driver', label: 'Driver' },
          { value: 'cook', label: 'Cook' },
          { value: 'admin', label: 'Admin' },
          { value: 'other', label: 'Other' },
        ]}
        required
      />
      <FormField
        label="Assigned Class"
        name="class_id"
        type="select"
        value={form.class_id}
        onChange={update('class_id')}
        options={classes.map((c) => ({ value: c.id, label: c.name }))}
        placeholder="None"
      />
      <FormField label="Date of Joining" name="date_of_joining" type="date" value={form.date_of_joining} onChange={update('date_of_joining')} />
      <FormField label="Monthly Salary" name="salary" type="number" value={form.salary} onChange={update('salary')} />
      <FormField label="Emergency Contact" name="emergency_contact" type="tel" value={form.emergency_contact} onChange={update('emergency_contact')} />
      <FormField label="Address" name="address" type="textarea" value={form.address} onChange={update('address')} rows={2} />

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
