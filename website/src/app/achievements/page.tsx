import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import AchievementCard from "@/components/AchievementCard";
import FadeIn from "@/components/FadeIn";
import { SCHOOL } from "@/lib/constants";
import achievements from "@/content/achievements.json";

export const metadata: Metadata = {
  title: "Achievements",
  description: `Awards, results, and achievements of students at ${SCHOOL.name}, Kullu. Academic excellence and cultural milestones.`,
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
