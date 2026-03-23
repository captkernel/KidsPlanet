import { Star } from "lucide-react";

export function ReviewBadge() {
  return (
    <div className="inline-flex items-center gap-3 bg-surface-cream px-4 py-2 rounded-full">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < 4 ? "fill-accent text-accent" : "fill-accent/40 text-accent/40"}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-primary-dark">4.4/5</span>
      <span className="text-xs text-text-muted">from 23 reviews</span>
    </div>
  );
}

export default ReviewBadge;
