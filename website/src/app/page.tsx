import Link from "next/link";
import Hero from "@/components/Hero";
import FadeIn from "@/components/FadeIn";
import SectionHeading from "@/components/SectionHeading";
import FounderSpotlight from "@/components/FounderSpotlight";
import ProgramCard from "@/components/ProgramCard";
import TestimonialCard from "@/components/TestimonialCard";

import programs from "@/content/programs.json";
import testimonials from "@/content/testimonials.json";

type Program = {
  id: string;
  name: string;
  ageRange: string;
  level: "preschool" | "primary" | "middle";
  description: string;
  highlights: string[];
};

const typedPrograms = programs as Program[];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <Hero />

      {/* Programs Section */}
      <section className="section-padding bg-surface">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <SectionHeading label="Academics" title="Our Programs" />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {typedPrograms.map((program, i) => (
              <FadeIn key={program.id} delay={i * 0.1}>
                <ProgramCard program={program} />
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="mt-10 text-center">
              <Link href="/programs" className="btn-secondary">
                View All Programs
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Founder Spotlight */}
      <FounderSpotlight />

      {/* Testimonials Section */}
      <section className="section-padding bg-surface-cream">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <SectionHeading label="Testimonials" title="What Parents Say" />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <FadeIn key={testimonial.id} delay={i * 0.1}>
                <TestimonialCard testimonial={testimonial} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-dark py-16 px-4 md:px-8 lg:px-16">
        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Join Kids Planet?
            </h2>
            <p className="mt-4 text-white/80">
              Give your child the gift of quality education in the heart of Kullu
              Valley. Admissions are open for the upcoming academic session.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/admissions"
                className="bg-accent text-primary-dark px-6 py-3 rounded-md font-semibold text-sm hover:bg-accent-light transition-colors duration-200"
              >
                Apply Now
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-6 py-3 rounded-md font-semibold text-sm hover:bg-white hover:text-primary-dark transition-colors duration-200"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
