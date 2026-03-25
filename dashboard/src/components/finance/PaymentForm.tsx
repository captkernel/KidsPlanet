'use client'

import { useState } from 'react'
import { Modal } from '@/components/shared/Modal'
import { FormField } from '@/components/shared/FormField'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/hooks/useAuth'
import { formatCurrency } from '@/lib/utils/formatters'
import { Banknote, Smartphone, FileText, Building2 } from 'lucide-react'

interface PaymentFormProps {
  open: boolean
  onClose: () => void
  invoiceId: string
  studentName: string
  totalAmount: number
  totalPaid: number
  schoolId: string
  onSuccess: (payment: { amount: number; method: string; receiptNumber: string | null }) => void
}

const methods = [
  { value: 'cash', label: 'Cash', icon: Banknote },
  { value: 'upi', label: 'UPI', icon: Smartphone },
  { value: 'cheque', label: 'Cheque', icon: FileText },
  { value: 'bank_transfer', label: 'Bank Transfer', icon: Building2 },
] as const

export function PaymentForm({
  open,
  onClose,
  invoiceId,
  studentName,
  totalAmount,
  totalPaid,
  schoolId,
  onSuccess,
}: PaymentFormProps) {
  const { user } = useAuth()
  const outstanding = totalAmount - totalPaid
  const [amount, setAmount] = useState(String(outstanding))
  const [method, setMethod] = useState<string>('cash')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    const numAmount = parseFloat(amount)
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid amount')
      return
    }
    if (numAmount > outstanding) {
      setError('Amount cannot exceed outstanding balance')
      return
    }

    setSaving(true)
    setError('')

    try {
      const supabase = createClient()

      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .insert({
          school_id: schoolId,
          invoice_id: invoiceId,
          amount: numAmount,
          method,
          received_by: user?.id ?? null,
          created_by: user?.id ?? null,
          notes: notes || null,
        })
        .select('receipt_number')
        .single()

      if (paymentError) throw paymentError

      // Update invoice status
      const newTotalPaid = totalPaid + numAmount
      const newStatus = newTotalPaid >= totalAmount ? 'paid' : newTotalPaid > 0 ? 'partial' : 'pending'

      const { error: updateError } = await supabase
        .from('invoices')
        .update({ status: newStatus })
        .eq('id', invoiceId)

      if (updateError) throw updateError

      onSuccess({ amount: numAmount, method, receiptNumber: payment?.receipt_number ?? null })
      onClose()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to record payment')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Record Payment">
      <div className="space-y-4">
        <div className="bg-surface-cream rounded-xl p-4">
          <p className="text-sm text-text-muted">Student</p>
          <p className="font-semibold text-primary-dark">{studentName}</p>
          <div className="flex gap-6 mt-2">
            <div>
              <p className="text-xs text-text-muted">Total Due</p>
              <p className="text-sm font-semibold">{formatCurrency(totalAmount)}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Paid</p>
              <p className="text-sm font-semibold text-success">{formatCurrency(totalPaid)}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Outstanding</p>
              <p className="text-sm font-semibold text-danger">{formatCurrency(outstanding)}</p>
            </div>
          </div>
        </div>

        <FormField
          label="Amount"
          type="number"
          name="amount"
          value={amount}
          onChange={setAmount}
          required
          min={1}
          placeholder="Enter amount"
        />

        <div>
          <label className="label">Payment Method</label>
          <div className="grid grid-cols-2 gap-2">
            {methods.map((m) => {
              const Icon = m.icon
              const active = method === m.value
              return (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMethod(m.value)}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-colors text-sm font-medium ${
                    active
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-surface-muted bg-white text-text-light hover:border-primary/30'
                  }`}
                >
                  <Icon size={18} />
                  {m.label}
                </button>
              )
            })}
          </div>
        </div>

        <FormField
          label="Notes"
          type="textarea"
          name="notes"
          value={notes}
          onChange={setNotes}
          placeholder="Optional notes..."
          rows={2}
        />

        {error && <p className="text-danger text-sm">{error}</p>}

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary w-full"
        >
          {saving ? 'Recording...' : 'Record Payment'}
        </button>
      </div>
    </Modal>
  )
}
