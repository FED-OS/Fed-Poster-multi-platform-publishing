# 📖 Fed-Poster — Usage Guide

> How to use Fed-Poster day to day: set up your platforms, compose a multi-platform post, schedule it, read your analytics, manage themes and credentials, and stay private while doing all of it. This is the operator's manual for the dashboard. For installation/deployment see [`README.md`](README.md) and [`DEPLOYMENT.md`](DEPLOYMENT.md); for per-platform credential details see the [`wiki/`](wiki).

<div align="center">
  <img src="https://img.shields.io/badge/platforms-12%2B-blue?style=for-the-badge" alt="Platforms" />
  <img src="https://img.shields.io/badge/storage-localStorage%20only-success?style=for-the-badge" alt="localStorage" />
  <img src="https://img.shields.io/badge/themes-12-purple?style=for-the-badge" alt="Themes" />
</div>

---

## 🧭 The Big Picture

Fed-Poster is a single dashboard from which you write a message once, choose any combination of supported platforms, optionally attach a file, and send — your content lands on every selected platform, near-instantly, directly from your browser. Nothing you type or store is sent to any server other than the platform you're posting to. Your credentials live in your browser's `localStorage`, namespaced under `fedposter_`, and never leave your device unless you explicitly hit send on a post.

The app is a set of pages: a **landing** page, the **dashboard** (the composer and per-platform tabs), a **calendar** for scheduled posts, an **analytics** view, a **settings** page for themes and credential management, a **pricing** page, and a branded **404**. Navigation is shared across all pages via the top nav; on mobile it collapses into a toggle.

## 🚀 First Run

Open the deployed URL (or `index.html` locally). You'll land on the marketing page; follow the "Get Started" call to action to reach the dashboard. On first run, no credentials are stored, so every platform panel will prompt you to add the relevant token or app password. Pick the default **Deep Space** theme or switch to any of the twelve themes from the theme picker in the nav — your choice persists across pages and reloads via `localStorage.fedposter_theme`.

Before you can post anywhere, you need to set up credentials for at least one platform. The golden rules: prefer **app-specific passwords** and **scoped tokens** over your main account password, give each token the **minimum scope** it needs, and **rotate** tokens you stop using. Never paste your main account password.

## 🔌 Setting Up Each Platform

Each platform has its own panel in the dashboard with credential fields, a message box, optional file upload, and Test/Send buttons. The supported platforms and what they need:

