import { SCHOOL } from "@/lib/constants";
import SectionHeading from "@/components/SectionHeading";
import FadeIn from "@/components/FadeIn";

export default function FounderSpotlight() {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-7xl">
        <SectionHeading label="Our Legacy" title="Led by Experience" />

        <FadeIn>
          <div className="trust-strip mx-auto max-w-3xl flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {/* Initials circle */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
              NP
            </div>

            {/* Bio content */}
            <div>
              <h3 className="text-xl font-bold text-primary-dark">
                {SCHOOL.founder}
              </h3>
              <p className="text-sm font-semibold text-accent">
                {SCHOOL.founderTitle}
              </p>
              <p className="mt-3 text-text-light leading-relaxed">
                {SCHOOL.founderBio}
              </p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
