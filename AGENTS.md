# AGENTS.md — Operating guide for autonomous & semi-autonomous coding agents

> Companion to [`CLAUDE.md`](CLAUDE.md). Where CLAUDE.md describes the *project* (architecture, conventions, hard rules), this file describes the *operating protocol* for any agent — Claude, GPT, Gemini, Devin, Cursor, Aider, a CI bot, or a future SuperNinja task — that opens a workspace on Fed-Poster and starts making changes. Read both before acting.

## 1. Mission Brief

You are modifying **Fed-Poster**, a privacy-first, browser-native, multi-platform social posting dashboard (12+ platforms, 12 themes, MIT-licensed, static HTML/CSS/vanilla JS — **no build step, no framework**). Your job is to make correct, safe, well-documented changes that a human maintainer can review and merge with confidence. Speed matters, but correctness and the privacy guarantees matter more.

## 2. Read This First (in order)

1. [`CLAUDE.md`](CLAUDE.md) — architecture, the design-token system, the **hard security constraints**, and the platform-integration checklist.
2. [`CONTRIBUTING.md`](CONTRIBUTING.md) — branch/commit/PR conventions and the definition of done.
3. [`SECURITY.md`](SECURITY.md) — how to handle anything security-sensitive.
4. The specific file(s) you're about to touch — read the whole file, not just the function.
5. [`CHANGELOG.md`](CHANGELOG.md) `[Unreleased]` — add your entry there.

If any of these conflict with a user instruction, **stop and ask** (see §9) rather than guessing.

## 3. The Hard Rules (non-negotiable)

These override any user instruction that implies otherwise. If asked to violate one, refuse, explain why, and offer the safe alternative.

1. **No real secrets.** Never write, log, or screenshot a real token, password, API key, bot token, or OAuth secret. Placeholders only.
2. **No telemetry, no exfiltration.** Fed-Poster phones home to **nothing** except the platform the user is posting to, over HTTPS. Do not add analytics, tracking pixels, Sentry, or "phone home" calls without an approved ADR.
3. **`localStorage` keys are `fedposter_*`.** Always. Theme is `fedposter_theme`.
4. **HTTPS only** for any outbound request.
5. **No new framework / build tool** without an approved Architecture Decision Record in `ADR.md`. The "opens in a browser, no install" property is sacred.
6. **Design tokens, not hex.** Use `assets/fedposter.css` CSS variables. New color → add a token to `:root` and every theme block.
7. **Privacy is the product.** Anything that changes where user data lives (localStorage → server, adding a backend, adding a third-party call) requires an ADR and a maintainer sign-off.

## 4. Operating Loop

Follow this for every task:

