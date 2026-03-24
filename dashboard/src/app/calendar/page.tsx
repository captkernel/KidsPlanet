import PageHeader from "@/components/PageHeader";
import { Calendar, Plus } from "lucide-react";

const events = [
  { date: "2026-03-22", title: "Annual Function", type: "event", color: "bg-purple-100 text-purple-700" },
  { date: "2026-03-25", title: "Parent-Teacher Meeting", type: "ptm", color: "bg-blue-100 text-blue-700" },
  { date: "2026-03-31", title: "Academic Year Ends", type: "academic", color: "bg-amber-100 text-amber-700" },
  { date: "2026-04-01", title: "New Session Begins (2026-27)", type: "academic", color: "bg-green-100 text-green-700" },
  { date: "2026-04-14", title: "Ambedkar Jayanti — Holiday", type: "holiday", color: "bg-red-100 text-red-700" },
  { date: "2026-05-01", title: "May Day — Holiday", type: "holiday", color: "bg-red-100 text-red-700" },
  { date: "2026-05-15", title: "Summer Break Begins", type: "holiday", color: "bg-red-100 text-red-700" },
  { date: "2026-07-01", title: "School Reopens", type: "academic", color: "bg-green-100 text-green-700" },
  { date: "2026-08-15", title: "Independence Day", type: "event", color: "bg-orange-100 text-orange-700" },
  { date: "2026-10-02", title: "Gandhi Jayanti", type: "holiday", color: "bg-red-100 text-red-700" },
  { date: "2026-10-20", title: "Dussehra — Holiday", type: "holiday", color: "bg-red-100 text-red-700" },
  { date: "2026-11-10", title: "Diwali Break", type: "holiday", color: "bg-red-100 text-red-700" },
  { date: "2026-12-15", title: "Annual Sports Day", type: "event", color: "bg-purple-100 text-purple-700" },
  { date: "2026-12-25", title: "Christmas — Holiday", type: "holiday", color: "bg-red-100 text-red-700" },
  { date: "2027-01-26", title: "Republic Day", type: "event", color: "bg-orange-100 text-orange-700" },
  { date: "2027-03-15", title: "Annual Exams Begin", type: "academic", color: "bg-amber-100 text-amber-700" },
];

export default function CalendarPage() {
  return (
    <>
      <PageHeader
        title="School Calendar"
        subtitle="Academic year 2026-27 events and holidays"
        actions={<button className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Event</button>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming */}
        <div className="card">
          <h2 className="font-bold text-primary-dark mb-4">Upcoming Events</h2>
          <div className="space-y-3">
            {events.filter((e) => e.date >= "2026-03-24").slice(0, 8).map((event) => (
              <div key={event.date + event.title} className="flex items-center gap-3 p-3 rounded-lg bg-surface-cream">
                <div className="text-center flex-shrink-0 w-12">
                  <div className="text-lg font-bold text-primary">{new Date(event.date).getDate()}</div>
                  <div className="text-[10px] text-text-muted uppercase">{new Date(event.date).toLocaleString("en", { month: "short" })}</div>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-primary-dark">{event.title}</div>
                </div>
                <span className={`badge ${event.color}`}>{event.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Full year list */}
        <div className="card">
          <h2 className="font-bold text-primary-dark mb-4">Full Year Calendar</h2>
          <div className="space-y-2">
            {events.map((event) => (
              <div key={event.date + event.title} className="flex items-center gap-3 py-2 border-b border-primary/5 last:border-0">
                <Calendar size={14} className="text-text-muted" />
                <span className="text-xs text-text-muted w-20">{event.date}</span>
                <span className="text-sm text-text-light flex-1">{event.title}</span>
                <span className={`badge text-[10px] ${event.color}`}>{event.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
