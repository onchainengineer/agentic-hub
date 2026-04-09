import Link from "next/link";
import { Github, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200/60 bg-white py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-bold mb-3">
              <div className="w-7 h-7 rounded-lg bg-brand-accent-600 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              Agentic Hub
            </div>
            <p className="text-sm text-gray-500 max-w-md">
              Your launchpad into the agentic AI open source ecosystem. AI-curated projects, beginner scores, and live status. Updated weekly.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Explore</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/projects">All Projects</Link></li>
              <li><Link href="/categories">Categories</Link></li>
              <li><Link href="/guide">Contribution Guide</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="https://goodfirstissue.dev" target="_blank" rel="noreferrer">Good First Issue</a></li>
              <li><a href="https://up-for-grabs.net" target="_blank" rel="noreferrer">Up For Grabs</a></li>
              <li><a href="https://github.com/topics/ai-agents" target="_blank" rel="noreferrer">GitHub: ai-agents</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            MIT License. Built with Next.js on Cloudflare Pages. Data refreshed weekly via GitHub Actions + AI enrichment.
          </p>
          <a
            href="https://github.com/onchainengineer/agentic-hub"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900"
          >
            <Github className="w-4 h-4" /> Source
          </a>
        </div>
      </div>
    </footer>
  );
}
