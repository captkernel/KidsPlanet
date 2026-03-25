'use client'

import Link from 'next/link'
import Image from 'next/image'
import { getInitials } from '@/lib/utils/formatters'
import type { StudentWithClass } from '@/lib/types/database'

interface StudentCardProps {
  student: StudentWithClass
}

export function StudentCard({ student }: StudentCardProps) {
  const initials = getInitials(student.full_name)

  return (
    <Link
      href={`/students/${student.id}`}
      className="card flex items-center gap-4 hover:shadow-md transition-shadow min-h-[68px]"
    >
      {student.photo_url ? (
        <Image
          src={student.photo_url}
          alt={student.full_name}
          width={44}
          height={44}
          className="w-11 h-11 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0">
          {initials}
        </div>
      )}
      <div className="min-w-0">
        <p className="font-semibold text-primary-dark truncate">{student.full_name}</p>
        {student.class && (
          <p className="text-sm text-text-muted truncate">{student.class.name}</p>
        )}
      </div>
    </Link>
  )
}
