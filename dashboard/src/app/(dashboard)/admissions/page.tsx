"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import { inquiries, seatData, getAdmissionStats } from "@/data/admissions";
import { UserPlus, Users, CheckCircle, XCircle, Eye, Phone, MessageCircle } from "lucide-react";

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  contacted: "bg-amber-100 text-amber-700",
  visited: "bg-purple-100 text-purple-700",
  enrolled: "bg-green-100 text-green-700",
  declined: "bg-red-100 text-red-700",
};

export default function AdmissionsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const stats = getAdmissionStats();

  const filtered = statusFilter === "all" ? inquiries : inquiries.filter((i) => i.status === statusFilter);

  return (
    <>
      <PageHeader
        title="Admissions"
        subtitle="Track inquiries and manage enrollment"
        actions={<button className="btn-primary flex items-center gap-2"><UserPlus size={16} /> New Inquiry</button>}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Inquiries" value={stats.total} icon={Users} color="primary" />
        <StatCard label="New (Uncontacted)" value={stats.new} icon={UserPlus} color="warning" />
        <StatCard label="Enrolled" value={stats.enrolled} icon={CheckCircle} color="success" />
        <StatCard label="Conversion Rate" value={`${Math.round((stats.enrolled / stats.total) * 100)}%`} icon={Eye} color="info" />
      </div>

      {/* Seat Availability */}
      <div className="card mb-6">
        <h2 className="font-bold text-primary-dark mb-4">Seat Availability</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {seatData.slice(0, 6).map((seat) => {
            const remaining = seat.totalSeats - seat.filledSeats;
            const pct = (seat.filledSeats / seat.totalSeats) * 100;
            return (
              <div key={seat.className} className="text-center p-3 rounded-lg bg-surface-cream">
                <div className="text-xs font-semibold text-text-muted mb-2">{seat.className}</div>
                <div className="w-full h-2 bg-surface-muted rounded-full overflow-hidden mb-1">
                  <div className={`h-full rounded-full ${remaining <= 5 ? "bg-danger" : "bg-primary"}`} style={{ width: `${pct}%` }} />
                </div>
                <div className={`text-xs font-bold ${remaining <= 5 ? "text-danger" : "text-text-muted"}`}>
                  {remaining} left
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {["all", "new", "contacted", "visited", "enrolled", "declined"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${
              statusFilter === s ? "bg-primary text-white" : "bg-surface text-text-light hover:bg-surface-muted"
            }`}
          >
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>

      {/* Inquiry list */}
      <div className="space-y-3">
        {filtered.map((inq) => (
          <div key={inq.id} className="card !p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                  {inq.childName[0]}
                </div>
                <div>
                  <div className="font-semibold text-sm text-primary-dark">{inq.childName} <span className="text-text-muted font-normal">({inq.childAge} yrs)</span></div>
                  <div className="text-xs text-text-muted">Parent: {inq.parentName} · {inq.classApplied}</div>
                  <div className="text-xs text-text-light mt-1">{inq.notes}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge ${statusColors[inq.status]}`}>{inq.status}</span>
                <span className="text-xs text-text-muted">{inq.date}</span>
                <a href={`tel:${inq.phone}`} className="p-1.5 rounded-lg hover:bg-surface-muted"><Phone size={14} className="text-primary" /></a>
                <a href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-surface-muted">
                  <MessageCircle size={14} className="text-green-600" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
