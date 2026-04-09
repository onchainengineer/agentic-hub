# Agentic Hub

**Your launchpad into the agentic AI open source ecosystem.** An AI-curated, continuously updated website for finding beginner-friendly agentic AI projects to contribute to.

Live site: _deploy to see_ | [Source on GitHub](https://github.com/onchainengineer/agentic-hub)

---

## What It Is

A static Next.js site that surfaces the best agentic AI open source projects for new contributors. Each project is enriched with AI-generated descriptions, beginner scores, and first-step guides.

**Features:**
- Browse 50+ curated projects by language or topic
- Search, filter, and sort
- Project detail pages with AI-generated "why contribute" and "first steps"
- Beginner-friendliness score (1-10) with reasoning
- Live stats from GitHub (stars, good-first-issues, help-wanted)
- Weekly auto-discovery of new trending projects via Claude
- Daily stats refresh

## How It Works

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  1. DISCOVER     Weekly Claude scan of GitHub        │
│                  trending + topic search             │
│       │                                              │
│  2. EVALUATE     Claude reads README + metadata,     │
│                  decides if project belongs          │
│       │                                              │
│  3. ENRICH       Claude generates description,        │
│                  why-contribute, first-steps, score   │
│       │                                              │
│  4. REFRESH      Daily stats update (stars, issues)  │
│       │                                              │
│  5. BUILD        Next.js static export                │
│       │                                              │
│  6. DEPLOY       Cloudflare Pages                     │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## Tech Stack

- **Framework**: Next.js 14 (App Router, static export)
- **Styling**: Tailwind CSS with custom brand colors
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **Hosting**: Cloudflare Pages
- **Data**: Static JSON in `data/projects.json`, refreshed by GitHub Actions
- **AI**: Claude Sonnet 4.6 via Anthropic API

## Local Development

```bash
# Install deps
npm install

# Run dev server
npm run dev

# Build for production (static export to ./out)
npm run build

# Refresh project stats from GitHub
export GITHUB_TOKEN=ghp_...
python scripts/refresh-stats.py

# AI-enrich projects (costs ~$0.01 per project)
export ANTHROPIC_API_KEY=sk-ant-...
python scripts/enrich-ai.py

# Discover new trending projects (weekly)
python scripts/discover.py --limit 15
```

## Project Structure

```
agentic-hub/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Landing
│   │   ├── projects/
│   │   │   ├── page.tsx             # Listing with search/filter
│   │   │   └── [slug]/page.tsx      # Detail page
│   │   ├── categories/page.tsx       # Category grid
│   │   ├── guide/page.tsx            # Contribution guide
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── Nav.tsx
│   │   ├── Footer.tsx
│   │   ├── ProjectCard.tsx
│   │   └── ProjectsExplorer.tsx     # Search + filter UI
│   └── lib/
│       ├── types.ts                  # Project/Category types
│       ├── data.ts                   # Data loading helpers
│       └── utils.ts
├── data/
│   └── projects.json                 # AI-enriched project data
├── scripts/
│   ├── refresh-stats.py              # Daily: stars, issues
│   ├── enrich-ai.py                  # On-demand: AI fields
│   └── discover.py                   # Weekly: new projects
└── .github/workflows/
    ├── update-data.yml               # Daily + weekly data jobs
    └── deploy.yml                    # Cloudflare Pages deploy
```

## Cloudflare Pages Setup

1. Push this repo to GitHub
2. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → Workers & Pages → Create → Pages → Connect to Git
3. Select `agentic-hub` repository
4. Build configuration:
   - **Framework preset**: Next.js (Static HTML Export)
   - **Build command**: `npm run build`
   - **Build output directory**: `out`
5. Deploy

For automated deploys via GitHub Actions, add these secrets to the repo:
- `CLOUDFLARE_API_TOKEN` (create at [My Profile → API Tokens](https://dash.cloudflare.com/profile/api-tokens))
- `CLOUDFLARE_ACCOUNT_ID` (on the Pages overview page)
- `ANTHROPIC_API_KEY` (for AI enrichment workflow)

## Adding Projects Manually

Edit `data/projects.json` directly, then run `python scripts/enrich-ai.py --only owner/repo` to populate AI fields.

Or let the weekly discovery script find it automatically.

## License

MIT
