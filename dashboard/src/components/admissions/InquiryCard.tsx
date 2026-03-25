'use client'

import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatDate } from '@/lib/utils/formatters'
import type { Inquiry } from '@/lib/types/database'
import { Phone, MessageCircle, Calendar } from 'lucide-react'

interface InquiryCardProps {
  inquiry: Inquiry
  onStatusChange?: (id: string, status: string) => void
  onEdit?: (inquiry: Inquiry) => void
  compact?: boolean
}

export function InquiryCard({ inquiry, onStatusChange, onEdit, compact = false }: InquiryCardProps) {
  const isOverdue = inquiry.follow_up_date && new Date(inquiry.follow_up_date) < new Date() && inquiry.status !== 'enrolled' && inquiry.status !== 'declined'

  return (
    <div
      className={`card !p-4 ${isOverdue ? 'border-l-4 border-l-danger' : ''} ${onEdit ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={() => onEdit?.(inquiry)}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
            {(inquiry.child_name || inquiry.parent_name)[0]?.toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-sm text-primary-dark">
              {inquiry.child_name || 'Child TBD'}
              {inquiry.class_sought && <span className="text-text-muted font-normal"> — {inquiry.class_sought}</span>}
            </div>
            <div className="text-xs text-text-muted">Parent: {inquiry.parent_name}</div>
            {!compact && inquiry.notes && (
              <div className="text-xs text-text-light mt-1 line-clamp-2">{inquiry.notes}</div>
            )}
            {isOverdue && (
              <div className="text-xs text-danger font-medium mt-1 flex items-center gap-1">
                <Calendar size={10} /> Follow-up overdue ({formatDate(inquiry.follow_up_date!)})
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <StatusBadge status={inquiry.status} />
          {inquiry.parent_phone && (
            <a
              href={`tel:${inquiry.parent_phone}`}
              onClick={(e) => e.stopPropagation()}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-muted"
            >
              <Phone size={14} className="text-primary" />
            </a>
          )}
          {inquiry.parent_phone && (
            <a
              href={`https://wa.me/${inquiry.parent_phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-muted"
            >
              <MessageCircle size={14} className="text-green-600" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
