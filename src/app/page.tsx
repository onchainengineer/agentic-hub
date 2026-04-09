import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Zap, Search, Github, Bot, Brain, Network, Code2, Database, Gauge } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProjectCard } from "@/components/ProjectCard";
import { getFeaturedProjects, getStats, getTrendingProjects } from "@/lib/data";
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

export default function Home() {
  const featured = getFeaturedProjects(6);
  const trending = getTrendingProjects(3);
  const stats = getStats();

  const categories = (Object.keys(CATEGORY_META) as Category[]).slice(0, 8);

  return (
    <div className="min-h-screen bg-brand-neutral-100">
      <Nav />

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-44 md:pb-24 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-5xl relative">
          <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
            <span className="text-xs px-3 py-1.5 rounded-full bg-brand-accent-50 text-brand-accent-700 font-medium border border-brand-accent-200">
              <Sparkles className="w-3 h-3 inline mr-1" /> AI-curated weekly
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
              {stats.totalProjects} projects tracked
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 font-medium border border-amber-200">
              {stats.totalGfi + stats.totalHelpWanted} open beginner issues
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-center mb-6">
            Your launchpad into{" "}
            <span className="text-brand-accent-600">agentic AI</span>
            <br />
            open source
          </h1>

          <p className="text-lg md:text-xl text-gray-500 text-center max-w-3xl mx-auto mb-10">
            Discover the best agentic AI projects to contribute to. Hand-curated, AI-scored for beginner-friendliness, and updated weekly with trending projects from across the ecosystem.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/projects/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
            >
              Browse projects <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/guide/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white border border-gray-200 text-gray-900 font-medium hover:border-brand-accent-400 transition-colors"
            >
              Read the guide
            </Link>
          </div>

          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Projects tracked" value={stats.totalProjects} />
            <StatCard label="Total stars" value={formatStars(stats.totalStars)} />
            <StatCard label="Languages" value={stats.languageCount} />
            <StatCard label="Categories" value={stats.categoryCount} />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white border-t border-gray-200/60">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Browse by category</h2>
              <p className="text-gray-500">Pick an area that matches your interests.</p>
            </div>
            <Link
              href="/categories/"
              className="hidden md:inline-flex items-center gap-1 text-sm text-brand-accent-600 hover:text-brand-accent-700"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((c) => {
              const meta = CATEGORY_META[c];
              const Icon = CATEGORY_ICONS[c];
              return (
                <Link
                  key={c}
                  href={`/projects/?category=${c}`}
                  className="group block bg-brand-neutral-100 rounded-2xl border border-gray-200/60 p-5 hover:border-brand-accent-400 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-200/60 flex items-center justify-center mb-3 group-hover:bg-brand-accent-50 group-hover:border-brand-accent-300 transition-colors">
                    <Icon className="w-5 h-5 text-brand-accent-600" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-brand-accent-600 transition-colors">
                    {meta.label}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{meta.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-16 border-t border-gray-200/60">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2">
                <Sparkles className="w-7 h-7 text-amber-500" />
                Featured projects
              </h2>
              <p className="text-gray-500">The strongest starting points right now.</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((p) => (
              <ProjectCard key={p.repo} project={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="py-16 bg-white border-t border-gray-200/60">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2">
                <TrendingUp className="w-7 h-7 text-emerald-500" />
                Trending
              </h2>
              <p className="text-gray-500">Most starred in the ecosystem.</p>
            </div>
            <Link
              href="/projects/"
              className="hidden md:inline-flex items-center gap-1 text-sm text-brand-accent-600"
            >
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {trending.map((p) => (
              <ProjectCard key={p.repo} project={p} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 border-t border-gray-200/60">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">How Agentic Hub works</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              An AI pipeline discovers, scores, and describes agentic AI projects every week. You get the best signal with zero noise.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <HowItWorksCard
              step="1"
              icon={<Search className="w-5 h-5" />}
              title="Discover"
              description="AI scans GitHub trending, Hacker News, and community sources every week for new agentic AI projects."
            />
            <HowItWorksCard
              step="2"
              icon={<Brain className="w-5 h-5" />}
              title="Score"
              description="Each project is rated 1-10 for beginner-friendliness based on CONTRIBUTING.md, issue labels, and maintainer responsiveness."
            />
            <HowItWorksCard
              step="3"
              icon={<Zap className="w-5 h-5" />}
              title="Explain"
              description="AI generates plain-English descriptions, first-step guides, and beginner-friendly issue summaries for every project."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-gray-200/60 bg-gradient-to-b from-brand-neutral-100 to-white">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Ready to contribute?</h2>
          <p className="text-lg text-gray-500 mb-8">
            Pick a project, read the guide, and make your first PR to the agentic AI ecosystem.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/projects/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-accent-600 text-white font-medium hover:bg-brand-accent-700 transition-colors"
            >
              Find a project <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/onchainengineer/agentic-hub"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
            >
              <Github className="w-4 h-4" /> Star on GitHub
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/60 p-5 text-center">
      <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-xs text-gray-500 uppercase tracking-wide">{label}</div>
    </div>
  );
}

function HowItWorksCard({
  step,
  icon,
  title,
  description,
}: {
  step: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/60 p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-brand-accent-50 text-brand-accent-600 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-xs font-semibold text-gray-400">STEP {step}</span>
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
