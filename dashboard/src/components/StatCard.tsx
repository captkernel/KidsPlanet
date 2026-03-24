import { LucideIcon } from "lucide-react";

export default function StatCard({
  label, value, icon: Icon, color = "primary", trend,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: "primary" | "accent" | "danger" | "success" | "warning" | "info";
  trend?: string;
}) {
  const colorMap = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent-dark",
    danger: "bg-red-50 text-danger",
    success: "bg-green-50 text-success",
    warning: "bg-amber-50 text-warning",
    info: "bg-blue-50 text-info",
  };

  return (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <Icon size={20} />
        </div>
        {trend && <span className="text-xs font-semibold text-success">{trend}</span>}
      </div>
      <div className="text-2xl font-bold text-primary-dark">{value}</div>
      <div className="text-xs text-text-muted mt-1">{label}</div>
    </div>
  );
}
