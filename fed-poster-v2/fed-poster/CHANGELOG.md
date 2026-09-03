# 📋 Changelog

All notable changes to **Fed-Poster** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> 🔄 Releases are also tagged on GitHub. See [ROADMAP.md](ROADMAP.md) for what's planned next.

---

## [Unreleased]

### Added
- Full open-source governance & community infrastructure (issue templates, PR templates, funding, Dependabot, ADRs, roadmap, wiki scaffolding).
- `CLAUDE.md` and `AGENTS.md` for AI-assisted development.
- `styles.css` extracted from inline `<style>` for maintainability and theming.
- Social preview generation prompts and assets.
- Discussion category templates (Q&A, Ideas, Show & Tell, Announcements).

### Changed
- Refactored `index.html` to load `styles.css` externally.
- Hardened `SECURITY.md` with self-hosting checklist and version support table.
- Expanded `README.md` with badges, full feature matrix, and contributor guidance.

### Security
- Added `.gitignore` rules for `.env`, tokens, and credential files.
- Documented OAuth-only credential handling and `localStorage` best practices.

---

## [2.0.0] — 2026-08-25

### Added
- 🎉 **Major release:** redesigned landing dashboard with platform grid (20 direct + 450+ via Zapier).
- Pricing tiers: Starter, Growth, Pro, Agency.
- Ko-fi widget for community funding.
- Carousel "How It Works" feature walkthrough.
- Delivery analytics and audit log export.
- Team collaboration (Pro plan, 5 users).
- Self-host option documented.

### Changed
- Rebranded navigation and footer to FED-OS / fedpromptly.com.
- Updated tech stack references (React, TypeScript, Tailwind, Supabase Edge Functions).

### Fixed
- Smooth-scroll anchor handling across all internal links.
- Mobile nav toggle state management.

---

## [1.4.0] — 2026-05-12

### Added
- DeviantArt OAuth integration via Supabase Edge Functions.
- SafeW direct posting.
- WordPress Jetpack proxy for Twitter, LinkedIn, Facebook, Tumblr.

### Fixed
- Bluesky image upload encoding for large files.
- Telegram rate-limit backoff handling.

---

## [1.3.0] — 2026-03-04

### Added
- Buffer proxy support (Twitter, LinkedIn, Facebook, Instagram).
- Tumblr direct integration.
- Draft auto-save via IndexedDB.

### Changed
- Credential storage migrated to scoped `localStorage` keys.

---

## [1.2.0] — 2026-01-18

### Added
- GitHub (Classic Gist) and GitHub (Repo File Push) integrations.
- File attachment support for Telegram, Bluesky, Mastodon.

### Fixed
- Mastodon media type detection for audio files.

---

## [1.1.0] — 2025-11-22

### Added
- Discord direct posting (webhook-based).
- Mastodon direct integration (images, videos, audio).

### Security
- Enforced HTTPS for all integration endpoints.

---

## [1.0.0] — 2025-09-30

### Added
- 🚀 Initial public release.
- Telegram and Bluesky direct integrations.
- Multi-platform compose & send dashboard.
- Per-platform credential panels with auto-save.
- MIT license.

---

## Versioning Policy

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR** — incompatible API or architecture changes.
- **MINOR** — backward-compatible new features.
- **PATCH** — backward-compatible bug and security fixes.

Security fixes increment the **PATCH** version unless they require a breaking change. See [SECURITY.md](SECURITY.md) for supported versions.

---

## Link Legend

- `Added` for new features.
- `Changed` for changes in existing functionality.
- `Deprecated` for soon-to-be removed features.
- `Removed` for now removed features.
- `Fixed` for any bug fixes.
- `Security` in case of vulnerabilities.

---

<div align="center">
  <sub>📋 <strong>Keep a changelog. Make the future legible.</strong></sub>
</div>
