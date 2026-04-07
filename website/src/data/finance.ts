export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  amount: number;
  paid: number;
  dueDate: string;
  paidDate: string | null;
  status: "paid" | "partial" | "pending" | "overdue";
  method: "cash" | "upi" | "bank" | null;
  quarter: string;
}

export const feeRecords: FeeRecord[] = [
  { id: "F001", studentId: "S001", studentName: "Aarav Sharma", class: "Class 5", amount: 8000, paid: 8000, dueDate: "2026-01-15", paidDate: "2026-01-10", status: "paid", method: "upi", quarter: "Q4 2025-26" },
  { id: "F002", studentId: "S002", studentName: "Priya Thakur", class: "Class 4", amount: 8000, paid: 8000, dueDate: "2026-01-15", paidDate: "2026-01-14", status: "paid", method: "cash", quarter: "Q4 2025-26" },
  { id: "F003", studentId: "S003", studentName: "Rohan Verma", class: "Class 7", amount: 9000, paid: 5000, dueDate: "2026-01-15", paidDate: "2026-01-20", status: "partial", method: "cash", quarter: "Q4 2025-26" },
  { id: "F004", studentId: "S005", studentName: "Karan Singh", class: "UKG", amount: 6000, paid: 0, dueDate: "2026-01-15", paidDate: null, status: "overdue", method: null, quarter: "Q4 2025-26" },
  { id: "F005", studentId: "S008", studentName: "Diya Chauhan", class: "Playgroup", amount: 5000, paid: 3000, dueDate: "2026-01-15", paidDate: "2026-02-01", status: "partial", method: "upi", quarter: "Q4 2025-26" },
  { id: "F006", studentId: "S010", studentName: "Saanvi Pathak", class: "Class 6", amount: 9000, paid: 0, dueDate: "2026-01-15", paidDate: null, status: "overdue", method: null, quarter: "Q4 2025-26" },
  { id: "F007", studentId: "S006", studentName: "Ishita Gupta", class: "Class 1", amount: 7000, paid: 7000, dueDate: "2026-01-15", paidDate: "2026-01-12", status: "paid", method: "bank", quarter: "Q4 2025-26" },
  { id: "F008", studentId: "S011", studentName: "Reyansh Bhatt", class: "Class 8", amount: 9000, paid: 9000, dueDate: "2026-01-15", paidDate: "2026-01-08", status: "paid", method: "upi", quarter: "Q4 2025-26" },
];

export const feeStructure = [
  { class: "Playgroup", quarterly: 5000, annual: 18000, admission: 3000 },
  { class: "Nursery", quarterly: 5500, annual: 20000, admission: 3000 },
  { class: "LKG", quarterly: 6000, annual: 22000, admission: 3500 },
  { class: "UKG", quarterly: 6000, annual: 22000, admission: 3500 },
  { class: "Class 1-3", quarterly: 7000, annual: 26000, admission: 4000 },
  { class: "Class 4-5", quarterly: 8000, annual: 30000, admission: 4000 },
  { class: "Class 6-8", quarterly: 9000, annual: 34000, admission: 5000 },
];

export function getFinanceStats() {
  const totalDue = feeRecords.reduce((s, f) => s + f.amount, 0);
  const totalCollected = feeRecords.reduce((s, f) => s + f.paid, 0);
  return {
    totalDue,
    totalCollected,
    outstanding: totalDue - totalCollected,
    collectionRate: Math.round((totalCollected / totalDue) * 100),
    paid: feeRecords.filter((f) => f.status === "paid").length,
    partial: feeRecords.filter((f) => f.status === "partial").length,
    overdue: feeRecords.filter((f) => f.status === "overdue").length,
  };
}
