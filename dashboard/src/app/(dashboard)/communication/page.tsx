"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Megaphone, Send, MessageCircle, Bell, Gift, Calendar as CalendarIcon } from "lucide-react";

const announcements = [
  { id: "1", title: "Admissions Open for 2026-27", date: "2026-03-15", type: "general", status: "published" },
  { id: "2", title: "Annual Day — March 22, 2026", date: "2026-03-10", type: "event", status: "published" },
  { id: "3", title: "Holi Holiday — March 14", date: "2026-03-08", type: "holiday", status: "published" },
];

const whatsappTemplates = [
  { id: "1", name: "Admission Inquiry Response", message: "Hello! Thank you for your interest in Kids Planet. We'd love to tell you more about our school. Would you like to schedule a visit? Our office hours are Mon-Fri 9 AM - 3 PM. — Kids Planet, Kullu" },
  { id: "2", name: "Fee Reminder", message: "Dear Parent, this is a gentle reminder that the fee for Q4 (2025-26) is due. Please visit the school office or contact us at +91 98180 97475 for payment options. — Kids Planet" },
  { id: "3", name: "Event Announcement", message: "Dear Parents, we are pleased to invite you to [EVENT NAME] on [DATE] at [TIME]. Your child's participation will make it special! — Kids Planet, Kullu" },
  { id: "4", name: "Holiday Notice", message: "Dear Parents, please note that the school will remain closed on [DATE] on account of [REASON]. Classes will resume on [RESUME DATE]. — Kids Planet" },
];

const typeIcons: Record<string, typeof Bell> = { general: Bell, event: Gift, holiday: CalendarIcon };

export default function CommunicationPage() {
  const [tab, setTab] = useState<"announcements" | "whatsapp">("announcements");
  const [showCreate, setShowCreate] = useState(false);

  return (
    <>
      <PageHeader
        title="Communication"
        subtitle="Manage announcements and parent messaging"
        actions={
          <button className="btn-primary flex items-center gap-2" onClick={() => setShowCreate(true)}>
            <Megaphone size={16} /> New Announcement
          </button>
        }
      />

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("announcements")} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "announcements" ? "bg-primary text-white" : "bg-surface text-text-light"}`}>
          Announcements
        </button>
        <button onClick={() => setTab("whatsapp")} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "whatsapp" ? "bg-primary text-white" : "bg-surface text-text-light"}`}>
          WhatsApp Templates
        </button>
      </div>

      {tab === "announcements" && (
        <div className="space-y-3">
          {announcements.map((ann) => {
            const Icon = typeIcons[ann.type] || Bell;
            return (
              <div key={ann.id} className="card !p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-primary-dark">{ann.title}</div>
                    <div className="text-xs text-text-muted">{ann.date} · {ann.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="badge bg-green-100 text-green-700">{ann.status}</span>
                  <button className="btn-secondary text-xs">Edit</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "whatsapp" && (
        <div className="space-y-4">
          <p className="text-sm text-text-muted mb-4">Pre-written templates for quick WhatsApp communication with parents. Click to copy.</p>
          {whatsappTemplates.map((tpl) => (
            <div key={tpl.id} className="card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-sm text-primary-dark flex items-center gap-2">
                  <MessageCircle size={16} className="text-green-600" />
                  {tpl.name}
                </h3>
                <button
                  onClick={() => { navigator.clipboard.writeText(tpl.message); alert("Copied to clipboard!"); }}
                  className="btn-secondary text-xs flex items-center gap-1"
                >
                  <Send size={12} /> Copy
                </button>
              </div>
              <p className="text-sm text-text-light bg-surface-cream rounded-lg p-3 leading-relaxed">{tpl.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-bold text-lg text-primary-dark mb-4">New Announcement</h2>
            <div className="space-y-4">
              <div><label className="label">Title</label><input className="input" placeholder="e.g., Summer Vacation Notice" /></div>
              <div><label className="label">Type</label>
                <select className="input"><option>general</option><option>event</option><option>holiday</option><option>exam</option></select>
              </div>
              <div><label className="label">Content</label><textarea className="input" rows={4} placeholder="Announcement details..." /></div>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowCreate(false)} className="btn-secondary">Cancel</button>
                <button onClick={() => { setShowCreate(false); alert("Announcement created! (Demo)"); }} className="btn-primary">Publish</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
