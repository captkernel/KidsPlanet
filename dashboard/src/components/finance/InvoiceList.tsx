'use client'

import { formatCurrency, formatDate } from '@/lib/utils/formatters'
import { StatusBadge } from '@/components/shared/StatusBadge'

interface InvoiceItem {
  id: string
  description: string
  amount: number
}

interface PaymentSummary {
  amount: number
}

interface InvoiceData {
  id: string
  total_amount: number
  due_date: string
  status: string
  items?: InvoiceItem[]
  payments?: PaymentSummary[]
}

interface InvoiceListProps {
  invoices: InvoiceData[]
}

export function InvoiceList({ invoices }: InvoiceListProps) {
  if (invoices.length === 0) {
    return <p className="text-sm text-text-muted py-4 text-center">No invoices found</p>
  }

  return (
    <div className="space-y-3">
      {invoices.map((inv) => {
        const totalPaid = (inv.payments ?? []).reduce((s, p) => s + p.amount, 0)
        return (
          <div key={inv.id} className="border border-surface-muted rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <StatusBadge status={inv.status} />
                <span className="text-xs text-text-muted">Due: {formatDate(inv.due_date)}</span>
              </div>
              <span className="font-semibold text-sm">{formatCurrency(inv.total_amount)}</span>
            </div>

            {inv.items && inv.items.length > 0 && (
              <div className="space-y-1 mb-2">
                {inv.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs text-text-light">
                    <span>{item.description}</span>
                    <span>{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="text-xs text-text-muted flex gap-4 pt-2 border-t border-surface-muted">
              <span>Paid: <strong className="text-success">{formatCurrency(totalPaid)}</strong></span>
              <span>Balance: <strong className="text-danger">{formatCurrency(inv.total_amount - totalPaid)}</strong></span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
