import projectsData from "../../data/projects.json";
import type { Project, ProjectsData } from "./types";
import { daysSince } from "./utils";

const data = projectsData as ProjectsData;

export function getAllProjects(): Project[] {
  return data.projects;
}

export function getProject(slug: string): Project | undefined {
  return data.projects.find((p) => p.slug === slug);
}

export function getProjectsByCategory(category: string): Project[] {
  return data.projects.filter((p) => p.category === category);
}

export function getFeaturedProjects(limit = 6): Project[] {
  const featured = data.projects.filter((p) => p.featured);
  if (featured.length >= limit) return featured.slice(0, limit);

  const scored = [...data.projects]
    .filter((p) => !p.archived)
    .map((p) => ({
      project: p,
      score:
        Math.log10(Math.max(p.stars, 1)) * 8 +
        (p.goodFirstIssues || 0) * 8 +
        (p.helpWanted || 0) * 3 +
        (p.beginnerScore || 0) * 4 -
        daysSince(p.pushedAt) * 0.5,
    }))
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.project);
}

export function getTopBeginnerProjects(limit = 6): Project[] {
  return [...data.projects]
    .filter((p) => !p.archived && (p.goodFirstIssues ?? 0) > 0)
    .sort(
      (a, b) =>
        (b.goodFirstIssues ?? 0) - (a.goodFirstIssues ?? 0) ||
        (b.beginnerScore ?? 0) - (a.beginnerScore ?? 0),
    )
    .slice(0, limit);
}

export function getActiveProjects(limit = 6): Project[] {
  return [...data.projects]
    .filter((p) => !p.archived && daysSince(p.pushedAt) < 7)
    .sort((a, b) => b.pushedAt.localeCompare(a.pushedAt))
    .slice(0, limit);
}

export function getNewThisMonth(limit = 6): Project[] {
  // Projects marked as trending (added by discovery script)
  return [...data.projects]
    .filter((p) => p.trending && !p.archived)
    .slice(0, limit);
}

export function getStats() {
  const projects = data.projects.filter((p) => !p.archived);
  const totalGfi = projects.reduce((sum, p) => sum + (p.goodFirstIssues || 0), 0);
  const totalHelpWanted = projects.reduce((sum, p) => sum + (p.helpWanted || 0), 0);
  const totalDocs = projects.reduce((sum, p) => sum + (p.docIssues || 0), 0);
  const languages = new Set(projects.map((p) => p.language));
  const categories = new Set(projects.map((p) => p.category));
  const activeThisWeek = projects.filter((p) => daysSince(p.pushedAt) < 7).length;

  return {
    totalProjects: projects.length,
    openBeginnerIssues: totalGfi + totalHelpWanted,
    goodFirstIssues: totalGfi,
    helpWanted: totalHelpWanted,
    docIssues: totalDocs,
    languageCount: languages.size,
    categoryCount: categories.size,
    activeThisWeek,
    generatedAt: data.generatedAt,
  };
}
