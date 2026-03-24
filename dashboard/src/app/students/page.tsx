"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { students } from "@/data/students";
import { SCHOOL, CLASS_COLORS } from "@/lib/constants";
import { Search, UserPlus, Phone } from "lucide-react";

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.parentName.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase());
    const matchClass = classFilter === "all" || s.class === classFilter;
    return matchSearch && matchClass && s.status === "active";
  });

  return (
    <>
      <PageHeader
        title="Students"
        subtitle={`${students.filter((s) => s.status === "active").length} active students`}
        actions={<button className="btn-primary flex items-center gap-2"><UserPlus size={16} /> Add Student</button>}
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by name, parent, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="input w-auto"
        >
          <option value="all">All Classes</option>
          {SCHOOL.classes.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-primary/10 bg-surface-cream">
                <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Student</th>
                <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Class</th>
                <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3 hidden md:table-cell">Parent</th>
                <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Phone</th>
                <th className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3">Fee</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <tr key={student.id} className="border-b border-primary/5 hover:bg-surface-cream/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${student.gender === "M" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"}`}>
                        {student.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-primary-dark">{student.name}</div>
                        <div className="text-xs text-text-muted">{student.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${CLASS_COLORS[student.class] || "bg-gray-100 text-gray-700"}`}>
                      {student.class}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-light hidden md:table-cell">{student.parentName}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <a href={`tel:${student.parentPhone}`} className="flex items-center gap-1 text-sm text-primary hover:underline">
                      <Phone size={12} /> {student.parentPhone}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${
                      student.feeStatus === "paid" ? "bg-green-100 text-green-700" :
                      student.feeStatus === "partial" ? "bg-amber-100 text-amber-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {student.feeStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-muted text-sm">No students found matching your search.</div>
        )}
      </div>
    </>
  );
}
