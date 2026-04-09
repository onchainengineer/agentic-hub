import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Copy, FileCode, Hash, Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CopyButton } from "@/components/CopyButton";
import {
  getAllSkills,
  getSkill,
  getSkillBody,
  getSkillsByCategory,
} from "@/lib/skills";

export function generateStaticParams() {
  return getAllSkills().map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const skill = getSkill(params.slug);
  if (!skill) return { title: "Not found" };
  return {
    title: `${skill.name} — Agentic Hub Skills`,
    description: skill.description,
  };
}

export default function SkillDetail({ params }: { params: { slug: string } }) {
  const skill = getSkill(params.slug);
  if (!skill) notFound();

  const { body } = getSkillBody(skill);
  const related = getSkillsByCategory(skill.category)
    .filter((s) => s.slug !== skill.slug)
    .slice(0, 5);

  const fullMarkdown = `---
name: ${skill.name}
description: ${skill.description}
${skill.color ? `color: "${skill.color}"` : ""}
${skill.emoji ? `emoji: ${skill.emoji}` : ""}
${skill.vibe ? `vibe: ${skill.vibe}` : ""}
---

${body}`;

  const headerStyle = skill.color
    ? {
        background: `linear-gradient(135deg, ${skill.color}18 0%, ${skill.color}05 100%)`,
      }
    : {};
  const iconBg = skill.color
    ? { backgroundColor: `${skill.color}25`, color: skill.color }
    : {};

  return (
    <div className="min-h-screen bg-brand-neutral-100">
      <Nav />

      <section className="pt-28 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <Link
            href="/skills/"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> All skills
          </Link>

          {/* Header card */}
          <div
            className="rounded-2xl border border-gray-200/60 p-8 mb-6"
            style={headerStyle}
          >
            <div className="flex items-start gap-5 mb-5">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0 bg-white/80 backdrop-blur"
                style={iconBg}
              >
                {skill.emoji || "⚡"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-mono text-gray-500 mb-1">
                  {skill.categoryLabel}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{skill.name}</h1>
                {skill.vibe && (
                  <p className="text-sm italic text-gray-600 flex items-start gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    {skill.vibe}
                  </p>
                )}
              </div>
            </div>

            <p className="text-gray-700 leading-relaxed">{skill.description}</p>

            <div className="flex items-center gap-4 mt-5 pt-5 border-t border-gray-200/60 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1">
                <FileCode className="w-3 h-3" /> {skill.lines} lines
              </span>
              <span className="inline-flex items-center gap-1">
                <Hash className="w-3 h-3" /> {skill.sections} sections
              </span>
              <span className="ml-auto font-mono">{skill.sourceFile}</span>
            </div>
          </div>

          {/* Copy + Install */}
          <div className="bg-gray-900 text-white rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                  Install
                </div>
                <h2 className="text-lg font-semibold">
                  Drop into your{" "}
                  <code className="text-brand-accent-300 font-mono text-base">
                    .claude/skills/
                  </code>
                </h2>
              </div>
              <CopyButton text={fullMarkdown} label="Copy full skill" />
            </div>

            <div className="bg-black/30 rounded-lg p-4 text-xs font-mono text-gray-300 space-y-1">
              <div><span className="text-gray-500"># 1. Create the skill file</span></div>
              <div><span className="text-brand-accent-300">mkdir</span> -p .claude/skills/{skill.slug}</div>
              <div><span className="text-gray-500"># 2. Paste the markdown into:</span></div>
              <div>.claude/skills/{skill.slug}/SKILL.md</div>
              <div className="pt-1"><span className="text-gray-500"># 3. Restart Claude Code. The skill is now available.</span></div>
            </div>
          </div>

          {/* Rendered body */}
          <article className="bg-white rounded-2xl border border-gray-200/60 p-8 prose prose-sm md:prose-base max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-brand-accent-600 prose-code:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:bg-gray-900 prose-pre:text-gray-100">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
          </article>

          {/* Related */}
          {related.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold mb-4">More {skill.categoryLabel} skills</h2>
              <div className="grid md:grid-cols-2 gap-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/skills/${r.slug}/`}
                    className="group flex items-start gap-3 bg-white border border-gray-200/60 rounded-xl p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-lg shrink-0">
                      {r.emoji || "⚡"}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm group-hover:text-brand-accent-600 transition-colors">
                        {r.name}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-1">
                        {r.description}
                      </div>
                    </div>
                  </Link>
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
