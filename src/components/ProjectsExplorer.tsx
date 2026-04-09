"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import { CATEGORY_META, type Category, type Project } from "@/lib/types";
import { cn } from "@/lib/utils";

type SortKey = "stars" | "good-first-issue" | "recent" | "beginner";

const CATEGORY_ORDER: (Category | "all")[] = [
  "all",
  "agent-framework",
  "coding-agent",
  "mcp",
  "memory-rag",
  "llm-tooling",
  "visual-builder",
  "evals-observability",
];

export function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [language, setLanguage] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("stars");
  const [onlyOpenIssues, setOnlyOpenIssues] = useState(false);

  const languages = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => set.add(p.language));
    return ["all", ...Array.from(set).sort()];
  }, [projects]);

  const filtered = useMemo(() => {
    let list = projects;
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.repo.toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q) ||
          (p.aiDescription || "").toLowerCase().includes(q) ||
          (p.topics || []).some((t) => t.toLowerCase().includes(q))
      );
    }
    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }
    if (language !== "all") {
      list = list.filter((p) => p.language === language);
    }
    if (onlyOpenIssues) {
      list = list.filter((p) => (p.goodFirstIssues ?? 0) + (p.helpWanted ?? 0) > 0);
    }

    const sorted = [...list];
    switch (sort) {
      case "stars":
        sorted.sort((a, b) => b.stars - a.stars);
        break;
      case "good-first-issue":
        sorted.sort((a, b) => (b.goodFirstIssues ?? 0) - (a.goodFirstIssues ?? 0));
        break;
      case "recent":
        sorted.sort((a, b) => (b.pushedAt || "").localeCompare(a.pushedAt || ""));
        break;
      case "beginner":
        sorted.sort((a, b) => (b.beginnerScore ?? 0) - (a.beginnerScore ?? 0));
        break;
    }
    return sorted;
  }, [projects, query, category, language, sort, onlyOpenIssues]);

  return (
    <div>
      <div className="bg-white rounded-2xl border border-gray-200/60 p-4 md:p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects by name, description, or topic..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-brand-accent-400 focus:ring-2 focus:ring-brand-accent-100"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:border-brand-accent-400"
          >
            <option value="stars">Most stars</option>
            <option value="good-first-issue">Most beginner issues</option>
            <option value="recent">Recently updated</option>
            <option value="beginner">Best for beginners</option>
          </select>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORY_ORDER.map((c) => {
            const label = c === "all" ? "All" : CATEGORY_META[c].label;
            const active = category === c;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                  active
                    ? "bg-brand-accent-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center flex-wrap gap-3 mt-3 pt-3 border-t border-gray-100">
          <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-xs border border-gray-200 rounded-md px-2 py-1"
          >
            {languages.map((l) => (
              <option key={l} value={l}>
                {l === "all" ? "All languages" : l}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-xs text-gray-700">
            <input
              type="checkbox"
              checked={onlyOpenIssues}
              onChange={(e) => setOnlyOpenIssues(e.target.checked)}
              className="rounded"
            />
            Only projects with open beginner issues
          </label>
          <span className="ml-auto text-xs text-gray-500">
            {filtered.length} of {projects.length} projects
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p) => (
          <ProjectCard key={p.repo} project={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500 text-sm">
          No projects match your filters. Try clearing the search or changing the category.
        </div>
      )}
    </div>
  );
}
