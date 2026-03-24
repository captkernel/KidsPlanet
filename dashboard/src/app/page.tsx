import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { getStudentStats } from "@/data/students";
import { getAdmissionStats } from "@/data/admissions";
import { getFinanceStats } from "@/data/finance";
import {
  Users, GraduationCap, DollarSign, ClipboardCheck,
  AlertCircle, TrendingUp, UserPlus, Clock
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const studentStats = getStudentStats();
  const admissionStats = getAdmissionStats();
  const financeStats = getFinanceStats();

  return (
    <>
      <PageHeader
        title="Welcome back, Mrs. Parmar"
        subtitle="Here's what's happening at Kids Planet today"
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Students" value={studentStats.total} icon={Users} color="primary" />
        <StatCard label="New Inquiries" value={admissionStats.new} icon={UserPlus} color="accent" />
        <StatCard label="Fee Collection" value={`₹${(financeStats.totalCollected / 1000).toFixed(0)}K`} icon={DollarSign} color="success" />
        <StatCard label="Collection Rate" value={`${financeStats.collectionRate}%`} icon={TrendingUp} color="info" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Admission Pipeline */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-primary-dark">Admission Pipeline</h2>
            <Link href="/admissions" className="text-xs text-primary font-semibold hover:underline">View All →</Link>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: "New", count: admissionStats.new, color: "bg-blue-100 text-blue-700" },
              { label: "Contacted", count: admissionStats.contacted, color: "bg-amber-100 text-amber-700" },
              { label: "Visited", count: admissionStats.visited, color: "bg-purple-100 text-purple-700" },
              { label: "Enrolled", count: admissionStats.enrolled, color: "bg-green-100 text-green-700" },
            ].map((stage) => (
              <div key={stage.label} className="text-center p-3 rounded-lg bg-surface-muted">
                <div className="text-xl font-bold text-primary-dark">{stage.count}</div>
                <div className={`badge mt-1 ${stage.color}`}>{stage.label}</div>
              </div>
            ))}
          </div>
          <div className="text-sm text-text-muted">
            <strong>{admissionStats.filledSeats}</strong> of <strong>{admissionStats.totalSeats}</strong> seats filled across all classes
            <div className="w-full h-2 bg-surface-muted rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${(admissionStats.filledSeats / admissionStats.totalSeats) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="font-bold text-primary-dark mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: "Mark Attendance", href: "/attendance", icon: ClipboardCheck, color: "text-primary" },
              { label: "New Inquiry", href: "/admissions", icon: UserPlus, color: "text-accent-dark" },
              { label: "Record Payment", href: "/finance", icon: DollarSign, color: "text-success" },
              { label: "Create Announcement", href: "/communication", icon: AlertCircle, color: "text-info" },
              { label: "Generate Flyer", href: "/content-studio", icon: GraduationCap, color: "text-purple-600" },
            ].map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-muted transition-colors"
              >
                <action.icon size={18} className={action.color} />
                <span className="text-sm font-medium text-text-light">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Fee Overview & Class Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-primary-dark">Fee Overview (Q4)</h2>
            <Link href="/finance" className="text-xs text-primary font-semibold hover:underline">Details →</Link>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-light">Total Due</span>
              <span className="font-bold text-primary-dark">₹{financeStats.totalDue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-light">Collected</span>
              <span className="font-bold text-success">₹{financeStats.totalCollected.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-light">Outstanding</span>
              <span className="font-bold text-danger">₹{financeStats.outstanding.toLocaleString()}</span>
            </div>
            <div className="pt-2 border-t flex gap-4">
              <div className="badge bg-green-100 text-green-700">{financeStats.paid} Paid</div>
              <div className="badge bg-amber-100 text-amber-700">{financeStats.partial} Partial</div>
              <div className="badge bg-red-100 text-red-700">{financeStats.overdue} Overdue</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="font-bold text-primary-dark mb-4">Students by Class</h2>
          <div className="space-y-2">
            {Object.entries(studentStats.byClass)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([cls, count]) => (
                <div key={cls} className="flex items-center gap-3">
                  <span className="text-sm text-text-light w-24 truncate">{cls}</span>
                  <div className="flex-1 h-5 bg-surface-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/60 rounded-full"
                      style={{ width: `${(count / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-primary-dark w-8 text-right">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card mt-6">
        <h2 className="font-bold text-primary-dark mb-4">Today&apos;s Reminders</h2>
        <div className="space-y-3">
          {[
            { icon: Clock, text: "Follow up with Rakesh Kumar (Nursery inquiry) — visit scheduled March 25", color: "text-warning" },
            { icon: AlertCircle, text: "2 fee payments overdue — Karan Singh (KG), Saanvi Pathak (Class 6)", color: "text-danger" },
            { icon: UserPlus, text: "3 new admission inquiries need response", color: "text-info" },
            { icon: GraduationCap, text: "Annual function news coverage in Amar Ujala — share on social media", color: "text-success" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-surface-cream">
              <item.icon size={16} className={`mt-0.5 ${item.color}`} />
              <span className="text-sm text-text-light">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