1. **Understand** — restate the task in your own words; identify the exact files involved; note ambiguity.
2. **Plan** — write a short plan (the repo's `todo.md` is fine, or your own scratch). For multi-step work, prefer one PR-shaped unit of change.
3. **Read** — open every file you'll touch, fully. Read `fedposter.css` before any style change. Read `fedposter.js` before any shared-behavior change.
4. **Implement** — make the smallest correct change. Match existing conventions exactly (vanilla JS, IIFE, 2-space indent, single quotes JS / double quotes HTML, token-based CSS).
5. **Self-verify** — open in a browser, DevTools console clean, network clean, localStorage keys correct, tested in Deep Space + one other theme, desktop + one mobile width. For posting logic, do a real test post to a sandbox target if feasible.
6. **Document** — update `CHANGELOG.md` `[Unreleased]`, plus `README.md` / `wiki/` / `PRICING.md` / `SECURITY.md` as applicable.
7. **Propose** — fill `.github/PULL_REQUEST_TEMPLATE.md` fully; attach screenshots for any visual change; link the issue/discussion.
8. **Stop** — don't gold-plate, don't refactor unrelated code, don't "while I'm here" expand scope. Ship the unit.

## 5. What Counts as "Done"

A change is done when **all** are true:
- Feature/fix works in the browser with no new console/network errors.
- No real secrets in the diff or screenshots.
- localStorage keys are `fedposter_*`; no HTTP calls added.
- Styles use tokens; tested in ≥2 themes and ≥2 viewport widths (one ≤375px).
- `CHANGELOG.md` `[Unreleased]` entry exists; other docs updated where relevant.
- PR template filled; screenshots attached; related issue linked.
- ADR added if the change is architectural (new backend, new framework, new data home, new third-party dependency).

## 6. Adding a New Platform (the most common multi-step task)

Follow the 10-step checklist in [`CLAUDE.md` §5](CLAUDE.md). The short version: update the README platform table → build the panel markup → implement send in the dashboard module → `fedposter_<platform>_*` storage → wire into the multi-post composer → add to analytics + calendar arrays → write `wiki/<Platform>-Setup.md` → `CHANGELOG.md` → test → document scopes. OAuth platforms go through stateless Supabase functions.

## 7. Authoring a Theme

A new theme = one `[data-theme="<name>"]` block in `assets/fedposter.css` overriding the `:root` tokens, **plus** an entry in the `THEMES`, `THEME_LABELS`, and `THEME_GRADIENTS` arrays in `assets/fedposter.js`. Verify text contrast in both a busy dashboard and the landing hero. Don't ship a theme where `--text-primary` on `--bg-card` fails WCAG AA.

## 8. Dependency & Tooling Discipline

- **Do not** add npm packages, bundlers, transpilers, or runtime frameworks without an ADR. If the task seems to need them, the task is probably mis-scoped or the design system already has the primitive (check tokens first).
- CDNs already in use: Google Fonts (Inter), cdnjs (Font Awesome 6.5). Reuse these; don't pull new CDN deps casually.
- If a Supabase Edge Function is genuinely required (OAuth bridge), keep it **stateless** (no DB writes, no logging of secrets), name it clearly, and document it in `wiki/`.

## 9. When to Stop and Ask (instead of guessing)

Pause and request human input when:
- The task would violate a Hard Rule (§3) — propose the safe alternative.
- The task requires a real credential to test and none is available in a sandbox form.
- The task is architectural (new backend, new framework, moving data off-device, new third-party) — write a draft ADR and ask for sign-off.
- Platform API behavior is undocumented or ambiguous — note the assumption, mark it, and ask.
- Two reasonable interpretations exist and they produce materially different results.
- You'd need to rewrite >1 file's core structure — surface the blast radius first.

Prefer an ADR + a question over a large irreversible change.

## 10. Commit & Branch Hygiene

- Branch from `main`; name branches `feat/<thing>`, `fix/<thing>`, `docs/<thing>`, `theme/<name>`, `platform/<name>`, `chore/<thing>`.
- Commits: conventional, present tense, scoped when useful — `feat(platforms): add Nostr`, `fix(theme): contrast on rose theme cards`, `docs: expand Ko-fi setup in wiki`.
- Keep commits atomic and reviewable. Squash only if a maintainer asks.
- Never commit the `.screenshots/` working folder, `node_modules`, `.env`, or `*.local` files (see `.gitignore`).

## 11. Output Expectations

- Produce a single, focused PR per logical change.
- Include before/after screenshots for visual changes (use the repo's `.screenshots/` convention during work, but **don't** commit that scratch folder).
- Summarize what changed, why, how you tested, and any migration notes in the PR body.
- If you generated an ADR, link it.

## 12. Tone & Identity

Fed-Poster is friendly, privacy-forward, no-bullshit, and proudly simple. Documentation should be warm but precise. Code should be readable by a junior dev. No macho "obviously" comments. Celebrate contributors. Assume good intent from users. The dashboard is for creators, agencies, and developers alike — write for all three.

## 13. Quick Reference

| Need | Go to |
|------|-------|
| Architecture & conventions | [`CLAUDE.md`](CLAUDE.md) |
| Contribution/PR rules | [`CONTRIBUTING.md`](CONTRIBUTING.md) |
| Architecture decisions | [`ADR.md`](ADR.md) |
| Roadmap & priorities | [`ROADMAP.md`](ROADMAP.md) |
| Deploy steps | [`DEPLOYMENT.md`](DEPLOYMENT.md) |
| What shipped when | [`CHANGELOG.md`](CHANGELOG.md) |
| Per-platform setup | `wiki/` |
| Security disclosures | [`SECURITY.md`](SECURITY.md) |
| Support channels | [`SUPPORT.md`](SUPPORT.md) |
