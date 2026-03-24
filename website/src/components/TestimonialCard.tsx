import { Star, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  relation: string;
  text: string;
  rating: number;
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="card flex flex-col gap-4 relative">
      {/* Quote icon */}
      <Quote className="h-8 w-8 text-primary/10 absolute top-4 right-4" />

      {/* Stars */}
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < testimonial.rating
                ? "fill-accent text-accent"
                : "fill-surface-muted text-surface-muted"
            }`}
          />
        ))}
      </div>

      {/* Quoted text */}
      <blockquote className="flex-1 text-sm text-text-light leading-relaxed">
        &ldquo;{testimonial.text}&rdquo;
      </blockquote>

      {/* Name & relation */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-sm font-bold text-primary">
            {testimonial.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </span>
        </div>
        <div>
          <p className="font-semibold text-primary-dark text-sm">{testimonial.name}</p>
          <p className="text-xs text-text-muted">{testimonial.relation}</p>
        </div>
      </div>
    </div>
  );
}

export default TestimonialCard;
