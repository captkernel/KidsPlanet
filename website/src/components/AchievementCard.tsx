import { Trophy, GraduationCap, Medal, Star } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  year: string;
  category: string;
  description: string;
}

const categoryConfig: Record<string, { icon: typeof Trophy; color: string }> = {
  school: { icon: Star, color: "bg-accent/10 text-accent-dark" },
  academic: { icon: GraduationCap, color: "bg-primary/10 text-primary" },
  sports: { icon: Medal, color: "bg-blue-50 text-blue-600" },
  cultural: { icon: Trophy, color: "bg-purple-50 text-purple-600" },
};

export function AchievementCard({ achievement }: { achievement: Achievement }) {
  const config = categoryConfig[achievement.category] || categoryConfig.school;
  const Icon = config.icon;

  return (
    <div className="card">
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${config.color}`}>
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-accent uppercase tracking-wider">
              {achievement.year}
            </span>
            <span className="text-xs text-text-muted capitalize">
              {achievement.category}
            </span>
          </div>
          <h3 className="font-bold text-primary-dark text-sm">{achievement.title}</h3>
          <p className="text-sm text-text-light mt-1 leading-relaxed">
            {achievement.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AchievementCard;
