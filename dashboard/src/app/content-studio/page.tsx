"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Palette, FileText, Image, BookOpen, Eye, Download } from "lucide-react";

const templates = [
  { id: "flyer-admission", name: "Admission Flyer", type: "flyer", format: "A4", desc: "Print-ready admission flyer with school info and CTA", icon: FileText },
  { id: "brochure-school", name: "School Brochure", type: "brochure", format: "A4 (2-page)", desc: "Comprehensive school brochure with programs and USPs", icon: BookOpen },
  { id: "instagram-admission", name: "Admissions Open", type: "instagram", format: "1080×1080", desc: "Instagram ad announcing admissions for 2026-27", icon: Image },
  { id: "instagram-whyUs", name: "Why Kids Planet?", type: "instagram", format: "1080×1080", desc: "Positioning ad — Kullu's only dedicated preschool", icon: Image },
  { id: "instagram-testimonial", name: "Parent Reviews", type: "instagram", format: "1080×1080", desc: "Social proof ad with 4.4★ rating", icon: Image },
  { id: "instagram-seats", name: "Limited Seats", type: "instagram", format: "1080×1080", desc: "Urgency ad — seats filling fast", icon: Image },
  { id: "instagram-founder", name: "Founder Story", type: "instagram", format: "1080×1080", desc: "Emotional ad — A School Built on Love", icon: Image },
  { id: "story-admission", name: "Admission Story", type: "story", format: "1080×1920", desc: "Instagram story for admissions", icon: Image },
  { id: "story-dayInLife", name: "Day in Life Story", type: "story", format: "1080×1920", desc: "Instagram story showing daily schedule", icon: Image },
];

const typeLabels: Record<string, string> = { flyer: "Flyers", brochure: "Brochures", instagram: "Instagram Posts", story: "Stories" };
const typeColors: Record<string, string> = {
  flyer: "bg-blue-100 text-blue-700",
  brochure: "bg-purple-100 text-purple-700",
  instagram: "bg-pink-100 text-pink-700",
  story: "bg-amber-100 text-amber-700",
};

export default function ContentStudioPage() {
  const [filter, setFilter] = useState("all");
  const [preview, setPreview] = useState<string | null>(null);

  const filtered = filter === "all" ? templates : templates.filter((t) => t.type === filter);

  return (
    <>
      <PageHeader
        title="Content Studio"
        subtitle="Generate marketing materials, flyers, and social media content"
        actions={
          <button className="btn-primary flex items-center gap-2" onClick={() => alert("Generating all materials... (Demo)")}>
            <Palette size={16} /> Generate All
          </button>
        }
      />

      {/* Type filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {["all", ...Object.keys(typeLabels)].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${
              filter === type ? "bg-primary text-white" : "bg-surface text-text-light hover:bg-surface-muted"
            }`}
          >
            {type === "all" ? "All Templates" : typeLabels[type]}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((template) => {
          const Icon = template.icon;
          return (
            <div key={template.id} className="card hover:shadow-md transition-shadow">
              {/* Preview area */}
              <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-primary-dark to-primary mb-4 flex items-center justify-center relative overflow-hidden">
                <div className="text-center text-white/80">
                  <Icon size={32} className="mx-auto mb-2" />
                  <div className="text-sm font-semibold">{template.name}</div>
                  <div className="text-xs opacity-60">{template.format}</div>
                </div>
              </div>

              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-sm text-primary-dark">{template.name}</h3>
                  <p className="text-xs text-text-muted mt-1">{template.desc}</p>
                </div>
                <span className={`badge ${typeColors[template.type]}`}>{template.type}</span>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setPreview(template.id)}
                  className="btn-secondary flex-1 flex items-center justify-center gap-1 text-xs"
                >
                  <Eye size={14} /> Preview
                </button>
                <button
                  onClick={() => {
                    const url = `/marketing/output/${template.id}.html`;
                    window.open(url, "_blank");
                  }}
                  className="btn-primary flex-1 flex items-center justify-center gap-1 text-xs"
                >
                  <Download size={14} /> Open
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-primary-dark">{templates.find((t) => t.id === preview)?.name}</h3>
              <button onClick={() => setPreview(null)} className="text-text-muted hover:text-primary-dark">✕</button>
            </div>
            <div className="p-4 text-center text-text-muted">
              <p className="mb-4">Preview renders in a new browser tab for accurate sizing.</p>
              <button
                onClick={() => {
                  window.open(`/marketing/output/${preview}.html`, "_blank");
                  setPreview(null);
                }}
                className="btn-primary"
              >
                Open Full Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
