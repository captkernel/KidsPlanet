import { Check, X } from "lucide-react";

const comparisons = [
  { feature: "Class size under 25 students", us: true, them: false },
  { feature: "Principal knows every child by name", us: true, them: false },
  { feature: "Daily activity updates to parents", us: true, them: false },
  { feature: "Play-based pre-school curriculum (NEP 2020)", us: true, them: false },
  { feature: "Dedicated art, music & sports periods", us: true, them: true },
  { feature: "15+ years in Kullu Valley", us: true, them: false },
  { feature: "4.4★ parent rating on JustDial", us: true, them: false },
  { feature: "Safe campus with CCTV surveillance", us: true, them: true },
];

export function WhyDifferent() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="card !p-0 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_80px_80px] bg-primary text-white text-xs font-semibold uppercase tracking-wider">
          <div className="p-4">What matters</div>
          <div className="p-4 text-center bg-primary-dark">Kids Planet</div>
          <div className="p-4 text-center">Others</div>
        </div>

        {/* Rows */}
        {comparisons.map((row, i) => (
          <div
            key={row.feature}
            className={`grid grid-cols-[1fr_80px_80px] items-center ${
              i % 2 === 0 ? "bg-surface" : "bg-surface-cream"
            }`}
          >
            <div className="p-3 text-sm text-text-light">{row.feature}</div>
            <div className="p-3 flex justify-center bg-primary/5">
              <Check size={18} className="text-primary" />
            </div>
            <div className="p-3 flex justify-center">
              {row.them ? (
                <Check size={18} className="text-text-muted" />
              ) : (
                <X size={18} className="text-red-400" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WhyDifferent;
