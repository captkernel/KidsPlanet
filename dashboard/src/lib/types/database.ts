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

// ── Staff/HR ──

export interface StaffProfile {
  id: string
  school_id: string
  user_id: string | null
  full_name: string
  phone: string | null
  designation: 'teacher' | 'assistant' | 'driver' | 'cook' | 'admin' | 'other' | null
  class_id: string | null
  date_of_joining: string | null
  salary: number | null
  photo_url: string | null
  emergency_contact: string | null
  address: string | null
  status: 'active' | 'resigned'
  created_at: string
  updated_at: string
}

export interface StaffDocument {
  id: string
  staff_id: string
  school_id: string
  type: 'id_proof' | 'qualification' | 'police_verification' | 'contract' | 'other'
  file_url: string
  expiry_date: string | null
  created_at: string
}

export interface LeaveRequest {
  id: string
  school_id: string
  staff_id: string
  leave_type: 'casual' | 'sick' | 'earned'
  from_date: string
  to_date: string
  reason: string | null
  status: 'pending' | 'approved' | 'rejected'
  approved_by: string | null
  created_at: string
  updated_at: string
}

// ── Admissions CRM ──

export interface Inquiry {
  id: string
  school_id: string
  parent_name: string
  parent_phone: string | null
  parent_email: string | null
  child_name: string | null
  child_dob: string | null
  class_sought: string | null
  source: 'website' | 'walkin' | 'referral' | 'social_media' | 'other' | null
  status: 'new' | 'contacted' | 'visited' | 'enrolled' | 'declined'
  notes: string | null
  follow_up_date: string | null
  assigned_to: string | null
  created_at: string
  updated_at: string
}

// ── Calendar ──

export interface SchoolEvent {
  id: string
  school_id: string
  title: string
  description: string | null
  date: string
  end_date: string | null
  type: 'holiday' | 'event' | 'pta_meeting' | 'exam' | 'field_trip'
  audience: 'all' | 'staff' | 'parents' | 'class' | null
  created_by: string | null
  created_at: string
}

// ── Daily Activities ──

export interface DailyLog {
  id: string
  school_id: string
  student_id: string
  date: string
  logged_by: string | null
}

export interface LogEntry {
  id: string
  log_id: string
  school_id: string
  type: 'meal' | 'nap' | 'activity' | 'mood' | 'note'
  value: string | null
  time: string | null
  photo_url: string | null
  notes: string | null
}

export interface ActivityTemplate {
  id: string
  school_id: string
  name: string
  type: 'meal' | 'nap' | 'activity' | 'mood' | 'note'
  default_options: Record<string, unknown> | null
}

// ── Curriculum ──

export interface LessonPlan {
  id: string
  school_id: string
  class_id: string
  week_start: string
  theme: string | null
  created_by: string | null
  created_at: string
}

export interface PlanActivity {
  id: string
  plan_id: string
  school_id: string
  day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'
  time_slot: string | null
  activity_name: string
  type: 'circle_time' | 'free_play' | 'art' | 'music' | 'outdoor' | 'story' | 'sensory' | null
  description: string | null
  materials_needed: string | null
}

export interface ActivityLibraryItem {
  id: string
  school_id: string
  name: string
  type: string | null
  description: string | null
  materials: string | null
  age_group: string | null
  duration_mins: number | null
  is_default: boolean
}

// ── Health & Safety ──

export interface MedicalRecord {
  id: string
  student_id: string
  school_id: string
  condition: string | null
  medication: string | null
  doctor_name: string | null
  doctor_phone: string | null
  notes: string | null
}

export interface Immunization {
  id: string
  student_id: string
  school_id: string
  vaccine_name: string
  date_given: string | null
  next_due_date: string | null
}

export interface Incident {
  id: string
  school_id: string
  student_id: string
  date: string
  time: string | null
  description: string
  action_taken: string | null
  severity: 'minor' | 'moderate' | 'serious'
  reported_by: string | null
  parent_notified: boolean
  created_at: string
}

// ── Transport ──

export interface Route {
  id: string
  school_id: string
  name: string
  driver_id: string | null
  vehicle_number: string | null
  capacity: number | null
  status: 'active' | 'inactive'
}

export interface RouteStop {
  id: string
  route_id: string
  school_id: string
  stop_name: string
  pickup_time: string | null
  sequence_order: number | null
}

export interface StudentTransport {
  id: string
  student_id: string
  school_id: string
  route_id: string
  stop_id: string | null
  type: 'pickup' | 'drop' | 'both'
}

// ── Meals ──

export interface MealPlan {
  id: string
  school_id: string
  date: string
  meal_type: 'breakfast' | 'lunch' | 'snack'
  menu_items: string
  notes: string | null
}

export interface MealTracking {
  id: string
  school_id: string
  student_id: string
  date: string
  meal_type: 'breakfast' | 'lunch' | 'snack'
  status: 'eaten' | 'skipped' | 'absent'
  notes: string | null
}

// ── Multi-Branch ──

export interface SchoolGroup {
  id: string
  name: string
  owner_id: string
}

export interface SchoolGroupMember {
  group_id: string
  school_id: string
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

export interface StaffWithClass extends StaffProfile {
  class: Class | null
}

export interface LeaveRequestWithStaff extends LeaveRequest {
  staff: StaffProfile
}

export interface InquiryWithAssignee extends Inquiry {
  assignee: Profile | null
}

export interface DailyLogWithEntries extends DailyLog {
  entries: LogEntry[]
  student: Student
}

export interface RouteWithDetails extends Route {
  stops: RouteStop[]
  driver: StaffProfile | null
}

export interface LessonPlanWithActivities extends LessonPlan {
  activities: PlanActivity[]
  class: Class | null
}

export interface IncidentWithStudent extends Incident {
  student: Student
}
