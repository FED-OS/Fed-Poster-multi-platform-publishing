# 🤖 AGENTS.md — General AI-Agent Protocol

<div align="center">
  <img src="https://img.shields.io/badge/protocol-AGENTS-5b8def?style=for-the-badge" alt="AGENTS" />
  <img src="https://img.shields.io/badge/applies%20to-any%20coding%20agent-blueviolet?style=for-the-badge" alt="Any agent" />
</div>

This file defines a **provider-agnostic protocol** for any AI coding agent (Claude, GPT/Copilot, Cursor, Aider, Devin, local agents, etc.) contributing to **Fed-Poster**. It complements [CLAUDE.md](CLAUDE.md) (Claude-specific) and [CONTRIBUTING.md](CONTRIBUTING.md) (human contributors). All agents — regardless of vendor — must follow these rules.

> 🤝 Agent contributions are contributions. They go through the same review, CI, and security process as human contributions.

---

## 1. Read Before You Act

Before making changes, read:
1. [README.md](README.md) — what the project is.
2. [AGENTS.md](AGENTS.md) (this file) + [CLAUDE.md](CLAUDE.md) — agent rules.
3. [SECURITY.md](SECURITY.md) — security boundaries.
4. [ADR.md](ADR.md) — architectural decisions relevant to your task.
5. [CONTRIBUTING.md](CONTRIBUTING.md) — process & conventions.
6. The specific files you intend to change.

Do not guess at project structure. Verify with file reads.

---

## 2. Boundaries (Hard Rules)

### Secrets & Security
- Never commit `.env`, tokens, credentials, API keys, or private keys.
- Never store user passwords — OAuth tokens / app passwords only, in `localStorage`.
- Never weaken or remove security headers / CSP.
- Never open public issues for security vulnerabilities — use private advisories.
- All network calls must use HTTPS.

### Repository Integrity
- Never force-push to `main` or rewrite protected history.
- Never delete or silently rewrite ADRs — supersede with a new ADR.
- Never change the license without Core Team approval + ADR.
- Never bypass CI, lint, or tests. Fix failures; don't disable checks.
- Never auto-merge your own PR. A human maintainer must approve.

### Scope
- Make minimal, focused changes. One concern per PR.
- No large refactors or framework swaps without a discussion + ADR.
- No new backend that stores user data server-side without an ADR.

---

## 3. Conventions

| Area        | Rule                                                                 |
|-------------|----------------------------------------------------------------------|
| Commits     | [Conventional Commits](https://www.conventionalcommits.org/): `feat(scope):`, `fix(scope):`, `docs:`, `chore:`, etc. |
| Branches    | `feature/`, `fix/`, `docs/`, `chore/`, `refactor/`, `test/` + kebab-case description |
| Files       | `kebab-case` for filenames & CSS classes                             |
| Code        | `camelCase` vars/functions, `PascalCase` types/components, `SCREAMING_SNAKE_CASE` constants |
| CSS         | Use `:root` custom properties in `styles.css`. **No hardcoded colors.** |
| JS          | No `eval`. No `innerHTML` with untrusted input (use `textContent` / safe templating). |
| Docs        | Update README/usage/wiki/CHANGELOG for user-facing changes.          |
| ADRs        | Add an ADR for any architecturally significant decision.             |

---

## 4. Required Workflow

1. **Clarify the task.** If requirements are ambiguous, ask (open a Discussion or comment on the issue) rather than guessing.
2. **Plan.** State your approach briefly (in the PR description or issue comment).
3. **Implement** following conventions.
4. **Verify locally:** run lint, tests, and build. All must pass.
5. **Test:** add/update tests for behavior changes. Don't reduce coverage without justification.
6. **Document** user-facing changes.
7. **Open a PR** using [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md). Link the issue with `Closes #N`.
8. **Respond to review** politely and promptly. Adjust and re-request review.
9. **Stop at merge.** Do not merge your own PR.

---

## 5. Adding a Platform Integration

Follow [ADR-0007](ADR.md#adr-0007-adding-a-new-platform-adapter). Summary:
1. Feature-request issue first (don't start coding a new platform without discussion).
2. Implement behind a feature flag with the standard adapter interface.
3. Add the platform card to `index.html` + update the supported-platforms table, [usage.md](usage.md), and the wiki.
4. Add tests + document any new secrets in `.env.example`.
5. Add an ADR if it introduces a new architectural pattern.
6. CHANGELOG entry: `feat(<platform>): ...`.

---

## 6. Communication Style

- Be concise and factual in issues/PRs.
- Reference ADRs and docs by name/link.
- Disclose that a change was AI-assisted in the PR description (transparency).
- If you're unsure, say so and ask — don't fabricate.
- Never claim a human wrote AI-generated content.

---

## 7. Failure Modes to Avoid

- ❌ Hallucinating APIs, file paths, or project structure — verify by reading.
- ❌ "Fixing" lint/test failures by disabling them.
- ❌ Inventing a new coding style instead of matching the codebase.
- ❌ Hardcoding colors/secrets/URLs.
- ❌ Large PRs mixing concerns.
- ❌ Merging without human approval.
- ❌ Editing security-critical code without requesting review.

---

## 8. Self-Check Before Opening a PR

- [ ] I read README, AGENTS.md, SECURITY.md, and relevant ADRs.
- [ ] Commits follow Conventional Commits.
- [ ] Branch is named per convention and based on `main`.
- [ ] Lint, tests, and build pass locally.
- [ ] Tests added/updated for behavior changes.
- [ ] No secrets/tokens committed.
- [ ] CSS uses theme variables; no hardcoded colors.
- [ ] Docs + CHANGELOG updated if user-facing.
- [ ] ADR added if architecturally significant.
- [ ] PR template filled, issue linked.
- [ ] I will NOT merge this PR myself.

---

## 9. Relationship to CLAUDE.md

`CLAUDE.md` provides Claude-specific guidance; `AGENTS.md` is the universal baseline. Where they differ, `AGENTS.md` defines the minimum bar all agents must meet, and `CLAUDE.md` may add Claude-specific detail. **The stricter rule wins.**

---

<div align="center">
  <sub>🤖 <strong>Any agent, any vendor — same rules, same review, same respect for the project.</strong></sub>
</div>
