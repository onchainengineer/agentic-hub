"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Menu, X, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/find/", label: "Find", icon: Wand2 },
  { href: "/projects/", label: "Browse" },
  { href: "/collections/", label: "Collections" },
  { href: "/guide/", label: "Guide" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed w-full top-0 z-50 bg-brand-neutral-100/80 backdrop-blur-md border-b border-gray-200/60">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-accent-500 to-brand-accent-700 flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-900">Agentic Hub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {LINKS.map((link) => {
              const Icon = link.icon;
              const active = pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1.5",
                    active
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100",
                  )}
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  {link.label}
                </Link>
              );
            })}
            <a
              href="https://github.com/onchainengineer/agentic-hub"
              target="_blank"
              rel="noreferrer"
              className="ml-2 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 text-sm hover:bg-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {open && (
          <nav className="md:hidden pb-4 flex flex-col gap-1 border-t border-gray-200/60 pt-3">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-700 px-3 py-2 rounded-lg hover:bg-white"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="https://github.com/onchainengineer/agentic-hub"
              className="text-sm text-gray-700 px-3 py-2 rounded-lg hover:bg-white flex items-center gap-2"
            >
              <Github className="w-4 h-4" /> GitHub
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
