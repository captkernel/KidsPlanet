-- =============================================================
-- Finance: fee_structures, invoices, invoice_items, payments
-- =============================================================

CREATE TABLE fee_structures (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  academic_year_id uuid NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  class_id uuid NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  fee_type text NOT NULL CHECK (fee_type IN ('tuition', 'transport', 'meals', 'activity', 'materials', 'other')),
  amount decimal NOT NULL,
  frequency text NOT NULL CHECK (frequency IN ('monthly', 'quarterly', 'annual')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_fee_structures_school_year ON fee_structures(school_id, academic_year_id);

CREATE TRIGGER fee_structures_updated_at
  BEFORE UPDATE ON fee_structures FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  academic_year_id uuid NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  total_amount decimal NOT NULL,
  due_date date NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'partial')),
  generated_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_invoices_school_status ON invoices(school_id, status);
CREATE INDEX idx_invoices_student ON invoices(student_id);

CREATE TRIGGER invoices_updated_at
  BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TABLE invoice_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  fee_structure_id uuid REFERENCES fee_structures(id),
  description text NOT NULL,
  amount decimal NOT NULL
);

CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id uuid NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  amount decimal NOT NULL,
  method text NOT NULL CHECK (method IN ('cash', 'upi', 'cheque', 'bank_transfer')),
  received_by uuid REFERENCES auth.users(id),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id),
  receipt_number text,
  paid_at timestamptz DEFAULT now(),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_payments_invoice ON payments(invoice_id);

CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-generate receipt numbers
CREATE OR REPLACE FUNCTION generate_receipt_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.receipt_number IS NULL THEN
    NEW.receipt_number := 'RCP-' || to_char(now(), 'YYYYMMDD') || '-' || substring(NEW.id::text, 1, 8);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER payments_receipt_number
  BEFORE INSERT ON payments FOR EACH ROW EXECUTE FUNCTION generate_receipt_number();

-- RLS
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "School members can view fee structures"
  ON fee_structures FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Admins/accountants can create fee structures"
  ON fee_structures FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'accountant']));
CREATE POLICY "Admins/accountants can update fee structures"
  ON fee_structures FOR UPDATE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'accountant']));

CREATE POLICY "School members can view invoices"
  ON invoices FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Admins/accountants can create invoices"
  ON invoices FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'accountant']));
CREATE POLICY "Admins/accountants can update invoices"
  ON invoices FOR UPDATE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'accountant']));

CREATE POLICY "School members can view invoice items"
  ON invoice_items FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Admins/accountants can create invoice items"
  ON invoice_items FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'accountant']));

CREATE POLICY "School members can view payments"
  ON payments FOR SELECT USING (school_id = get_user_school_id());
CREATE POLICY "Admins/accountants can create payments"
  ON payments FOR INSERT WITH CHECK (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'accountant']));
CREATE POLICY "Admins/accountants can update payments"
  ON payments FOR UPDATE USING (school_id = get_user_school_id() AND user_has_role(ARRAY['admin', 'accountant']));
