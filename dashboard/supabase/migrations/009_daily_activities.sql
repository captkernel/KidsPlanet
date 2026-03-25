-- =============================================================
-- Daily Activities: daily_logs, log_entries, activity_templates
-- =============================================================

CREATE TABLE daily_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date date NOT NULL,
  logged_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE (student_id, date)
);

CREATE INDEX idx_daily_logs_school_date ON daily_logs(school_id, date);
CREATE INDEX idx_daily_logs_student ON daily_logs(student_id);

CREATE TABLE log_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  log_id uuid NOT NULL REFERENCES daily_logs(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('meal', 'nap', 'activity', 'mood', 'note')),
  value text,
  time timestamptz,
  photo_url text,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_log_entries_log ON log_entries(log_id);

CREATE TABLE activity_templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('meal', 'nap', 'activity', 'mood', 'note')),
  default_options jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_activity_templates_school ON activity_templates(school_id);

-- RLS
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_templates ENABLE ROW LEVEL SECURITY;

-- Daily logs
CREATE POLICY "School members can view daily logs"
  ON daily_logs FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Staff can create daily logs"
  ON daily_logs FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));
CREATE POLICY "Staff can update daily logs"
  ON daily_logs FOR UPDATE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));

-- Log entries
CREATE POLICY "School members can view log entries"
  ON log_entries FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Staff can create log entries"
  ON log_entries FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));
CREATE POLICY "Staff can update log entries"
  ON log_entries FOR UPDATE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));
CREATE POLICY "Staff can delete log entries"
  ON log_entries FOR DELETE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));

-- Activity templates
CREATE POLICY "School members can view activity templates"
  ON activity_templates FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Admins can create activity templates"
  ON activity_templates FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
CREATE POLICY "Admins can update activity templates"
  ON activity_templates FOR UPDATE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
CREATE POLICY "Admins can delete activity templates"
  ON activity_templates FOR DELETE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
