"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
}

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const categories = ["all", ...new Set(images.map((img) => img.category))];
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? images
      : images.filter((img) => img.category === activeCategory);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
              activeCategory === cat
                ? "bg-primary text-white"
                : "bg-surface-muted text-text-light hover:bg-primary/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((img) => (
          <div
            key={img.id}
            className="relative aspect-[4/3] rounded-xl overflow-hidden bg-surface-muted group"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="absolute bottom-3 left-3 right-3 text-white text-sm">
                {img.alt}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-text-muted py-12">
          No photos in this category yet.
        </p>
      )}
    </div>
  );
}

export default GalleryGrid;
