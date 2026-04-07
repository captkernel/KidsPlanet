import type { Metadata } from "next";
import Link from "next/link";
import Hero from "@/components/Hero";
import FadeIn from "@/components/FadeIn";

export const metadata: Metadata = {
  title: "Kids Planet \u2014 Where Your Child's Brightest Future Begins",
  description:
    "Kids Planet is the leading school in Kullu, HP, offering Playgroup to Class 8 with personal attention, experienced faculty, and HPBOSE curriculum.",
  keywords: ["Kids Planet Kullu", "best school in Kullu", "Kullu Valley school", "playgroup Kullu", "HPBOSE school Himachal Pradesh"],
};
import SectionHeading from "@/components/SectionHeading";
import FounderSpotlight from "@/components/FounderSpotlight";
import ProgramCard from "@/components/ProgramCard";
import TestimonialCard from "@/components/TestimonialCard";
import NewsBanner from "@/components/NewsBanner";
import VideoEmbed from "@/components/VideoEmbed";
import ReviewBadge from "@/components/ReviewBadge";
import WhyDifferent from "@/components/WhyDifferent";
import TransformationStories from "@/components/TransformationStory";
import SeatCounter from "@/components/SeatCounter";
import { SCHOOL } from "@/lib/constants";
import { BookOpen, Users, Calendar, HelpCircle } from "lucide-react";

import programs from "@/content/programs.json";
import testimonials from "@/content/testimonials.json";
import news from "@/content/news.json";

type Program = {
  id: string;
  name: string;
  ageRange: string;
  level: "preschool" | "primary" | "middle";
  description: string;
  highlights: string[];
};

const typedPrograms = programs as Program[];

const quickLinks = [
  { href: "/programs", icon: BookOpen, label: "Programs", desc: "Playgroup to Class 8" },
  { href: "/faculty", icon: Users, label: "Our Teachers", desc: "Meet the team" },
  { href: "/daily-life", icon: Calendar, label: "A Day Here", desc: "See the routine" },
  { href: "/faq", icon: HelpCircle, label: "FAQ", desc: "Your questions answered" },
];

export default function Home() {
  return (
    <>
      {/* News Banner */}
      <NewsBanner news={news} />

      {/* Hero */}
      <Hero />

      {/* Quick Links for New Parents */}
      <section className="section-padding bg-surface">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <SectionHeading
              label="New Parent?"
              title="Start Your Journey Here"
              subtitle="Everything you need to know about Kids Planet in one place"
            />
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((item, i) => (
              <FadeIn key={item.href} delay={i * 0.1}>
                <Link
                  href={item.href}
                  className="card text-center hover:shadow-md transition-shadow group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                    <item.icon size={22} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-primary-dark text-sm">{item.label}</h3>
                  <p className="text-xs text-text-muted mt-1">{item.desc}</p>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Why We're Different */}
      <section className="section-padding bg-surface-cream">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <SectionHeading
              label="The Kids Planet Difference"
              title="Why Parents Choose Us"
              subtitle="We don't just teach — we nurture confident, curious learners"
            />
          </FadeIn>
          <FadeIn>
            <WhyDifferent />
          </FadeIn>
        </div>
      </section>

      {/* Programs Section */}
      <section className="section-padding bg-surface">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <SectionHeading
              label="Academics"
              title="Programs for Every Age"
              subtitle="From first steps to big dreams — a learning path designed for growth"
            />
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
                Explore All Programs
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Transformation Stories */}
      <section className="section-padding bg-surface-cream">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <SectionHeading
              label="Real Stories"
              title="Watch Them Grow"
              subtitle="Every child who joins Kids Planet has a transformation story"
            />
          </FadeIn>
          <TransformationStories />
        </div>
      </section>

      {/* Video Section */}
      <section className="section-padding bg-surface">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <SectionHeading
              label="Virtual Tour"
              title="Step Inside Kids Planet"
              subtitle="See our classrooms, playground, and learning spaces"
            />
          </FadeIn>
          <FadeIn>
            <VideoEmbed />
          </FadeIn>
        </div>
      </section>

      {/* Founder Spotlight */}
      <FounderSpotlight />

      {/* Testimonials Section */}
      <section className="section-padding bg-surface-cream">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <SectionHeading
              label="From Our Families"
              title="What Parents Say"
              subtitle="Join 200+ families who trust Kids Planet with their children's future"
            />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <FadeIn key={testimonial.id} delay={i * 0.1}>
                <TestimonialCard testimonial={testimonial} />
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="mt-8 text-center">
              <ReviewBadge />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Seat Availability — Urgency */}
      <section className="section-padding bg-surface">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <SectionHeading
              label="2026–27 Admissions"
              title="Seats Filling Fast"
              subtitle="Check availability for your child's class"
            />
          </FadeIn>
          <FadeIn>
            <SeatCounter />
          </FadeIn>
          <FadeIn>
            <div className="mt-8 text-center">
              <Link
                href="/admissions"
                className="btn-primary text-base px-8 py-3.5"
              >
                Reserve Your Child&apos;s Seat Now
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-primary-dark py-16 px-4 md:px-8 lg:px-16">
        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Every Great Journey Starts With One Step
            </h2>
            <p className="mt-4 text-white/80 text-lg">
              The best gift you can give your child is a strong foundation.
              Let&apos;s build it together.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={`https://wa.me/${SCHOOL.whatsapp}?text=${encodeURIComponent("Hi, I'd like to know about admissions at Kids Planet for my child.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white px-8 py-3.5 rounded-md font-semibold text-sm hover:bg-[#20bd5a] transition-colors duration-200"
              >
                WhatsApp Us Now
              </a>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-8 py-3.5 rounded-md font-semibold text-sm hover:bg-white hover:text-primary-dark transition-colors duration-200"
              >
                Talk to Our Principal
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
