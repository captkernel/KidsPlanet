"use client";

import { MessageCircle, CalendarCheck } from "lucide-react";
import { SCHOOL } from "@/lib/constants";

export function StickyMobileCTA() {
  const whatsappUrl = `https://wa.me/${SCHOOL.whatsapp}?text=${encodeURIComponent(
    "Hi, I'm interested in admissions at Kids Planet for my child. Could you share more details?"
  )}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-surface/95 backdrop-blur-sm border-t border-primary/10 px-4 py-3 safe-bottom">
      <div className="flex gap-3 max-w-lg mx-auto">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 rounded-lg font-semibold text-sm"
        >
          <MessageCircle size={18} />
          WhatsApp Us
        </a>
        <a
          href="/admissions"
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-semibold text-sm"
        >
          <CalendarCheck size={18} />
          Book a Visit
        </a>
      </div>
    </div>
  );
}

export default StickyMobileCTA;
