import Image from "next/image";
import { Play } from "lucide-react";

export function VideoEmbed({ videoId, title }: { videoId?: string; title?: string }) {
  if (!videoId) {
    return (
      <div className="relative aspect-video rounded-xl overflow-hidden bg-primary-dark">
        <Image
          src="/images/campus/new-building-event.jpg"
          alt="Kids Planet campus — step inside our school"
          fill
          className="object-cover opacity-60"
          sizes="(max-width: 768px) 100vw, 896px"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4">
              <Play size={28} className="text-white ml-1" />
            </div>
            <p className="text-lg font-semibold">Virtual Tour Coming Soon</p>
            <p className="text-sm text-white/70 mt-1">Visit us in person — call +91 94180 23454 to schedule a tour</p>
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
