'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import PageHeader from '@/components/PageHeader'
import ComposeMessage from '@/components/communication/ComposeMessage'
import MessageList from '@/components/communication/MessageList'
import { useAuth } from '@/lib/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import type { Class, CommTemplate, Message } from '@/lib/types/database'
import { Megaphone, PenLine, Mail } from 'lucide-react'

type Tab = 'compose' | 'sent'

type MessageWithCount = Message & { message_recipients: { count: number }[] }

export default function CommunicationPage() {
  const { user, school } = useAuth()
  const supabase = useMemo(() => createClient(), [])

  const [tab, setTab] = useState<Tab>('compose')
  const [classes, setClasses] = useState<Class[]>([])
  const [templates, setTemplates] = useState<CommTemplate[]>([])
  const [messages, setMessages] = useState<MessageWithCount[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)

  // Fetch classes and templates on mount
  useEffect(() => {
    if (!school?.id) return

    const fetchData = async () => {
      const [classRes, templateRes] = await Promise.all([
        supabase
          .from('classes')
          .select('*')
          .eq('school_id', school.id)
          .order('name'),
        supabase
          .from('comm_templates')
          .select('*')
          .eq('school_id', school.id)
          .order('name'),
      ])
      setClasses(classRes.data ?? [])
      setTemplates(templateRes.data ?? [])
    }

    fetchData()
  }, [school?.id, supabase])

  // Fetch sent messages
  const fetchMessages = useCallback(async () => {
    if (!school?.id) return
    setLoadingMessages(true)
    const { data } = await supabase
      .from('messages')
      .select('*, message_recipients(count)')
      .eq('school_id', school.id)
      .order('created_at', { ascending: false })
    setMessages((data as MessageWithCount[]) ?? [])
    setLoadingMessages(false)
  }, [school?.id, supabase])

  // Fetch messages when switching to sent tab or on mount
  useEffect(() => {
    if (tab === 'sent') fetchMessages()
  }, [tab, fetchMessages])

  const tabs: { key: Tab; label: string; icon: typeof PenLine }[] = [
    { key: 'compose', label: 'Compose', icon: PenLine },
    { key: 'sent', label: 'Sent Messages', icon: Mail },
  ]

  return (
    <>
      <PageHeader
        title="Communication"
        subtitle="Send announcements and messages to parents"
        actions={
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Megaphone size={16} />
            <span>{messages.length} message{messages.length !== 1 ? 's' : ''} sent</span>
          </div>
        }
      />

      {/* Tab switcher */}
      <div className="flex gap-2 mb-6">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
              tab === key
                ? 'bg-primary text-white'
                : 'bg-surface text-text-light hover:bg-surface-cream'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'compose' && school && user && (
        <div className="card">
          <ComposeMessage
            classes={classes}
            templates={templates}
            schoolId={school.id}
            userId={user.id}
            onSent={() => fetchMessages()}
          />
        </div>
      )}

      {tab === 'sent' && (
        <>
          {loadingMessages ? (
            <div className="card text-center py-12">
              <p className="text-text-muted">Loading messages...</p>
            </div>
          ) : (
            <MessageList messages={messages} />
          )}
        </>
      )}
    </>
  )
}
