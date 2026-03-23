import Link from "next/link";
import { SCHOOL } from "@/lib/constants";
import StatsBar from "@/components/StatsBar";

export default function Hero() {
  return (
    <section className="bg-surface-cream">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-0 text-center sm:px-6 md:pt-24 lg:px-8">
        {/* Board & classes label */}
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-accent mb-4">
          {SCHOOL.board} &middot; {SCHOOL.classes}
        </span>

        {/* Main heading */}
        <h1 className="text-4xl font-bold text-primary-dark sm:text-5xl md:text-6xl">
          Nurturing Excellence
          <br />
          <span className="text-primary">Since {SCHOOL.founded}</span>
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-2xl text-lg text-text-muted">
          Founded by {SCHOOL.founder}, {SCHOOL.name} provides quality education
          from {SCHOOL.classes} in the heart of Kullu Valley &mdash; building
          character, confidence, and curiosity in every child.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/admissions" className="btn-primary">
            Begin Admission Process
          </Link>
          <Link href="/programs" className="btn-secondary">
            View Programs
          </Link>
        </div>
      </div>

      {/* Stats bar */}
      <div className="mt-12">
        <StatsBar />
      </div>
    </section>
  );
}
