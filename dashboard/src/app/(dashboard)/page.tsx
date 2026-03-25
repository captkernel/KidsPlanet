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
  UserPlus, Palette, MessageSquare, BarChart3, Globe,
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

  const quickActions = [
    { label: "Add Student", href: "/students/new", icon: UserPlus, color: "text-primary" },
    { label: "Mark Attendance", href: "/attendance", icon: ClipboardCheck, color: "text-accent-dark" },
    { label: "Record Payment", href: "/finance", icon: IndianRupee, color: "text-success" },
    { label: "Send Message", href: "/communication", icon: MessageSquare, color: "text-info" },
    { label: "View Reports", href: "/reports", icon: BarChart3, color: "text-warning" },
    { label: "Content Studio", href: "/content-studio", icon: Palette, color: "text-purple-600" },
  ];

  return (
    <>
      <PageHeader
        title={`Welcome back, ${profile?.full_name ?? "…"}`}
        subtitle={`Here's what's happening at ${school?.name ?? "your school"} today`}
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
          label="Fee Collection (Month)"
          value={loading ? "—" : formatCurrency(stats.feeCollectedMonth)}
          icon={IndianRupee}
          color="success"
        />
        <StatCard
          label="Outstanding Fees"
          value={loading ? "—" : formatCurrency(stats.feeOutstanding)}
          icon={AlertTriangle}
          color="danger"
        />
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="font-bold text-primary-dark mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-surface-muted hover:bg-surface-cream transition-colors text-center"
            >
              <action.icon size={24} className={action.color} />
              <span className="text-xs font-medium text-text-light leading-tight">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
