'use client'

import { useEffect, useMemo, useState } from 'react'
import PageHeader from '@/components/PageHeader'
import { Modal } from '@/components/shared/Modal'
import { FormField } from '@/components/shared/FormField'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { formatCurrency } from '@/lib/utils/formatters'
import type { FeeStructure, AcademicYear, Class } from '@/lib/types/database'
import { Plus, BookOpen } from 'lucide-react'

type FeeStructureWithClass = FeeStructure & { class: Pick<Class, 'id' | 'name'> | null }

const FEE_TYPES = [
  { value: 'tuition', label: 'Tuition' },
  { value: 'transport', label: 'Transport' },
  { value: 'meals', label: 'Meals' },
  { value: 'activity', label: 'Activity' },
  { value: 'materials', label: 'Materials' },
  { value: 'other', label: 'Other' },
]

const FREQUENCIES = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annual', label: 'Annual' },
]

export default function FeeStructurePage() {
  const { school } = useAuth()
  const [academicYear, setAcademicYear] = useState<AcademicYear | null>(null)
  const [feeStructures, setFeeStructures] = useState<FeeStructureWithClass[]>([])
  const [classes, setClasses] = useState<Pick<Class, 'id' | 'name'>[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    class_id: '',
    fee_type: '',
    amount: '',
    frequency: '',
  })

  const supabase = useMemo(() => createClient(), [])

  const fetchData = async () => {
    if (!school) return
    setLoading(true)

    const { data: year } = await supabase
      .from('academic_years')
      .select('*')
      .eq('school_id', school.id)
      .eq('is_current', true)
      .single()

    if (!year) {
      setLoading(false)
      return
    }
    setAcademicYear(year)

    const [feesRes, classesRes] = await Promise.all([
      supabase
        .from('fee_structures')
        .select('*, class:classes(id, name)')
        .eq('academic_year_id', year.id)
        .order('class_id'),
      supabase
        .from('classes')
        .select('id, name')
        .eq('school_id', school.id)
        .order('name'),
    ])

    setFeeStructures((feesRes.data ?? []) as FeeStructureWithClass[])
    setClasses(classesRes.data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [school])

  // Group by class
  const grouped = useMemo(() => {
    const map = new Map<string, { className: string; fees: FeeStructureWithClass[] }>()
    for (const fee of feeStructures) {
      const classId = fee.class_id
      const className = fee.class?.name ?? 'Unknown'
      if (!map.has(classId)) {
        map.set(classId, { className, fees: [] })
      }
      map.get(classId)!.fees.push(fee)
    }
    return Array.from(map.values())
  }, [feeStructures])

  const handleSave = async () => {
    if (!form.class_id || !form.fee_type || !form.amount || !form.frequency) {
      setError('All fields are required')
      return
    }
    if (!academicYear || !school) return

    setSaving(true)
    setError('')

    const { error: insertError } = await supabase.from('fee_structures').insert({
      school_id: school.id,
      academic_year_id: academicYear.id,
      class_id: form.class_id,
      fee_type: form.fee_type,
      amount: parseFloat(form.amount),
      frequency: form.frequency,
    })

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
      return
    }

    setSaving(false)
    setShowModal(false)
    setForm({ class_id: '', fee_type: '', amount: '', frequency: '' })
    fetchData()
  }

  if (loading) {
    return (
      <>
        <PageHeader title="Fee Structure" subtitle="Manage fee structures for the academic year" />
        <div className="card">
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-surface-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </>
    )
  }

  if (!academicYear) {
    return (
      <>
        <PageHeader title="Fee Structure" subtitle="Manage fee structures for the academic year" />
        <div className="card text-center py-12 text-text-muted">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No current academic year found. Please set up an academic year first.</p>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Fee Structure"
        subtitle={`Academic Year: ${academicYear.name}`}
        actions={
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Plus size={16} /> Add Fee
          </button>
        }
      />

      {grouped.length === 0 ? (
        <div className="card text-center py-12 text-text-muted">
          No fee structures defined yet. Click &quot;Add Fee&quot; to create one.
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map((group) => (
            <div key={group.className} className="card !p-0 overflow-hidden">
              <div className="bg-surface-cream px-4 py-3 border-b border-primary/10">
                <h3 className="font-semibold text-primary-dark">{group.className}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-muted">
                      <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Fee Type</th>
                      <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Amount</th>
                      <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Frequency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.fees.map((fee) => (
                      <tr key={fee.id} className="border-b border-surface-muted last:border-0">
                        <td className="px-4 py-3 text-sm capitalize">{fee.fee_type}</td>
                        <td className="px-4 py-3 text-sm font-semibold">{formatCurrency(fee.amount)}</td>
                        <td className="px-4 py-3 text-sm capitalize">{fee.frequency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add Fee Structure">
        <div className="space-y-4">
          <FormField
            label="Class"
            type="select"
            name="class_id"
            value={form.class_id}
            onChange={(v) => setForm({ ...form, class_id: v })}
            options={classes.map((c) => ({ value: c.id, label: c.name }))}
            required
          />
          <FormField
            label="Fee Type"
            type="select"
            name="fee_type"
            value={form.fee_type}
            onChange={(v) => setForm({ ...form, fee_type: v })}
            options={FEE_TYPES}
            required
          />
          <FormField
            label="Amount (₹)"
            type="number"
            name="amount"
            value={form.amount}
            onChange={(v) => setForm({ ...form, amount: v })}
            required
            min={1}
            placeholder="Enter amount"
          />
          <FormField
            label="Frequency"
            type="select"
            name="frequency"
            value={form.frequency}
            onChange={(v) => setForm({ ...form, frequency: v })}
            options={FREQUENCIES}
            required
          />

          {error && <p className="text-danger text-sm">{error}</p>}

          <button onClick={handleSave} disabled={saving} className="btn-primary w-full">
            {saving ? 'Saving...' : 'Save Fee Structure'}
          </button>
        </div>
      </Modal>
    </>
  )
}
