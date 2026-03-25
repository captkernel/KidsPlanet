'use client'

import { useState, useEffect, useMemo } from 'react'
import PageHeader from '@/components/PageHeader'
import { Modal } from '@/components/shared/Modal'
import { FormField } from '@/components/shared/FormField'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { todayISO, formatTime } from '@/lib/utils/formatters'
import type { Class, Student, DailyLog, LogEntry } from '@/lib/types/database'
import {
  UtensilsCrossed, Moon, Activity, Smile, StickyNote,
  ChevronRight, Check, Users, Plus,
} from 'lucide-react'

const LOG_TYPES = [
  { type: 'meal', label: 'Meal', icon: UtensilsCrossed, color: 'bg-orange-100 text-orange-700', options: ['Breakfast - Full', 'Breakfast - Half', 'Lunch - Full', 'Lunch - Half', 'Snack - Full', 'Snack - Half'] },
  { type: 'nap', label: 'Nap', icon: Moon, color: 'bg-indigo-100 text-indigo-700', options: ['Slept well', 'Short nap', 'Did not sleep', 'Fussy'] },
  { type: 'activity', label: 'Activity', icon: Activity, color: 'bg-green-100 text-green-700', options: ['Art & Craft', 'Music', 'Outdoor Play', 'Story Time', 'Circle Time', 'Free Play', 'Sensory Play'] },
  { type: 'mood', label: 'Mood', icon: Smile, color: 'bg-yellow-100 text-yellow-700', options: ['Happy', 'Calm', 'Excited', 'Tired', 'Cranky', 'Sad'] },
  { type: 'note', label: 'Note', icon: StickyNote, color: 'bg-blue-100 text-blue-700', options: [] },
] as const

interface StudentLog {
  student: Student
  log: DailyLog | null
  entries: LogEntry[]
}

