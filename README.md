<img width="2560" height="1440" alt="fed-poster-fun-music-festival" src="https://github.com/user-attachments/assets/5685cee2-97ef-43c2-8638-2d35a861dc86" />

<div align="center">

<img src="https://img.shields.io/badge/status-active-success?style=for-the-badge" alt="Status" />
<img src="https://img.shields.io/badge/platforms-12%2B-blue?style=for-the-badge" alt="Platforms" />
<img src="https://img.shields.io/badge/license-MIT-yellow?style=for-the-badge" alt="License" />
<img src="https://img.shields.io/badge/made%20with-❤️-red?style=for-the-badge" alt="Made with love" />
<img src="https://img.shields.io/badge/version-1.x-brightgreen?style=for-the-badge" alt="Version" />
<img src="https://img.shields.io/badge/build%20step-none-orange?style=for-the-badge" alt="No build step" />

<br />

<h1>📨 Fed-Poster &nbsp; 
  
  [![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/W3T61ZU5FS)</h1>

<p><strong>One Dashboard. Twelve Platforms. Zero Hassle.</strong></p>

<p>Cross-post to Telegram, Bluesky, Mastodon, Discord, GitHub, Tumblr, DeviantArt, SafeW & more — all from a single, sleek interface. Privacy-first, browser-native, no required backend.</p>

<br />

<a href="#installation"><img src="https://img.shields.io/badge/🚀_Get_Started-Install_now-green?style=for-the-badge" alt="Get Started" /></a>
<a href="#pricing"><img src="https://img.shields.io/badge/💰_Pricing-View_Plans-blue?style=for-the-badge" alt="Pricing" /></a>
<a href="usage.md"><img src="https://img.shields.io/badge/📖_Usage-Guide-purple?style=for-the-badge" alt="Usage Guide" /></a>
<a href="https://github.com/fedpromptly/fed-poster/discussions"><img src="https://img.shields.io/badge/💬_Discussions-Join_us-9cf?style=for-the-badge" alt="Discussions" /></a>

</div>

---

## ✨ Why Fed-Poster?

Tired of juggling tabs, APIs, and credentials for every social platform? **Fed-Poster** brings everything together in one clean dashboard. Write once, select your platforms, and hit send — your content reaches your audience everywhere, instantly. And because it runs entirely in your browser with no required backend, your credentials never leave your device unless you're actively posting.

> **12 Social Networks** • **Auto-saved Credentials** • **File Uploads** • **Proxy Support** • **12 Built-in Themes** • **No Verification Required** • **No Telemetry**

### The privacy promise, by architecture

Most social-posting tools are SaaS: you hand them your tokens, they store them on a server, and they post on your behalf. Fed-Poster inverts that. Your tokens live in your browser's `localStorage`, posts go directly from your browser to each platform over HTTPS, and the only server-side components are **stateless** OAuth bridges that store nothing. You can read every line of the source, open DevTools, and watch exactly where your data goes. Privacy is a property of the architecture (see [`ADR-001`](ADR.md#adr-001)), not a sentence in a policy.

---

## 🚀 Supported Platforms

| Platform | Type | Media | Status |
|----------|------|-------|--------|
| **Telegram** | Direct | 📷 🎥 | ✅ |
| **Bluesky** | Direct | 🖼️ | ✅ |
| **Mastodon** | Direct | 📷 🎥 🎵 | ✅ |
| **Discord** | Direct (webhook) | — | ✅ |
| **GitHub (Classic)** | Gist | — | ✅ |
| **GitHub (Repo)** | File Push | — | ✅ |
| **Tumblr** | OAuth | — | ✅ |
| **DeviantArt** | OAuth | 🖼️ | ✅ |
| **🔒 SafeW** | Direct | — | ✅ |
| **⏳ Buffer Proxy** | Proxy → Twitter, LinkedIn, FB, IG | — | ✅ |
| **📄 WordPress Jetpack** | Proxy → Twitter, LinkedIn, FB, Tumblr | — | ✅ |

> 🔹 **Proxy platforms** — Buffer and WordPress Jetpack act as bridges, letting you post to Twitter, LinkedIn, Facebook, Instagram, and Tumblr without managing each platform's individual (and often restricted) APIs. You authenticate with your own Buffer/Jetpack account; Fed-Poster never sees the downstream credentials ([ADR-006](ADR.md#adr-006)).

Want a platform that isn't here? Check the [Roadmap](ROADMAP.md) or [propose it in Discussions](https://github.com/fedpromptly/fed-poster/discussions/categories/ideas).

---

## 🖥️ Dashboard Features

### 🔹 Multi-Platform Post
Select any combination of platforms, write your message once, attach a file, and post everywhere simultaneously. No per-platform copy-pasting. Per-platform character limits are enforced where they differ, so you stay within the strictest selected platform's limit.

### 🔹 Individual Platform Tabs
Each platform has its own dedicated panel with credential management (auto-saved in your browser), message composition, file uploads (where supported), Test & Send buttons, and real-time status feedback.

### 🔹 Smart Credential Storage
All tokens, passwords, and API keys are stored locally in your browser's `localStorage`, namespaced under `fedposter_*`. They never leave your machine unless you explicitly send a post. Clear them anytime from Settings. ([ADR-002](ADR.md#adr-002))

### 🔹 File Attachments
Upload images, videos, or audio files and attach them to your posts on supported platforms: **Telegram** (photos, videos), **Bluesky** (images), **Mastodon** (images, videos, audio), **DeviantArt** (images via OAuth).

### 🔹 Twelve Built-in Themes
Switch instantly between Deep Space, Cloud, Azure Depth, Emerald Forest, Royal Nebula, Molten Lava, Cyberpunk, Sunset, Abyssal Teal, Luxe Blush, Cobalt Steel, and Synthwave. Your choice persists across pages and reloads. ([ADR-004](ADR.md#adr-004))

### 🔹 Calendar & Analytics
Schedule posts with the calendar view (client-side firing while the page is open, or use the optional scheduling daemon for always-on posting). Track your posting activity per platform in the analytics view with CSV export. See [`usage.md`](usage.md) for details and caveats.

---

## 💰 Pricing

Post to 12+ platforms. One dashboard. No contract. The **open-source build is fully free**; the hosted commercial product offers three tiers.

| Plan | Price | What You Get |
|------|-------|--------------|
| **Starter** | **$27/month** | 500+ platforms, unlimited posts, schedule posts, analytics, 24/7 support |
| **Growth** | **$147/month** | Everything in Starter + done-for-you content + AI image/video generation + priority support |
| **Agency** | **$497/month** | Everything in Growth + white-label rights + unlimited client accounts + API access + dedicated manager |

**Free Trial:** 7 days. No credit card required. One post to all platforms.

📖 **[View full pricing breakdown →](PRICING.md)**

### How Fed-Poster compares

| Feature | Fed-Poster | Hootsuite | Buffer | Later |
|---------|-----------|-----------|--------|-------|
| Platforms supported | **500+** | ~10 | ~8 | ~5 |
| Monthly price (entry) | **$27** | $99+ | $65+ | $80+ |
| Unlimited posts | ✅ | ❌ | ❌ | ❌ |
| Done-for-you content | ✅ | ❌ | ❌ | ❌ |
| White-label rights | ✅ | ❌ | ❌ | ❌ |
| Open source | ✅ | ❌ | ❌ | ❌ |
| Client-side credentials | ✅ | ❌ | ❌ | ❌ |

---

## 📦 Tech Stack

| Area | Technology |
|------|------------|
| **Frontend (shipped)** | Static HTML5, hand-written CSS (custom-property design system), vanilla JavaScript (IIFE modules) — **no build step** ([ADR-003](ADR.md#adr-003)) |
| **Frontend (aspirational v2)** | React, TypeScript, Tailwind CSS, Framer Motion — tracked as [ADR-010 (Proposed)](ADR.md#adr-010), not the current release |
| **Backend** | None required; optional Node.js/Express scheduling daemon for always-on posting |
| **Storage** | `localStorage` (credentials, `fedposter_*`), `IndexedDB` (drafts) |
| **OAuth bridges** | Stateless Supabase Edge Functions (Tumblr, SafeW, DeviantArt) — store nothing ([ADR-005](ADR.md#adr-005)) |
| **APIs** | REST, OAuth 2.0, GraphQL (GitHub) |
| **Deployment** | Any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3) or Docker |

---

## 🛠️ Installation

### 🌐 Option 1 — Run it instantly (no install)
Fed-Poster is a static site. Clone and open `index.html` in a browser. Done.

```bash
git clone https://github.com/fedpromptly/fed-poster.git
cd fed-poster
# open index.html in your browser — that's it
```

For OAuth/Supabase flows or `fetch` features that need an `http(s)` origin, serve locally:
```bash
python3 -m http.server 8000
# visit http://localhost:8000/
```

### 🐳 Option 2 — Docker (with optional backend)

```bash
git clone https://github.com/fedpromptly/fed-poster.git
cd fed-poster
docker compose up -d
```

### ☁️ Option 3 — Deploy to a static host

Fed-Poster deploys to any static host with no build command. See [`DEPLOYMENT.md`](DEPLOYMENT.md) for step-by-step guides for GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3+CloudFront, and nginx, plus the hardening checklist (HTTPS, CSP, SRI).

---

## 🚦 Quick Start (60 seconds)

1. Open the dashboard (locally or hosted).
2. Pick a theme from the nav theme picker (try **Cyberpunk** or **Synthwave**).
3. Open a platform panel (e.g. Telegram) and add a **bot token** from [@BotFather](https://t.me/BotFather) + a chat ID.
4. Hit **Test** with a throwaway message to a private channel.
5. Compose in the multi-platform box, toggle the platforms you want, and **Send**.

📖 Full walkthrough: [`usage.md`](usage.md) · Per-platform setup: [`wiki/`](wiki)

---

## 🤝 Contributing

Contributions are welcome — and Fed-Poster is intentionally easy to contribute to (no build step, no framework). Read [`CONTRIBUTING.md`](CONTRIBUTING.md) for the full guide, then grab a `good first issue` or float an idea in [Discussions](https://github.com/fedpromptly/fed-poster/discussions).

```bash
git clone https://github.com/<your-username>/fed-poster.git
cd fed-poster
git checkout -b feat/my-idea
# edit HTML/CSS/JS, save, refresh — no install, no build
```

The hard rules: no real secrets, `fedposter_*` localStorage keys, HTTPS only, design tokens not hex, no new framework without an [ADR](ADR.md). See [`CLAUDE.md`](CLAUDE.md) and [`AGENTS.md`](AGENTS.md) for architecture and the agent operating protocol.

---

## 📚 Documentation

| Document | What it covers |
|----------|----------------|
| [`usage.md`](usage.md) | Day-to-day usage: setup, composing, scheduling, analytics, themes, security habits |
| [`CLAUDE.md`](CLAUDE.md) | Architecture, design system, hard rules, platform-integration checklist |
| [`AGENTS.md`](AGENTS.md) | Operating protocol for AI coding agents working on the repo |
| [`ADR.md`](ADR.md) | Architecture Decision Records (why the design is the way it is) |
| [`ROADMAP.md`](ROADMAP.md) | What's shipped, in progress, planned, and explicitly not doing |
| [`DEPLOYMENT.md`](DEPLOYMENT.md) | Deploy guides for every common host + hardening checklist |
| [`CHANGELOG.md`](CHANGELOG.md) | What shipped in each release (Keep a Changelog format) |
| [`SECURITY.md`](SECURITY.md) | Security model, supported versions, vulnerability reporting |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | How to contribute, conventions, definition of done |
| [`GOVERNANCE.md`](GOVERNANCE.md) | How decisions get made and who makes them |
| [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) | Community standards (Contributor Covenant 2.1) |
| [`SUPPORT.md`](SUPPORT.md) | Where to get help and what to expect |
| [`PRICING.md`](PRICING.md) | Full pricing, tiers, trial, FAQ |
| [`SUMMARY.md`](SUMMARY.md) | One-file executive overview of the whole project |
| [`COPYING.md`](COPYING.md) / [`LICENSE`](LICENSE) | MIT licence explained + full text |
| [`CITATIONS.md`](CITATIONS.md) | How to cite Fed-Poster in academic work |
| [`wiki/`](wiki) | Long-form guides: per-platform setup, theme authoring, troubleshooting, FAQ |

---

## 🗺️ Roadmap Highlights

- **More platforms:** Nostr, Pixelfed, Threads, Reddit, LinkedIn direct, YouTube, Medium, Substack
- **More control:** drafts & templates, AI-assisted content, queues & bulk scheduling, webhooks, team/agency workspaces, browser extension, optional encrypted cloud sync
- **Deeper trust:** CSP/SRI hardening, optional self-hosted scheduling daemon, automated visual regression across all 12 themes, i18n groundwork

Full detail and what we're deliberately **not** doing: [`ROADMAP.md`](ROADMAP.md).

---

## 🔒 Security & Privacy

Fed-Poster is private **by architecture**: no required backend, credentials in your browser only, HTTPS-only calls, no telemetry, no ads, stateless OAuth bridges. Read the full model, the supported-versions table, and how to report a vulnerability (privately, never via a public issue) in [`SECURITY.md`](SECURITY.md).

---

## 💖 Support the Project

Fed-Poster is free, open source, MIT-licensed, and funded by the community — no venture money, no in-dashboard ads, no telemetry. If it saves you time:

- ☕ **[Buy us a coffee on Ko-fi](https://ko-fi.com/W3T61ZU5FS)**
- 🛠️ Contribute code, docs, or wiki pages ([`CONTRIBUTING.md`](CONTRIBUTING.md))
- 💬 Answer a question in [Discussions](https://github.com/fedpromptly/fed-poster/discussions)
- ⭐ Star the repo to help others find it

---

## 📄 License

[MIT](LICENSE) © The Fed-Poster Contributors. See [`COPYING.md`](COPYING.md) for a plain-language explanation. The open-source build is fully functional; commercial tiers (Starter/Growth/Agency) are hosted services, not licence restrictions.

---

## 📬 Contact

- 📧 General/business: **business@fedpromptly.com**
- 🔒 Security (private): **security@fed-poster.example.com** ([`SECURITY.md`](SECURITY.md))
- 🛟 Support: [`SUPPORT.md`](SUPPORT.md)
- 💬 Community: [GitHub Discussions](https://github.com/fedpromptly/fed-poster/discussions)

---

<div align="center">

**[🚀 Get Started](#installation)** · **[📖 Usage Guide](usage.md)** · **[💰 Pricing](PRICING.md)** · **[🤝 Contribute](CONTRIBUTING.md)** · **[🔒 Security](SECURITY.md)** · **[🗺️ Roadmap](ROADMAP.md)** · **[💬 Discussions](https://github.com/fedpromptly/fed-poster/discussions)**

<sub>📮 <strong>One Dashboard. Twelve Platforms. Zero Hassle.</strong> — Privacy by architecture, built by community.</sub>

</div>
