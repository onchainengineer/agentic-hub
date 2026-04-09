#!/usr/bin/env python3
"""
AI-powered enrichment pass. For each project in data/projects.json:

1. Fetch the README (first 8KB) from GitHub
2. Ask Claude to generate:
   - aiDescription (one clear sentence)
   - whyContribute (2-3 sentences on why this project is worth contributing to)
   - firstSteps (3-5 concrete first actions)
   - beginnerScore (1-10) + beginnerReasoning
   - difficulty (easy/medium/hard)

Usage:
    export GITHUB_TOKEN=ghp_...
    export ANTHROPIC_API_KEY=sk-ant-...
    python scripts/enrich-ai.py [--only REPO] [--limit N]

Flags:
    --only owner/repo    Enrich only the specified project
    --limit N            Enrich only the first N projects
    --force              Re-enrich projects that already have AI fields
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib import error, parse, request

ROOT = Path(__file__).resolve().parent.parent
DATA_FILE = ROOT / "data" / "projects.json"

ANTHROPIC_API = "https://api.anthropic.com/v1/messages"
MODEL = "claude-sonnet-4-6"  # Fast and capable


def gh(path: str, token: str) -> dict | None:
    req = request.Request(
        f"https://api.github.com{path}",
        headers={
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {token}",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "agentic-hub",
        },
    )
    try:
        with request.urlopen(req, timeout=30) as r:
            return json.loads(r.read())
    except Exception as e:
        print(f"  GH error: {e}", file=sys.stderr)
        return None


def fetch_readme(repo: str, token: str) -> str:
    r = gh(f"/repos/{repo}/readme", token)
    if not r or "content" not in r:
        return ""
    try:
        content = base64.b64decode(r["content"]).decode("utf-8", errors="replace")
        return content[:8000]
    except Exception:
        return ""


def claude_enrich(project: dict, readme: str, api_key: str) -> dict | None:
    prompt = f"""You are analyzing an open source agentic AI project for a "find your next contribution" website.

Project: {project['repo']}
Language: {project['language']}
Category: {project['category']}
Stars: {project['stars']}
GitHub description: {project.get('description', '')}

README (first 8KB):
---
{readme or '(no README available)'}
---

Generate a JSON object with these exact fields:

1. "aiDescription": ONE clear sentence (max 180 chars) explaining what the project actually does. Avoid marketing fluff. Be specific about the technical purpose.

2. "whyContribute": 2-3 sentences on why a new contributor should consider this project. Mention concrete hooks (e.g., "small core, clear modules", "very active maintainers", "many integration opportunities"). Be honest — don't oversell.

3. "firstSteps": Array of 3-5 concrete first actions a contributor should take. Each step should be specific and actionable (e.g., "Read CONTRIBUTING.md in the repo root", "Run the test suite with pytest", "Browse the 'integrations' directory to see how new providers are added"). Avoid generic advice.

4. "beginnerScore": Integer 1-10 for how beginner-friendly the project is. Consider: clear CONTRIBUTING.md, test setup ease, issue label usage, maintainer responsiveness signals, codebase size. 10 = ideal first contribution. 1 = avoid as first contribution.

5. "beginnerReasoning": One sentence explaining the score.

6. "difficulty": "easy", "medium", or "hard" — overall contribution difficulty for a beginner.

Output ONLY valid JSON. No markdown code fences. No extra text. Just the JSON object."""

    body = json.dumps({
        "model": MODEL,
        "max_tokens": 1024,
        "messages": [{"role": "user", "content": prompt}],
    }).encode("utf-8")

    req = request.Request(
        ANTHROPIC_API,
        data=body,
        headers={
            "Content-Type": "application/json",
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
        },
    )
    try:
        with request.urlopen(req, timeout=60) as r:
            resp = json.loads(r.read())
        text = resp["content"][0]["text"].strip()
        # Strip code fences if model added them
        if text.startswith("```"):
            text = text.split("```", 2)[1]
            if text.startswith("json"):
                text = text[4:]
            text = text.strip("` \n")
        return json.loads(text)
    except error.HTTPError as e:
        print(f"  Anthropic HTTP {e.code}: {e.read().decode()[:200]}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"  Anthropic error: {e}", file=sys.stderr)
        return None


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--only", help="Enrich only this repo (owner/name)")
    parser.add_argument("--limit", type=int, help="Enrich only N projects")
    parser.add_argument("--force", action="store_true", help="Re-enrich already-enriched projects")
    args = parser.parse_args()

    gh_token = os.environ.get("GITHUB_TOKEN")
    anthropic_key = os.environ.get("ANTHROPIC_API_KEY")
    if not gh_token or not anthropic_key:
        print("ERROR: Need GITHUB_TOKEN and ANTHROPIC_API_KEY", file=sys.stderr)
        sys.exit(1)

    data = json.loads(DATA_FILE.read_text())
    projects = data["projects"]

    targets = projects
    if args.only:
        targets = [p for p in projects if p["repo"] == args.only]
        if not targets:
            print(f"Not found: {args.only}", file=sys.stderr)
            sys.exit(1)
    elif not args.force:
        targets = [p for p in projects if not p.get("aiDescription")]

    if args.limit:
        targets = targets[: args.limit]

    print(f"Enriching {len(targets)} projects...", file=sys.stderr)

    enriched = 0
    for i, p in enumerate(targets, 1):
        print(f"[{i}/{len(targets)}] {p['repo']}", file=sys.stderr)
        readme = fetch_readme(p["repo"], gh_token)
        result = claude_enrich(p, readme, anthropic_key)
        if result:
            p["aiDescription"] = result.get("aiDescription")
            p["whyContribute"] = result.get("whyContribute")
            p["firstSteps"] = result.get("firstSteps", [])
            p["beginnerScore"] = result.get("beginnerScore")
            p["beginnerReasoning"] = result.get("beginnerReasoning")
            p["difficulty"] = result.get("difficulty")
            enriched += 1
            print(f"  OK (score: {p.get('beginnerScore')})", file=sys.stderr)
        time.sleep(0.5)

    data["projects"] = projects
    data["generatedAt"] = datetime.now(timezone.utc).isoformat()
    DATA_FILE.write_text(json.dumps(data, indent=2) + "\n")
    print(f"Enriched {enriched}/{len(targets)}. Wrote {DATA_FILE}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
