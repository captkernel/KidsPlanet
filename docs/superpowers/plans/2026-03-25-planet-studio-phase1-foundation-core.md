# Planet Studio Phase 1: Foundation + Core Modules

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up Supabase backend with auth and multi-tenancy, then build the 4 core modules (Students, Attendance, Communication, Finance) replacing the existing mock data pages.

**Architecture:** Next.js 16 App Router with Supabase (PostgreSQL + Auth + Storage). Existing dashboard pages already have functional UI with mock data — we replace the mock data layer with Supabase queries while preserving/enhancing the existing UI. Route groups `(auth)/` and `(dashboard)/` provide layout separation. Server Components for data fetching, Client Components only for interactivity.

**Tech Stack:** Next.js 16.2.1, React 19, TypeScript, Tailwind CSS 4, Supabase JS v2 (`@supabase/supabase-js`, `@supabase/ssr`), Lucide React icons.

**Spec:** `docs/superpowers/specs/2026-03-25-planet-studio-school-management-design.md`

**Existing Codebase Context:**
- Dashboard lives at `dashboard/` — a Next.js app with Tailwind CSS 4
- Pages exist at `src/app/students/page.tsx`, `src/app/attendance/page.tsx`, etc. — all use mock data from `src/data/*.ts`
- Sidebar at `src/components/Sidebar.tsx`, nav config at `src/lib/constants.ts`
- No Supabase, no auth, no middleware, no `.env`, no tests currently
- Brand colors defined in `src/app/globals.css` as CSS custom properties
- Font: Plus Jakarta Sans (Google Fonts), loaded via `--font-sans` CSS variable
- **Platform:** Windows 10 — use PowerShell-compatible commands for file moves (no bash `for` loops with parentheses)

**Deferred to Phase 2:**
- Staff attendance UI (tables created in Phase 1, UI in Phase 2 Staff/HR module)
- Holiday blocking in attendance (depends on `events` table from Phase 2 Calendar module)
- i18n translations (structure prepared in Phase 1, actual Hindi translations in Phase 4)

---

## File Map

### New Files to Create

```
dashboard/
  .env.local                          — Supabase keys (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
  middleware.ts                       — Auth middleware: redirect unauthenticated users to /login
  src/
    lib/
      supabase/
        client.ts                     — Browser Supabase client (createBrowserClient)
        server.ts                     — Server Supabase client (createServerClient)
        middleware.ts                 — Supabase middleware helper (updateSession)
        admin.ts                      — Service role client for admin operations
      types/
        database.ts                   — TypeScript types generated from Supabase schema
      hooks/
        useAuth.ts                    — Auth context hook (current user, school, roles)
      utils/
        formatters.ts                 — Date, currency (₹), phone formatters
    app/
      (auth)/
        layout.tsx                    — Minimal layout for auth pages (no sidebar)
        login/page.tsx                — Email/password login
        signup/page.tsx               — Admin school setup + first user creation
      (dashboard)/
        layout.tsx                    — Authenticated layout with Sidebar + role guard
        page.tsx                      — Dashboard home (replace mock data with DB queries)
        students/
          page.tsx                    — Student list (replace mock data)
          [id]/page.tsx               — Student profile with tabs
          new/page.tsx                — Add student wizard
        attendance/
          page.tsx                    — Daily attendance marking (replace mock)
        communication/
          page.tsx                    — Compose + sent messages (replace mock)
        finance/
          page.tsx                    — Fee overview + payments (replace mock)
          fee-structure/page.tsx      — Fee structure management
    components/
      shared/
        DataTable.tsx                 — Reusable sortable/filterable table
        FormField.tsx                 — Form input wrapper (label + input + error)
        StatusBadge.tsx               — Colored status pill
        Modal.tsx                     — Dialog/drawer component
        FileUpload.tsx                — Supabase Storage upload wrapper
        RoleGuard.tsx                 — Conditional render by user role
      auth/
        AuthProvider.tsx              — React context for auth state
        LoginForm.tsx                 — Login form component
        SchoolSetupForm.tsx           — Initial school creation form
      students/
        StudentCard.tsx               — Student list item with photo
        StudentForm.tsx               — Add/edit student form
        GuardianForm.tsx              — Add/edit guardian form
      attendance/
        AttendanceGrid.tsx            — Photo grid with tap-to-toggle
        AttendanceSummary.tsx         — Stats bar (present/absent/late counts)
      communication/
        ComposeMessage.tsx            — Message composer with audience picker
        MessageList.tsx               — Sent messages with delivery status
      finance/
        PaymentForm.tsx               — Record cash payment form
        InvoiceList.tsx               — Student-wise invoice list
        ReceiptView.tsx               — Printable receipt component
  supabase/
    migrations/
      001_foundation.sql              — schools, academic_years, classes, profiles tables + RLS
      002_students.sql                — students, guardians, student_guardians, documents, allergies + RLS
      003_attendance.sql              — attendance, staff_attendance + RLS
      004_communication.sql           — messages, message_recipients, comm_templates + RLS
      005_finance.sql                 — fee_structures, invoices, invoice_items, payments + RLS
      006_seed.sql                    — Seed data for Kids Planet (school, classes, academic year)
```

### Existing Files to Modify

```
dashboard/
  package.json                        — Add @supabase/supabase-js, @supabase/ssr
  next.config.ts                      — Add Supabase image domain
  src/
    app/
      layout.tsx                      — Wrap with AuthProvider, restructure for route groups
      globals.css                     — No changes needed (theme is good)
    components/
      Sidebar.tsx                     — Add role-based menu filtering, user from auth context
      PageHeader.tsx                  — No changes needed
      StatCard.tsx                    — No changes needed
    lib/
      constants.ts                    — Add role-based nav config
```

---

## Task 1: Install Supabase Dependencies

**Files:**
- Modify: `dashboard/package.json`
- Create: `dashboard/.env.local`

- [ ] **Step 1: Install Supabase packages**

```bash
cd dashboard && npm install @supabase/supabase-js @supabase/ssr
```

- [ ] **Step 2: Create .env.local with placeholder keys**

Create `dashboard/.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

> **Note:** The developer must create a Supabase project at https://supabase.com/dashboard and replace these values. The app will not function until real keys are provided.

- [ ] **Step 3: Ensure .env.local is gitignored**

Verify `dashboard/.gitignore` contains `.env.local`. If not, add it. This file contains secrets and must NEVER be committed.

- [ ] **Step 4: Add Supabase image domain to next.config.ts**

Modify `dashboard/next.config.ts`:
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 5: Commit**

```bash
cd /d/Karan/KidsPlanet && git add dashboard/package.json dashboard/package-lock.json dashboard/next.config.ts dashboard/.gitignore
git commit -m "feat: install Supabase dependencies and configure environment"
```

> **Important:** All git commands run from the repo root (`D:/Karan/KidsPlanet/`), NOT from `dashboard/`. Prefix all paths with `dashboard/`.

---

## Task 2: Supabase Client Setup

**Files:**
- Create: `dashboard/src/lib/supabase/client.ts`
- Create: `dashboard/src/lib/supabase/server.ts`
- Create: `dashboard/src/lib/supabase/middleware.ts`
- Create: `dashboard/src/lib/supabase/admin.ts`
- Create: `dashboard/middleware.ts`

- [ ] **Step 1: Create browser client**

Create `dashboard/src/lib/supabase/client.ts`:
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 2: Create server client**

Create `dashboard/src/lib/supabase/server.ts`:
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from Server Component — ignore
          }
        },
      },
    }
  )
}
```

