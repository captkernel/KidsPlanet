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
  BEFORE UPDATE ON attendance FOR EACH ROW EXECUTE FUNCTION update_updated_at();

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
  BEFORE UPDATE ON staff_attendance FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School members can view attendance"
  ON attendance FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Admins/staff can mark attendance"
  ON attendance FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));
CREATE POLICY "Admins/staff can update attendance"
  ON attendance FOR UPDATE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));

CREATE POLICY "School members can view staff attendance"
  ON staff_attendance FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Admins can manage staff attendance"
  ON staff_attendance FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
CREATE POLICY "Admins can update staff attendance"
  ON staff_attendance FOR UPDATE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
