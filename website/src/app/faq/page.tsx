import type { Metadata } from "next";
import FAQAccordion from "@/components/FAQAccordion";
import { SCHOOL } from "@/lib/constants";
import faqs from "@/content/faq.json";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description: `Frequently asked questions about ${SCHOOL.name}, Kullu — admissions, fees, academics, school life, and more.`,
  keywords: ["Kids Planet FAQ", "school fees Kullu", "admission questions", "school timings Kullu", "Kids Planet reviews"],
};

function getFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getFaqJsonLd()) }}
      />
      <section className="section-padding bg-surface-cream">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-dark">
            Frequently Asked Questions
          </h1>
          <p className="mt-6 text-text-light text-lg leading-relaxed">
            Find answers to common questions about admissions, academics, fees,
            and school life at Kids Planet.
          </p>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="max-w-3xl mx-auto">
          <FAQAccordion faqs={faqs} />
        </div>
      </section>

      <section className="section-padding bg-surface-cream">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-primary-dark">
            Still Have Questions?
          </h2>
          <p className="mt-3 text-text-light">
            We&apos;re happy to help. Reach out to us directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Link href="/contact" className="btn-primary">
              Contact Us
            </Link>
            <a
              href={`https://wa.me/${SCHOOL.whatsapp}?text=${encodeURIComponent("Hi, I have a question about Kids Planet.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
