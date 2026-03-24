import { Calendar, LayoutGrid, Users, Star } from "lucide-react";
import { SCHOOL } from "@/lib/constants";

const statIcons = [Calendar, LayoutGrid, Users, Star];

export function StatsBar() {
  return (
    <div className="border-t border-b border-primary/10 bg-surface/50 py-8">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-10 md:gap-16 px-4">
        {SCHOOL.stats.map((stat, i) => {
          const Icon = statIcons[i] || Star;
          return (
            <div key={stat.label} className="text-center">
              <Icon className="h-5 w-5 text-accent mx-auto mb-2" />
              <div className="text-3xl font-extrabold text-primary">{stat.value}</div>
              <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-text-muted">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StatsBar;
