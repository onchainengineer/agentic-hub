import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProjectsExplorer } from "@/components/ProjectsExplorer";
import { getAllProjects, getStats } from "@/lib/data";

export const metadata = {
  title: "All Projects — Agentic Hub",
  description: "Browse, filter, and search agentic AI open source projects curated for beginner contributors.",
};

export default function ProjectsPage() {
  const projects = getAllProjects();
  const stats = getStats();

  return (
    <div className="min-h-screen bg-brand-neutral-100">
      <Nav />

      <section className="pt-32 pb-10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">All Projects</h1>
            <p className="text-gray-500 text-lg">
              {stats.totalProjects} agentic AI projects, updated weekly. Use filters to find your next contribution.
            </p>
          </div>

          <ProjectsExplorer projects={projects} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
