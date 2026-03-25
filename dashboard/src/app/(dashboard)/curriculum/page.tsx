'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import { Modal } from '@/components/shared/Modal'
import { FormField } from '@/components/shared/FormField'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { formatDate } from '@/lib/utils/formatters'
import type { Class, LessonPlan, PlanActivity, ActivityLibraryItem } from '@/lib/types/database'
import { Plus, ChevronLeft, ChevronRight, BookOpen, Trash2, Library } from 'lucide-react'

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const
const DAY_LABELS: Record<string, string> = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday',
}

const TYPE_COLORS: Record<string, string> = {
  circle_time: 'bg-blue-100 text-blue-700',
  free_play: 'bg-green-100 text-green-700',
  art: 'bg-purple-100 text-purple-700',
  music: 'bg-pink-100 text-pink-700',
  outdoor: 'bg-emerald-100 text-emerald-700',
  story: 'bg-amber-100 text-amber-700',
  sensory: 'bg-cyan-100 text-cyan-700',
}

const TYPE_OPTIONS = [
  { value: 'circle_time', label: 'Circle Time' },
  { value: 'free_play', label: 'Free Play' },
  { value: 'art', label: 'Art & Craft' },
  { value: 'music', label: 'Music' },
  { value: 'outdoor', label: 'Outdoor' },
  { value: 'story', label: 'Story' },
  { value: 'sensory', label: 'Sensory' },
]

function getMonday(d: Date): Date {
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.getFullYear(), d.getMonth(), diff)
}

