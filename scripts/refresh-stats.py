#!/usr/bin/env python3
"""
Refresh GitHub stats (stars, forks, issue counts) for every project in data/projects.json.

Preserves all AI-generated fields (aiDescription, whyContribute, firstSteps, beginnerScore, etc).
Only updates stats fields.

Usage:
    export GITHUB_TOKEN=ghp_...
    python scripts/refresh-stats.py
"""

from __future__ import annotations

import json
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib import error, parse, request

ROOT = Path(__file__).resolve().parent.parent
DATA_FILE = ROOT / "data" / "projects.json"

API = "https://api.github.com"


def get_token() -> str:
    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        print("ERROR: GITHUB_TOKEN not set", file=sys.stderr)
        sys.exit(1)
    return token


def gh(path: str, token: str, params: dict | None = None) -> dict | None:
    url = f"{API}{path}"
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
    except error.HTTPError as e:
        if e.code == 403:
            # Rate limited, sleep and skip
            time.sleep(60)
        print(f"  WARN: HTTP {e.code} for {path}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"  WARN: {e} for {path}", file=sys.stderr)
        return None


def count_label(repo: str, label: str, token: str) -> int:
    q = f'repo:{repo} is:issue is:open label:"{label}"'
    r = gh("/search/issues", token, {"q": q, "per_page": 1})
    return (r or {}).get("total_count", 0) if r else 0


def main() -> int:
    token = get_token()
    data = json.loads(DATA_FILE.read_text())
    projects = data["projects"]
    print(f"Refreshing stats for {len(projects)} projects...", file=sys.stderr)

    for i, p in enumerate(projects, 1):
        repo = p["repo"]
        print(f"[{i}/{len(projects)}] {repo}", file=sys.stderr)
        info = gh(f"/repos/{repo}", token)
        if info:
            p["stars"] = info.get("stargazers_count", p["stars"])
            p["forks"] = info.get("forks_count", p["forks"])
            p["openIssues"] = info.get("open_issues_count", p["openIssues"])
            p["pushedAt"] = info.get("pushed_at", p["pushedAt"])
            p["archived"] = info.get("archived", p["archived"])
            if info.get("description") and not p.get("aiDescription"):
                p["description"] = info["description"]
            if info.get("topics"):
                p["topics"] = info["topics"][:8]
        gfi = count_label(repo, "good first issue", token)
        hw = count_label(repo, "help wanted", token)
        docs = count_label(repo, "documentation", token)
        p["goodFirstIssues"] = gfi
        p["helpWanted"] = hw
        p["docIssues"] = docs
        time.sleep(0.3)  # Gentle rate limiting

    # Re-sort by stars
    projects.sort(key=lambda p: p["stars"], reverse=True)
    data["projects"] = projects
    data["generatedAt"] = datetime.now(timezone.utc).isoformat()
    data["totalProjects"] = len(projects)

    DATA_FILE.write_text(json.dumps(data, indent=2) + "\n")
    print(f"Wrote {DATA_FILE}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
