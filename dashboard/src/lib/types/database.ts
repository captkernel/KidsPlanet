export interface School {
  id: string
  name: string
  address: string | null
  phone: string | null
  email: string | null
  logo_url: string | null
  settings: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface AcademicYear {
  id: string
  school_id: string
  name: string
  start_date: string
  end_date: string
  is_current: boolean
  created_at: string
  updated_at: string
}

export interface Class {
  id: string
  school_id: string
  academic_year_id: string
  name: string
  section: string | null
  teacher_id: string | null
  capacity: number | null
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  user_id: string
  school_id: string
  full_name: string
  phone: string | null
  avatar_url: string | null
  roles: string[]
  primary_role: 'admin' | 'staff' | 'parent' | 'accountant'
  created_at: string
  updated_at: string
}

export interface Student {
  id: string
  school_id: string
  class_id: string | null
  full_name: string
  dob: string | null
  photo_url: string | null
  blood_group: string | null
  enrollment_date: string | null
  status: 'active' | 'alumni' | 'withdrawn'
  created_at: string
  updated_at: string
}

export interface Guardian {
  id: string
  school_id: string
  user_id: string | null
  full_name: string
  phone: string | null
  email: string | null
  relation: string | null
  occupation: string | null
  address: string | null
  created_at: string
  updated_at: string
}

export interface StudentGuardian {
  student_id: string
  guardian_id: string
  school_id: string
  is_primary: boolean
}

export interface Document {
  id: string
  student_id: string
  school_id: string
  type: 'birth_cert' | 'aadhaar' | 'photo' | 'medical' | 'other'
  file_url: string
  uploaded_at: string
}

export interface Allergy {
  id: string
  student_id: string
  school_id: string
  allergy_type: string
  severity: 'mild' | 'moderate' | 'severe' | null
  notes: string | null
}

export interface Attendance {
  id: string
  school_id: string
  student_id: string
  date: string
  status: 'present' | 'absent' | 'late'
  check_in_time: string | null
  check_out_time: string | null
  marked_by: string | null
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  school_id: string
  sender_id: string
  subject: string | null
  body: string
  type: 'announcement' | 'alert' | 'newsletter'
  audience: 'all' | 'class' | 'individual'
  audience_filter: string | null
  created_at: string
}

export interface MessageRecipient {
  id: string
  message_id: string
  school_id: string
  guardian_id: string
  sent_via: 'email' | 'sms' | null
  delivered_at: string | null
  read_at: string | null
}

export interface CommTemplate {
  id: string
  school_id: string
  name: string
  body: string
  type: 'fee_reminder' | 'absence_alert' | 'holiday_notice' | 'general'
}

export interface FeeStructure {
  id: string
  school_id: string
  academic_year_id: string
  class_id: string
  fee_type: 'tuition' | 'transport' | 'meals' | 'activity' | 'materials' | 'other'
  amount: number
  frequency: 'monthly' | 'quarterly' | 'annual'
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  school_id: string
  student_id: string
  academic_year_id: string
  total_amount: number
  due_date: string
  status: 'pending' | 'paid' | 'overdue' | 'partial'
  generated_at: string
  updated_at: string
}

export interface InvoiceItem {
  id: string
  invoice_id: string
  school_id: string
  fee_structure_id: string | null
  description: string
  amount: number
}

export interface Payment {
  id: string
  school_id: string
  invoice_id: string
  amount: number
  method: 'cash' | 'upi' | 'cheque' | 'bank_transfer'
  received_by: string | null
  created_by: string | null
  updated_by: string | null
  receipt_number: string | null
  paid_at: string
  notes: string | null
  created_at: string
  updated_at: string
}

// Join types for common queries
export interface StudentWithClass extends Student {
  class: Class | null
}

export interface StudentWithGuardians extends Student {
  class: Class | null
  guardians: (Guardian & { is_primary: boolean })[]
  allergies: Allergy[]
}

export interface InvoiceWithItems extends Invoice {
  student: Student
  items: InvoiceItem[]
  payments: Payment[]
}

export interface AttendanceWithStudent extends Attendance {
  student: Student
}
