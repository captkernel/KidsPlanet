"use client";

import { useState } from "react";
import FadeIn from "./FadeIn";
import {
  Smile, Music, BookOpen, Apple, Palette, Sun, Heart,
  Calculator, FlaskConical, Globe, Utensils, Monitor, Pencil, Library
} from "lucide-react";

interface ScheduleItem {
  time: string;
  activity: string;
  icon: string;
}

interface ScheduleLevel {
  label: string;
  subtitle: string;
  timings: string;
  schedule: ScheduleItem[];
}

const iconMap: Record<string, typeof Smile> = {
  smile: Smile,
  music: Music,
  "book-open": BookOpen,
  apple: Apple,
  palette: Palette,
  sun: Sun,
  heart: Heart,
  calculator: Calculator,
  "flask-conical": FlaskConical,
  globe: Globe,
  utensils: Utensils,
  monitor: Monitor,
  pencil: Pencil,
  library: Library,
};

export function DailySchedule({ schedules }: { schedules: Record<string, ScheduleLevel> }) {
  const levels = Object.keys(schedules);
  const [activeLevel, setActiveLevel] = useState(levels[0]);
  const schedule = schedules[activeLevel];

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {levels.map((level) => (
          <button
            key={level}
            onClick={() => setActiveLevel(level)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
              activeLevel === level
                ? "bg-primary text-white"
                : "bg-surface-muted text-text-light hover:bg-primary/10"
            }`}
          >
            {schedules[level].label}
          </button>
        ))}
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <p className="text-sm text-text-muted">{schedule.subtitle}</p>
          <p className="text-xs text-accent font-semibold mt-1">{schedule.timings}</p>
        </div>

        <div className="space-y-0">
          {schedule.schedule.map((item, i) => {
            const Icon = iconMap[item.icon] || Sun;
            return (
              <FadeIn key={item.time} delay={i * 0.05}>
                <div className="flex items-center gap-4 py-3 border-b border-primary/5 last:border-0">
                  <div className="w-16 text-right flex-shrink-0">
                    <span className="text-xs font-semibold text-primary">{item.time}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-primary" />
                  </div>
                  <span className="text-sm text-text-light">{item.activity}</span>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default DailySchedule;
