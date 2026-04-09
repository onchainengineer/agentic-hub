import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Copy, FileCode, Hash, Lightbulb, Terminal } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CopyButton } from "@/components/CopyButton";
import { SkillMarkdown } from "@/components/SkillMarkdown";
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

          {/* Use with — tool-agnostic */}
          <div className="bg-white rounded-2xl border border-gray-200/60 p-6 mb-6">
            <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  How to use this skill
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Works with any Claude-based agent
                </h2>
              </div>
              <CopyButton text={fullMarkdown} label="Copy full skill" />
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <UseCard
                title="Claude Code"
                description="Drop into .claude/skills/ as SKILL.md"
                lines={[
                  `mkdir -p .claude/skills/${skill.slug}`,
                  `# paste into .claude/skills/${skill.slug}/SKILL.md`,
                ]}
              />
              <UseCard
                title="Cursor"
                description="Paste as a Rule or custom prompt"
                lines={[
                  `# Settings → Rules for AI → New rule`,
                  `# paste the skill body as the rule content`,
                ]}
              />
              <UseCard
                title="Anthropic API"
                description="Use as a system prompt in messages.create"
                lines={[
                  `client.messages.create(`,
                  `  model="claude-sonnet-4-6",`,
                  `  system=open("${skill.slug}.md").read(),`,
                  `  messages=[...])`,
                ]}
              />
              <UseCard
                title="Agent SDK / LangChain"
                description="Inject as the agent's system message"
                lines={[
                  `const system = await fs.readFile("${skill.slug}.md", "utf8");`,
                  `const agent = createAgent({ system, ... });`,
                ]}
              />
            </div>
          </div>

          {/* Rendered body */}
          <article className="bg-white rounded-2xl border border-gray-200/60 p-6 md:p-8">
            <SkillMarkdown>{body}</SkillMarkdown>
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

function UseCard({
  title,
  description,
  lines,
}: {
  title: string;
  description: string;
  lines: string[];
}) {
  return (
    <div className="bg-[#0d1117] border border-[#1c2432] rounded-xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#1c2432] bg-[#161b22]">
        <Terminal className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-xs font-semibold text-gray-300">{title}</span>
        <span className="text-[10px] text-gray-500 ml-auto truncate">{description}</span>
      </div>
      <pre className="p-4 text-[11px] leading-relaxed font-mono text-[#e6edf3] overflow-x-auto">
        {lines.map((line, i) => (
          <div key={i} className={line.startsWith("#") ? "text-[#7d8590]" : ""}>
            {line || " "}
          </div>
        ))}
      </pre>
    </div>
  );
}
