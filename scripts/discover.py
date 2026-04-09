#!/usr/bin/env python3
"""
Weekly discovery pass. Uses Claude to scan GitHub trending + search API for new
agentic AI projects worth adding to the curated list.

Approach:
1. Query GitHub search API for trending projects tagged with relevant topics
   (ai-agents, llm, langchain, mcp, rag, agent)
2. Filter out projects already in data/projects.json
3. For each candidate, fetch repo metadata + README
4. Ask Claude to categorize, score, and decide if it should be added
5. If yes, add to data/projects.json with all fields populated

Usage:
    export GITHUB_TOKEN=ghp_...
    export ANTHROPIC_API_KEY=sk-ant-...
    python scripts/discover.py [--limit N] [--dry-run]
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
MODEL = "claude-sonnet-4-6"

SEARCH_QUERIES = [
    "topic:ai-agents stars:>500 pushed:>2026-01-01",
    "topic:llm-agent stars:>500 pushed:>2026-01-01",
    "topic:mcp stars:>200 pushed:>2026-01-01",
    "topic:agent-framework stars:>300 pushed:>2026-01-01",
    "topic:autonomous-agents stars:>500 pushed:>2026-01-01",
    "topic:langchain stars:>500 pushed:>2026-01-01",
    "topic:llm stars:>1000 pushed:>2026-01-01",
]


def gh(path: str, token: str, params: dict | None = None) -> dict | None:
    url = f"https://api.github.com{path}"
    if params:
        url += "?" + parse.urlencode(params)
    req = request.Request(
        url,
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


def search_candidates(token: str) -> list[dict]:
    seen = set()
    candidates = []
    for q in SEARCH_QUERIES:
        print(f"Searching: {q}", file=sys.stderr)
        r = gh("/search/repositories", token, {"q": q, "sort": "stars", "per_page": 30})
        if not r:
            continue
        for item in r.get("items", []):
            full_name = item.get("full_name")
            if not full_name or full_name in seen:
                continue
            seen.add(full_name)
            candidates.append(item)
        time.sleep(2)  # Respect search API limits
    return candidates


def fetch_readme(repo: str, token: str) -> str:
    r = gh(f"/repos/{repo}/readme", token)
    if not r or "content" not in r:
        return ""
    try:
        return base64.b64decode(r["content"]).decode("utf-8", errors="replace")[:6000]
    except Exception:
        return ""


def claude_evaluate(repo_info: dict, readme: str, api_key: str) -> dict | None:
    """Ask Claude if this project should be added and generate all enriched fields."""
    prompt = f"""You are curating a "best agentic AI open source projects" list. Evaluate whether this repo should be added.

Repo: {repo_info['full_name']}
Language: {repo_info.get('language', 'unknown')}
Stars: {repo_info.get('stargazers_count', 0)}
Description: {repo_info.get('description', '')}
Topics: {', '.join(repo_info.get('topics', [])[:8])}
Archived: {repo_info.get('archived', False)}
Last pushed: {repo_info.get('pushed_at', '')}

README (first 6KB):
---
{readme or '(no README)'}
---

Criteria for inclusion:
- Must be genuinely agentic AI / LLM tooling (not just "uses AI")
- Must have CONTRIBUTING.md or clear contribution process
- Must be actively maintained (commit within 3 months)
- Must welcome beginner contributors
- Must NOT be a tutorial, example repo, one-off demo, or awesome list

Categories (pick ONE):
- agent-framework (LangChain-like libraries)
- visual-builder (drag-drop builders like Langflow, Flowise)
- coding-agent (coding assistants like Cline, Aider)
- memory-rag (vector DBs, memory, RAG frameworks)
- llm-tooling (inference engines, unified APIs, runtime tools)
- mcp (Model Context Protocol projects)
- evals-observability (testing, tracing, monitoring)
- protocols (standards, interop)

