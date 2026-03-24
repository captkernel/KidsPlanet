import { ExternalLink } from "lucide-react";
import { SCHOOL } from "@/lib/constants";

export function MapEmbed() {
  return (
    <div>
      <div className="rounded-xl overflow-hidden shadow-sm">
        <iframe
          src={SCHOOL.mapEmbedUrl}
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Kids Planet location on Google Maps"
        />
      </div>
      <a
        href={SCHOOL.mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 mt-3 text-sm font-semibold text-primary hover:text-primary-light transition-colors"
      >
        Get Directions on Google Maps
        <ExternalLink size={14} />
      </a>
    </div>
  );
}

export default MapEmbed;
