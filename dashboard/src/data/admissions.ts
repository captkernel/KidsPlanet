export interface Inquiry {
  id: string;
  parentName: string;
  phone: string;
  childName: string;
  childAge: number;
  classApplied: string;
  date: string;
  status: "new" | "contacted" | "visited" | "enrolled" | "declined";
  notes: string;
  source: "website" | "whatsapp" | "walkin" | "referral";
}

export const inquiries: Inquiry[] = [
  { id: "INQ001", parentName: "Meera Devi", phone: "+91 94180 12345", childName: "Aditya", childAge: 3, classApplied: "Playgroup", date: "2026-03-20", status: "new", notes: "Inquired via website form", source: "website" },
  { id: "INQ002", parentName: "Rakesh Kumar", phone: "+91 94180 12346", childName: "Sneha", childAge: 4, classApplied: "Nursery", date: "2026-03-19", status: "contacted", notes: "Called back, scheduled visit for March 25", source: "whatsapp" },
  { id: "INQ003", parentName: "Pooja Sharma", phone: "+91 94180 12347", childName: "Aryan", childAge: 5, classApplied: "LKG", date: "2026-03-18", status: "visited", notes: "Visited campus, very interested. Following up on docs.", source: "walkin" },
  { id: "INQ004", parentName: "Amit Thakur", phone: "+91 94180 12348", childName: "Riya", childAge: 6, classApplied: "Class 1", date: "2026-03-15", status: "enrolled", notes: "All docs submitted, fee paid. Starts April 1.", source: "referral" },
  { id: "INQ005", parentName: "Sunita Rana", phone: "+91 94180 12349", childName: "Kabir", childAge: 3, classApplied: "Playgroup", date: "2026-03-22", status: "new", notes: "WhatsApp inquiry about admissions", source: "whatsapp" },
  { id: "INQ006", parentName: "Deepa Negi", phone: "+91 94180 12350", childName: "Tara", childAge: 8, classApplied: "Class 3", date: "2026-03-17", status: "declined", notes: "Chose another school — too far from home", source: "website" },
  { id: "INQ007", parentName: "Vijay Chauhan", phone: "+91 94180 12351", childName: "Mohit", childAge: 4, classApplied: "Nursery", date: "2026-03-23", status: "new", notes: "Walk-in inquiry today", source: "walkin" },
  { id: "INQ008", parentName: "Neha Verma", phone: "+91 94180 12352", childName: "Anvi", childAge: 5, classApplied: "LKG", date: "2026-03-21", status: "contacted", notes: "Sent brochure on WhatsApp", source: "website" },
];

export const seatData = [
  { className: "Playgroup", totalSeats: 20, filledSeats: 12 },
  { className: "Nursery", totalSeats: 30, filledSeats: 26 },
  { className: "LKG", totalSeats: 35, filledSeats: 30 },
  { className: "UKG", totalSeats: 25, filledSeats: 22 },
  { className: "Class 1", totalSeats: 25, filledSeats: 19 },
  { className: "Class 2", totalSeats: 25, filledSeats: 21 },
  { className: "Class 3", totalSeats: 25, filledSeats: 16 },
  { className: "Class 4", totalSeats: 30, filledSeats: 23 },
  { className: "Class 5", totalSeats: 30, filledSeats: 20 },
  { className: "Class 6", totalSeats: 30, filledSeats: 18 },
  { className: "Class 7", totalSeats: 30, filledSeats: 15 },
  { className: "Class 8", totalSeats: 30, filledSeats: 12 },
];

export function getAdmissionStats() {
  return {
    total: inquiries.length,
    new: inquiries.filter((i) => i.status === "new").length,
    contacted: inquiries.filter((i) => i.status === "contacted").length,
    visited: inquiries.filter((i) => i.status === "visited").length,
    enrolled: inquiries.filter((i) => i.status === "enrolled").length,
    declined: inquiries.filter((i) => i.status === "declined").length,
    totalSeats: seatData.reduce((sum, s) => sum + s.totalSeats, 0),
    filledSeats: seatData.reduce((sum, s) => sum + s.filledSeats, 0),
  };
}
