"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import {
  TEMPLATES,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  type TemplateCategory,
} from "@/data/templates";

const CATEGORIES = Object.keys(CATEGORY_LABELS) as TemplateCategory[];

export default function ContentStudioPage() {
  const [filter, setFilter] = useState<TemplateCategory | "all">("all");

  const filtered =
    filter === "all"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === filter);

  const counts: Record<string, number> = { all: TEMPLATES.length };
  for (const cat of CATEGORIES) {
    counts[cat] = TEMPLATES.filter((t) => t.category === cat).length;
  }

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
    </>
  );
}
