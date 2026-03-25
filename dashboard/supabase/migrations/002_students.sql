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
  BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at();

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
  BEFORE UPDATE ON guardians FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE student_guardians (
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  guardian_id uuid NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  is_primary boolean DEFAULT false,
  PRIMARY KEY (student_id, guardian_id)
);

CREATE INDEX idx_student_guardians_guardian ON student_guardians(guardian_id);

CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('birth_cert', 'aadhaar', 'photo', 'medical', 'other')),
  file_url text NOT NULL,
  uploaded_at timestamptz DEFAULT now()
);

CREATE TABLE allergies (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  allergy_type text NOT NULL,
  severity text CHECK (severity IN ('mild', 'moderate', 'severe')),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE allergies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School members can view students"
  ON students FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Admins/staff can insert students"
  ON students FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));
CREATE POLICY "Admins/staff can update students"
  ON students FOR UPDATE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));
CREATE POLICY "Admins can delete students"
  ON students FOR DELETE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));

CREATE POLICY "School members can view guardians"
  ON guardians FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Admins/staff can insert guardians"
  ON guardians FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));
CREATE POLICY "Admins/staff can update guardians"
  ON guardians FOR UPDATE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));

CREATE POLICY "School members can view student_guardians"
  ON student_guardians FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Admins/staff can manage student_guardians"
  ON student_guardians FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));

CREATE POLICY "School members can view documents"
  ON documents FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Admins/staff can manage documents"
  ON documents FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));

CREATE POLICY "School members can view allergies"
  ON allergies FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Admins/staff can manage allergies"
  ON allergies FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));
