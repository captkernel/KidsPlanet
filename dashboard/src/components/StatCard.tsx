import { LucideIcon } from "lucide-react";

const colorMap: Record<string, { bg: string, border: string, icon: string, text: string }> = {
  primary: { bg: 'bg-green-50', border: 'border-green-100', icon: 'bg-green-100', text: 'text-green-700' },
  accent: { bg: 'bg-amber-50', border: 'border-amber-100', icon: 'bg-amber-100', text: 'text-amber-700' },
  danger: { bg: 'bg-red-50', border: 'border-red-100', icon: 'bg-red-100', text: 'text-red-700' },
  success: { bg: 'bg-emerald-50', border: 'border-emerald-100', icon: 'bg-emerald-100', text: 'text-emerald-700' },
  warning: { bg: 'bg-orange-50', border: 'border-orange-100', icon: 'bg-orange-100', text: 'text-orange-700' },
  info: { bg: 'bg-blue-50', border: 'border-blue-100', icon: 'bg-blue-100', text: 'text-blue-700' },
}

export default function StatCard({
  label, value, icon: Icon, color = "primary", trend,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: "primary" | "accent" | "danger" | "success" | "warning" | "info";
  trend?: string;
}) {
  const c = colorMap[color];

  return (
    <div className={`rounded-2xl border p-5 ${c.bg} ${c.border}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.icon} ${c.text}`}>
          <Icon size={20} />
        </div>
        {trend && <span className="text-xs font-semibold text-success">{trend}</span>}
      </div>
      <div className={`text-[28px] font-bold ${c.text}`}>{value}</div>
      <div className="text-[13px] text-text-muted mt-1">{label}</div>
    </div>
  );
}
