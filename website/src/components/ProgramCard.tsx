import { GraduationCap, BookOpen, School } from "lucide-react";

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
  },
  primary: {
    Icon: BookOpen,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    pillBg: "bg-primary/10 text-primary-dark",
  },
  middle: {
    Icon: School,
    iconBg: "bg-primary-dark/10",
    iconColor: "text-primary-dark",
    pillBg: "bg-primary-dark/10 text-primary-dark",
  },
};

export function ProgramCard({ program }: { program: Program }) {
  const config = levelConfig[program.level];
  const { Icon } = config;

  return (
    <div className="card flex flex-col gap-4">
      {/* Icon */}
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-lg ${config.iconBg}`}
      >
        <Icon className={`h-6 w-6 ${config.iconColor}`} />
      </div>

      {/* Name & age */}
      <div>
        <h3 className="text-lg font-bold text-primary-dark">{program.name}</h3>
        <p className="text-sm text-text-muted">{program.ageRange}</p>
      </div>

      {/* Description */}
      <p className="text-sm text-text-light leading-relaxed">
        {program.description}
      </p>

      {/* Highlights */}
      <div className="mt-auto flex flex-wrap gap-2">
        {program.highlights.map((h) => (
          <span
            key={h}
            className={`rounded-full px-3 py-1 text-xs font-medium ${config.pillBg}`}
          >
            {h}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ProgramCard;
