import {
  LayoutDashboard, Users, ClipboardCheck, GraduationCap, UserCog,
  DollarSign, Megaphone, Calendar, Palette, Globe, BarChart3, BookOpen
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
  { href: "/", label: "Dashboard", icon: LayoutDashboard, section: "main" },
  { href: "/students", label: "Students", icon: Users, section: "academic" },
  { href: "/attendance", label: "Attendance", icon: ClipboardCheck, section: "academic" },
  { href: "/admissions", label: "Admissions", icon: GraduationCap, section: "academic" },
  { href: "/staff", label: "Staff", icon: UserCog, section: "academic" },
  { href: "/finance", label: "Finance", icon: DollarSign, section: "admin" },
  { href: "/communication", label: "Communication", icon: Megaphone, section: "admin" },
  { href: "/calendar", label: "Calendar", icon: Calendar, section: "admin" },
  { href: "/content-studio", label: "Content Studio", icon: Palette, section: "tools" },
  { href: "/website", label: "Website", icon: Globe, section: "tools" },
  { href: "/reports", label: "Reports", icon: BarChart3, section: "tools" },
] as const;

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
