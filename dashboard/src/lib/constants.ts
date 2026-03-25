import {
  LayoutDashboard, Users, ClipboardCheck, GraduationCap, Briefcase,
  IndianRupee, MessageSquare, Calendar, Palette, Globe, BarChart3,
  Activity, BookOpen, HeartPulse, Bus, UtensilsCrossed, Home,
} from "lucide-react";

export const SCHOOL = {
  name: "Kids Planet",
  tagline: "Kullu Valley's Dedicated Early Childhood Learning Center",
  phone: "+91 98180 97475",
  email: "kidsplanetkullu@gmail.com",
  address: "Above Circuit House, Miyanbehar, Dhalpur, Kullu — 175101",
  founder: "Mrs. Neeta Parmar",
  founded: 2010,
  classes: ["Playgroup", "Nursery", "KG", "Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8"],
};

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, section: "main", roles: ["admin", "staff", "parent", "accountant"] },
  { href: "/students", label: "Students", icon: Users, section: "academic", roles: ["admin", "staff"] },
  { href: "/attendance", label: "Attendance", icon: ClipboardCheck, section: "academic", roles: ["admin", "staff"] },
  { href: "/admissions", label: "Admissions", icon: GraduationCap, section: "academic", roles: ["admin"] },
  { href: "/daily-activities", label: "Daily Activities", icon: Activity, section: "academic", roles: ["admin", "staff"] },
  { href: "/staff", label: "Staff", icon: Briefcase, section: "academic", roles: ["admin"] },
  { href: "/finance", label: "Finance", icon: IndianRupee, section: "admin", roles: ["admin", "accountant"] },
  { href: "/communication", label: "Communication", icon: MessageSquare, section: "admin", roles: ["admin", "staff"] },
  { href: "/calendar", label: "Calendar", icon: Calendar, section: "admin", roles: ["admin", "staff", "parent"] },
  { href: "/curriculum", label: "Curriculum", icon: BookOpen, section: "admin", roles: ["admin", "staff"] },
  { href: "/health", label: "Health", icon: HeartPulse, section: "admin", roles: ["admin", "staff"] },
  { href: "/transport", label: "Transport", icon: Bus, section: "admin", roles: ["admin"] },
  { href: "/meals", label: "Meals", icon: UtensilsCrossed, section: "admin", roles: ["admin", "staff"] },
  { href: "/content-studio", label: "Content Studio", icon: Palette, section: "tools", roles: ["admin"] },
  { href: "/website", label: "Website", icon: Globe, section: "tools", roles: ["admin"] },
  { href: "/reports", label: "Reports", icon: BarChart3, section: "tools", roles: ["admin", "accountant"] },
  { href: "/parent", label: "Parent Portal", icon: Home, section: "main", roles: ["parent"] },
];

export const SECTIONS: Record<string, string> = {
  main: "",
  academic: "Academic",
  admin: "Administration",
  tools: "Tools",
};

export const CLASS_COLORS: Record<string, string> = {
  Playgroup: "bg-purple-100 text-purple-700",
  Nursery: "bg-blue-100 text-blue-700",
  KG: "bg-cyan-100 text-cyan-700",
  "Class 1": "bg-green-100 text-green-700",
  "Class 2": "bg-emerald-100 text-emerald-700",
  "Class 3": "bg-teal-100 text-teal-700",
  "Class 4": "bg-amber-100 text-amber-700",
  "Class 5": "bg-orange-100 text-orange-700",
  "Class 6": "bg-rose-100 text-rose-700",
  "Class 7": "bg-pink-100 text-pink-700",
  "Class 8": "bg-indigo-100 text-indigo-700",
};
