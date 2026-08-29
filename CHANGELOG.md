# 📋 Changelog

All notable changes to **Fed-Poster** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html) (see ADR-009). Security fixes increment the **PATCH** version and are additionally noted in [`SECURITY.md`](SECURITY.md).

## [Unreleased]

### Added
- Comprehensive repository documentation and governance suite: `CLAUDE.md`, `AGENTS.md`, `ADR.md`, `ROADMAP.md`, `DEPLOYMENT.md`, `SUMMARY.md`, `GOVERNANCE.md`, `SUPPORT.md`, `CODE_OF_CONDUCT.md`, `CONTRIBUTING.md`, `COPYING.md`, `CITATIONS.md`, `usage.md`, and this `CHANGELOG.md`.
- GitHub community templates: `.github/DISCUSSION_WELCOME_README.md`, `.github/PULL_REQUEST_TEMPLATE.md`, `.github/ISSUE_TEMPLATE/{bug_report,feature_request,custom}.md`, `.github/ISSUE_TEMPLATE/config.yml`, `.github/FUNDING.yml`, `.github/CODEOWNERS`.
- Root-level `PULL_REQUEST_TEMPLATE.md`, `bug_report.md`, `feature_request.md`, `LICENSE` (MIT), `.gitignore`, and `styles.css`.
- Long-form `wiki/` content: Home, Architecture, Platform Setup index, Theme Authoring, Troubleshooting, FAQ, and Sidebar.
- Social-preview image-generation prompts under `.github/social/`.

### Changed
- Upgraded `README.md` with expanded sections, badges, comparison table, security highlight, and links to the new documentation suite.
- Upgraded `SECURITY.md` with a fuller supported-versions table, scope/rotation guidance, and coordinated-disclosure detail.

### Security
- Codified the no-telemetry, HTTPS-only, `fedposter_*` namespacing, and no-real-secrets rules across `CLAUDE.md`, `AGENTS.md`, `CONTRIBUTING.md`, and `DEPLOYMENT.md` (CSP/SRI hardening checklist).

---

## [1.0.0] — 2024-07-15

### Added
- Privacy-first, browser-native multi-platform posting dashboard with no required backend (ADR-001).
- Twelve supported platforms: Telegram, Bluesky, Mastodon, Discord, GitHub (Gist + Repo), Tumblr, DeviantArt, SafeW, plus Buffer and WordPress Jetpack proxy bridges to Twitter/X, LinkedIn, Facebook, Instagram, and Tumblr (ADR-006).
- Multi-platform composer: write once, select any combination of platforms, send simultaneously.
- Per-platform panels with credential management, message composition, file uploads, and Test/Send with real-time status.
- Smart credential storage in `localStorage`, namespaced `fedposter_*` (ADR-002).
- File attachments: Telegram (photos/videos), Bluesky (images), Mastodon (images/videos/audio), DeviantArt (images via OAuth).
- Twelve built-in themes via a CSS custom-property design system (ADR-004): Deep Space, Cloud, Azure Depth, Emerald Forest, Royal Nebula, Molten Lava, Cyberpunk, Sunset, Abyssal Teal, Luxe Blush, Cobalt Steel, Synthwave — with instant switching and persistence.
- Shared design system in `assets/fedposter.css` and shared JS in `assets/fedposter.js` (theme persistence, mobile nav, scroll reveal, Discord count).
- Per-page modules: dashboard composer, calendar scheduling, analytics, settings, pricing, and a branded 404.
- Stateless Supabase Edge Functions bridging OAuth for Tumblr, SafeW, and DeviantArt (ADR-005).
- Ko-fi community funding overlay widget on CTA buttons (ADR-007); no in-dashboard ads or telemetry.
- MIT License (ADR-008).
- Semantic Versioning with a manual Keep-a-Changelog changelog (ADR-009).

### Security
- Client-side-only credential storage; no server-side credential persistence.
- HTTPS-only outbound requests; no third-party tracking scripts.
- Recommendation engine for app-specific passwords and scoped tokens throughout the UI and docs.

---

## Versioning & Release Notes

- **MAJOR** — incompatible changes (e.g. removing a platform, changing the `localStorage` schema in a non-migrating way).
- **MINOR** — new platforms, themes, or features, backward-compatible.
- **PATCH** — bug fixes and security patches, backward-compatible.

Release tags (`v1.X.Y`) correspond to the sections above and are published on the [Releases page](https://github.com/fedpromptly/fed-poster/releases). Each release is announced in [Discussions → Announcements](https://github.com/fedpromptly/fed-poster/discussions/categories/announcements). Security releases additionally follow the disclosure timeline in [`SECURITY.md`](SECURITY.md).

### Link references

[Unreleased]: https://github.com/fedpromptly/fed-poster/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/fedpromptly/fed-poster/releases/tag/v1.0.0
