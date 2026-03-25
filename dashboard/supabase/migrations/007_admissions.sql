-- =============================================================
-- Admissions CRM: inquiries
-- =============================================================

CREATE TABLE inquiries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  parent_name text NOT NULL,
  parent_phone text,
  parent_email text,
  child_name text,
  child_dob date,
  class_sought text,
  source text CHECK (source IN ('website', 'walkin', 'referral', 'social_media', 'other')),
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'visited', 'enrolled', 'declined')),
  notes text,
  follow_up_date date,
  assigned_to uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_inquiries_school_status ON inquiries(school_id, status);
CREATE INDEX idx_inquiries_follow_up ON inquiries(school_id, follow_up_date) WHERE status NOT IN ('enrolled', 'declined');

CREATE TRIGGER inquiries_updated_at
  BEFORE UPDATE ON inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School members can view inquiries"
  ON inquiries FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Admins can create inquiries"
  ON inquiries FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
CREATE POLICY "Admins can update inquiries"
  ON inquiries FOR UPDATE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
CREATE POLICY "Admins can delete inquiries"
  ON inquiries FOR DELETE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
