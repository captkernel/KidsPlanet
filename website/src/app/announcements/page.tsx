import type { Metadata } from "next";
import AnnouncementList from "@/components/AnnouncementList";
import { SCHOOL } from "@/lib/constants";
import announcements from "@/content/announcements.json";

export const metadata: Metadata = {
  title: "Announcements",
  description: `Latest news, notices, and updates from ${SCHOOL.name}, Kullu.`,
};

export default function AnnouncementsPage() {
  return (
    <>
      <section className="section-padding bg-surface-cream">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark">
            Announcements
          </h1>
          <p className="mt-6 text-text-light text-lg leading-relaxed">
            Stay updated with the latest news, events, and notices from Kids
            Planet.
          </p>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="max-w-3xl mx-auto">
          <AnnouncementList announcements={announcements} />
        </div>
      </section>
    </>
  );
}
