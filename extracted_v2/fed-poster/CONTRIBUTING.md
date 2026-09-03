# 🤝 Contributing to Fed-Poster

<div align="center">
  <img src="https://img.shields.io/badge/contributions-welcome-brightgreen?style=for-the-badge" alt="Contributions Welcome" />
  <img src="https://img.shields.io/badge/PRs-welcome-blue?style=for-the-badge" alt="PRs Welcome" />
  <img src="https://img.shields.io/badge/first--timers-friendly-orange?style=for-the-badge" alt="First Timers Friendly" />
</div>

First off — **thank you** for taking the time to contribute! 🎉 Fed-Poster is open source under the MIT license, and every contribution makes it better. This document covers everything you need to start contributing effectively.

> 💡 **New here?** Look for issues labeled [`good first issue`](https://github.com/FED-OS/Fed-Poster/labels/good%20first%20issue) and [`help wanted`](https://github.com/FED-OS/Fed-Poster/labels/help%20wanted). We mentor first-time contributors.

---

## 📜 Code of Conduct

Participation in this project is governed by the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to **conduct@fedpromptly.com**.

---

## 🗺️ Ways to Contribute

You don't have to write code to help! Here are many ways to contribute:

| Type            | How                                                                 |
|-----------------|---------------------------------------------------------------------|
| 🐛 Bugs          | Open a [bug report](.github/ISSUE_TEMPLATE/bug_report.md)           |
| ✨ Features       | Propose a [feature request](.github/ISSUE_TEMPLATE/feature_request.md) |
| 📝 Docs           | Improve README, wiki, ADRs, or code comments                        |
| 🎨 Design         | Improve UI/UX, styles.css, social previews, branding                |
| 🌐 Translations   | Help localize the dashboard                                          |
| 🧪 Testing        | Write or improve tests, report flaky behavior                        |
| 🔌 Integrations   | Add a new platform adapter (see ADR-0007)                            |
| 💬 Discussions    | Answer questions in Discussions, review PRs                          |
| 💰 Sponsor        | See [.github/FUNDING.yml](.github/FUNDING.yml)                       |

---

## 🚀 Quick Start (Development Setup)

### Prerequisites

- **Node.js** 20.x or later (`node -v`)
- **npm** 10.x+ (or pnpm / yarn)
- **Git**
- A modern browser (Chromium-based recommended)
- *(Optional)* A Supabase project for OAuth flows (Tumblr, SafeW, DeviantArt)

### 1. Fork & Clone

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/<your-username>/Fed-Poster.git
cd Fed-Poster
git remote add upstream https://github.com/FED-OS/Fed-Poster.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the Dev Server

```bash
npm run dev
# → http://localhost:5173 (or port shown in console)
```

### 4. Run the Static Build

```bash
npm run build
npm run preview
```

### 5. Run Tests & Lint

```bash
npm test          # unit + integration
npm run lint      # eslint + stylelint
npm run format    # prettier (write)
npm run typecheck # tsc --noEmit
```

> 🔑 **No credentials needed for dev.** The app uses mock data when no tokens are present. Never commit real tokens — see [SECURITY.md](SECURITY.md).

---

## 🌿 Branching & Commit Convention

### Branch Naming

Use lowercase, kebab-case, prefixed by type:

```
feature/<short-description>      # e.g. feature/bluesky-video-upload
fix/<short-description>          # e.g. fix/telegram-rate-limit
docs/<short-description>         # e.g. docs/readme-pricing-update
chore/<short-description>        # e.g. chore/upgrade-deps
refactor/<short-description>
test/<short-description>
```

### Commit Messages (Conventional Commits)

We follow the [Conventional Commits](https://www.conventionalcommits.org/) spec. Each commit message:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

**Examples:**

```
feat(mastodon): add audio attachment support
fix(zapier): correct payload encoding for unicode emoji
docs(roadmap): update Q3 milestones
chore(deps): bump vite to 5.x
```

> 🪝 Commits are linted automatically via commitlint + husky. The [CHANGELOG.md](CHANGELOG.md) is generated from these messages.

---

## 🧹 Code Style

- **Format:** Prettier (default config). Run `npm run format`.
- **Lint:** ESLint (TS) + Stylelint (CSS). Run `npm run lint`.
- **Type safety:** No `any` without a comment explaining why. Strict mode on.
- **Naming:** `camelCase` for variables/functions, `PascalCase` for components/types, `SCREAMING_SNAKE_CASE` for constants, `kebab-case` for files & CSS classes.
- **CSS:** All styles live in `styles.css` (or scoped component CSS). Use the CSS custom properties defined in `:root` — do not hardcode colors.
- **Comments:** Explain *why*, not *what*. Keep public APIs documented with JSDoc/TSDoc.

---

## 🧪 Testing Requirements

All code changes should include appropriate tests:

- **Unit tests** for pure logic (utilities, adapters, parsers).
- **Integration tests** for API flows (mock the network).
- **Visual/snapshot tests** for UI components.
- **E2E tests** for critical user journeys (login → compose → post).

```bash
npm test -- --coverage   # aim to maintain or increase coverage
```

> ✅ PRs that reduce coverage without justification may be requested to add tests.

---

## 🔌 Adding a New Platform Integration

Adding a platform is a great contribution. Please follow the process documented in [ADR-0007 — Adding a New Platform Adapter](ADR.md#adr-0007-adding-a-new-platform-adapter). In short:

1. Open a feature request issue first to discuss the integration.
2. Implement the adapter behind a feature flag.
3. Add a platform card to `index.html` and the supported-platforms table.
4. Add tests and update [usage.md](usage.md) and the wiki.
5. Document any new secrets in `.env.example`.

---

## 📤 Pull Request Process

1. **Sync with upstream:** `git fetch upstream && git rebase upstream/main`.
2. **Create a branch** from `main` (not from your fork's main).
3. **Write clear commits** following Conventional Commits.
4. **Run all checks locally:** `npm run lint && npm test && npm run build`.
5. **Open a PR** using the [Pull Request Template](.github/PULL_REQUEST_TEMPLATE.md).
6. **Link the issue** (e.g. `Closes #123`) in the PR description.
7. **Respond to review feedback** promptly and respectfully.
8. **Keep your branch updated** with `main` until merged.

### PR Checklist

- [ ] My code follows the style guidelines (lint passes)
- [ ] I have run `npm test` and added tests for new behavior
- [ ] I have updated documentation where relevant (README, usage, wiki)
- [ ] I have added a CHANGELOG entry if user-facing
- [ ] I have NOT committed secrets, tokens, or `.env` files
- [ ] My commits follow Conventional Commits
- [ ] I have linked the related issue

### Review Process

- A maintainer will review within **~3 business days**.
- At least **one approval** is required for merge (two for large changes).
- We use **Squash & Merge** to keep history clean.
- CI must be green before merge.

---

## 🏷️ Issue & PR Labels

| Label               | Meaning                                            |
|---------------------|----------------------------------------------------|
| `good first issue`  | Beginner-friendly, mentors available               |
| `help wanted`       | Extra attention / contribution welcome             |
| `bug`               | Confirmed defect                                   |
| `enhancement`       | New feature or improvement                         |
| `documentation`     | Docs-only change                                   |
| `platform: <name>`  | Specific platform integration                      |
| `security`          | Security-related (use private advisory instead!)   |
| `blocked`           | Waiting on an external dependency                  |
| `wontfix`           | Will not be addressed                              |
| `duplicate`         | Already reported                                   |

---

## 🏆 Recognition

All contributors are valued. We:

- List contributors in the README and release notes.
- Award a `Contributor` role in Discussions.
- Offer `Triager` / `Maintainer` roles for consistent contributors (see [GOVERNANCE.md](GOVERNANCE.md)).
- Provide swag for significant contributions when available.

---

## ❓ Need Help?

- 💬 Open a [Discussion](https://github.com/FED-OS/Fed-Poster/discussions)
- 📧 Email **business@fedpromptly.com**
- 🐛 File an [issue](https://github.com/FED-OS/Fed-Poster/issues)

---

<div align="center">
  <sub>🎉 <strong>Happy hacking, and thanks for building Fed-Poster with us!</strong></sub>
</div>
