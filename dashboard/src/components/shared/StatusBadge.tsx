const statusColors: Record<string, string> = {
  // Green
  active: 'bg-green-100 text-green-800',
  present: 'bg-green-100 text-green-800',
  paid: 'bg-green-100 text-green-800',
  enrolled: 'bg-green-100 text-green-800',
  approved: 'bg-green-100 text-green-800',
  // Red
  absent: 'bg-red-100 text-red-800',
  overdue: 'bg-red-100 text-red-800',
  declined: 'bg-red-100 text-red-800',
  rejected: 'bg-red-100 text-red-800',
  serious: 'bg-red-100 text-red-800',
  withdrawn: 'bg-red-100 text-red-800',
  // Amber
  late: 'bg-amber-100 text-amber-800',
  partial: 'bg-amber-100 text-amber-800',
  pending: 'bg-amber-100 text-amber-800',
  contacted: 'bg-amber-100 text-amber-800',
  // Blue/Gray
  alumni: 'bg-blue-100 text-blue-800',
  new: 'bg-blue-100 text-blue-800',
  visited: 'bg-blue-100 text-blue-800',
}

interface StatusBadgeProps {
  status: string
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const color = statusColors[status.toLowerCase()] ?? 'bg-gray-100 text-gray-800'
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'

  return (
    <span className={`inline-flex items-center rounded-full font-medium capitalize ${color} ${sizeClass}`}>
      {status}
    </span>
  )
}
