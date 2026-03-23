import Link from "next/link";
import Hero from "@/components/Hero";
import FadeIn from "@/components/FadeIn";
import SectionHeading from "@/components/SectionHeading";
import FounderSpotlight from "@/components/FounderSpotlight";
import ProgramCard from "@/components/ProgramCard";
import TestimonialCard from "@/components/TestimonialCard";
import NewsBanner from "@/components/NewsBanner";
import VideoEmbed from "@/components/VideoEmbed";
import ReviewBadge from "@/components/ReviewBadge";
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
  { href: "/faculty", icon: Users, label: "Our Faculty", desc: "Meet the teachers" },
  { href: "/daily-life", icon: Calendar, label: "School Life", desc: "Daily schedule" },
  { href: "/faq", icon: HelpCircle, label: "FAQ", desc: "Common questions" },
];

export default function Home() {
  return (
    <>
      {/* News Banner */}
      <NewsBanner news={news} />

      {/* Hero */}
      <Hero />

      {/* Quick Links for New Parents */}
      <section className="section-padding bg-surface-cream">
        <div className="mx-auto max-w-7xl">
          <FadeIn>
            <SectionHeading
              label="New Parent?"
              title="Start Here"
              subtitle="Everything you need to know about Kids Planet"
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

      {/* Video Section */}
      <section className="section-padding bg-surface-cream">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <SectionHeading
              label="Virtual Tour"
              title="See Our School"
              subtitle="Take a look inside Kids Planet"
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
            <SectionHeading label="Testimonials" title="What Parents Say" />
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

      {/* CTA Section */}
      <section className="bg-primary-dark py-16 px-4 md:px-8 lg:px-16">
        <FadeIn>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Join Kids Planet?
            </h2>
            <p className="mt-4 text-white/80">
              Give your child the gift of quality education in the heart of Kullu
              Valley. Admissions are open for the 2026–27 session.
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
