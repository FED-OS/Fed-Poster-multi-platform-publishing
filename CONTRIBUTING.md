# 🤝 Contributing to Fed-Poster

> First of all — thank you. Fed-Poster is volunteer-maintained and community-powered, and every contribution, from a typo fix to a new platform integration, makes the project better for everyone. This guide tells you how to contribute effectively: how to set up, what conventions to follow, what the hard rules are, and how to get your change merged. Read it once; refer back as needed.

<div align="center">
  <img src="https://img.shields.io/badge/first%20timers-welcome-success?style=for-the-badge" alt="First timers welcome" />
  <img src="https://img.shields.io/badge/build%20step-none-brightgreen?style=for-the-badge" alt="No build step" />
  <img src="https://img.shields.io/badge/license-MIT-yellow?style=for-the-badge" alt="MIT" />
</div>

---

## 🚀 Quick Start (5 minutes to a running local copy)

Because Fed-Poster is a static site with **no build step**, getting it running locally is about as easy as it gets.

```bash
# 1. Fork & clone your fork
git clone https://github.com/<your-username>/fed-poster.git
cd fed-poster

# 2. Add the upstream remote (for syncing later)
git remote add upstream https://github.com/fedpromptly/fed-poster.git

# 3. Create a branch for your change
git checkout -b feat/my-great-idea

# 4. Open the landing page in a browser — that's it, it runs.
#    For most changes you don't even need a server.
#    If a change touches OAuth/Supabase calls or fetch-from-file,
#    serve over http (browsers block fetch from file:// in some cases):
python3 -m http.server 8000
#    then visit http://localhost:8000/
```

No `npm install`. No bundler. No transpiler. You edit HTML/CSS/JS, save, refresh. This "opens in a browser instantly" property is a first-class feature (ADR-003) — please don't introduce tooling that breaks it without an approved ADR.

## 🧭 Where to Start

