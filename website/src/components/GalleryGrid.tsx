"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
}

function Lightbox({
  images,
  index,
  onClose,
  onNav,
}: {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onNav: (newIndex: number) => void;
}) {
  const img = images[index];

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && index > 0) onNav(index - 1);
      if (e.key === "ArrowRight" && index < images.length - 1) onNav(index + 1);
    },
    [index, images.length, onClose, onNav],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 text-white/80 hover:text-white text-3xl leading-none p-2"
        aria-label="Close lightbox"
      >
        &times;
      </button>

      {/* Left arrow */}
      {index > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNav(index - 1);
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white/80 hover:text-white text-4xl leading-none p-2"
          aria-label="Previous photo"
        >
          &#8249;
        </button>
      )}

      {/* Right arrow */}
      {index < images.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNav(index + 1);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white/80 hover:text-white text-4xl leading-none p-2"
          aria-label="Next photo"
        >
          &#8250;
        </button>
      )}

      {/* Image container */}
      <div
        className="relative max-w-[90vw] max-h-[85vh] w-full h-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-full max-w-4xl max-h-[75vh]">
          <Image
            src={img.src}
            alt={img.alt}
            fill
            className="object-contain"
            sizes="90vw"
            priority
          />
        </div>
        <p className="text-white text-sm mt-4 text-center px-4">{img.alt}</p>
      </div>
    </div>
  );
}

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const categories = ["all", ...new Set(images.map((img) => img.category))];
  const [activeCategory, setActiveCategory] = useState("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
        {filtered.map((img, idx) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setLightboxIndex(idx)}
            className="relative aspect-[4/3] rounded-xl overflow-hidden bg-surface-muted group cursor-pointer text-left"
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
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-text-muted py-12">
          No photos in this category yet.
        </p>
      )}

      {lightboxIndex !== null && (
        <Lightbox
          images={filtered}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNav={(newIndex) => setLightboxIndex(newIndex)}
        />
      )}
    </div>
  );
}

export default GalleryGrid;
