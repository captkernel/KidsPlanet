-- =============================================================
-- Communication: messages, recipients, templates
-- =============================================================

CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id),
  subject text,
  body text NOT NULL,
  type text NOT NULL CHECK (type IN ('announcement', 'alert', 'newsletter')),
  audience text NOT NULL CHECK (audience IN ('all', 'class', 'individual')),
  audience_filter text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_messages_school ON messages(school_id);

CREATE TABLE message_recipients (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  guardian_id uuid NOT NULL REFERENCES guardians(id) ON DELETE CASCADE,
  sent_via text CHECK (sent_via IN ('email', 'sms')),
  delivered_at timestamptz,
  read_at timestamptz
);

CREATE INDEX idx_message_recipients_message ON message_recipients(message_id);

CREATE TABLE comm_templates (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  body text NOT NULL,
  type text NOT NULL CHECK (type IN ('fee_reminder', 'absence_alert', 'holiday_notice', 'general')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TRIGGER comm_templates_updated_at
  BEFORE UPDATE ON comm_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE comm_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School members can view messages"
  ON messages FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Admins/staff can create messages"
  ON messages FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));

CREATE POLICY "School members can view recipients"
  ON message_recipients FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Admins/staff can create recipients"
  ON message_recipients FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'staff']));

CREATE POLICY "School members can view comm templates"
  ON comm_templates FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Authenticated users can create comm templates"
  ON comm_templates FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admins can update comm templates"
  ON comm_templates FOR UPDATE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin']));
