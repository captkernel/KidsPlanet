"use client";

import { MessageCircle } from "lucide-react";
import { SCHOOL } from "@/lib/constants";

export default function WhatsAppButton() {
  const message = encodeURIComponent(
    `Hi, I'd like to know more about ${SCHOOL.name}.`
  );

  return (
    <a
      href={`https://wa.me/${SCHOOL.whatsapp}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform duration-200"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
