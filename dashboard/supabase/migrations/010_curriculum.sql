-- =============================================================
-- Curriculum: lesson_plans, plan_activities, activity_library
-- =============================================================

CREATE TABLE lesson_plans (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  week_start date NOT NULL,
  theme text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_lesson_plans_school_class ON lesson_plans(school_id, class_id);
CREATE INDEX idx_lesson_plans_week ON lesson_plans(school_id, week_start);

CREATE TRIGGER lesson_plans_updated_at
  BEFORE UPDATE ON lesson_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE plan_activities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  plan_id uuid NOT NULL REFERENCES lesson_plans(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  day text NOT NULL CHECK (day IN ('mon', 'tue', 'wed', 'thu', 'fri', 'sat')),
  time_slot text,
  activity_name text NOT NULL,
  type text CHECK (type IN ('circle_time', 'free_play', 'art', 'music', 'outdoor', 'story', 'sensory')),
  description text,
  materials_needed text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_plan_activities_plan ON plan_activities(plan_id);

CREATE TABLE activity_library (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text,
  description text,
  materials text,
  age_group text,
  duration_mins int,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_activity_library_school ON activity_library(school_id);

-- RLS
ALTER TABLE lesson_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School members can view lesson plans"
  ON lesson_plans FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Staff can create lesson plans"
  ON lesson_plans FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));
CREATE POLICY "Staff can update lesson plans"
  ON lesson_plans FOR UPDATE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));
CREATE POLICY "Admins can delete lesson plans"
  ON lesson_plans FOR DELETE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));

CREATE POLICY "School members can view plan activities"
  ON plan_activities FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Staff can create plan activities"
  ON plan_activities FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));
CREATE POLICY "Staff can update plan activities"
  ON plan_activities FOR UPDATE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));
CREATE POLICY "Staff can delete plan activities"
  ON plan_activities FOR DELETE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));

CREATE POLICY "School members can view activity library"
  ON activity_library FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Admins can create activity library items"
  ON activity_library FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
CREATE POLICY "Admins can update activity library items"
  ON activity_library FOR UPDATE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
CREATE POLICY "Admins can delete activity library items"
  ON activity_library FOR DELETE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