export default function CurriculumPage() {
  const { school, user } = useAuth()
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedClass, setSelectedClass] = useState('')
  const [weekStart, setWeekStart] = useState(() => {
    const monday = getMonday(new Date())
    return monday.toISOString().split('T')[0]
  })
  const [plan, setPlan] = useState<LessonPlan | null>(null)
  const [activities, setActivities] = useState<PlanActivity[]>([])
  const [libraryItems, setLibraryItems] = useState<ActivityLibraryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState('')

  // Add activity modal
  const [showAddActivity, setShowAddActivity] = useState(false)
  const [addDay, setAddDay] = useState<string>('mon')
  const [addForm, setAddForm] = useState({ activity_name: '', type: '', time_slot: '', description: '', materials_needed: '' })

  useEffect(() => {
    if (!school?.id) return
    const supabase = createClient()
    Promise.all([
      supabase.from('classes').select('id, name').eq('school_id', school.id).order('name'),
      supabase.from('activity_library').select('*').eq('school_id', school.id).order('name'),
    ]).then(([classesRes, libraryRes]) => {
      if (classesRes.data) {
        setClasses(classesRes.data as Class[])
        if (classesRes.data.length > 0 && !selectedClass) setSelectedClass(classesRes.data[0].id)
      }
      if (libraryRes.data) setLibraryItems(libraryRes.data as ActivityLibraryItem[])
      setLoading(false)
    })
  }, [school?.id])

  // Fetch plan when class or week changes
  useEffect(() => {
    if (!school?.id || !selectedClass || !weekStart) return
    const supabase = createClient()

    async function fetchPlan() {
      setLoading(true)
      const { data: planData } = await supabase
        .from('lesson_plans')
        .select('*')
        .eq('school_id', school!.id)
        .eq('class_id', selectedClass)
        .eq('week_start', weekStart)
        .single()

      if (planData) {
        setPlan(planData)
        setTheme(planData.theme || '')
        const { data: actData } = await supabase
          .from('plan_activities')
          .select('*')
          .eq('plan_id', planData.id)
          .order('time_slot')
        if (actData) setActivities(actData)
      } else {
        setPlan(null)
        setActivities([])
        setTheme('')
      }
      setLoading(false)
    }

    fetchPlan()
  }, [school?.id, selectedClass, weekStart])

  const getOrCreatePlan = async (): Promise<string | null> => {
    if (!school?.id || !user || !selectedClass) return null
    if (plan) return plan.id

    const supabase = createClient()
    const { data, error } = await supabase
      .from('lesson_plans')
      .insert({
        school_id: school.id,
        class_id: selectedClass,
        week_start: weekStart,
        theme: theme || null,
        created_by: user.id,
      })
      .select('*')
      .single()

    if (data) {
      setPlan(data)
      return data.id
    }
    return null
  }

  const handleAddActivity = async () => {
    if (!school?.id || !addForm.activity_name) return
    const planId = await getOrCreatePlan()
    if (!planId) return

    const supabase = createClient()
    const { data: newAct } = await supabase
      .from('plan_activities')
      .insert({
        plan_id: planId,
        school_id: school.id,
        day: addDay,
        time_slot: addForm.time_slot || null,
        activity_name: addForm.activity_name,
        type: addForm.type || null,
        description: addForm.description || null,
        materials_needed: addForm.materials_needed || null,
      })
      .select('*')
      .single()

    if (newAct) setActivities((prev) => [...prev, newAct])
    setShowAddActivity(false)
    setAddForm({ activity_name: '', type: '', time_slot: '', description: '', materials_needed: '' })
  }

  const handleDeleteActivity = async (actId: string) => {
    const supabase = createClient()
    await supabase.from('plan_activities').delete().eq('id', actId)
    setActivities((prev) => prev.filter((a) => a.id !== actId))
  }

  const handleSaveTheme = async () => {
    if (!plan) return
    const supabase = createClient()
    await supabase.from('lesson_plans').update({ theme: theme || null }).eq('id', plan.id)
  }

  const addFromLibrary = (item: ActivityLibraryItem, day: string) => {
    setAddDay(day)
    setAddForm({
      activity_name: item.name,
      type: item.type || '',
      time_slot: '',
      description: item.description || '',
      materials_needed: item.materials || '',
    })
    setShowAddActivity(true)
  }

  const prevWeek = () => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() - 7)
    setWeekStart(d.toISOString().split('T')[0])
  }
  const nextWeek = () => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + 7)
    setWeekStart(d.toISOString().split('T')[0])
  }

  const weekEnd = useMemo(() => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + 5)
    return d.toISOString().split('T')[0]
  }, [weekStart])

  const activitiesByDay = useMemo(() => {
    const map: Record<string, PlanActivity[]> = {}
    DAYS.forEach((d) => (map[d] = []))
    activities.forEach((a) => {
      if (map[a.day]) map[a.day].push(a)
    })
    return map
  }, [activities])

  return (
    <>
      <PageHeader
        title="Curriculum"
        subtitle="Weekly lesson plans"
        actions={
          <Link href="/curriculum/library" className="btn-secondary flex items-center gap-2">
            <Library size={16} /> Activity Library
          </Link>
        }
      />

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="input w-auto">
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <button onClick={prevWeek} className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-surface-muted">
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm font-medium text-primary-dark min-w-[180px] text-center">
            {formatDate(weekStart)} — {formatDate(weekEnd)}
          </span>
          <button onClick={nextWeek} className="w-11 h-11 flex items-center justify-center rounded-xl hover:bg-surface-muted">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Theme */}
      <div className="card mb-6">
        <div className="flex items-center gap-3">
          <FormField
            label="Weekly Theme"
            name="theme"
            value={theme}
            onChange={setTheme}
            placeholder="e.g. Animals, Colors, Seasons..."
          />
          <button onClick={handleSaveTheme} className="btn-secondary mt-6 whitespace-nowrap">
            Save Theme
          </button>
        </div>
      </div>

      {/* Weekly Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse h-40" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DAYS.map((day) => (
            <div key={day} className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-sm text-primary-dark">{DAY_LABELS[day]}</h3>
                <button
                  onClick={() => { setAddDay(day); setShowAddActivity(true) }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20"
                >
                  <Plus size={14} />
                </button>
              </div>
              <div className="space-y-2">
                {activitiesByDay[day].length === 0 && (
                  <p className="text-xs text-text-muted py-2">No activities yet. Tap + to add.</p>
                )}
                {activitiesByDay[day].map((act) => (
                  <div
                    key={act.id}
                    className={`p-2 rounded-lg ${act.type ? TYPE_COLORS[act.type] || 'bg-gray-100 text-gray-700' : 'bg-surface-cream'}`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <div className="text-sm font-medium">{act.activity_name}</div>
                        {act.time_slot && <div className="text-[10px] opacity-70">{act.time_slot}</div>}
                        {act.description && <div className="text-xs mt-0.5 opacity-80">{act.description}</div>}
                      </div>
                      <button
                        onClick={() => handleDeleteActivity(act.id)}
                        className="opacity-50 hover:opacity-100 p-0.5"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick-add from library */}
              {libraryItems.length > 0 && (
                <div className="mt-3 pt-3 border-t border-surface-muted">
                  <div className="text-[10px] text-text-muted mb-1 uppercase font-semibold">Quick Add</div>
                  <div className="flex flex-wrap gap-1">
                    {libraryItems.slice(0, 5).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => addFromLibrary(item, day)}
                        className="text-[10px] px-2 py-1 rounded-full bg-surface-muted text-text-light hover:bg-primary/10 hover:text-primary"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Activity Modal */}
      <Modal open={showAddActivity} onClose={() => setShowAddActivity(false)} title={`Add Activity — ${DAY_LABELS[addDay]}`}>
        <div className="space-y-4">
          <FormField label="Activity Name" name="act_name" value={addForm.activity_name} onChange={(v) => setAddForm((p) => ({ ...p, activity_name: v }))} required />
          <FormField
            label="Type"
            name="act_type"
            type="select"
            value={addForm.type}
            onChange={(v) => setAddForm((p) => ({ ...p, type: v }))}
            options={TYPE_OPTIONS}
          />
          <FormField label="Time Slot" name="time_slot" value={addForm.time_slot} onChange={(v) => setAddForm((p) => ({ ...p, time_slot: v }))} placeholder="e.g. 9:00 AM - 9:30 AM" />
          <FormField label="Description" name="act_desc" type="textarea" value={addForm.description} onChange={(v) => setAddForm((p) => ({ ...p, description: v }))} rows={2} />
          <FormField label="Materials Needed" name="act_materials" value={addForm.materials_needed} onChange={(v) => setAddForm((p) => ({ ...p, materials_needed: v }))} />
          <div className="flex gap-3">
            <button onClick={handleAddActivity} className="btn-primary flex-1" disabled={!addForm.activity_name}>
              Add Activity
            </button>
            <button onClick={() => setShowAddActivity(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </div>
      </Modal>
    </>
  )
}
