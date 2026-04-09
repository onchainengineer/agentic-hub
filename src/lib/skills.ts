import skillsData from "../../data/skills.json";
import fs from "fs";
import path from "path";

export type Skill = {
  slug: string;
  name: string;
  description: string;
  category: string;
  categoryLabel: string;
  color: string | null;
  emoji: string;
  vibe: string;
  bodyFile: string;
  sourceFile: string;
  bytes: number;
  lines: number;
  sections: number;
};

export type SkillsCategory = {
  slug: string;
  label: string;
  count: number;
};

export type SkillsIndex = {
  generatedAt: string;
  total: number;
  categories: SkillsCategory[];
  items: Skill[];
};

const data = skillsData as SkillsIndex;

export function getAllSkills(): Skill[] {
  return data.items;
}

export function getSkill(slug: string): Skill | undefined {
  return data.items.find((s) => s.slug === slug);
}

export function getSkillsByCategory(categorySlug: string): Skill[] {
  return data.items.filter((s) => s.category === categorySlug);
}

export function getSkillCategories(): SkillsCategory[] {
  return data.categories;
}

export function getSkillsStats() {
  return {
    total: data.total,
    categoryCount: data.categories.length,
    generatedAt: data.generatedAt,
  };
}

/**
 * Read the full markdown body of a skill from disk at build time.
 * Only called in server components (generateStaticParams / page).
 */
export function getSkillBody(skill: Skill): { frontmatter: string; body: string } {
  const filePath = path.join(process.cwd(), "data", skill.bodyFile);
  const raw = fs.readFileSync(filePath, "utf-8");
  // Strip YAML frontmatter block
  if (raw.startsWith("---")) {
    const end = raw.indexOf("\n---", 3);
    if (end !== -1) {
      const frontmatter = raw.slice(3, end).trim();
      const body = raw.slice(end + 4).replace(/^\n+/, "");
      return { frontmatter, body };
    }
  }
  return { frontmatter: "", body: raw };
}
