# Planet Studio — Complete School Management System

**Date:** 2026-03-25
**Status:** Approved
**Scope:** Transform Planet Studio from a marketing-only tool into a full school management ERP

---

## Overview

Planet Studio evolves from a marketing material generator into a comprehensive school management system for Kids Planet (and eventually other schools). The system covers admissions, student management, attendance, communication, billing, staff/HR, curriculum, health, transport, meals, reporting, and a parent portal.

**Key Principles:**
- **Simplicity first** — users are not tech-savvy. Big buttons, minimal clicks, no jargon, mobile-friendly.
- **Multi-tenant from day one** — every table has `school_id`, RLS enforces isolation.
- **Modular** — each module is self-contained, built incrementally.
- **Offline-friendly** — designed for low-bandwidth Indian conditions.

---

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Backend:** Supabase (PostgreSQL + Auth + Storage + Realtime + Edge Functions)
- **Auth:** Supabase Auth with email/password. 4 roles: admin, staff, parent, accountant.
- **Payments:** Cash/offline tracking first. Razorpay integration later.
- **Communication:** Email (Resend via Edge Functions) + SMS (Twilio) first. WhatsApp later.
- **Media:** Supabase Storage for photos/documents. Cloudinary later if needed.
- **Export:** PDF generation for receipts/reports. Excel export for data.

---

## User Roles

| Role | Access |
|------|--------|
| **Admin** | Full access to everything. Creates school, invites users. |
| **Staff/Teacher** | Attendance, daily activities, communication, own HR info, curriculum. |
| **Parent** | View-only portal: child's feed, fees, messages, calendar. Limited self-service edits. |
| **Accountant** | Finance module: fee structures, invoices, payments, financial reports. |

---

## Multi-Tenancy

- Every table has `school_id` as a foreign key to `schools` (including child/junction tables).
- **RLS Strategy:** A Supabase custom access token hook (`auth.hook`) injects `school_id` from the `profiles` table into the JWT. All RLS policies then use `school_id = auth.jwt()->>'school_id'`. Fallback: a helper function `get_school_id_for_user(auth.uid())` that queries `profiles` if the hook is not yet configured.
- Users are linked to a school on signup/invite.
- Super-admin role (Phase 4) can switch between schools.
- **Soft deletes:** Tables use `status` fields (active/inactive/withdrawn/resigned) rather than hard deletes. No records are ever permanently deleted from the application layer.
- **Audit:** All tables with financial data (`payments`, `invoices`, `fee_structures`) include `created_by` and `updated_by` fields. Supabase's built-in `auth.audit_log_entries` provides additional auth event tracking.

## Conventions

- **Every table** includes `created_at timestamptz DEFAULT now()` and `updated_at timestamptz DEFAULT now()` with a trigger to auto-update `updated_at` on modification.
- **Every table** includes `school_id uuid FK → schools` for RLS — including child/junction tables.
- **Data backup:** Supabase Point-in-Time Recovery enabled. Monthly full data export to school admin's email as CSV archive.

---

## Database Schema

### Foundation Tables

```sql
schools (
  id uuid PK,
  name text NOT NULL,
  address text,
  phone text,
  email text,
  logo_url text,
  settings jsonb DEFAULT '{}',  -- expected keys: timezone, currency, academic_year_format, working_days[]
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)

academic_years (
  id uuid PK,
  school_id uuid FK → schools,
  name text NOT NULL,            -- e.g. "2026-27"
  start_date date NOT NULL,      -- e.g. 2026-04-01
  end_date date NOT NULL,        -- e.g. 2027-03-31
  is_current boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)

classes (
  id uuid PK,
  school_id uuid FK → schools,
  academic_year_id uuid FK → academic_years,
  name text NOT NULL,            -- e.g. "Nursery", "LKG", "UKG", "Class 1"
  section text,                  -- e.g. "A", "B" (nullable for single-section)
  teacher_id uuid FK → auth.users (nullable),
  capacity int,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)

users → Supabase Auth (built-in)

profiles (
  id uuid PK,
  user_id uuid FK → auth.users,
  school_id uuid FK → schools,
  full_name text NOT NULL,
  phone text,
  avatar_url text,
  roles text[] DEFAULT '{"staff"}',  -- array: user can have multiple roles e.g. {"staff","parent"}
  primary_role text CHECK (primary_role IN ('admin','staff','parent','accountant')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)
```

**Indexes:**
```sql
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_classes_school_year ON classes(school_id, academic_year_id);
```

### Module 1: Students

