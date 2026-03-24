import type { Metadata } from "next";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import FacultyCard from "@/components/FacultyCard";
import FadeIn from "@/components/FadeIn";
import { SCHOOL } from "@/lib/constants";
import faculty from "@/content/faculty.json";

export const metadata: Metadata = {
  title: "Our Faculty",
  description: `Meet the dedicated teachers at ${SCHOOL.name}, Kullu. Led by ${SCHOOL.founder} with ${faculty.length} experienced educators.`,
};

export default function FacultyPage() {
  const principal = faculty.filter((f) => f.featured);
  const teachers = faculty.filter((f) => !f.featured);

  return (
    <>
      <section className="section-padding bg-surface-cream">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark">
            Our Faculty
          </h1>
          <p className="mt-6 text-text-light text-lg leading-relaxed">
            A team of dedicated and experienced educators committed to
            nurturing every child&apos;s potential.
          </p>

          {/* Faculty group photo */}
          <div className="relative mt-8 aspect-[2/1] max-w-2xl mx-auto rounded-xl overflow-hidden">
            <Image
              src="/images/faculty/faculty-group.jpg"
              alt="Kids Planet faculty team"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
              priority
            />
          </div>
        </div>
      </section>

      {/* Principal / Featured */}
      <section className="section-padding bg-surface">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            label="Leadership"
            title="School Principal"
          />
          {principal.map((member, i) => (
            <FadeIn key={member.id} delay={i * 0.1}>
              <FacultyCard member={member} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Teaching Staff */}
      <section className="section-padding bg-surface-cream">
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            label="Teaching Staff"
            title="Meet Our Teachers"
            subtitle="Qualified professionals with years of experience in education"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teachers.map((member, i) => (
              <FadeIn key={member.id} delay={i * 0.1}>
                <FacultyCard member={member} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-surface text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm text-text-muted">
            Interested in joining our team? We are always looking for passionate
            educators. Contact us at <strong>+91 98180 97475</strong> for current openings.
          </p>
        </div>
      </section>
    </>
  );
}