- [ ] **Step 3: Create middleware helper**

Create `dashboard/src/lib/supabase/middleware.ts`:
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Unauthenticated users trying to access dashboard → redirect to login
  if (!user && !request.nextUrl.pathname.startsWith('/login') && !request.nextUrl.pathname.startsWith('/signup')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Authenticated users on auth pages → redirect to dashboard
  if (user && (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup'))) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
```

- [ ] **Step 4: Create root middleware**

Create `dashboard/middleware.ts`:
```typescript
import { updateSession } from '@/lib/supabase/middleware'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    // Match all routes except static files, images, favicon
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

- [ ] **Step 5: Create admin client**

Create `dashboard/src/lib/supabase/admin.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

// Service role client — use ONLY in server-side code (API routes, server actions)
// Bypasses RLS — use with caution
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
```

- [ ] **Step 6: Verify the app still builds**

```bash
cd dashboard && npm run build
```

Expected: Build succeeds (middleware won't run during build).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add Supabase client setup and auth middleware"
```

---

## Task 3: Database Migrations — Foundation Tables

**Files:**
- Create: `dashboard/supabase/migrations/001_foundation.sql`

- [ ] **Step 1: Write foundation migration**

Create `dashboard/supabase/migrations/001_foundation.sql`:
```sql
-- =============================================================
-- Foundation: schools, academic_years, classes, profiles
-- =============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Updated-at trigger function (reused across all tables)
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------
-- Schools
-- -----------------------------------------------------------
CREATE TABLE schools (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  address text,
  phone text,
  email text,
  logo_url text,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER schools_updated_at
  BEFORE UPDATE ON schools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- -----------------------------------------------------------
-- Academic Years
-- -----------------------------------------------------------
CREATE TABLE academic_years (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_current boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX idx_academic_years_current
  ON academic_years(school_id) WHERE is_current = true;

CREATE TRIGGER academic_years_updated_at
  BEFORE UPDATE ON academic_years
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- -----------------------------------------------------------
-- Profiles (extends Supabase auth.users)
-- -----------------------------------------------------------
CREATE TABLE profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  avatar_url text,
  roles text[] DEFAULT '{staff}',
  primary_role text NOT NULL CHECK (primary_role IN ('admin', 'staff', 'parent', 'accountant')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_school_id ON profiles(school_id);
CREATE UNIQUE INDEX idx_profiles_user_school ON profiles(user_id, school_id);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- -----------------------------------------------------------
-- Classes
-- -----------------------------------------------------------
CREATE TABLE classes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  academic_year_id uuid NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  name text NOT NULL,
  section text,
  teacher_id uuid REFERENCES auth.users(id),
  capacity int,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_classes_school_year ON classes(school_id, academic_year_id);

CREATE TRIGGER classes_updated_at
  BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- -----------------------------------------------------------
-- Helper function for RLS
-- -----------------------------------------------------------
CREATE OR REPLACE FUNCTION get_user_school_id()
RETURNS uuid AS $$
  SELECT school_id FROM profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- -----------------------------------------------------------
-- Role-checking helper function
-- -----------------------------------------------------------
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS text AS $$
  SELECT primary_role FROM profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION user_has_role(required_roles text[])
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND roles && required_roles  -- array overlap operator
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- -----------------------------------------------------------
-- RLS Policies
-- -----------------------------------------------------------
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Schools: authenticated users can INSERT (needed for signup bootstrapping)
CREATE POLICY "Authenticated users can create schools"
  ON schools FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view own school"
  ON schools FOR SELECT
  USING (id = get_user_school_id());

CREATE POLICY "Admins can update own school"
  ON schools FOR UPDATE
  USING (id = get_user_school_id()
    AND user_has_role(ARRAY['admin']));

-- Academic years: anyone authenticated can INSERT (for signup), admins can manage
CREATE POLICY "Authenticated users can create academic years"
  ON academic_years FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "School members can view academic years"
  ON academic_years FOR SELECT
  USING (school_id = get_user_school_id());

CREATE POLICY "Admins can update/delete academic years"
  ON academic_years FOR UPDATE
  USING (school_id = get_user_school_id()
    AND user_has_role(ARRAY['admin']));

CREATE POLICY "Admins can delete academic years"
  ON academic_years FOR DELETE
  USING (school_id = get_user_school_id()
    AND user_has_role(ARRAY['admin']));

-- Profiles: users can INSERT their own (signup), read school profiles, update own
CREATE POLICY "Users can create own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "School members can view profiles"
  ON profiles FOR SELECT
  USING (school_id = get_user_school_id());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (user_id = auth.uid());

-- Classes: anyone authenticated can INSERT (for signup), admins manage
CREATE POLICY "Authenticated users can create classes"
  ON classes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "School members can view classes"
  ON classes FOR SELECT
  USING (school_id = get_user_school_id());

CREATE POLICY "Admins can update classes"
  ON classes FOR UPDATE
  USING (school_id = get_user_school_id()
    AND user_has_role(ARRAY['admin']));

CREATE POLICY "Admins can delete classes"
  ON classes FOR DELETE
  USING (school_id = get_user_school_id()
    AND user_has_role(ARRAY['admin']));
```

- [ ] **Step 2: Commit**

```bash
git add supabase/
git commit -m "feat: add foundation database migration (schools, profiles, classes, RLS)"
```

---

## Task 4: Database Migrations — Students Module

**Files:**
- Create: `dashboard/supabase/migrations/002_students.sql`

- [ ] **Step 1: Write students migration**

Create `dashboard/supabase/migrations/002_students.sql`:
```sql
-- =============================================================
-- Students: students, guardians, student_guardians, documents, allergies
-- =============================================================

CREATE TABLE students (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  class_id uuid REFERENCES classes(id),
  full_name text NOT NULL,
  dob date,
  photo_url text,
  blood_group text,
  enrollment_date date,
  status text DEFAULT 'active' CHECK (status IN ('active', 'alumni', 'withdrawn')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_students_school_class ON students(school_id, class_id);
CREATE INDEX idx_students_status ON students(school_id, status);

CREATE TRIGGER students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- -----------------------------------------------------------
CREATE TABLE guardians (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  full_name text NOT NULL,
  phone text,
  email text,
  relation text,
  occupation text,
  address text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_guardians_school ON guardians(school_id);
CREATE INDEX idx_guardians_user ON guardians(user_id) WHERE user_id IS NOT NULL;

CREATE TRIGGER guardians_updated_at
  BEFORE UPDATE ON guardians
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- -----------------------------------------------------------
CREATE TABLE student_guardians (
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  guardian_id uuid NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  is_primary boolean DEFAULT false,
  PRIMARY KEY (student_id, guardian_id)
);

CREATE INDEX idx_student_guardians_guardian ON student_guardians(guardian_id);

-- -----------------------------------------------------------
CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('birth_cert', 'aadhaar', 'photo', 'medical', 'other')),
  file_url text NOT NULL,
  uploaded_at timestamptz DEFAULT now()
);

-- -----------------------------------------------------------
CREATE TABLE allergies (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  allergy_type text NOT NULL,
  severity text CHECK (severity IN ('mild', 'moderate', 'severe')),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- -----------------------------------------------------------
-- RLS
-- -----------------------------------------------------------
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School members can view students"
  ON students FOR SELECT
  USING (school_id = get_user_school_id());

CREATE POLICY "Admins/staff can insert students"
  ON students FOR INSERT
  WITH CHECK (school_id = get_user_school_id()
    AND user_has_role(ARRAY['admin', 'staff']));

CREATE POLICY "Admins/staff can update students"
  ON students FOR UPDATE
  USING (school_id = get_user_school_id()
    AND user_has_role(ARRAY['admin', 'staff']));

CREATE POLICY "Admins can delete students"
  ON students FOR DELETE
  USING (school_id = get_user_school_id()
    AND user_has_role(ARRAY['admin']));

CREATE POLICY "School members can view guardians"
  ON guardians FOR SELECT
  USING (school_id = get_user_school_id());

CREATE POLICY "Admins/staff can manage guardians"
  ON guardians FOR INSERT
  WITH CHECK (school_id = get_user_school_id()
    AND user_has_role(ARRAY['admin', 'staff']));

CREATE POLICY "Admins/staff can update guardians"
  ON guardians FOR UPDATE
  USING (school_id = get_user_school_id()
    AND user_has_role(ARRAY['admin', 'staff']));

CREATE POLICY "School members can view student_guardians"
  ON student_guardians FOR SELECT
  USING (school_id = get_user_school_id());

CREATE POLICY "Admins/staff can manage student_guardians"
  ON student_guardians FOR INSERT
  WITH CHECK (school_id = get_user_school_id()
    AND user_has_role(ARRAY['admin', 'staff']));

CREATE POLICY "School members can view documents"
  ON documents FOR SELECT
  USING (school_id = get_user_school_id());

CREATE POLICY "Admins/staff can manage documents"
  ON documents FOR INSERT
  WITH CHECK (school_id = get_user_school_id()
    AND user_has_role(ARRAY['admin', 'staff']));

CREATE POLICY "School members can view allergies"
  ON allergies FOR SELECT
  USING (school_id = get_user_school_id());

CREATE POLICY "Admins/staff can manage allergies"
  ON allergies FOR INSERT
  WITH CHECK (school_id = get_user_school_id()
    AND user_has_role(ARRAY['admin', 'staff']));
```

- [ ] **Step 2: Commit**

```bash
git add supabase/
git commit -m "feat: add students database migration (students, guardians, documents, allergies)"
```

---

## Task 5: Database Migrations — Attendance, Communication, Finance

**Files:**
- Create: `dashboard/supabase/migrations/003_attendance.sql`
- Create: `dashboard/supabase/migrations/004_communication.sql`
- Create: `dashboard/supabase/migrations/005_finance.sql`

- [ ] **Step 1: Write attendance migration**

Create `dashboard/supabase/migrations/003_attendance.sql`:
```sql
-- =============================================================
-- Attendance
-- =============================================================

CREATE TABLE attendance (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date date NOT NULL,
  status text DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late')),
  check_in_time timestamptz,
  check_out_time timestamptz,
  marked_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (student_id, date)
);

CREATE INDEX idx_attendance_school_date ON attendance(school_id, date);

CREATE TRIGGER attendance_updated_at
  BEFORE UPDATE ON attendance
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- -----------------------------------------------------------
CREATE TABLE staff_attendance (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  check_in timestamptz,
  check_out timestamptz,
  status text CHECK (status IN ('present', 'absent', 'late', 'leave')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, date)
);

CREATE INDEX idx_staff_attendance_school_date ON staff_attendance(school_id, date);

CREATE TRIGGER staff_attendance_updated_at
  BEFORE UPDATE ON staff_attendance
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- -----------------------------------------------------------
-- RLS
-- -----------------------------------------------------------
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School members can view attendance"
  ON attendance FOR SELECT
  USING (school_id = get_user_school_id());

CREATE POLICY "Admins/staff can mark attendance"
  ON attendance FOR INSERT
  WITH CHECK (school_id = get_user_school_id()
    AND user_has_role(ARRAY['admin', 'staff']));

CREATE POLICY "Admins/staff can update attendance"
  ON attendance FOR UPDATE
  USING (school_id = get_user_school_id()
    AND user_has_role(ARRAY['admin', 'staff']));

CREATE POLICY "School members can view staff attendance"
  ON staff_attendance FOR SELECT
  USING (school_id = get_user_school_id());

CREATE POLICY "Admins can manage staff attendance"
  ON staff_attendance FOR INSERT
  WITH CHECK (school_id = get_user_school_id()
    AND user_has_role(ARRAY['admin']));

CREATE POLICY "Admins can update staff attendance"
  ON staff_attendance FOR UPDATE
  USING (school_id = get_user_school_id()
    AND user_has_role(ARRAY['admin']));
```

- [ ] **Step 2: Write communication migration**

Create `dashboard/supabase/migrations/004_communication.sql`:
```sql
-- =============================================================
-- Communication: messages, recipients, templates
-- =============================================================

CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id),
  subject text,
  body text NOT NULL,
  type text NOT NULL CHECK (type IN ('announcement', 'alert', 'newsletter')),
  audience text NOT NULL CHECK (audience IN ('all', 'class', 'individual')),
  audience_filter text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_messages_school ON messages(school_id);

-- -----------------------------------------------------------
CREATE TABLE message_recipients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  guardian_id uuid NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
  sent_via text CHECK (sent_via IN ('email', 'sms')),
  delivered_at timestamptz,
  read_at timestamptz
);

CREATE INDEX idx_message_recipients_message ON message_recipients(message_id);

-- -----------------------------------------------------------
CREATE TABLE comm_templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  body text NOT NULL,
  type text NOT NULL CHECK (type IN ('fee_reminder', 'absence_alert', 'holiday_notice', 'general')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER comm_templates_updated_at
  BEFORE UPDATE ON comm_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- -----------------------------------------------------------
-- RLS
-- -----------------------------------------------------------
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE comm_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School members can view messages"
  ON messages FOR SELECT
  USING (school_id = get_user_school_id());

CREATE POLICY "Admins/staff can create messages"
  ON messages FOR INSERT
  WITH CHECK (school_id = get_user_school_id()
    AND user_has_role(ARRAY['admin', 'staff']));

CREATE POLICY "School members can view recipients"
  ON message_recipients FOR SELECT
  USING (school_id = get_user_school_id());

CREATE POLICY "Admins/staff can create recipients"
  ON message_recipients FOR INSERT
  WITH CHECK (school_id = get_user_school_id()
    AND user_has_role(ARRAY['admin', 'staff']));

CREATE POLICY "School members can view comm templates"
  ON comm_templates FOR SELECT
  USING (school_id = get_user_school_id());

-- Authenticated INSERT for comm_templates (needed during signup)
CREATE POLICY "Authenticated users can create comm templates"
  ON comm_templates FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update comm templates"
  ON comm_templates FOR UPDATE
  USING (school_id = get_user_school_id()
    AND user_has_role(ARRAY['admin']));
```

- [ ] **Step 3: Write finance migration**

Create `dashboard/supabase/migrations/005_finance.sql`:
```sql
-- =============================================================
-- Finance: fee_structures, invoices, invoice_items, payments
-- =============================================================

CREATE TABLE fee_structures (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  academic_year_id uuid NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  fee_type text NOT NULL CHECK (fee_type IN ('tuition', 'transport', 'meals', 'activity', 'materials', 'other')),
  amount decimal NOT NULL,
  frequency text NOT NULL CHECK (frequency IN ('monthly', 'quarterly', 'annual')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_fee_structures_school_year ON fee_structures(school_id, academic_year_id);

CREATE TRIGGER fee_structures_updated_at
  BEFORE UPDATE ON fee_structures
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- -----------------------------------------------------------
CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  academic_year_id uuid NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  total_amount decimal NOT NULL,
  due_date date NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'partial')),
  generated_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_invoices_school_status ON invoices(school_id, status);
CREATE INDEX idx_invoices_student ON invoices(student_id);

CREATE TRIGGER invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- -----------------------------------------------------------
CREATE TABLE invoice_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  fee_structure_id uuid REFERENCES fee_structures(id),
  description text NOT NULL,
  amount decimal NOT NULL
);

-- -----------------------------------------------------------
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  amount decimal NOT NULL,
  method text NOT NULL CHECK (method IN ('cash', 'upi', 'cheque', 'bank_transfer')),
  received_by uuid REFERENCES auth.users(id),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id),
  receipt_number text,
  paid_at timestamptz DEFAULT now(),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_payments_invoice ON payments(invoice_id);

CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- -----------------------------------------------------------
-- Auto-generate receipt numbers
-- -----------------------------------------------------------
CREATE OR REPLACE FUNCTION generate_receipt_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.receipt_number IS NULL THEN
    NEW.receipt_number := 'RCP-' || to_char(now(), 'YYYYMMDD') || '-' || substring(NEW.id::text, 1, 8);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER payments_receipt_number
  BEFORE INSERT ON payments
  FOR EACH ROW EXECUTE FUNCTION generate_receipt_number();

-- -----------------------------------------------------------
-- RLS
-- -----------------------------------------------------------
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School members can view fee structures"
  ON fee_structures FOR SELECT
  USING (school_id = get_user_school_id());

CREATE POLICY "Admins/accountants can create fee structures"
  ON fee_structures FOR INSERT
  WITH CHECK (school_id = get_user_school_id()
    AND user_has_role(ARRAY['admin', 'accountant']));

CREATE POLICY "Admins/accountants can update fee structures"
  ON fee_structures FOR UPDATE
  USING (school_id = get_user_school_id()
    AND user_has_role(ARRAY['admin', 'accountant']));

CREATE POLICY "School members can view invoices"
  ON invoices FOR SELECT
  USING (school_id = get_user_school_id());

CREATE POLICY "Admins/accountants can create invoices"
  ON invoices FOR INSERT
  WITH CHECK (school_id = get_user_school_id()
    AND user_has_role(ARRAY['admin', 'accountant']));

CREATE POLICY "Admins/accountants can update invoices"
  ON invoices FOR UPDATE
  USING (school_id = get_user_school_id()
    AND user_has_role(ARRAY['admin', 'accountant']));

CREATE POLICY "School members can view invoice items"
  ON invoice_items FOR SELECT
  USING (school_id = get_user_school_id());

CREATE POLICY "Admins/accountants can create invoice items"
  ON invoice_items FOR INSERT
  WITH CHECK (school_id = get_user_school_id()
    AND user_has_role(ARRAY['admin', 'accountant']));

CREATE POLICY "School members can view payments"
  ON payments FOR SELECT
  USING (school_id = get_user_school_id());

CREATE POLICY "Admins/accountants can create payments"
  ON payments FOR INSERT
  WITH CHECK (school_id = get_user_school_id()
    AND user_has_role(ARRAY['admin', 'accountant']));

CREATE POLICY "Admins/accountants can update payments"
  ON payments FOR UPDATE
  USING (school_id = get_user_school_id()
    AND user_has_role(ARRAY['admin', 'accountant']));
```

- [ ] **Step 4: Commit**

```bash
git add supabase/
git commit -m "feat: add attendance, communication, and finance database migrations"
```

---

## Task 6: Apply Migrations to Supabase

> **Note:** Seed data (school, classes, academic year, comm templates) is created programmatically during the signup flow (Task 8). No separate seed migration is needed.

- [ ] **Step 1: Apply migrations to Supabase**

Go to your Supabase project dashboard → SQL Editor. Run each migration file in order:
1. `001_foundation.sql`
2. `002_students.sql`
3. `003_attendance.sql`
4. `004_communication.sql`
5. `005_finance.sql`

Alternatively, if Supabase CLI is installed:
```bash
cd /d/Karan/KidsPlanet/dashboard && npx supabase db push
```

- [ ] **Step 2: Verify tables exist**

In Supabase dashboard → Table Editor, confirm all tables are created with RLS enabled.

- [ ] **Step 3: Commit migrations**

```bash
cd /d/Karan/KidsPlanet && git add dashboard/supabase/
git commit -m "feat: add all Phase 1 database migrations (foundation, students, attendance, comm, finance)"
```

---

## Task 7: TypeScript Types & Utility Functions

**Files:**
- Create: `dashboard/src/lib/types/database.ts`
- Create: `dashboard/src/lib/utils/formatters.ts`

- [ ] **Step 1: Create database types**

Create `dashboard/src/lib/types/database.ts`:
```typescript
// TypeScript types matching the Supabase schema
// In production, generate these with: npx supabase gen types typescript

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
```

- [ ] **Step 2: Create formatters**

Create `dashboard/src/lib/utils/formatters.ts`:
```typescript
// Currency formatter for Indian Rupees
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Date formatters
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(date))
}

export function formatTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date))
}

// Get today's date as YYYY-MM-DD string
export function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

// Phone formatter (Indian)
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`
  }
  return phone
}

// Initials from full name (for avatars)
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Percentage with 1 decimal
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/types/ src/lib/utils/
git commit -m "feat: add TypeScript database types and utility formatters"
```

---

## Task 8: Auth Provider & Login/Signup Pages

**Files:**
- Create: `dashboard/src/components/auth/AuthProvider.tsx`
- Create: `dashboard/src/lib/hooks/useAuth.ts`
- Create: `dashboard/src/app/(auth)/layout.tsx`
- Create: `dashboard/src/app/(auth)/login/page.tsx`
- Create: `dashboard/src/app/(auth)/signup/page.tsx`

- [ ] **Step 1: Create AuthProvider context**

Create `dashboard/src/components/auth/AuthProvider.tsx`:
```typescript
'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { Profile, School } from '@/lib/types/database'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  school: School | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  school: null,
  loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [school, setSchool] = useState<School | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    const getSession = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (profileData) {
          setProfile(profileData)

          // Fetch school
          const { data: schoolData } = await supabase
            .from('schools')
            .select('*')
            .eq('id', profileData.school_id)
            .single()

          setSchool(schoolData)
        }
      }

      setLoading(false)
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        if (!session?.user) {
          setProfile(null)
          setSchool(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setSchool(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, school, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

- [ ] **Step 2: Create useAuth hook re-export**

Create `dashboard/src/lib/hooks/useAuth.ts`:
```typescript
export { useAuth } from '@/components/auth/AuthProvider'
```

- [ ] **Step 3: Create auth layout (no sidebar)**

Create `dashboard/src/app/(auth)/layout.tsx`:
```typescript
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-cream flex items-center justify-center p-4">
      {children}
    </div>
  )
}
```

- [ ] **Step 4: Create login page**

Create `dashboard/src/app/(auth)/login/page.tsx`:
```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl font-bold">PS</span>
        </div>
        <h1 className="text-2xl font-bold text-text">Planet Studio</h1>
        <p className="text-text-muted mt-1">Sign in to your school dashboard</p>
      </div>

      <form onSubmit={handleLogin} className="card space-y-4">
        {error && (
          <div className="bg-red-50 text-danger text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@school.com"
            required
          />
        </div>

        <div>
          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm text-text-muted mt-4">
        Setting up a new school?{' '}
        <a href="/signup" className="text-primary font-medium hover:underline">
          Get started
        </a>
      </p>
    </div>
  )
}
```

- [ ] **Step 5: Create signup page (school setup)**

Create `dashboard/src/app/(auth)/signup/page.tsx`:
```typescript
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const DEFAULT_CLASSES = [
  'Playgroup', 'Nursery', 'LKG', 'UKG',
  'Class 1', 'Class 2', 'Class 3', 'Class 4',
  'Class 5', 'Class 6', 'Class 7', 'Class 8',
]

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Step 1: Admin account
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')

  // Step 2: School info
  const [schoolName, setSchoolName] = useState('')
  const [schoolAddress, setSchoolAddress] = useState('')
  const [schoolPhone, setSchoolPhone] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('Signup failed')

      // IMPORTANT: Signup bootstrapping order matters for RLS.
      // School INSERT is open to all authenticated users (bootstrapping policy).
      // Profile INSERT requires user_id = auth.uid().
      // After profile exists, get_user_school_id() works for all subsequent queries.

      // 2. Create school (open INSERT policy for bootstrapping)
      const { data: school, error: schoolError } = await supabase
        .from('schools')
        .insert({
          name: schoolName,
          address: schoolAddress,
          phone: schoolPhone,
          email: email,
        })
        .select()
        .single()

      if (schoolError) throw schoolError

      // 3. Create admin profile EARLY so get_user_school_id() works for remaining inserts
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          school_id: school.id,
          full_name: fullName,
          phone: phone,
          roles: ['admin'],
          primary_role: 'admin',
        })

      if (profileError) throw profileError

      // 4. Now get_user_school_id() returns school.id — subsequent inserts go through RLS

      // 5. Create academic year (April 2026 - March 2027)
      const { data: academicYear, error: yearError } = await supabase
        .from('academic_years')
        .insert({
          school_id: school.id,
          name: '2026-27',
          start_date: '2026-04-01',
          end_date: '2027-03-31',
          is_current: true,
        })
        .select()
        .single()

      if (yearError) throw yearError

      // 6. Create default classes
      const classInserts = DEFAULT_CLASSES.map((name) => ({
        school_id: school.id,
        academic_year_id: academicYear.id,
        name,
        capacity: name.startsWith('Class') ? 40 : 30,
      }))

      const { error: classError } = await supabase
        .from('classes')
        .insert(classInserts)

      if (classError) throw classError

      // 7. Create default communication templates
      const { error: templateError } = await supabase
        .from('comm_templates')
        .insert([
          {
            school_id: school.id,
            name: 'Fee Reminder',
            body: 'Dear {parent_name}, this is a reminder that fees of ₹{amount} for {student_name} ({class}) are due on {due_date}. Please clear the dues at the earliest. - {school_name}',
            type: 'fee_reminder',
          },
          {
            school_id: school.id,
            name: 'Absence Alert',
            body: 'Dear {parent_name}, we noticed {student_name} was absent today ({date}). We hope everything is well. Please inform us if your child will be absent for an extended period. - {school_name}',
            type: 'absence_alert',
          },
          {
            school_id: school.id,
            name: 'Holiday Notice',
            body: 'Dear Parents, please note that the school will remain closed on {date} on account of {reason}. Regular classes will resume on {resume_date}. - {school_name}',
            type: 'holiday_notice',
          },
        ])

      if (templateError) throw templateError

      router.push('/')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl font-bold">PS</span>
        </div>
        <h1 className="text-2xl font-bold text-text">Set Up Your School</h1>
        <p className="text-text-muted mt-1">Step {step} of 2</p>
      </div>

      <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2) } : handleSignup} className="card space-y-4">
        {error && (
          <div className="bg-red-50 text-danger text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        {step === 1 ? (
          <>
            <h2 className="font-semibold text-lg">Your Account</h2>
            <div>
              <label className="label">Full Name</label>
              <input type="text" className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Mrs. Neeta Parmar" required />
            </div>
            <div>
              <label className="label">Email</label>
              <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@school.com" required />
            </div>
            <div>
              <label className="label">Phone</label>
              <input type="tel" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98180 97475" required />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" minLength={6} required />
            </div>
            <button type="submit" className="btn-primary w-full">Next: School Details</button>
          </>
        ) : (
          <>
            <h2 className="font-semibold text-lg">School Details</h2>
            <div>
              <label className="label">School Name</label>
              <input type="text" className="input" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} placeholder="Kids Planet" required />
            </div>
            <div>
              <label className="label">Address</label>
              <textarea className="input" rows={2} value={schoolAddress} onChange={(e) => setSchoolAddress(e.target.value)} placeholder="Dhalpur, Kullu, HP" />
            </div>
            <div>
              <label className="label">School Phone</label>
              <input type="tel" className="input" value={schoolPhone} onChange={(e) => setSchoolPhone(e.target.value)} placeholder="+91 98180 97475" />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
              <button type="submit" className="btn-primary flex-1" disabled={loading}>
                {loading ? 'Setting up...' : 'Create School'}
              </button>
            </div>
          </>
        )}
      </form>

      <p className="text-center text-sm text-text-muted mt-4">
        Already have an account?{' '}
        <a href="/login" className="text-primary font-medium hover:underline">
          Sign in
        </a>
      </p>
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/auth/ src/lib/hooks/ src/app/\(auth\)/
git commit -m "feat: add auth provider, login page, and school signup flow"
```

---

## Task 9: Restructure Layout for Route Groups

**Files:**
- Modify: `dashboard/src/app/layout.tsx` — Wrap with AuthProvider
- Create: `dashboard/src/app/(dashboard)/layout.tsx` — Sidebar layout for authenticated routes
- Move: All existing page.tsx files into `(dashboard)/` route group

This task restructures the app to use Next.js route groups: `(auth)/` for login/signup (no sidebar) and `(dashboard)/` for all authenticated pages (with sidebar).

- [ ] **Step 1: Update root layout to include AuthProvider**

Modify `dashboard/src/app/layout.tsx` to wrap the entire app in AuthProvider. Remove the Sidebar from root layout (it moves to dashboard layout):

```typescript
import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/components/auth/AuthProvider'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',  // Must match globals.css variable name
})

