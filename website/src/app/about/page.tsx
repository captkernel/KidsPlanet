import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Users, Building, Award, BookOpen, Heart, UserCheck } from "lucide-react";
import { SCHOOL } from "@/lib/constants";
import FadeIn from "@/components/FadeIn";
import SectionHeading from "@/components/SectionHeading";
import FounderSpotlight from "@/components/FounderSpotlight";
import Timeline from "@/components/Timeline";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Kids Planet is Kullu Valley's dedicated early childhood learning center. Founded in 2010 by Mrs. Neeta Parmar, we specialize in nurturing young learners from Playgroup to Class 8.",
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

      {/* How We Teach */}
      <section className="section-padding bg-surface">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <SectionHeading
              label="Our Philosophy"
              title="How We Teach"
              subtitle="Every child learns differently. Our approach blends structured academics with the freedom to explore, question, and grow."
            />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <FadeIn delay={0}>
              <div className="card-static text-center h-full">
                <BookOpen className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-bold text-primary-dark mb-2">
                  Play-Based Early Learning
                </h3>
                <p className="text-sm text-text-light leading-relaxed">
                  For Playgroup through UKG, learning happens through play, stories, and hands-on activities — aligned with NEP 2020 foundational stage guidelines.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="card-static text-center h-full">
                <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-bold text-primary-dark mb-2">
                  Holistic Development
                </h3>
                <p className="text-sm text-text-light leading-relaxed">
                  HPBOSE curriculum enriched with art, moral values, and physical activities — building well-rounded individuals, not just exam scores.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="card-static text-center h-full">
                <UserCheck className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-bold text-primary-dark mb-2">
                  Personal Attention
                </h3>
                <p className="text-sm text-text-light leading-relaxed">
                  With a 20:1 student-teacher ratio, every child is seen and supported. Small class sizes mean no one gets left behind.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Mission — Why Kids Planet? */}
      <section className="section-padding bg-surface-cream">
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
