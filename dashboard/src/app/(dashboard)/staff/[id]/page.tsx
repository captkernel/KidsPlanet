'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Modal } from '@/components/shared/Modal'
import { StaffForm, type StaffFormData } from '@/components/staff/StaffForm'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { formatDate } from '@/lib/utils/formatters'
import type { StaffWithClass, StaffDocument, LeaveRequest, Class } from '@/lib/types/database'
import { ArrowLeft, Phone, MapPin, Edit2, FileText, Calendar, AlertCircle } from 'lucide-react'

type Tab = 'details' | 'documents' | 'leaves'

const designationLabels: Record<string, string> = {
  teacher: 'Teacher',
  assistant: 'Assistant',
  driver: 'Driver',
  cook: 'Cook',
  admin: 'Admin',
  other: 'Other',
}

const docTypeLabels: Record<string, string> = {
  id_proof: 'ID Proof',
  qualification: 'Qualification',
  police_verification: 'Police Verification',
  contract: 'Contract',
  other: 'Other',
}

export default function StaffProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { school, profile } = useAuth()
  const [staff, setStaff] = useState<StaffWithClass | null>(null)
  const [documents, setDocuments] = useState<StaffDocument[]>([])
  const [leaves, setLeaves] = useState<LeaveRequest[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<Tab>('details')
  const [editing, setEditing] = useState(false)

  const isAdmin = profile?.primary_role === 'admin'

  useEffect(() => {
    if (!school?.id) return
    const supabase = createClient()

    async function fetchData() {
      setLoading(true)
      const [staffRes, docsRes, leavesRes, classesRes] = await Promise.all([
        supabase
          .from('staff_profiles')
          .select('*, class:classes(id, name)')
          .eq('id', id)
          .eq('school_id', school!.id)
          .single(),
        supabase
          .from('staff_documents')
          .select('*')
          .eq('staff_id', id)
          .eq('school_id', school!.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('leave_requests')
          .select('*')
          .eq('staff_id', id)
          .eq('school_id', school!.id)
          .order('from_date', { ascending: false }),
        supabase
          .from('classes')
          .select('id, name')
          .eq('school_id', school!.id)
          .order('name'),
      ])
      if (staffRes.data) setStaff(staffRes.data as StaffWithClass)
      if (docsRes.data) setDocuments(docsRes.data)
      if (leavesRes.data) setLeaves(leavesRes.data)
      if (classesRes.data) setClasses(classesRes.data as Class[])
      setLoading(false)
    }

    fetchData()
  }, [school?.id, id])

  const handleUpdate = async (data: StaffFormData) => {
    if (!school?.id || !staff) return
    const supabase = createClient()
    const { error } = await supabase
      .from('staff_profiles')
      .update({
        full_name: data.full_name,
        phone: data.phone || null,
        designation: data.designation || null,
        class_id: data.class_id || null,
        date_of_joining: data.date_of_joining || null,
        salary: data.salary ? parseFloat(data.salary) : null,
        emergency_contact: data.emergency_contact || null,
        address: data.address || null,
      })
      .eq('id', staff.id)
    if (!error) {
      setEditing(false)
      const { data: refreshed } = await supabase
        .from('staff_profiles')
        .select('*, class:classes(id, name)')
        .eq('id', id)
        .single()
      if (refreshed) setStaff(refreshed as StaffWithClass)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-surface-muted rounded w-48 animate-pulse" />
        <div className="card animate-pulse space-y-4 p-6">
          <div className="flex gap-4">
            <div className="w-20 h-20 bg-surface-muted rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-surface-muted rounded w-48" />
              <div className="h-4 bg-surface-muted rounded w-32" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!staff) {
    return (
      <div className="card text-center py-16">
        <AlertCircle size={48} className="mx-auto text-text-muted mb-4" />
        <h3 className="text-lg font-semibold text-primary-dark mb-2">Staff member not found</h3>
        <Link href="/staff" className="btn-primary inline-flex items-center gap-2 mt-4">
          <ArrowLeft size={16} /> Back to Staff
        </Link>
      </div>
    )
  }

  const initials = staff.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  const tabs: { key: Tab; label: string }[] = [
    { key: 'details', label: 'Details' },
    { key: 'documents', label: `Documents (${documents.length})` },
    { key: 'leaves', label: `Leaves (${leaves.length})` },
  ]

  return (
    <>
      <Link href="/staff" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary mb-4">
        <ArrowLeft size={16} /> Back to Staff
      </Link>

      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold flex-shrink-0">
            {staff.photo_url ? (
              <img src={staff.photo_url} alt={staff.full_name} className="w-20 h-20 rounded-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-primary-dark">{staff.full_name}</h2>
                <p className="text-sm text-accent font-medium">
                  {staff.designation ? designationLabels[staff.designation] : 'Staff'}
                  {staff.class?.name && ` — ${staff.class.name}`}
                </p>
              </div>
              <StatusBadge status={staff.status} size="md" />
            </div>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-text-muted">
              {staff.phone && (
                <a href={`tel:${staff.phone}`} className="flex items-center gap-1 hover:text-primary">
                  <Phone size={14} /> {staff.phone}
                </a>
              )}
              {staff.date_of_joining && (
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> Joined {formatDate(staff.date_of_joining)}
                </span>
              )}
              {staff.address && (
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {staff.address}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              tab === t.key ? 'bg-primary text-white' : 'bg-surface text-text-light hover:bg-surface-muted'
            }`}
          >
            {t.label}
          </button>
        ))}
        {isAdmin && (
          <button
            onClick={() => setEditing(true)}
            className="ml-auto px-4 py-2 rounded-lg text-sm font-medium text-primary hover:bg-primary/10 flex items-center gap-1"
          >
            <Edit2 size={14} /> Edit
          </button>
        )}
      </div>

      {/* Details Tab */}
      {tab === 'details' && (
        <div className="card">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-text-muted mb-1">Designation</div>
              <div className="text-sm font-medium">{staff.designation ? designationLabels[staff.designation] : '—'}</div>
            </div>
            <div>
              <div className="text-xs text-text-muted mb-1">Assigned Class</div>
              <div className="text-sm font-medium">{staff.class?.name || '—'}</div>
            </div>
            <div>
              <div className="text-xs text-text-muted mb-1">Date of Joining</div>
              <div className="text-sm font-medium">{staff.date_of_joining ? formatDate(staff.date_of_joining) : '—'}</div>
            </div>
            <div>
              <div className="text-xs text-text-muted mb-1">Emergency Contact</div>
              <div className="text-sm font-medium">{staff.emergency_contact || '—'}</div>
            </div>
            <div className="sm:col-span-2">
              <div className="text-xs text-text-muted mb-1">Address</div>
              <div className="text-sm font-medium">{staff.address || '—'}</div>
            </div>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {tab === 'documents' && (
        <div className="space-y-3">
          {documents.length === 0 ? (
            <div className="card text-center py-12">
              <FileText size={40} className="mx-auto text-text-muted mb-3" />
              <p className="text-text-muted">No documents uploaded yet.</p>
            </div>
          ) : (
            documents.map((doc) => (
              <div key={doc.id} className="card !p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-primary" />
                  <div>
                    <div className="text-sm font-medium">{docTypeLabels[doc.type]}</div>
                    {doc.expiry_date && (
                      <div className={`text-xs ${
                        new Date(doc.expiry_date) < new Date() ? 'text-danger font-medium' : 'text-text-muted'
                      }`}>
                        Expires: {formatDate(doc.expiry_date)}
                      </div>
                    )}
                  </div>
                </div>
                <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs">
                  View
                </a>
              </div>
            ))
          )}
        </div>
      )}

      {/* Leaves Tab */}
      {tab === 'leaves' && (
        <div className="space-y-3">
          {leaves.length === 0 ? (
            <div className="card text-center py-12">
              <Calendar size={40} className="mx-auto text-text-muted mb-3" />
              <p className="text-text-muted">No leave requests.</p>
            </div>
          ) : (
            leaves.map((leave) => (
              <div key={leave.id} className="card !p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium capitalize">{leave.leave_type} Leave</div>
                    <div className="text-xs text-text-muted">
                      {formatDate(leave.from_date)} — {formatDate(leave.to_date)}
                    </div>
                    {leave.reason && <div className="text-xs text-text-light mt-1">{leave.reason}</div>}
                  </div>
                  <StatusBadge status={leave.status} />
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Edit Modal */}
      <Modal open={editing} onClose={() => setEditing(false)} title="Edit Staff Member" size="lg">
        <StaffForm
          initialData={{
            full_name: staff.full_name,
            phone: staff.phone || '',
            designation: staff.designation || '',
            class_id: staff.class_id || '',
            date_of_joining: staff.date_of_joining || '',
            salary: staff.salary?.toString() || '',
            emergency_contact: staff.emergency_contact || '',
            address: staff.address || '',
          }}
          classes={classes}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
          submitLabel="Update"
        />
      </Modal>
    </>
  )
}
