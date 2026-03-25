'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { formatDate, formatPhone, getInitials } from '@/lib/utils/formatters'
import { Modal } from '@/components/shared/Modal'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { FormField } from '@/components/shared/FormField'
import { GuardianForm, type GuardianFormData } from '@/components/students/GuardianForm'
import PageHeader from '@/components/PageHeader'
import type { StudentWithClass, Guardian, Allergy, Class } from '@/lib/types/database'
import { ArrowLeft, Phone, Mail, Edit2, Plus, Save, X } from 'lucide-react'

type Tab = 'info' | 'family' | 'documents' | 'health'

interface StudentGuardianRow {
  guardian_id: string
  is_primary: boolean
  guardian: Guardian
}

export default function StudentProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { school } = useAuth()
  const [student, setStudent] = useState<StudentWithClass | null>(null)
  const [guardians, setGuardians] = useState<(Guardian & { is_primary: boolean })[]>([])
  const [allergies, setAllergies] = useState<Allergy[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('info')
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({
    full_name: '',
    dob: '',
    blood_group: '',
    class_id: '',
    enrollment_date: '',
  })
  const [saving, setSaving] = useState(false)

  // Guardian modal
  const [guardianModalOpen, setGuardianModalOpen] = useState(false)
  const [guardianForm, setGuardianForm] = useState<GuardianFormData>({
    full_name: '',
    phone: '',
    email: '',
    relation: '',
    occupation: '',
    address: '',
    is_primary: false,
  })

  // Allergy modal
  const [allergyModalOpen, setAllergyModalOpen] = useState(false)
  const [allergyForm, setAllergyForm] = useState({
    allergy_type: '',
    severity: '',
    notes: '',
  })

  useEffect(() => {
    if (!school?.id) return

    const supabase = createClient()

    async function fetchData() {
      setLoading(true)

      const [studentRes, guardiansRes, allergiesRes, classesRes] = await Promise.all([
        supabase
          .from('students')
          .select('*, class:classes(id, name)')
          .eq('id', id)
          .single(),
        supabase
          .from('student_guardians')
          .select('*, guardian:guardians(*)')
          .eq('student_id', id),
        supabase.from('allergies').select('*').eq('student_id', id),
        supabase
          .from('classes')
          .select('id, name')
          .eq('school_id', school!.id)
          .order('name'),
      ])

      if (studentRes.data) {
        const s = studentRes.data as StudentWithClass
        setStudent(s)
        setEditData({
          full_name: s.full_name,
          dob: s.dob || '',
          blood_group: s.blood_group || '',
          class_id: s.class_id || '',
          enrollment_date: s.enrollment_date || '',
        })
      }

      if (guardiansRes.data) {
        setGuardians(
          (guardiansRes.data as StudentGuardianRow[]).map((sg) => ({
            ...sg.guardian,
            is_primary: sg.is_primary,
          }))
        )
      }

      if (allergiesRes.data) setAllergies(allergiesRes.data as Allergy[])
      if (classesRes.data) setClasses(classesRes.data as Class[])
      setLoading(false)
    }

    fetchData()
  }, [id, school?.id])

  async function handleSaveStudent() {
    if (!student) return
    setSaving(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('students')
      .update({
        full_name: editData.full_name,
        dob: editData.dob || null,
        blood_group: editData.blood_group || null,
        class_id: editData.class_id || null,
        enrollment_date: editData.enrollment_date || null,
      })
      .eq('id', student.id)

    if (!error) {
      // Refetch to get updated class join
      const { data } = await supabase
        .from('students')
        .select('*, class:classes(id, name)')
        .eq('id', student.id)
        .single()

      if (data) setStudent(data as StudentWithClass)
      setEditing(false)
    }
    setSaving(false)
  }

  async function handleAddGuardian() {
    if (!student || !school?.id || !guardianForm.full_name || !guardianForm.phone) return
    setSaving(true)
    const supabase = createClient()

    // Insert guardian
    const { data: guardian, error: gErr } = await supabase
      .from('guardians')
      .insert({
        school_id: school.id,
        full_name: guardianForm.full_name,
        phone: guardianForm.phone || null,
        email: guardianForm.email || null,
        relation: guardianForm.relation || null,
        occupation: guardianForm.occupation || null,
        address: guardianForm.address || null,
      })
      .select()
      .single()

    if (gErr || !guardian) {
      setSaving(false)
      return
    }

    // Insert junction
    await supabase.from('student_guardians').insert({
      student_id: student.id,
      guardian_id: guardian.id,
      school_id: school.id,
      is_primary: guardianForm.is_primary,
    })

    // Refresh guardians
    const { data } = await supabase
      .from('student_guardians')
      .select('*, guardian:guardians(*)')
      .eq('student_id', student.id)

    if (data) {
      setGuardians(
        (data as StudentGuardianRow[]).map((sg) => ({
          ...sg.guardian,
          is_primary: sg.is_primary,
        }))
      )
    }

    setGuardianModalOpen(false)
    setGuardianForm({
      full_name: '',
      phone: '',
      email: '',
      relation: '',
      occupation: '',
      address: '',
      is_primary: false,
    })
    setSaving(false)
  }

  async function handleAddAllergy() {
    if (!student || !school?.id || !allergyForm.allergy_type) return
    setSaving(true)
    const supabase = createClient()

    await supabase.from('allergies').insert({
      student_id: student.id,
      school_id: school.id,
      allergy_type: allergyForm.allergy_type,
      severity: (allergyForm.severity || null) as Allergy['severity'],
      notes: allergyForm.notes || null,
    })

    const { data } = await supabase
      .from('allergies')
      .select('*')
      .eq('student_id', student.id)

    if (data) setAllergies(data as Allergy[])

    setAllergyModalOpen(false)
    setAllergyForm({ allergy_type: '', severity: '', notes: '' })
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-surface-muted rounded w-48" />
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-surface-muted" />
            <div className="space-y-2 flex-1">
              <div className="h-6 bg-surface-muted rounded w-1/3" />
              <div className="h-4 bg-surface-muted rounded w-1/4" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="card text-center py-16">
        <p className="text-text-muted mb-4">Student not found.</p>
        <Link href="/students" className="btn-primary">
          Back to Students
        </Link>
      </div>
    )
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'info', label: 'Info' },
    { key: 'family', label: 'Family' },
    { key: 'documents', label: 'Documents' },
    { key: 'health', label: 'Health' },
  ]

  const initials = getInitials(student.full_name)
  const classOptions = classes.map((c) => ({ value: c.id, label: c.name }))

  return (
    <>
      {/* Back link */}
      <Link
        href="/students"
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary mb-4 min-h-[44px]"
      >
        <ArrowLeft size={16} /> Back to Students
      </Link>

      {/* Header with avatar */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4">
          {student.photo_url ? (
            <Image
              src={student.photo_url}
              alt={student.full_name}
              width={80}
              height={80}
              className="w-20 h-20 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold flex-shrink-0">
              {initials}
            </div>
          )}
          <div>
            <h1 className="text-xl font-bold text-primary-dark">{student.full_name}</h1>
            {student.class && (
              <p className="text-text-muted">{student.class.name}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium min-h-[44px] whitespace-nowrap transition-colors ${
              tab === t.key
                ? 'bg-primary text-white'
                : 'bg-surface-muted text-text-muted hover:text-primary-dark'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Info Tab */}
      {tab === 'info' && (
        <div className="card p-6">
          {!editing ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Student Information</h2>
                <button
                  onClick={() => setEditing(true)}
                  className="btn-secondary flex items-center gap-2 text-sm"
                >
                  <Edit2 size={14} /> Edit
                </button>
              </div>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-xs text-text-muted uppercase tracking-wide">Full Name</dt>
                  <dd className="font-medium mt-1">{student.full_name}</dd>
                </div>
                <div>
                  <dt className="text-xs text-text-muted uppercase tracking-wide">Date of Birth</dt>
                  <dd className="font-medium mt-1">
                    {student.dob ? formatDate(student.dob) : '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-text-muted uppercase tracking-wide">Blood Group</dt>
                  <dd className="font-medium mt-1">{student.blood_group || '-'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-text-muted uppercase tracking-wide">Class</dt>
                  <dd className="font-medium mt-1">{student.class?.name || '-'}</dd>
                </div>
                <div>
                  <dt className="text-xs text-text-muted uppercase tracking-wide">Enrollment Date</dt>
                  <dd className="font-medium mt-1">
                    {student.enrollment_date ? formatDate(student.enrollment_date) : '-'}
                  </dd>
                </div>
              </dl>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Edit Student</h2>
                <button
                  onClick={() => setEditing(false)}
                  className="btn-secondary flex items-center gap-2 text-sm"
                >
                  <X size={14} /> Cancel
                </button>
              </div>
              <div className="grid gap-4">
                <FormField
                  label="Full Name"
                  name="edit_full_name"
                  value={editData.full_name}
                  onChange={(v) => setEditData({ ...editData, full_name: v })}
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Date of Birth"
                    name="edit_dob"
                    type="date"
                    value={editData.dob}
                    onChange={(v) => setEditData({ ...editData, dob: v })}
                  />
                  <FormField
                    label="Blood Group"
                    name="edit_blood_group"
                    type="select"
                    value={editData.blood_group}
                    onChange={(v) => setEditData({ ...editData, blood_group: v })}
                    options={[
                      { value: 'A+', label: 'A+' },
                      { value: 'A-', label: 'A-' },
                      { value: 'B+', label: 'B+' },
                      { value: 'B-', label: 'B-' },
                      { value: 'AB+', label: 'AB+' },
                      { value: 'AB-', label: 'AB-' },
                      { value: 'O+', label: 'O+' },
                      { value: 'O-', label: 'O-' },
                    ]}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    label="Class"
                    name="edit_class_id"
                    type="select"
                    value={editData.class_id}
                    onChange={(v) => setEditData({ ...editData, class_id: v })}
                    options={classOptions}
                  />
                  <FormField
                    label="Enrollment Date"
                    name="edit_enrollment_date"
                    type="date"
                    value={editData.enrollment_date}
                    onChange={(v) => setEditData({ ...editData, enrollment_date: v })}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveStudent}
                    disabled={saving || !editData.full_name}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Save size={14} /> {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Family Tab */}
      {tab === 'family' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Guardians</h2>
            <button
              onClick={() => setGuardianModalOpen(true)}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus size={14} /> Add Guardian
            </button>
          </div>

          {guardians.length === 0 && (
            <div className="card text-center py-8">
              <p className="text-text-muted">No guardians added yet.</p>
            </div>
          )}

          {guardians.map((g) => (
            <div key={g.id} className="card p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{g.full_name}</p>
                    {g.relation && (
                      <span className="text-xs text-text-muted">({g.relation})</span>
                    )}
                    {g.is_primary && <StatusBadge status="primary" size="sm" />}
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2">
                    {g.phone && (
                      <a
                        href={`tel:${g.phone}`}
                        className="flex items-center gap-1 text-sm text-primary hover:underline min-h-[44px]"
                      >
                        <Phone size={14} /> {formatPhone(g.phone)}
                      </a>
                    )}
                    {g.email && (
                      <a
                        href={`mailto:${g.email}`}
                        className="flex items-center gap-1 text-sm text-primary hover:underline min-h-[44px]"
                      >
                        <Mail size={14} /> {g.email}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add Guardian Modal */}
          <Modal
            open={guardianModalOpen}
            onClose={() => setGuardianModalOpen(false)}
            title="Add Guardian"
            size="lg"
          >
            <GuardianForm value={guardianForm} onChange={setGuardianForm} />
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setGuardianModalOpen(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddGuardian}
                disabled={saving || !guardianForm.full_name || !guardianForm.phone}
                className="btn-primary"
              >
                {saving ? 'Saving...' : 'Add Guardian'}
              </button>
            </div>
          </Modal>
        </div>
      )}

      {/* Documents Tab */}
      {tab === 'documents' && (
        <div className="card text-center py-12">
          <p className="text-text-muted">Coming soon</p>
          <p className="text-sm text-text-muted mt-1">
            Document management will be available in a future update.
          </p>
        </div>
      )}

      {/* Health Tab */}
      {tab === 'health' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Allergies</h2>
            <button
              onClick={() => setAllergyModalOpen(true)}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus size={14} /> Add Allergy
            </button>
          </div>

          {allergies.length === 0 && (
            <div className="card text-center py-8">
              <p className="text-text-muted">No allergies recorded.</p>
            </div>
          )}

          {allergies.map((a) => (
            <div key={a.id} className="card p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">{a.allergy_type}</p>
                  {a.notes && <p className="text-sm text-text-muted mt-1">{a.notes}</p>}
                </div>
                {a.severity && <StatusBadge status={a.severity} />}
              </div>
            </div>
          ))}

          {/* Add Allergy Modal */}
          <Modal
            open={allergyModalOpen}
            onClose={() => setAllergyModalOpen(false)}
            title="Add Allergy"
          >
            <div className="grid gap-4">
              <FormField
                label="Allergy Type"
                name="allergy_type"
                value={allergyForm.allergy_type}
                onChange={(v) => setAllergyForm({ ...allergyForm, allergy_type: v })}
                placeholder="e.g. Peanuts, Dust, Lactose"
                required
              />
              <FormField
                label="Severity"
                name="severity"
                type="select"
                value={allergyForm.severity}
                onChange={(v) => setAllergyForm({ ...allergyForm, severity: v })}
                options={[
                  { value: 'mild', label: 'Mild' },
                  { value: 'moderate', label: 'Moderate' },
                  { value: 'severe', label: 'Severe' },
                ]}
                placeholder="Select severity"
              />
              <FormField
                label="Notes"
                name="allergy_notes"
                type="textarea"
                value={allergyForm.notes}
                onChange={(v) => setAllergyForm({ ...allergyForm, notes: v })}
                placeholder="Additional notes..."
                rows={2}
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setAllergyModalOpen(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAllergy}
                disabled={saving || !allergyForm.allergy_type}
                className="btn-primary"
              >
                {saving ? 'Saving...' : 'Add Allergy'}
              </button>
            </div>
          </Modal>
        </div>
      )}
    </>
  )
}
