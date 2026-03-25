'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { StudentForm, type StudentFormData } from '@/components/students/StudentForm'
import { GuardianForm, type GuardianFormData } from '@/components/students/GuardianForm'
import { formatDate } from '@/lib/utils/formatters'
import type { Class } from '@/lib/types/database'
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react'

const STEPS = ['Child Info', 'Guardian Info', 'Review']

export default function AddStudentPage() {
  const router = useRouter()
  const { school } = useAuth()
  const [step, setStep] = useState(0)
  const [classes, setClasses] = useState<Class[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [studentData, setStudentData] = useState<StudentFormData>({
    full_name: '',
    dob: '',
    blood_group: '',
    class_id: '',
    enrollment_date: new Date().toISOString().split('T')[0],
  })

  const [guardianData, setGuardianData] = useState<GuardianFormData>({
    full_name: '',
    phone: '',
    email: '',
    relation: '',
    occupation: '',
    address: '',
    is_primary: true,
  })

  useEffect(() => {
    if (!school?.id) return

    const supabase = createClient()
    supabase
      .from('classes')
      .select('id, name')
      .eq('school_id', school.id)
      .order('name')
      .then(({ data }) => {
        if (data) setClasses(data as Class[])
      })
  }, [school?.id])

  function canProceed(): boolean {
    if (step === 0) return !!studentData.full_name.trim()
    if (step === 1) return !!guardianData.full_name.trim() && !!guardianData.phone.trim()
    return true
  }

  async function handleSave() {
    if (!school?.id) return
    setSaving(true)
    setError('')

    const supabase = createClient()

    // 1. Insert student
    const { data: student, error: sErr } = await supabase
      .from('students')
      .insert({
        school_id: school.id,
        full_name: studentData.full_name.trim(),
        dob: studentData.dob || null,
        blood_group: studentData.blood_group || null,
        class_id: studentData.class_id || null,
        enrollment_date: studentData.enrollment_date || null,
        status: 'active' as const,
      })
      .select()
      .single()

    if (sErr || !student) {
      setError(sErr?.message || 'Failed to create student')
      setSaving(false)
      return
    }

    // 2. Insert guardian
    const { data: guardian, error: gErr } = await supabase
      .from('guardians')
      .insert({
        school_id: school.id,
        full_name: guardianData.full_name.trim(),
        phone: guardianData.phone.trim() || null,
        email: guardianData.email.trim() || null,
        relation: guardianData.relation || null,
        occupation: guardianData.occupation.trim() || null,
        address: guardianData.address.trim() || null,
      })
      .select()
      .single()

    if (gErr || !guardian) {
      setError(gErr?.message || 'Failed to create guardian')
      setSaving(false)
      return
    }

    // 3. Insert junction
    const { error: jErr } = await supabase.from('student_guardians').insert({
      student_id: student.id,
      guardian_id: guardian.id,
      school_id: school.id,
      is_primary: guardianData.is_primary,
    })

    if (jErr) {
      setError(jErr.message)
      setSaving(false)
      return
    }

    // 4. Redirect
    router.push(`/students/${student.id}`)
  }

  const selectedClass = classes.find((c) => c.id === studentData.class_id)

  return (
    <>
      {/* Back link */}
      <Link
        href="/students"
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary mb-4 min-h-[44px]"
      >
        <ArrowLeft size={16} /> Back to Students
      </Link>

      <h1 className="text-2xl font-bold text-primary-dark mb-6">Add Student</h1>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                i < step
                  ? 'bg-green-500 text-white'
                  : i === step
                  ? 'bg-primary text-white'
                  : 'bg-surface-muted text-text-muted'
              }`}
            >
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            <span
              className={`text-sm hidden sm:inline ${
                i === step ? 'font-semibold text-primary-dark' : 'text-text-muted'
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className="w-8 h-px bg-surface-muted" />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="card p-6">
        {step === 0 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Child Information</h2>
            <StudentForm value={studentData} onChange={setStudentData} classes={classes} />
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Guardian Information</h2>
            <GuardianForm value={guardianData} onChange={setGuardianData} />
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-lg font-semibold mb-4">Review</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-2">
                  Child
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <dt className="text-xs text-text-muted">Name</dt>
                    <dd className="font-medium">{studentData.full_name}</dd>
                  </div>
                  {studentData.dob && (
                    <div>
                      <dt className="text-xs text-text-muted">DOB</dt>
                      <dd className="font-medium">{formatDate(studentData.dob)}</dd>
                    </div>
                  )}
                  {studentData.blood_group && (
                    <div>
                      <dt className="text-xs text-text-muted">Blood Group</dt>
                      <dd className="font-medium">{studentData.blood_group}</dd>
                    </div>
                  )}
                  {selectedClass && (
                    <div>
                      <dt className="text-xs text-text-muted">Class</dt>
                      <dd className="font-medium">{selectedClass.name}</dd>
                    </div>
                  )}
                  {studentData.enrollment_date && (
                    <div>
                      <dt className="text-xs text-text-muted">Enrollment Date</dt>
                      <dd className="font-medium">
                        {formatDate(studentData.enrollment_date)}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              <hr className="border-surface-muted" />

              <div>
                <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-2">
                  Guardian
                </h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <dt className="text-xs text-text-muted">Name</dt>
                    <dd className="font-medium">{guardianData.full_name}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-text-muted">Phone</dt>
                    <dd className="font-medium">{guardianData.phone}</dd>
                  </div>
                  {guardianData.email && (
                    <div>
                      <dt className="text-xs text-text-muted">Email</dt>
                      <dd className="font-medium">{guardianData.email}</dd>
                    </div>
                  )}
                  {guardianData.relation && (
                    <div>
                      <dt className="text-xs text-text-muted">Relation</dt>
                      <dd className="font-medium">{guardianData.relation}</dd>
                    </div>
                  )}
                  {guardianData.occupation && (
                    <div>
                      <dt className="text-xs text-text-muted">Occupation</dt>
                      <dd className="font-medium">{guardianData.occupation}</dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-xs text-text-muted">Primary Guardian</dt>
                    <dd className="font-medium">
                      {guardianData.is_primary ? 'Yes' : 'No'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
          </>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-4 border-t border-surface-muted">
          <button
            onClick={() => setStep(step - 1)}
            disabled={step === 0}
            className="btn-secondary flex items-center gap-2 disabled:opacity-40"
          >
            <ArrowLeft size={14} /> Back
          </button>

          {step < 2 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="btn-primary flex items-center gap-2 disabled:opacity-40"
            >
              Next <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Check size={14} /> Save Student
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </>
  )
}
