'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import PageHeader from '@/components/PageHeader'
import { StudentCard } from '@/components/students/StudentCard'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import type { StudentWithClass, Class } from '@/lib/types/database'
import { Search, UserPlus, Users } from 'lucide-react'

export default function StudentsPage() {
  const { school } = useAuth()
  const [students, setStudents] = useState<StudentWithClass[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('all')

  useEffect(() => {
    if (!school?.id) return

    const supabase = createClient()

    async function fetchData() {
      setLoading(true)

      const [studentsRes, classesRes] = await Promise.all([
        supabase
          .from('students')
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

      if (studentsRes.data) setStudents(studentsRes.data as StudentWithClass[])
      if (classesRes.data) setClasses(classesRes.data as Class[])
      setLoading(false)
    }

    fetchData()
  }, [school?.id])

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        !search || s.full_name.toLowerCase().includes(search.toLowerCase())
      const matchClass =
        classFilter === 'all' || s.class_id === classFilter
      return matchSearch && matchClass
    })
  }, [students, search, classFilter])

  return (
    <>
      <PageHeader
        title="Students"
        subtitle={`${students.length} active students`}
        actions={
          <Link href="/students/new" className="btn-primary flex items-center gap-2">
            <UserPlus size={16} /> Add Student
          </Link>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="input w-auto"
        >
          <option value="all">All Classes</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-surface-muted flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-surface-muted rounded w-3/4" />
                <div className="h-3 bg-surface-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Student cards grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && students.length === 0 && (
        <div className="card text-center py-16">
          <Users size={48} className="mx-auto text-text-muted mb-4" />
          <h3 className="text-lg font-semibold text-primary-dark mb-2">
            No students yet
          </h3>
          <p className="text-text-muted mb-6">
            Add your first student to get started.
          </p>
          <Link href="/students/new" className="btn-primary inline-flex items-center gap-2">
            <UserPlus size={16} /> Add Student
          </Link>
        </div>
      )}

      {/* No results for search/filter */}
      {!loading && filtered.length === 0 && students.length > 0 && (
        <div className="card text-center py-12">
          <p className="text-text-muted">No students found matching your search.</p>
        </div>
      )}
    </>
  )
}
