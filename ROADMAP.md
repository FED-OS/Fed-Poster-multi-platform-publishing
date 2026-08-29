# 🗺️ Fed-Poster Roadmap

> A living document. Priorities shift based on community input (Discussions polls), maintainer capacity, and platform API changes. Nothing here is a hard commitment or a date promise — it's a transparent view of where we're heading. Have an opinion? [Vote in a poll](https://github.com/fedpromptly/fed-poster/discussions/categories/polls) or [propose an idea](https://github.com/fedpromptly/fed-poster/discussions/categories/ideas).

<div align="center">
  <img src="https://img.shields.io/badge/status-living%20document-blue?style=for-the-badge" alt="Living document" />
  <img src="https://img.shields.io/badge/current-v1.x-brightgreen?style=for-the-badge" alt="v1.x" />
  <img src="https://img.shields.io/badge/updated-2024--08-orange?style=for-the-badge" alt="Updated" />
</div>

---

## 🧭 Vision

Fed-Poster exists to make cross-posting to the open and social web **private, fast, and free**. The north star is a single dashboard from which a creator or agency can reach every platform they care about — without surrendering their credentials to a server farm, without a SaaS lock-in, and without juggling a dozen browser tabs. The roadmap pursues three durable themes: **more reach** (platforms), **more control** (scheduling, automation, analytics), and **deeper trust** (privacy, security, self-hosting). Everything below ladders up to one of those.

---

## ✅ Recently Shipped

What landed in the current release line. Full detail in [`CHANGELOG.md`](CHANGELOG.md).

- **12 built-in themes** — Deep Space, Cloud, Azure Depth, Emerald Forest, Royal Nebula, Molten Lava, Cyberpunk, Sunset, Abyssal Teal, Luxe Blush, Cobalt Steel, Synthwave — with instant switching and persistence.
- **Multi-platform composer** — select any combination of platforms, write once, send everywhere.
- **Per-platform panels** — credential management, message composition, file uploads, test & send, real-time status, for Telegram, Bluesky, Mastodon, Discord, GitHub (Gist + Repo), Tumblr, DeviantArt, SafeW.
- **Proxy bridges** — Buffer and WordPress Jetpack extend reach to Twitter/X, LinkedIn, Facebook, Instagram, Tumblr without per-platform API keys.
- **Smart credential storage** — `localStorage`, namespaced `fedposter_*`, never leaves the device.
- **File attachments** — photos, videos, audio on supported platforms (Telegram, Bluesky, Mastodon, DeviantArt).
- **Ko-fi community funding** — overlay widget on CTA buttons; no in-dashboard ads or telemetry.
- **Branded 404 + landing redesign** with hero, logos bar, and pricing teaser.

---

## 🚧 In Progress (v1.x next minor)

Work actively underway or next in the queue.

- **Calendar scheduling polish** — drag-to-reschedule, timezone-aware posting, conflict warnings, and a month/week/day toggle. (`calendar.html`, `assets/calendar.js`)
- **Analytics expansion** — per-platform posting counts, engagement proxies where APIs allow, exportable CSV, and a rolling 30-day view. (`analytics.html`, `assets/analytics.js`)
- **Credential export/import & full wipe** — encrypted JSON bundle so users can move accounts between browsers/devices safely, plus a one-click "nuke all Fed-Poster data" in Settings.
- **Settings audit** — consolidate theme picker, credential manager, and about panel into a tabbed settings shell; add a "security checkup" that flags over-broad token scopes.
- **Accessibility pass** — keyboard navigation across the dashboard, focus-visible rings using tokens, screen-reader labels on all platform toggles, and WCAG AA contrast verification per theme.
- **Documentation deepening** — finish the `wiki/` per-platform setup guides and a theme-authoring tutorial.

---

## 🔜 Planned (this year)

Higher-confidence items we intend to build, pending capacity.

### Platforms
- **Nostr** — native support via relays; a privacy-aligned fit for the project's ethos.
- **Pixelfed** — image-first federated posting.
- **Cohost / successor** — if the community wants it and the API permits.
- **Threads (Meta)** — via official API where available; otherwise a documented bridge.
- **Reddit & LinkedIn direct** — explore official API access vs. continuing proxy reliance.
- **YouTube Community posts & Shorts** — for creator workflows.
- **Medium & Substack** — long-form cross-posting with markdown preservation.

### Capabilities
- **Drafts & templates library** — reusable per-platform message templates with variables (`{title}`, `{url}`, `{tags}`).
- **AI-assisted content** (Growth tier) — repurpose one long post into platform-tailored variants, suggest hashtags, generate images. Strictly opt-in, client-side where possible, never auto-posting without review.
- **Queue + bulk scheduling** — drag posts into a queue, auto-stagger to avoid spamminess.
- **Webhooks & simple API** (Agency tier) — trigger posts from external systems; receive post-status callbacks.
- **Team / agency workspaces** — multiple client accounts, role-based access, per-client credential vaults.
- **Browser extension** — right-click → "cross-post this page" feeding the dashboard.
- **Encrypted cloud sync (opt-in)** — let users sync credentials across devices via their own encrypted store (age/NaCl), with the key never touching our servers.

### Trust & Operations
- **CSP + SRI hardening** — ship a Content-Security-Policy and Subresource Integrity hashes for the CDN assets.
- **Optional self-hosted scheduling daemon** — a tiny documented Node service for users who need posting to survive a closed browser, preserving the no-required-backend default.
- **Automated visual regression** — screenshot the dashboard in all 12 themes on PRs.
- **i18n groundwork** — extract UI strings so community translations become possible.

---

## 🧪 Exploring (needs research / community signal)

Lower-confidence ideas we're mulling. Vote in Discussions to move these up.

- **Federation-native features** — follow/import from Mastodon/Bluesky graphs to suggest platforms.
- **Analytics integrations** — pipe post stats into Plausible/GA (user-owned, opt-in only).
- **Content calendar templates** — seasonal/campaign presets.
- **Mobile app shell** (PWA) with offline draft composition and background sync via service worker.
- **A "platform health" dashboard** — live status of each integration's API (rate limits, outages).
- **Rate-limit awareness** — auto-throttle multi-post to respect each platform's limits and surface ETA.

---

## 🏗️ Architectural Track

Tracked via [`ADR.md`](ADR.md). The significant one under consideration:

- **ADR-010 (Proposed): React/TypeScript rewrite as a v2 track.** Would bring component reuse, type safety, and a test harness to the increasingly complex dashboard — **without** abandoning the v1 static build or the no-required-backend privacy property. Open until a maintainer accepts it and supersedes ADR-003. Community input welcome.

---

## ❌ Not Doing (for now) — and why

Transparency about what we're deliberately *not* building, to set expectations:

- **A required backend / credential server.** Would break the core privacy promise (ADR-001). Optional scheduling daemon, yes; mandatory server, no.
- **Ads or third-party tracking in the dashboard.** Non-negotiable. Funding comes from Ko-fi and the hosted commercial tiers (ADR-007).
- **Unofficial/scraping API clients for closed platforms.** Fragile, ToS-violating, ban-prone. We bridge via Buffer/Jetpack instead (ADR-006).
- **Auto-posting AI content without review.** AI assistance is opt-in and always previews before send.
- **Paywalling the open-source build.** The OSS repo stays fully functional; commercial value lives in hosting and services.

---

## 📅 Release Cadence

We aim for a **minor release roughly every 4–6 weeks** and **patch releases as needed** (especially for security — see `SECURITY.md`). SemVer applies (ADR-009). Each release ships a `CHANGELOG.md` section and, where relevant, GitHub Release notes. No hard dates; quality and the privacy bar gate every release.

---

## 🗳️ How Priorities Get Set

1. **Community signal** — Discussions polls, 👍 reactions on feature requests, real use cases in Q&A.
2. **Maintainer capacity** — Fed-Poster is volunteer-maintained; we ship what we can sustain.
3. **Platform API reality** — an integration may drop or jump priority based on a platform's API changes.
4. **Privacy/security gating** — anything that risks the core promise is deprioritized or rejected outright.

Want to move something up the list? The fastest path is a well-argued [feature request](https://github.com/fedpromptly/fed-poster/issues/new?template=feature_request.md) with a real use case and community 👍s, or a PR that implements it (see [`CONTRIBUTING.md`](CONTRIBUTING.md)).

---

<div align="center">
  <sub>🗺️ <strong>This roadmap is a compass, not a contract.</strong> Build with us.</sub>
</div>