**Telegram** takes a bot token (from [@BotFather](https://t.me/BotFather)) and a chat ID or channel handle. The bot must be a member/admin of the target chat. Supports photo and video attachments. Create the bot with BotFather, copy the token, add it to the Telegram panel, and Test with a throwaway message to a private channel before posting publicly.

**Bluesky** uses an app password (create one at bsky.app → Settings → App passwords), your handle, and optionally a PDS URL if you self-host. Supports image attachments. App passwords are scoped and revocable — use them, never your main password.

**Mastodon** takes an instance URL and an access token (create one in your instance's Settings → Development → New application, granting only the `write:statuses` and `write:media` scopes you need). Supports image, video, and audio attachments.

**Discord** uses a webhook URL (create one in a channel's Integration settings) — no bot token needed for webhook posting. Paste the webhook URL into the Discord panel. Plain text and embeds; no media attachment via webhook.

**GitHub (Gist)** uses a Personal Access Token with only the `gist` scope. Posts become a new gist. **GitHub (Repo)** uses a PAT with the `repo` scope (or fine-grained token with `contents: write` on the target repo) and pushes a file. Use the narrowest scope that works; rotate the token when you're done.

**Tumblr** uses OAuth, bridged through a stateless Supabase edge function. Click the connect button, complete the OAuth flow, and the resulting token is stored locally. The function stores nothing.

**DeviantArt** similarly uses OAuth via a stateless edge function and supports image uploads.

**SafeW** posts directly with its documented credentials.

**Buffer** and **WordPress Jetpack** act as proxy bridges: you authenticate with your own Buffer or Jetpack account, and Fed-Poster hands the post to that service, which distributes to Twitter/X, LinkedIn, Facebook, Instagram, and Tumblr per your configuration there. Fed-Poster never sees the downstream credentials. This is how you reach the closed networks without each platform's business-API approval.

Detailed, per-platform walkthroughs (exact settings pages, exact scopes, screenshots) live in the [`wiki/`](wiki). If a platform's panel gives you a red status, check the browser console (DevTools → Console and Network) — most failures are a 401 (bad/expired token), a scope mismatch, or a CORS block that means you need the proxy bridge.

## ✍️ Composing a Multi-Platform Post

In the dashboard composer, type your message once in the shared textarea. Select any combination of platforms using the platform toggles — a single post can go to all twelve at once, or just one. Where a platform supports attachments, the file input is active; attach an image, video, or audio file as appropriate (Telegram photos/videos, Bluesky images, Mastodon images/videos/audio, DeviantArt images). Character limits are enforced per platform where they differ; the composer shows a count so you stay within the strictest selected platform's limit.

When you're ready, hit **Send**. Each selected platform fires its own request from your browser to that platform's API over HTTPS. The panel surfaces a real-time status for each — success, failure with the platform's error, or "queued" if scheduling. A failure on one platform does not block the others; you can re-send to just the failed ones. Before a public post, use **Test** against a private/sandbox target (a private Telegram channel, a test gist, a draft Mastodon post to your own account) to confirm credentials and formatting.

## 📅 Scheduling with the Calendar

The calendar view (`calendar.html`) lets you queue posts for future times. Create a scheduled post from the composer by choosing a date/time instead of Send-now, or drag an existing draft onto the calendar. **Important caveat of the client-side architecture (ADR-001):** a scheduled post fires only when the Fed-Poster page is open in a browser at the scheduled time, unless you run the optional self-hosted scheduling daemon described in [`DEPLOYMENT.md`](DEPLOYMENT.md). For "post while I sleep" reliability, deploy the optional backend; for "remind me to post at 3pm while I'm at my desk," the client-side scheduler is plenty.

The calendar supports month/week/day views (see [`ROADMAP.md`](ROADMAP.md) for ongoing polish), timezone-aware scheduling, and conflict warnings if you stack too many posts too close together. Scheduled posts appear on the analytics view once they've been sent.

## 📈 Reading Analytics

The analytics view (`analytics.html`) shows per-platform posting counts and, where a platform's API exposes it, engagement proxies — over a rolling window with a CSV export. Because Fed-Poster is client-side and privacy-first, analytics reflect *what you posted from this browser*, not platform-side engagement pulled from each network (that would require long-lived read scopes we deliberately avoid requesting). Think of it as a posting-activity dashboard, not a vanity-metrics dashboard. The roadmap tracks richer analytics and optional, opt-in platform-side engagement pulls.

## ⚙️ Settings: Themes & Credential Management

The settings page (`settings.html`) is where you manage everything persistent. The **theme picker** offers all twelve themes (Deep Space, Cloud, Azure Depth, Emerald Forest, Royal Nebula, Molten Lava, Cyberpunk, Sunset, Abyssal Teal, Luxe Blush, Cobalt Steel, Synthwave) — click a swatch to apply instantly; it persists. The **credential manager** lists every `fedposter_*` key currently stored and lets you clear individual credentials or nuke all Fed-Poster data in one click (handy before stepping away from a shared machine). A planned "security checkup" will flag over-broad token scopes; until then, audit your scopes manually per platform.

## 🔐 Staying Private & Secure

Because credentials live in `localStorage`, a few habits keep you safe. Use app-specific passwords and scoped tokens, always. Rotate tokens you stop using via each platform's settings. Don't use Fed-Poster on a public or shared computer; if you must, clear all Fed-Poster data from Settings (or the browser's site data) when you're done. Keep your browser and OS updated — localStorage is readable by any JavaScript on the origin, so an XSS would be catastrophic, which is why Fed-Poster loads no untrusted third-party scripts and ships a strict Content-Security-Policy on managed hosts (see [`DEPLOYMENT.md`](DEPLOYMENT.md)). Never export and share your `localStorage` data — it contains tokens. If you move between devices, use the (planned) encrypted export/import bundle, and keep the encryption key to yourself.

Full security guidance and the vulnerability reporting process live in [`SECURITY.md`](SECURITY.md).

## 🎨 Themes Quick Reference

| Theme key | Name | Vibe |
|-----------|------|------|
| `dark` | Deep Space | Default; deep navy, purple accent |
| `light` | Cloud | Bright, paper-white, purple accent |
| `blue` | Azure Depth | Deep blue, azure accent |
| `green` | Emerald Forest | Dark green, emerald accent |
| `purple` | Royal Nebula | Indigo, violet accent |
| `orange` | Molten Lava | Dark, fiery orange accent |
| `cyberpunk` | Cyberpunk | Near-black, hot pink accent |
| `sunset` | Sunset | Dusky, coral accent |
| `ocean` | Abyssal Teal | Deep teal, teal accent |
| `rose` | Luxe Blush | Warm, blush accent |
| `midnight` | Cobalt Steel | Steel blue, bright accent |
| `synthwave` | Synthwave | Near-black, magenta accent |

## 🧯 Troubleshooting Cheat Sheet

- **Post returns 401 Unauthorized:** the token is wrong, expired, or lacks scope. Re-check the credential and the required scope in the platform's wiki page. For OAuth platforms, re-connect.
- **Post returns a CORS error:** the platform blocks direct browser calls. Use the Buffer or WordPress Jetpack proxy bridge (for Twitter/LinkedIn/Facebook/Instagram) or, for OAuth platforms, confirm the Supabase edge function is deployed.
- **Credential won't save:** check the browser isn't in private/incognito mode with storage disabled, and that no privacy extension is clearing `localStorage`. Confirm the key is `fedposter_*` in DevTools → Application.
- **Theme resets on reload:** the page is being served from a different origin than when you set the theme, or storage was cleared. Re-pick the theme.
- **Scheduled post didn't fire:** the page wasn't open at the scheduled time. Either keep the page open or deploy the optional scheduling daemon.
- **Ko-fi widget doesn't open:** confirm `assets/kofi-widget.js` loaded and the button has a `data-kofi` attribute; check the CSP allows `frame-src https://ko-fi.com`.
- **Mixed-content warnings:** the host is serving over HTTP. Force HTTPS at the host level.

More help and channels in [`SUPPORT.md`](SUPPORT.md).

## 🆙 Upgrading & Pricing

The open-source dashboard is fully functional. If you use the hosted product at fedpromptly.com, the tiers (Starter / Growth / Agency) and a 7-day free trial are detailed in [`PRICING.md`](PRICING.md). Upgrading a hosted plan happens on the pricing page; upgrading the open-source code is just `git pull` (or redeploy) and checking [`CHANGELOG.md`](CHANGELOG.md) for what changed.

---

<div align="center">
  <sub>📖 <strong>Write once. Choose your platforms. Send. Stay private.</strong></sub>
</div>
