import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { SkillsExplorer } from "@/components/SkillsExplorer";
import { getAllSkills, getSkillCategories, getSkillsStats } from "@/lib/skills";

export const metadata = {
  title: "Skills — Agentic Hub",
  description:
    "151 ready-to-use Claude Code skills across engineering, design, marketing, sales, and more. Copy, paste, and use in your own projects.",
};

export default function SkillsPage() {
  const skills = getAllSkills();
  const categories = getSkillCategories();
  const stats = getSkillsStats();

  return (
    <div className="min-h-screen bg-brand-neutral-100">
      <Nav />

      <section className="pt-32 pb-10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-brand-accent-50 text-brand-accent-700 font-medium border border-brand-accent-200 mb-4">
              <span>{stats.total} skills</span>
              <span className="w-1 h-1 rounded-full bg-brand-accent-400" />
              <span>{stats.categoryCount} categories</span>
              <span className="w-1 h-1 rounded-full bg-brand-accent-400" />
              <span>Ready to copy</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Skills Library</h1>
            <p className="text-gray-500 text-lg max-w-3xl">
              Production-grade Claude Code skills you can copy into your own projects. Each skill is a
              self-contained persona with identity, mission, and operating principles — drop the markdown
              file into <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded font-mono">.claude/skills/</code> and your agent gains that expertise instantly.
            </p>
          </div>

          <SkillsExplorer skills={skills} categories={categories} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
