"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import {
  TEMPLATES,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  type TemplateCategory,
} from "@/data/templates";
import { Modal } from "@/components/shared/Modal";

const CATEGORIES = Object.keys(CATEGORY_LABELS) as TemplateCategory[];

const SIZE_PRESETS = [
  { label: "Instagram Post", width: 1080, height: 1080 },
  { label: "Instagram Story", width: 1080, height: 1920 },
  { label: "A4 Print", width: 794, height: 1123 },
  { label: "Facebook Cover", width: 1200, height: 628 },
];

export default function ContentStudioPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<TemplateCategory | "all">("all");
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [customWidth, setCustomWidth] = useState("1080");
  const [customHeight, setCustomHeight] = useState("1080");

  const filtered =
    filter === "all"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === filter);

  const counts: Record<string, number> = { all: TEMPLATES.length };
  for (const cat of CATEGORIES) {
    counts[cat] = TEMPLATES.filter((t) => t.category === cat).length;
  }

  const handlePresetSelect = (width: number, height: number) => {
    setShowSizeModal(false);
    router.push(`/content-studio/blank?w=${width}&h=${height}`);
  };

  const handleCustomSelect = () => {
    const w = Math.max(1, parseInt(customWidth, 10) || 1080);
    const h = Math.max(1, parseInt(customHeight, 10) || 1080);
    setShowSizeModal(false);
    router.push(`/content-studio/blank?w=${w}&h=${h}`);
  };

  return (
    <>
      <PageHeader
        title="Planet Studio"
        subtitle="Create and customize marketing materials, flyers, and social media content"
      />

      {/* Category filter buttons */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            filter === "all"
              ? "bg-primary text-white"
              : "bg-surface text-text-light hover:bg-surface-muted"
          }`}
        >
          All Templates ({counts.all})
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === cat
                ? "bg-primary text-white"
                : "bg-surface text-text-light hover:bg-surface-muted"
            }`}
          >
            {CATEGORY_LABELS[cat]} ({counts[cat]})
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Blank Canvas card — always first */}
        <button
          onClick={() => setShowSizeModal(true)}
          className="card border-2 border-dashed border-gray-300 rounded-2xl hover:border-primary hover:shadow-md transition-all group text-left"
        >
          <div className="aspect-[4/3] rounded-lg flex flex-col items-center justify-center mb-4 text-gray-400 group-hover:text-primary transition-colors">
            <Plus size={32} strokeWidth={1.5} />
          </div>
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-primary-dark">Blank Canvas</h3>
              <p className="text-xs text-text-muted mt-1">Start from scratch</p>
            </div>
          </div>
          <div className="text-xs text-text-muted mt-2">Custom size &middot; All tools</div>
        </button>

        {filtered.map((template) => (
          <Link
            key={template.id}
            href={`/content-studio/${template.id}`}
            className="card hover:shadow-md transition-shadow group block"
          >
            {/* Preview area */}
            <div className="aspect-[4/3] rounded-lg bg-gradient-to-br from-primary-dark to-primary mb-4 flex items-center justify-center relative overflow-hidden">
              <div className="text-center text-white/80">
                <div className="text-sm font-semibold">{template.name}</div>
                <div className="text-xs opacity-60 mt-1">
                  {template.width} x {template.height}
                </div>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-sm font-medium bg-black/40 px-4 py-2 rounded-lg">
                  Customize
                </span>
              </div>
            </div>

            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0 mr-2">
                <h3 className="font-bold text-sm text-primary-dark truncate">
                  {template.name}
                </h3>
                <p className="text-xs text-text-muted mt-1 line-clamp-2">
                  {template.description}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
                  CATEGORY_COLORS[template.category]
                }`}
              >
                {CATEGORY_LABELS[template.category]}
              </span>
            </div>

            <div className="text-xs text-text-muted mt-2">
              {template.width} x {template.height}px &middot;{" "}
              {template.fields.length} fields
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          No templates found in this category.
        </div>
      )}

      {/* Size selection modal */}
      <Modal
        open={showSizeModal}
        onClose={() => setShowSizeModal(false)}
        title="Choose Canvas Size"
        size="md"
      >
        <div className="space-y-3">
          <p className="text-sm text-text-muted mb-4">
            Select a preset size or enter custom dimensions.
          </p>

          {/* Presets */}
          <div className="grid grid-cols-2 gap-3">
            {SIZE_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePresetSelect(preset.width, preset.height)}
                className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-surface-muted hover:border-primary hover:bg-primary/5 transition-all group"
              >
                <span className="font-semibold text-sm text-primary-dark group-hover:text-primary">
                  {preset.label}
                </span>
                <span className="text-xs text-text-muted mt-1">
                  {preset.width} &times; {preset.height}
                </span>
              </button>
            ))}
          </div>

          {/* Custom size */}
          <div className="border-t border-surface-muted pt-4 mt-4">
            <p className="text-sm font-medium text-primary-dark mb-3">Custom Size</p>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-xs text-text-muted mb-1">Width (px)</label>
                <input
                  type="number"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(e.target.value)}
                  min={1}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <span className="text-text-muted mt-5">&times;</span>
              <div className="flex-1">
                <label className="block text-xs text-text-muted mb-1">Height (px)</label>
                <input
                  type="number"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(e.target.value)}
                  min={1}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
              <button
                onClick={handleCustomSelect}
                className="btn-primary mt-5 whitespace-nowrap"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
