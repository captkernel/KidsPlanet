import Image from "next/image";
import { Phone, MapPin } from "lucide-react";
import { SCHOOL } from "@/lib/constants";

export function VideoEmbed({ videoId, title }: { videoId?: string; title?: string }) {
  if (!videoId) {
    return (
      <div className="relative aspect-video rounded-xl overflow-hidden bg-primary-dark">
        <Image
          src="/images/campus/new-building-event.jpg"
          alt="Kids Planet campus — step inside our school"
          fill
          className="object-cover opacity-40"
          sizes="(max-width: 768px) 100vw, 896px"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-5">
              <MapPin size={26} className="text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Want to See Our Campus?</h3>
            <p className="text-white/80 text-sm max-w-md mx-auto mb-6">
              Schedule a personal visit and experience our classrooms, play areas, and learning spaces first-hand.
            </p>
            <a
              href={`https://wa.me/${SCHOOL.whatsapp}?text=${encodeURIComponent("Hi, I'd like to schedule a campus visit at Kids Planet.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-primary-dark font-semibold px-6 py-3 rounded-lg hover:bg-accent-light transition-colors text-sm"
            >
              <Phone size={18} />
              Schedule a Visit — {SCHOOL.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video rounded-xl overflow-hidden shadow-card">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title || "Kids Planet School Tour"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

export default VideoEmbed;
