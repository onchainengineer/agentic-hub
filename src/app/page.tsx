import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Wand2, Github, TrendingUp, CircleDot, Clock } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProjectCard } from "@/components/ProjectCard";
import { StatsBar } from "@/components/StatsBar";
import { CollectionCard } from "@/components/CollectionCard";
import {
  getAllProjects,
  getStats,
  getFeaturedProjects,
  getTopBeginnerProjects,
  getActiveProjects,
} from "@/lib/data";
import { COLLECTIONS } from "@/lib/collections";
import { formatRelative } from "@/lib/utils";

export default function Home() {
  const stats = getStats();
  const featured = getFeaturedProjects(6);
  const topBeginner = getTopBeginnerProjects(3);
  const active = getActiveProjects(3);
  const allProjects = getAllProjects();

  const homeCollections = COLLECTIONS.slice(0, 6);

  return (
    <div className="min-h-screen bg-brand-neutral-100">
      <Nav />

      {/* Hero */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-5xl relative">
          <div className="flex items-center justify-center gap-2 mb-6 flex-wrap animate-fade">
            <span className="text-xs px-3 py-1.5 rounded-full bg-brand-accent-50 text-brand-accent-700 font-medium border border-brand-accent-200 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI-curated weekly
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200 inline-flex items-center gap-1">
              <CircleDot className="w-3 h-3" />
              {stats.openBeginnerIssues} open beginner issues
            </span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 font-medium border border-amber-200 inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Updated {formatRelative(stats.generatedAt)}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-center mb-6 animate-slide-up">
            Find your next{" "}
            <span className="text-brand-accent-600">agentic AI</span>
            <br />
            contribution in 60 seconds
          </h1>

          <p className="text-lg md:text-xl text-gray-500 text-center max-w-3xl mx-auto mb-10">
            {stats.totalProjects} curated projects. AI-scored for beginner friendliness, with live good-first-issue counts and hand-picked collections. Built for people who want to ship real open source, not browse awesome-lists.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap mb-14">
            <Link
              href="/find/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors shadow-sm"
            >
              <Wand2 className="w-4 h-4" /> Find my match
            </Link>
            <Link
              href="/projects/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white border border-gray-200 text-gray-900 font-medium hover:border-gray-300 transition-colors"
            >
              Browse {stats.totalProjects} projects
            </Link>
          </div>

          <StatsBar stats={stats} />
        </div>
      </section>

      {/* Start here - three paths */}
      <section className="py-14 bg-white border-t border-gray-200/60">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Start here</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Three paths to your first contribution. Pick the one that matches where you are today.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <PathCard
              icon={<Wand2 className="w-6 h-6" />}
              title="Take the finder quiz"
              description="Answer 4 questions about your language, time, and interests. Get a ranked list of projects that match you."
              href="/find/"
              cta="Start quiz"
              highlight
            />
            <PathCard
              icon={<Sparkles className="w-6 h-6" />}
              title="Browse curated collections"
              description="Hand-picked groupings like 'Perfect first PR', 'Active this week', and 'Build an MCP server'."
              href="/collections/"
              cta={`${COLLECTIONS.length} collections`}
            />
            <PathCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="See everything"
              description="All tracked projects with powerful filters: language, category, issue counts, recency."
              href="/projects/"
              cta={`${stats.totalProjects} projects`}
            />
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 border-t border-gray-200/60">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Featured collections</h2>
              <p className="text-gray-500">Curated groupings to match what you&apos;re looking for.</p>
            </div>
            <Link
              href="/collections/"
              className="inline-flex items-center gap-1 text-sm text-brand-accent-600 hover:text-brand-accent-700"
            >
              All collections <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {homeCollections.map((c) => (
              <CollectionCard
                key={c.slug}
                collection={c}
                projects={c.filter(allProjects)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Top beginner projects */}
      <section className="py-16 bg-white border-t border-gray-200/60">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2">
                <Sparkles className="w-7 h-7 text-emerald-500" />
                Top for beginners right now
              </h2>
              <p className="text-gray-500">Most open good-first-issues, scored by AI for beginner fit.</p>
            </div>
            <Link
              href="/collections/perfect-first-pr/"
              className="inline-flex items-center gap-1 text-sm text-brand-accent-600"
            >
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {topBeginner.map((p) => (
              <ProjectCard key={p.repo} project={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Active this week */}
      {active.length > 0 && (
        <section className="py-16 border-t border-gray-200/60">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2">
                  <Zap className="w-7 h-7 text-amber-500" />
                  Active this week
                </h2>
                <p className="text-gray-500">Commits in the last 7 days — fastest reviewers.</p>
              </div>
              <Link
                href="/collections/active-this-week/"
                className="inline-flex items-center gap-1 text-sm text-brand-accent-600"
              >
                See all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {active.map((p) => (
                <ProjectCard key={p.repo} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured editorial */}
      <section className="py-16 bg-white border-t border-gray-200/60">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-amber-500" />
              Editor&apos;s picks
            </h2>
            <p className="text-gray-500">High-impact projects with beginner-friendly practices and strong momentum.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((p) => (
              <ProjectCard key={p.repo} project={p} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-gray-200/60 bg-gradient-to-b from-brand-neutral-100 to-white">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Ship your first PR this week</h2>
          <p className="text-lg text-gray-500 mb-8">
            Pick a project, read the contributing guide, claim an issue, and make your first PR to the agentic AI ecosystem.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/find/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-accent-600 text-white font-medium hover:bg-brand-accent-700 transition-colors"
            >
              <Wand2 className="w-4 h-4" /> Find my match
            </Link>
            <a
              href="https://github.com/onchainengineer/agentic-hub"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white border border-gray-200 text-gray-900 font-medium hover:border-gray-300 transition-colors"
            >
              <Github className="w-4 h-4" /> Star this project
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function PathCard({
  icon,
  title,
  description,
  href,
  cta,
  highlight,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  cta: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group block rounded-2xl border p-6 transition-all ${
        highlight
          ? "bg-gray-900 border-gray-900 text-white hover:shadow-xl"
          : "bg-white border-gray-200/60 hover:border-gray-300 hover:shadow-md"
      }`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
          highlight
            ? "bg-white/10 text-brand-accent-300"
            : "bg-brand-accent-50 text-brand-accent-600"
        }`}
      >
        {icon}
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className={`text-sm mb-4 ${highlight ? "text-white/70" : "text-gray-600"}`}>
        {description}
      </p>
      <div
        className={`inline-flex items-center gap-1 text-sm font-medium ${
          highlight ? "text-brand-accent-300" : "text-brand-accent-600"
        }`}
      >
        {cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
