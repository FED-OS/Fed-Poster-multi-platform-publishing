# 📋 Changelog

All notable changes to **Fed-Poster** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> 🔄 Releases are also tagged on GitHub. See [ROADMAP.md](ROADMAP.md) for what's planned next.

---

## [Unreleased]

### Added
- **8 new direct platform adapters** in the dashboard composer:
  - `feat(reddit)`: submit text/link posts to any subreddit via Reddit OAuth (`/api/submit`).
  - `feat(x)`: post tweets via X API v2 (`/2/tweets`) with a 280-char live counter.
  - `feat(linkedin)`: share updates to a profile or company page via the ugcPosts API.
  - `feat(facebook)`: post text to a Facebook Page via the Graph API (`/{page-id}/feed`).
  - `feat(pinterest)`: create pins with image, link, and description via the Pinterest v5 API.
  - `feat(threads)`: publish threads via Meta's two-step container + publish flow.
  - `feat(tumblr)`: create text/link/quote posts to a blog via the Tumblr API.
  - `feat(nostr)`: broadcast notes to any relay using NIP-07 browser extensions or an `nsec`/hex private key.
- **14 additional direct platform adapters** expanding the composer to 29 direct platforms:
  - `feat(instagram)`: publish photo/video posts to an Instagram Business account via the Meta Graph API two-step container + publish flow.
  - `feat(youtube)`: post community-tab updates to a YouTube channel via the YouTube Data API v3 `activities` endpoint.
  - `feat(tiktok)`: publish video posts via the TikTok Content Posting API v2 (`/v2/post/publish/`).
  - `feat(snapchat)`: create snap/story creatives via the Snapchat Marketing API.
  - `feat(whatsapp)`: broadcast template/text messages via the WhatsApp Business Cloud API (`/messages`).
  - `feat(slack)`: post channel messages via Slack incoming webhooks (simplest adapter — single POST).
  - `feat(medium)`: publish articles via the Medium API with auto user-ID fetch and markdown tags.
  - `feat(wordpress)`: create blog posts via the WordPress REST API with Basic Auth (`/wp-json/wp/v2/posts`).
  - `feat(vk)`: post to a VK wall via the VK API `wall.post` method with owner-ID targeting.
  - `feat(weibo)`: publish status updates via Weibo OAuth 2.0 (`statuses/update`).
  - `feat(nextdoor)`: post neighborhood updates via the Nextdoor API posts endpoint.
  - `feat(flickr)`: upload photos with titles/tags/descriptions via the Flickr upload API (simplified OAuth).
  - `feat(gbp)`: create local posts for a Google Business Profile location via the GBP localPosts API.
  - `feat(farcaster)`: publish casts to Farcaster via the Warpcast API v2 (`/v2/casts`).
- Per-platform sidebar nav items, Multi-Post toggle chips, live-preview renderers, and character-limit badges for every new platform.
- Credential auto-save (`localStorage`) fields for all new platforms.
- Platform badge gradients in `dashboard.css` for Reddit, X, LinkedIn, Facebook, Pinterest, Threads, Tumblr, and Nostr.
- Full open-source governance & community infrastructure (issue templates, PR templates, funding, Dependabot, ADRs, roadmap, wiki scaffolding).
- `CLAUDE.md` and `AGENTS.md` for AI-assisted development.
- `styles.css` extracted from inline `<style>` for maintainability and theming.
- Social preview generation prompts and assets.
- Discussion category templates (Q&A, Ideas, Show & Tell, Announcements).

### Changed
- Dashboard "platforms ready" count raised from 7 → 15 → **29 direct platforms**; README badge updated to "29 direct + 450+ Zapier".
- Landing page (`index.html`) platform tiles expanded from 15 → 29, with heading updated to "Twenty-nine platforms, one composer" and meta description listing all 29 platforms.
- `settings.js` ACCOUNTS array expanded from 7 → 29 entries covering every direct platform with id, name, icon, color, keys, and label.
- Keyboard shortcut range extended from `1–8` to `1–9` for the expanded platform list.
- `README.md` supported-integrations table and `ROADMAP.md` pipeline updated to reflect shipped adapters.
- Refactored `index.html` to load `styles.css` externally.
- Hardened `SECURITY.md` with self-hosting checklist and version support table.
- Expanded `README.md` with badges, full feature matrix, and contributor guidance.

### Security
- Added `.gitignore` rules for `.env`, tokens, and credential files.
- Documented OAuth-only credential handling and `localStorage` best practices.

---

## [2.0.0] — 2026-08-25

### Added
- 🎉 **Major release:** redesigned landing dashboard with platform grid (29 direct + 450+ via Zapier).
- Pricing tiers: Starter, Growth, Pro, Agency.
- Ko-fi widget for community funding.
- Carousel "How It Works" feature walkthrough.
- Delivery analytics and audit log export.
- Team collaboration (Pro plan, 5 users).
- Self-host option documented.

### Changed
- Rebranded navigation and footer to FED-OS / fedpromptly.com.
- Updated tech stack references (React, TypeScript, Tailwind, vanilla JS).

### Fixed
- Smooth-scroll anchor handling across all internal links.
- Mobile nav toggle state management.

---

## [1.4.0] — 2026-05-12

### Added
- DeviantArt OAuth integration (client-side).
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
