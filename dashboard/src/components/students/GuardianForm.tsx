'use client'

import { FormField } from '@/components/shared/FormField'

export interface GuardianFormData {
  full_name: string
  phone: string
  email: string
  relation: string
  occupation: string
  address: string
  is_primary: boolean
}

interface GuardianFormProps {
  value: GuardianFormData
  onChange: (data: GuardianFormData) => void
}

const RELATIONS = [
  { value: 'Father', label: 'Father' },
  { value: 'Mother', label: 'Mother' },
  { value: 'Guardian', label: 'Guardian' },
  { value: 'Other', label: 'Other' },
]

export function GuardianForm({ value, onChange }: GuardianFormProps) {
  const update = (field: keyof GuardianFormData) => (val: string) => {
    onChange({ ...value, [field]: val })
  }

  return (
    <div className="grid gap-4">
      <FormField
        label="Full Name"
        name="guardian_full_name"
        value={value.full_name}
        onChange={update('full_name')}
        placeholder="Guardian's full name"
        required
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Phone"
          name="guardian_phone"
          type="tel"
          value={value.phone}
          onChange={update('phone')}
          placeholder="10-digit mobile number"
          required
        />
        <FormField
          label="Email"
          name="guardian_email"
          type="email"
          value={value.email}
          onChange={update('email')}
          placeholder="email@example.com"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Relation"
          name="guardian_relation"
          type="select"
          value={value.relation}
          onChange={update('relation')}
          options={RELATIONS}
          placeholder="Select relation"
        />
        <FormField
          label="Occupation"
          name="guardian_occupation"
          value={value.occupation}
          onChange={update('occupation')}
          placeholder="e.g. Engineer, Teacher"
        />
      </div>
      <FormField
        label="Address"
        name="guardian_address"
        type="textarea"
        value={value.address}
        onChange={update('address')}
        placeholder="Full address"
        rows={2}
      />
      <label className="flex items-center gap-3 min-h-[44px] cursor-pointer">
        <input
          type="checkbox"
          checked={value.is_primary}
          onChange={(e) => onChange({ ...value, is_primary: e.target.checked })}
          className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <span className="text-sm font-medium">Primary guardian</span>
      </label>
    </div>
  )
}
