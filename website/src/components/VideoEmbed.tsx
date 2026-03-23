import { Play } from "lucide-react";

export function VideoEmbed({ videoId, title }: { videoId?: string; title?: string }) {
  if (!videoId) {
    return (
      <div className="relative aspect-video rounded-xl overflow-hidden bg-primary-dark flex items-center justify-center">
        <div className="text-center text-white/80">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <Play size={28} className="text-white ml-1" />
          </div>
          <p className="text-lg font-semibold">School Tour Video</p>
          <p className="text-sm text-white/60 mt-1">Coming Soon</p>
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
