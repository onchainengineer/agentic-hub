import { formatRelative } from "@/lib/utils";
import { Package, CircleDot, Zap, Clock } from "lucide-react";

type Stats = {
  totalProjects: number;
  openBeginnerIssues: number;
  activeThisWeek: number;
  generatedAt: string;
};

export function StatsBar({ stats }: { stats: Stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      <Stat
        icon={<Package className="w-4 h-4" />}
        label="Projects curated"
        value={stats.totalProjects}
        hint="Hand-picked + AI-discovered"
      />
      <Stat
        icon={<CircleDot className="w-4 h-4 text-emerald-500" />}
        label="Open beginner issues"
        value={stats.openBeginnerIssues}
        hint="Good first issue + help wanted"
      />
      <Stat
        icon={<Zap className="w-4 h-4 text-amber-500" />}
        label="Active this week"
        value={stats.activeThisWeek}
        hint="Commits in last 7 days"
      />
      <Stat
        icon={<Clock className="w-4 h-4 text-brand-accent-600" />}
        label="Last updated"
        value={formatRelative(stats.generatedAt)}
        hint="Daily stats refresh"
        isText
      />
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  hint,
  isText,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  hint?: string;
  isText?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/60 p-5">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <div className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">
          {label}
        </div>
      </div>
      <div className={`font-bold text-gray-900 mb-1 ${isText ? "text-xl md:text-2xl" : "text-3xl md:text-4xl"}`}>
        {value}
      </div>
      {hint && <div className="text-[11px] text-gray-400">{hint}</div>}
    </div>
  );
}