export const metadata: Metadata = {
  title: {
    template: '%s — Planet Studio',
    default: 'Planet Studio — School Management',
  },
  description: 'Complete school management system',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.variable} font-sans bg-surface-cream text-text antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Create dashboard layout with Sidebar**

Create `dashboard/src/app/(dashboard)/layout.tsx`:
```typescript
'use client'

import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-cream flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center animate-pulse">
          <span className="text-white text-2xl font-bold">PS</span>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen">
      <Sidebar />
      <main className="lg:ml-64 pt-16 lg:pt-6 pb-6 px-4 lg:px-6">
        {children}
      </main>
    </div>
  )
}
```

- [ ] **Step 3: Move existing pages into (dashboard)/ route group**

Move these existing files into the `(dashboard)/` directory:
- `src/app/page.tsx` → `src/app/(dashboard)/page.tsx`
- `src/app/students/` → `src/app/(dashboard)/students/`
- `src/app/attendance/` → `src/app/(dashboard)/attendance/`
- `src/app/admissions/` → `src/app/(dashboard)/admissions/`
- `src/app/staff/` → `src/app/(dashboard)/staff/`
- `src/app/finance/` → `src/app/(dashboard)/finance/`
- `src/app/communication/` → `src/app/(dashboard)/communication/`
- `src/app/calendar/` → `src/app/(dashboard)/calendar/`
- `src/app/reports/` → `src/app/(dashboard)/reports/`
- `src/app/website/` → `src/app/(dashboard)/website/`
- `src/app/content-studio/` → `src/app/(dashboard)/content-studio/`

