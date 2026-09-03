# 🤖 CLAUDE.md — Guidance for Claude (and Claude Code)

<div align="center">
  <img src="https://img.shields.io/badge/agent-Claude-7c5cfc?style=for-the-badge" alt="Claude" />
  <img src="https://img.shields.io/badge/role-assistant-blueviolet?style=for-the-badge" alt="Role" />
</div>

This file gives Claude (and Claude Code) the context needed to contribute to **Fed-Poster** effectively, safely, and in line with project conventions. Human contributors should read [CONTRIBUTING.md](CONTRIBUTING.md); this file is the AI companion to it.

> 🤝 AI contributions follow the **same review process** as human contributions. No auto-merge. No bypassing CI. No skipping tests.

---

## 🧭 Project Context (Read First)

**Fed-Poster** is an open-source (MIT), browser-first multi-channel publishing dashboard. Users compose once and cross-post to ~20 direct platforms + 450+ via Zapier. The front-end is a **static site** (`index.html` + `styles.css` + vanilla JS). Optional Supabase Edge Functions handle OAuth proxies. Credentials live in the browser's `localStorage` — **OAuth tokens only, never passwords**.

Key docs to orient yourself:
- [README.md](README.md) — overview
- [usage.md](usage.md) — how users use it
- [ADR.md](ADR.md) — architectural decisions (read before big changes)
- [ROADMAP.md](ROADMAP.md) — what's planned
- [SECURITY.md](SECURITY.md) — security rules (critical)
- [CONTRIBUTING.md](CONTRIBUTING.md) — contribution process

---

## ✅ What Claude Should Do

### Workflow
1. **Understand the task.** Read the relevant docs and existing code before editing.
2. **Plan.** If a change is non-trivial, summarize the approach in the PR description and reference the relevant ADR.
3. **Make minimal, focused changes.** Prefer small PRs. One concern per PR.
4. **Follow conventions** (below): file structure, naming, CSS variables, commits.
5. **Test.** Add/Update tests for any behavior change. Run `npm run lint && npm test && npm run build` (or the project's equivalent) before declaring done.
6. **Document.** Update README/usage/wiki/CHANGELOG if user-facing.
7. **Open a PR** using [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md). Link the issue. Don't merge yourself.

### Conventions
- **Commits:** Conventional Commits — `feat(<scope>): ...`, `fix(<scope>): ...`, `docs: ...`. (Enforced by commitlint.)
- **Branches:** `feature/...`, `fix/...`, `docs/...`, `chore/...` (kebab-case).
- **CSS:** Use the `:root` custom properties in `styles.css`. **Never hardcode colors** — use `var(--accent)`, `var(--bg-card)`, etc.
- **JS:** Vanilla JS for the landing page. If working on the dashboard app (if present), follow its framework conventions. No `any` without justification.
- **Naming:** `camelCase` vars/functions, `PascalCase` types/components, `kebab-case` files & CSS classes, `SCREAMING_SNAKE_CASE` constants.
- **Accessibility:** Use semantic HTML, ARIA where needed, keyboard-navigable controls, sufficient color contrast.

### Adding a Platform
Follow [ADR-0007](ADR.md#adr-0007-adding-a-new-platform-adapter): feature-request issue first → implement behind a feature flag → add platform card to `index.html` + supported-platforms table → tests → docs → ADR if new pattern → CHANGELOG.

---

## 🚫 What Claude Must NOT Do

- ❌ **Never commit secrets, tokens, `.env`, `credentials.json`, or `tokens.json`.** They are gitignored; respect that.
- ❌ **Never store main account passwords.** OAuth tokens / app passwords only.
- ❌ **Never bypass CI, lint, or tests.** Fix failures, don't disable checks.
- ❌ **Never auto-merge PRs.** A human maintainer must approve.
- ❌ **Never delete or rewrite ADRs.** Supersede with a new ADR only.
- ❌ **Never change the license** without a Core Team decision + new ADR.
- ❌ **Never introduce a backend dependency** that stores user data server-side without an ADR.
- ❌ **Never remove security headers** or weaken CSP.
- ❌ **Never `force-push` to `main`** or rewrite protected history.
- ❌ **Don't open public issues for security vulnerabilities** — use private advisories (see [SECURITY.md](SECURITY.md)).
- ❌ **Don't hardcode colors** in CSS/HTML — use the theme variables.
- ❌ **Avoid large, sweeping refactors** without discussion + ADR.

---

## 🔒 Security Rules (Non-Negotiable)

- Credentials → `localStorage` only, scoped per platform, OAuth tokens/app passwords only.
- All platform API calls over **HTTPS**.
- No `eval`, no `innerHTML` with untrusted data (use `textContent` / safe templating).
- Set/keep CSP and security headers when touching deployment config.
- If you touch auth or credential handling, request a security review in the PR.
- Report any discovered vulnerability privately (see [SECURITY.md](SECURITY.md)).

---

## 🧪 Testing Expectations

- Pure logic → unit tests.
- API flows → integration tests with mocked network.
- UI components → snapshot/visual tests.
- Critical journeys → E2E.
- Don't reduce coverage without justification.

---

## 📦 Repo Layout (quick map)

```
index.html          # landing/dashboard (static)
styles.css          # all styles (theme via :root variables)
.github/            # dependabot, funding, issue/PR templates, discussion readme
assets/             # images, social previews
supabase/functions/ # (optional) OAuth proxy edge functions
README.md, usage.md, PRICING.md, CHANGELOG.md, ROADMAP.md, ADR.md,
DEPLOYMENT.md, SUMMARY.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md,
GOVERNANCE.md, SECURITY.md, SUPPORT.md, COPYING.md, CITATIONS.md,
CLAUDE.md, AGENTS.md, todo.md, LICENSE, .gitignore
```

---

## 🧠 When Unsure

- Read the relevant **ADR** — it likely answers "why."
- Check [ROADMAP.md](ROADMAP.md) to see if it's already planned.
- Open a **Discussion** or comment on the issue rather than guessing.
- When in doubt about security → don't ship it; ask for review.

---

## 📝 PR Checklist for Claude

- [ ] Conventional Commits used
- [ ] `npm run lint && npm test && npm run build` pass locally
- [ ] Tests added/updated for behavior changes
- [ ] No secrets/tokens committed
- [ ] CSS uses theme variables (no hardcoded colors)
- [ ] Docs updated (README/usage/wiki/CHANGELOG) if user-facing
- [ ] ADR added if architecturally significant
- [ ] PR template filled, issue linked
- [ ] No auto-merge; awaits human review

---

<div align="center">
  <sub>🤖 <strong>Helpful, harmless, honest — and follows the conventions.</strong></sub>
</div>
