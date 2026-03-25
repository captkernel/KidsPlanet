-- =============================================================
-- Meals: meal_plans, meal_tracking
-- =============================================================

CREATE TABLE meal_plans (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  date date NOT NULL,
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'snack')),
  menu_items text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_meal_plans_school_date ON meal_plans(school_id, date);
CREATE UNIQUE INDEX idx_meal_plans_unique ON meal_plans(school_id, date, meal_type);

CREATE TRIGGER meal_plans_updated_at
  BEFORE UPDATE ON meal_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE meal_tracking (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  date date NOT NULL,
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'snack')),
  status text NOT NULL CHECK (status IN ('eaten', 'skipped', 'absent')),
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_meal_tracking_school_date ON meal_tracking(school_id, date);
CREATE INDEX idx_meal_tracking_student ON meal_tracking(student_id);

-- RLS
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_tracking ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School members can view meal plans"
  ON meal_plans FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Admins can create meal plans"
  ON meal_plans FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
CREATE POLICY "Admins can update meal plans"
  ON meal_plans FOR UPDATE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
CREATE POLICY "Admins can delete meal plans"
  ON meal_plans FOR DELETE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));

CREATE POLICY "School members can view meal tracking"
  ON meal_tracking FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Staff can create meal tracking"
  ON meal_tracking FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));
CREATE POLICY "Staff can update meal tracking"
  ON meal_tracking FOR UPDATE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));
