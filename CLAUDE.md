# CLAUDE.md — Project guide for Claude (Anthropic) and other LLM coding agents

> This file gives an LLM coding assistant (Claude, Cursor, Copilot Chat, etc.) the context it needs to work on **Fed-Poster** effectively: architecture, conventions, the hard rules, and the gotchas that will bite you if you skim.

## 0. The 30-Second Pitch

**Fed-Poster** is a privacy-first, browser-native web app that lets a user cross-post one message to **12+ social platforms** from a single dashboard. There is no required backend. Credentials live in `localStorage`; drafts can live in `IndexedDB`. Some platforms (Tumblr, SafeW, DeviantArt OAuth) are bridged through stateless Supabase Edge Functions that **store nothing**. The UI is plain HTML + CSS + vanilla JS (despite the README mentioning React/TS/Tailwind for a future rewrite — **the actual shipped code is vanilla**). It ships under the MIT licence.

Treat this repo as a **static multi-page site with a sprinkle of client-side logic**, not a SPA framework project. Match the existing style; do not introduce React/Vue/Tailwind unless explicitly asked.

## 1. Repository Layout

```
.
├── index.html              # Landing page (hero, features, pricing teaser, CTA)
├── dashboard.*             # Post composer + per-platform tabs (referenced in nav)
├── calendar.html           # Scheduled-post calendar view
├── analytics.html          # Per-platform posting analytics
├── settings.html           # Theme picker, credential management, about panel
├── pricing.html            # Full pricing page (Starter / Growth / Agency / Trial)
├── 404.html                # Branded error page
├── PRICING.md              # Pricing source-of-truth in Markdown
├── README.md  SECURITY.md  CONTRIBUTING.md  CODE_OF_CONDUCT.md
├── ROADMAP.md  ADR.md  DEPLOYMENT.md  CHANGELOG.md  GOVERNANCE.md
├── CLAUDE.md   AGENTS.md   # ← you are here
├── LICENSE                 # MIT
├── styles.css              # Optional standalone stylesheet
├── assets/
│   ├── fedposter.css       # ⭐ Shared design system (CSS variables + 12 themes)
│   ├── fedposter.js        # ⭐ Shared JS (theme persistence, mobile nav, scroll reveal, Discord count)
│   ├── dashboard.css/.js   # Composer + platform panels + multi-post logic
│   ├── calendar.css/.js    # Scheduling UI
│   ├── analytics.css/.js   # Charts/stats
│   ├── settings.css/.js    # Settings + theme picker + credential tools
│   ├── pricing.css         # Pricing page styles
│   └── error.css           # 404 styling
├── .github/                # Issue templates, PR template, funding, codeowners, discussions welcome
└── wiki/                   # Long-form docs mirrored to GitHub Wiki
```

When a user says "the dashboard" they usually mean the composer view that `index.html` links to via `dashboard.html`. If `dashboard.html` is not present, the dashboard logic lives in `assets/dashboard.{js,css}` and may be embedded in another page — **check before assuming**.

## 2. Tech Stack (as actually shipped)

| Layer | What's really in the repo |
|-------|---------------------------|
| Markup | Static HTML5, multi-page, no build step |
| Styling | Hand-written CSS, design-token system via CSS custom properties, 12 themes via `[data-theme="…"]` |
| Scripting | Vanilla JavaScript (ES2015+), IIFE modules, no bundler, no transpiler |
| Fonts | Inter from Google Fonts; Font Awesome 6.5 from cdnjs |
| Storage | `localStorage` for credentials & theme; `IndexedDB` for drafts (where used) |
| Integrations | Direct REST/GraphQL (Telegram, Bluesky, Mastodon, Discord, GitHub); OAuth via Supabase Edge Functions (Tumblr, SafeW, DeviantArt); proxy bridges (Buffer, WordPress Jetpack) |
| Deploy | Static hosting (GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3) or Docker (optional backend) |

**Do not** add npm/build-tooling complexity unless the task explicitly requires it. The "it just opens in a browser" property is a feature.

## 3. The Design System (critical to not break)

All visual consistency flows from `assets/fedposter.css`. Read it before touching styles.

