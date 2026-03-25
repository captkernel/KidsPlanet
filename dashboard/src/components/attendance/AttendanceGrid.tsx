import { getInitials } from '@/lib/utils/formatters'
import { Check, X, Clock } from 'lucide-react'

type Status = 'present' | 'absent' | 'late' | null

interface AttendanceGridProps {
  students: { id: string; full_name: string; photo_url: string | null }[]
  attendance: Record<string, Status>
  onToggle: (studentId: string) => void
}

const statusConfig: Record<string, { bg: string; border: string; icon: React.ReactNode; dot: string }> = {
  present: {
    bg: 'bg-green-50',
    border: 'border-green-300',
    icon: <Check size={18} className="text-green-600" />,
    dot: 'bg-green-500',
  },
  absent: {
    bg: 'bg-red-50',
    border: 'border-red-300',
    icon: <X size={18} className="text-red-600" />,
    dot: 'bg-red-500',
  },
  late: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    icon: <Clock size={18} className="text-amber-600" />,
    dot: 'bg-amber-500',
  },
}

const defaultConfig = {
  bg: 'bg-surface',
  border: 'border-border',
  icon: null,
  dot: 'bg-gray-300',
}

export default function AttendanceGrid({ students, attendance, onToggle }: AttendanceGridProps) {
  if (students.length === 0) {
    return (
      <div className="card text-center py-12 text-text-muted">
        No students found. Select a class above.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {students.map((student) => {
        const status = attendance[student.id] ?? null
        const config = status ? statusConfig[status] : defaultConfig

        return (
          <button
            key={student.id}
            type="button"
            onClick={() => onToggle(student.id)}
            className={`card !p-3 flex flex-col items-center gap-2 min-h-[100px] justify-center
              border-2 ${config.border} ${config.bg} cursor-pointer
              transition-all duration-150 active:scale-95 hover:shadow-md`}
          >
            {/* Avatar */}
            <div className="relative">
              {student.photo_url ? (
                <img
                  src={student.photo_url}
                  alt={student.full_name}
                  className="w-11 h-11 rounded-full object-cover"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                  {getInitials(student.full_name)}
                </div>
              )}
              {/* Status dot */}
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white
                  flex items-center justify-center ${config.dot}`}
              >
                {config.icon && (
                  <span className="text-white scale-50">{config.icon}</span>
                )}
              </span>
            </div>

            {/* Name */}
            <span className="text-xs font-medium text-primary-dark text-center leading-tight line-clamp-2">
              {student.full_name}
            </span>

            {/* Status label */}
            {status && (
              <span className="text-[10px] font-semibold uppercase tracking-wide text-text-muted">
                {status}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
