"use client";

import { useState, useMemo } from "react";
import { ArrowRight, ArrowLeft, RotateCcw, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { CATEGORY_META, type Category, type Project } from "@/lib/types";
import { cn, daysSince, formatStars, formatRelative } from "@/lib/utils";

type Answers = {
  languages: string[];
  experience: "first" | "some" | "experienced" | null;
  time: "minutes" | "hours" | "weekend" | null;
  categories: Category[];
};

const LANGUAGES = ["Python", "TypeScript", "JavaScript", "Rust", "Go", "C++", "Any"];

export function FindWizard({ projects }: { projects: Project[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    languages: [],
    experience: null,
    time: null,
    categories: [],
  });

  const canProceed = useMemo(() => {
    if (step === 0) return answers.languages.length > 0;
    if (step === 1) return answers.experience !== null;
    if (step === 2) return answers.time !== null;
    if (step === 3) return answers.categories.length > 0;
    return true;
  }, [step, answers]);

  const matches = useMemo(() => {
    if (step < 4) return [];
    return rankProjects(projects, answers).slice(0, 10);
  }, [step, projects, answers]);

  return (
    <div className="bg-white border border-gray-200/60 rounded-2xl shadow-sm">
      {/* Progress bar */}
      {step < 4 && (
        <div className="px-6 md:px-8 pt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">
              Question {step + 1} of 4
            </div>
            <div className="text-xs text-gray-500">{Math.round(((step + 1) / 4) * 100)}%</div>
          </div>
          <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-accent-600 transition-all duration-300"
              style={{ width: `${((step + 1) / 4) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="p-6 md:p-10">
        {step === 0 && (
          <QuestionStep
            title="What languages interest you?"
            description="Pick as many as you want. We'll prioritize projects in these languages."
          >
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => {
                const selected = answers.languages.includes(lang);
                return (
                  <button
                    key={lang}
                    onClick={() => {
                      if (lang === "Any") {
                        setAnswers({ ...answers, languages: ["Any"] });
                      } else {
                        const current = answers.languages.filter((l) => l !== "Any");
                        setAnswers({
                          ...answers,
                          languages: selected
                            ? current.filter((l) => l !== lang)
                            : [...current, lang],
                        });
                      }
                    }}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium border transition-colors",
                      selected
                        ? "bg-gray-900 text-white border-gray-900"
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-300",
                    )}
                  >
                    {lang}
                  </button>
                );
              })}
            </div>
          </QuestionStep>
        )}

        {step === 1 && (
          <QuestionStep
            title="How experienced are you with open source?"
            description="This helps us match you to projects with the right difficulty."
          >
            <div className="grid gap-3">
              {[
                {
                  key: "first" as const,
                  title: "This is my first PR ever",
                  desc: "Start with the highest beginner scores and friendliest communities.",
                },
                {
                  key: "some" as const,
                  title: "I have a few PRs under my belt",
                  desc: "Ready for medium-difficulty projects with clear scoping.",
                },
                {
                  key: "experienced" as const,
                  title: "I contribute regularly",
                  desc: "Point me at high-impact projects and complex work.",
                },
              ].map((opt) => {
                const selected = answers.experience === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => setAnswers({ ...answers, experience: opt.key })}
                    className={cn(
                      "text-left p-4 rounded-xl border transition-colors",
                      selected
                        ? "bg-brand-accent-50 border-brand-accent-400"
                        : "bg-white border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center",
                          selected ? "border-brand-accent-600 bg-brand-accent-600" : "border-gray-300",
                        )}
                      >
                        {selected && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{opt.title}</div>
                        <div className="text-sm text-gray-500 mt-0.5">{opt.desc}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </QuestionStep>
        )}

        {step === 2 && (
          <QuestionStep
            title="How much time do you want to invest?"
            description="We'll match the scope of typical issues to your available time."
          >
            <div className="grid gap-3">
              {[
                {
                  key: "minutes" as const,
                  title: "A few minutes",
                  desc: "Typos, broken links, small doc fixes.",
                },
                {
                  key: "hours" as const,
                  title: "An hour or two",
                  desc: "Small features, bug fixes, new tests.",
                },
                {
                  key: "weekend" as const,
                  title: "A weekend or more",
                  desc: "Meaningful features, new integrations, deeper work.",
                },
              ].map((opt) => {
                const selected = answers.time === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => setAnswers({ ...answers, time: opt.key })}
                    className={cn(
                      "text-left p-4 rounded-xl border transition-colors",
                      selected
                        ? "bg-brand-accent-50 border-brand-accent-400"
                        : "bg-white border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center",
                          selected ? "border-brand-accent-600 bg-brand-accent-600" : "border-gray-300",
                        )}
                      >
                        {selected && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{opt.title}</div>
                        <div className="text-sm text-gray-500 mt-0.5">{opt.desc}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </QuestionStep>
        )}

        {step === 3 && (
          <QuestionStep
            title="What areas interest you?"
            description="Pick as many as you want. Your answers shape the ranking."
          >
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(CATEGORY_META) as Category[]).map((c) => {
                const selected = answers.categories.includes(c);
                const meta = CATEGORY_META[c];
                return (
                  <button
                    key={c}
                    onClick={() =>
                      setAnswers({
                        ...answers,
                        categories: selected
                          ? answers.categories.filter((cc) => cc !== c)
                          : [...answers.categories, c],
                      })
                    }
                    className={cn(
                      "text-left p-3 rounded-lg border transition-colors",
                      selected
                        ? "bg-brand-accent-50 border-brand-accent-400"
                        : "bg-white border-gray-200 hover:border-gray-300",
                    )}
                  >
                    <div className="text-sm font-semibold text-gray-900">{meta.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{meta.description}</div>
                  </button>
                );
              })}
            </div>
          </QuestionStep>
        )}

        {step === 4 && <Results matches={matches} answers={answers} />}

        {/* Navigation */}
        {step < 4 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className={cn(
                "inline-flex items-center gap-1 text-sm",
                step === 0 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:text-gray-900",
              )}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed}
              className={cn(
                "inline-flex items-center gap-1 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors",
                canProceed
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed",
              )}
            >
              {step === 3 ? "See matches" : "Next"} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="flex items-center justify-center mt-6 pt-6 border-t border-gray-100">
            <button
              onClick={() => {
                setAnswers({ languages: [], experience: null, time: null, categories: [] });
                setStep(0);
              }}
              className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
            >
              <RotateCcw className="w-4 h-4" /> Start over
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionStep({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-fade">
      <h2 className="text-2xl md:text-3xl font-bold mb-2">{title}</h2>
      <p className="text-gray-500 mb-6">{description}</p>
      {children}
    </div>
  );
}

function Results({ matches, answers }: { matches: ScoredProject[]; answers: Answers }) {
  return (
    <div className="animate-fade">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Your top matches</h2>
        <p className="text-gray-500">
          Ranked by how well each project fits your answers. Click any project for details.
        </p>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No strong matches found. Try relaxing your criteria with &quot;Start over&quot;.
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((m, i) => {
            const p = m.project;
            return (
              <Link
                key={p.repo}
                href={`/projects/${p.slug}/`}
                className="block bg-white border border-gray-200/60 rounded-xl p-5 hover:border-brand-accent-400 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "flex-shrink-0 w-10 h-10 rounded-lg font-bold text-sm flex items-center justify-center",
                      i === 0
                        ? "bg-amber-100 text-amber-700"
                        : i === 1
                        ? "bg-gray-200 text-gray-700"
                        : i === 2
                        ? "bg-orange-100 text-orange-700"
                        : "bg-gray-50 text-gray-500",
                    )}
                  >
                    #{i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-gray-900 truncate">{p.name}</h3>
                      <span className="text-xs text-gray-500 font-mono truncate">{p.repo}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                      {p.aiDescription || p.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="font-mono">{p.language}</span>
                      <span>{formatStars(p.stars)} ★</span>
                      {(p.goodFirstIssues ?? 0) > 0 && (
                        <span className="text-emerald-700 font-medium">
                          {p.goodFirstIssues} good first
                        </span>
                      )}
                      {(p.helpWanted ?? 0) > 0 && (
                        <span className="text-blue-700 font-medium">
                          {p.helpWanted} help wanted
                        </span>
                      )}
                      <span>updated {formatRelative(p.pushedAt)}</span>
                      {typeof p.beginnerScore === "number" && (
                        <span>Beginner: {p.beginnerScore}/10</span>
                      )}
                    </div>
                    <div className="mt-2 text-xs text-brand-accent-700 bg-brand-accent-50 border border-brand-accent-100 rounded-md px-2 py-1 inline-block">
                      Why this match: {m.reasoning}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// --- Scoring ---

type ScoredProject = {
  project: Project;
  score: number;
  reasoning: string;
};

function rankProjects(projects: Project[], answers: Answers): ScoredProject[] {
  const scored: ScoredProject[] = projects
    .filter((p) => !p.archived)
    .map((p) => {
      let score = 0;
      const reasons: string[] = [];

      // Language match
      if (answers.languages.includes("Any")) {
        score += 10;
      } else if (answers.languages.includes(p.language)) {
        score += 30;
        reasons.push(`${p.language} match`);
      } else {
        score -= 10;
      }

      // Category match
      if (answers.categories.length === 0 || answers.categories.includes(p.category)) {
        score += 20;
        if (answers.categories.includes(p.category)) {
          reasons.push(CATEGORY_META[p.category].label.toLowerCase());
        }
      }

      // Experience match
      const bscore = p.beginnerScore ?? 5;
      if (answers.experience === "first") {
        if (bscore >= 7) {
          score += 25;
          reasons.push("beginner-friendly");
        } else if (bscore >= 5) {
          score += 10;
        } else {
          score -= 15;
        }
      } else if (answers.experience === "some") {
        if (bscore >= 5 && bscore <= 8) {
          score += 20;
          reasons.push("intermediate fit");
        } else {
          score += 5;
        }
      } else if (answers.experience === "experienced") {
        score += 10;
        if (p.stars > 20000) {
          score += 10;
          reasons.push("high-impact");
        }
      }

      // Time match (approximate via issue counts and difficulty)
      const gfi = p.goodFirstIssues ?? 0;
      const hw = p.helpWanted ?? 0;
      if (answers.time === "minutes") {
        if ((p.docIssues ?? 0) > 0 || gfi > 0) {
          score += 15;
          reasons.push("quick issues available");
        }
      } else if (answers.time === "hours") {
        if (gfi > 0 || hw > 0) {
          score += 20;
          reasons.push(`${gfi + hw} open issues`);
        }
      } else if (answers.time === "weekend") {
        if (p.stars > 5000 && !p.archived) {
          score += 15;
          if (hw > 0) reasons.push("help wanted");
        }
      }

      // Active maintainers bonus
      const days = daysSince(p.pushedAt);
      if (days < 7) {
        score += 10;
        reasons.push("active this week");
      } else if (days < 30) {
        score += 3;
      } else if (days > 90) {
        score -= 15;
      }

      // Has open issues bonus
      if (gfi + hw > 0) {
        score += 5;
      }

      const reasoning = reasons.slice(0, 3).join(" · ") || "general fit";
      return { project: p, score, reasoning };
    });

  return scored.sort((a, b) => b.score - a.score);
}
