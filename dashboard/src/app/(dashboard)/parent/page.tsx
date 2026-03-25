'use client'

import { useState, useEffect, useMemo } from 'react'
import PageHeader from '@/components/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { formatDate, formatCurrency, todayISO } from '@/lib/utils/formatters'
import type {
  Student, Guardian, Attendance, Invoice, Payment,
  DailyLog, LogEntry, SchoolEvent, Message,
} from '@/lib/types/database'
import {
  Home, ClipboardCheck, IndianRupee, MessageSquare,
  Calendar, Activity, UtensilsCrossed, Moon, Smile, StickyNote,
  ChevronLeft, ChevronRight,
} from 'lucide-react'

type Tab = 'feed' | 'attendance' | 'fees' | 'messages' | 'calendar'

const LOG_ICONS: Record<string, typeof Activity> = {
  meal: UtensilsCrossed,
  nap: Moon,
  activity: Activity,
  mood: Smile,
  note: StickyNote,
}

const LOG_COLORS: Record<string, string> = {
  meal: 'bg-orange-100 text-orange-700',
  nap: 'bg-indigo-100 text-indigo-700',
  activity: 'bg-green-100 text-green-700',
  mood: 'bg-yellow-100 text-yellow-700',
  note: 'bg-blue-100 text-blue-700',
}

