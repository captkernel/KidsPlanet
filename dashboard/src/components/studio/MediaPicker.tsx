"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { MEDIA_LIBRARY, MEDIA_CATEGORIES, type MediaCategory } from "@/data/media-library";

interface MediaPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (src: string) => void;
}

export default function MediaPicker({ open, onClose, onSelect }: MediaPickerProps) {
  const [activeCategory, setActiveCategory] = useState<MediaCategory | "all">("all");
  const [search, setSearch] = useState("");

  // Reset state when opened
  useEffect(() => {
    if (open) {
      setActiveCategory("all");
      setSearch("");
    }
  }, [open]);

  // Escape key handler
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const filteredImages = useMemo(() => {
    let items = MEDIA_LIBRARY;
    if (activeCategory !== "all") {
      items = items.filter((item) => item.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.alt.toLowerCase().includes(q) ||
          item.src.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q),
      );
    }
    return items;
  }, [activeCategory, search]);

  const handleSelect = useCallback(
    (src: string) => {
      onSelect(src);
      onClose();
    },
    [onSelect, onClose],
  );

  if (!open) return null;

  const categories = Object.entries(MEDIA_CATEGORIES) as [MediaCategory, string][];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex h-[90vh] w-[90vw] max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Media Library</h2>
            <p className="text-sm text-gray-500">
              {filteredImages.length} image{filteredImages.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="4" x2="16" y2="16" />
              <line x1="16" y1="4" x2="4" y2="16" />
            </svg>
          </button>
        </div>

        {/* Search + Category Tabs */}
        <div className="border-b px-6 py-3">
          {/* Search bar */}
          <div className="mb-3">
            <input
              type="text"
              placeholder="Search images..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            />
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                activeCategory === "all"
                  ? "bg-green-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {categories.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                  activeCategory === key
                    ? "bg-green-700 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Image Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredImages.length === 0 ? (
            <div className="flex h-40 items-center justify-center text-gray-400">
              No images found
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-5">
              {filteredImages.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.src)}
                  className="group relative aspect-square overflow-hidden rounded-xl border-2 border-transparent bg-gray-100 transition hover:border-green-500 hover:shadow-lg focus:border-green-500 focus:outline-none"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100">
                    <div className="w-full px-3 pb-3">
                      <p className="text-xs font-medium text-white leading-snug">{item.alt}</p>
                      <p className="mt-0.5 text-[10px] text-white/60">
                        {MEDIA_CATEGORIES[item.category]}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
