import projectsData from "../../data/projects.json";
import type { Project, ProjectsData } from "./types";

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
  // Featured = marked as such OR high stars + recent activity + has good first issues
  const featured = data.projects.filter((p) => p.featured);
  if (featured.length >= limit) return featured.slice(0, limit);

  const scored = [...data.projects]
    .filter((p) => !p.archived)
    .map((p) => ({
      project: p,
      score:
        Math.log10(Math.max(p.stars, 1)) * 10 +
        (p.goodFirstIssues || 0) * 5 +
        (p.helpWanted || 0) * 2 -
        daysSince(p.pushedAt) * 0.5,
    }))
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.project);
}

export function getTrendingProjects(limit = 6): Project[] {
  return [...data.projects]
    .filter((p) => !p.archived)
    .sort((a, b) => b.stars - a.stars)
    .slice(0, limit);
}

export function getStats() {
  const projects = data.projects;
  const totalStars = projects.reduce((sum, p) => sum + p.stars, 0);
  const totalGfi = projects.reduce((sum, p) => sum + (p.goodFirstIssues || 0), 0);
  const totalHelpWanted = projects.reduce((sum, p) => sum + (p.helpWanted || 0), 0);
  const languages = new Set(projects.map((p) => p.language));
  const categories = new Set(projects.map((p) => p.category));
  return {
    totalProjects: projects.length,
    totalStars,
    totalGfi,
    totalHelpWanted,
    languageCount: languages.size,
    categoryCount: categories.size,
    generatedAt: data.generatedAt,
  };
}

function daysSince(iso: string): number {
  if (!iso) return 9999;
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return 9999;
  return (Date.now() - dt.getTime()) / 86_400_000;
}