```sql
students (
  id uuid PK,
  school_id uuid FK → schools,
  class_id uuid FK → classes,        -- references classes table, not free text
  full_name text NOT NULL,
  dob date,
  photo_url text,
  blood_group text,
  enrollment_date date,
  status text CHECK (status IN ('active','alumni','withdrawn')) DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)

guardians (
  id uuid PK,
  school_id uuid FK → schools,
  user_id uuid FK → auth.users (nullable, linked when parent creates account),
  full_name text NOT NULL,
  phone text,
  email text,
  relation text,
  occupation text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)

student_guardians (
  student_id uuid FK → students,
  guardian_id uuid FK → guardians,
  school_id uuid FK → schools,
  is_primary boolean DEFAULT false,   -- per-relationship, not per-guardian
  PRIMARY KEY (student_id, guardian_id)
)

documents (
  id uuid PK,
  student_id uuid FK → students,
  school_id uuid FK → schools,
  type text CHECK (type IN ('birth_cert','aadhaar','photo','medical','other')),
  file_url text NOT NULL,
  uploaded_at timestamptz DEFAULT now()
)

allergies (
  id uuid PK,
  student_id uuid FK → students,
  school_id uuid FK → schools,
  allergy_type text NOT NULL,
  severity text CHECK (severity IN ('mild','moderate','severe')),
  notes text
)
```

**Indexes:**
```sql
CREATE INDEX idx_students_school_class ON students(school_id, class_id);
CREATE INDEX idx_students_status ON students(school_id, status);
CREATE INDEX idx_student_guardians_guardian ON student_guardians(guardian_id);
```

### Module 2: Attendance

Holidays are derived from `events` table (type = 'holiday'). Attendance UI blocks marking on holiday dates.

```sql
attendance (
  id uuid PK,
  school_id uuid FK → schools,
  student_id uuid FK → students,
  date date NOT NULL,
  status text CHECK (status IN ('present','absent','late')) DEFAULT 'present',
  check_in_time timestamptz,
  check_out_time timestamptz,
  marked_by uuid FK → auth.users,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (student_id, date)
)

staff_attendance (
  id uuid PK,
  school_id uuid FK → schools,
  user_id uuid FK → auth.users,
  date date NOT NULL,
  check_in timestamptz,
  check_out timestamptz,
  status text CHECK (status IN ('present','absent','late','leave')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, date)
)
```

**Indexes:**
```sql
CREATE INDEX idx_attendance_school_date ON attendance(school_id, date);
CREATE INDEX idx_staff_attendance_school_date ON staff_attendance(school_id, date);
```

### Module 3: Communication

Phase 1 communication is **outbound-only** (email + SMS). `read_at` tracking is only used after Phase 4 (Parent Portal) when parents can read messages in-app.

```sql
messages (
  id uuid PK,
  school_id uuid FK → schools,
  sender_id uuid FK → auth.users,
  subject text,
  body text NOT NULL,
  type text CHECK (type IN ('announcement','alert','newsletter')),
  audience text CHECK (audience IN ('all','class','individual')),
  audience_filter text, -- class_id or guardian_id for targeted messages
  created_at timestamptz DEFAULT now()
)

message_recipients (
  id uuid PK,
  message_id uuid FK → messages,
  school_id uuid FK → schools,
  guardian_id uuid FK → guardians,
  sent_via text CHECK (sent_via IN ('email','sms')),
  delivered_at timestamptz,
  read_at timestamptz              -- populated only after Phase 4 (Parent Portal)
)

comm_templates (
  id uuid PK,
  school_id uuid FK → schools,
  name text NOT NULL,
  body text NOT NULL,
  type text CHECK (type IN ('fee_reminder','absence_alert','holiday_notice','general'))
)
```

### Module 4: Finance

```sql
fee_structures (
  id uuid PK,
  school_id uuid FK → schools,
  academic_year_id uuid FK → academic_years,  -- fees can change per year
  class_id uuid FK → classes,
  fee_type text CHECK (fee_type IN ('tuition','transport','meals','activity','materials','other')),
  amount decimal NOT NULL,
  frequency text CHECK (frequency IN ('monthly','quarterly','annual')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)

invoices (
  id uuid PK,
  school_id uuid FK → schools,
  student_id uuid FK → students,
  academic_year_id uuid FK → academic_years,
  total_amount decimal NOT NULL,
  due_date date NOT NULL,
  status text CHECK (status IN ('pending','paid','overdue','partial')) DEFAULT 'pending',
  generated_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)

invoice_items (
  id uuid PK,
  invoice_id uuid FK → invoices,
  school_id uuid FK → schools,
  fee_structure_id uuid FK → fee_structures,
  description text NOT NULL,        -- e.g. "Tuition - April 2026"
  amount decimal NOT NULL
)

payments (
  id uuid PK,
  school_id uuid FK → schools,
  invoice_id uuid FK → invoices,
  amount decimal NOT NULL,
  method text CHECK (method IN ('cash','upi','cheque','bank_transfer')),
  received_by uuid FK → auth.users,
  created_by uuid FK → auth.users,
  updated_by uuid FK → auth.users,
  receipt_number text,
  paid_at timestamptz,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)
```

