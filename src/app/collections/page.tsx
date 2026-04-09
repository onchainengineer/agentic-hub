import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CollectionCard } from "@/components/CollectionCard";
import { COLLECTIONS } from "@/lib/collections";
import { getAllProjects } from "@/lib/data";

export const metadata = {
  title: "Collections — Agentic Hub",
  description:
    "Curated groupings of agentic AI projects for contributors. Perfect first PR, active this week, build an MCP server, and more.",
};

export default function CollectionsPage() {
  const allProjects = getAllProjects();

  return (
    <div className="min-h-screen bg-brand-neutral-100">
      <Nav />

      <section className="pt-32 pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Collections</h1>
            <p className="text-gray-500 text-lg max-w-2xl">
              Curated groupings that help you find the right project fast. Each collection has a
              specific angle and is updated automatically as project data changes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {COLLECTIONS.map((c) => (
              <CollectionCard
                key={c.slug}
                collection={c}
                projects={c.filter(allProjects)}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
