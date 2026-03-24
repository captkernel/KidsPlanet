import type { Metadata } from "next";
import MapEmbed from "@/components/MapEmbed";
import InquiryForm from "@/components/InquiryForm";
import SectionHeading from "@/components/SectionHeading";
import FadeIn from "@/components/FadeIn";
import { SCHOOL } from "@/lib/constants";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${SCHOOL.name}, Kullu. Phone: ${SCHOOL.phoneDisplay}. Address: ${SCHOOL.address}.`,
};

export default function ContactPage() {
  return (
    <>
      <section className="section-padding bg-surface-cream">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark">
            Contact Us
          </h1>
          <p className="mt-6 text-text-light text-lg leading-relaxed">
            We&apos;d love to hear from you. Reach out with questions about
            admissions, programs, or anything else.
          </p>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-primary-dark mb-6">
                Get in Touch
              </h2>
              <div className="space-y-5">
                <FadeIn>
                  <div className="trust-strip">
                    <div className="flex items-start gap-4">
                      <MapPin size={20} className="text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-primary-dark text-sm">Address</h3>
                        <p className="text-sm text-text-light mt-1">{SCHOOL.address}</p>
                      </div>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={0.1}>
                  <div className="trust-strip">
                    <div className="flex items-start gap-4">
                      <Phone size={20} className="text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-primary-dark text-sm">Phone</h3>
                        <a href={`tel:${SCHOOL.phone}`} className="text-sm text-text-light mt-1 hover:text-primary">
                          {SCHOOL.phoneDisplay}
                        </a>
                      </div>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={0.2}>
                  <div className="trust-strip">
                    <div className="flex items-start gap-4">
                      <MessageCircle size={20} className="text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-primary-dark text-sm">WhatsApp</h3>
                        <a
                          href={`https://wa.me/${SCHOOL.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-text-light mt-1 hover:text-primary"
                        >
                          Chat with us on WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={0.3}>
                  <div className="trust-strip">
                    <div className="flex items-start gap-4">
                      <Mail size={20} className="text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-primary-dark text-sm">Email</h3>
                        <a href={`mailto:${SCHOOL.email}`} className="text-sm text-text-light mt-1 hover:text-primary">
                          {SCHOOL.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </FadeIn>

                <FadeIn delay={0.4}>
                  <div className="trust-strip border-accent">
                    <div className="flex items-start gap-4">
                      <Clock size={20} className="text-accent mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-bold text-primary-dark text-sm">Office Hours</h3>
                        <div className="text-sm text-text-light mt-1 space-y-0.5">
                          <p>{SCHOOL.timings.weekday}</p>
                          <p>{SCHOOL.timings.saturday}</p>
                          <p>{SCHOOL.timings.sunday}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              </div>
            </div>

            <FadeIn>
              <MapEmbed />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="section-padding bg-surface-cream">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            title="Send Us a Message"
            subtitle="Fill out the form below and we'll get back to you shortly"
          />
          <InquiryForm />
        </div>
      </section>
    </>
  );
}
