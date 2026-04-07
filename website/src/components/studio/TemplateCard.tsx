"use client";
import Link from "next/link";
import type { TemplateDefinition } from "@/data/templates";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/data/templates";
import TemplateRenderer from "./TemplateRenderer";

interface TemplateCardProps {
  template: TemplateDefinition;
  onPreview: (template: TemplateDefinition) => void;
}

export default function TemplateCard({ template, onPreview }: TemplateCardProps) {
  // Build default field values for the mini preview
  const defaultFields: Record<string, string> = {};
  for (const field of template.fields) {
    defaultFields[field.key] = field.default;
  }

  // Calculate scale to fit in a ~240px wide card
  const previewWidth = 240;
  const scale = previewWidth / template.width;

  return (
    <div className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      {/* Mini preview */}
      <div className="relative overflow-hidden border-b border-gray-100 bg-gray-50">
        <div className="pointer-events-none">
          <TemplateRenderer
            templateId={template.id}
            fields={defaultFields}
            width={template.width}
            height={template.height}
            scale={scale}
          />
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <span
            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[template.category]}`}
          >
            {CATEGORY_LABELS[template.category]}
          </span>
          <span className="text-xs text-gray-400">
            {template.width}&times;{template.height}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-gray-900">{template.name}</h3>
        <p className="mt-1 text-xs text-gray-500 line-clamp-2">{template.description}</p>

        {/* Actions */}
        <div className="mt-3 flex items-center gap-2">
          <Link
            href={`/content-studio/${template.id}`}
            className="flex-1 rounded-lg bg-green-700 px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-green-800 transition-colors"
          >
            Customize
          </Link>
          <button
            onClick={() => onPreview(template)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Preview
          </button>
        </div>
      </div>
    </div>
  );
}
