import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, GitFork, ExternalLink, Calendar, Scale, Github, ArrowRight } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProjectCard } from "@/components/ProjectCard";
import { getAllProjects, getProject } from "@/lib/data";
import { CATEGORY_META } from "@/lib/types";
import { formatStars, formatRelative } from "@/lib/utils";

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = getProject(params.slug);
  if (!p) return { title: "Not found" };
  return {
    title: `${p.name} — Agentic Hub`,
    description: p.aiDescription || p.description || `Contribute to ${p.repo}`,
  };
}

export default function ProjectDetail({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const cat = CATEGORY_META[project.category];
  const related = getAllProjects()
    .filter((p) => p.category === project.category && p.repo !== project.repo)
    .slice(0, 3);

  const issuesUrl = `${project.url}/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22`;
  const helpWantedUrl = `${project.url}/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22`;

  return (
    <div className="min-h-screen bg-brand-neutral-100">
      <Nav />

      <section className="pt-28 pb-16">
        <div className="container mx-auto px-6 max-w-5xl">
          <Link
            href="/projects/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> All projects
          </Link>

          <div className="bg-white rounded-2xl border border-gray-200/60 p-8 mb-6">
            <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-brand-accent-50 text-brand-accent-700">
                    {cat.label}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-mono">
                    {project.language}
                  </span>
                  {project.archived && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-700 font-medium">
                      Archived
                    </span>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{project.name}</h1>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-gray-500 hover:text-brand-accent-600 font-mono inline-flex items-center gap-1"
                >
                  {project.repo} <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex gap-2">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
                >
                  <Github className="w-4 h-4" /> View on GitHub
                </a>
              </div>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {project.aiDescription || project.description || "No description available."}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetaBox icon={<Star className="w-4 h-4" />} label="Stars" value={formatStars(project.stars)} />
              <MetaBox icon={<GitFork className="w-4 h-4" />} label="Forks" value={formatStars(project.forks)} />
              <MetaBox icon={<Calendar className="w-4 h-4" />} label="Last push" value={formatRelative(project.pushedAt)} />
              <MetaBox icon={<Scale className="w-4 h-4" />} label="License" value={project.license || "—"} />
            </div>
          </div>

          {/* Issues CTA */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <a
              href={issuesUrl}
              target="_blank"
              rel="noreferrer"
              className="block bg-emerald-50 border border-emerald-200 rounded-2xl p-6 hover:border-emerald-400 transition-colors"
            >
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-2">
                Good First Issues
              </div>
              <div className="text-4xl font-bold text-emerald-900 mb-1">
                {project.goodFirstIssues ?? 0}
              </div>
              <div className="text-sm text-emerald-700 flex items-center gap-1">
                Browse on GitHub <ExternalLink className="w-3 h-3" />
              </div>
            </a>
            <a
              href={helpWantedUrl}
              target="_blank"
              rel="noreferrer"
              className="block bg-blue-50 border border-blue-200 rounded-2xl p-6 hover:border-blue-400 transition-colors"
            >
              <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">
                Help Wanted
              </div>
              <div className="text-4xl font-bold text-blue-900 mb-1">
                {project.helpWanted ?? 0}
              </div>
              <div className="text-sm text-blue-700 flex items-center gap-1">
                Browse on GitHub <ExternalLink className="w-3 h-3" />
              </div>
            </a>
          </div>

          {/* AI-generated content */}
          {(project.whyContribute || project.firstSteps) && (
            <div className="bg-white rounded-2xl border border-gray-200/60 p-8 mb-6">
              {project.whyContribute && (
                <>
                  <h2 className="text-xl font-bold mb-3">Why contribute here</h2>
                  <p className="text-gray-700 mb-6">{project.whyContribute}</p>
                </>
              )}
              {project.firstSteps && project.firstSteps.length > 0 && (
                <>
                  <h2 className="text-xl font-bold mb-3">First steps</h2>
                  <ol className="space-y-2 text-gray-700">
                    {project.firstSteps.map((step, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-brand-accent-50 text-brand-accent-700 flex items-center justify-center text-xs font-semibold">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </>
              )}
            </div>
          )}

          {/* Beginner score */}
          {typeof project.beginnerScore === "number" && (
            <div className="bg-white rounded-2xl border border-gray-200/60 p-8 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold">Beginner score</h2>
                <span className="text-3xl font-bold text-brand-accent-600">
                  {project.beginnerScore}/10
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-brand-accent-600"
                  style={{ width: `${project.beginnerScore * 10}%` }}
                />
              </div>
              {project.beginnerReasoning && (
                <p className="text-sm text-gray-600">{project.beginnerReasoning}</p>
              )}
            </div>
          )}

          {/* Topics */}
          {project.topics && project.topics.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200/60 p-6 mb-6">
              <h3 className="text-sm font-semibold mb-3 text-gray-500 uppercase tracking-wide">
                Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.topics.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-12">
              <div className="flex items-end justify-between mb-4">
                <h2 className="text-2xl font-bold">More {cat.label}</h2>
                <Link
                  href={`/projects/?category=${project.category}`}
                  className="text-sm text-brand-accent-600 inline-flex items-center gap-1"
                >
                  See all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {related.map((p) => (
                  <ProjectCard key={p.repo} project={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function MetaBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-brand-neutral-100 rounded-lg border border-gray-200/60 p-3">
      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
        {icon}
        {label}
      </div>
      <div className="font-semibold text-gray-900">{value}</div>
    </div>
  );
}