```bash
cd /d/Karan/KidsPlanet/dashboard/src/app
mkdir -p "(dashboard)"
# Move each directory individually (Windows-safe, no bash for-loop with parens)
mv students "(dashboard)/"
mv attendance "(dashboard)/"
mv admissions "(dashboard)/"
mv staff "(dashboard)/"
mv finance "(dashboard)/"
mv communication "(dashboard)/"
mv calendar "(dashboard)/"
mv reports "(dashboard)/"
mv website "(dashboard)/"
mv content-studio "(dashboard)/"
mv page.tsx "(dashboard)/"
```

> **Windows note:** If `mv` fails with parentheses, use File Explorer or PowerShell's `Move-Item` to move the directories into `(dashboard)/`.

- [ ] **Step 4: Update Sidebar to use auth context**

Modify `dashboard/src/components/Sidebar.tsx`: Replace the hardcoded user info at the bottom with data from `useAuth()`:

```typescript
// At the top of the component, add:
import { useAuth } from '@/lib/hooks/useAuth'

// Inside the component:
const { profile, school, signOut } = useAuth()

// Replace the hardcoded user section at the bottom with:
// Name: profile?.full_name ?? 'Loading...'
// Role: profile?.primary_role ?? ''
// School: school?.name ?? ''
// Add a sign-out button
```

