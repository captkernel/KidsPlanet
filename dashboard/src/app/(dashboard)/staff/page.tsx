'use client'

import { useState, useEffect, useMemo } from 'react'
import PageHeader from '@/components/PageHeader'
import { StaffCard } from '@/components/staff/StaffCard'
import { StaffForm, type StaffFormData } from '@/components/staff/StaffForm'
import { Modal } from '@/components/shared/Modal'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import type { StaffWithClass, Class } from '@/lib/types/database'
import { Search, UserPlus, Users } from 'lucide-react'

const DESIGNATIONS = [
  { value: 'all', label: 'All Designations' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'assistant', label: 'Assistant' },
  { value: 'driver', label: 'Driver' },
  { value: 'cook', label: 'Cook' },
  { value: 'admin', label: 'Admin' },
  { value: 'other', label: 'Other' },
]

export default function StaffPage() {
  const { school, profile } = useAuth()
  const [staff, setStaff] = useState<StaffWithClass[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [designationFilter, setDesignationFilter] = useState('all')
  const [showAdd, setShowAdd] = useState(false)

  const isAdmin = profile?.primary_role === 'admin'

  useEffect(() => {
    if (!school?.id) return
    const supabase = createClient()

    async function fetchData() {
      setLoading(true)
      const [staffRes, classesRes] = await Promise.all([
        supabase
          .from('staff_profiles')
          .select('*, class:classes(id, name)')
          .eq('school_id', school!.id)
          .eq('status', 'active')
          .order('full_name'),
        supabase
          .from('classes')
          .select('id, name')
          .eq('school_id', school!.id)
          .order('name'),
      ])
      if (staffRes.data) setStaff(staffRes.data as StaffWithClass[])
      if (classesRes.data) setClasses(classesRes.data as Class[])
      setLoading(false)
    }

    fetchData()
  }, [school?.id])

  const filtered = useMemo(() => {
    return staff.filter((s) => {
      const matchSearch = !search || s.full_name.toLowerCase().includes(search.toLowerCase())
      const matchDesignation = designationFilter === 'all' || s.designation === designationFilter
      return matchSearch && matchDesignation
    })
  }, [staff, search, designationFilter])

  const handleAdd = async (data: StaffFormData) => {
    if (!school?.id) return
    const supabase = createClient()
    const { error } = await supabase.from('staff_profiles').insert({
      school_id: school.id,
      full_name: data.full_name,
      phone: data.phone || null,
      designation: data.designation || null,
      class_id: data.class_id || null,
      date_of_joining: data.date_of_joining || null,
      salary: data.salary ? parseFloat(data.salary) : null,
      emergency_contact: data.emergency_contact || null,
      address: data.address || null,
    })
    if (!error) {
      setShowAdd(false)
      // Refresh
      const { data: refreshed } = await supabase
        .from('staff_profiles')
        .select('*, class:classes(id, name)')
        .eq('school_id', school.id)
        .eq('status', 'active')
        .order('full_name')
      if (refreshed) setStaff(refreshed as StaffWithClass[])
    }
  }

  return (
    <>
      <PageHeader
        title="Staff Directory"
        subtitle={`${staff.length} staff members`}
        actions={
          isAdmin ? (
            <button onClick={() => setShowAdd(true)} className="btn-primary flex items-center gap-2">
              <UserPlus size={16} /> Add Staff
            </button>
          ) : undefined
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        <select
          value={designationFilter}
          onChange={(e) => setDesignationFilter(e.target.value)}
          className="input w-auto"
        >
          {DESIGNATIONS.map((d) => (
            <option key={d.value} value={d.value}>{d.label}</option>
          ))}
        </select>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-surface-muted flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-surface-muted rounded w-3/4" />
                <div className="h-3 bg-surface-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Staff cards grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((member) => (
            <StaffCard key={member.id} staff={member} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && staff.length === 0 && (
        <div className="card text-center py-16">
          <Users size={48} className="mx-auto text-text-muted mb-4" />
          <h3 className="text-lg font-semibold text-primary-dark mb-2">No staff members yet</h3>
          <p className="text-text-muted mb-6">Add your first staff member to get started.</p>
          {isAdmin && (
            <button onClick={() => setShowAdd(true)} className="btn-primary inline-flex items-center gap-2">
              <UserPlus size={16} /> Add Staff
            </button>
          )}
        </div>
      )}

      {!loading && filtered.length === 0 && staff.length > 0 && (
        <div className="card text-center py-12">
          <p className="text-text-muted">No staff members found matching your search.</p>
        </div>
      )}

      {/* Add Staff Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Staff Member" size="lg">
        <StaffForm classes={classes} onSubmit={handleAdd} onCancel={() => setShowAdd(false)} />
      </Modal>
    </>
  )
}