export default function ParentPortalPage() {
  const { school, user, profile } = useAuth()
  const [children, setChildren] = useState<Student[]>([])
  const [selectedChild, setSelectedChild] = useState('')
  const [tab, setTab] = useState<Tab>('feed')
  const [loading, setLoading] = useState(true)

  // Feed data
  const [dailyLogs, setDailyLogs] = useState<(DailyLog & { entries: LogEntry[] })[]>([])

  // Attendance data
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [attendanceMonth, setAttendanceMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  // Fee data
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [payments, setPayments] = useState<Payment[]>([])

  // Messages
  const [messages, setMessages] = useState<Message[]>([])

  // Events
  const [events, setEvents] = useState<SchoolEvent[]>([])

  // First, find the guardian record for this user, then find linked children
  useEffect(() => {
    if (!school?.id || !user) return
    const supabase = createClient()

    async function fetchChildren() {
      setLoading(true)
      // Find guardian record for current user
      const { data: guardian } = await supabase
        .from('guardians')
        .select('id')
        .eq('school_id', school!.id)
        .eq('user_id', user!.id)
        .single()

      if (guardian) {
        // Find linked students
        const { data: links } = await supabase
          .from('student_guardians')
          .select('student_id')
          .eq('guardian_id', guardian.id)

        if (links && links.length > 0) {
          const studentIds = links.map((l) => l.student_id)
          const { data: studentsData } = await supabase
            .from('students')
            .select('*')
            .in('id', studentIds)
            .eq('status', 'active')

          if (studentsData && studentsData.length > 0) {
            setChildren(studentsData)
            setSelectedChild(studentsData[0].id)
          }
        }
      }

      // Also fetch events and messages regardless
      const [evtRes, msgRes] = await Promise.all([
        supabase.from('events').select('*').eq('school_id', school!.id).gte('date', todayISO()).order('date').limit(20),
        supabase.from('messages').select('*').eq('school_id', school!.id).order('created_at', { ascending: false }).limit(20),
      ])
      if (evtRes.data) setEvents(evtRes.data)
      if (msgRes.data) setMessages(msgRes.data)

      setLoading(false)
    }

    fetchChildren()
  }, [school?.id, user?.id])

  // Fetch child-specific data when selectedChild or tab changes
  useEffect(() => {
    if (!school?.id || !selectedChild) return
    const supabase = createClient()

    if (tab === 'feed') {
      // Fetch recent daily logs (last 7 days)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      supabase
        .from('daily_logs')
        .select('*, entries:log_entries(*)')
        .eq('student_id', selectedChild)
        .eq('school_id', school.id)
        .gte('date', weekAgo.toISOString().split('T')[0])
        .order('date', { ascending: false })
        .then(({ data }) => {
          if (data) setDailyLogs(data as (DailyLog & { entries: LogEntry[] })[])
        })
    }

    if (tab === 'attendance') {
      const monthStart = `${attendanceMonth.getFullYear()}-${String(attendanceMonth.getMonth() + 1).padStart(2, '0')}-01`
      const monthEnd = new Date(attendanceMonth.getFullYear(), attendanceMonth.getMonth() + 1, 0)
      const monthEndStr = `${monthEnd.getFullYear()}-${String(monthEnd.getMonth() + 1).padStart(2, '0')}-${monthEnd.getDate()}`

      supabase
        .from('attendance')
        .select('*')
        .eq('student_id', selectedChild)
        .eq('school_id', school.id)
        .gte('date', monthStart)
        .lte('date', monthEndStr)
        .order('date')
        .then(({ data }) => {
          if (data) setAttendance(data)
        })
    }

    if (tab === 'fees') {
      Promise.all([
        supabase.from('invoices').select('*').eq('student_id', selectedChild).eq('school_id', school.id).order('due_date', { ascending: false }),
        supabase.from('payments').select('*').eq('school_id', school.id),
      ]).then(([invRes, payRes]) => {
        if (invRes.data) setInvoices(invRes.data)
        if (payRes.data) setPayments(payRes.data)
      })
    }
  }, [school?.id, selectedChild, tab, attendanceMonth])

  const today = todayISO()

  const attendanceDots = useMemo(() => {
    const map: Record<string, string> = {}
    attendance.forEach((a) => {
      map[a.date] = a.status
    })
    return map
  }, [attendance])

  // Build attendance calendar
  const calendarDays = useMemo(() => {
    const year = attendanceMonth.getFullYear()
    const month = attendanceMonth.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return Array.from({ length: daysInMonth }, (_, i) => {
      const d = i + 1
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      return { day: d, date: dateStr, status: attendanceDots[dateStr] || null }
    })
  }, [attendanceMonth, attendanceDots])

  const presentDays = attendance.filter((a) => a.status === 'present' || a.status === 'late').length
  const totalDays = attendance.length
  const attendancePct = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0

  const totalDue = invoices.reduce((s, i) => s + i.total_amount, 0)
  const totalPaid = payments
    .filter((p) => invoices.some((i) => i.id === p.invoice_id))
    .reduce((s, p) => s + p.amount, 0)

  const tabs: { key: Tab; label: string; icon: typeof Home }[] = [
    { key: 'feed', label: 'Feed', icon: Home },
    { key: 'attendance', label: 'Attendance', icon: ClipboardCheck },
    { key: 'fees', label: 'Fees', icon: IndianRupee },
    { key: 'messages', label: 'Messages', icon: MessageSquare },
    { key: 'calendar', label: 'Calendar', icon: Calendar },
  ]

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="card animate-pulse h-32" />
        <div className="card animate-pulse h-48" />
      </div>
    )
  }

  return (
    <>
      <PageHeader title="Parent Portal" subtitle={`Welcome, ${profile?.full_name || 'Parent'}`} />

      {/* Child selector */}
      {children.length > 1 && (
        <div className="mb-4">
          <select
            value={selectedChild}
            onChange={(e) => setSelectedChild(e.target.value)}
            className="input w-auto"
          >
            {children.map((c) => (
              <option key={c.id} value={c.id}>{c.full_name}</option>
            ))}
          </select>
        </div>
      )}

      {children.length === 0 && (
        <div className="card text-center py-16">
          <Home size={48} className="mx-auto text-text-muted mb-4" />
          <h3 className="text-lg font-semibold text-primary-dark mb-2">Welcome to Parent Portal</h3>
          <p className="text-text-muted">Your child&apos;s records will appear here once the school links your account.</p>
        </div>
      )}

      {children.length > 0 && (
        <>
          {/* Tab bar */}
          <div className="flex gap-1 mb-6 overflow-x-auto bg-surface rounded-xl p-1">
            {tabs.map((t) => {
              const Icon = t.icon
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    tab === t.key ? 'bg-primary text-white' : 'text-text-light hover:bg-surface-muted'
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              )
            })}
          </div>

          {/* Feed Tab */}
          {tab === 'feed' && (
            <div className="space-y-4">
              {dailyLogs.length === 0 ? (
                <div className="card text-center py-12">
                  <Activity size={40} className="mx-auto text-text-muted mb-3" />
                  <p className="text-text-muted">No daily activity logs recently.</p>
                </div>
              ) : (
                dailyLogs.map((log) => (
                  <div key={log.id} className="card">
                    <h3 className="font-bold text-sm text-primary-dark mb-3">{formatDate(log.date)}</h3>
                    <div className="space-y-2">
                      {log.entries.map((entry) => {
                        const Icon = LOG_ICONS[entry.type] || StickyNote
                        const color = LOG_COLORS[entry.type] || 'bg-gray-100 text-gray-700'
                        return (
                          <div key={entry.id} className="flex items-start gap-3 p-2 rounded-lg bg-surface-cream">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color} flex-shrink-0`}>
                              <Icon size={14} />
                            </div>
                            <div>
                              <div className="text-sm font-medium capitalize">{entry.type}</div>
                              {entry.value && <div className="text-xs text-text-light">{entry.value}</div>}
                              {entry.notes && <div className="text-xs text-text-muted mt-0.5">{entry.notes}</div>}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Attendance Tab */}
          {tab === 'attendance' && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setAttendanceMonth(new Date(attendanceMonth.getFullYear(), attendanceMonth.getMonth() - 1, 1))} className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-surface-muted">
                  <ChevronLeft size={20} />
                </button>
                <div className="text-center">
                  <h3 className="font-bold text-primary-dark">
                    {attendanceMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                  </h3>
                  <p className="text-xs text-text-muted">{presentDays}/{totalDays} present ({attendancePct}%)</p>
                </div>
                <button onClick={() => setAttendanceMonth(new Date(attendanceMonth.getFullYear(), attendanceMonth.getMonth() + 1, 1))} className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-surface-muted">
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={i} className="text-center text-xs font-semibold text-text-muted">{d}</div>
                ))}
                {/* Padding for first day */}
                {Array.from({ length: new Date(attendanceMonth.getFullYear(), attendanceMonth.getMonth(), 1).getDay() }).map((_, i) => (
                  <div key={`pad-${i}`} />
                ))}
                {calendarDays.map((cd) => (
                  <div
                    key={cd.date}
                    className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-medium ${
                      cd.status === 'present' ? 'bg-green-500 text-white' :
                      cd.status === 'late' ? 'bg-amber-500 text-white' :
                      cd.status === 'absent' ? 'bg-red-500 text-white' :
                      cd.date === today ? 'bg-primary/10 text-primary' :
                      'text-text-muted'
                    }`}
                  >
                    {cd.day}
                  </div>
                ))}
              </div>

              <div className="flex justify-center gap-4 mt-4 pt-4 border-t border-surface-muted">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500" /><span className="text-xs text-text-muted">Present</span></div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-amber-500" /><span className="text-xs text-text-muted">Late</span></div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500" /><span className="text-xs text-text-muted">Absent</span></div>
              </div>
            </div>
          )}

          {/* Fees Tab */}
          {tab === 'fees' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="card text-center">
                  <div className="text-2xl font-bold text-primary">{formatCurrency(totalDue)}</div>
                  <div className="text-xs text-text-muted mt-1">Total Due</div>
                </div>
                <div className="card text-center">
                  <div className="text-2xl font-bold text-success">{formatCurrency(totalPaid)}</div>
                  <div className="text-xs text-text-muted mt-1">Total Paid</div>
                </div>
              </div>

              {invoices.length === 0 ? (
                <div className="card text-center py-12">
                  <IndianRupee size={40} className="mx-auto text-text-muted mb-3" />
                  <p className="text-text-muted">No fee records found.</p>
                </div>
              ) : (
                <div className="card">
                  <h3 className="font-bold text-sm text-primary-dark mb-3">Payment History</h3>
                  <div className="space-y-2">
                    {invoices.map((inv) => (
                      <div key={inv.id} className="flex items-center justify-between py-2 border-b border-surface-muted last:border-0">
                        <div>
                          <div className="text-sm font-medium">Invoice — {formatDate(inv.due_date)}</div>
                          <div className="text-xs text-text-muted">{formatCurrency(inv.total_amount)}</div>
                        </div>
                        <StatusBadge status={inv.status} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Messages Tab */}
          {tab === 'messages' && (
            <div className="space-y-3">
              {messages.length === 0 ? (
                <div className="card text-center py-12">
                  <MessageSquare size={40} className="mx-auto text-text-muted mb-3" />
                  <p className="text-text-muted">No messages from school.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="card !p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        {msg.subject && <div className="font-semibold text-sm text-primary-dark">{msg.subject}</div>}
                        <div className="text-sm text-text-light mt-1">{msg.body}</div>
                        <div className="text-xs text-text-muted mt-2">{formatDate(msg.created_at)}</div>
                      </div>
                      <span className={`badge text-xs ${
                        msg.type === 'announcement' ? 'bg-blue-100 text-blue-700' :
                        msg.type === 'alert' ? 'bg-red-100 text-red-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {msg.type}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Calendar Tab */}
          {tab === 'calendar' && (
            <div className="space-y-3">
              {events.length === 0 ? (
                <div className="card text-center py-12">
                  <Calendar size={40} className="mx-auto text-text-muted mb-3" />
                  <p className="text-text-muted">No upcoming events.</p>
                </div>
              ) : (
                events.map((evt) => {
                  const typeColors: Record<string, string> = {
                    holiday: 'bg-red-50 text-red-700',
                    event: 'bg-purple-50 text-purple-700',
                    pta_meeting: 'bg-blue-50 text-blue-700',
                    exam: 'bg-amber-50 text-amber-700',
                    field_trip: 'bg-green-50 text-green-700',
                  }
                  return (
                    <div key={evt.id} className="card !p-4 flex items-center gap-4">
                      <div className="text-center flex-shrink-0 w-12">
                        <div className="text-lg font-bold text-primary">{new Date(evt.date).getDate()}</div>
                        <div className="text-[10px] text-text-muted uppercase">{new Date(evt.date).toLocaleString('en', { month: 'short' })}</div>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-primary-dark">{evt.title}</div>
                        {evt.description && <div className="text-xs text-text-light mt-0.5">{evt.description}</div>}
                      </div>
                      <span className={`badge text-[10px] ${typeColors[evt.type] || 'bg-gray-100 text-gray-700'}`}>
                        {evt.type.replace('_', ' ')}
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </>
      )}
    </>
  )
}