Respond with JSON only:
{{
  "include": true|false,
  "reason": "one sentence explaining the decision",
  "category": "<one of the categories above>",
  "aiDescription": "one clear sentence, max 180 chars",
  "whyContribute": "2-3 sentences",
  "firstSteps": ["step 1", "step 2", "step 3"],
  "beginnerScore": 1-10,
  "beginnerReasoning": "one sentence",
  "difficulty": "easy|medium|hard"
}}

If include is false, only "include" and "reason" are required. Output ONLY JSON, no markdown."""

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
        if text.startswith("```"):
            text = text.split("```", 2)[1]
            if text.startswith("json"):
                text = text[4:]
            text = text.strip("` \n")
        return json.loads(text)
    except Exception as e:
        print(f"  Claude error: {e}", file=sys.stderr)
        return None


def slugify(repo: str) -> str:
    return repo.replace("/", "--").lower()


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--limit", type=int, default=20, help="Max new projects to add")
    parser.add_argument("--dry-run", action="store_true", help="Don't write the file")
    args = parser.parse_args()

    gh_token = os.environ.get("GITHUB_TOKEN")
    anthropic_key = os.environ.get("ANTHROPIC_API_KEY")
    if not gh_token or not anthropic_key:
        print("ERROR: Need GITHUB_TOKEN and ANTHROPIC_API_KEY", file=sys.stderr)
        sys.exit(1)

    data = json.loads(DATA_FILE.read_text())
    existing = {p["repo"] for p in data["projects"]}

    print("Searching GitHub for candidates...", file=sys.stderr)
    candidates = search_candidates(gh_token)
    new_candidates = [c for c in candidates if c["full_name"] not in existing]
    print(f"Found {len(candidates)} candidates, {len(new_candidates)} new", file=sys.stderr)

    added = 0
    for i, repo_info in enumerate(new_candidates):
        if added >= args.limit:
            break
        repo = repo_info["full_name"]
        print(f"[{i+1}] Evaluating {repo}", file=sys.stderr)

        if repo_info.get("archived"):
            print(f"  SKIP: archived", file=sys.stderr)
            continue

        readme = fetch_readme(repo, gh_token)
        result = claude_evaluate(repo_info, readme, anthropic_key)
        if not result:
            continue

        if not result.get("include"):
            print(f"  REJECTED: {result.get('reason', '')}", file=sys.stderr)
            continue

        print(f"  ACCEPTED: {result.get('category')} (score {result.get('beginnerScore')})", file=sys.stderr)

        project = {
            "repo": repo,
            "slug": slugify(repo),
            "name": repo_info["name"],
            "description": repo_info.get("description") or "",
            "category": result["category"],
            "language": repo_info.get("language", "unknown"),
            "stars": repo_info.get("stargazers_count", 0),
            "forks": repo_info.get("forks_count", 0),
            "openIssues": repo_info.get("open_issues_count", 0),
            "goodFirstIssues": 0,  # refresh-stats will populate
            "helpWanted": 0,
            "docIssues": 0,
            "pushedAt": repo_info.get("pushed_at", ""),
            "archived": False,
            "url": repo_info.get("html_url", f"https://github.com/{repo}"),
            "homepage": repo_info.get("homepage") or None,
            "license": (repo_info.get("license") or {}).get("spdx_id") if repo_info.get("license") else None,
            "topics": repo_info.get("topics", [])[:8],
            "aiDescription": result.get("aiDescription"),
            "whyContribute": result.get("whyContribute"),
            "firstSteps": result.get("firstSteps", []),
            "beginnerScore": result.get("beginnerScore"),
            "beginnerReasoning": result.get("beginnerReasoning"),
            "difficulty": result.get("difficulty"),
            "trending": True,
        }
        data["projects"].append(project)
        added += 1
        time.sleep(1)

    data["projects"].sort(key=lambda p: p["stars"], reverse=True)
    data["generatedAt"] = datetime.now(timezone.utc).isoformat()
    data["totalProjects"] = len(data["projects"])

    if args.dry_run:
        print(f"DRY RUN: would add {added} projects", file=sys.stderr)
    else:
        DATA_FILE.write_text(json.dumps(data, indent=2) + "\n")
        print(f"Added {added} new projects to {DATA_FILE}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
