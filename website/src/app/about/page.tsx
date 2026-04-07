import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Users, Building, Award } from "lucide-react";
import { SCHOOL } from "@/lib/constants";
import FadeIn from "@/components/FadeIn";
import SectionHeading from "@/components/SectionHeading";
import FounderSpotlight from "@/components/FounderSpotlight";
import Timeline from "@/components/Timeline";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Kids Planet is Kullu Valley's dedicated learning center. Founded in 2010 by Mrs. Neeta Parmar, nurturing young learners from Playgroup to Class 8 with personal attention.",
  keywords: ["about Kids Planet", "school history Kullu", "Mrs Neeta Parmar", "Kullu Valley school", "HPBOSE school Kullu"],
};

const facilities = [
  {
    Icon: MapPin,
    title: "Central Location",
    description:
      "Located above Circuit House in Dhalpur, Kullu — easily accessible for families across the valley.",
  },
  {
    Icon: Users,
    title: "Small Class Sizes",
    description:
      "With a 20:1 student-teacher ratio, every child receives personal attention and guidance.",
  },
  {
    Icon: Building,
    title: "13 Classrooms",
    description:
      "Well-equipped classrooms designed for interactive learning, creative activities, and comfortable study.",
  },
  {
    Icon: Award,
    title: "Experienced Faculty",
    description:
      "Our dedicated team of qualified teachers brings years of experience in early and primary education.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-surface-cream section-padding">
        <div className="mx-auto max-w-7xl text-center">
          <FadeIn>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-accent mb-4">
              {SCHOOL.board} &middot; Est. {SCHOOL.founded}
            </span>
            <h1 className="text-4xl font-bold text-primary-dark sm:text-5xl">
              About Kids Planet
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-text-muted">
              {SCHOOL.description}
            </p>
          </FadeIn>

          {/* Campus images */}
          <FadeIn delay={0.2}>
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image
                  src="/images/campus/building-exterior.jpg"
                  alt="Kids Planet school building"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image
                  src="/images/campus/morning-assembly.jpg"
                  alt="Morning assembly at Kids Planet"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image
                  src="/images/faculty/faculty-group.jpg"
                  alt="Kids Planet faculty team"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Mission — Why Kids Planet? */}
      <section className="section-padding bg-surface">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <SectionHeading label="Our Strengths" title="Why Kids Planet?" />
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {facilities.map((facility, i) => (
              <FadeIn key={facility.title} delay={i * 0.1}>
                <div className="trust-strip h-full">
                  <facility.Icon className="h-8 w-8 text-primary mb-3" />
                  <h3 className="text-lg font-bold text-primary-dark">
                    {facility.title}
                  </h3>
                  <p className="mt-2 text-sm text-text-light leading-relaxed">
                    {facility.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Spotlight */}
      <FounderSpotlight />

      {/* Timeline */}
      <section className="section-padding bg-surface">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <SectionHeading
              label="Our Journey"
              title="Growing With Kullu"
              subtitle="From a small playgroup to a full K-8 school, Kids Planet has been serving Kullu Valley families for over 15 years."
            />
          </FadeIn>

          <Timeline />
        </div>
      </section>
    </>
  );
}
