import Link from "next/link";
import { ArrowRight, CheckCircle2, Target, GitBranch, MessageSquare, Bot, ShieldAlert, AlertCircle } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Contribution Guide — Agentic Hub",
  description: "How to find, evaluate, and contribute to agentic AI open source projects as a beginner.",
};

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-brand-neutral-100">
      <Nav />

      <section className="pt-32 pb-16">
        <div className="container mx-auto px-6 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contribution Guide</h1>
          <p className="text-gray-500 text-lg mb-12">
            How to find the right project, evaluate it, and make your first contribution to the agentic AI ecosystem.
          </p>

          <div className="space-y-12">
            <Section
              icon={<Target className="w-6 h-6" />}
              number="01"
              title="Pick a project that matches you"
            >
              <p>
                The best project to contribute to is one you actually use. If you have built something with LangChain, you already understand its API and its pain points. Start there.
              </p>
              <p>Ask yourself:</p>
              <ul>
                <li>What AI libraries do I import in my side projects?</li>
                <li>What tools have I wished worked differently?</li>
                <li>What bugs have I worked around instead of reporting?</li>
              </ul>
              <p>Your frustrations are contribution opportunities. <Link href="/projects/">Browse all projects</Link>.</p>
            </Section>

            <Section
              icon={<CheckCircle2 className="w-6 h-6" />}
              number="02"
              title="Evaluate in 10 minutes"
            >
              <p>Before you invest hours, spend 10 minutes checking:</p>
              <ul>
                <li><strong>Recent activity:</strong> commit in the last 30 days, preferably the last 7</li>
                <li><strong>PR responsiveness:</strong> how long between open and first review?</li>
                <li><strong>CONTRIBUTING.md quality:</strong> clear setup? clear PR workflow?</li>
                <li><strong>Good first issues:</strong> are there any, and are they recent?</li>
                <li><strong>Test suite:</strong> does it run cleanly on main?</li>
                <li><strong>Community tone:</strong> read the last 10 closed PRs to see how maintainers treat contributors</li>
              </ul>
              <p>
                <strong>Red flags:</strong> last commit 6+ months ago, no CONTRIBUTING.md, maintainer being curt in PR reviews, CI broken on main.
              </p>
            </Section>

            <Section
              icon={<GitBranch className="w-6 h-6" />}
              number="03"
              title="The contribution workflow"
            >
              <ol className="space-y-2">
                <li><strong>Claim the issue.</strong> Comment: "I would like to work on this. Could you assign it to me?"</li>
                <li><strong>Fork</strong> the repo on GitHub.</li>
                <li><strong>Clone</strong> your fork and <strong>add upstream</strong> as a remote.</li>
                <li><strong>Create a branch:</strong> <code>git checkout -b fix-typo-in-readme</code></li>
                <li><strong>Make your changes</strong> following the project's conventions.</li>
                <li><strong>Run tests and linter.</strong> Fix anything broken.</li>
                <li><strong>Commit with a clear message:</strong> <code>git commit -m "fix: correct typo in installation docs"</code></li>
                <li><strong>Push to your fork</strong> and <strong>open a PR</strong> with a clear description.</li>
                <li><strong>Respond to review feedback</strong> politely and push new commits to the same branch.</li>
              </ol>
            </Section>

            <Section
              icon={<Bot className="w-6 h-6" />}
              number="04"
              title="AI projects have unique challenges"
            >
              <ul>
                <li>
                  <strong>API keys and costs.</strong> Many projects need an LLM API key to run tests. Check CONTRIBUTING.md for free/mock alternatives. Never commit keys.
                </li>
                <li>
                  <strong>Non-deterministic tests.</strong> LLM output varies. Test structure, not exact content. Use LLM-as-judge for quality.
                </li>
                <li>
                  <strong>Evals matter.</strong> If your PR changes LLM behavior, run the eval suite before and after. Report both results.
                </li>
                <li>
                  <strong>Model version drift.</strong> The same model name can change output across versions. Pin model versions in tests.
                </li>
                <li>
                  <strong>Heavy dependencies.</strong> Use virtual environments. Try <code>uv</code> or <code>pixi</code> for faster installs.
                </li>
              </ul>
            </Section>

            <Section
              icon={<MessageSquare className="w-6 h-6" />}
              number="05"
              title="Write great PRs"
            >
              <p>A good PR title describes what changed, not how. Types: <code>feat</code>, <code>fix</code>, <code>docs</code>, <code>refactor</code>, <code>test</code>, <code>chore</code>.</p>
              <p>A good PR description answers:</p>
              <ol>
                <li><strong>What</strong> did you change?</li>
                <li><strong>Why</strong> did you change it?</li>
                <li><strong>How</strong> can a reviewer test it?</li>
              </ol>
              <p>
                Use <code>Closes #123</code> to auto-close the related issue when merged. Keep PRs small — one logical change per PR.
              </p>
            </Section>

            <Section
              icon={<AlertCircle className="w-6 h-6" />}
              number="06"
              title="Common mistakes"
            >
              <ul>
                <li><strong>Giant PRs.</strong> Keep them small and focused.</li>
                <li><strong>No PR description.</strong> Reviewers need context.</li>
                <li><strong>Ignoring CONTRIBUTING.md.</strong> Every project has its own rules.</li>
                <li><strong>Not running tests locally.</strong> Why make CI catch failures?</li>
                <li><strong>Getting discouraged by review feedback.</strong> It is normal and expected. Not personal.</li>
                <li><strong>Working on main.</strong> Always use a feature branch.</li>
              </ul>
            </Section>

            <Section
              icon={<ShieldAlert className="w-6 h-6" />}
              number="07"
              title="Start small, build trust"
            >
              <p>Your contribution journey should look like:</p>
              <ol>
                <li><strong>First:</strong> typo or small docs fix</li>
                <li><strong>Second:</strong> missing test or small bug</li>
                <li><strong>Third:</strong> small feature or medium bug</li>
                <li><strong>Fourth+:</strong> anything you want</li>
              </ol>
              <p>Each successful contribution builds maintainer trust. Over time, you get assigned harder work and more responsibility.</p>
            </Section>
          </div>

          <div className="mt-16 bg-white border border-gray-200/60 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">Ready to start?</h2>
            <p className="text-gray-500 mb-6">Pick your first project and dive in.</p>
            <Link
              href="/projects/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-accent-600 text-white font-medium hover:bg-brand-accent-700 transition-colors"
            >
              Browse projects <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Section({
  icon,
  number,
  title,
  children,
}: {
  icon: React.ReactNode;
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-brand-accent-50 text-brand-accent-600 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <div className="text-xs font-semibold text-gray-400 tracking-wide">STEP {number}</div>
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
      </div>
      <div className="prose prose-sm max-w-none prose-a:text-brand-accent-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-[''] prose-code:text-gray-900 prose-strong:text-gray-900">
        {children}
      </div>
    </div>
  );
}
