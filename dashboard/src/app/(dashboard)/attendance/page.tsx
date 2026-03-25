'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import PageHeader from '@/components/PageHeader'
import AttendanceGrid from '@/components/attendance/AttendanceGrid'
import AttendanceSummary from '@/components/attendance/AttendanceSummary'
import { useAuth } from '@/lib/hooks/useAuth'
import { createClient } from '@/lib/supabase/client'
import { todayISO } from '@/lib/utils/formatters'
import { CheckCheck } from 'lucide-react'

type AttendanceStatus = 'present' | 'absent' | 'late' | null

interface ClassOption {
  id: string
  name: string
}

interface StudentRow {
  id: string
  full_name: string
  photo_url: string | null
}

const STATUS_CYCLE: AttendanceStatus[] = ['present', 'absent', 'late', 'present']

export default function AttendancePage() {
  const { user, school } = useAuth()
  const supabase = useMemo(() => createClient(), [])

  const [date, setDate] = useState(todayISO)
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
  const [students, setStudents] = useState<StudentRow[]>([])
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loadingStudents, setLoadingStudents] = useState(false)

  // Fetch classes on mount
  useEffect(() => {
    if (!school?.id) return
    const fetchClasses = async () => {
      const { data } = await supabase
        .from('classes')
        .select('id, name')
        .eq('school_id', school.id)
        .order('name')
      if (data && data.length > 0) {
        setClasses(data)
        setSelectedClassId(data[0].id)
      }
    }
    fetchClasses()
  }, [school?.id, supabase])

  // Fetch students + attendance when class or date changes
  useEffect(() => {
    if (!selectedClassId || !school?.id) return
    const fetchStudentsAndAttendance = async () => {
      setLoadingStudents(true)
      setSaved(false)

      // Fetch active students for this class
      const { data: studentData } = await supabase
        .from('students')
        .select('id, full_name, photo_url')
        .eq('class_id', selectedClassId)
        .eq('status', 'active')
        .order('full_name')

      const studentList = studentData ?? []
      setStudents(studentList)

      if (studentList.length === 0) {
        setAttendance({})
        setLoadingStudents(false)
        return
      }

      // Fetch existing attendance for this date
      const studentIds = studentList.map((s) => s.id)
      const { data: attendanceData } = await supabase
        .from('attendance')
        .select('student_id, status')
        .eq('date', date)
        .in('student_id', studentIds)

      // Build attendance map, default to null (unmarked)
      const map: Record<string, AttendanceStatus> = {}
      for (const s of studentList) {
        map[s.id] = null
      }
      if (attendanceData) {
        for (const a of attendanceData) {
          map[a.student_id] = a.status as AttendanceStatus
        }
      }
      setAttendance(map)
      setLoadingStudents(false)
    }
    fetchStudentsAndAttendance()
  }, [selectedClassId, date, school?.id, supabase])

  // Toggle status: present → absent → late → present
  const handleToggle = useCallback((studentId: string) => {
    setAttendance((prev) => {
      const current = prev[studentId]
      const idx = STATUS_CYCLE.indexOf(current)
      const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length]
      return { ...prev, [studentId]: next }
    })
    setSaved(false)
  }, [])

  // Mark all present
  const handleMarkAllPresent = useCallback(() => {
    setAttendance((prev) => {
      const updated: Record<string, AttendanceStatus> = {}
      for (const id of Object.keys(prev)) {
        updated[id] = 'present'
      }
      return updated
    })
    setSaved(false)
  }, [])

  // Save attendance
  const handleSave = async () => {
    if (!school?.id || !user?.id) return

    const records = Object.entries(attendance)
      .filter(([, status]) => status !== null)
      .map(([student_id, status]) => ({
        school_id: school.id,
        student_id,
        date,
        status: status as 'present' | 'absent' | 'late',
        marked_by: user.id,
      }))

    if (records.length === 0) return

    setSaving(true)
    const { error } = await supabase
      .from('attendance')
      .upsert(records, { onConflict: 'student_id,date' })

    setSaving(false)
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  const markedCount = Object.values(attendance).filter(Boolean).length
  const selectedClassName = classes.find((c) => c.id === selectedClassId)?.name ?? ''

  return (
    <>
      <PageHeader
        title="Attendance"
        subtitle={`${selectedClassName ? selectedClassName + ' — ' : ''}${date}`}
      />

      {/* Date picker */}
      <div className="mb-4">
        <label className="label" htmlFor="att-date">Date</label>
        <input
          id="att-date"
          type="date"
          className="input max-w-xs"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Class selector */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {classes.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedClassId(c.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors min-h-[44px] ${
              selectedClassId === c.id
                ? 'bg-primary text-white'
                : 'bg-surface text-text-light hover:bg-surface-muted'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Summary bar */}
      {students.length > 0 && (
        <div className="card !p-3 mb-4">
          <AttendanceSummary attendance={attendance} />
        </div>
      )}

      {/* Mark All Present button */}
      {students.length > 0 && (
        <button
          type="button"
          onClick={handleMarkAllPresent}
          className="btn-secondary w-full mb-4 flex items-center justify-center gap-2 min-h-[44px]"
        >
          <CheckCheck size={18} />
          Mark All Present
        </button>
      )}

      {/* Student grid */}
      {loadingStudents ? (
        <div className="card text-center py-12 text-text-muted">Loading students...</div>
      ) : (
        <AttendanceGrid
          students={students}
          attendance={attendance}
          onToggle={handleToggle}
        />
      )}

      {/* Sticky Save button */}
      {students.length > 0 && (
        <div className="sticky bottom-4 mt-6 z-10">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || markedCount === 0}
            className={`w-full min-h-[48px] rounded-xl font-semibold text-white text-base transition-all shadow-lg ${
              saved
                ? 'bg-green-500'
                : 'btn-primary'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {saving
              ? 'Saving...'
              : saved
                ? 'Saved!'
                : `Save Attendance (${markedCount}/${students.length})`}
          </button>
        </div>
      )}
    </>
  )
}