**Tokens** (CSS custom properties on `:root`, overridden per theme):
`--bg-body, --bg-card, --bg-input, --bg-sidebar, --text-primary, --text-secondary, --text-muted, --accent, --accent-hover, --accent-light, --accent-bg, --green, --green-bg, --red, --red-bg, --orange, --orange-bg, --blue, --blue-bg, --shadow-sm, --shadow-md, --shadow-lg, --glow, --radius, --radius-sm, --radius-full, --transition, --font, --sidebar-width`.

**Rules:**
- Always use tokens. Never hardcode hex colors in components — if you reach for a raw color, a token almost certainly exists for it. If you genuinely need a new color, add a token to `:root` **and** to every theme block, then use the token.
- Themes are selected by setting `data-theme` on `<html>`. The 12 themes: `dark` (Deep Space, default), `light` (Cloud), `blue` (Azure Depth), `green` (Emerald Forest), `purple` (Royal Nebula), `orange` (Molten Lava), `cyberpunk`, `sunset`, `ocean` (Abyssal Teal), `rose` (Luxe Blush), `midnight` (Cobalt Steel), `synthwave`.
- Theme persistence is handled in `assets/fedposter.js` via `localStorage.fedposter_theme`. Do not reimplement; reuse `applyTheme()` / `initTheme()` / `buildThemePicker()`.
- New pages must include `fedposter.css` and `fedposter.js` so they inherit the system. Use the shared nav + theme picker markup.
- Border radius: cards use `--radius`, small controls `--radius-sm`, pills/buttons `--radius-full`. Shadows escalate `sm → md → lg`.
- Mobile-first: test any layout change at ≥375px width. The mobile nav toggle is `.nav-toggle` / `.nav-links` (toggle class `open`).

## 4. Credential & Security Rules (hard constraints)

These are non-negotiable. Violating them is a blocker.

1. **Never** write a real token, password, API key, bot token, or OAuth secret into the repo — not in code, not in comments, not in screenshots, not in example strings. Use clearly-fake placeholders like `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11` (Telegram-style) or `your-bot-token-here`.
2. **Never** `console.log` a credential. If debugging, log only `"token set: true"`-style booleans or masked/truncated values.
3. All credential storage keys **must** be namespaced `fedposter_*` (e.g. `fedposter_telegram_token`, `fedposter_bluesky_session`). The theme key is `fedposter_theme`.
4. Never send credentials anywhere except the platform's own documented API endpoint over **HTTPS**. Supabase Edge Functions used for OAuth are stateless proxies; they must not log or persist tokens.
5. When adding a platform, document the **minimum required token scopes** in the platform's panel and in `wiki/` (e.g. GitHub: `gist` only for Gist posting, `repo` only if pushing files).
6. Recommend **app-specific passwords / scoped tokens** in every credential UI. Never ask for a user's main account password.
7. Any change touching auth, storage, or platform requests needs an entry in `CHANGELOG.md` under `[Unreleased]` and a note in the PR describing the security implications.

## 5. Adding a New Platform Integration — Checklist

A common task here. Follow this order:

1. Add the platform to the canonical list in `README.md` (the "Supported Platforms" table) and to `PRICING.md` platform count if it changes.
2. Create the platform panel markup following the existing tab pattern in the dashboard. Use Font Awesome icon + platform name. Wire the credential field(s), message textarea, optional file input, and Test/Send buttons.
3. Implement the send logic in `assets/dashboard.js` (or the appropriate page module). Use `fetch` to the platform's documented API. Handle the 2xx / 4xx / 5xx branches and surface a status message in the panel.
4. Store credentials under `fedposter_<platform>_<field>` in `localStorage`. Auto-save on blur, never on every keystroke (avoid jank).
5. Add the platform to the **multi-post composer** checkbox group so it participates in "select many → send once".
6. Add it to `analytics.js` / `calendar.js` platform arrays so it shows up in stats and scheduling.
7. Document required scopes/credentials in `wiki/<Platform>-Setup.md`.
8. Add a `CHANGELOG.md` entry under `[Unreleased] → Added`.
9. If the platform needs OAuth + a Supabase function, note the function name and that it is stateless.
10. Test in Deep Space + at least one light theme, desktop + one mobile width.

## 6. Coding Conventions

