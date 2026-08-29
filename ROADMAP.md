# 🗺️ Fed-Poster Roadmap

<div align="center">
  <img src="https://img.shields.io/badge/status-active-success?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/version-2.0-brightgreen?style=for-the-badge" alt="Version" />
</div>

This roadmap communicates the **direction** of Fed-Poster. It is a living document — priorities shift based on community feedback, contributions, and available capacity. Nothing here is a hard commitment; it's a shared sense of where we're going. Have an opinion? Open a [Discussion](https://github.com/FED-OS/Fed-Poster/discussions) labeled `Ideas`.

> 🗳️ **Status legend:** ✅ Done · 🚧 In progress · 📋 Planned · 🔬 Exploring · 💤 Backlog

---

## 🎯 North Star

> *One workspace to publish everywhere — open source, self-hostable, secure by design, owned by the creator.*

---

## 🏗️ Current Focus (v2.x — H2 2026)

### Core Platform
- ✅ Redesigned dashboard with 29 direct integrations + 450+ via Zapier
- ✅ External `styles.css` for theming
- 🚧 Component refactor (extract per-platform panels into modules)
- 📋 Plugin/adapter registry for community-maintained platforms

### Security & Trust
- ✅ OAuth-only credential model
- ✅ `SECURITY.md`, `CODE_OF_CONDUCT.md`, governance docs
- 🚧 CSP headers & self-hosting hardening guide
- 📋 SOC 2 readiness program (Agency tier)

### Developer Experience
- ✅ `CLAUDE.md` / `AGENTS.md` for AI-assisted dev
- ✅ Dependabot + issue/PR templates
- 🚧 Test coverage baseline (unit + integration + E2E)
- 📋 Public API for programmatic posting

---

## 🚀 Upcoming Milestones

### v2.1 — Content Adaptation & Preview (Q3 2026)
- 📋 Per-platform live preview with character/media limits
- 📋 Smart content adaptation (auto-shorten for X, alt-text for Mastodon)
- 📋 Media transcoding pipeline (compress/resize per platform)
- 📋 Draft templates & reusable content snippets

### v2.2 — Scheduling & Automation (Q4 2026)
- 📋 Visual calendar scheduler with timezone awareness
- 📋 Queue management & retry with backoff
- 📋 Recurring posts & content series
- 📋 Best-time-to-post suggestions (basic heuristics)

### v2.3 — Analytics & Insights (Q1 2027)
- 📋 Unified delivery & engagement analytics
- 📋 Exportable audit logs (CSV/JSON)
- 📋 Per-platform performance comparison
- 📋 Webhook events for downstream automation

### v3.0 — Federation & Decentralization (H1 2027)
- 🔬 First-class ActivityPub support (publish to any Fediverse instance)
- 🔬 Matrix / XMPP adapters
- 🔬 Multi-account workspace (agency mode)
- 🔬 Local-first sync (CRDT) for self-hosted multi-device

---

## 🔌 Platform Integrations Pipeline

Requested platforms, tracked here for transparency. Want one? See [ADR-0007](ADR.md#adr-0007-adding-a-new-platform-adapter).

| Platform      | Status | Target       | Notes                          |
|---------------|--------|--------------|--------------------------------|
| Reddit        | ✅     | v2.1 (shipped) | Direct OAuth submit adapter  |
| X (Twitter)   | ✅     | v2.1 (shipped) | API v2 tweet adapter         |
| LinkedIn      | ✅     | v2.1 (shipped) | ugcPosts share adapter       |
| Facebook      | ✅     | v2.1 (shipped) | Page feed adapter            |
| Pinterest     | ✅     | v2.1 (shipped) | Pin creation adapter         |
| Threads       | ✅     | v2.1 (shipped) | Meta Threads two-step publish|
| Tumblr        | ✅     | v2.1 (shipped) | OAuth 1.0a text post adapter |
| Nostr         | ✅     | v2.1 (shipped) | NIP-07 + nsec relay publish  |
| Instagram     | ✅     | v2.2 (shipped) | Meta Graph container + publish |
| YouTube       | ✅     | v2.2 (shipped) | Data API v3 community posts    |
| TikTok        | ✅     | v2.2 (shipped) | Content Posting API v2         |
| Snapchat      | ✅     | v2.2 (shipped) | Marketing API creatives        |
| WhatsApp      | ✅     | v2.2 (shipped) | Business Cloud API broadcasts  |
| Slack         | ✅     | v2.2 (shipped) | Incoming webhook posts         |
| Medium        | ✅     | v2.2 (shipped) | Medium API article publish     |
| WordPress     | ✅     | v2.2 (shipped) | REST API + Basic Auth          |
| VKontakte     | ✅     | v2.2 (shipped) | wall.post adapter              |
| Weibo         | ✅     | v2.2 (shipped) | OAuth 2.0 statuses/update      |
| Nextdoor      | ✅     | v2.2 (shipped) | Neighborhood posts API         |
| Flickr        | ✅     | v2.2 (shipped) | Upload API (simplified OAuth)  |
| Google Business | ✅   | v2.2 (shipped) | GBP localPosts API             |
| Farcaster     | ✅     | v2.2 (shipped) | Warpcast API v2 casts          |
| Twitch        | Soon   | v2.2         | Clip publishing                |
| WeChat        | Soon   | Backlog      | Region-specific                |
| Quora         | Soon   | Backlog      |                                |
| ActivityPub   | 🔬     | v3.0         | Federation milestone           |
| Matrix        | 🔬     | v3.0         |                                |


---

## 💤 Backlog (Nice to Have)

- 📋 AI-assisted copy generation (opt-in, BYO-key)
- 📋 Image/video AI generation (opt-in)
- 📋 Browser extension for "share to Fed-Poster"
- 📋 Internationalization (i18n) & community translations
- 📋 Mobile companion app (PWA-first)
- 📋 Team roles & permissions (beyond Pro's 5 users)
- 📋 Dark/light theme toggle (currently dark-only)
- 📋 Rate-limit awareness dashboard per platform

---

## 🛑 Explicitly *Not* Doing (For Now)

To keep scope manageable, these are intentionally out of scope unless the community strongly pushes otherwise:

- ❌ Reading/aggregating inbound feeds (we're a *publisher*, not a reader)
- ❌ Storing user content server-side (we stay local-first by default)
- ❌ Advertising or selling user data — ever

---

## 🤝 How Priorities Are Set

1. **Community input** — Discussions, issues, feature requests.
2. **Maintainer proposals** — synthesized into milestones.
3. **Core Team review** — quarterly roadmap review (see [GOVERNANCE.md](GOVERNANCE.md)).
4. **Funding reality** — sponsored/agency work can accelerate specific items.

If you want a feature sooner, contributing it (or sponsoring it) is the fastest path. See [CONTRIBUTING.md](CONTRIBUTING.md) and [.github/FUNDING.yml](.github/FUNDING.yml).

---

## 📜 Changelog vs. Roadmap

- [CHANGELOG.md](CHANGELOG.md) = what **has** shipped.
- [ROADMAP.md](ROADMAP.md) = what **might** ship.

---

<div align="center">
  <sub>🗺️ <strong>The map is not the territory — but it helps us walk together.</strong></sub>
</div>
