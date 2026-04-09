import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Target, Network, Code2, Database, FileCode, FileCode2, Cog, Bot } from "lucide-react";
import type { CollectionDef } from "@/lib/collections";
import type { Project } from "@/lib/types";

const ICONS: Record<string, typeof Sparkles> = {
  Sparkles,
  Zap,
  Target,
  Network,
  Code2,
  Database,
  FileCode,
  FileCode2,
  Cog,
  Bot,
};

const COLOR_MAP: Record<string, { bg: string; text: string; ring: string }> = {
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-100" },
  amber: { bg: "bg-amber-50", text: "text-amber-600", ring: "ring-amber-100" },
  blue: { bg: "bg-blue-50", text: "text-blue-600", ring: "ring-blue-100" },
  rose: { bg: "bg-rose-50", text: "text-rose-600", ring: "ring-rose-100" },
  violet: { bg: "bg-violet-50", text: "text-violet-600", ring: "ring-violet-100" },
  cyan: { bg: "bg-cyan-50", text: "text-cyan-600", ring: "ring-cyan-100" },
  orange: { bg: "bg-orange-50", text: "text-orange-600", ring: "ring-orange-100" },
  teal: { bg: "bg-teal-50", text: "text-teal-600", ring: "ring-teal-100" },
};

export function CollectionCard({
  collection,
  projects,
  variant = "default",
}: {
  collection: CollectionDef;
  projects: Project[];
  variant?: "default" | "compact";
}) {
  const Icon = ICONS[collection.icon] || Sparkles;
  const color = COLOR_MAP[collection.color] || COLOR_MAP.blue;
  const count = projects.length;
  const totalIssues = projects.reduce(
    (sum, p) => sum + (p.goodFirstIssues ?? 0) + (p.helpWanted ?? 0),
    0,
  );

  return (
    <Link
      href={`/collections/${collection.slug}/`}
      className="group block bg-white rounded-2xl border border-gray-200/60 p-6 hover:border-gray-300 hover:shadow-lg transition-all"
    >
      <div className="flex items-start gap-4 mb-4">
        <div
          className={`w-11 h-11 rounded-xl ${color.bg} ${color.text} flex items-center justify-center shrink-0 ring-4 ring-transparent group-hover:${color.ring} transition-all`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 group-hover:text-brand-accent-600 transition-colors">
            {collection.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">{collection.tagline}</p>
        </div>
      </div>

      {variant === "default" && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[2.5rem]">
          {collection.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <span>
            <span className="font-semibold text-gray-900">{count}</span> projects
          </span>
          {totalIssues > 0 && (
            <span>
              <span className="font-semibold text-emerald-600">{totalIssues}</span> open issues
            </span>
          )}
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-brand-accent-600 group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}