- **Vanilla JS.** No frameworks, no TypeScript (yet), no JSX. IIFE / module pattern is fine; prefer small named functions over deep nesting.
- **No build step.** If you "need" a bundler, reconsider — the static-openable property matters.
- **HTML:** semantic elements (`nav`, `main`, `section`, `article`, `button` not `<div onclick>`), accessible labels, `alt` on images, logical heading order.
- **CSS:** tokens first, then BEM-ish naming (`.platform-panel__header`), no `!important` without a written reason in a comment, mobile-first media queries (`@media (min-width: …)`).
- **JS:** `'use strict'`, `const`/`let` over `var`, early returns, no global pollution, prefer `addEventListener` over inline `on*=` handlers.
- **Formatting:** 2-space indent, single quotes for JS, double quotes for HTML attributes, trailing commas in multi-line arrays/objects. Match the surrounding file.
- **Comments:** explain *why*, not *what*. Keep the header banners that already exist (`/* ==== SECTION ==== */`).

## 7. Testing & QA (there's no formal test suite — be the suite)

Before declaring a change done:
- Open the affected HTML file(s) directly in a browser (no server needed for most things; OAuth/Supabase calls need `http(s)://`).
- DevTools → Console: zero new red errors. Search your diff for stray `console.log`.
- DevTools → Network: no new failing requests, no mixed-content warnings, no calls to non-HTTPS endpoints.
- DevTools → Application → localStorage: confirm any new keys are `fedposter_*` and that clearing them doesn't break the page.
- Visual: test the **Deep Space** theme (default) and at least one other; test at 1440px and at 375px.
- If you touched posting logic: do a real **test post** to a sandbox/private channel where possible, and confirm the success/failure UI behaves.
- Update `CHANGELOG.md` `[Unreleased]`.

## 8. Common Tasks & Where Things Live

| Task | Start here |
|------|-----------|
| Change global look / add a theme | `assets/fedposter.css` (+ `fedposter.js` THEME arrays) |
| Change the landing page | `index.html` (inline page-specific `<style>` is the existing pattern) |
| Add/edit a platform panel | dashboard module (`assets/dashboard.js` + the HTML page hosting it) |
| Scheduling | `calendar.html` + `assets/calendar.{js,css}` |
| Charts/stats | `analytics.html` + `assets/analytics.{js,css}` |
| Settings / theme picker / about | `settings.html` + `assets/settings.{js,css}` |
| Pricing | `pricing.html` + `assets/pricing.css`; keep `PRICING.md` in sync as the source of truth |
| Ko-fi widget | `assets/kofi-widget.js` (loader + `openKofiWidget()`); `data-kofi` attrs on CTA buttons |
| Error pages | `404.html` + `assets/error.css` |

## 9. Docs to Keep In Sync

When you change user-facing behaviour, update the matching doc(s):
- New platform / feature → `README.md`, `CHANGELOG.md`, `wiki/`, maybe `ROADMAP.md`
- Pricing change → `PRICING.md` **and** `pricing.html` (the Markdown is the source of truth)
- Security/auth change → `SECURITY.md`, this file's §4, `CHANGELOG.md`
- Architecture decision → add an ADR in `ADR.md`
- Anything shipped → `CHANGELOG.md` under `[Unreleased]` (move to a version section on release)

## 10. Pull Request Expectations

- Fill in `.github/PULL_REQUEST_TEMPLATE.md` completely.
- No real secrets in the diff.
- Screenshots for **any** visual change.
- A `CHANGELOG.md` `[Unreleased]` entry.
- Tick the "tested in X theme / Y viewport" boxes truthfully.
- Link the related issue / discussion.

## 11. Things That Will Get a PR Rejected Fast

- Hardcoded credentials or `console.log(token)`.
- Introducing a framework/build tool without an approved ADR.
- Raw hex colors instead of design tokens.
- A new localStorage key not prefixed `fedposter_`.
- An HTTP (non-HTTPS) outbound call.
- A visual change with no screenshots.
- A "works on my machine" claim with no test steps.

## 12. Asking for Help

Stuck on platform API quirks, OAuth flow, or theme tokens? Check `wiki/` first, then open a [Discussion → Q&A](https://github.com/fedpromptly/fed-poster/discussions) tagged `contributing`. Maintain existing tone: friendly, privacy-forward, no telemetry, ship simple.
