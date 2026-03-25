-- =============================================================
-- Foundation: schools, academic_years, classes, profiles
-- =============================================================

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
-- Helper functions for RLS
-- -----------------------------------------------------------
CREATE OR REPLACE FUNCTION get_user_school_id()
RETURNS uuid AS $$
  SELECT school_id FROM profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION get_user_role()
RETURNS text AS $$
  SELECT primary_role FROM profiles WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION user_has_role(required_roles text[])
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE user_id = auth.uid()
    AND roles && required_roles
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- -----------------------------------------------------------
-- RLS Policies
-- -----------------------------------------------------------
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Schools
CREATE POLICY "Authenticated users can create schools"
  ON schools FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can view own school"
  ON schools FOR SELECT USING (id = get_user_school_id());
CREATE POLICY "Admins can update own school"
  ON schools FOR UPDATE USING (id = get_user_school_id() AND user_has_role(ARRAY['admin']));

-- Academic years
CREATE POLICY "Authenticated users can create academic years"
  ON academic_years FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "School members can view academic years"
  ON academic_years FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Admins can update academic years"
  ON academic_years FOR UPDATE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
CREATE POLICY "Admins can delete academic years"
  ON academic_years FOR DELETE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));

-- Profiles
CREATE POLICY "Users can create own profile"
  ON profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "School members can view profiles"
  ON profiles FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (user_id = auth.uid());

-- Classes
CREATE POLICY "Authenticated users can create classes"
  ON classes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "School members can view classes"
  ON classes FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Admins can update classes"
  ON classes FOR UPDATE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
CREATE POLICY "Admins can delete classes"
  ON classes FOR DELETE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
