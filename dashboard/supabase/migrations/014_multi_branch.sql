-- =============================================================
-- Multi-Branch: school_groups, school_group_members
-- =============================================================

CREATE TABLE school_groups (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  owner_id uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER school_groups_updated_at
  BEFORE UPDATE ON school_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE school_group_members (
  group_id uuid NOT NULL REFERENCES school_groups(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  PRIMARY KEY (group_id, school_id)
);

-- RLS
ALTER TABLE school_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_group_members ENABLE ROW LEVEL SECURITY;

-- Group owner can see/manage their groups
CREATE POLICY "Group owner can view groups"
  ON school_groups FOR SELECT USING (owner_id = auth.uid());
CREATE POLICY "Authenticated users can create groups"
  ON school_groups FOR INSERT TO authenticated WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Group owner can update groups"
  ON school_groups FOR UPDATE USING (owner_id = auth.uid());

-- Members visible to group owners
CREATE POLICY "Group owner can view group members"
  ON school_group_members FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM school_groups sg
      WHERE sg.id = group_id AND sg.owner_id = auth.uid()
    )
  );
CREATE POLICY "Group owner can add group members"
  ON school_group_members FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM school_groups sg
      WHERE sg.id = group_id AND sg.owner_id = auth.uid()
    )
  );
CREATE POLICY "Group owner can remove group members"
  ON school_group_members FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM school_groups sg
      WHERE sg.id = group_id AND sg.owner_id = auth.uid()
    )
  );