The sign-out button calls `signOut()` and redirects to `/login`.

- [ ] **Step 5: Verify the app builds and login/signup pages render**

```bash
cd dashboard && npm run build
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: restructure app with auth/dashboard route groups and AuthProvider"
```

---

## Task 10: Shared UI Components

**Files:**
- Create: `dashboard/src/components/shared/DataTable.tsx`
- Create: `dashboard/src/components/shared/FormField.tsx`
- Create: `dashboard/src/components/shared/StatusBadge.tsx`
- Create: `dashboard/src/components/shared/Modal.tsx`
- Create: `dashboard/src/components/shared/RoleGuard.tsx`
- Create: `dashboard/src/components/shared/FileUpload.tsx`

- [ ] **Step 1: Create DataTable component**

Create `dashboard/src/components/shared/DataTable.tsx`:

A reusable table component that accepts:
- `columns: { key: string, label: string, render?: (row) => ReactNode }[]`
- `data: T[]`
- `searchable?: boolean` (adds search input)
- `searchKeys?: string[]` (fields to search across)
- `emptyMessage?: string`

Features: search filtering, responsive (cards on mobile, table on desktop), loading skeleton state.

Keep it simple — no sorting or pagination initially (most school tables will have <100 rows).

- [ ] **Step 2: Create FormField component**

