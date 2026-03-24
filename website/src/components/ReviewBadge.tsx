import { Star, ExternalLink } from "lucide-react";

export function ReviewBadge() {
  return (
    <a
      href="https://www.justdial.com/Kullu/Kids-Planet-School"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 bg-surface-cream hover:bg-surface-muted px-5 py-3 rounded-full transition-colors group"
    >
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < 4 ? "fill-accent text-accent" : "fill-accent/30 text-accent/30"}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-primary-dark">4.4/5</span>
        <span className="text-xs text-text-muted">on JustDial</span>
        <ExternalLink size={12} className="text-text-muted group-hover:text-primary transition-colors" />
      </div>
    </a>
  );
}

export default ReviewBadge;
