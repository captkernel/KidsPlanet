import type { Metadata } from "next";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import AchievementCard from "@/components/AchievementCard";
import FadeIn from "@/components/FadeIn";
import { SCHOOL } from "@/lib/constants";
import achievements from "@/content/achievements.json";

export const metadata: Metadata = {
  title: "Achievements",
  description: `Awards, results, and achievements of students at ${SCHOOL.name}, Kullu. Academic excellence and cultural milestones.`,
  keywords: ["Kids Planet achievements", "school results Kullu", "student awards Kullu", "HPBOSE results", "school sports Kullu"],
};

export default function AchievementsPage() {
  const sorted = [...achievements].sort(
    (a, b) => parseInt(b.year) - parseInt(a.year)
  );

  return (
    <>
      <section className="section-padding bg-surface-cream">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark">
            Achievements
          </h1>
          <p className="mt-6 text-text-light text-lg leading-relaxed">
            Celebrating the accomplishments of our students and school — from
            academic excellence to sports and cultural milestones.
          </p>

          {/* Trophy photo */}
          <div className="relative mt-8 aspect-[3/1] max-w-2xl mx-auto rounded-xl overflow-hidden">
            <Image
              src="/images/events/trophy-ceremony.jpg"
              alt="Students celebrating a trophy win at Kids Planet"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
              priority
            />
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            title="Our Milestones"
            subtitle="Highlights from recent years"
          />
          <div className="space-y-4">
            {sorted.map((achievement, i) => (
              <FadeIn key={achievement.id} delay={i * 0.05}>
                <AchievementCard achievement={achievement} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
