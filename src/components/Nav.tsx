"use client";

import Link from "next/link";
import { Github, Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed w-full top-0 z-50 bg-brand-neutral-100/80 backdrop-blur-md border-b border-gray-200/60">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <div className="w-8 h-8 rounded-lg bg-brand-accent-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-900">Agentic Hub</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/projects" className="text-sm text-gray-700 hover:text-brand-accent-600 transition-colors">
              Projects
            </Link>
            <Link href="/categories" className="text-sm text-gray-700 hover:text-brand-accent-600 transition-colors">
              Categories
            </Link>
            <Link href="/guide" className="text-sm text-gray-700 hover:text-brand-accent-600 transition-colors">
              Guide
            </Link>
            <a
              href="https://github.com/onchainengineer/agentic-hub"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-800 transition-colors"
            >
              <Github className="w-4 h-4" /> Star
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
          <nav className="md:hidden pb-4 flex flex-col gap-3 border-t border-gray-200/60 pt-4">
            <Link href="/projects" className="text-sm text-gray-700">Projects</Link>
            <Link href="/categories" className="text-sm text-gray-700">Categories</Link>
            <Link href="/guide" className="text-sm text-gray-700">Guide</Link>
            <a href="https://github.com/onchainengineer/agentic-hub" className="text-sm text-gray-700 flex items-center gap-2">
              <Github className="w-4 h-4" /> GitHub
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
