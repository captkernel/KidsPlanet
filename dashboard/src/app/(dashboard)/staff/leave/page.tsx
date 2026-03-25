'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import StatCard from '@/components/StatCard'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { Modal } from '@/components/shared/Modal'
import { LeaveRequestForm, type LeaveFormData } from '@/components/staff/LeaveRequestForm'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { formatDate } from '@/lib/utils/formatters'
import type { LeaveRequest, StaffProfile } from '@/lib/types/database'
import { ArrowLeft, Plus, Calendar, Check, X, Clock, CheckCircle, XCircle } from 'lucide-react'

interface LeaveWithStaff extends LeaveRequest {
  staff: StaffProfile
}

export default function LeaveManagementPage() {
  const { school, profile, user } = useAuth()
  const [leaves, setLeaves] = useState<LeaveWithStaff[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [myStaffId, setMyStaffId] = useState<string | null>(null)

  const isAdmin = profile?.primary_role === 'admin'

  useEffect(() => {
    if (!school?.id) return
    const supabase = createClient()

    async function fetchData() {
      setLoading(true)
      const [leavesRes, myStaffRes] = await Promise.all([
        supabase
          .from('leave_requests')
          .select('*, staff:staff_profiles(id, full_name, designation, photo_url)')
          .eq('school_id', school!.id)
          .order('created_at', { ascending: false }),
        user ? supabase
          .from('staff_profiles')
          .select('id')
          .eq('school_id', school!.id)
          .eq('user_id', user.id)
          .single() : Promise.resolve({ data: null }),
      ])
      if (leavesRes.data) setLeaves(leavesRes.data as LeaveWithStaff[])
      if (myStaffRes.data) setMyStaffId(myStaffRes.data.id)
      setLoading(false)
    }

    fetchData()
  }, [school?.id, user?.id])

  const filtered = statusFilter === 'all' ? leaves : leaves.filter((l) => l.status === statusFilter)

  const stats = {
    pending: leaves.filter((l) => l.status === 'pending').length,
    approved: leaves.filter((l) => l.status === 'approved').length,
    rejected: leaves.filter((l) => l.status === 'rejected').length,
  }

  const handleSubmitLeave = async (data: LeaveFormData) => {
    if (!school?.id || !myStaffId) return
    const supabase = createClient()
    const { error } = await supabase.from('leave_requests').insert({
      school_id: school.id,
      staff_id: myStaffId,
      leave_type: data.leave_type,
      from_date: data.from_date,
      to_date: data.to_date,
      reason: data.reason || null,
    })
    if (!error) {
      setShowAdd(false)
      // Refresh
      const { data: refreshed } = await supabase
        .from('leave_requests')
        .select('*, staff:staff_profiles(id, full_name, designation, photo_url)')
        .eq('school_id', school.id)
        .order('created_at', { ascending: false })
      if (refreshed) setLeaves(refreshed as LeaveWithStaff[])
    }
  }

  const handleAction = async (leaveId: string, action: 'approved' | 'rejected') => {
    if (!school?.id || !user) return
    const supabase = createClient()
    const { error } = await supabase
      .from('leave_requests')
      .update({ status: action, approved_by: user.id })
      .eq('id', leaveId)
    if (!error) {
      setLeaves((prev) =>
        prev.map((l) => (l.id === leaveId ? { ...l, status: action, approved_by: user.id } : l))
      )
    }
  }

  return (
    <>
      <Link href="/staff" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary mb-4">
        <ArrowLeft size={16} /> Back to Staff
      </Link>

      <PageHeader
        title="Leave Management"
        subtitle="Manage staff leave requests"
        actions={
          myStaffId ? (
            <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
              <Plus size={16} /> Request Leave
            </button>
          ) : undefined
        }
      />

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Pending" value={stats.pending} icon={Clock} color="warning" />
        <StatCard label="Approved" value={stats.approved} icon={CheckCircle} color="success" />
        <StatCard label="Rejected" value={stats.rejected} icon={XCircle} color="danger" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {['all', 'pending', 'approved', 'rejected'].map((s) => (
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

      {/* Leave list */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card animate-pulse h-20" />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="card text-center py-12">
          <Calendar size={40} className="mx-auto text-text-muted mb-3" />
          <p className="text-text-muted">No leave requests found.</p>
        </div>
      )}

      {!loading && (
        <div className="space-y-3">
          {filtered.map((leave) => (
            <div key={leave.id} className="card !p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {leave.staff?.full_name?.[0] || '?'}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-primary-dark">{leave.staff?.full_name}</div>
                    <div className="text-xs text-text-muted capitalize">{leave.leave_type} Leave</div>
                    <div className="text-xs text-text-muted mt-0.5">
                      {formatDate(leave.from_date)} — {formatDate(leave.to_date)}
                    </div>
                    {leave.reason && <div className="text-xs text-text-light mt-1">{leave.reason}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={leave.status} />
                  {isAdmin && leave.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleAction(leave.id, 'approved')}
                        className="w-11 h-11 flex items-center justify-center rounded-xl bg-green-50 text-success hover:bg-green-100 transition-colors"
                        title="Approve"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => handleAction(leave.id, 'rejected')}
                        className="w-11 h-11 flex items-center justify-center rounded-xl bg-red-50 text-danger hover:bg-red-100 transition-colors"
                        title="Reject"
                      >
                        <X size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Leave Request Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Request Leave">
        <LeaveRequestForm onSubmit={handleSubmitLeave} onCancel={() => setShowAdd(false)} />
      </Modal>
    </>
  )
}
