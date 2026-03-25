'use client'

import { useState } from 'react'
import { formatDate } from '@/lib/utils/formatters'
import { StatusBadge } from '@/components/shared/StatusBadge'
import type { Message } from '@/lib/types/database'
import { ChevronDown, ChevronUp, Users, GraduationCap, User } from 'lucide-react'

type MessageWithCount = Message & { message_recipients: { count: number }[] }

interface MessageListProps {
  messages: MessageWithCount[]
}

const audienceIcon: Record<string, typeof Users> = {
  all: Users,
  class: GraduationCap,
  individual: User,
}

export default function MessageList({ messages }: MessageListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (messages.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-text-muted">No messages sent yet. Use the Compose tab to send your first message.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {messages.map((msg) => {
        const isExpanded = expandedId === msg.id
        const Icon = audienceIcon[msg.audience] ?? Users
        const recipientCount = msg.message_recipients?.[0]?.count ?? 0
        const displayTitle = msg.subject || (msg.body.length > 50 ? msg.body.slice(0, 50) + '...' : msg.body)

        return (
          <div key={msg.id} className="card !p-0 overflow-hidden">
            <button
              type="button"
              onClick={() => setExpandedId(isExpanded ? null : msg.id)}
              className="w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-surface/50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-primary-dark truncate">{displayTitle}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-text-muted">{formatDate(msg.created_at)}</span>
                    <span className="text-xs text-text-muted">&middot;</span>
                    <span className="text-xs text-text-muted">{recipientCount} recipient{recipientCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={msg.audience} />
                {isExpanded ? <ChevronUp size={16} className="text-text-muted" /> : <ChevronDown size={16} className="text-text-muted" />}
              </div>
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 border-t border-border">
                {msg.subject && (
                  <p className="text-xs text-text-muted mt-3 mb-1 font-medium uppercase tracking-wider">Message</p>
                )}
                <p className="text-sm text-text-light whitespace-pre-wrap mt-2 bg-surface-cream rounded-lg p-3 leading-relaxed">
                  {msg.body}
                </p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
