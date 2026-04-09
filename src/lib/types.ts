export type Category =
  | "agent-framework"
  | "visual-builder"
  | "coding-agent"
  | "memory-rag"
  | "llm-tooling"
  | "mcp"
  | "evals-observability"
  | "protocols";

export const CATEGORY_META: Record<
  Category,
  { label: string; description: string; color: string }
> = {
  "agent-framework": {
    label: "Agent Frameworks",
    description: "Libraries for building LLM-powered agents",
    color: "brand-accent",
  },
  "visual-builder": {
    label: "Visual Builders",
    description: "Drag-and-drop no-code agent builders",
    color: "purple",
  },
  "coding-agent": {
    label: "Coding Agents",
    description: "AI assistants that write and edit code",
    color: "blue",
  },
  "memory-rag": {
    label: "Memory & RAG",
    description: "Memory systems, vector DBs, retrieval",
    color: "emerald",
  },
  "llm-tooling": {
    label: "LLM Tooling",
    description: "Inference engines, APIs, runtime tools",
    color: "amber",
  },
  mcp: {
    label: "MCP",
    description: "Model Context Protocol implementations",
    color: "rose",
  },
  "evals-observability": {
    label: "Evals & Observability",
    description: "Testing, tracing, and monitoring LLM apps",
    color: "indigo",
  },
  protocols: {
    label: "Protocols",
    description: "Agent standards and interoperability",
    color: "teal",
  },
};

export type Difficulty = "easy" | "medium" | "hard";

export type Project = {
  repo: string;
  slug: string;
  name: string;
  description: string;
  category: Category;
  language: string;
  stars: number;
  forks: number;
  openIssues: number;
  goodFirstIssues: number;
  helpWanted: number;
  docIssues: number;
  pushedAt: string;
  archived: boolean;
  url: string;
  homepage?: string;
  license?: string;
  // AI-generated fields
  aiDescription?: string;
  whyContribute?: string;
  firstSteps?: string[];
  beginnerScore?: number; // 1-10
  beginnerReasoning?: string;
  difficulty?: Difficulty;
  topics?: string[];
  trending?: boolean;
  featured?: boolean;
};

export type ProjectsData = {
  generatedAt: string;
  totalProjects: number;
  projects: Project[];
};
