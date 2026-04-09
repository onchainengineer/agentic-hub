import type { Project, Category } from "./types";
import { daysSince } from "./utils";

export type CollectionDef = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  icon: string; // Lucide icon name (handled in component)
  color: string; // Tailwind color class name (e.g. "emerald", "amber")
  filter: (projects: Project[]) => Project[];
};

export const COLLECTIONS: CollectionDef[] = [
  {
    slug: "perfect-first-pr",
    name: "Perfect for your first PR",
    tagline: "Highest beginner scores and open good-first-issues",
    description:
      "Projects scored 7+ out of 10 for beginner friendliness, with at least one open good-first-issue. Clear docs, responsive maintainers, and claimable work.",
    icon: "Sparkles",
    color: "emerald",
    filter: (ps) =>
      ps
        .filter((p) => !p.archived && (p.goodFirstIssues ?? 0) > 0)
        .sort((a, b) => {
          const scoreA = (a.beginnerScore ?? 5) * 3 + Math.min((a.goodFirstIssues ?? 0), 10);
          const scoreB = (b.beginnerScore ?? 5) * 3 + Math.min((b.goodFirstIssues ?? 0), 10);
          return scoreB - scoreA;
        })
        .slice(0, 12),
  },
  {
    slug: "active-this-week",
    name: "Active this week",
    tagline: "Shipping code right now",
    description:
      "Projects pushed to within the last 7 days. Active repos mean faster PR reviews, responsive maintainers, and momentum worth joining.",
    icon: "Zap",
    color: "amber",
    filter: (ps) =>
      ps
        .filter((p) => !p.archived && daysSince(p.pushedAt) < 7)
        .sort((a, b) => b.pushedAt.localeCompare(a.pushedAt)),
  },
  {
    slug: "small-and-focused",
    name: "Small and focused",
    tagline: "Read the whole codebase in an afternoon",
    description:
      "Smaller repositories where you can understand the full architecture in one sitting. Often the best place to make meaningful contributions without weeks of ramp-up.",
    icon: "Target",
    color: "blue",
    filter: (ps) =>
      ps
        .filter((p) => !p.archived && p.stars < 25000)
        .sort((a, b) => {
          // Prefer small but still active
          const activeA = daysSince(a.pushedAt) < 30 ? 0 : 100;
          const activeB = daysSince(b.pushedAt) < 30 ? 0 : 100;
          return a.stars + activeA * 1000 - (b.stars + activeB * 1000);
        })
        .slice(0, 15),
  },
  {
    slug: "build-an-mcp-server",
    name: "Build an MCP server",
    tagline: "The protocol shaping agentic AI",
    description:
      "Model Context Protocol is the emerging standard for connecting AI assistants to tools and data. Every database, API, and service needs a server. Early contributors shape the ecosystem.",
    icon: "Network",
    color: "rose",
    filter: (ps) =>
      ps
        .filter((p) => !p.archived && p.category === "mcp")
        .sort((a, b) => b.stars - a.stars),
  },
  {
    slug: "coding-agents",
    name: "Work on coding agents",
    tagline: "AI that writes and edits code",
    description:
      "The fastest-moving category in agentic AI. Contributing here puts you at the frontier of developer tools, where weekly releases and new capabilities are the norm.",
    icon: "Code2",
    color: "violet",
    filter: (ps) =>
      ps
        .filter((p) => !p.archived && p.category === "coding-agent")
        .sort((a, b) => b.stars - a.stars),
  },
  {
    slug: "memory-and-rag",
    name: "Memory & RAG systems",
    tagline: "Vector DBs, memory layers, retrieval",
    description:
      "The infrastructure that gives LLMs persistent memory and access to real data. Production-grade systems with active development and technical depth.",
    icon: "Database",
    color: "cyan",
    filter: (ps) =>
      ps
        .filter((p) => !p.archived && p.category === "memory-rag")
        .sort((a, b) => (b.goodFirstIssues ?? 0) - (a.goodFirstIssues ?? 0) || b.stars - a.stars),
  },
  {
    slug: "python",
    name: "Python projects",
    tagline: "The largest side of the ecosystem",
    description:
      "All tracked agentic AI projects written primarily in Python. LangChain, CrewAI, AutoGen, LlamaIndex, and dozens more.",
    icon: "FileCode",
    color: "blue",
    filter: (ps) =>
      ps
        .filter((p) => !p.archived && p.language === "Python")
        .sort(
          (a, b) =>
            (b.goodFirstIssues ?? 0) - (a.goodFirstIssues ?? 0) || b.stars - a.stars,
        ),
  },
  {
    slug: "typescript",
    name: "TypeScript & JavaScript",
    tagline: "Node-native agentic AI",
    description:
      "Projects built on TypeScript or JavaScript. Good fit if you want frontend + AI work or ship with Node/Bun/Deno runtimes.",
    icon: "FileCode2",
    color: "amber",
    filter: (ps) =>
      ps
        .filter(
          (p) =>
            !p.archived && (p.language === "TypeScript" || p.language === "JavaScript"),
        )
        .sort(
          (a, b) =>
            (b.goodFirstIssues ?? 0) - (a.goodFirstIssues ?? 0) || b.stars - a.stars,
        ),
  },
  {
    slug: "rust",
    name: "Rust projects",
    tagline: "Systems-level agentic AI",
    description:
      "Rust-based inference engines, vector databases, and MCP SDKs. Smaller ecosystem with less competition per issue and strong performance requirements.",
    icon: "Cog",
    color: "orange",
    filter: (ps) =>
      ps
        .filter((p) => !p.archived && p.language === "Rust")
        .sort(
          (a, b) =>
            (b.goodFirstIssues ?? 0) - (a.goodFirstIssues ?? 0) || b.stars - a.stars,
        ),
  },
  {
    slug: "agent-frameworks",
    name: "Agent frameworks",
    tagline: "The building blocks",
    description:
      "Libraries for composing LLM-powered agents. The most mature category — large ecosystems, many integration opportunities, and clear contribution paths.",
    icon: "Bot",
    color: "teal",
    filter: (ps) =>
      ps
        .filter((p) => !p.archived && p.category === "agent-framework")
        .sort((a, b) => b.stars - a.stars),
  },
];

export function getCollection(slug: string): CollectionDef | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

export function getCollectionProjects(
  slug: string,
  allProjects: Project[],
): Project[] {
  const col = getCollection(slug);
  if (!col) return [];
  return col.filter(allProjects);
}
