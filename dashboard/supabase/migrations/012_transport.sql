-- =============================================================
-- Transport: routes, route_stops, student_transport
-- =============================================================

CREATE TABLE routes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  driver_id uuid REFERENCES staff_profiles(id),
  vehicle_number text,
  capacity int,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_routes_school ON routes(school_id);

CREATE TRIGGER routes_updated_at
  BEFORE UPDATE ON routes FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE route_stops (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  route_id uuid NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  stop_name text NOT NULL,
  pickup_time time,
  sequence_order int,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_route_stops_route ON route_stops(route_id);

CREATE TABLE student_transport (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  route_id uuid NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  stop_id uuid REFERENCES route_stops(id),
  type text DEFAULT 'both' CHECK (type IN ('pickup', 'drop', 'both')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_student_transport_student ON student_transport(student_id);
CREATE INDEX idx_student_transport_route ON student_transport(route_id);

-- RLS
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE route_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_transport ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School members can view routes"
  ON routes FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Admins can create routes"
  ON routes FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
CREATE POLICY "Admins can update routes"
  ON routes FOR UPDATE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
CREATE POLICY "Admins can delete routes"
  ON routes FOR DELETE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));

CREATE POLICY "School members can view route stops"
  ON route_stops FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Admins can create route stops"
  ON route_stops FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
CREATE POLICY "Admins can update route stops"
  ON route_stops FOR UPDATE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
CREATE POLICY "Admins can delete route stops"
  ON route_stops FOR DELETE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));

CREATE POLICY "School members can view student transport"
  ON student_transport FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Admins can create student transport"
  ON student_transport FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
CREATE POLICY "Admins can update student transport"
  ON student_transport FOR UPDATE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
CREATE POLICY "Admins can delete student transport"
  ON student_transport FOR DELETE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
