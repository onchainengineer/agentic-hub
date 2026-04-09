import Link from "next/link";
import { Star, GitFork, Sparkles, ExternalLink } from "lucide-react";
import { CATEGORY_META, type Project } from "@/lib/types";
import { formatStars, formatRelative } from "@/lib/utils";

export function ProjectCard({ project }: { project: Project }) {
  const cat = CATEGORY_META[project.category];
  const gfi = project.goodFirstIssues ?? 0;

  return (
    <Link
      href={`/projects/${project.slug}/`}
      className="group block bg-white rounded-2xl border border-gray-200/60 p-6 hover:border-brand-accent-400 hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate group-hover:text-brand-accent-600 transition-colors">
              {project.name}
            </h3>
            {project.featured && (
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            )}
          </div>
          <div className="text-xs text-gray-500 font-mono truncate">{project.repo}</div>
        </div>
        <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-brand-accent-50 text-brand-accent-700 shrink-0">
          {cat.label}
        </span>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2 mb-4 min-h-[2.5rem]">
        {project.aiDescription || project.description || "No description available."}
      </p>

      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3" /> {formatStars(project.stars)}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="w-3 h-3" /> {formatStars(project.forks)}
        </span>
        <span className="font-mono">{project.language}</span>
        <span className="ml-auto">{formatRelative(project.pushedAt)}</span>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
        {gfi > 0 ? (
          <span className="text-xs px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 font-medium">
            {gfi} good first issue{gfi === 1 ? "" : "s"}
          </span>
        ) : project.helpWanted > 0 ? (
          <span className="text-xs px-2 py-1 rounded-md bg-blue-50 text-blue-700 font-medium">
            {project.helpWanted} help wanted
          </span>
        ) : (
          <span className="text-xs px-2 py-1 rounded-md bg-gray-50 text-gray-500">
            No open beginner issues
          </span>
        )}
        {typeof project.beginnerScore === "number" && (
          <span className="ml-auto text-xs text-gray-500">
            Beginner: <span className="font-semibold text-gray-900">{project.beginnerScore}/10</span>
          </span>
        )}
      </div>
    </Link>
  );
}
