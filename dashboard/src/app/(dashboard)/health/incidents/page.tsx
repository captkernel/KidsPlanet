'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Modal } from '@/components/shared/Modal'
import { FormField } from '@/components/shared/FormField'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { formatDate } from '@/lib/utils/formatters'
import type { Incident, Student } from '@/lib/types/database'
import { ArrowLeft, Plus, FileWarning, AlertTriangle, Bell } from 'lucide-react'

interface IncidentWithStudent extends Incident {
  student: Student
}

export default function IncidentsPage() {
  const { school, user, profile } = useAuth()
  const [incidents, setIncidents] = useState<IncidentWithStudent[]>([])
  const [students, setStudents] = useState<{ id: string; full_name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({
    student_id: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    action_taken: '',
    severity: '',
  })
  const [saving, setSaving] = useState(false)

  const fetchData = async () => {
    if (!school?.id) return
    const supabase = createClient()
    const [incRes, studRes] = await Promise.all([
      supabase
        .from('incidents')
        .select('*, student:students(id, full_name, class_id)')
        .eq('school_id', school.id)
        .order('date', { ascending: false }),
      supabase
        .from('students')
        .select('id, full_name')
        .eq('school_id', school.id)
        .eq('status', 'active')
        .order('full_name'),
    ])
    if (incRes.data) setIncidents(incRes.data as IncidentWithStudent[])
    if (studRes.data) setStudents(studRes.data)
  }

  useEffect(() => {
    if (!school?.id) return
    setLoading(true)
    fetchData().finally(() => setLoading(false))
  }, [school?.id])

  const handleAdd = async () => {
    if (!school?.id || !user || !form.student_id || !form.description || !form.severity) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('incidents').insert({
      school_id: school.id,
      student_id: form.student_id,
      date: form.date,
      time: new Date().toISOString(),
      description: form.description,
      action_taken: form.action_taken || null,
      severity: form.severity,
      reported_by: user.id,
    })
    setSaving(false)
    setShowAdd(false)
    setForm({ student_id: '', date: new Date().toISOString().split('T')[0], description: '', action_taken: '', severity: '' })
    await fetchData()
  }

  const handleNotifyParent = async (incidentId: string) => {
    if (!school?.id) return
    const supabase = createClient()
    await supabase.from('incidents').update({ parent_notified: true }).eq('id', incidentId)
    setIncidents((prev) => prev.map((i) => i.id === incidentId ? { ...i, parent_notified: true } : i))
  }

  const severityColors: Record<string, string> = {
    minor: 'bg-blue-100 text-blue-700',
    moderate: 'bg-amber-100 text-amber-700',
    serious: 'bg-red-100 text-red-700',
  }

  return (
    <>
      <Link href="/health" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary mb-4">
        <ArrowLeft size={16} /> Back to Health
      </Link>

      <PageHeader
        title="Incident Log"
        subtitle="Record and track safety incidents"
        actions={
          <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Report Incident
          </button>
        }
      />

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card animate-pulse h-20" />
          ))}
        </div>
      )}

      {!loading && incidents.length === 0 && (
        <div className="card text-center py-12">
          <FileWarning size={40} className="mx-auto text-text-muted mb-3" />
          <p className="text-text-muted">No incidents recorded.</p>
        </div>
      )}

      {!loading && incidents.length > 0 && (
        <div className="space-y-3">
          {incidents.map((inc) => (
            <div key={inc.id} className={`card !p-4 ${inc.severity === 'serious' ? 'border-l-4 border-l-danger' : ''}`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    inc.severity === 'serious' ? 'bg-red-100' : inc.severity === 'moderate' ? 'bg-amber-100' : 'bg-blue-100'
                  }`}>
                    <AlertTriangle size={18} className={
                      inc.severity === 'serious' ? 'text-danger' : inc.severity === 'moderate' ? 'text-warning' : 'text-info'
                    } />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-primary-dark">
                      {inc.student?.full_name}
                    </div>
                    <div className="text-xs text-text-muted">{formatDate(inc.date)}</div>
                    <div className="text-sm text-text-light mt-1">{inc.description}</div>
                    {inc.action_taken && (
                      <div className="text-xs text-text-muted mt-1">
                        <span className="font-medium">Action:</span> {inc.action_taken}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`badge text-xs ${severityColors[inc.severity]}`}>
                    {inc.severity}
                  </span>
                  {inc.parent_notified ? (
                    <span className="text-xs text-success flex items-center gap-1">
                      <Bell size={12} /> Notified
                    </span>
                  ) : (
                    <button
                      onClick={() => handleNotifyParent(inc.id)}
                      className="btn-secondary text-xs !py-1 !px-2 flex items-center gap-1"
                    >
                      <Bell size={12} /> Notify Parent
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Incident Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Report Incident" size="lg">
        <div className="space-y-4">
          <FormField
            label="Student"
            name="inc_student"
            type="select"
            value={form.student_id}
            onChange={(v) => setForm((p) => ({ ...p, student_id: v }))}
            options={students.map((s) => ({ value: s.id, label: s.full_name }))}
            required
          />
          <FormField
            label="Date"
            name="inc_date"
            type="date"
            value={form.date}
            onChange={(v) => setForm((p) => ({ ...p, date: v }))}
            required
          />
          <FormField
            label="Severity"
            name="inc_severity"
            type="select"
            value={form.severity}
            onChange={(v) => setForm((p) => ({ ...p, severity: v }))}
            options={[
              { value: 'minor', label: 'Minor' },
              { value: 'moderate', label: 'Moderate' },
              { value: 'serious', label: 'Serious' },
            ]}
            required
          />
          <FormField
            label="Description"
            name="inc_desc"
            type="textarea"
            value={form.description}
            onChange={(v) => setForm((p) => ({ ...p, description: v }))}
            rows={3}
            required
            placeholder="What happened..."
          />
          <FormField
            label="Action Taken"
            name="inc_action"
            type="textarea"
            value={form.action_taken}
            onChange={(v) => setForm((p) => ({ ...p, action_taken: v }))}
            rows={2}
            placeholder="First aid given, parent called, etc."
          />
          <div className="flex gap-3">
            <button onClick={handleAdd} className="btn-primary flex-1" disabled={saving || !form.student_id || !form.description || !form.severity}>
              {saving ? 'Saving...' : 'Report Incident'}
            </button>
            <button onClick={() => setShowAdd(false)} className="btn-secondary flex-1">Cancel</button>
          </div>
        </div>
      </Modal>
    </>
  )
}