**Indexes:**
```sql
CREATE INDEX idx_invoices_school_status ON invoices(school_id, status);
CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_fee_structures_school_year ON fee_structures(school_id, academic_year_id);
```

### Module 5: Staff/HR

```sql
staff_profiles (
  id uuid PK,
  school_id uuid FK → schools,
  user_id uuid FK → auth.users,
  full_name text NOT NULL,
  phone text,
  designation text CHECK (designation IN ('teacher','assistant','driver','cook','admin','other')),
  class_id uuid FK → classes (nullable),  -- class assignment via FK, not free text
  date_of_joining date,
  salary decimal,
  photo_url text,
  emergency_contact text,
  address text,
  status text CHECK (status IN ('active','resigned')) DEFAULT 'active'
)

staff_documents (
  id uuid PK,
  staff_id uuid FK → staff_profiles,
  school_id uuid FK → schools,
  type text CHECK (type IN ('id_proof','qualification','police_verification','contract','other')),
  file_url text NOT NULL,
  expiry_date date
)

leave_requests (
  id uuid PK,
  school_id uuid FK → schools,
  staff_id uuid FK → staff_profiles,
  leave_type text CHECK (leave_type IN ('casual','sick','earned')),
  from_date date NOT NULL,
  to_date date NOT NULL,
  reason text,
  status text CHECK (status IN ('pending','approved','rejected')) DEFAULT 'pending',
  approved_by uuid FK → auth.users
)
```

### Module 6: Admissions CRM

```sql
inquiries (
  id uuid PK,
  school_id uuid FK → schools,
  parent_name text NOT NULL,
  parent_phone text,
  parent_email text,
  child_name text,
  child_dob date,
  class_sought text,
  source text CHECK (source IN ('website','walkin','referral','social_media','other')),
  status text CHECK (status IN ('new','contacted','visited','enrolled','declined')) DEFAULT 'new',
  notes text,
  follow_up_date date,
  assigned_to uuid FK → auth.users,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)

-- Note: class_sought remains free text here since the inquiry may be for a class
-- that doesn't exist yet or is for the next academic year.
```

**Indexes:**
```sql
CREATE INDEX idx_inquiries_school_status ON inquiries(school_id, status);
```

### Module 7: Calendar

```sql
events (
  id uuid PK,
  school_id uuid FK → schools,
  title text NOT NULL,
  description text,
  date date NOT NULL,
  end_date date,
  type text CHECK (type IN ('holiday','event','pta_meeting','exam','field_trip')),
  audience text CHECK (audience IN ('all','staff','parents','class')),
  created_by uuid FK → auth.users
)
```

### Module 8: Daily Activities

```sql
daily_logs (
  id uuid PK,
  school_id uuid FK → schools,
  student_id uuid FK → students,
  date date NOT NULL,
  logged_by uuid FK → auth.users,
  UNIQUE (student_id, date)
)

log_entries (
  id uuid PK,
  log_id uuid FK → daily_logs,
  school_id uuid FK → schools,
  type text CHECK (type IN ('meal','nap','activity','mood','note')),
  value text,
  time timestamptz,
  photo_url text,
  notes text
)

activity_templates (
  id uuid PK,
  school_id uuid FK → schools,
  name text NOT NULL,
  type text CHECK (type IN ('meal','nap','activity','mood','note')),
  default_options jsonb
)
```

### Module 9: Curriculum

```sql
lesson_plans (
  id uuid PK,
  school_id uuid FK → schools,
  class_id uuid FK → classes,
  week_start date,
  theme text,
  created_by uuid FK → auth.users
)

plan_activities (
  id uuid PK,
  plan_id uuid FK → lesson_plans,
  school_id uuid FK → schools,
  day text CHECK (day IN ('mon','tue','wed','thu','fri','sat')),
  time_slot text,
  activity_name text NOT NULL,
  type text CHECK (type IN ('circle_time','free_play','art','music','outdoor','story','sensory')),
  description text,
  materials_needed text
)

activity_library (
  id uuid PK,
  school_id uuid FK → schools,
  name text NOT NULL,
  type text,
  description text,
  materials text,
  age_group text,
  duration_mins int,
  is_default boolean DEFAULT false
)
```

