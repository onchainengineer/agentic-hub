import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { FindWizard } from "@/components/FindWizard";
import { getAllProjects } from "@/lib/data";

export const metadata = {
  title: "Find your match — Agentic Hub",
  description:
    "Answer 4 questions to find the best agentic AI open source project for your language, time, and skill level.",
};

export default function FindPage() {
  const projects = getAllProjects();

  return (
    <div className="min-h-screen bg-brand-neutral-100">
      <Nav />

      <section className="pt-32 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Find your match</h1>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Answer 4 quick questions. We&apos;ll rank every tracked project against your answers
              and show your top matches with explanations.
            </p>
          </div>

          <FindWizard projects={projects} />
        </div>
      </section>

      <Footer />
    </div>
  );
}
