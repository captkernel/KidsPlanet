import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import InquiryForm from "@/components/InquiryForm";
import FadeIn from "@/components/FadeIn";
import { SCHOOL } from "@/lib/constants";
import { FileText, Calendar, UserCheck, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "Admissions",
  description: `Apply for admission at ${SCHOOL.name}, Kullu. ${SCHOOL.classes}, HP State Board. Contact ${SCHOOL.phoneDisplay}.`,
};

const steps = [
  {
    icon: FileText,
    title: "1. Submit Inquiry",
    description: "Fill out the inquiry form below or contact us via phone/WhatsApp.",
  },
  {
    icon: Calendar,
    title: "2. Visit the School",
    description: "Schedule a visit to see our classrooms, meet teachers, and understand our approach.",
  },
  {
    icon: UserCheck,
    title: "3. Submit Documents",
    description: "Provide birth certificate, Aadhar card, previous school TC (if applicable), and passport photos.",
  },
  {
    icon: GraduationCap,
    title: "4. Admission Confirmed",
    description: "Complete fee payment and your child is officially a part of Kids Planet!",
  },
];

export default function AdmissionsPage() {
  return (
    <>
      <section className="section-padding bg-surface-cream">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-xs font-semibold uppercase tracking-[4px] text-accent mb-4">
            2026–27 Session
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark">
            Admissions Open
          </h1>
          <p className="mt-6 text-text-light text-lg leading-relaxed">
            Join the most trusted school in Kullu Valley. We welcome students
            from Playgroup through Class 8.
          </p>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="max-w-7xl mx-auto">
          <SectionHeading
            title="Admission Process"
            subtitle="Four simple steps to join Kids Planet"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.1}>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <step.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-bold text-primary-dark text-sm">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-light mt-2 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface-cream">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <SectionHeading
                label="Get Started"
                title="Send an Inquiry"
                subtitle="Fill out the form and our team will get back to you within 24 hours"
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
                  <h4 className="font-bold text-primary-dark text-sm">Contact Directly</h4>
                  <p className="text-sm text-text-light mt-1">
                    Call or WhatsApp: <strong>{SCHOOL.phoneDisplay}</strong>
                  </p>
                </div>
                <div className="trust-strip border-accent">
                  <h4 className="font-bold text-primary-dark text-sm">Fee Information</h4>
                  <p className="text-sm text-text-light mt-1">
                    Fee details are shared during the school visit. For a general idea of our
                    fee structure, please contact us at {SCHOOL.phoneDisplay} or visit the
                    school during office hours.
                  </p>
                </div>
              </div>
            </div>
            <InquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
