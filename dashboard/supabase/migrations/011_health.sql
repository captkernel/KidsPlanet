-- =============================================================
-- Health & Safety: medical_records, immunizations, incidents
-- =============================================================

CREATE TABLE medical_records (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  condition text,
  medication text,
  doctor_name text,
  doctor_phone text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_medical_records_student ON medical_records(student_id);

CREATE TRIGGER medical_records_updated_at
  BEFORE UPDATE ON medical_records FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE immunizations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  vaccine_name text NOT NULL,
  date_given date,
  next_due_date date,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_immunizations_student ON immunizations(student_id);
CREATE INDEX idx_immunizations_due ON immunizations(school_id, next_due_date);

CREATE TABLE incidents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date date NOT NULL,
  time timestamptz,
  description text NOT NULL,
  action_taken text,
  severity text NOT NULL CHECK (severity IN ('minor', 'moderate', 'serious')),
  reported_by uuid REFERENCES auth.users(id),
  parent_notified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_incidents_school ON incidents(school_id, date);
CREATE INDEX idx_incidents_student ON incidents(student_id);

CREATE TRIGGER incidents_updated_at
  BEFORE UPDATE ON incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE immunizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School members can view medical records"
  ON medical_records FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Staff can create medical records"
  ON medical_records FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));
CREATE POLICY "Staff can update medical records"
  ON medical_records FOR UPDATE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));

CREATE POLICY "School members can view immunizations"
  ON immunizations FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Staff can create immunizations"
  ON immunizations FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));
CREATE POLICY "Staff can update immunizations"
  ON immunizations FOR UPDATE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));

CREATE POLICY "School members can view incidents"
  ON incidents FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Staff can create incidents"
  ON incidents FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));
CREATE POLICY "Staff can update incidents"
  ON incidents FOR UPDATE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));
