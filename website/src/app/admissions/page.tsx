import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import InquiryForm from "@/components/InquiryForm";
import FadeIn from "@/components/FadeIn";
import ParentJourney from "@/components/ParentJourney";
import SeatCounter from "@/components/SeatCounter";
import FAQAccordion from "@/components/FAQAccordion";
import { SCHOOL } from "@/lib/constants";
import allFaqs from "@/content/faq.json";

export const metadata: Metadata = {
  title: "Admissions",
  description: `Apply for admission at ${SCHOOL.name}, Kullu. ${SCHOOL.classes}, HP State Board. Limited seats — contact ${SCHOOL.phoneDisplay}.`,
};

const admissionFaqs = allFaqs.filter((f) => f.category === "admissions");

export default function AdmissionsPage() {
  return (
    <>
      <section className="section-padding bg-surface-cream">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-xs font-semibold uppercase tracking-[4px] text-red-600 mb-4">
            Limited Seats — 2026–27 Session
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark">
            Give Your Child the Best Start
          </h1>
          <p className="mt-6 text-text-light text-lg leading-relaxed">
            Join 200+ families who trust Kids Planet with their children&apos;s
            education. From Playgroup to Class 8, every child gets the attention
            they deserve.
          </p>
        </div>
      </section>

      {/* Seat Availability */}
      <section className="section-padding bg-surface">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            title="Seat Availability"
            subtitle="Check availability for your child's class — seats fill up fast"
          />
          <FadeIn>
            <SeatCounter />
          </FadeIn>
        </div>
      </section>

      {/* What Happens After You Reach Out */}
      <section className="section-padding bg-surface-cream">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            label="From inquiry to enrollment"
            title="What Happens Next?"
            subtitle="From your first message to your child's first day — here's how it works"
          />
          <ParentJourney />
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="section-padding bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <SectionHeading
                label="Get Started"
                title="Send an Inquiry"
                subtitle="Fill out the form and we'll get back to you within hours — not days"
              />
              <div className="space-y-4 mt-8">
                <div className="trust-strip">
                  <h4 className="font-bold text-primary-dark text-sm">Documents Required</h4>
                  <ul className="text-sm text-text-light mt-2 space-y-1">
                    <li>• Birth Certificate</li>
                    <li>• Aadhar Card (child & parent)</li>
                    <li>• Previous School TC (for Class 2+)</li>
                    <li>• 4 Passport-size Photographs</li>
                    <li>• Address Proof</li>
                  </ul>
                </div>
                <div className="trust-strip border-accent">
                  <h4 className="font-bold text-primary-dark text-sm">Prefer to Talk?</h4>
                  <p className="text-sm text-text-light mt-1">
                    Call or WhatsApp us directly at <strong>{SCHOOL.phoneDisplay}</strong>.
                    We respond within minutes.
                  </p>
                </div>
                <div className="trust-strip border-accent">
                  <h4 className="font-bold text-primary-dark text-sm">Fee Information</h4>
                  <p className="text-sm text-text-light mt-1">
                    Fee details are shared during the school visit. We offer
                    flexible payment options including quarterly installments.
                    Contact us at {SCHOOL.phoneDisplay} for details.
                  </p>
                </div>
              </div>
            </div>
            <InquiryForm />
          </div>
        </div>
      </section>

      {/* Admission FAQs */}
      <section className="section-padding bg-surface-cream">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            title="Admission FAQ"
            subtitle="Quick answers to common questions"
          />
          <FAQAccordion faqs={admissionFaqs} showCategories={false} />
        </div>
      </section>
    </>
  );
}
