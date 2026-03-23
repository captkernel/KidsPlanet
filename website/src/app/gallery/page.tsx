import type { Metadata } from "next";
import GalleryGrid from "@/components/GalleryGrid";
import { SCHOOL } from "@/lib/constants";
import gallery from "@/content/gallery.json";

export const metadata: Metadata = {
  title: "Gallery",
  description: `Photo gallery of ${SCHOOL.name} — classrooms, events, activities, and campus life in Kullu.`,
};

export default function GalleryPage() {
  return (
    <>
      <section className="section-padding bg-surface-cream">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark">
            Gallery
          </h1>
          <p className="mt-6 text-text-light text-lg leading-relaxed">
            A glimpse into life at Kids Planet — our classrooms, events,
            activities, and celebrations.
          </p>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="max-w-7xl mx-auto">
          <GalleryGrid images={gallery} />
        </div>
      </section>
    </>
  );
}