### Module 10: Health & Safety

```sql
medical_records (
  id uuid PK,
  student_id uuid FK → students,
  school_id uuid FK → schools,
  condition text,
  medication text,
  doctor_name text,
  doctor_phone text,
  notes text
)

immunizations (
  id uuid PK,
  student_id uuid FK → students,
  school_id uuid FK → schools,
  vaccine_name text NOT NULL,
  date_given date,
  next_due_date date
)

incidents (
  id uuid PK,
  school_id uuid FK → schools,
  student_id uuid FK → students,
  date date NOT NULL,
  time timestamptz,
  description text NOT NULL,
  action_taken text,
  severity text CHECK (severity IN ('minor','moderate','serious')),
  reported_by uuid FK → auth.users,
  parent_notified boolean DEFAULT false
)
```

### Module 11: Transport

```sql
routes (
  id uuid PK,
  school_id uuid FK → schools,
  name text NOT NULL,
  driver_id uuid FK → staff_profiles,
  vehicle_number text,
  capacity int,
  status text CHECK (status IN ('active','inactive')) DEFAULT 'active'
)

route_stops (
  id uuid PK,
  route_id uuid FK → routes,
  school_id uuid FK → schools,
  stop_name text NOT NULL,
  pickup_time time,
  sequence_order int
)

student_transport (
  id uuid PK,
  student_id uuid FK → students,
  school_id uuid FK → schools,
  route_id uuid FK → routes,
  stop_id uuid FK → route_stops,
  type text CHECK (type IN ('pickup','drop','both')) DEFAULT 'both'
)
```

### Module 12: Meals

```sql
meal_plans (
  id uuid PK,
  school_id uuid FK → schools,
  date date NOT NULL,
  meal_type text CHECK (meal_type IN ('breakfast','lunch','snack')),
  menu_items text NOT NULL,
  notes text
)

meal_tracking (
  id uuid PK,
  school_id uuid FK → schools,
  student_id uuid FK → students,
  date date NOT NULL,
  meal_type text CHECK (meal_type IN ('breakfast','lunch','snack')),
  status text CHECK (status IN ('eaten','skipped','absent')),
  notes text
)
```

### Phase 4: Multi-Branch

```sql
school_groups (
  id uuid PK,
  name text NOT NULL,
  owner_id uuid FK → auth.users
)

school_group_members (
  group_id uuid FK → school_groups,
  school_id uuid FK → schools,
  PRIMARY KEY (group_id, school_id)
)
```

---

## UI Design Principles

1. **Mobile-first** — most staff will use phones/tablets.
2. **Big tap targets** — minimum 44px touch targets everywhere.
3. **Minimal navigation depth** — max 2 taps to reach any action.
4. **Visual over text** — use photos, color badges, icons over paragraphs.
5. **Smart defaults** — "Mark all present" then uncheck exceptions, not the reverse.
6. **Batch operations** — log meals for entire class at once, not one-by-one.
7. **Familiar patterns** — should feel like WhatsApp or Google Pay, not enterprise software.
8. **Hindi-ready** — text in UI should be translatable (i18n structure from start).

---

## Module UI Summaries

### Students
- List with photo thumbnails, class filter, search
- Profile: single scrollable page with tabs (Info, Family, Documents, Health)
- Add: step-by-step wizard

### Attendance
- Today's class → grid of student photos → tap present/absent
- "Mark all present" button
- Summary bar: "22/25 present"
- Calendar history view

### Communication
- Compose: pick audience → write → send
- Quick templates (fee reminder, absence alert, holiday notice)
- Sent messages list with delivery status

### Finance
- Big outstanding amount number
- Student-wise paid/unpaid list
- Record payment: tap student → amount → method → done
- Auto-generate monthly invoices
- Printable receipts

### Staff/HR
- Staff list with designation filter
- Leave requests: submit → approve/reject with one tap
- Dashboard: who's on leave, expiring documents

### Admissions CRM
- Kanban board (New → Contacted → Visited → Enrolled)
- Fallback list view for simplicity
- "Convert to student" button
- Follow-up date reminders

