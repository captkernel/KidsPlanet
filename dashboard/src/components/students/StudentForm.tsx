'use client'

import { FormField } from '@/components/shared/FormField'
import type { Class } from '@/lib/types/database'

export interface StudentFormData {
  full_name: string
  dob: string
  blood_group: string
  class_id: string
  enrollment_date: string
}

interface StudentFormProps {
  value: StudentFormData
  onChange: (data: StudentFormData) => void
  classes: Class[]
}

const BLOOD_GROUPS = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
]

export function StudentForm({ value, onChange, classes }: StudentFormProps) {
  const update = (field: keyof StudentFormData) => (val: string) => {
    onChange({ ...value, [field]: val })
  }

  const classOptions = classes.map((c) => ({ value: c.id, label: c.name }))

  return (
    <div className="grid gap-4">
      <FormField
        label="Full Name"
        name="full_name"
        value={value.full_name}
        onChange={update('full_name')}
        placeholder="Child's full name"
        required
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Date of Birth"
          name="dob"
          type="date"
          value={value.dob}
          onChange={update('dob')}
        />
        <FormField
          label="Blood Group"
          name="blood_group"
          type="select"
          value={value.blood_group}
          onChange={update('blood_group')}
          options={BLOOD_GROUPS}
          placeholder="Select blood group"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          label="Class"
          name="class_id"
          type="select"
          value={value.class_id}
          onChange={update('class_id')}
          options={classOptions}
          placeholder="Select class"
        />
        <FormField
          label="Enrollment Date"
          name="enrollment_date"
          type="date"
          value={value.enrollment_date}
          onChange={update('enrollment_date')}
        />
      </div>
    </div>
  )
}
