'use client'

import { useState } from 'react'
import { FormField } from '@/components/shared/FormField'

export interface LeaveFormData {
  leave_type: string
  from_date: string
  to_date: string
  reason: string
}

interface LeaveRequestFormProps {
  onSubmit: (data: LeaveFormData) => Promise<void>
  onCancel: () => void
}

export function LeaveRequestForm({ onSubmit, onCancel }: LeaveRequestFormProps) {
  const [form, setForm] = useState<LeaveFormData>({
    leave_type: '',
    from_date: '',
    to_date: '',
    reason: '',
  })
  const [saving, setSaving] = useState(false)

  const update = (field: keyof LeaveFormData) => (value: string) =>
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
      <FormField
        label="Leave Type"
        name="leave_type"
        type="select"
        value={form.leave_type}
        onChange={update('leave_type')}
        options={[
          { value: 'casual', label: 'Casual Leave' },
          { value: 'sick', label: 'Sick Leave' },
          { value: 'earned', label: 'Earned Leave' },
        ]}
        required
      />
      <FormField label="From Date" name="from_date" type="date" value={form.from_date} onChange={update('from_date')} required />
      <FormField label="To Date" name="to_date" type="date" value={form.to_date} onChange={update('to_date')} required />
      <FormField label="Reason" name="reason" type="textarea" value={form.reason} onChange={update('reason')} rows={3} />

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary flex-1" disabled={saving}>
          {saving ? 'Submitting...' : 'Submit Request'}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
      </div>
    </form>
  )
}
