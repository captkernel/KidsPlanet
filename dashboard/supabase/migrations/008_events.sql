-- =============================================================
-- Calendar: events
-- =============================================================

CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  date date NOT NULL,
  end_date date,
  type text NOT NULL CHECK (type IN ('holiday', 'event', 'pta_meeting', 'exam', 'field_trip')),
  audience text CHECK (audience IN ('all', 'staff', 'parents', 'class')),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_events_school_date ON events(school_id, date);
CREATE INDEX idx_events_school_type ON events(school_id, type);

-- RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School members can view events"
  ON events FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Admins can create events"
  ON events FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
CREATE POLICY "Admins can update events"
  ON events FOR UPDATE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
CREATE POLICY "Admins can delete events"
  ON events FOR DELETE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
