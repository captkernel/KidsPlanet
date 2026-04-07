"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export function FAQAccordion({ faqs, showCategories = true }: { faqs: FAQ[]; showCategories?: boolean }) {
  const categories = showCategories
    ? ["all", ...new Set(faqs.map((f) => f.category))]
    : ["all"];
  const [activeCategory, setActiveCategory] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered =
    activeCategory === "all"
      ? faqs
      : faqs.filter((f) => f.category === activeCategory);

  const categoryLabels: Record<string, string> = {
    all: "All",
    admissions: "Admissions",
    academics: "Academics",
    "school-life": "School Life",
    fees: "Fees",
  };

  return (
    <div>
      {showCategories && categories.length > 2 && (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setOpenId(null); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary text-white"
                  : "bg-surface-muted text-text-light hover:bg-primary/10"
              }`}
            >
              {categoryLabels[cat] || cat}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((faq) => (
          <div key={faq.id} className="card !p-0 overflow-hidden">
            <button
              onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
              className="w-full flex items-center justify-between p-5 text-left"
              aria-expanded={openId === faq.id}
              aria-controls={`faq-content-${faq.id}`}
            >
              <span className="font-semibold text-primary-dark text-sm pr-4">
                {faq.question}
              </span>
              <ChevronDown
                size={18}
                className={`text-primary flex-shrink-0 transition-transform duration-200 ${
                  openId === faq.id ? "rotate-180" : ""
                }`}
              />
            </button>
            {openId === faq.id && (
              <div id={`faq-content-${faq.id}`} role="region" className="px-5 pb-5 -mt-1">
                <p className="text-sm text-text-light leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQAccordion;
