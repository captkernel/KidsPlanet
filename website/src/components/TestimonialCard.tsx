import { Star } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  relation: string;
  text: string;
  rating: number;
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="card flex flex-col gap-4">
      {/* Stars */}
      <div className="flex gap-1">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star
            key={i}
            className="h-4 w-4 fill-accent text-accent"
          />
        ))}
      </div>

      {/* Quoted text */}
      <blockquote className="flex-1 text-sm text-text-light leading-relaxed italic">
        &ldquo;{testimonial.text}&rdquo;
      </blockquote>

      {/* Name & relation */}
      <div>
        <p className="font-semibold text-primary-dark">{testimonial.name}</p>
        <p className="text-xs text-text-muted">{testimonial.relation}</p>
      </div>
    </div>
  );
}

export default TestimonialCard;
