import { Bell, Calendar as CalendarIcon, Gift, BookOpen } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  date: string;
  type: string;
  content: string;
}

const typeConfig: Record<string, { icon: typeof Bell; color: string }> = {
  general: { icon: Bell, color: "bg-primary/10 text-primary" },
  event: { icon: Gift, color: "bg-accent/10 text-accent-dark" },
  holiday: { icon: CalendarIcon, color: "bg-red-50 text-red-600" },
  exam: { icon: BookOpen, color: "bg-blue-50 text-blue-600" },
};

export function AnnouncementList({ announcements }: { announcements: Announcement[] }) {
  const sorted = [...announcements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-4">
      {sorted.map((a) => {
        const config = typeConfig[a.type] || typeConfig.general;
        const Icon = config.icon;
        const date = new Date(a.date);

        return (
          <div key={a.id} className="card flex gap-4">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="text-2xl font-bold text-primary">
                {date.getDate()}
              </div>
              <div className="text-xs text-text-muted uppercase">
                {date.toLocaleString("en-IN", { month: "short" })}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${config.color}`}>
                  <Icon size={12} />
                </div>
                <span className="text-xs uppercase tracking-wider text-text-muted font-medium">
                  {a.type}
                </span>
              </div>
              <h3 className="font-bold text-primary-dark">{a.title}</h3>
              <p className="text-sm text-text-light mt-1 leading-relaxed">
                {a.content}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default AnnouncementList;