export default function DailyActivitiesPage() {
  const { school, user } = useAuth()
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [students, setStudents] = useState<Student[]>([])
  const [logs, setLogs] = useState<Record<string, { log: DailyLog; entries: LogEntry[] }>>({})
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState(todayISO())

  // Quick log modal state
  const [activeStudent, setActiveStudent] = useState<Student | null>(null)
  const [activeLogType, setActiveLogType] = useState<string | null>(null)
  const [logValue, setLogValue] = useState('')
  const [logNotes, setLogNotes] = useState('')
  const [saving, setSaving] = useState(false)

  // Batch mode
  const [batchMode, setBatchMode] = useState(false)
  const [batchType, setBatchType] = useState('')
  const [batchValue, setBatchValue] = useState('')
  const [batchSaving, setBatchSaving] = useState(false)

  useEffect(() => {
    if (!school?.id) return
    const supabase = createClient()
    supabase
      .from('classes')
      .select('id, name')
      .eq('school_id', school.id)
      .order('name')
      .then(({ data }) => {
        if (data) {
          setClasses(data as Class[])
          if (data.length > 0 && !selectedClass) setSelectedClass(data[0].id)
        }
        setLoading(false)
      })
  }, [school?.id])

  // Fetch students and logs when class or date changes
  useEffect(() => {
    if (!school?.id || !selectedClass) return
    const supabase = createClient()

    async function fetchData() {
      setLoading(true)
      const [studentsRes, logsRes] = await Promise.all([
        supabase
          .from('students')
          .select('*')
          .eq('school_id', school!.id)
          .eq('class_id', selectedClass)
          .eq('status', 'active')
          .order('full_name'),
        supabase
          .from('daily_logs')
          .select('*, entries:log_entries(*)')
          .eq('school_id', school!.id)
          .eq('date', date),
      ])

      if (studentsRes.data) setStudents(studentsRes.data)

      if (logsRes.data) {
        const logMap: Record<string, { log: DailyLog; entries: LogEntry[] }> = {}
        for (const log of logsRes.data as (DailyLog & { entries: LogEntry[] })[]) {
          logMap[log.student_id] = { log, entries: log.entries || [] }
        }
        setLogs(logMap)
      }
      setLoading(false)
    }

    fetchData()
  }, [school?.id, selectedClass, date])

  const getOrCreateLog = async (studentId: string): Promise<string | null> => {
    if (!school?.id || !user) return null
    const supabase = createClient()

    const existing = logs[studentId]
    if (existing) return existing.log.id

    const { data, error } = await supabase
      .from('daily_logs')
      .insert({ school_id: school.id, student_id: studentId, date, logged_by: user.id })
      .select('id')
      .single()

    if (error) {
      // Might be unique constraint conflict — fetch existing
      const { data: existingLog } = await supabase
        .from('daily_logs')
        .select('id')
        .eq('student_id', studentId)
        .eq('date', date)
        .single()
      return existingLog?.id || null
    }

    return data?.id || null
  }

  const handleQuickLog = async () => {
    if (!activeStudent || !activeLogType || !school?.id) return
    setSaving(true)

    const logId = await getOrCreateLog(activeStudent.id)
    if (!logId) { setSaving(false); return }

    const supabase = createClient()
    await supabase.from('log_entries').insert({
      log_id: logId,
      school_id: school.id,
      type: activeLogType,
      value: logValue || null,
      notes: logNotes || null,
      time: new Date().toISOString(),
    })

    // Refresh logs
    const { data: refreshedLog } = await supabase
      .from('daily_logs')
      .select('*, entries:log_entries(*)')
      .eq('id', logId)
      .single()

    if (refreshedLog) {
      setLogs((prev) => ({
        ...prev,
        [activeStudent.id]: { log: refreshedLog, entries: (refreshedLog as DailyLog & { entries: LogEntry[] }).entries || [] },
      }))
    }

    setSaving(false)
    setActiveStudent(null)
    setActiveLogType(null)
    setLogValue('')
    setLogNotes('')
  }

  const handleBatchLog = async () => {
    if (!batchType || !batchValue || !school?.id || !user) return
    setBatchSaving(true)

    const supabase = createClient()

    for (const student of students) {
      const logId = await getOrCreateLog(student.id)
      if (!logId) continue

      await supabase.from('log_entries').insert({
        log_id: logId,
        school_id: school.id,
        type: batchType,
        value: batchValue,
        time: new Date().toISOString(),
      })
    }

    // Refresh all logs
    const { data: refreshedLogs } = await supabase
      .from('daily_logs')
      .select('*, entries:log_entries(*)')
      .eq('school_id', school.id)
      .eq('date', date)

    if (refreshedLogs) {
      const logMap: Record<string, { log: DailyLog; entries: LogEntry[] }> = {}
      for (const log of refreshedLogs as (DailyLog & { entries: LogEntry[] })[]) {
        logMap[log.student_id] = { log, entries: log.entries || [] }
      }
      setLogs(logMap)
    }

    setBatchSaving(false)
    setBatchMode(false)
    setBatchType('')
    setBatchValue('')
  }

  const getEntryCountByType = (studentId: string) => {
    const studentLog = logs[studentId]
    if (!studentLog) return {}
    const counts: Record<string, number> = {}
    studentLog.entries.forEach((e) => {
      counts[e.type] = (counts[e.type] || 0) + 1
    })
    return counts
  }

  return (
    <>
      <PageHeader
        title="Daily Activities"
        subtitle="Log daily activities for each student"
        actions={
          <button onClick={() => setBatchMode(true)} className="btn-secondary flex items-center gap-2">
            <Users size={16} /> Batch Log
          </button>
        }
      />

      {/* Class and date selector */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="input w-auto"
        >
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input w-auto"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse h-20" />
          ))}
        </div>
      )}

      {/* Student list */}
      {!loading && students.length === 0 && (
        <div className="card text-center py-12">
          <Users size={40} className="mx-auto text-text-muted mb-3" />
          <p className="text-text-muted">No students in this class.</p>
        </div>
      )}

      {!loading && students.length > 0 && (
        <div className="space-y-3">
          {students.map((student) => {
            const counts = getEntryCountByType(student.id)
            const hasLogs = Object.keys(counts).length > 0
            const initials = student.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

            return (
              <div key={student.id} className="card !p-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {student.photo_url ? (
                      <img src={student.photo_url} alt={student.full_name} className="w-11 h-11 rounded-full object-cover" />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-primary-dark">{student.full_name}</div>
                    {hasLogs && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {LOG_TYPES.map(({ type, label, color }) => {
                          const count = counts[type]
                          if (!count) return null
                          return (
                            <span key={type} className={`badge text-[10px] ${color}`}>
                              {label} ({count})
                            </span>
                          )
                        })}
                      </div>
                    )}
                  </div>
                  {/* Quick log buttons */}
                  <div className="flex gap-1 flex-shrink-0">
                    {LOG_TYPES.map(({ type, icon: Icon, color }) => (
                      <button
                        key={type}
                        onClick={() => {
                          setActiveStudent(student)
                          setActiveLogType(type)
                        }}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg ${color} hover:opacity-80 transition-opacity`}
                        title={type}
                      >
                        <Icon size={16} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Quick Log Modal */}
      <Modal
        open={!!activeStudent && !!activeLogType}
        onClose={() => { setActiveStudent(null); setActiveLogType(null); setLogValue(''); setLogNotes('') }}
        title={`Log ${LOG_TYPES.find((t) => t.type === activeLogType)?.label || ''} — ${activeStudent?.full_name || ''}`}
      >
        <div className="space-y-4">
          {/* Quick options */}
          {activeLogType && LOG_TYPES.find((t) => t.type === activeLogType)?.options.length! > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {LOG_TYPES.find((t) => t.type === activeLogType)?.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setLogValue(opt)}
                  className={`p-3 rounded-lg text-sm font-medium text-left transition-colors ${
                    logValue === opt ? 'bg-primary text-white' : 'bg-surface-cream text-text-light hover:bg-surface-muted'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          <FormField label="Notes (optional)" name="log_notes" type="textarea" value={logNotes} onChange={setLogNotes} rows={2} placeholder="Any additional notes..." />

          <div className="flex gap-3">
            <button onClick={handleQuickLog} className="btn-primary flex-1" disabled={saving || (!logValue && activeLogType !== 'note')}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => { setActiveStudent(null); setActiveLogType(null); setLogValue(''); setLogNotes('') }}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      {/* Batch Log Modal */}
      <Modal open={batchMode} onClose={() => setBatchMode(false)} title="Batch Log for Entire Class">
        <div className="space-y-4">
          <p className="text-sm text-text-muted">
            Log the same activity for all {students.length} students in this class.
          </p>

          <FormField
            label="Activity Type"
            name="batch_type"
            type="select"
            value={batchType}
            onChange={setBatchType}
            options={LOG_TYPES.map((t) => ({ value: t.type, label: t.label }))}
            required
          />

          {batchType && LOG_TYPES.find((t) => t.type === batchType)?.options.length! > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {LOG_TYPES.find((t) => t.type === batchType)?.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setBatchValue(opt)}
                  className={`p-3 rounded-lg text-sm font-medium text-left transition-colors ${
                    batchValue === opt ? 'bg-primary text-white' : 'bg-surface-cream text-text-light hover:bg-surface-muted'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={handleBatchLog} className="btn-primary flex-1" disabled={batchSaving || !batchType || !batchValue}>
              {batchSaving ? `Logging for ${students.length} students...` : `Log for All ${students.length} Students`}
            </button>
            <button onClick={() => setBatchMode(false)} className="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