### Calendar
- Month view with colored dots
- Tap date → see/add events
- Upcoming events on dashboard

### Daily Activities
- Select class → student list → tap student → quick-log buttons
- Batch mode for class-wide logging
- "Send daily report" to parents at end of day

### Curriculum
- Weekly grid: Mon-Sat rows, time slot columns
- Drag from activity library or type custom
- Pre-loaded 50+ activity templates
- Print as PDF

### Health & Safety
- Health tab on student profile
- Class view with allergy badges
- Quick incident logging with parent notification
- Immunization tracker with due/overdue highlights

### Transport
- Route list → stops → assigned students
- Printable driver sheets
- Simple assignment: student → route → stop

### Meals
- Weekly menu grid
- Allergy conflict warnings
- Class-wide tracking with batch checkboxes
- Printable menu

### Reports
- Dashboard KPIs: students, attendance %, fee collection, inquiries, leave
- Pre-built reports: attendance by class, financial summary, admissions funnel, class strength
- Export as PDF or Excel

### Parent Portal
- Home feed: today's activities, photos, meals
- Attendance calendar (green/red dots)
- Fee status + payment history + receipts
- Messages from school
- School calendar
- Edit own contact info

---

## Project Structure

```
dashboard/src/
  app/
    (auth)/
      login/page.tsx
      signup/page.tsx
      invite/[token]/page.tsx
    (dashboard)/
      layout.tsx              — sidebar nav, role-based menu
      page.tsx                — dashboard home with KPIs
      students/
        page.tsx              — student list
        [id]/page.tsx         — student profile
        new/page.tsx          — add student wizard
      attendance/
        page.tsx              — daily attendance marking
      communication/
        page.tsx              — compose + sent messages
      finance/
        page.tsx              — overview + student-wise fees
        fee-structure/page.tsx
      staff/
        page.tsx              — staff list
        [id]/page.tsx         — staff profile
        leave/page.tsx        — leave management
      admissions/
        page.tsx              — CRM pipeline
      calendar/
        page.tsx              — school calendar
      daily-activities/
        page.tsx              — daily logging
      curriculum/
        page.tsx              — lesson plans
        library/page.tsx      — activity library
      health/
        page.tsx              — health overview
        incidents/page.tsx
      transport/
        page.tsx              — routes and assignments
      meals/
        page.tsx              — menu planning + tracking
      reports/
        page.tsx              — reports hub
      parent/
        page.tsx              — parent portal home
      content-studio/         — (existing marketing studio)
        page.tsx
        [templateId]/page.tsx
  components/
    shared/
      DataTable.tsx
      FormField.tsx
      StatusBadge.tsx
      StatCard.tsx
      Modal.tsx
      FileUpload.tsx
      RoleGuard.tsx
      PageHeader.tsx
    students/
    attendance/
    communication/
    finance/
    staff/
    admissions/
    calendar/
    daily-activities/
    curriculum/
    health/
    transport/
    meals/
    reports/
    parent/
  lib/
    supabase/
      client.ts             — browser client
      server.ts             — server client
      middleware.ts          — auth + role checking
      admin.ts              — service role client
    hooks/
      useAuth.ts
      useSchool.ts
      useStudents.ts
      useAttendance.ts
      ... (one per module)
    types/
      index.ts              — all TypeScript interfaces
    utils/
      formatters.ts         — date, currency, phone formatting
      validators.ts         — form validation
      pdf.ts                — PDF generation helpers
```

---

## Implementation Phases

### Phase 1: Core (Build First)
1. Foundation: Supabase setup, auth, multi-tenant middleware, shared components
2. Students module
3. Attendance module
4. Communication module (email + SMS)
5. Finance module (cash tracking)

### Phase 2: Operations
6. Staff/HR module
7. Admissions CRM
8. Calendar
9. Daily Activities

### Phase 3: Advanced
10. Curriculum
11. Health & Safety
12. Transport
13. Meals
14. Reports & Analytics

### Phase 4: Polish
15. Parent Portal (role-based views)
16. Multi-branch support
17. PWA + push notifications
18. Razorpay integration (when ready)
19. WhatsApp integration (when ready)

---

## Integration Points (Future)

- **Razorpay MCP** — online payments when ready
- **Twilio MCP** — SMS delivery
- **Resend** — email delivery via Supabase Edge Functions
- **Supabase MCP** — database operations
- **Cloudinary MCP** — media management if storage needs grow
- **WhatsApp Business API** — parent communication when ready
- **Google Calendar MCP** — calendar sync
- **Excel MCP** — report generation
