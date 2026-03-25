'use client'

import { formatCurrency, formatDate } from '@/lib/utils/formatters'
import { Modal } from '@/components/shared/Modal'
import { Printer } from 'lucide-react'

interface ReceiptViewProps {
  open: boolean
  onClose: () => void
  schoolName: string
  receiptNumber: string | null
  date: string
  studentName: string
  className: string
  amount: number
  method: string
}

export function ReceiptView({
  open,
  onClose,
  schoolName,
  receiptNumber,
  date,
  studentName,
  className: studentClass,
  amount,
  method,
}: ReceiptViewProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <Modal open={open} onClose={onClose} title="Payment Receipt">
      <div id="receipt-content" className="print:m-0">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-primary-dark">{schoolName}</h2>
          <p className="text-xs text-text-muted mt-1">Payment Receipt</p>
        </div>

        <div className="border border-surface-muted rounded-xl p-4 space-y-3">
          {receiptNumber && (
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Receipt No.</span>
              <span className="font-semibold">{receiptNumber}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Date</span>
            <span className="font-medium">{formatDate(date)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Student</span>
            <span className="font-medium">{studentName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Class</span>
            <span className="font-medium">{studentClass}</span>
          </div>
          <hr className="border-surface-muted" />
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Amount Paid</span>
            <span className="font-bold text-success text-lg">{formatCurrency(amount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Method</span>
            <span className="font-medium capitalize">{method.replace('_', ' ')}</span>
          </div>
        </div>

        <button
          onClick={handlePrint}
          className="btn-primary w-full mt-4 flex items-center justify-center gap-2 print:hidden"
        >
          <Printer size={16} />
          Print Receipt
        </button>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #receipt-content, #receipt-content * { visibility: visible; }
          #receipt-content { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </Modal>
  )
}
