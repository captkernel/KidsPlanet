import Image from "next/image";
import { SCHOOL } from "@/lib/constants";
import SectionHeading from "@/components/SectionHeading";
import FadeIn from "@/components/FadeIn";

export default function FounderSpotlight() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          label="Our Story"
          title="A School Built on Love"
          subtitle="Not a franchise. Not an institution. A family's vision for Kullu's children."
        />

        <FadeIn>
          <div className="trust-strip mx-auto max-w-3xl flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {/* Founder photo */}
            <div className="relative h-28 w-28 shrink-0 rounded-full overflow-hidden ring-4 ring-primary/20">
              <Image
                src="/images/founders/founders-portrait.jpg"
                alt="Mrs. Neeta Parmar and Mr. Ranjeet Parmar — Founders of Kids Planet"
                fill
                className="object-cover"
                sizes="112px"
              />
            </div>

            {/* Bio content */}
            <div>
              <h3 className="text-xl font-bold text-primary-dark">
                {SCHOOL.founder} &amp; Mr. Ranjeet Parmar
              </h3>
              <p className="text-sm font-semibold text-accent">
                Founders, Kids Planet &middot; Est. 2010
              </p>
              <p className="mt-3 text-text-light leading-relaxed">
                In 2010, when Kullu Valley had no dedicated preschool, Mrs. Neeta Parmar
                saw a gap that no one was filling. She believed the earliest years
                of a child&apos;s life deserved more than an afterthought classroom
                in a big school. Together with Mr. Ranjeet Parmar, she started Kids Planet
                in a small space with just a handful of children.
              </p>
              <p className="mt-2 text-text-light leading-relaxed">
                Fifteen years later, Kids Planet has grown into a full K&ndash;8 school
                with 13 classrooms, a dedicated faculty of experienced teachers, and
                over 200 families who trust them with their children. But the core promise
                remains the same: <strong className="text-primary-dark">every child is known by name,
                nurtured with love, and taught by mentors who care.</strong>
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Campus journey photos */}
        <FadeIn delay={0.2}>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image src="/images/gallery/tilak-welcome.jpg" alt="Traditional welcome — applying tilak to students" fill className="object-cover" sizes="25vw" />
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image src="/images/classroom/teacher-reading.jpg" alt="Teacher reading to preschool children" fill className="object-cover" sizes="25vw" />
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image src="/images/events/trophy-ceremony.jpg" alt="Celebrating student achievements" fill className="object-cover" sizes="25vw" />
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image src="/images/events/farewell-group.jpg" alt="Farewell ceremony for graduating Class 8 students" fill className="object-cover" sizes="25vw" />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