- **New contributors:** look for issues labelled `good first issue` or `help wanted`. These are scoped to be approachable.
- **Have an idea?** Float it in [Discussions → Ideas](https://github.com/fedpromptly/fed-poster/discussions/categories/ideas) before opening a formal feature request. Gauge interest, refine the use case, then file a [Feature Request](https://github.com/fedpromptly/fed-poster/issues/new?template=feature_request.md) if it has legs.
- **Found a bug?** Search existing issues first, then file a [Bug Report](https://github.com/fedpromptly/fed-poster/issues/new?template=bug_report.md).
- **Want to add a platform?** Follow the 10-step checklist in [`CLAUDE.md` §5](CLAUDE.md) — it's the most common multi-step task and the checklist keeps you from missing a panel, an analytics array, or a wiki page.
- **Docs person?** The `wiki/` always wants more per-platform setup guides and theme-authoring tutorials. Docs PRs are reviewed fast and count as real contributions.

## 🗂️ Branch & Commit Conventions

- **Branch from `main`** and keep your branch focused on one logical change. Name it with a type prefix: `feat/<thing>`, `fix/<thing>`, `docs/<thing>`, `theme/<name>`, `platform/<name>`, `chore/<thing>`.
- **Commits** are conventional and present-tense, scoped when useful:
  - `feat(platforms): add Nostr relay support`
  - `fix(theme): contrast on Luxe Blush cards`
  - `docs: expand Ko-fi setup in wiki`
  - `chore: bump version badge to v1.2.0`
- Keep commits **atomic and reviewable**. Squash only if a maintainer asks.
- **Never commit** the `.screenshots/` working scratch folder, `node_modules`, `.env`, or `*.local` files (they're in `.gitignore`).

## 🎨 Coding Conventions

The full architectural context lives in [`CLAUDE.md`](CLAUDE.md); the essentials:

- **Vanilla JS, no framework, no build step.** IIFE/module pattern, `'use strict'`, `const`/`let` over `var`, early returns, no global pollution, `addEventListener` over inline `on*=`.
- **HTML:** semantic elements (`nav`, `main`, `section`, `button` not `<div onclick>`), accessible labels, `alt` on images, logical heading order.
- **CSS:** use the design tokens from `assets/fedposter.css` — never hardcode hex colors. If you need a new color, add a token to `:root` **and every theme block**, then use the token. Mobile-first media queries. No `!important` without a written reason.
- **Formatting:** 2-space indent, single quotes for JS, double quotes for HTML attributes, trailing commas in multi-line arrays/objects. Match the surrounding file.
- **Comments:** explain *why*, not *what*. Preserve the existing section banners (`/* ==== SECTION ==== */`).

## 🔐 The Hard Rules (non-negotiable)

These protect users. Violating them blocks a PR:

1. **No real secrets** in code, comments, screenshots, or example strings. Use clearly-fake placeholders.
2. **No `console.log` of credentials.** Log booleans or masked values only.
3. **`localStorage` keys are `fedposter_*`** (theme is `fedposter_theme`). Always.
4. **HTTPS only** for outbound requests. No HTTP, ever.
5. **No new framework / build tool / runtime dependency** without an approved ADR in [`ADR.md`](ADR.md).
6. **Design tokens, not hex.**
7. **No telemetry, no ads, no third-party tracking.** Funding is Ko-fi + hosted tiers (ADR-007), surfaced only on user action.

If a task seems to require violating one of these, stop and open a Discussion or write a Proposed ADR — don't silently break the contract.

## 🧪 Testing & QA (we have no formal test suite — be the suite)

Before you open a PR, verify:

- Open the affected page(s) in a browser. DevTools **Console**: zero new red errors. Search your diff for stray `console.log`.
- DevTools **Network**: no new failing requests, no mixed-content, no HTTP calls.
- DevTools **Application → localStorage**: any new keys are `fedposter_*`; clearing them doesn't break the page.
- Visual: test the **Deep Space** theme (default) **and at least one other**; test at a desktop width **and at a mobile width (≤375px)**.
- If you touched posting logic: do a real **test post** to a sandbox/private target where possible, and confirm success/failure UI behaves.
- Run the secret scan in [`DEPLOYMENT.md`](DEPLOYMENT.md) on your diff.

## 📸 Screenshots Are Required for Visual Changes

For **any** UI, theme, layout, or dashboard change, attach before/after screenshots in the PR. Theme changes: show the affected theme in a light and dark context. New platform: show the panel and a successful test post. A reviewer shouldn't have to check out your branch to see what it looks like.

## 📦 Definition of Done

A PR is ready to merge when **all** of these are true:

- [ ] Code follows the conventions above and in `CLAUDE.md`.
- [ ] No real secrets; no credential logging; `fedposter_*` keys only; HTTPS only.
- [ ] No new framework/build tool without an approved ADR.
- [ ] Tested in ≥2 themes and ≥2 viewport widths (one ≤375px); console & network clean.
- [ ] Screenshots attached for any visual change.
- [ ] `CHANGELOG.md` `[Unreleased]` entry added.
- [ ] Related docs updated (`README.md`, `wiki/`, `PRICING.md`, `SECURITY.md` as applicable).
- [ ] PR template (`.github/PULL_REQUEST_TEMPLATE.md`) filled completely.
- [ ] Related issue/discussion linked.

## 🔄 Pull Request Flow

1. Push your branch to your fork and open a PR against `main`.
2. Fill in the PR template completely — every section.
3. A reviewer or maintainer reviews, usually within **72 hours**. Small/uncontroversial PRs can merge with one approval; larger ones benefit from two.
4. Address review feedback with new commits (don't force-push mid-review unless asked).
5. Once approved and CI (if any) is green, a maintainer merges. We typically squash-merge.
6. Celebrate. You're in the [`CHANGELOG.md`](CHANGELOG.md) and the contributors list.

## 🧱 Architectural Changes Need an ADR

If your change touches where data lives, introduces a framework/build step, adds a third-party runtime dependency, changes the licence, or affects the privacy/security posture, it's architectural. Write a **Proposed** ADR in [`ADR.md`](ADR.md) (Context → Decision → Consequences), link it from the PR, and let the community comment before a maintainer accepts it. See [`GOVERNANCE.md`](GOVERNANCE.md) for how ADRs are decided.

## 🔒 Security Contributions

If your contribution *fixes* a security issue, please coordinate privately first (email **security@fed-poster.example.com**) rather than opening a public PR that advertises the flaw. We'll arrange a fix-and-disclosure timeline per [`SECURITY.md`](SECURITY.md) and credit you in the release notes.

## 📝 Contributor License

Fed-Poster is MIT-licensed (see [`COPYING.md`](COPYING.md)). By submitting a contribution, you agree that your contribution will be licensed under the project's MIT License, and you certify that you have the right to submit it under those terms. You retain copyright over your own contribution; the project simply needs the licence to use and redistribute it. There is no separate Contributor License Agreement — the MIT License's permissive terms cover inbound and outbound licensing (inbound = outbound).

## 🧭 Project Governance & Conduct

How the project is run is documented in [`GOVERNANCE.md`](GOVERNANCE.md). Behavioural expectations for all community spaces are in [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) — participating in any Fed-Poster space means abiding by it. Be kind, assume good intent, and meet people where they are.

## 💖 Other Ways to Help

Code isn't the only contribution that counts. Answer a question in [Discussions → Q&A](https://github.com/fedpromptly/fed-poster/discussions/categories/q-a). Triage a duplicate issue and label it accurately. Improve a wiki page. Reproduce someone's bug report and add the missing environment details. Translate the docs. Or [buy us a coffee on Ko-fi](https://ko-fi.com/W3T61ZU5FS) — every tip funds new integrations and themes. Community energy matters more than money, but money helps too.

## ❓ Questions?

Stuck on setup, platform API quirks, or where a piece of logic lives? Check [`CLAUDE.md`](CLAUDE.md) (architecture & file map) and the [`wiki/`](wiki) first, then ask in [Discussions → Q&A](https://github.com/fedpromptly/fed-poster/discussions/categories/q-a) tagged `contributing`. We're friendly and we answer.

---

<div align="center">
  <sub>🤝 <strong>Thanks for helping make Fed-Poster better. Privacy by architecture, built by community.</strong></sub>
</div>
