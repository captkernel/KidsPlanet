import Link from "next/link";
import { GraduationCap, BookOpen, School, ArrowRight } from "lucide-react";

interface Program {
  id: string;
  name: string;
  ageRange: string;
  level: "preschool" | "primary" | "middle";
  description: string;
  highlights: string[];
}

const levelConfig = {
  preschool: {
    Icon: GraduationCap,
    iconBg: "bg-accent-light/30",
    iconColor: "text-accent-dark",
    pillBg: "bg-accent-light/20 text-accent-dark",
    border: "border-t-4 border-t-accent",
  },
  primary: {
    Icon: BookOpen,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    pillBg: "bg-primary/10 text-primary-dark",
    border: "border-t-4 border-t-primary",
  },
  middle: {
    Icon: School,
    iconBg: "bg-primary-dark/10",
    iconColor: "text-primary-dark",
    pillBg: "bg-primary-dark/10 text-primary-dark",
    border: "border-t-4 border-t-primary-dark",
  },
};

export function ProgramCard({ program }: { program: Program }) {
  const config = levelConfig[program.level];
  const { Icon } = config;

  return (
    <div className={`card flex flex-col gap-4 ${config.border}`}>
      {/* Icon + age badge */}
      <div className="flex items-center justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${config.iconBg}`}
        >
          <Icon className={`h-6 w-6 ${config.iconColor}`} />
        </div>
        <span className="text-xs font-semibold text-text-muted bg-surface-muted px-3 py-1 rounded-full">
          {program.ageRange}
        </span>
      </div>

      {/* Name */}
      <h3 className="text-lg font-bold text-primary-dark">{program.name}</h3>

      {/* Description */}
      <p className="text-sm text-text-light leading-relaxed flex-1">
        {program.description}
      </p>

      {/* Highlights */}
      <div className="flex flex-wrap gap-1.5">
        {program.highlights.map((h) => (
          <span
            key={h}
            className={`rounded-full px-3 py-1 text-xs font-medium ${config.pillBg}`}
          >
            {h}
          </span>
        ))}
      </div>

      {/* CTA */}
      <Link
        href="/admissions"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-light transition-colors mt-1 group"
      >
        Enquire Now
        <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>
  );
}

export default ProgramCard;
