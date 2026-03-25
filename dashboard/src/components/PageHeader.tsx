import { ReactNode } from "react";

export default function PageHeader({
  title, subtitle, actions, divider = true,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  divider?: boolean;
}) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 ${divider ? 'border-b border-[#e8e0d0] pb-4' : ''}`}>
      <div>
        <h1 className="text-2xl font-bold text-primary-dark">{title}</h1>
        {subtitle && <p className="text-sm text-text-muted mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
