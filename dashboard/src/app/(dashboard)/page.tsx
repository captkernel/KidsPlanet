"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { useAuth } from "@/lib/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils/formatters";
import { todayISO } from "@/lib/utils/formatters";
import {
  Users, ClipboardCheck, IndianRupee, AlertTriangle,
  UserPlus, Palette, MessageSquare, BarChart3,
} from "lucide-react";

interface DashboardStats {
  totalStudents: number;
  attendancePresent: number;
  attendanceTotal: number;
  attendanceMarked: boolean;
  feeCollectedMonth: number;
  feeOutstanding: number;
}

export default function DashboardPage() {
  const { profile, school } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    attendancePresent: 0,
    attendanceTotal: 0,
    attendanceMarked: false,
    feeCollectedMonth: 0,
    feeOutstanding: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.school_id) return;

    const fetchStats = async () => {
      const supabase = createClient();
      const schoolId = profile.school_id;
      const today = todayISO();

      // Current month boundaries
      const monthStart = today.slice(0, 7) + "-01";
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      nextMonth.setDate(1);
      const monthEnd = nextMonth.toISOString().split("T")[0];

      const [studentsRes, attendanceRes, invoicesRes, paymentsRes] = await Promise.all([
        supabase
          .from("students")
          .select("id", { count: "exact", head: true })
          .eq("school_id", schoolId)
          .eq("status", "active"),
        supabase
          .from("attendance")
          .select("status")
          .eq("school_id", schoolId)
          .eq("date", today),
        supabase
          .from("invoices")
          .select("total_amount, status")
          .eq("school_id", schoolId),
        supabase
          .from("payments")
          .select("amount, paid_at")
          .eq("school_id", schoolId)
          .gte("paid_at", monthStart)
          .lt("paid_at", monthEnd),
      ]);

      const totalStudents = studentsRes.count ?? 0;

      const attendanceRows = attendanceRes.data ?? [];
      const attendanceMarked = attendanceRows.length > 0;
      const attendancePresent = attendanceRows.filter((r) => r.status === "present").length;
      const attendanceTotal = attendanceRows.length;

      const invoices = invoicesRes.data ?? [];
      const feeOutstanding = invoices
        .filter((inv) => inv.status === "pending" || inv.status === "overdue" || inv.status === "partial")
        .reduce((sum, inv) => sum + (inv.total_amount ?? 0), 0);

      const feeCollectedMonth = (paymentsRes.data ?? []).reduce(
        (sum, p) => sum + (p.amount ?? 0),
        0
      );

      setStats({
        totalStudents,
        attendancePresent,
        attendanceTotal,
        attendanceMarked,
        feeCollectedMonth,
        feeOutstanding,
      });
      setLoading(false);
    };

    fetchStats();
  }, [profile?.school_id]);

  const attendanceDisplay = stats.attendanceMarked
    ? `${stats.attendancePresent}/${stats.attendanceTotal} present`
    : "Not marked";

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = profile?.full_name?.split(" ")[0] ?? "";

  // Fee collection target percentage (approximate — outstanding vs collected)
  const feeTotal = stats.feeCollectedMonth + stats.feeOutstanding;
  const feePercent = feeTotal > 0 ? Math.round((stats.feeCollectedMonth / feeTotal) * 100) : 0;

  const quickActions = [
    { label: "Add Student",      href: "/students/new",     icon: UserPlus,      bg: "bg-green-100",   iconColor: "text-green-700"  },
    { label: "Mark Attendance",  href: "/attendance",        icon: ClipboardCheck, bg: "bg-blue-100",   iconColor: "text-blue-700"   },
    { label: "Record Payment",   href: "/finance",           icon: IndianRupee,   bg: "bg-emerald-100", iconColor: "text-emerald-700" },
    { label: "Send Message",     href: "/communication",     icon: MessageSquare, bg: "bg-sky-100",     iconColor: "text-sky-700"    },
    { label: "View Reports",     href: "/reports",           icon: BarChart3,     bg: "bg-amber-100",   iconColor: "text-amber-700"  },
    { label: "Content Studio",   href: "/content-studio",    icon: Palette,       bg: "bg-purple-100",  iconColor: "text-purple-700" },
  ];

  return (
    <>
      <PageHeader
        title={`${greeting}, ${firstName}!`}
        subtitle={`${school?.name ?? "Your School"} — ${new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`}
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* 3 regular stat cards */}
        <StatCard
          label="Total Students"
          value={loading ? "—" : stats.totalStudents}
          icon={Users}
          color="primary"
        />
        <StatCard
          label="Today's Attendance"
          value={loading ? "—" : attendanceDisplay}
          icon={ClipboardCheck}
          color="info"
        />
        <StatCard
          label="Outstanding Fees"
          value={loading ? "—" : formatCurrency(stats.feeOutstanding)}
          icon={AlertTriangle}
          color="danger"
        />

        {/* Featured fee collection card */}
        <div
          className="rounded-2xl p-5 flex flex-col justify-between min-h-[120px]"
          style={{ background: "linear-gradient(135deg, #2d5016, #4a7c28)" }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.75)" }}>
            Fee Collection
          </p>
          <div>
            <p className="text-2xl font-bold text-white mt-1">
              {loading ? "—" : formatCurrency(stats.feeCollectedMonth)}
            </p>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.8)" }}>
              {loading ? "" : `${feePercent}% of target`}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="font-bold text-primary-dark mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-start gap-3 bg-white rounded-2xl p-4 min-h-[80px] border border-gray-100 transition-all duration-150 hover:shadow-md"
              style={{ transition: "transform 150ms ease, box-shadow 150ms ease" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.02)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)"; }}
            >
              <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full ${action.bg}`}>
                <action.icon size={20} className={action.iconColor} />
              </span>
              <span className="text-sm font-medium text-gray-800 leading-tight">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
