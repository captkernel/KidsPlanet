import { SCHOOL } from "@/lib/constants";

export function StatsBar() {
  return (
    <div className="border-t border-b border-primary/10 py-8">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 md:gap-16">
        {SCHOOL.stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <div className="text-3xl font-bold text-primary">{stat.value}</div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-widest text-text-muted">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StatsBar;
