'use client'

import { useState, useEffect, useMemo } from 'react'
import PageHeader from '@/components/PageHeader'
import { Modal } from '@/components/shared/Modal'
import { EventForm, type EventFormData } from '@/components/calendar/EventForm'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { formatDate } from '@/lib/utils/formatters'
import type { SchoolEvent } from '@/lib/types/database'
import { Plus, ChevronLeft, ChevronRight, Calendar, Trash2 } from 'lucide-react'

const TYPE_COLORS: Record<string, { dot: string; bg: string; text: string }> = {
  holiday:     { dot: 'bg-red-500',    bg: 'bg-red-50',    text: 'text-red-700' },
  event:       { dot: 'bg-purple-500', bg: 'bg-purple-50', text: 'text-purple-700' },
  pta_meeting: { dot: 'bg-blue-500',   bg: 'bg-blue-50',   text: 'text-blue-700' },
  exam:        { dot: 'bg-amber-500',  bg: 'bg-amber-50',  text: 'text-amber-700' },
  field_trip:  { dot: 'bg-green-500',  bg: 'bg-green-50',  text: 'text-green-700' },
}

const TYPE_LABELS: Record<string, string> = {
  holiday: 'Holiday',
  event: 'Event',
  pta_meeting: 'PTA Meeting',
  exam: 'Exam',
  field_trip: 'Field Trip',
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function CalendarPage() {
  const { school, user, profile } = useAuth()
  const [events, setEvents] = useState<SchoolEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [addDate, setAddDate] = useState('')

  const isAdmin = profile?.primary_role === 'admin'

  const fetchEvents = async () => {
    if (!school?.id) return
    const supabase = createClient()
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('school_id', school.id)
      .order('date')
    if (data) setEvents(data)
  }

  useEffect(() => {
    if (!school?.id) return
    setLoading(true)
    fetchEvents().finally(() => setLoading(false))
  }, [school?.id])

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const days: { date: string; day: number; isCurrentMonth: boolean }[] = []

    // Previous month padding
    const prevMonthDays = new Date(year, month, 0).getDate()
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = prevMonthDays - i
      const prevMonth = month === 0 ? 11 : month - 1
      const prevYear = month === 0 ? year - 1 : year
      days.push({
        date: `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        day: d,
        isCurrentMonth: false,
      })
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({
        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        day: d,
        isCurrentMonth: true,
      })
    }

    // Next month padding to fill last row
    const remaining = 7 - (days.length % 7)
    if (remaining < 7) {
      const nextMonth = month === 11 ? 0 : month + 1
      const nextYear = month === 11 ? year + 1 : year
      for (let d = 1; d <= remaining; d++) {
        days.push({
          date: `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
          day: d,
          isCurrentMonth: false,
        })
      }
    }

    return days
  }, [currentMonth])

  // Events by date
  const eventsByDate = useMemo(() => {
    const map: Record<string, SchoolEvent[]> = {}
    events.forEach((e) => {
      if (!map[e.date]) map[e.date] = []
      map[e.date].push(e)
    })
    return map
  }, [events])

  const today = new Date().toISOString().split('T')[0]

  const monthLabel = currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))

  const selectedEvents = selectedDate ? (eventsByDate[selectedDate] || []) : []

  const upcomingEvents = events.filter((e) => e.date >= today).slice(0, 10)

  const handleAdd = async (data: EventFormData) => {
    if (!school?.id || !user) return
    const supabase = createClient()
    const { error } = await supabase.from('events').insert({
      school_id: school.id,
      title: data.title,
      description: data.description || null,
      date: data.date,
      end_date: data.end_date || null,
      type: data.type,
      audience: data.audience || 'all',
      created_by: user.id,
    })
    if (!error) {
      setShowAdd(false)
      await fetchEvents()
    }
  }

  const handleDelete = async (eventId: string) => {
    if (!school?.id) return
    const supabase = createClient()
    await supabase.from('events').delete().eq('id', eventId)
    await fetchEvents()
    if (selectedDate) {
      // Refresh selected events
    }
  }

  const handleDateClick = (date: string) => {
    setSelectedDate(date === selectedDate ? null : date)
  }

  const handleAddOnDate = (date: string) => {
    setAddDate(date)
    setShowAdd(true)
  }

  return (
    <>
      <PageHeader
        title="School Calendar"
        subtitle={monthLabel}
        actions={
          isAdmin ? (
            <button onClick={() => { setAddDate(''); setShowAdd(true) }} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> Add Event
            </button>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 card">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={prevMonth} className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-surface-muted transition-colors">
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-lg font-bold text-primary-dark">{monthLabel}</h2>
            <button onClick={nextMonth} className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-surface-muted transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-text-muted py-2">{d}</div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((cell) => {
              const dayEvents = eventsByDate[cell.date] || []
              const isToday = cell.date === today
              const isSelected = cell.date === selectedDate

              return (
                <button
                  key={cell.date}
                  onClick={() => handleDateClick(cell.date)}
                  className={`min-h-[60px] sm:min-h-[72px] p-1 rounded-lg text-left transition-colors relative ${
                    !cell.isCurrentMonth ? 'text-text-muted/30' :
                    isSelected ? 'bg-primary/10 ring-2 ring-primary' :
                    isToday ? 'bg-accent/10' :
                    'hover:bg-surface-muted'
                  }`}
                >
                  <span className={`text-xs font-medium ${isToday ? 'bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}`}>
                    {cell.day}
                  </span>
                  {dayEvents.length > 0 && (
                    <div className="flex gap-0.5 mt-1 flex-wrap">
                      {dayEvents.slice(0, 3).map((e) => (
                        <div
                          key={e.id}
                          className={`w-2 h-2 rounded-full ${TYPE_COLORS[e.type]?.dot || 'bg-gray-400'}`}
                          title={e.title}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <span className="text-[9px] text-text-muted">+{dayEvents.length - 3}</span>
                      )}
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-surface-muted">
            {Object.entries(TYPE_COLORS).map(([type, colors]) => (
              <div key={type} className="flex items-center gap-1">
                <div className={`w-2.5 h-2.5 rounded-full ${colors.dot}`} />
                <span className="text-xs text-text-muted">{TYPE_LABELS[type]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Side panel */}
        <div className="space-y-6">
          {/* Selected date events */}
          {selectedDate && (
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-primary-dark text-sm">{formatDate(selectedDate)}</h3>
                {isAdmin && (
                  <button
                    onClick={() => handleAddOnDate(selectedDate)}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <Plus size={12} /> Add
                  </button>
                )}
              </div>
              {selectedEvents.length === 0 ? (
                <p className="text-xs text-text-muted">No events on this date.</p>
              ) : (
                <div className="space-y-2">
                  {selectedEvents.map((e) => {
                    const colors = TYPE_COLORS[e.type] || { bg: 'bg-gray-50', text: 'text-gray-700' }
                    return (
                      <div key={e.id} className={`p-3 rounded-lg ${colors.bg}`}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className={`font-medium text-sm ${colors.text}`}>{e.title}</div>
                            <div className="text-xs text-text-muted capitalize">{TYPE_LABELS[e.type]}</div>
                            {e.description && <div className="text-xs text-text-light mt-1">{e.description}</div>}
                          </div>
                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(e.id)}
                              className="text-text-muted hover:text-danger p-1"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Upcoming events */}
          <div className="card">
            <h3 className="font-bold text-primary-dark mb-3">Upcoming Events</h3>
            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-12 bg-surface-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : upcomingEvents.length === 0 ? (
              <p className="text-sm text-text-muted">No upcoming events.</p>
            ) : (
              <div className="space-y-2">
                {upcomingEvents.map((e) => {
                  const colors = TYPE_COLORS[e.type] || { bg: 'bg-gray-50', text: 'text-gray-700' }
                  return (
                    <div
                      key={e.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-cream cursor-pointer"
                      onClick={() => {
                        // Navigate to the month of this event
                        const eventDate = new Date(e.date)
                        setCurrentMonth(new Date(eventDate.getFullYear(), eventDate.getMonth(), 1))
                        setSelectedDate(e.date)
                      }}
                    >
                      <div className="text-center flex-shrink-0 w-10">
                        <div className="text-sm font-bold text-primary">{new Date(e.date).getDate()}</div>
                        <div className="text-[9px] text-text-muted uppercase">
                          {new Date(e.date).toLocaleString('en', { month: 'short' })}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-primary-dark truncate">{e.title}</div>
                      </div>
                      <span className={`badge text-[10px] ${colors.bg} ${colors.text}`}>
                        {TYPE_LABELS[e.type]}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Event">
        <EventForm
          initialData={addDate ? { title: '', description: '', date: addDate, end_date: '', type: '', audience: 'all' } : undefined}
          onSubmit={handleAdd}
          onCancel={() => setShowAdd(false)}
          submitLabel="Add Event"
        />
      </Modal>
    </>
  )
}
