-- =============================================================
-- Staff/HR: staff_profiles, staff_documents, leave_requests
-- =============================================================

CREATE TABLE staff_profiles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  full_name text NOT NULL,
  phone text,
  designation text CHECK (designation IN ('teacher', 'assistant', 'driver', 'cook', 'admin', 'other')),
  class_id uuid REFERENCES classes(id),
  date_of_joining date,
  salary decimal,
  photo_url text,
  emergency_contact text,
  address text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'resigned')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_staff_profiles_school ON staff_profiles(school_id);
CREATE INDEX idx_staff_profiles_status ON staff_profiles(school_id, status);
CREATE INDEX idx_staff_profiles_user ON staff_profiles(user_id);

CREATE TRIGGER staff_profiles_updated_at
  BEFORE UPDATE ON staff_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE staff_documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id uuid NOT NULL REFERENCES staff_profiles(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('id_proof', 'qualification', 'police_verification', 'contract', 'other')),
  file_url text NOT NULL,
  expiry_date date,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_staff_documents_staff ON staff_documents(staff_id);

CREATE TABLE leave_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  staff_id uuid NOT NULL REFERENCES staff_profiles(id) ON DELETE CASCADE,
  leave_type text NOT NULL CHECK (leave_type IN ('casual', 'sick', 'earned')),
  from_date date NOT NULL,
  to_date date NOT NULL,
  reason text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approved_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_leave_requests_staff ON leave_requests(staff_id);
CREATE INDEX idx_leave_requests_school_status ON leave_requests(school_id, status);

CREATE TRIGGER leave_requests_updated_at
  BEFORE UPDATE ON leave_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE staff_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

-- Staff profiles
CREATE POLICY "School members can view staff profiles"
  ON staff_profiles FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Admins can create staff profiles"
  ON staff_profiles FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
CREATE POLICY "Admins can update staff profiles"
  ON staff_profiles FOR UPDATE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));

-- Staff documents
CREATE POLICY "School members can view staff documents"
  ON staff_documents FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Admins can create staff documents"
  ON staff_documents FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
CREATE POLICY "Admins can delete staff documents"
  ON staff_documents FOR DELETE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));

-- Leave requests
CREATE POLICY "School members can view leave requests"
  ON leave_requests FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Staff can create leave requests"
  ON leave_requests FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));
CREATE POLICY "Admins can update leave requests"
  ON leave_requests FOR UPDATE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
