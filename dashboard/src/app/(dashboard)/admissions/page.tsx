'use client'

import { useState, useEffect, useMemo } from 'react'
import PageHeader from '@/components/PageHeader'
import StatCard from '@/components/StatCard'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Modal } from '@/components/shared/Modal'
import { InquiryForm, type InquiryFormData } from '@/components/admissions/InquiryForm'
import { InquiryCard } from '@/components/admissions/InquiryCard'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { formatDate } from '@/lib/utils/formatters'
import type { Inquiry } from '@/lib/types/database'
import {
  UserPlus, Users, CheckCircle, Eye, LayoutGrid, List,
  Phone, MessageCircle, Calendar, ArrowRight,
} from 'lucide-react'

const KANBAN_COLUMNS = [
  { key: 'new', label: 'New', color: 'bg-blue-500' },
  { key: 'contacted', label: 'Contacted', color: 'bg-amber-500' },
  { key: 'visited', label: 'Visited', color: 'bg-purple-500' },
  { key: 'enrolled', label: 'Enrolled', color: 'bg-green-500' },
] as const

const nextStatus: Record<string, string> = {
  new: 'contacted',
  contacted: 'visited',
  visited: 'enrolled',
}

export default function AdmissionsPage() {
  const { school } = useAuth()
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'kanban' | 'list'>('list')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [editInquiry, setEditInquiry] = useState<Inquiry | null>(null)
  const [showConvert, setShowConvert] = useState<Inquiry | null>(null)

  const fetchInquiries = async () => {
    if (!school?.id) return
    const supabase = createClient()
    const { data } = await supabase
      .from('inquiries')
      .select('*')
      .eq('school_id', school.id)
      .order('created_at', { ascending: false })
    if (data) setInquiries(data)
  }

  useEffect(() => {
    if (!school?.id) return
    setLoading(true)
    fetchInquiries().finally(() => setLoading(false))
  }, [school?.id])

  const stats = useMemo(() => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 86400000)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    return {
      total: inquiries.length,
      newThisWeek: inquiries.filter((i) => new Date(i.created_at) >= weekAgo).length,
      enrolledThisMonth: inquiries.filter((i) => i.status === 'enrolled' && new Date(i.updated_at) >= monthStart).length,
      overdueFollowUps: inquiries.filter((i) =>
        i.follow_up_date && new Date(i.follow_up_date) < now && !['enrolled', 'declined'].includes(i.status)
      ).length,
    }
  }, [inquiries])

  const filtered = statusFilter === 'all' ? inquiries : inquiries.filter((i) => i.status === statusFilter)

  const handleAdd = async (data: InquiryFormData) => {
    if (!school?.id) return
    const supabase = createClient()
    const { error } = await supabase.from('inquiries').insert({
      school_id: school.id,
      parent_name: data.parent_name,
      parent_phone: data.parent_phone || null,
      parent_email: data.parent_email || null,
      child_name: data.child_name || null,
      child_dob: data.child_dob || null,
      class_sought: data.class_sought || null,
      source: data.source || null,
      notes: data.notes || null,
      follow_up_date: data.follow_up_date || null,
    })
    if (!error) {
      setShowAdd(false)
      await fetchInquiries()
    }
  }

  const handleUpdate = async (data: InquiryFormData) => {
    if (!school?.id || !editInquiry) return
    const supabase = createClient()
    const { error } = await supabase
      .from('inquiries')
      .update({
        parent_name: data.parent_name,
        parent_phone: data.parent_phone || null,
        parent_email: data.parent_email || null,
        child_name: data.child_name || null,
        child_dob: data.child_dob || null,
        class_sought: data.class_sought || null,
        source: data.source || null,
        notes: data.notes || null,
        follow_up_date: data.follow_up_date || null,
      })
      .eq('id', editInquiry.id)
    if (!error) {
      setEditInquiry(null)
      await fetchInquiries()
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    if (!school?.id) return
    const supabase = createClient()
    await supabase.from('inquiries').update({ status }).eq('id', id)
    await fetchInquiries()
  }

  const handleConvertToStudent = async () => {
    if (!school?.id || !showConvert) return
    const supabase = createClient()

    // Create student record
    const { error } = await supabase.from('students').insert({
      school_id: school.id,
      full_name: showConvert.child_name || `Child of ${showConvert.parent_name}`,
      dob: showConvert.child_dob || null,
      enrollment_date: new Date().toISOString().split('T')[0],
      status: 'active',
    })

    if (!error) {
      // Update inquiry status to enrolled
      await supabase.from('inquiries').update({ status: 'enrolled' }).eq('id', showConvert.id)
      setShowConvert(null)
      await fetchInquiries()
    }
  }

  return (
    <>
      <PageHeader
        title="Admissions"
        subtitle="Track inquiries and manage enrollment"
        actions={
          <div className="flex items-center gap-2">
            <div className="flex bg-surface rounded-lg p-1">
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded-md ${view === 'list' ? 'bg-primary text-white' : 'text-text-muted'}`}
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setView('kanban')}
                className={`p-2 rounded-md ${view === 'kanban' ? 'bg-primary text-white' : 'text-text-muted'}`}
              >
                <LayoutGrid size={16} />
              </button>
            </div>
            <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
              <UserPlus size={16} /> New Inquiry
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Inquiries" value={stats.total} icon={Users} color="primary" />
        <StatCard label="New This Week" value={stats.newThisWeek} icon={UserPlus} color="info" />
        <StatCard label="Enrolled This Month" value={stats.enrolledThisMonth} icon={CheckCircle} color="success" />
        <StatCard label="Overdue Follow-ups" value={stats.overdueFollowUps} icon={Calendar} color="danger" />
      </div>

      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card animate-pulse h-20" />
          ))}
        </div>
      )}

      {/* Kanban View */}
      {!loading && view === 'kanban' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {KANBAN_COLUMNS.map((col) => {
            const colInquiries = inquiries.filter((i) => i.status === col.key)
            return (
              <div key={col.key} className="bg-surface rounded-xl p-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-3 h-3 rounded-full ${col.color}`} />
                  <h3 className="text-sm font-semibold text-primary-dark">{col.label}</h3>
                  <span className="text-xs text-text-muted ml-auto">{colInquiries.length}</span>
                </div>
                <div className="space-y-2">
                  {colInquiries.map((inq) => {
                    const isOverdue = inq.follow_up_date && new Date(inq.follow_up_date) < new Date() && !['enrolled', 'declined'].includes(inq.status)
                    return (
                      <div
                        key={inq.id}
                        className={`bg-white rounded-lg p-3 shadow-sm ${isOverdue ? 'border-l-3 border-l-danger' : ''}`}
                      >
                        <div className="font-medium text-sm text-primary-dark">{inq.child_name || 'Child TBD'}</div>
                        <div className="text-xs text-text-muted">{inq.parent_name}</div>
                        {inq.class_sought && <div className="text-xs text-accent mt-1">{inq.class_sought}</div>}
                        {isOverdue && (
                          <div className="text-xs text-danger mt-1">Follow-up overdue</div>
                        )}
                        <div className="flex items-center gap-1 mt-2">
                          {inq.parent_phone && (
                            <a href={`tel:${inq.parent_phone}`} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-muted">
                              <Phone size={12} className="text-primary" />
                            </a>
                          )}
                          {nextStatus[col.key] && (
                            <button
                              onClick={() => handleStatusChange(inq.id, nextStatus[col.key])}
                              className="ml-auto text-xs text-primary hover:underline flex items-center gap-1"
                            >
                              Move <ArrowRight size={10} />
                            </button>
                          )}
                          {col.key === 'visited' && (
                            <button
                              onClick={() => setShowConvert(inq)}
                              className="ml-auto text-xs text-success font-medium hover:underline"
                            >
                              Convert
                            </button>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  {colInquiries.length === 0 && (
                    <div className="text-center text-xs text-text-muted py-4">No inquiries</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* List View */}
      {!loading && view === 'list' && (
        <>
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {['all', 'new', 'contacted', 'visited', 'enrolled', 'declined'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${
                  statusFilter === s ? 'bg-primary text-white' : 'bg-surface text-text-light hover:bg-surface-muted'
                }`}
              >
                {s === 'all' ? 'All' : s}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="card text-center py-12">
                <Users size={40} className="mx-auto text-text-muted mb-3" />
                <p className="text-text-muted">No inquiries found.</p>
              </div>
            ) : (
              filtered.map((inq) => (
                <div key={inq.id} className="relative">
                  <InquiryCard inquiry={inq} onEdit={setEditInquiry} />
                  {inq.status === 'visited' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowConvert(inq) }}
                      className="absolute top-3 right-3 btn-primary text-xs !py-1 !px-3"
                    >
                      Convert to Student
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Add Inquiry Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="New Inquiry" size="lg">
        <InquiryForm onSubmit={handleAdd} onCancel={() => setShowAdd(false)} submitLabel="Add Inquiry" />
      </Modal>

      {/* Edit Inquiry Modal */}
      {editInquiry && (
        <Modal open={!!editInquiry} onClose={() => setEditInquiry(null)} title="Edit Inquiry" size="lg">
          <div className="mb-4 flex gap-2">
            {['new', 'contacted', 'visited', 'enrolled', 'declined'].map((s) => (
              <button
                key={s}
                onClick={async () => {
                  await handleStatusChange(editInquiry.id, s)
                  setEditInquiry(null)
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${
                  editInquiry.status === s ? 'bg-primary text-white' : 'bg-surface text-text-light'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <InquiryForm
            initialData={{
              parent_name: editInquiry.parent_name,
              parent_phone: editInquiry.parent_phone || '',
              parent_email: editInquiry.parent_email || '',
              child_name: editInquiry.child_name || '',
              child_dob: editInquiry.child_dob || '',
              class_sought: editInquiry.class_sought || '',
              source: editInquiry.source || '',
              notes: editInquiry.notes || '',
              follow_up_date: editInquiry.follow_up_date || '',
            }}
            onSubmit={handleUpdate}
            onCancel={() => setEditInquiry(null)}
            submitLabel="Update"
          />
        </Modal>
      )}

      {/* Convert to Student Confirmation */}
      {showConvert && (
        <Modal open={!!showConvert} onClose={() => setShowConvert(null)} title="Convert to Student" size="sm">
          <div className="space-y-4">
            <p className="text-sm text-text-light">
              This will create a new student record for <strong>{showConvert.child_name || 'this child'}</strong> and mark the inquiry as enrolled.
            </p>
            <div className="bg-surface-cream rounded-lg p-3 space-y-1">
              <div className="text-xs text-text-muted">Child: <span className="text-primary-dark font-medium">{showConvert.child_name || 'TBD'}</span></div>
              <div className="text-xs text-text-muted">Parent: <span className="text-primary-dark font-medium">{showConvert.parent_name}</span></div>
              {showConvert.class_sought && (
                <div className="text-xs text-text-muted">Class: <span className="text-primary-dark font-medium">{showConvert.class_sought}</span></div>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={handleConvertToStudent} className="btn-primary flex-1">
                Convert
              </button>
              <button onClick={() => setShowConvert(null)} className="btn-secondary flex-1">
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