Create `dashboard/src/components/shared/FormField.tsx`:

A wrapper that renders:
- `<label>` with the field label
- The appropriate input element (text, email, tel, date, select, textarea)
- Error message below if validation fails

Props: `label, type, name, value, onChange, error?, placeholder?, required?, options? (for select)`

- [ ] **Step 3: Create StatusBadge component**

Create `dashboard/src/components/shared/StatusBadge.tsx`:

A colored pill badge. Maps status strings to colors:
- `active`/`present`/`paid`/`enrolled`/`approved` → green
- `absent`/`overdue`/`declined`/`rejected`/`serious` → red
- `late`/`partial`/`pending`/`contacted` → amber
- `alumni`/`withdrawn`/`new`/`visited` → gray/blue

Props: `status: string, size?: 'sm' | 'md'`

- [ ] **Step 4: Create Modal component**

Create `dashboard/src/components/shared/Modal.tsx`:

A simple overlay modal/dialog:
- Dark backdrop that closes on click
- White card in center
- Title, close button, children slot
- Animated entry (scale + fade)

Props: `open: boolean, onClose: () => void, title: string, children: ReactNode`

- [ ] **Step 5: Create RoleGuard component**

Create `dashboard/src/components/shared/RoleGuard.tsx`:

```typescript
'use client'

import { useAuth } from '@/lib/hooks/useAuth'

interface RoleGuardProps {
  roles: string[]  // e.g. ['admin', 'accountant']
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function RoleGuard({ roles, children, fallback = null }: RoleGuardProps) {
  const { profile } = useAuth()
  if (!profile) return null
  if (!roles.some((role) => profile.roles.includes(role))) return <>{fallback}</>
  return <>{children}</>
}
```

- [ ] **Step 6: Create FileUpload component**

Create `dashboard/src/components/shared/FileUpload.tsx`:

Wraps Supabase Storage upload:
- Drag-and-drop or click-to-browse
- Shows upload progress
- Returns the public URL on success
- Accepts `bucket: string, path: string, accept?: string`

- [ ] **Step 7: Commit**

```bash
git add src/components/shared/
git commit -m "feat: add shared UI components (DataTable, FormField, StatusBadge, Modal, RoleGuard, FileUpload)"
```

---

## Task 11: Students Module — List Page

**Files:**
- Rewrite: `dashboard/src/app/(dashboard)/students/page.tsx`
- Create: `dashboard/src/components/students/StudentCard.tsx`

- [ ] **Step 1: Rewrite students list page with Supabase data**

Replace the mock data in `students/page.tsx` with real Supabase queries:

```typescript
// Server component for data fetching
// Query: supabase.from('students').select('*, class:classes(name, section)').eq('status', 'active').order('full_name')
// Show: Photo/initials avatar, name, class, enrollment date
// Features: Search by name, filter by class dropdown
// Actions: "Add Student" button (links to /students/new)
// Each row links to /students/[id]
```

The page fetches students with their class name joined. Uses the DataTable component. Class filter dropdown populated from the `classes` table.

- [ ] **Step 2: Create StudentCard component**

Create `dashboard/src/components/students/StudentCard.tsx`:

Mobile-friendly card view of a student:
- Photo or initials avatar (circular)
- Name (bold), class name below
- StatusBadge for fee status (if available)
- Tap to navigate to profile

- [ ] **Step 3: Verify students list renders with empty state**

```bash
cd dashboard && npm run dev
```

Navigate to `/students` — should show empty state ("No students yet. Add your first student.") if no data in DB.

- [ ] **Step 4: Commit**

```bash
git add src/app/\(dashboard\)/students/ src/components/students/
git commit -m "feat: students list page with Supabase integration and class filter"
```

---

## Task 12: Students Module — Profile & Add Student

**Files:**
- Create: `dashboard/src/app/(dashboard)/students/[id]/page.tsx`
- Create: `dashboard/src/app/(dashboard)/students/new/page.tsx`
- Create: `dashboard/src/components/students/StudentForm.tsx`
- Create: `dashboard/src/components/students/GuardianForm.tsx`

- [ ] **Step 1: Create student profile page**

Create `dashboard/src/app/(dashboard)/students/[id]/page.tsx`:

Single scrollable page with tabs:
- **Info tab:** Name, DOB, blood group, class, enrollment date, photo
- **Family tab:** Guardian(s) with name, phone, email, relation, is_primary badge. Add guardian button.
- **Documents tab:** List of uploaded documents with type badge. Upload button.
- **Health tab:** Allergies list with severity badges. Add allergy button.

Data fetched server-side:
```typescript
// supabase.from('students').select('*, class:classes(name), guardians:student_guardians(*, guardian:guardians(*)), allergies(*), documents(*)').eq('id', params.id).single()
```

Edit button on each section opens inline edit mode (not a separate page).

- [ ] **Step 2: Create StudentForm component**

Create `dashboard/src/components/students/StudentForm.tsx`:

Form fields: full_name (required), dob, blood_group (select), class_id (select from classes), photo upload, enrollment_date (defaults to today).

On submit: inserts into `students` table, redirects to profile page.

