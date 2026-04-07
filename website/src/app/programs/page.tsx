import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SCHOOL } from "@/lib/constants";
import FadeIn from "@/components/FadeIn";
import SectionHeading from "@/components/SectionHeading";
import ProgramCard from "@/components/ProgramCard";

import allPrograms from "@/content/programs.json";

type Program = {
  id: string;
  name: string;
  ageRange: string;
  level: "preschool" | "primary" | "middle";
  description: string;
  highlights: string[];
};

const typedPrograms = allPrograms as Program[];

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Explore Kids Planet's academic programs from Playgroup to Class 8 — play-based pre-school, HPBOSE-aligned primary, and middle school in Kullu.",
  keywords: ["Kullu school programs", "playgroup Kullu", "nursery Kullu", "LKG UKG Kullu", "HPBOSE primary school", "Class 1-8 Kullu"],
};

const sections = [
  {
    level: "preschool" as const,
    label: "Pre-School",
    title: "Pre-School",
    subtitle: "Ages 2–6 — A play-based introduction to learning, creativity, and social skills.",
    bg: "bg-surface",
    image: "/images/classroom/teacher-reading.jpg",
    imageAlt: "Teacher reading to preschool children",
  },
  {
    level: "primary" as const,
    label: "Primary School",
    title: "Primary School",
    subtitle: "Ages 6–11 — Building academic excellence with the HPBOSE curriculum.",
    bg: "bg-surface-cream",
    image: "/images/classroom/students-in-class.jpg",
    imageAlt: "Primary students in a bright, modern classroom",
  },
  {
    level: "middle" as const,
    label: "Middle School",
    title: "Middle School",
    subtitle: "Ages 11–14 — Preparing students for higher secondary and beyond.",
    bg: "bg-surface",
    image: "/images/classroom/circle-time.jpg",
    imageAlt: "Students in circle time discussion",
  },
];

export default function ProgramsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-surface-cream section-padding">
        <div className="mx-auto max-w-7xl text-center">
          <FadeIn>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-accent mb-4">
              {SCHOOL.board}
            </span>
            <h1 className="text-4xl font-bold text-primary-dark sm:text-5xl">
              Our Programs
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-text-muted">
              From ages 2 to 14, Kids Planet offers a structured and nurturing
              learning journey — from playgroup through Class 8.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Program Sections */}
      {sections.map((section) => {
        const programs = typedPrograms.filter((p) => p.level === section.level);
        return (
          <section
            key={section.level}
            className={`section-padding ${section.bg}`}
          >
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                <FadeIn>
                  <SectionHeading
                    label={section.label}
                    title={section.title}
                    subtitle={section.subtitle}
                  />
                </FadeIn>
                <FadeIn delay={0.1}>
                  <div className="relative w-full md:w-64 aspect-[4/3] rounded-xl overflow-hidden shrink-0">
                    <Image
                      src={section.image}
                      alt={section.imageAlt}
                      fill
                      className="object-cover"
                      sizes="256px"
                    />
                  </div>
                </FadeIn>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programs.map((program, i) => (
                  <FadeIn key={program.id} delay={i * 0.1}>
                    <ProgramCard program={program} />
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* CTA Section */}
      <section className="bg-primary-dark py-16 px-4 md:px-8 lg:px-16">
        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Find the Right Program for Your Child
            </h2>
            <p className="mt-4 text-white/80">
              Not sure which program is the best fit? Get in touch and we will
              help you find the right path for your child.
            </p>
            <div className="mt-8">
              <Link
                href="/admissions"
                className="bg-accent text-primary-dark px-6 py-3 rounded-md font-semibold text-sm hover:bg-accent-light transition-colors duration-200"
              >
                Start Admission Process
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
