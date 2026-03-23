import { SCHOOL } from "@/lib/constants";

export function MapEmbed() {
  return (
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
  );
}

export default MapEmbed;
