'use client'

import { useState, useEffect, useMemo } from 'react'
import PageHeader from '@/components/PageHeader'
import { Modal } from '@/components/shared/Modal'
import { FormField } from '@/components/shared/FormField'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { formatDate, todayISO } from '@/lib/utils/formatters'
import type { MealPlan, MealTracking, Class, Student, Allergy } from '@/lib/types/database'
import {
  UtensilsCrossed, Plus, ChevronLeft, ChevronRight,
  AlertTriangle, Check, X, Minus, Printer, Users,
} from 'lucide-react'

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Breakfast', color: 'bg-orange-100 text-orange-700' },
  { value: 'lunch', label: 'Lunch', color: 'bg-green-100 text-green-700' },
  { value: 'snack', label: 'Snack', color: 'bg-purple-100 text-purple-700' },
]

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getWeekDates(dateStr: string): string[] {
  const date = new Date(dateStr)
  const day = date.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  const monday = new Date(date)
  monday.setDate(date.getDate() + mondayOffset)

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d.toISOString().split('T')[0]
  })
}

export default function MealsPage() {
  const { school, profile } = useAuth()
  const [tab, setTab] = useState<'planner' | 'tracking'>('planner')
  const [currentDate, setCurrentDate] = useState(todayISO())
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [loading, setLoading] = useState(true)

  // Planner state
  const [showAddMeal, setShowAddMeal] = useState(false)
  const [mealForm, setMealForm] = useState({ date: '', meal_type: '', menu_items: '', notes: '' })

  // Tracking state
  const [selectedClass, setSelectedClass] = useState('')
  const [classes, setClasses] = useState<Class[]>([])
  const [students, setStudents] = useState<(Student & { allergies: Allergy[] })[]>([])
  const [tracking, setTracking] = useState<MealTracking[]>([])
  const [trackingMealType, setTrackingMealType] = useState('lunch')

  const isAdmin = profile?.primary_role === 'admin'

  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate])
  const weekLabel = `${formatDate(weekDates[0])} — ${formatDate(weekDates[6])}`

  const fetchMealPlans = async () => {
    if (!school?.id) return
    const supabase = createClient()
    const { data } = await supabase
      .from('meal_plans')
      .select('*')
      .eq('school_id', school.id)
      .gte('date', weekDates[0])
      .lte('date', weekDates[6])
      .order('date')
    if (data) setMealPlans(data)
  }

  useEffect(() => {
    if (!school?.id) return
    setLoading(true)
    const supabase = createClient()
    supabase.from('classes').select('id, name').eq('school_id', school.id).order('name').then(({ data }) => {
      if (data) {
        setClasses(data as Class[])
        if (data.length > 0 && !selectedClass) setSelectedClass(data[0].id)
      }
    })
    fetchMealPlans().finally(() => setLoading(false))
  }, [school?.id])

  useEffect(() => {
    fetchMealPlans()
  }, [currentDate])

  // Fetch tracking data when class or date changes
  useEffect(() => {
    if (!school?.id || !selectedClass || tab !== 'tracking') return
    const supabase = createClient()

    Promise.all([
      supabase
        .from('students')
        .select('*, allergies(*)')
        .eq('school_id', school.id)
        .eq('class_id', selectedClass)
        .eq('status', 'active')
        .order('full_name'),
      supabase
        .from('meal_tracking')
        .select('*')
        .eq('school_id', school.id)
        .eq('date', currentDate)
        .eq('meal_type', trackingMealType),
    ]).then(([studRes, trackRes]) => {
      if (studRes.data) setStudents(studRes.data as (Student & { allergies: Allergy[] })[])
      if (trackRes.data) setTracking(trackRes.data)
    })
  }, [school?.id, selectedClass, currentDate, trackingMealType, tab])

  const mealPlansByDateAndType = useMemo(() => {
    const map: Record<string, Record<string, MealPlan>> = {}
    mealPlans.forEach((mp) => {
      if (!map[mp.date]) map[mp.date] = {}
      map[mp.date][mp.meal_type] = mp
    })
    return map
  }, [mealPlans])

  const handleAddMealPlan = async () => {
    if (!school?.id || !mealForm.date || !mealForm.meal_type || !mealForm.menu_items) return
    const supabase = createClient()
    await supabase.from('meal_plans').insert({
      school_id: school.id,
      date: mealForm.date,
      meal_type: mealForm.meal_type,
      menu_items: mealForm.menu_items,
      notes: mealForm.notes || null,
    })
    setShowAddMeal(false)
    setMealForm({ date: '', meal_type: '', menu_items: '', notes: '' })
    await fetchMealPlans()
  }

  const handleTrack = async (studentId: string, status: 'eaten' | 'skipped') => {
    if (!school?.id) return
    const supabase = createClient()
    const existing = tracking.find((t) => t.student_id === studentId)
    if (existing) {
      await supabase.from('meal_tracking').update({ status }).eq('id', existing.id)
      setTracking((prev) => prev.map((t) => t.id === existing.id ? { ...t, status } : t))
    } else {
      const { data } = await supabase
        .from('meal_tracking')
        .insert({
          school_id: school.id,
          student_id: studentId,
          date: currentDate,
          meal_type: trackingMealType,
          status,
        })
        .select('*')
        .single()
      if (data) setTracking((prev) => [...prev, data])
    }
  }

  const handleMarkAll = async (status: 'eaten' | 'skipped') => {
    for (const student of students) {
      await handleTrack(student.id, status)
    }
  }

  const prevWeek = () => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() - 7)
    setCurrentDate(d.toISOString().split('T')[0])
  }
  const nextWeek = () => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() + 7)
    setCurrentDate(d.toISOString().split('T')[0])
  }

  const getStudentStatus = (studentId: string) => {
    return tracking.find((t) => t.student_id === studentId)?.status || null
  }

  // Check for allergy warnings in today's menu
  const todayMenu = mealPlansByDateAndType[currentDate]
  const allergyWarnings = useMemo(() => {
    if (!todayMenu) return []
    const menuText = Object.values(todayMenu).map((m) => m.menu_items.toLowerCase()).join(' ')
    return students.filter((s) =>
      s.allergies?.some((a) => menuText.includes(a.allergy_type.toLowerCase()))
    )
  }, [todayMenu, students])

  return (
    <>
      <PageHeader
        title="Meals"
        subtitle="Menu planning and meal tracking"
        actions={
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="btn-secondary flex items-center gap-2">
              <Printer size={16} /> Print Menu
            </button>
            {isAdmin && (
              <button onClick={() => setShowAddMeal(true)} className="btn-primary flex items-center gap-2">
                <Plus size={16} /> Add Meal
              </button>
            )}
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab('planner')} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'planner' ? 'bg-primary text-white' : 'bg-surface text-text-light'}`}>
          Weekly Menu
        </button>
        <button onClick={() => setTab('tracking')} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'tracking' ? 'bg-primary text-white' : 'bg-surface text-text-light'}`}>
          Class Tracking
        </button>
      </div>

      {/* Week navigation */}
      <div className="flex items-center gap-2 mb-6">
        <button onClick={prevWeek} className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-surface-muted">
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm font-medium text-primary-dark">{weekLabel}</span>
        <button onClick={nextWeek} className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-surface-muted">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Planner Tab */}
      {tab === 'planner' && (
        <div className="print-section">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card animate-pulse h-24" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-semibold text-text-muted p-2 w-24">Meal</th>
                    {weekDates.map((date, i) => (
                      <th key={date} className={`text-center text-xs font-semibold p-2 ${date === todayISO() ? 'text-primary' : 'text-text-muted'}`}>
                        {DAYS_OF_WEEK[new Date(date).getDay()]}<br />
                        <span className="text-[10px]">{new Date(date).getDate()}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MEAL_TYPES.map((mt) => (
                    <tr key={mt.value}>
                      <td className="p-2">
                        <span className={`badge text-xs ${mt.color}`}>{mt.label}</span>
                      </td>
                      {weekDates.map((date) => {
                        const plan = mealPlansByDateAndType[date]?.[mt.value]
                        return (
                          <td key={date} className={`p-2 text-center ${date === todayISO() ? 'bg-primary/5' : ''}`}>
                            {plan ? (
                              <div className="text-xs text-text-light">{plan.menu_items}</div>
                            ) : (
                              isAdmin ? (
                                <button
                                  onClick={() => {
                                    setMealForm({ date, meal_type: mt.value, menu_items: '', notes: '' })
                                    setShowAddMeal(true)
                                  }}
                                  className="text-xs text-text-muted hover:text-primary"
                                >
                                  + Add
                                </button>
                              ) : (
                                <span className="text-xs text-text-muted">—</span>
                              )
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tracking Tab */}
      {tab === 'tracking' && (
        <>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="input w-auto">
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input type="date" value={currentDate} onChange={(e) => setCurrentDate(e.target.value)} className="input w-auto" />
            <select value={trackingMealType} onChange={(e) => setTrackingMealType(e.target.value)} className="input w-auto">
              {MEAL_TYPES.map((mt) => <option key={mt.value} value={mt.value}>{mt.label}</option>)}
            </select>
          </div>

          {/* Allergy warnings */}
          {allergyWarnings.length > 0 && (
            <div className="card border-l-4 border-l-danger !bg-red-50 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={16} className="text-danger" />
                <h3 className="font-bold text-sm text-danger">Allergy Warnings</h3>
              </div>
              <div className="space-y-1">
                {allergyWarnings.map((s) => (
                  <div key={s.id} className="text-xs text-danger">
                    {s.full_name}: {s.allergies.map((a) => a.allergy_type).join(', ')}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mark all buttons */}
          <div className="flex gap-2 mb-4">
            <button onClick={() => handleMarkAll('eaten')} className="btn-secondary text-xs flex items-center gap-1">
              <Check size={14} /> Mark All Eaten
            </button>
            <span className="text-xs text-text-muted self-center">
              {tracking.filter((t) => t.status === 'eaten').length}/{students.length} tracked
            </span>
          </div>

          {/* Student list */}
          <div className="space-y-2">
            {students.map((student) => {
              const status = getStudentStatus(student.id)
              const hasAllergy = student.allergies?.length > 0
              return (
                <div key={student.id} className={`card !p-3 flex items-center justify-between gap-3 ${hasAllergy ? 'border-l-3 border-l-warning' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {student.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-primary-dark">{student.full_name}</div>
                      {hasAllergy && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <AlertTriangle size={10} className="text-warning" />
                          <span className="text-[10px] text-warning">{student.allergies.map((a) => a.allergy_type).join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleTrack(student.id, 'eaten')}
                      className={`w-11 h-11 flex items-center justify-center rounded-xl transition-colors ${
                        status === 'eaten' ? 'bg-green-500 text-white' : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={() => handleTrack(student.id, 'skipped')}
                      className={`w-11 h-11 flex items-center justify-center rounded-xl transition-colors ${
                        status === 'skipped' ? 'bg-red-500 text-white' : 'bg-red-50 text-red-600 hover:bg-red-100'
                      }`}
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Add Meal Plan Modal */}
      <Modal open={showAddMeal} onClose={() => setShowAddMeal(false)} title="Add Meal to Menu">
        <div className="space-y-4">
          <FormField label="Date" name="meal_date" type="date" value={mealForm.date} onChange={(v) => setMealForm((p) => ({ ...p, date: v }))} required />
          <FormField label="Meal Type" name="meal_type" type="select" value={mealForm.meal_type} onChange={(v) => setMealForm((p) => ({ ...p, meal_type: v }))} options={MEAL_TYPES.map((m) => ({ value: m.value, label: m.label }))} required />
          <FormField label="Menu Items" name="menu_items" type="textarea" value={mealForm.menu_items} onChange={(v) => setMealForm((p) => ({ ...p, menu_items: v }))} rows={2} required placeholder="e.g. Dal, Rice, Roti, Sabzi" />
          <FormField label="Notes" name="meal_notes" type="textarea" value={mealForm.notes} onChange={(v) => setMealForm((p) => ({ ...p, notes: v }))} rows={2} />
          <div className="flex gap-3">
            <button onClick={handleAddMealPlan} className="btn-primary flex-1" disabled={!mealForm.date || !mealForm.meal_type || !mealForm.menu_items}>
              Add Meal
            </button>
            <button onClick={() => setShowAddMeal(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </div>
      </Modal>
    </>
  )
}
