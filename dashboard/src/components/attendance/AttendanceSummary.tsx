type Status = 'present' | 'absent' | 'late' | null

interface AttendanceSummaryProps {
  attendance: Record<string, Status>
}

export default function AttendanceSummary({ attendance }: AttendanceSummaryProps) {
  const values = Object.values(attendance)
  const total = values.length
  const present = values.filter((v) => v === 'present').length
  const absent = values.filter((v) => v === 'absent').length
  const late = values.filter((v) => v === 'late').length
  const unmarked = values.filter((v) => v === null).length

  const items = [
    { label: 'Total', count: total, color: 'bg-blue-500' },
    { label: 'Present', count: present, color: 'bg-green-500' },
    { label: 'Absent', count: absent, color: 'bg-red-500' },
    { label: 'Late', count: late, color: 'bg-amber-500' },
    { label: 'Unmarked', count: unmarked, color: 'bg-gray-400' },
  ]

  return (
    <div className="flex items-center gap-4 overflow-x-auto pb-1">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5 shrink-0">
          <span className={`w-3 h-3 rounded-full ${item.color}`} />
          <span className="text-sm font-semibold text-primary-dark">{item.count}</span>
          <span className="text-xs text-text-muted">{item.label}</span>
        </div>
      ))}
    </div>
  )
}