- [ ] **Step 3: Create GuardianForm component**

Create `dashboard/src/components/students/GuardianForm.tsx`:

Form fields: full_name (required), phone, email, relation (select: Father/Mother/Guardian/Other), occupation, address, is_primary (checkbox).

Used both in the Add Student wizard (step 2) and on the student profile Family tab.

On submit: inserts into `guardians` table + creates `student_guardians` junction record.

- [ ] **Step 4: Create add student page (wizard)**

Create `dashboard/src/app/(dashboard)/students/new/page.tsx`:

3-step wizard:
1. **Child Info** — StudentForm fields
2. **Guardian Info** — GuardianForm fields
3. **Review & Save** — Summary of entered data, confirm button

On confirm: creates student, guardian, and student_guardians records. Redirects to the new student's profile.

- [ ] **Step 5: Verify add student → profile flow works**

```bash
cd dashboard && npm run dev
```

Navigate to `/students/new`, fill in data, submit. Verify redirect to `/students/[id]` shows the data.

- [ ] **Step 6: Commit**

```bash
git add src/app/\(dashboard\)/students/ src/components/students/
git commit -m "feat: student profile page and add student wizard with guardian management"
```

---

## Task 13: Attendance Module

**Files:**
- Rewrite: `dashboard/src/app/(dashboard)/attendance/page.tsx`
- Create: `dashboard/src/components/attendance/AttendanceGrid.tsx`
- Create: `dashboard/src/components/attendance/AttendanceSummary.tsx`

- [ ] **Step 1: Rewrite attendance page**

Replace mock attendance page with Supabase-powered version:

**Layout:**
- Date picker (defaults to today) at top
- Class selector (dropdown, populated from `classes` table)
- AttendanceSummary bar: "22/25 present" with color breakdown
- "Mark All Present" button
- AttendanceGrid: grid of student cards

**Data flow:**
1. Fetch students for selected class: `students.select('id, full_name, photo_url').eq('class_id', classId).eq('status', 'active')`
2. Fetch today's attendance: `attendance.select('*').eq('date', today).in('student_id', studentIds)`
3. Merge: each student gets their attendance status (default: unmarked)

**Actions:**
- Tap student card → cycles through: present (green) → absent (red) → late (amber)
- "Mark All Present" → sets all unmarked students to present
- "Save" button → upserts attendance records (INSERT ON CONFLICT UPDATE)
- Auto-save after each tap (debounced 500ms) for simplicity

- [ ] **Step 2: Create AttendanceGrid component**

Create `dashboard/src/components/attendance/AttendanceGrid.tsx`:

Grid of student cards (3 columns on desktop, 2 on mobile):
- Each card: student photo/initials, name, big colored status indicator
- Tap to toggle status
- Visual: green border = present, red = absent, amber = late, gray = unmarked

- [ ] **Step 3: Create AttendanceSummary component**

Create `dashboard/src/components/attendance/AttendanceSummary.tsx`:

Horizontal bar showing:
- Total students count
- Present (green), Absent (red), Late (amber) counts
- Percentage attendance

- [ ] **Step 4: Verify attendance marking persists**

```bash
cd dashboard && npm run dev
```

Navigate to `/attendance`, select a class, mark some students, refresh page — attendance should persist.

- [ ] **Step 5: Commit**

```bash
git add src/app/\(dashboard\)/attendance/ src/components/attendance/
git commit -m "feat: attendance module with tap-to-toggle grid and auto-save"
```

---

## Task 14: Communication Module

**Files:**
- Rewrite: `dashboard/src/app/(dashboard)/communication/page.tsx`
- Create: `dashboard/src/components/communication/ComposeMessage.tsx`
- Create: `dashboard/src/components/communication/MessageList.tsx`

- [ ] **Step 1: Rewrite communication page**

Two tabs: **Compose** and **Sent Messages**

**Compose tab:**
- Audience selector: "All Parents" / "Class: [dropdown]" / "Individual: [search parent]"
- Quick template buttons (loaded from `comm_templates` table)
- Subject (optional) + Body (textarea)
- "Send" button → creates `messages` record + `message_recipients` records

For Phase 1, "sending" means saving to the database. Actual email/SMS delivery is a later task (Edge Functions). The UI shows "Message saved" on success.

**Sent Messages tab:**
- List of sent messages, newest first
- Each shows: subject/first line, audience, date, delivery count
- Tap to expand full message

- [ ] **Step 2: Create ComposeMessage component**

Create `dashboard/src/components/communication/ComposeMessage.tsx`:

Props: `classes: Class[], templates: CommTemplate[]`

On submit:
1. Insert message record
2. Determine recipients based on audience:
   - `all` → all guardians in the school
   - `class` → guardians of students in that class (via `student_guardians` join)
   - `individual` → specific guardian
3. Insert `message_recipients` records
4. Show success toast

- [ ] **Step 3: Create MessageList component**

Create `dashboard/src/components/communication/MessageList.tsx`:

Fetches: `messages.select('*, recipient_count:message_recipients(count)').order('created_at', { ascending: false })`

Expandable accordion — tap message to see full body.

- [ ] **Step 4: Verify compose and sent messages flow**

Send a test message to "All Parents", verify it appears in Sent Messages tab.

- [ ] **Step 5: Commit**

```bash
git add src/app/\(dashboard\)/communication/ src/components/communication/
git commit -m "feat: communication module with compose, templates, and sent message history"
```

---

## Task 15: Finance Module — Fee Structure & Invoices

**Files:**
- Rewrite: `dashboard/src/app/(dashboard)/finance/page.tsx`
- Create: `dashboard/src/app/(dashboard)/finance/fee-structure/page.tsx`
- Create: `dashboard/src/components/finance/PaymentForm.tsx`
- Create: `dashboard/src/components/finance/InvoiceList.tsx`
- Create: `dashboard/src/components/finance/ReceiptView.tsx`

- [ ] **Step 1: Create fee structure management page**

Create `dashboard/src/app/(dashboard)/finance/fee-structure/page.tsx`:

- Table of fee structures grouped by class
- Columns: Class, Fee Type, Amount, Frequency
- "Add Fee" button opens modal with: class (select), fee_type (select), amount (number), frequency (select)
- Edit/delete per row
- Only accessible to admin/accountant roles (wrap with RoleGuard)

Data: `fee_structures.select('*, class:classes(name)').eq('academic_year_id', currentYear.id)`

- [ ] **Step 2: Rewrite finance overview page**

Replace mock finance page with Supabase-powered version:

**Dashboard section (top):**
- 4 StatCards: Total Due, Collected, Outstanding, Collection Rate %
- Computed from invoices + payments for current academic year

**Student-wise fee list:**
- Each student row: name, class, total due, paid amount, balance, StatusBadge (paid/partial/overdue/pending)
- Tap student → expands to show their invoices
- "Record Payment" button per student → opens PaymentForm modal
- "Generate Invoices" button (admin only) → creates monthly invoices based on fee structures
- "Send Reminders" button → creates message records for all overdue invoices

- [ ] **Step 3: Create PaymentForm component**

Create `dashboard/src/components/finance/PaymentForm.tsx`:

Modal form:
- Invoice selector (if student has multiple pending invoices)
- Amount (pre-filled with outstanding balance)
- Method: Cash / UPI / Cheque / Bank Transfer (big tap buttons, not dropdown)
- Notes (optional)
- "Record Payment" button

On submit:
1. Insert `payments` record (receipt_number auto-generated by trigger)
2. Update invoice status: if paid >= total → 'paid', elif paid > 0 → 'partial'
3. Show receipt (ReceiptView)

