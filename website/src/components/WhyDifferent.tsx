import { Check, X } from "lucide-react";

const comparisons = [
  { feature: "Preschool is the core focus, not a feeder program", us: true, them: false },
  { feature: "Class size under 25 students", us: true, them: false },
  { feature: "Principal personally knows every child", us: true, them: false },
  { feature: "Founder-led, family-run school", us: true, them: false },
  { feature: "Play-based early learning (NEP 2020 aligned)", us: true, them: false },
  { feature: "Daily activity updates to parents", us: true, them: false },
  { feature: "Dedicated art, music & sports periods", us: true, them: true },
  { feature: "15+ years of early childhood expertise", us: true, them: false },
  { feature: "4.4★ parent rating (JustDial verified)", us: true, them: true },
  { feature: "Online inquiry + WhatsApp enrollment", us: true, them: false },
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
                <X size={18} className="text-error/70" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WhyDifferent;
