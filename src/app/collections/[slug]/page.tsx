import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles, Zap, Target, Network, Code2, Database, FileCode, FileCode2, Cog, Bot } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProjectCard } from "@/components/ProjectCard";
import { COLLECTIONS, getCollection } from "@/lib/collections";
import { getAllProjects } from "@/lib/data";

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

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const col = getCollection(params.slug);
  if (!col) return { title: "Not found" };
  return {
    title: `${col.name} — Agentic Hub`,
    description: col.description,
  };
}

export default function CollectionDetail({ params }: { params: { slug: string } }) {
  const collection = getCollection(params.slug);
  if (!collection) notFound();

  const projects = collection.filter(getAllProjects());
  const Icon = ICONS[collection.icon] || Sparkles;
  const totalGfi = projects.reduce((sum, p) => sum + (p.goodFirstIssues ?? 0), 0);
  const totalHw = projects.reduce((sum, p) => sum + (p.helpWanted ?? 0), 0);

  const otherCollections = COLLECTIONS.filter((c) => c.slug !== collection.slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-brand-neutral-100">
      <Nav />

      <section className="pt-32 pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <Link
            href="/collections/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> All collections
          </Link>

          <div className="bg-white rounded-2xl border border-gray-200/60 p-8 mb-8">
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 rounded-2xl bg-brand-accent-50 text-brand-accent-600 flex items-center justify-center shrink-0">
                <Icon className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-1">{collection.name}</h1>
                <p className="text-gray-500 mb-4">{collection.tagline}</p>
                <p className="text-gray-700 leading-relaxed mb-5">{collection.description}</p>
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  <span className="text-gray-700 px-3 py-1 rounded-md bg-gray-50 border border-gray-100">
                    <span className="font-semibold text-gray-900">{projects.length}</span> projects
                  </span>
                  {totalGfi > 0 && (
                    <span className="text-emerald-700 px-3 py-1 rounded-md bg-emerald-50 border border-emerald-100">
                      <span className="font-semibold">{totalGfi}</span> good first issues
                    </span>
                  )}
                  {totalHw > 0 && (
                    <span className="text-blue-700 px-3 py-1 rounded-md bg-blue-50 border border-blue-100">
                      <span className="font-semibold">{totalHw}</span> help wanted
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              No projects currently match this collection. Check back after the next weekly update.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((p) => (
                <ProjectCard key={p.repo} project={p} />
              ))}
            </div>
          )}

          {/* Other collections */}
          <div className="mt-16 pt-12 border-t border-gray-200/60">
            <h2 className="text-xl font-bold mb-5">Other collections</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {otherCollections.map((c) => {
                const OtherIcon = ICONS[c.icon] || Sparkles;
                return (
                  <Link
                    key={c.slug}
                    href={`/collections/${c.slug}/`}
                    className="group flex items-center gap-3 bg-white border border-gray-200/60 rounded-xl p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-brand-accent-50 transition-colors">
                      <OtherIcon className="w-4 h-4 text-gray-600 group-hover:text-brand-accent-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold truncate group-hover:text-brand-accent-600">
                        {c.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">{c.tagline}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
