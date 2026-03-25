'use client'

import Link from 'next/link'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { StaffWithClass } from '@/lib/types/database'
import { Phone } from 'lucide-react'

const designationLabels: Record<string, string> = {
  teacher: 'Teacher',
  assistant: 'Assistant',
  driver: 'Driver',
  cook: 'Cook',
  admin: 'Admin',
  other: 'Other',
}

export function StaffCard({ staff }: { staff: StaffWithClass }) {
  const initials = staff.full_name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Link href={`/staff/${staff.id}`} className="card hover:shadow-md transition-shadow block">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
          {staff.photo_url ? (
            <img src={staff.photo_url} alt={staff.full_name} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-primary-dark truncate">{staff.full_name}</div>
          <div className="text-xs text-accent font-medium">
            {staff.designation ? designationLabels[staff.designation] : 'Staff'}
          </div>
          {staff.class?.name && (
            <div className="text-xs text-text-muted mt-0.5">Class: {staff.class.name}</div>
          )}
          <div className="flex items-center gap-2 mt-2">
            <StatusBadge status={staff.status} />
            {staff.phone && (
              <span className="text-xs text-text-muted flex items-center gap-1">
                <Phone size={10} /> {staff.phone}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
