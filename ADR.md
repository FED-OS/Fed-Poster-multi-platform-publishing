# ADR — Architecture Decision Records

> Architecture Decision Records for **Fed-Poster**. Each ADR captures a single, significant architectural choice: the context, the options considered, the decision, and the consequences. ADRs are immutable once accepted — supersede them with a new ADR that links back, don't edit history.
>
> Format based on Michael Nygard's ADR template. Number sequentially (`ADR-001`, `ADR-002`…). Status is one of: `Proposed`, `Accepted`, `Superseded by ADR-0NN`, `Deprecated`, `Rejected`.

## Index

| # | Title | Status | Date |
|---|-------|--------|------|
| [ADR-001](#adr-001--run-fully-client-side-no-required-backend) | Run fully client-side, no required backend | Accepted | 2024-06-01 |
| [ADR-002](#adr-002--credentials-in-localstorage-namespaced-fedposter_) | Credentials in localStorage, namespaced `fedposter_*` | Accepted | 2024-06-01 |
| [ADR-003](#adr-003--vanilla-htmlcssjs-over-a-framework-no-build-step) | Vanilla HTML/CSS/JS over a framework; no build step | Accepted | 2024-06-01 |
| [ADR-004](#adr-004--css-custom-property-design-system-with-12-themes) | CSS custom-property design system with 12 themes | Accepted | 2024-06-10 |
| [ADR-005](#adr-005--stateless-supabase-edge-functions-for-oauth-bridges) | Stateless Supabase Edge Functions for OAuth bridges | Accepted | 2024-06-15 |
| [ADR-006](#adr-006--buffer--wordpress-jetpack-as-proxy-bridges-for-closed-platforms) | Buffer & WordPress Jetpack as proxy bridges for closed platforms | Accepted | 2024-06-20 |
| [ADR-007](#adr-007--ko-fi-for-community-funding-no-in-app-paywall) | Ko-fi for community funding; no in-app paywall | Accepted | 2024-07-01 |
| [ADR-008](#adr-008--mit-licence-for-the-open-source-core) | MIT licence for the open-source core | Accepted | 2024-06-01 |
| [ADR-009](#adr-009--semantic-versioning-and-a-manual-changelog) | Semantic Versioning and a manual changelog | Accepted | 2024-06-01 |
| [ADR-010](#adr-010--optional-reacttypescript-rewrite-as-a-future-track-not-current) | Optional React/TypeScript rewrite as a future track (not current) | Proposed | 2024-08-01 |

---

## ADR-001 — Run fully client-side, no required backend

- **Status:** Accepted
- **Date:** 2024-06-01
- **Deciders:** Project maintainer

### Context
Fed-Poster's core promise is privacy: a user's platform credentials should never be handed to a server the user doesn't control. A traditional SaaS architecture (server holds tokens, posts on the user's behalf) would both create a high-value credential honeypot and require ongoing server costs, compliance burden, and a trust relationship the project wanted to avoid. At the same time, the target platforms (Telegram, Bluesky, Mastodon, Discord, GitHub, Tumblr, DeviantArt) expose APIs that can be called directly from the browser with appropriate CORS support or via thin, stateless proxies.

### Decision
Fed-Poster runs as a static, multi-page web application with no required backend. The browser holds credentials in `localStorage` and calls each platform's API directly. Where a platform requires OAuth or forbids direct browser calls, a **stateless** edge function is used purely as a pass-through (see ADR-005). An optional Node/Express backend exists only for self-hosters who want scheduling that survives a closed browser; it is not required for any posting flow.

### Consequences
- **Positive:** Zero server credential storage → dramatically reduced attack surface and compliance scope. Trivial, cheap hosting (any static host). Users can self-host by literally opening the files. The privacy promise is verifiable by reading the source.
- **Negative:** Long-running work (scheduled posts) only runs while the page is open, unless the optional backend is deployed. CORS incompatibilities on some platforms force proxy bridges (ADR-006). localStorage is per-browser, so credentials don't roam across devices without manual export/import.
- **Neutral:** The architecture leans on each platform's API stability and CORS posture.

### Compliance
This decision is the foundation of the security claims in `SECURITY.md` and the "credentials never leave your device" messaging throughout the product.

---

## ADR-002 — Credentials in localStorage, namespaced `fedposter_*`

- **Status:** Accepted
- **Date:** 2024-06-01

### Context
With no backend (ADR-001), credentials must live somewhere client-side. Options: `localStorage`, `IndexedDB`, `sessionStorage`, the URL, or prompting the user each session. We needed persistence across sessions (so users don't re-enter tokens daily) but also clear scoping so credentials can be audited, cleared, and never accidentally collide with other apps on the same origin.

### Decision
Store all credentials in `localStorage`, with every key namespaced under `fedposter_` (e.g. `fedposter_telegram_token`, `fedposter_bluesky_session`, `fedposter_github_pat`). The theme preference is `fedposter_theme`. Drafts that are large or binary use `IndexedDB`. Never store credentials in `sessionStorage` (lost on close) or the URL (leaks via history/referrer).

### Consequences
- **Positive:** Simple, synchronous, widely supported API. Namespacing makes "clear all Fed-Poster data" trivial and prevents collisions. Auditable: a user can inspect Application → localStorage and see exactly what's stored.
- **Negative:** localStorage is readable by any JS on the origin → XSS would be catastrophic. This is why Fed-Poster carries a strict no-third-party-scripts policy and CSP guidance. Tokens don't sync across devices/browsers.
- **Mitigations:** Document the XSS risk in `SECURITY.md`; recommend app-specific passwords and scoped tokens; never load untrusted remote scripts; provide a "Clear all credentials" control in Settings.

---

## ADR-003 — Vanilla HTML/CSS/JS over a framework; no build step

- **Status:** Accepted
- **Date:** 2024-06-01

### Context
The README's "Tech Stack" section references React, TypeScript, Tailwind, and Framer Motion as an *aspirational* future stack. The actually shipped code, however, is hand-written HTML, a CSS-custom-property design system, and vanilla JavaScript in IIFE modules — openable by double-clicking the HTML with no install, no bundler, no `npm install`, no transpiler. The choice was whether to rewrite to the "modern" stack now or commit to vanilla for the v1 line.

### Decision
Ship and maintain vanilla HTML/CSS/JS for the v1 line. No build step, no framework, no transpiler. Keep the "opens in a browser instantly" property as a first-class feature. A React/TS rewrite is tracked separately (ADR-010) as a future proposal, not the current path.

### Consequences
- **Positive:** Zero onboarding friction for contributors — open the file, edit, refresh. No dependency drift, no security advisories from a transitive dep tree, tiny attack surface, fast loads, trivial static hosting.
- **Negative:** No component reuse primitives beyond copy-paste; larger features (a complex scheduler UI) get unwieldy in vanilla; no type safety; testing is manual.
- **Neutral:** Contributors who only know React face a small learning curve, mitigated by `CLAUDE.md` and `CONTRIBUTING.md`.

---

## ADR-004 — CSS custom-property design system with 12 themes

- **Status:** Accepted
- **Date:** 2024-06-10

### Context
The product needed a cohesive, themeable visual identity across six+ pages and a multi-tab dashboard, with multiple aesthetic themes (Deep Space, Cyberpunk, Synthwave, etc.). Options: a utility CSS framework (Tailwind), a CSS-in-JS solution, a preprocessor (Sass), or a hand-rolled token system using CSS custom properties.

### Decision
Use a hand-rolled design-token system in `assets/fedposter.css`: semantic tokens (`--bg-card`, `--accent`, `--text-primary`, `--radius`, …) defined on `:root`, overridden per theme via `[data-theme="…"]`. Themes are selected by setting `data-theme` on `<html>`, persisted via `localStorage.fedposter_theme`, and managed by `assets/fedposter.js`. Twelve themes ship: dark, light, blue, green, purple, orange, cyberpunk, sunset, ocean, rose, midnight, synthwave.

### Consequences
- **Positive:** Themes are trivial to add (one `[data-theme]` block + three JS array entries). No build tool. Tokens give consistency without a utility framework. Theme switching is instant and persists.
- **Negative:** Every new token must be added to `:root` **and** every theme block, or themes degrade silently. No type checking on token usage.
- **Mitigations:** `CLAUDE.md` §3 codifies the "tokens not hex" rule and the per-theme addition checklist.

---

## ADR-005 — Stateless Supabase Edge Functions for OAuth bridges

- **Status:** Accepted
- **Date:** 2024-06-15

### Context
Some platforms (Tumblr, SafeW, DeviantArt) require OAuth flows or server-to-server calls that browsers cannot perform directly. We needed a server-side component for these, but wanted to preserve the "we don't store your data" promise (ADR-001). Options: a traditional always-on backend with a database; serverless functions that persist tokens; or stateless edge functions that act as pure pass-throughs.

### Decision
Use Supabase Edge Functions as **stateless** proxies for OAuth and CORS-blocked calls. Functions perform the OAuth handshake and return the resulting token to the browser, which stores it locally (ADR-002). Functions **never** write to a database, **never** log secrets, and hold no state between requests. All traffic is HTTPS.

### Consequences
- **Positive:** The privacy promise holds — no server-side credential storage. Cheap, scales to zero. The OAuth complexity is isolated to small, auditable functions.
- **Negative:** OAuth "refresh token" flows that need a persistent server-side secret are hard; we lean on tokens the browser can refresh or that are long-lived and scoped. Edge function cold starts add latency to the first OAuth call.
- **Neutral:** Couples those specific platforms to Supabase; a self-hoster needs to deploy the functions or skip those platforms.

---

## ADR-006 — Buffer & WordPress Jetpack as proxy bridges for closed platforms

- **Status:** Accepted
- **Date:** 2024-06-20

### Context
Twitter/X, LinkedIn, Facebook, and Instagram have closed or heavily restricted their public posting APIs, often requiring business verification and app review that an open-source project cannot reasonably obtain. Users still want to reach these networks. Options: drop support; attempt unofficial/scraping approaches (fragile, ToS-violating, ban-prone); or bridge through an established multi-poster service the user already trusts.

### Decision
Support **Buffer** and **WordPress Jetpack** as proxy bridges. The user authenticates with their own Buffer/Jetpack account; Fed-Poster hands the post to that service, which then distributes to Twitter, LinkedIn, Facebook, Instagram, and Tumblr per the user's Buffer/Jetpack configuration. Fed-Poster never touches the downstream platform credentials.

### Consequences
- **Positive:** Reaches closed platforms without unofficial API abuse. The trust relationship is between the user and Buffer/Jetpack, not Fed-Poster. No app-review gauntlet.
- **Negative:** Depends on Buffer/Jetpack's continued availability and pricing. Adds an intermediary (latency, possible rate limits). The "12 platforms" claim is nuanced (some are reached via proxies).
- **Neutral:** Documented clearly in README's proxy-platform note and PRICING.

---

## ADR-007 — Ko-fi for community funding; no in-app paywall

- **Status:** Accepted
- **Date:** 2024-07-01

### Context
Fed-Poster is MIT-licensed open source with no venture funding and no telemetry. Maintenance needs funding. Options: a SaaS paywall around the open-source core; ads in the dashboard; GitHub Sponsors only; Ko-fi tip jar; or a hybrid (open core + paid hosted). The project wanted to keep the dashboard ad-free and the open-source build fully functional, while still capturing revenue from the hosted/commercial tiers described in PRICING.

### Decision
Use **Ko-fi** as the primary community tip jar, surfaced as an overlay widget on CTAs across the site (`data-kofi` attributes on pricing/upgrade buttons). The open-source build remains fully functional. The commercial tiers (Starter/Growth/Agency) apply to the **hosted** product at fedpromptly.com, not to the open-source repo. No ads, no in-dashboard telemetry, no paywalling of the OSS build.

### Consequences
- **Positive:** OSS users keep full functionality; supporters can tip frictionlessly; commercial revenue comes from hosting/services, not from crippling the OSS build. Aligns with the privacy promise (Ko-fi loads on user action, not silently).
- **Negative:** Funding is unpredictable; the OSS build competes (benignly) with the hosted tiers.
- **Neutral:** `FUNDING.yml` lists Ko-fi as the primary channel; other channels are commented-in as they're enabled.

---

## ADR-008 — MIT licence for the open-source core

- **Status:** Accepted
- **Date:** 2024-06-01

### Context
Choosing an OSS licence for a tool likely to be forked, self-hosted, and potentially rebranded by agencies (the Agency tier sells white-label rights commercially). Options: MIT (permissive), Apache-2.0 (permissive + patent grant), GPL (copyleft), AGPL (network copyleft).

### Decision
MIT for the open-source repository. Simplest, most permissive, lowest friction for adoption and for the Agency white-label offering (which is a separate commercial agreement layered on top). A `LICENSE` file and `COPYING.md` explain the terms.

### Consequences
- **Positive:** Maximum adoption; no copyleft complexity; compatible with the commercial Agency/white-label tier.
- **Negative:** No copyleft protection — forks can be closed-source. No explicit patent grant (vs Apache-2.0).
- **Neutral:** The commercial tiers (PRICING.md) are services/contracts, not licence restrictions.

---

## ADR-009 — Semantic Versioning and a manual changelog

- **Status:** Accepted
- **Date:** 2024-06-01

### Context
Need a predictable versioning scheme and a human-readable release history. Options: SemVer + `CHANGELOG.md` (Keep a Changelog format); CalVer; auto-generated changelog from commits.

### Decision
Semantic Versioning (`MAJOR.MINOR.PATCH`) and a hand-maintained `CHANGELOG.md` in the [Keep a Changelog](https://keepachangelog.com/) format. An `[Unreleased]` section collects changes between releases. Security fixes increment PATCH and are noted in `SECURITY.md`. The current line is v1.x.

### Consequences
- **Positive:** Users and integrators can reason about upgrade risk. The changelog doubles as release notes. Keep-a-Changelog is contributor-friendly.
- **Negative:** Manual maintenance discipline required (enforced via PR checklist and `AGENTS.md`).
- **Neutral:** Auto-generation from conventional commits is a future option if commit hygiene stabilises.

---

## ADR-010 — Optional React/TypeScript rewrite as a future track (not current)

- **Status:** Proposed
- **Date:** 2024-08-01

### Context
As the dashboard grows (scheduling, analytics, more platforms, potential collaboration features), the vanilla JS in `assets/dashboard.js` (~20KB and climbing) is approaching the complexity where a component model, type safety, and a test harness would pay off. ADR-003 committed to vanilla for v1; this ADR proposes revisiting that for a v2 line without abandoning the v1 static build.

### Decision (proposed)
Open a `v2` track that rewrites the dashboard as a React + TypeScript + Vite app, consuming the same design-token CSS (ADR-004) and the same `localStorage` contract (ADR-002). The v1 static build stays the supported release until v2 reaches feature parity and passes the same privacy/security bar. No merge until an ADR explicitly supersedes ADR-003.

### Consequences (anticipated)
- **Positive:** Component reuse, type safety, a real test suite, better ergonomics for complex features.
- **Negative:** Introduces a build step and a dependency tree (security advisory surface), contradicting ADR-003's "opens in a browser instantly" property for contributors. Higher onboarding cost.
- **Open questions:** Does v2 keep a static export (e.g. Vite SSR/SSG) to preserve the no-server property? How is the OSS build kept fully functional alongside the hosted tiers?

### Status note
This ADR is **Proposed**, not Accepted. Do not begin the rewrite until a maintainer accepts it and supersedes ADR-003.

---

> **How to add an ADR:** copy the template structure above, pick the next number, set status to `Proposed`, write Context → Decision → Consequences, and add a row to the Index. ADRs are accepted by maintainer review (see `GOVERNANCE.md`).
