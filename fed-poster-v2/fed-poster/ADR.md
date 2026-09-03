# 🏗️ Architecture Decision Records (ADRs)

<div align="center">
  <img src="https://img.shields.io/badge/ADRs-architecture%20decisions-blueviolet?style=for-the-badge" alt="ADRs" />
  <img src="https://img.shields.io/badge/format-MADR%20light-purple?style=for-the-badge" alt="MADR light" />
</div>

This file records the architecturally significant decisions made in Fed-Poster: what we decided, why, and what alternatives we considered. ADRs are immutable once accepted — they can only be **superseded** by a new ADR. This keeps our history legible and prevents "why did we do this?" mysteries.

> Format inspired by [MADR (Markdown Any Decision Records)](https://adr.github.io/madr/) — lightweight variant.

---

## 📑 Index

| #     | Title                                          | Status   | Date       |
|-------|------------------------------------------------|----------|------------|
| 0001  | Record architecture decisions in ADRs          | Accepted | 2026-08-25 |
| 0002  | Adopt MIT license                              | Accepted | 2026-08-25 |
| 0003  | Browser-first architecture with optional edge functions | Accepted | 2026-08-25 |
| 0004  | Store credentials in `localStorage` (OAuth tokens only) | Accepted | 2026-08-25 |
| 0005  | Use Supabase Edge Functions for OAuth proxies  | Accepted | 2026-08-25 |
| 0006  | Extend reach via Zapier instead of bespoke adapters | Accepted | 2026-08-25 |
| 0007  | Adding a new platform adapter                  | Accepted | 2026-08-25 |
| 0008  | Extract CSS into `styles.css`                  | Accepted | 2026-08-25 |
| 0009  | Conventional Commits + auto-generated changelog | Accepted | 2026-08-25 |
| 0010  | AI-assisted development via CLAUDE.md & AGENTS.md | Accepted | 2026-08-25 |

---

## ADR-0001: Record architecture decisions in ADRs

- **Status:** Accepted
- **Date:** 2026-08-25

### Context
As Fed-Poster grows and gains contributors, the rationale behind architectural choices will be forgotten. Future maintainers (human and AI) need context to make consistent decisions and avoid re-litigating settled debates.

### Decision
We record architecturally significant decisions as ADRs in this file, using a lightweight MADR-inspired format. ADRs are append-only; supersession requires a new ADR.

### Consequences
- + Decisions are transparent and auditable.
- + Onboarding is faster (new contributors read the "why").
- − Requires discipline to write ADRs for non-trivial decisions.

---

## ADR-0002: Adopt MIT license

- **Status:** Accepted
- **Date:** 2026-08-25

### Context
Fed-Poster needs a license that maximizes adoption, permits commercial use, and is well-understood. Considered MIT, Apache-2.0, and AGPL-3.0.

### Decision
Adopt the **MIT License**. It is permissive, short, widely recognized, and compatible with commercial and proprietary use.

### Alternatives Considered
- **Apache-2.0:** Adds patent grant complexity; overkill for a client-side tool.
- **AGPL-3.0:** Strong copyleft would deter agencies/white-label users; conflicts with the self-hosted commercial offering.

### Consequences
- + Broad adoption, easy integration into proprietary products.
- + No patent-clause friction.
- − No strong copyleft protection against proprietary forks (acceptable trade-off).

---

## ADR-0003: Browser-first architecture with optional edge functions

- **Status:** Accepted
- **Date:** 2026-08-25

### Context
We want Fed-Poster to be runnable with zero backend (full client-side) for privacy and self-hosting simplicity, while supporting platforms that require server-side OAuth token exchange.

### Decision
Make the **browser the primary runtime**. Direct-API platforms (Telegram, Bluesky, Mastodon, Discord, GitHub) call platform APIs from the client. Platforms requiring server-side OAuth (Tumblr, SafeW, DeviantArt) use optional **Supabase Edge Functions** as stateless proxies.

### Consequences
- + Credentials stay client-side by default → strong privacy story.
- + Minimal infra to self-host.
- − CORS and platform API limitations constrain which integrations can be purely client-side.

---

## ADR-0004: Store credentials in `localStorage` (OAuth tokens only)

- **Status:** Accepted
- **Date:** 2026-08-25

### Context
Direct integrations need to persist credentials between sessions without a backend account system.

### Decision
Store OAuth tokens and app passwords in the browser's `localStorage`, scoped per platform. **Never store main account passwords.** Document the security trade-offs in `SECURITY.md` and provide a self-hosting hardening checklist.

### Consequences
- + Zero-backend account system; instant onboarding.
- + Data never leaves the user's machine unless posting.
- − `localStorage` is accessible to XSS; requires CSP and careful dependency management.
- − Not suitable for shared/public computers (documented warning).

---

## ADR-0005: Use Supabase Edge Functions for OAuth proxies

- **Status:** Accepted
- **Date:** 2026-08-25

### Context
Tumblr, SafeW, and DeviantArt require server-side OAuth flows that can't run purely in-browser.

### Decision
Use **Supabase Edge Functions** as stateless OAuth token-exchange proxies. They hold only the OAuth client secret (not user data), perform the exchange, and return tokens to the client. No user data is persisted server-side.

### Alternatives Considered
- A bespoke Node/Express backend — more to host and secure.
- Cloudflare Workers — viable alternative; Supabase chosen for ecosystem fit.

### Consequences
- + Managed, cheap, globally distributed.
- + Stateless → minimal attack surface.
- − Introduces a Supabase dependency for those integrations.

---

## ADR-0006: Extend reach via Zapier instead of bespoke adapters

- **Status:** Accepted
- **Date:** 2026-08-25

### Context
Building and maintaining bespoke adapters for hundreds of niche platforms is unsustainable for a small open-source team.

### Decision
Provide ~20 high-value **direct integrations** and reach 450+ additional platforms by emitting events to **Zapier**, letting users connect their own Zapier account. Direct adapters are added only for high-demand platforms (see ADR-0007).

### Consequences
- + Massive platform coverage without per-adapter maintenance.
- + Users keep control of their Zapier automations.
- − Users need a Zapier account and may consume tasks per post.

---

## ADR-0007: Adding a new platform adapter

- **Status:** Accepted
- **Date:** 2026-08-25

### Context
Contributors will want to add new direct platform integrations. We need a predictable, safe process.

### Decision
To add a platform adapter:
1. **Open a feature request** describing the platform, its API model (direct/OAuth/proxy), and use case.
2. **Maintainer discussion** — confirm it warrants a direct adapter (vs. Zapier per ADR-0006).
3. **Implement behind a feature flag** with a standard adapter interface (auth → compose → publish → status).
4. **Add a platform card** to `index.html` and update the supported-platforms table + [usage.md](usage.md) + wiki.
5. **Add tests** (unit + integration with mocked network) and document any new secrets in `.env.example`.
6. **Record an ADR** if the integration introduces a new architectural pattern.
7. **Update CHANGELOG** as `feat(<platform>): ...`.

### Consequences
- + Consistent, reviewable integrations.
- + Feature flags allow safe rollout.
- − Slight process overhead; justified by quality.

---

## ADR-0008: Extract CSS into `styles.css`

- **Status:** Accepted
- **Date:** 2026-08-25

### Context
The landing page embedded ~1000 lines of CSS inline in `index.html`, making theming and maintenance harder.

### Decision
Move all styles to an external `styles.css`, linked from `index.html`, using the existing `:root` CSS custom properties as the theming API.

### Consequences
- + Easier theming (one file, clear custom properties).
- + Better caching and separation of concerns.
- + Enables future light/dark theme toggle via CSS variables.
- − Slightly more files to manage (negligible).

---

## ADR-0009: Conventional Commits + auto-generated changelog

- **Status:** Accepted
- **Date:** 2026-08-25

### Context
We need a predictable commit history and a low-effort, accurate changelog.

### Decision
Adopt [Conventional Commits](https://www.conventionalcommits.org/) enforced via commitlint + husky. Generate the [CHANGELOG.md](CHANGELOG.md) from commit history (manual curation for releases). See [CONTRIBUTING.md](CONTRIBUTING.md).

### Consequences
- + Semantic, scannable history.
- + Auto-changelog with minimal manual effort.
- − Contributors must learn the format (enforced by tooling + templates).

---

## ADR-0010: AI-assisted development via CLAUDE.md & AGENTS.md

- **Status:** Accepted
- **Date:** 2026-08-25

### Context
AI coding agents (Claude and others) increasingly contribute to open source. We want them to follow project conventions and not introduce regressions.

### Decision
Maintain `CLAUDE.md` (project guidance for Claude) and `AGENTS.md` (general agent protocol) at the repo root. Both define conventions, boundaries, and required checks. AI contributions follow the same review process as human contributions.

### Consequences
- + Faster, convention-aware AI contributions.
- + Clear boundaries (no auto-merge, tests required, security rules).
- − Requires keeping the agent guides in sync with project conventions.

---

## 📝 How to Add a New ADR

1. Number it sequentially (e.g., `ADR-0011`).
2. Use the format above: Context → Decision → Alternatives (optional) → Consequences.
3. Set status to `Proposed`, then move to `Accepted`/`Superseded`/`Deprecated` as it evolves.
4. Add an entry to the **Index** table.
5. Link related ADRs where relevant.
6. A superseding ADR should reference the one it replaces.

### Statuses
- `Proposed` — under discussion.
- `Accepted` — ratified and active.
- `Deprecated` — no longer relevant, not replaced.
- `Superseded` — replaced by a later ADR (link it).

---

<div align="center">
  <sub>🏗️ <strong>Decisions worth recording are decisions worth remembering.</strong></sub>
</div>
