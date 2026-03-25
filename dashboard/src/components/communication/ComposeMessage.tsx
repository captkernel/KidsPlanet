'use client'

import { useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Class, CommTemplate } from '@/lib/types/database'
import { Search, Send, Users, GraduationCap, User } from 'lucide-react'

type Audience = 'all' | 'class' | 'individual'

interface GuardianOption {
  id: string
  full_name: string
  phone: string | null
}

interface ComposeMessageProps {
  classes: Class[]
  templates: CommTemplate[]
  schoolId: string
  userId: string
  onSent?: () => void
}

export default function ComposeMessage({ classes, templates, schoolId, userId, onSent }: ComposeMessageProps) {
  const supabase = useMemo(() => createClient(), [])

  const [audience, setAudience] = useState<Audience>('all')
  const [selectedClassId, setSelectedClassId] = useState('')
  const [guardianSearch, setGuardianSearch] = useState('')
  const [guardianResults, setGuardianResults] = useState<GuardianOption[]>([])
  const [selectedGuardian, setSelectedGuardian] = useState<GuardianOption | null>(null)
  const [searching, setSearching] = useState(false)

  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)

  const searchGuardians = async (query: string) => {
    setGuardianSearch(query)
    setSelectedGuardian(null)
    if (query.length < 2) {
      setGuardianResults([])
      return
    }
    setSearching(true)
    const { data } = await supabase
      .from('guardians')
      .select('id, full_name, phone')
      .eq('school_id', schoolId)
      .ilike('full_name', `%${query}%`)
      .limit(10)
    setGuardianResults(data ?? [])
    setSearching(false)
  }

  const applyTemplate = (tpl: CommTemplate) => {
    setBody(tpl.body)
    if (!subject) setSubject(tpl.name)
  }

  const canSend = () => {
    if (!body.trim()) return false
    if (audience === 'class' && !selectedClassId) return false
    if (audience === 'individual' && !selectedGuardian) return false
    return true
  }

  const handleSend = async () => {
    if (!canSend()) return
    setSending(true)
    setSuccess(false)

    try {
      // 1. Insert message
      const audienceFilter =
        audience === 'class' ? selectedClassId :
        audience === 'individual' ? selectedGuardian!.id :
        null

      const { data: message, error: msgError } = await supabase
        .from('messages')
        .insert({
          school_id: schoolId,
          sender_id: userId,
          subject: subject.trim() || null,
          body: body.trim(),
          type: 'announcement',
          audience,
          audience_filter: audienceFilter,
        })
        .select('id')
        .single()

      if (msgError || !message) throw msgError

      // 2. Determine recipients
      let guardianIds: string[] = []

      if (audience === 'all') {
        const { data } = await supabase
          .from('guardians')
          .select('id')
          .eq('school_id', schoolId)
        guardianIds = (data ?? []).map((g) => g.id)
      } else if (audience === 'class') {
        const { data } = await supabase
          .from('student_guardians')
          .select('guardian_id, students!inner(class_id)')
          .eq('school_id', schoolId)
          .eq('students.class_id', selectedClassId)
        guardianIds = [...new Set((data ?? []).map((sg: { guardian_id: string }) => sg.guardian_id))]
      } else if (audience === 'individual') {
        guardianIds = [selectedGuardian!.id]
      }

      // 3. Insert message_recipients
      if (guardianIds.length > 0) {
        const recipients = guardianIds.map((gid) => ({
          message_id: message.id,
          school_id: schoolId,
          guardian_id: gid,
        }))
        await supabase.from('message_recipients').insert(recipients)
      }

      // 4. Success feedback and clear form
      setSuccess(true)
      setSubject('')
      setBody('')
      setGuardianSearch('')
      setSelectedGuardian(null)
      setGuardianResults([])
      setSelectedClassId('')
      setAudience('all')
      onSent?.()

      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Failed to send message:', err)
      alert('Failed to send message. Please try again.')
    } finally {
      setSending(false)
    }
  }

  const audienceButtons: { key: Audience; label: string; icon: typeof Users }[] = [
    { key: 'all', label: 'All Parents', icon: Users },
    { key: 'class', label: 'By Class', icon: GraduationCap },
    { key: 'individual', label: 'Individual', icon: User },
  ]

  return (
    <div className="space-y-6">
      {/* Audience selector */}
      <div>
        <label className="label mb-2 block">Send To</label>
        <div className="grid grid-cols-3 gap-3">
          {audienceButtons.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => { setAudience(key); setSuccess(false) }}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-sm font-medium ${
                audience === key
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border bg-white text-text-light hover:border-primary/30'
              }`}
            >
              <Icon size={24} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Class dropdown */}
      {audience === 'class' && (
        <div>
          <label className="label">Select Class</label>
          <select
            className="input mt-1"
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
          >
            <option value="">Choose a class...</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}{c.section ? ` - ${c.section}` : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Guardian search */}
      {audience === 'individual' && (
        <div>
          <label className="label">Find Guardian</label>
          <div className="relative mt-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              className="input pl-9"
              placeholder="Type guardian name..."
              value={guardianSearch}
              onChange={(e) => searchGuardians(e.target.value)}
            />
          </div>
          {searching && <p className="text-xs text-text-muted mt-1">Searching...</p>}
          {guardianResults.length > 0 && !selectedGuardian && (
            <div className="mt-2 border border-border rounded-lg bg-white shadow-sm max-h-48 overflow-y-auto">
              {guardianResults.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => {
                    setSelectedGuardian(g)
                    setGuardianSearch(g.full_name)
                    setGuardianResults([])
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-surface text-sm border-b border-border last:border-b-0"
                >
                  <span className="font-medium text-primary-dark">{g.full_name}</span>
                  {g.phone && <span className="text-text-muted ml-2">{g.phone}</span>}
                </button>
              ))}
            </div>
          )}
          {selectedGuardian && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                {selectedGuardian.full_name}
              </span>
              <button
                type="button"
                onClick={() => { setSelectedGuardian(null); setGuardianSearch('') }}
                className="text-text-muted hover:text-red-500 text-xs"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quick templates */}
      {templates.length > 0 && (
        <div>
          <label className="label mb-2 block">Quick Templates</label>
          <div className="flex flex-wrap gap-2">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => applyTemplate(tpl)}
                className="px-3 py-1.5 text-xs font-medium rounded-full border border-border bg-white text-text-light hover:border-primary hover:text-primary transition-colors"
              >
                {tpl.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Subject */}
      <div>
        <label className="label">Subject (optional)</label>
        <input
          className="input mt-1"
          placeholder="e.g., Holiday Notice"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      {/* Body */}
      <div>
        <label className="label">Message *</label>
        <textarea
          className="input mt-1"
          rows={5}
          placeholder="Write your message here..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      {/* Send */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSend}
          disabled={!canSend() || sending}
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={16} />
          {sending ? 'Sending...' : 'Send Message'}
        </button>

        {success && (
          <span className="text-green-600 font-medium text-sm animate-pulse">
            Message saved!
          </span>
        )}
      </div>
    </div>
  )
}
