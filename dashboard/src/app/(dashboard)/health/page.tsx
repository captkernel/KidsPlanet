'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import StatCard from '@/components/StatCard'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { formatDate } from '@/lib/utils/formatters'
import type { Class, Student, Allergy, Immunization } from '@/lib/types/database'
import { HeartPulse, AlertTriangle, Shield, FileWarning, Search } from 'lucide-react'

export default function HealthPage() {
  const { school } = useAuth()
  const [classes, setClasses] = useState<Class[]>([])
  const [selectedClass, setSelectedClass] = useState('all')
  const [students, setStudents] = useState<(Student & { allergies: Allergy[] })[]>([])
  const [immunizations, setImmunizations] = useState<(Immunization & { student: Student })[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'allergies' | 'immunizations'>('allergies')

  useEffect(() => {
    if (!school?.id) return
    const supabase = createClient()

    async function fetchData() {
      setLoading(true)
      const [classesRes, studentsRes, immunRes] = await Promise.all([
        supabase.from('classes').select('id, name').eq('school_id', school!.id).order('name'),
        supabase.from('students').select('*, allergies(*)').eq('school_id', school!.id).eq('status', 'active').order('full_name'),
        supabase.from('immunizations').select('*, student:students(id, full_name, class_id)').eq('school_id', school!.id).order('next_due_date'),
      ])
      if (classesRes.data) setClasses(classesRes.data as Class[])
      if (studentsRes.data) setStudents(studentsRes.data as (Student & { allergies: Allergy[] })[])
      if (immunRes.data) setImmunizations(immunRes.data as (Immunization & { student: Student })[])
      setLoading(false)
    }

    fetchData()
  }, [school?.id])

  const studentsWithAllergies = useMemo(() => {
    return students.filter((s) => s.allergies && s.allergies.length > 0)
      .filter((s) => selectedClass === 'all' || s.class_id === selectedClass)
  }, [students, selectedClass])

  const overdueImmunizations = immunizations.filter(
    (i) => i.next_due_date && new Date(i.next_due_date) < new Date()
  )

  const totalAllergies = students.reduce((acc, s) => acc + (s.allergies?.length || 0), 0)

  return (
    <>
      <PageHeader
        title="Health & Safety"
        subtitle="Allergy alerts and immunization tracking"
        actions={
          <Link href="/health/incidents" className="btn-secondary flex items-center gap-2">
            <FileWarning size={16} /> Incident Log
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Students with Allergies" value={studentsWithAllergies.length} icon={AlertTriangle} color="warning" />
        <StatCard label="Total Allergies" value={totalAllergies} icon={HeartPulse} color="danger" />
        <StatCard label="Immunization Records" value={immunizations.length} icon={Shield} color="success" />
        <StatCard label="Overdue Vaccinations" value={overdueImmunizations.length} icon={FileWarning} color="danger" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('allergies')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'allergies' ? 'bg-primary text-white' : 'bg-surface text-text-light'}`}
        >
          Allergy Alerts
        </button>
        <button
          onClick={() => setTab('immunizations')}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'immunizations' ? 'bg-primary text-white' : 'bg-surface text-text-light'}`}
        >
          Immunization Tracker
        </button>
      </div>

      {tab === 'allergies' && (
        <>
          <div className="mb-4">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="input w-auto"
            >
              <option value="all">All Classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card animate-pulse h-16" />
              ))}
            </div>
          ) : studentsWithAllergies.length === 0 ? (
            <div className="card text-center py-12">
              <HeartPulse size={40} className="mx-auto text-text-muted mb-3" />
              <p className="text-text-muted">No allergy records found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {studentsWithAllergies.map((student) => (
                <Link href={`/students/${student.id}`} key={student.id} className="card !p-4 block hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-sm text-primary-dark">{student.full_name}</div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {student.allergies.map((a) => (
                          <span
                            key={a.id}
                            className={`badge text-xs ${
                              a.severity === 'severe' ? 'bg-red-100 text-red-700' :
                              a.severity === 'moderate' ? 'bg-amber-100 text-amber-700' :
                              'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {a.allergy_type} {a.severity && `(${a.severity})`}
                          </span>
                        ))}
                      </div>
                    </div>
                    <AlertTriangle size={18} className="text-warning flex-shrink-0" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'immunizations' && (
        <>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card animate-pulse h-16" />
              ))}
            </div>
          ) : immunizations.length === 0 ? (
            <div className="card text-center py-12">
              <Shield size={40} className="mx-auto text-text-muted mb-3" />
              <p className="text-text-muted">No immunization records found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {overdueImmunizations.length > 0 && (
                <div className="card border-l-4 border-l-danger !bg-red-50">
                  <h3 className="font-bold text-sm text-danger mb-2">Overdue Vaccinations ({overdueImmunizations.length})</h3>
                  <div className="space-y-2">
                    {overdueImmunizations.map((imm) => (
                      <div key={imm.id} className="flex items-center justify-between text-sm">
                        <div>
                          <span className="font-medium text-primary-dark">{(imm.student as Student).full_name}</span>
                          <span className="text-text-muted"> — {imm.vaccine_name}</span>
                        </div>
                        <span className="text-xs text-danger font-medium">Due: {formatDate(imm.next_due_date!)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="card">
                <h3 className="font-bold text-sm text-primary-dark mb-3">All Records</h3>
                <div className="space-y-2">
                  {immunizations.map((imm) => {
                    const isOverdue = imm.next_due_date && new Date(imm.next_due_date) < new Date()
                    return (
                      <div key={imm.id} className="flex items-center justify-between py-2 border-b border-surface-muted last:border-0">
                        <div>
                          <div className="text-sm font-medium">{(imm.student as Student).full_name}</div>
                          <div className="text-xs text-text-muted">{imm.vaccine_name}</div>
                        </div>
                        <div className="text-right">
                          {imm.date_given && (
                            <div className="text-xs text-text-muted">Given: {formatDate(imm.date_given)}</div>
                          )}
                          {imm.next_due_date && (
                            <div className={`text-xs font-medium ${isOverdue ? 'text-danger' : 'text-text-muted'}`}>
                              Next: {formatDate(imm.next_due_date)}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}
