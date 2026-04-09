import Link from "next/link";
import { ArrowRight, Bot, Zap, Code2, Database, Gauge, Network, Search, Brain } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { getAllProjects } from "@/lib/data";
import { CATEGORY_META, type Category } from "@/lib/types";
import { formatStars } from "@/lib/utils";

const CATEGORY_ICONS: Record<Category, typeof Bot> = {
  "agent-framework": Bot,
  "visual-builder": Zap,
  "coding-agent": Code2,
  "memory-rag": Database,
  "llm-tooling": Gauge,
  mcp: Network,
  "evals-observability": Search,
  protocols: Brain,
};

export const metadata = {
  title: "Categories — Agentic Hub",
  description: "Browse agentic AI open source projects by category: agent frameworks, coding agents, MCP, memory, and more.",
};

export default function CategoriesPage() {
  const projects = getAllProjects();
  const categories = (Object.keys(CATEGORY_META) as Category[]).map((c) => {
    const catProjects = projects.filter((p) => p.category === c);
    const totalStars = catProjects.reduce((sum, p) => sum + p.stars, 0);
    const totalGfi = catProjects.reduce((sum, p) => sum + (p.goodFirstIssues || 0), 0);
    return {
      key: c,
      meta: CATEGORY_META[c],
      Icon: CATEGORY_ICONS[c],
      count: catProjects.length,
      totalStars,
      totalGfi,
      topProjects: catProjects.sort((a, b) => b.stars - a.stars).slice(0, 3),
    };
  }).filter((c) => c.count > 0);

  return (
    <div className="min-h-screen bg-brand-neutral-100">
      <Nav />

      <section className="pt-32 pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Categories</h1>
            <p className="text-gray-500 text-lg max-w-2xl">
              Browse agentic AI projects by area of focus. Each category has curated projects ready for contributors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {categories.map((c) => (
              <Link
                key={c.key}
                href={`/projects/?category=${c.key}`}
                className="group block bg-white rounded-2xl border border-gray-200/60 p-6 hover:border-brand-accent-400 hover:shadow-lg transition-all"
              >
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-brand-accent-50 flex items-center justify-center shrink-0">
                    <c.Icon className="w-6 h-6 text-brand-accent-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold group-hover:text-brand-accent-600 transition-colors">
                      {c.meta.label}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">{c.meta.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{c.count}</div>
                    <div className="text-[10px] text-gray-500 uppercase">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{formatStars(c.totalStars)}</div>
                    <div className="text-[10px] text-gray-500 uppercase">Stars</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">{c.totalGfi}</div>
                    <div className="text-[10px] text-gray-500 uppercase">Good First</div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <div className="text-xs text-gray-500 mb-2">Top projects</div>
                  <div className="flex flex-wrap gap-1">
                    {c.topProjects.map((p) => (
                      <span
                        key={p.repo}
                        className="text-xs px-2 py-0.5 rounded-md bg-gray-50 text-gray-700 font-mono"
                      >
                        {p.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-sm text-brand-accent-600 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore {c.meta.label} <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
