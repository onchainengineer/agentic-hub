"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Plus, ChevronRight, Sparkles } from "lucide-react";
import type { Skill, SkillsCategory } from "@/lib/skills";
import { cn } from "@/lib/utils";

export function SkillsExplorer({
  skills,
  categories,
}: {
  skills: Skill[];
  categories: SkillsCategory[];
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = skills;
    if (activeCategory) {
      list = list.filter((s) => s.category === activeCategory);
    }
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q) ||
          s.vibe.toLowerCase().includes(q) ||
          s.categoryLabel.toLowerCase().includes(q),
      );
    }
    return list;
  }, [skills, query, activeCategory]);

  return (
    <div className="grid md:grid-cols-[240px_1fr] gap-6">
      {/* Sidebar */}
      <aside className="md:sticky md:top-24 md:self-start">
        <div className="bg-white border border-gray-200/60 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2 font-bold text-gray-900">
              <Sparkles className="w-4 h-4 text-brand-accent-600" />
              Skills
            </div>
            <span className="text-xs text-gray-500 font-mono">{skills.length}</span>
          </div>

          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm mb-1 transition-colors",
              activeCategory === null
                ? "bg-gray-900 text-white"
                : "text-gray-700 hover:bg-gray-50",
            )}
          >
            <span>All</span>
            <span
              className={cn(
                "text-xs font-mono",
                activeCategory === null ? "text-white/70" : "text-gray-400",
              )}
            >
              {skills.length}
            </span>
          </button>

          <div className="space-y-0.5">
            {categories.map((cat) => {
              const active = activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-colors",
                    active
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-50",
                  )}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <ChevronRight
                      className={cn(
                        "w-3 h-3 shrink-0 transition-transform",
                        active && "rotate-90",
                      )}
                    />
                    <span className="truncate">{cat.label}</span>
                  </span>
                  <span
                    className={cn(
                      "text-xs font-mono shrink-0",
                      active ? "text-white/70" : "text-gray-400",
                    )}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div>
        <div className="relative mb-5">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search skills by name, description, or vibe..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-brand-accent-400 focus:ring-2 focus:ring-brand-accent-100"
          />
        </div>

        <div className="text-xs text-gray-500 mb-3">
          {filtered.length} {filtered.length === 1 ? "skill" : "skills"}
          {activeCategory && ` in ${categories.find((c) => c.slug === activeCategory)?.label}`}
          {query && ` matching "${query}"`}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filtered.map((skill) => (
            <SkillCard key={skill.slug} skill={skill} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500 text-sm">
            No skills match your filters.
          </div>
        )}
      </div>
    </div>
  );
}

function SkillCard({ skill }: { skill: Skill }) {
  const bgStyle = skill.color
    ? { backgroundColor: `${skill.color}15`, color: skill.color }
    : {};
  return (
    <Link
      href={`/skills/${skill.slug}/`}
      className="group block bg-white border border-gray-200/60 rounded-xl p-5 hover:border-gray-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-3 mb-2">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 bg-gray-50"
          style={bgStyle}
        >
          {skill.emoji || "⚡"}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 truncate group-hover:text-brand-accent-600 transition-colors">
            {skill.name}
          </h3>
          <div className="text-xs text-gray-500 font-mono">{skill.categoryLabel}</div>
        </div>
        <Plus className="w-4 h-4 text-gray-300 shrink-0 group-hover:text-brand-accent-600 transition-colors" />
      </div>

      <p className="text-sm text-gray-600 line-clamp-3 mb-3">{skill.description}</p>

      {skill.vibe && (
        <div className="text-xs text-gray-500 italic border-l-2 border-gray-200 pl-2">
          {skill.vibe}
        </div>
      )}
    </Link>
  );
}
