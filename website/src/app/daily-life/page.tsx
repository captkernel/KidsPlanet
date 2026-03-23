import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import DailySchedule from "@/components/DailySchedule";
import FadeIn from "@/components/FadeIn";
import { SCHOOL } from "@/lib/constants";
import { Shield, Utensils, Bus, Shirt } from "lucide-react";
import scheduleData from "@/content/daily-schedule.json";

export const metadata: Metadata = {
  title: "A Day at Kids Planet",
  description: `See what a typical day looks like at ${SCHOOL.name}, Kullu. Daily schedules for pre-school, primary, and middle school.`,
};

const highlights = [
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "CCTV surveillance, secure entry/exit, trained first-aid staff, and strict visitor management.",
  },
  {
    icon: Utensils,
    title: "Healthy Habits",
    description: "Students bring home-cooked lunch. Junk food is discouraged. Clean drinking water available.",
  },
  {
    icon: Bus,
    title: "Central Location",
    description: "Located in Dhalpur — the heart of Kullu — easily accessible from all parts of the valley.",
  },
  {
    icon: Shirt,
    title: "School Uniform",
    description: "Neat uniform on regular days, sports uniform on activity days. Details shared at admission.",
  },
];

export default function DailyLifePage() {
  return (
    <>
      <section className="section-padding bg-surface-cream">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-xs font-semibold uppercase tracking-[4px] text-accent mb-4">
            School Life
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark">
            A Day at Kids Planet
          </h1>
          <p className="mt-6 text-text-light text-lg leading-relaxed">
            See what a typical school day looks like — from morning assembly to
            afternoon dispersal, every hour is planned for growth.
          </p>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Daily Schedule"
            subtitle="Select a level to see the routine"
          />
          <DailySchedule schedules={scheduleData} />
        </div>
      </section>

      <section className="section-padding bg-surface-cream">
        <div className="max-w-4xl mx-auto">
          <SectionHeading
            label="What to Know"
            title="Practical Details"
            subtitle="Everything parents need to know about day-to-day school life"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {highlights.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div className="trust-strip">
                  <div className="flex items-start gap-4">
                    <item.icon size={20} className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-primary-dark text-sm">{item.title}</h3>
                      <p className="text-sm text-text-light mt-1">{item.description}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
