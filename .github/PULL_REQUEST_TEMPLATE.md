<!--
  Thank you for contributing to Fed-Poster! 🎉
  Please fill in every section below. PRs that skip sections may be
  returned for revision before review. A maintainer will review within ~72h.
-->

## 📝 Summary

<!-- One or two sentences: what does this PR do and why? -->

## 🔗 Related Issue

<!-- "Closes #123", "Refs #45", or "N/A — discussion #12". Linking helps automation. -->

## 🧭 Type of Change

<!-- Check all that apply -->
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature / new platform integration (non-breaking)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to change)
- [ ] 🎨 UI / theme / visual polish
- [ ] ♻️  Refactor (no functional change, no API change)
- [ ] ⚡ Performance improvement
- [ ] 📚 Documentation only (README, wiki, CONTRIBUTING, templates)
- [ ] 🔒 Security fix
- [ ] 🧪 Test addition / improvement
- [ ] 🏗️ Build / CI / tooling

## 📸 Screenshots / Recordings

<!-- For ANY visual, theme, layout, or dashboard change — attach before/after.
     Theme changes: show the affected theme in BOTH light and dark contexts if relevant.
     New platform: show the platform panel + a successful test post. -->

## ✅ Checklist

<!-- Tick each box. If something doesn't apply, tick it and add "(N/A)" with a short note. -->
- [ ] My code follows the [CONTRIBUTING.md](../CONTRIBUTING.md) style guide (no inline styles where a CSS class exists, semantic HTML, Inter font stack)
- [ ] I have NOT hardcoded any real API tokens, bot tokens, or credentials anywhere in the diff
- [ ] localStorage keys I introduced are namespaced under `fedposter_*`
- [ ] Any new platform integration uses HTTPS only and documents required token scopes
- [ ] I tested the change on **desktop Chrome** and at least one **mobile viewport** (≥375px)
- [ ] I tested in at least the default **Deep Space** theme and one other theme
- [ ] I ran `npx prettier --write` (or matched existing formatting) on changed files
- [ ] I updated the relevant docs: [ ] README  [ ] CHANGELOG  [ ] usage.md  [ ] wiki  [ ] none needed
- [ ] I added/updated an entry in `CHANGELOG.md` under `[Unreleased]`
- [ ] No new ESLint/console warnings introduced (search diff for `console.log` you didn't intend)

## 🧪 How I Tested

<!-- Steps so a reviewer can reproduce the happy path.
     e.g. "1) Open index.html 2) Open DevTools → Application → localStorage 3) Add a fake Telegram token 4) …" -->

## ⚠️ Breaking Changes & Migration

<!-- If breaking: list every affected file/API/localStorage key and how users migrate.
     If NOT breaking, write "None." -->

## 📦 Deployment Notes

<!-- Anything a maintainer needs to know before merging to main / deploying?
     Env vars, Supabase function deploys, DNS, cache bust, etc. Otherwise "None." -->

## 🙏 Notes for Reviewers

<!-- Optional: areas you're unsure about, things you'd like feedback on, or a heads-up. -->
