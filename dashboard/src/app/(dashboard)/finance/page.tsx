'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import PageHeader from '@/components/PageHeader'
import StatCard from '@/components/StatCard'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { PaymentForm } from '@/components/finance/PaymentForm'
import { InvoiceList } from '@/components/finance/InvoiceList'
import { ReceiptView } from '@/components/finance/ReceiptView'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { formatCurrency } from '@/lib/utils/formatters'
import type { AcademicYear } from '@/lib/types/database'
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Receipt,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  Search,
} from 'lucide-react'

interface InvoiceRow {
  id: string
  total_amount: number
  due_date: string
  status: string
  student: {
    id: string
    full_name: string
    class_id: string | null
    class: { name: string } | null
  }
  payments: { amount: number }[]
  items?: { id: string; description: string; amount: number }[]
}

interface StudentSummary {
  studentId: string
  studentName: string
  className: string
  totalDue: number
  totalPaid: number
  balance: number
  status: string
  invoices: InvoiceRow[]
}

export default function FinancePage() {
  const { school, user } = useAuth()
  const [academicYear, setAcademicYear] = useState<AcademicYear | null>(null)
  const [invoices, setInvoices] = useState<InvoiceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [search, setSearch] = useState('')
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null)
  const [paymentTarget, setPaymentTarget] = useState<{
    invoiceId: string
    studentName: string
    className: string
    totalAmount: number
    totalPaid: number
  } | null>(null)
  const [receipt, setReceipt] = useState<{
    studentName: string
    className: string
    amount: number
    method: string
    receiptNumber: string | null
  } | null>(null)
  const [generateMsg, setGenerateMsg] = useState('')

  const supabase = useMemo(() => createClient(), [])

  const fetchData = useCallback(async () => {
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

    const { data } = await supabase
      .from('invoices')
      .select('*, student:students(id, full_name, class_id, class:classes(name)), payments(amount), items:invoice_items(id, description, amount)')
      .eq('academic_year_id', year.id)
      .order('generated_at', { ascending: false })

    setInvoices((data ?? []) as unknown as InvoiceRow[])
    setLoading(false)
  }, [school, supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Stats
  const totalDue = invoices.reduce((s, inv) => s + inv.total_amount, 0)
  const collected = invoices.reduce(
    (s, inv) => s + (inv.payments ?? []).reduce((ps, p) => ps + p.amount, 0),
    0
  )
  const outstanding = totalDue - collected
  const collectionRate = totalDue > 0 ? ((collected / totalDue) * 100).toFixed(1) : '0'

  // Group by student
  const studentSummaries = useMemo(() => {
    const map = new Map<string, StudentSummary>()
    for (const inv of invoices) {
      if (!inv.student) continue
      const sid = inv.student.id
      if (!map.has(sid)) {
        map.set(sid, {
          studentId: sid,
          studentName: inv.student.full_name,
          className: inv.student.class?.name ?? '—',
          totalDue: 0,
          totalPaid: 0,
          balance: 0,
          status: 'pending',
          invoices: [],
        })
      }
      const summary = map.get(sid)!
      const paid = (inv.payments ?? []).reduce((s, p) => s + p.amount, 0)
      summary.totalDue += inv.total_amount
      summary.totalPaid += paid
      summary.invoices.push(inv)
    }

    for (const s of map.values()) {
      s.balance = s.totalDue - s.totalPaid
      if (s.balance <= 0) s.status = 'paid'
      else if (s.totalPaid > 0) s.status = 'partial'
      else if (s.invoices.some((i) => i.status === 'overdue')) s.status = 'overdue'
      else s.status = 'pending'
    }

    return Array.from(map.values()).sort((a, b) => b.balance - a.balance)
  }, [invoices])

  const filtered = search
    ? studentSummaries.filter(
        (s) =>
          s.studentName.toLowerCase().includes(search.toLowerCase()) ||
          s.className.toLowerCase().includes(search.toLowerCase())
      )
    : studentSummaries

  // Generate invoices
  const handleGenerate = async () => {
    if (!school || !academicYear || !user) return
    setGenerating(true)
    setGenerateMsg('')

    try {
      // Fetch active students
      const { data: students } = await supabase
        .from('students')
        .select('id, class_id')
        .eq('school_id', school.id)
        .eq('status', 'active')

      if (!students || students.length === 0) {
        setGenerateMsg('No active students found')
        setGenerating(false)
        return
      }

      // Fetch fee structures for current year
      const { data: feeStructures } = await supabase
        .from('fee_structures')
        .select('*')
        .eq('academic_year_id', academicYear.id)

      if (!feeStructures || feeStructures.length === 0) {
        setGenerateMsg('No fee structures defined. Please add fee structures first.')
        setGenerating(false)
        return
      }

      // Build map: class_id -> fee structures
      const feesByClass = new Map<string, typeof feeStructures>()
      for (const fee of feeStructures) {
        if (!feesByClass.has(fee.class_id)) feesByClass.set(fee.class_id, [])
        feesByClass.get(fee.class_id)!.push(fee)
      }

      // Due date: end of current month
      const now = new Date()
      const dueDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]

      let invoiceCount = 0
      for (const student of students) {
        if (!student.class_id) continue
        const classFees = feesByClass.get(student.class_id)
        if (!classFees || classFees.length === 0) continue

        const totalAmount = classFees.reduce((s, f) => s + f.amount, 0)

        // Create invoice
        const { data: invoice, error: invError } = await supabase
          .from('invoices')
          .insert({
            school_id: school.id,
            student_id: student.id,
            academic_year_id: academicYear.id,
            total_amount: totalAmount,
            due_date: dueDate,
            status: 'pending',
          })
          .select('id')
          .single()

        if (invError || !invoice) continue

        // Create invoice items
        const items = classFees.map((fee) => ({
          invoice_id: invoice.id,
          school_id: school.id,
          fee_structure_id: fee.id,
          description: `${fee.fee_type.charAt(0).toUpperCase() + fee.fee_type.slice(1)} (${fee.frequency})`,
          amount: fee.amount,
        }))

        await supabase.from('invoice_items').insert(items)
        invoiceCount++
      }

      setGenerateMsg(`Generated ${invoiceCount} invoice(s) successfully`)
      fetchData()
    } catch {
      setGenerateMsg('Failed to generate invoices')
    } finally {
      setGenerating(false)
    }
  }

  const handlePaymentSuccess = (data: { amount: number; method: string; receiptNumber: string | null }) => {
    if (paymentTarget) {
      setReceipt({
        studentName: paymentTarget.studentName,
        className: paymentTarget.className,
        amount: data.amount,
        method: data.method,
        receiptNumber: data.receiptNumber,
      })
    }
    setPaymentTarget(null)
    fetchData()
  }

  const openPayment = (summary: StudentSummary) => {
    // Pick the first unpaid invoice
    const unpaidInvoice = summary.invoices.find((i) => i.status !== 'paid') ?? summary.invoices[0]
    if (!unpaidInvoice) return
    const invoicePaid = (unpaidInvoice.payments ?? []).reduce((s, p) => s + p.amount, 0)
    setPaymentTarget({
      invoiceId: unpaidInvoice.id,
      studentName: summary.studentName,
      className: summary.className,
      totalAmount: unpaidInvoice.total_amount,
      totalPaid: invoicePaid,
    })
  }

  if (loading) {
    return (
      <>
        <PageHeader title="Finance" subtitle="Fee collection and financial overview" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="stat-card h-24 animate-pulse bg-surface-muted rounded-xl" />
          ))}
        </div>
        <div className="card">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-surface-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Finance"
        subtitle="Fee collection and financial overview"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="btn-secondary flex items-center gap-2"
            >
              <FileSpreadsheet size={16} />
              {generating ? 'Generating...' : 'Generate Invoices'}
            </button>
          </div>
        }
      />

      {generateMsg && (
        <div className="mb-4 p-3 rounded-xl bg-blue-50 text-blue-800 text-sm">
          {generateMsg}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Due" value={formatCurrency(totalDue)} icon={DollarSign} color="primary" />
        <StatCard label="Collected" value={formatCurrency(collected)} icon={TrendingUp} color="success" />
        <StatCard label="Outstanding" value={formatCurrency(outstanding)} icon={AlertTriangle} color="danger" />
        <StatCard label="Collection Rate" value={`${collectionRate}%`} icon={CheckCircle} color="info" />
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          className="input pl-10"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Student-wise fee list */}
      {filtered.length === 0 ? (
        <div className="card text-center py-12 text-text-muted">
          {invoices.length === 0
            ? 'No invoices yet. Click "Generate Invoices" to create invoices from fee structures.'
            : 'No students match your search.'}
        </div>
      ) : (
        <div className="card !p-0 overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-primary/10 bg-surface-cream">
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Student</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Class</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Total Due</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Paid</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Balance</th>
                  <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-right text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <>
                    <tr
                      key={s.studentId}
                      className="border-b border-primary/5 hover:bg-surface-cream/50 cursor-pointer"
                      onClick={() =>
                        setExpandedStudent(expandedStudent === s.studentId ? null : s.studentId)
                      }
                    >
                      <td className="px-4 py-3 text-sm font-medium text-primary-dark">
                        <div className="flex items-center gap-2">
                          {expandedStudent === s.studentId ? (
                            <ChevronUp size={14} className="text-text-muted" />
                          ) : (
                            <ChevronDown size={14} className="text-text-muted" />
                          )}
                          {s.studentName}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-text-light">{s.className}</td>
                      <td className="px-4 py-3 text-sm font-semibold">{formatCurrency(s.totalDue)}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-success">{formatCurrency(s.totalPaid)}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-danger">{formatCurrency(s.balance)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        {s.status !== 'paid' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              openPayment(s)
                            }}
                            className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1 ml-auto"
                          >
                            <Receipt size={12} /> Pay
                          </button>
                        )}
                      </td>
                    </tr>
                    {expandedStudent === s.studentId && (
                      <tr key={`${s.studentId}-detail`} className="border-b border-primary/5">
                        <td colSpan={7} className="px-4 py-4 bg-surface-cream/30">
                          <InvoiceList invoices={s.invoices} />
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-surface-muted">
            {filtered.map((s) => (
              <div key={s.studentId} className="p-4">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setExpandedStudent(expandedStudent === s.studentId ? null : s.studentId)
                  }
                >
                  <div>
                    <p className="font-semibold text-sm text-primary-dark">{s.studentName}</p>
                    <p className="text-xs text-text-muted">{s.className}</p>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
                <div className="flex gap-4 mt-2 text-xs">
                  <span>Due: <strong>{formatCurrency(s.totalDue)}</strong></span>
                  <span>Paid: <strong className="text-success">{formatCurrency(s.totalPaid)}</strong></span>
                  <span>Bal: <strong className="text-danger">{formatCurrency(s.balance)}</strong></span>
                </div>
                {s.status !== 'paid' && (
                  <button
                    onClick={() => openPayment(s)}
                    className="btn-primary text-xs px-3 py-1.5 mt-2 flex items-center gap-1"
                  >
                    <Receipt size={12} /> Record Payment
                  </button>
                )}
                {expandedStudent === s.studentId && (
                  <div className="mt-3">
                    <InvoiceList invoices={s.invoices} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentTarget && school && (
        <PaymentForm
          open
          onClose={() => setPaymentTarget(null)}
          invoiceId={paymentTarget.invoiceId}
          studentName={paymentTarget.studentName}
          totalAmount={paymentTarget.totalAmount}
          totalPaid={paymentTarget.totalPaid}
          schoolId={school.id}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Receipt Modal */}
      {receipt && school && (
        <ReceiptView
          open
          onClose={() => setReceipt(null)}
          schoolName={school.name}
          receiptNumber={receipt.receiptNumber}
          date={new Date().toISOString()}
          studentName={receipt.studentName}
          className={receipt.className}
          amount={receipt.amount}
          method={receipt.method}
        />
      )}

    </>
  )
}
