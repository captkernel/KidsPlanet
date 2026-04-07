"use client";

import { useState } from "react";
import type { TemplateField } from "@/data/templates";
import MediaPicker from "./MediaPicker";

interface CustomizeFormProps {
  fields: TemplateField[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

export default function CustomizeForm({ fields, values, onChange }: CustomizeFormProps) {
  const [mediaPickerKey, setMediaPickerKey] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {fields.map((field) => {
        const value = values[field.key] ?? field.default;

        return (
          <div key={field.key}>
            <label
              htmlFor={`field-${field.key}`}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {field.label}
            </label>

            {field.type === "textarea" ? (
              <textarea
                id={`field-${field.key}`}
                value={value}
                onChange={(e) => onChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                rows={4}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 resize-y"
              />
            ) : field.type === "image" ? (
              <div className="space-y-2">
                {/* Thumbnail preview */}
                {value && (
                  <div className="relative h-20 w-32 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={value}
                      alt={field.label}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setMediaPickerKey(field.key)}
                    className="rounded-lg bg-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-800"
                  >
                    Choose Image
                  </button>
                  {value && (
                    <button
                      type="button"
                      onClick={() => onChange(field.key, "")}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-500 transition hover:bg-gray-50"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <input
                  id={`field-${field.key}`}
                  type="text"
                  value={value}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  placeholder="Or paste an image URL..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            ) : field.type === "color" ? (
              <div className="flex items-center gap-3">
                <input
                  id={`field-${field.key}`}
                  type="color"
                  value={value || "#000000"}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  className="h-10 w-14 cursor-pointer rounded border border-gray-300 p-1"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  placeholder="#000000"
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                />
              </div>
            ) : (
              <input
                id={`field-${field.key}`}
                type={field.type === "date" ? "date" : field.type === "year" ? "number" : "text"}
                value={value}
                onChange={(e) => onChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
              />
            )}
          </div>
        );
      })}

      {/* Media Picker modal — single instance, shared across all image fields */}
      <MediaPicker
        open={mediaPickerKey !== null}
        onClose={() => setMediaPickerKey(null)}
        onSelect={(src) => {
          if (mediaPickerKey) {
            onChange(mediaPickerKey, src);
          }
          setMediaPickerKey(null);
        }}
      />
    </div>
  );
}