- [ ] **Step 4: Create InvoiceList component**

Create `dashboard/src/components/finance/InvoiceList.tsx`:

For a single student — shows their invoices with:
- Description (from invoice_items), amount, due date, status
- Payments made against each invoice
- Outstanding balance

- [ ] **Step 5: Create ReceiptView component**

Create `dashboard/src/components/finance/ReceiptView.tsx`:

Printable receipt with:
- School name + logo at top
- Receipt number, date
- Student name, class
- Payment details (amount, method)
- "Print" button (window.print with print-specific CSS)

- [ ] **Step 6: Verify payment recording flow**

1. Set up fee structure for a class
2. Generate invoices
3. Record a cash payment
4. Verify receipt appears and invoice status updates

- [ ] **Step 7: Commit**

```bash
git add src/app/\(dashboard\)/finance/ src/components/finance/
git commit -m "feat: finance module with fee structures, invoices, payment recording, and receipts"
```

---

## Task 16: Dashboard Home — Real Data

**Files:**
- Rewrite: `dashboard/src/app/(dashboard)/page.tsx`

- [ ] **Step 1: Replace dashboard home with live Supabase data**

Replace all mock data imports with real queries:

**KPI Cards:**
- Total Students: `students.select('id', { count: 'exact' }).eq('status', 'active')`
- New Inquiries: (keep as 0 until Admissions module in Phase 2)
- Fee Collection: sum of `payments.amount` for current month
- Collection Rate: (collected / total_due) * 100 from `invoices`

**Quick Actions:**
- Link to Add Student, Mark Attendance, Record Payment, Send Message, View Reports, Content Studio

**Today's Snapshot:**
- Attendance: today's count from `attendance` table
- Pending invoices count from `invoices.status = 'pending'`
- Recent messages count

Remove mock data imports from `src/data/students.ts`, `src/data/admissions.ts`, `src/data/finance.ts` — these files can stay for reference but are no longer imported by any page.

- [ ] **Step 2: Verify dashboard shows real data**

```bash
cd dashboard && npm run dev
```

Dashboard should show real counts after adding students and recording attendance.

- [ ] **Step 3: Commit**

```bash
git add src/app/\(dashboard\)/page.tsx
git commit -m "feat: dashboard home with live Supabase data (students, attendance, finance KPIs)"
```

---

## Task 17: Update Navigation for New Routes

**Files:**
- Modify: `dashboard/src/lib/constants.ts`
- Modify: `dashboard/src/components/Sidebar.tsx`

- [ ] **Step 1: Update navigation config with role-based access**

Update `dashboard/src/lib/constants.ts` nav items to include `roles` per item:

```typescript
export const navItems = [
  { label: 'Dashboard', href: '/', icon: 'LayoutDashboard', roles: ['admin', 'staff', 'parent', 'accountant'] },
  // Academic
  { label: 'Students', href: '/students', icon: 'Users', roles: ['admin', 'staff'] },
  { label: 'Attendance', href: '/attendance', icon: 'ClipboardCheck', roles: ['admin', 'staff'] },
  { label: 'Admissions', href: '/admissions', icon: 'UserPlus', roles: ['admin'] },
  { label: 'Staff', href: '/staff', icon: 'Briefcase', roles: ['admin'] },
  // Admin
  { label: 'Finance', href: '/finance', icon: 'IndianRupee', roles: ['admin', 'accountant'] },
  { label: 'Communication', href: '/communication', icon: 'MessageSquare', roles: ['admin', 'staff'] },
  { label: 'Calendar', href: '/calendar', icon: 'Calendar', roles: ['admin', 'staff', 'parent'] },
  // Tools
  { label: 'Content Studio', href: '/content-studio', icon: 'Palette', roles: ['admin'] },
  { label: 'Website', href: '/website', icon: 'Globe', roles: ['admin'] },
  { label: 'Reports', href: '/reports', icon: 'BarChart3', roles: ['admin', 'accountant'] },
]
```

> **UI Reminder:** All tap targets (buttons, nav items, toggles) must be minimum 44px (per spec). The existing attendance buttons are 36px (`w-9 h-9`) — update them to `w-11 h-11` (44px).

- [ ] **Step 2: Update Sidebar to filter by user role**

Modify `dashboard/src/components/Sidebar.tsx`:

Filter `navItems` by the user's `profile.roles` — only show items where at least one of the user's roles is in the item's `roles` array.

- [ ] **Step 3: Commit**

```bash
git add src/lib/constants.ts src/components/Sidebar.tsx
git commit -m "feat: role-based navigation filtering in sidebar"
```

---

## Task 18: Final Integration Test & Cleanup

- [ ] **Step 1: Remove unused mock data imports**

Check all files in `src/app/(dashboard)/` — ensure none import from `src/data/students.ts`, `src/data/admissions.ts`, or `src/data/finance.ts`. The `src/data/templates.ts` and `src/data/media-library.ts` are still used by Content Studio — keep those.

- [ ] **Step 2: Full build test**

```bash
cd dashboard && npm run build
```

Expected: Build succeeds with no errors. Warnings about unused variables are OK to fix.

- [ ] **Step 3: Manual smoke test checklist**

Run `npm run dev` and verify:
- [ ] `/login` — Login form renders
- [ ] `/signup` — School setup wizard renders, can create school
- [ ] After login, Sidebar shows correct items for admin role
- [ ] `/` — Dashboard shows KPI cards with real data
- [ ] `/students` — Student list with search and class filter
- [ ] `/students/new` — Add student wizard works end-to-end
- [ ] `/students/[id]` — Student profile shows all tabs
- [ ] `/attendance` — Attendance grid loads, tap-to-toggle works, auto-saves
- [ ] `/communication` — Compose message with templates, sent messages list
- [ ] `/finance` — Fee overview with payment recording
- [ ] `/finance/fee-structure` — Fee structure CRUD
- [ ] `/content-studio` — Still works (unchanged)

- [ ] **Step 4: Commit any cleanup**

```bash
git add -A
git commit -m "chore: cleanup unused mock data imports and fix build warnings"
```

---

## Summary

| Task | Description | Key Files |
|------|-------------|-----------|
| 1 | Install Supabase deps | package.json, .env.local, next.config.ts |
| 2 | Supabase client setup | lib/supabase/*.ts, middleware.ts |
| 3 | Foundation migration | supabase/migrations/001_foundation.sql |
| 4 | Students migration | supabase/migrations/002_students.sql |
| 5 | Attendance/Comm/Finance migrations | supabase/migrations/003-005*.sql |
| 6 | Seed data docs | supabase/migrations/006_seed.sql |
| 7 | TypeScript types + formatters | lib/types/database.ts, lib/utils/formatters.ts |
| 8 | Auth + Login + Signup | components/auth/*, (auth)/*.tsx |
| 9 | Route group restructure | layout.tsx, (dashboard)/layout.tsx, move pages |
| 10 | Shared UI components | components/shared/*.tsx |
| 11 | Students list page | (dashboard)/students/page.tsx |
| 12 | Student profile + add wizard | (dashboard)/students/[id]/, students/new/ |
| 13 | Attendance module | (dashboard)/attendance/, components/attendance/ |
| 14 | Communication module | (dashboard)/communication/, components/communication/ |
| 15 | Finance module | (dashboard)/finance/, components/finance/ |
| 16 | Dashboard home (live data) | (dashboard)/page.tsx |
| 17 | Role-based navigation | constants.ts, Sidebar.tsx |
| 18 | Integration test + cleanup | All files |
