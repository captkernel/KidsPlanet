export interface Student {
  id: string;
  name: string;
  class: string;
  parentName: string;
  parentPhone: string;
  dob: string;
  gender: "M" | "F";
  enrollmentDate: string;
  status: "active" | "inactive" | "graduated";
  feeStatus: "paid" | "partial" | "pending";
  address: string;
}

export const students: Student[] = [
  { id: "S001", name: "Aarav Sharma", class: "Class 5", parentName: "Rajesh Sharma", parentPhone: "+91 98765 43210", dob: "2015-03-12", gender: "M", enrollmentDate: "2018-04-01", status: "active", feeStatus: "paid", address: "Dhalpur, Kullu" },
  { id: "S002", name: "Priya Thakur", class: "Class 4", parentName: "Suresh Thakur", parentPhone: "+91 98765 43211", dob: "2016-07-22", gender: "F", enrollmentDate: "2019-04-01", status: "active", feeStatus: "paid", address: "Akhara Bazaar, Kullu" },
  { id: "S003", name: "Rohan Verma", class: "Class 7", parentName: "Vikram Verma", parentPhone: "+91 98765 43212", dob: "2013-11-05", gender: "M", enrollmentDate: "2020-04-01", status: "active", feeStatus: "partial", address: "Bhuntar, Kullu" },
  { id: "S004", name: "Ananya Rana", class: "Nursery", parentName: "Meena Rana", parentPhone: "+91 98765 43213", dob: "2022-01-15", gender: "F", enrollmentDate: "2025-04-01", status: "active", feeStatus: "paid", address: "Sultanpur, Kullu" },
  { id: "S005", name: "Karan Singh", class: "KG", parentName: "Deepak Singh", parentPhone: "+91 98765 43214", dob: "2021-05-30", gender: "M", enrollmentDate: "2024-04-01", status: "active", feeStatus: "pending", address: "Mohal, Kullu" },
  { id: "S006", name: "Ishita Gupta", class: "Class 1", parentName: "Amit Gupta", parentPhone: "+91 98765 43215", dob: "2020-09-18", gender: "F", enrollmentDate: "2024-04-01", status: "active", feeStatus: "paid", address: "Dhalpur, Kullu" },
  { id: "S007", name: "Arjun Negi", class: "Class 3", parentName: "Mahesh Negi", parentPhone: "+91 98765 43216", dob: "2017-12-03", gender: "M", enrollmentDate: "2021-04-01", status: "active", feeStatus: "paid", address: "Kullu Town" },
  { id: "S008", name: "Diya Chauhan", class: "Playgroup", parentName: "Priya Chauhan", parentPhone: "+91 98765 43217", dob: "2023-06-10", gender: "F", enrollmentDate: "2025-04-01", status: "active", feeStatus: "partial", address: "Dhalpur, Kullu" },
  { id: "S009", name: "Vivaan Kumar", class: "Class 2", parentName: "Sunita Kumar", parentPhone: "+91 98765 43218", dob: "2018-08-25", gender: "M", enrollmentDate: "2022-04-01", status: "active", feeStatus: "paid", address: "Bhuntar, Kullu" },
  { id: "S010", name: "Saanvi Pathak", class: "Class 6", parentName: "Ritu Pathak", parentPhone: "+91 98765 43219", dob: "2014-04-14", gender: "F", enrollmentDate: "2019-04-01", status: "active", feeStatus: "pending", address: "Manali Road, Kullu" },
  { id: "S011", name: "Reyansh Bhatt", class: "Class 8", parentName: "Sanjay Bhatt", parentPhone: "+91 98765 43220", dob: "2012-10-08", gender: "M", enrollmentDate: "2018-04-01", status: "active", feeStatus: "paid", address: "Dhalpur, Kullu" },
  { id: "S012", name: "Myra Joshi", class: "Nursery", parentName: "Kavita Joshi", parentPhone: "+91 98765 43221", dob: "2022-02-28", gender: "F", enrollmentDate: "2025-04-01", status: "active", feeStatus: "paid", address: "Sultanpur, Kullu" },
];

export function getStudentsByClass(className: string) {
  return students.filter((s) => s.class === className && s.status === "active");
}

export function getStudentStats() {
  const active = students.filter((s) => s.status === "active");
  const byClass: Record<string, number> = {};
  active.forEach((s) => { byClass[s.class] = (byClass[s.class] || 0) + 1; });
  return {
    total: active.length,
    male: active.filter((s) => s.gender === "M").length,
    female: active.filter((s) => s.gender === "F").length,
    byClass,
    feePaid: active.filter((s) => s.feeStatus === "paid").length,
    feePending: active.filter((s) => s.feeStatus === "pending").length,
    feePartial: active.filter((s) => s.feeStatus === "partial").length,
  };
}
