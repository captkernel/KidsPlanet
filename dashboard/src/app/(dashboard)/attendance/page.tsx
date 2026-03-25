"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { students } from "@/data/students";
import { SCHOOL } from "@/lib/constants";
import { Check, X, Clock } from "lucide-react";

type AttendanceStatus = "present" | "absent" | "late" | null;

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState("Playgroup");
  const [date] = useState(new Date().toISOString().split("T")[0]);
  const classStudents = students.filter((s) => s.class === selectedClass && s.status === "active");

  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});

  const mark = (id: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({ ...prev, [id]: prev[id] === status ? null : status }));
  };

  const marked = Object.values(attendance).filter(Boolean).length;
  const present = Object.values(attendance).filter((v) => v === "present").length;
  const absent = Object.values(attendance).filter((v) => v === "absent").length;

  return (
    <>
      <PageHeader
        title="Attendance"
        subtitle={`Mark attendance for ${date}`}
        actions={
          <button
            className="btn-primary"
            disabled={marked === 0}
            onClick={() => alert("Attendance saved! (Demo mode)")}
          >
            Save Attendance ({marked}/{classStudents.length})
          </button>
        }
      />

      {/* Class selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {SCHOOL.classes.map((c) => {
          const count = students.filter((s) => s.class === c && s.status === "active").length;
          return (
            <button
              key={c}
              onClick={() => { setSelectedClass(c); setAttendance({}); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedClass === c ? "bg-primary text-white" : "bg-surface text-text-light hover:bg-surface-muted"
              }`}
            >
              {c} {count > 0 && <span className="text-xs opacity-70">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="card !p-4 text-center">
          <div className="text-2xl font-bold text-primary">{classStudents.length}</div>
          <div className="text-xs text-text-muted">Total</div>
        </div>
        <div className="card !p-4 text-center">
          <div className="text-2xl font-bold text-success">{present}</div>
          <div className="text-xs text-text-muted">Present</div>
        </div>
        <div className="card !p-4 text-center">
          <div className="text-2xl font-bold text-danger">{absent}</div>
          <div className="text-xs text-text-muted">Absent</div>
        </div>
      </div>

      {/* Student list */}
      {classStudents.length === 0 ? (
        <div className="card text-center py-12 text-text-muted">No students in {selectedClass}</div>
      ) : (
        <div className="space-y-2">
          {classStudents.map((student) => {
            const status = attendance[student.id];
            return (
              <div key={student.id} className={`card !p-3 flex items-center justify-between ${
                status === "present" ? "!bg-green-50 border border-green-200" :
                status === "absent" ? "!bg-red-50 border border-red-200" :
                status === "late" ? "!bg-amber-50 border border-amber-200" : ""
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    student.gender === "M" ? "bg-blue-100 text-blue-700" : "bg-pink-100 text-pink-700"
                  }`}>
                    {student.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-primary-dark">{student.name}</div>
                    <div className="text-xs text-text-muted">{student.id}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => mark(student.id, "present")}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      status === "present" ? "bg-success text-white" : "bg-surface-muted text-text-muted hover:bg-green-100"
                    }`}
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => mark(student.id, "absent")}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      status === "absent" ? "bg-danger text-white" : "bg-surface-muted text-text-muted hover:bg-red-100"
                    }`}
                  >
                    <X size={16} />
                  </button>
                  <button
                    onClick={() => mark(student.id, "late")}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      status === "late" ? "bg-warning text-white" : "bg-surface-muted text-text-muted hover:bg-amber-100"
                    }`}
                  >
                    <Clock size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
