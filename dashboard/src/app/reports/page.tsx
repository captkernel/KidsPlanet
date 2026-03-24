import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { getStudentStats } from "@/data/students";
import { getAdmissionStats } from "@/data/admissions";
import { getFinanceStats } from "@/data/finance";
import { Users, TrendingUp, DollarSign, GraduationCap, BarChart3, PieChart } from "lucide-react";

export default function ReportsPage() {
  const studentStats = getStudentStats();
  const admissionStats = getAdmissionStats();
  const financeStats = getFinanceStats();

  return (
    <>
      <PageHeader title="Reports & Analytics" subtitle="School performance at a glance" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Students" value={studentStats.total} icon={Users} color="primary" />
        <StatCard label="Boys / Girls" value={`${studentStats.male} / ${studentStats.female}`} icon={PieChart} color="info" />
        <StatCard label="Enrollment Rate" value={`${Math.round((admissionStats.enrolled / admissionStats.total) * 100)}%`} icon={TrendingUp} color="success" />
        <StatCard label="Fee Collection" value={`${financeStats.collectionRate}%`} icon={DollarSign} color="accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment by class */}
        <div className="card">
          <h2 className="font-bold text-primary-dark mb-4 flex items-center gap-2"><BarChart3 size={18} /> Students by Class</h2>
          <div className="space-y-3">
            {Object.entries(studentStats.byClass).sort(([a], [b]) => a.localeCompare(b)).map(([cls, count]) => (
              <div key={cls} className="flex items-center gap-3">
                <span className="text-sm text-text-light w-28 truncate">{cls}</span>
                <div className="flex-1 h-6 bg-surface-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full flex items-center justify-end pr-2" style={{ width: `${Math.max((count / 5) * 100, 20)}%` }}>
                    <span className="text-[10px] font-bold text-white">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admission funnel */}
        <div className="card">
          <h2 className="font-bold text-primary-dark mb-4 flex items-center gap-2"><GraduationCap size={18} /> Admission Funnel</h2>
          <div className="space-y-4">
            {[
              { stage: "Inquiries", count: admissionStats.total, pct: 100, color: "bg-blue-500" },
              { stage: "Contacted", count: admissionStats.contacted + admissionStats.visited + admissionStats.enrolled, pct: Math.round(((admissionStats.contacted + admissionStats.visited + admissionStats.enrolled) / admissionStats.total) * 100), color: "bg-amber-500" },
              { stage: "Visited", count: admissionStats.visited + admissionStats.enrolled, pct: Math.round(((admissionStats.visited + admissionStats.enrolled) / admissionStats.total) * 100), color: "bg-purple-500" },
              { stage: "Enrolled", count: admissionStats.enrolled, pct: Math.round((admissionStats.enrolled / admissionStats.total) * 100), color: "bg-green-500" },
            ].map((stage) => (
              <div key={stage.stage}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-light">{stage.stage}</span>
                  <span className="font-semibold text-primary-dark">{stage.count} ({stage.pct}%)</span>
                </div>
                <div className="h-3 bg-surface-muted rounded-full overflow-hidden">
                  <div className={`h-full ${stage.color} rounded-full`} style={{ width: `${stage.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Finance summary */}
        <div className="card">
          <h2 className="font-bold text-primary-dark mb-4 flex items-center gap-2"><DollarSign size={18} /> Fee Collection Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-lg bg-surface-cream">
              <span className="text-sm text-text-light">Total Due</span>
              <span className="font-bold text-primary-dark">₹{financeStats.totalDue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-green-50">
              <span className="text-sm text-text-light">Collected</span>
              <span className="font-bold text-success">₹{financeStats.totalCollected.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-red-50">
              <span className="text-sm text-text-light">Outstanding</span>
              <span className="font-bold text-danger">₹{financeStats.outstanding.toLocaleString()}</span>
            </div>
            <div className="pt-2 flex gap-3 text-center">
              <div className="flex-1 p-2 rounded-lg bg-green-50"><div className="text-lg font-bold text-success">{financeStats.paid}</div><div className="text-[10px] text-text-muted">Paid</div></div>
              <div className="flex-1 p-2 rounded-lg bg-amber-50"><div className="text-lg font-bold text-warning">{financeStats.partial}</div><div className="text-[10px] text-text-muted">Partial</div></div>
              <div className="flex-1 p-2 rounded-lg bg-red-50"><div className="text-lg font-bold text-danger">{financeStats.overdue}</div><div className="text-[10px] text-text-muted">Overdue</div></div>
            </div>
          </div>
        </div>

        {/* Seat capacity */}
        <div className="card">
          <h2 className="font-bold text-primary-dark mb-4 flex items-center gap-2"><PieChart size={18} /> Seat Utilization</h2>
          <div className="text-center py-4">
            <div className="text-4xl font-bold text-primary">{Math.round((admissionStats.filledSeats / admissionStats.totalSeats) * 100)}%</div>
            <div className="text-sm text-text-muted mt-1">Overall Capacity Used</div>
            <div className="text-xs text-text-light mt-2">{admissionStats.filledSeats} of {admissionStats.totalSeats} seats filled</div>
          </div>
          <div className="w-full h-4 bg-surface-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: `${(admissionStats.filledSeats / admissionStats.totalSeats) * 100}%` }} />
          </div>
        </div>
      </div>
    </>
  );
}
