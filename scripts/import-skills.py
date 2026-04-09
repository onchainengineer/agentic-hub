#!/usr/bin/env python3
"""
Import skills from the latticeEcosystem/skills monorepo into agentic-hub.

Source:
  ~/workspace/sourcecode/latticeEcosystem/skills/<category>/*.md

Each markdown file has frontmatter like:
    ---
    name: Accessibility Auditor
    description: ...
    color: "#0077B6"
    emoji: ♿
    vibe: ...
    ---
    # Body...

Outputs:
  data/skills.json           - index + metadata for every skill
  data/skills/<slug>.md      - raw skill body for detail pages
"""

from __future__ import annotations

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
SKILLS_OUT = DATA_DIR / "skills"
SKILLS_OUT.mkdir(parents=True, exist_ok=True)

SKILLS_SRC = Path.home() / "workspace/sourcecode/latticeEcosystem/skills"

# Categories to include and their display labels
CATEGORIES: dict[str, str] = {
    "academic": "Academic",
    "design": "Design",
    "engineering": "Engineering",
    "game-development": "Game Development",
    "marketing": "Marketing",
    "paid-media": "Paid Media",
    "product": "Product",
    "project-management": "Project Management",
    "sales": "Sales",
    "spatial-computing": "Spatial Computing",
    "specialized": "Specialized",
    "strategy": "Strategy",
    "support": "Support",
    "testing": "Testing",
}

# Skip these folders (not individual skills)
SKIP_DIRS = {"examples", "integrations", "scripts"}


def slugify(name: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return s or "skill"


def parse_frontmatter(text: str) -> tuple[dict, str]:
    """Parse simple YAML frontmatter into a dict."""
    if not text.startswith("---"):
        return {}, text
    end = text.find("\n---", 3)
    if end == -1:
        return {}, text
    raw = text[3:end].strip()
    body = text[end + 4 :].lstrip("\n")

    meta: dict = {}
    for line in raw.split("\n"):
        line = line.rstrip()
        if not line.strip():
            continue
        m = re.match(r"^([A-Za-z][\w-]*):\s*(.*)$", line)
        if not m:
            continue
        key = m.group(1)
        value = m.group(2).strip()
        # Strip matching quotes
        if (value.startswith('"') and value.endswith('"')) or (
            value.startswith("'") and value.endswith("'")
        ):
            value = value[1:-1]
        meta[key] = value
    return meta, body


def extract_first_heading(body: str) -> str:
    for line in body.split("\n"):
        stripped = line.strip()
        if stripped.startswith("#"):
            return stripped.lstrip("#").strip()
    return ""


def count_sections(body: str) -> int:
    return sum(1 for line in body.split("\n") if line.strip().startswith("##"))


def import_skills() -> list[dict]:
    if not SKILLS_SRC.exists():
        print(f"ERROR: {SKILLS_SRC} does not exist", file=sys.stderr)
        sys.exit(1)

    items: list[dict] = []
    for cat_dir in sorted(SKILLS_SRC.iterdir()):
        if not cat_dir.is_dir():
            continue
        cat_slug = cat_dir.name
        if cat_slug in SKIP_DIRS:
            continue
        if cat_slug not in CATEGORIES:
            print(f"  SKIP unknown category: {cat_slug}", file=sys.stderr)
            continue

        cat_label = CATEGORIES[cat_slug]
        print(f"Category: {cat_label}", file=sys.stderr)

        for md_file in sorted(cat_dir.glob("*.md")):
            # Skip category-level README/index files
            if md_file.name.lower() in {"readme.md", "index.md", "_index.md"}:
                continue

            text = md_file.read_text(errors="replace")
            meta, body = parse_frontmatter(text)

            name = meta.get("name") or extract_first_heading(body) or md_file.stem
            description = meta.get("description", "").strip()
            color = meta.get("color") or ""
            emoji = meta.get("emoji") or ""
            vibe = meta.get("vibe") or ""

            # Build a clean slug: category-filename
            base_slug = slugify(md_file.stem)
            slug = base_slug

            # Write body file (full text, verbatim, for detail page)
            out_file = SKILLS_OUT / f"{slug}.md"
            out_file.write_text(text)

            items.append(
                {
                    "slug": slug,
                    "name": name,
                    "description": description,
                    "category": cat_slug,
                    "categoryLabel": cat_label,
                    "color": color if color.startswith("#") else None,
                    "emoji": emoji,
                    "vibe": vibe,
                    "bodyFile": f"skills/{slug}.md",
                    "sourceFile": str(md_file.relative_to(SKILLS_SRC)),
                    "bytes": len(text),
                    "lines": len(text.splitlines()),
                    "sections": count_sections(body),
                }
            )
            print(f"  OK  {name}", file=sys.stderr)

    return items


def main() -> int:
    items = import_skills()

    # Sort by category then name
    items.sort(key=lambda x: (x["categoryLabel"], x["name"].lower()))

    by_category: dict[str, int] = {}
    for it in items:
        by_category[it["categoryLabel"]] = by_category.get(it["categoryLabel"], 0) + 1

    index = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "total": len(items),
        "categories": [
            {
                "slug": slug,
                "label": label,
                "count": by_category.get(label, 0),
            }
            for slug, label in CATEGORIES.items()
            if by_category.get(label, 0) > 0
        ],
        "items": items,
    }

    (DATA_DIR / "skills.json").write_text(json.dumps(index, indent=2) + "\n")
    print(
        f"\nImported {len(items)} skills across {len(index['categories'])} categories",
        file=sys.stderr,
    )
    for cat in index["categories"]:
        print(f"  {cat['label']}: {cat['count']}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
