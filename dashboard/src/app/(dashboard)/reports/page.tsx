'use client'

import { useState, useEffect, useMemo } from 'react'
import PageHeader from '@/components/PageHeader'
import StatCard from '@/components/StatCard'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { formatCurrency, formatPercent } from '@/lib/utils/formatters'
import type { Student, Class, Attendance, Invoice, Payment, Inquiry } from '@/lib/types/database'
import {
  Users, TrendingUp, IndianRupee, GraduationCap, BarChart3,
  PieChart, ClipboardCheck, Printer,
} from 'lucide-react'

export default function ReportsPage() {
  const { school } = useAuth()
  const [students, setStudents] = useState<(Student & { class: Class | null })[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [attendance, setAttendance] = useState<Attendance[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [reportTab, setReportTab] = useState<'overview' | 'attendance' | 'finance' | 'admissions'>('overview')

  useEffect(() => {
    if (!school?.id) return
    const supabase = createClient()

    async function fetchData() {
      setLoading(true)
      // Get current month date range for attendance
      const now = new Date()
      const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
      const monthEnd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()}`

      const [studRes, classRes, attRes, invRes, payRes, inqRes] = await Promise.all([
        supabase.from('students').select('*, class:classes(id, name)').eq('school_id', school!.id).eq('status', 'active'),
        supabase.from('classes').select('id, name, capacity').eq('school_id', school!.id).order('name'),
        supabase.from('attendance').select('*').eq('school_id', school!.id).gte('date', monthStart).lte('date', monthEnd),
        supabase.from('invoices').select('*').eq('school_id', school!.id),
        supabase.from('payments').select('*').eq('school_id', school!.id),
        supabase.from('inquiries').select('*').eq('school_id', school!.id),
      ])
      if (studRes.data) setStudents(studRes.data as (Student & { class: Class | null })[])
      if (classRes.data) setClasses(classRes.data as Class[])
      if (attRes.data) setAttendance(attRes.data)
      if (invRes.data) setInvoices(invRes.data)
      if (payRes.data) setPayments(payRes.data)
      if (inqRes.data) setInquiries(inqRes.data)
      setLoading(false)
    }

    fetchData()
  }, [school?.id])

  // Computed stats
  const stats = useMemo(() => {
    const totalStudents = students.length
    const totalClasses = classes.length

    // Attendance
    const totalRecords = attendance.length
    const presentRecords = attendance.filter((a) => a.status === 'present' || a.status === 'late').length
    const attendanceRate = totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0

    // Finance
    const totalDue = invoices.reduce((sum, i) => sum + (i.total_amount || 0), 0)
    const totalCollected = payments.reduce((sum, p) => sum + (p.amount || 0), 0)
    const outstanding = totalDue - totalCollected
    const collectionRate = totalDue > 0 ? (totalCollected / totalDue) * 100 : 0
    const paidInvoices = invoices.filter((i) => i.status === 'paid').length
    const overdueInvoices = invoices.filter((i) => i.status === 'overdue').length

    // Admissions
    const totalInquiries = inquiries.length
    const enrolled = inquiries.filter((i) => i.status === 'enrolled').length
    const conversionRate = totalInquiries > 0 ? (enrolled / totalInquiries) * 100 : 0

    // By class
    const studentsByClass: Record<string, number> = {}
    students.forEach((s) => {
      const className = s.class?.name || 'Unassigned'
      studentsByClass[className] = (studentsByClass[className] || 0) + 1
    })

    // Attendance by class for this month
    const attendanceByClass: Record<string, { total: number; present: number }> = {}
    attendance.forEach((a) => {
      const student = students.find((s) => s.id === a.student_id)
      const className = student?.class?.name || 'Unassigned'
      if (!attendanceByClass[className]) attendanceByClass[className] = { total: 0, present: 0 }
      attendanceByClass[className].total++
      if (a.status === 'present' || a.status === 'late') attendanceByClass[className].present++
    })

    // Class capacity utilization
    const classCap = classes.map((c) => ({
      name: c.name,
      capacity: c.capacity || 0,
      filled: studentsByClass[c.name] || 0,
    }))

    return {
      totalStudents, totalClasses, attendanceRate, totalDue, totalCollected,
      outstanding, collectionRate, paidInvoices, overdueInvoices,
      totalInquiries, enrolled, conversionRate,
      studentsByClass, attendanceByClass, classCap,
    }
  }, [students, classes, attendance, invoices, payments, inquiries])

  const handlePrint = () => window.print()

  return (
    <>
      <PageHeader
        title="Reports & Analytics"
        subtitle="School performance at a glance"
        actions={
          <button onClick={handlePrint} className="btn-secondary flex items-center gap-2">
            <Printer size={16} /> Export PDF
          </button>
        }
      />

      {loading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="stat-card animate-pulse h-28" />
          ))}
        </div>
      )}

      {/* KPI Cards */}
      {!loading && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 print-section">
          <StatCard label="Total Students" value={stats.totalStudents} icon={Users} color="primary" />
          <StatCard label="Attendance Rate" value={`${stats.attendanceRate.toFixed(0)}%`} icon={ClipboardCheck} color={stats.attendanceRate >= 80 ? 'success' : 'warning'} />
          <StatCard label="Fee Collection" value={formatCurrency(stats.totalCollected)} icon={IndianRupee} color="accent" />
          <StatCard label="Inquiries" value={stats.totalInquiries} icon={GraduationCap} color="info" />
        </div>
      )}

      {/* Report Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'attendance', label: 'Attendance' },
          { key: 'finance', label: 'Finance' },
          { key: 'admissions', label: 'Admissions' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setReportTab(t.key as typeof reportTab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
              reportTab === t.key ? 'bg-primary text-white' : 'bg-surface text-text-light hover:bg-surface-muted'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {!loading && (
        <div className="print-section">
          {/* Overview */}
          {reportTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Students by class */}
              <div className="card">
                <h2 className="font-bold text-primary-dark mb-4 flex items-center gap-2">
                  <BarChart3 size={18} /> Students by Class
                </h2>
                <div className="space-y-3">
                  {Object.entries(stats.studentsByClass).sort(([a], [b]) => a.localeCompare(b)).map(([cls, count]) => (
                    <div key={cls} className="flex items-center gap-3">
                      <span className="text-sm text-text-light w-28 truncate">{cls}</span>
                      <div className="flex-1 h-6 bg-surface-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${Math.max((count / Math.max(stats.totalStudents, 1)) * 100, 15)}%` }}
                        >
                          <span className="text-[10px] font-bold text-white">{count}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Class capacity */}
              <div className="card">
                <h2 className="font-bold text-primary-dark mb-4 flex items-center gap-2">
                  <PieChart size={18} /> Seat Utilization
                </h2>
                <div className="space-y-3">
                  {stats.classCap.filter((c) => c.capacity > 0).map((c) => {
                    const pct = Math.round((c.filled / c.capacity) * 100)
                    const remaining = c.capacity - c.filled
                    return (
                      <div key={c.name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-text-light">{c.name}</span>
                          <span className={`text-xs font-medium ${remaining <= 3 ? 'text-danger' : 'text-text-muted'}`}>
                            {c.filled}/{c.capacity} ({remaining} left)
                          </span>
                        </div>
                        <div className="h-2 bg-surface-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${remaining <= 3 ? 'bg-danger' : 'bg-primary'}`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Attendance Report */}
          {reportTab === 'attendance' && (
            <div className="card">
              <h2 className="font-bold text-primary-dark mb-4 flex items-center gap-2">
                <ClipboardCheck size={18} /> Attendance by Class (This Month)
              </h2>
              <div className="space-y-4">
                {Object.entries(stats.attendanceByClass).sort(([a], [b]) => a.localeCompare(b)).map(([cls, data]) => {
                  const pct = data.total > 0 ? Math.round((data.present / data.total) * 100) : 0
                  return (
                    <div key={cls}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-text-light">{cls}</span>
                        <span className={`font-semibold ${pct >= 80 ? 'text-success' : pct >= 60 ? 'text-warning' : 'text-danger'}`}>
                          {pct}%
                        </span>
                      </div>
                      <div className="h-3 bg-surface-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="text-xs text-text-muted mt-0.5">{data.present}/{data.total} present days</div>
                    </div>
                  )
                })}
                {Object.keys(stats.attendanceByClass).length === 0 && (
                  <p className="text-sm text-text-muted">No attendance data for this month yet.</p>
                )}
              </div>
            </div>
          )}

          {/* Finance Report */}
          {reportTab === 'finance' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h2 className="font-bold text-primary-dark mb-4 flex items-center gap-2">
                  <IndianRupee size={18} /> Fee Collection Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-surface-cream">
                    <span className="text-sm text-text-light">Total Due</span>
                    <span className="font-bold text-primary-dark">{formatCurrency(stats.totalDue)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-green-50">
                    <span className="text-sm text-text-light">Collected</span>
                    <span className="font-bold text-success">{formatCurrency(stats.totalCollected)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-red-50">
                    <span className="text-sm text-text-light">Outstanding</span>
                    <span className="font-bold text-danger">{formatCurrency(stats.outstanding)}</span>
                  </div>
                  <div className="pt-2 text-center">
                    <div className="text-3xl font-bold text-primary">{stats.collectionRate.toFixed(0)}%</div>
                    <div className="text-xs text-text-muted">Collection Rate</div>
                  </div>
                </div>
              </div>

              <div className="card">
                <h2 className="font-bold text-primary-dark mb-4">Invoice Status</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-green-50 text-center">
                    <div className="text-2xl font-bold text-success">{stats.paidInvoices}</div>
                    <div className="text-xs text-text-muted">Paid</div>
                  </div>
                  <div className="p-3 rounded-lg bg-red-50 text-center">
                    <div className="text-2xl font-bold text-danger">{stats.overdueInvoices}</div>
                    <div className="text-xs text-text-muted">Overdue</div>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-50 text-center">
                    <div className="text-2xl font-bold text-warning">{invoices.filter((i) => i.status === 'partial').length}</div>
                    <div className="text-xs text-text-muted">Partial</div>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50 text-center">
                    <div className="text-2xl font-bold text-info">{invoices.filter((i) => i.status === 'pending').length}</div>
                    <div className="text-xs text-text-muted">Pending</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admissions Funnel */}
          {reportTab === 'admissions' && (
            <div className="card">
              <h2 className="font-bold text-primary-dark mb-4 flex items-center gap-2">
                <GraduationCap size={18} /> Admissions Funnel
              </h2>
              <div className="space-y-4">
                {[
                  { stage: 'Total Inquiries', count: stats.totalInquiries, pct: 100, color: 'bg-blue-500' },
                  {
                    stage: 'Contacted',
                    count: inquiries.filter((i) => ['contacted', 'visited', 'enrolled'].includes(i.status)).length,
                    pct: stats.totalInquiries > 0 ? Math.round((inquiries.filter((i) => ['contacted', 'visited', 'enrolled'].includes(i.status)).length / stats.totalInquiries) * 100) : 0,
                    color: 'bg-amber-500',
                  },
                  {
                    stage: 'Visited',
                    count: inquiries.filter((i) => ['visited', 'enrolled'].includes(i.status)).length,
                    pct: stats.totalInquiries > 0 ? Math.round((inquiries.filter((i) => ['visited', 'enrolled'].includes(i.status)).length / stats.totalInquiries) * 100) : 0,
                    color: 'bg-purple-500',
                  },
                  { stage: 'Enrolled', count: stats.enrolled, pct: Math.round(stats.conversionRate), color: 'bg-green-500' },
                ].map((stage) => (
                  <div key={stage.stage}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-light">{stage.stage}</span>
                      <span className="font-semibold text-primary-dark">{stage.count} ({stage.pct}%)</span>
                    </div>
                    <div className="h-3 bg-surface-muted rounded-full overflow-hidden">
                      <div className={`h-full ${stage.color} rounded-full`} style={{ width: `${Math.max(stage.pct, 2)}%` }} />
                    </div>
                  </div>
                ))}
                {stats.totalInquiries === 0 && (
                  <p className="text-sm text-text-muted">No inquiry data yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
