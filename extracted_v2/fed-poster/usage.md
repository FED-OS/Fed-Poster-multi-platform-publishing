# 📖 Fed-Poster — Usage Guide

<div align="center">
  <img src="https://img.shields.io/badge/docs-usage-blue?style=for-the-badge" alt="Usage" />
  <img src="https://img.shields.io/badge/time-~10%20min%20to%20onboard-green?style=for-the-badge" alt="Time" />
</div>

This guide walks you through everything you need to use Fed-Poster day to day: connecting accounts, composing posts, scheduling, attaching media, and reading analytics. If you're looking to *deploy* or *develop* Fed-Poster, see [DEPLOYMENT.md](DEPLOYMENT.md) and [CONTRIBUTING.md](CONTRIBUTING.md) instead.

---

## 🚀 Quick Start (3 Steps)

1. **Open the dashboard.** Use the hosted version or your self-hosted instance (see [README.md](README.md)).
2. **Connect a platform.** Go to the platform's tab and add your OAuth token / app password / webhook URL. Credentials are saved locally in your browser.
3. **Compose & post.** Write your message, pick platforms, attach media (optional), and hit **Send**.

That's it. Below are the details for each step.

---

## 🔌 Connecting Accounts

Each platform has a dedicated panel. The connection method depends on the platform type:

| Method             | Platforms                                  | What you provide                          |
|--------------------|--------------------------------------------|-------------------------------------------|
| **Bot token**      | Telegram                                   | Bot token from [@BotFather](https://t.me/BotFather) + chat ID |
| **App password**   | Bluesky, GitHub, WordPress, Medium         | Platform-generated app password / PAT     |
| **OAuth**          | Facebook, YouTube, Instagram, X, LinkedIn, Reddit, DeviantArt, Tumblr | OAuth flow (button) or access token |
| **Webhook URL**    | Discord                                    | Incoming webhook URL                      |
| **API key/token**  | Mastodon, GitLab, SafeW                    | Instance URL + access token               |
| **Proxy**          | Buffer, WordPress Jetpack                  | Proxy account credentials                 |
| **Zapier**         | 450+ platforms                             | Your Zapier webhook URL per automation    |

### How to connect (general flow)

1. Click the platform's tab in the dashboard.
2. Enter the required credential(s) in the credential panel.
3. Click **Save** — the credential is stored in `localStorage` (scoped to that platform).
4. Click **Test** — Fed-Poster verifies the credential works (e.g., fetches your profile or sends a test ping).
5. When the test passes, the platform shows a **Live** badge and is selectable in the multi-platform composer.

> 🔒 **Security:** Credentials never leave your browser unless you send a post. Never share your `localStorage` data. See [SECURITY.md](SECURITY.md).

### Removing / rotating credentials

- **Remove:** In the platform panel, click **Clear credentials**. This deletes the stored token from `localStorage`.
- **Rotate:** Replace the token in the field and click **Save**, then **Test**.
- **Best practice:** Rotate tokens regularly and limit scopes (e.g., GitHub PAT with only `gist` scope).

---

## ✍️ Composing a Post

### Multi-platform compose

1. Open the **Multi-Platform Post** view.
2. Select one or more platforms using the checkboxes / chips.
3. Write your **master message** in the composer.
4. (Optional) Attach a file — see [Attaching Media](#-attaching-media).
5. Review the **per-platform preview** to see how your post adapts (character limits, media support).
6. Adjust text per platform if needed (content adaptation).
7. Choose **Send now** or **Schedule** (see [Scheduling](#-scheduling)).
8. Click **Publish**.

### Per-platform limits (reference)

| Platform   | Text limit | Media                         |
|------------|-----------|-------------------------------|
| X          | 280 chars | up to 4 images / 1 video       |
| Telegram   | 4096 chars | photo or video                 |
| Mastodon   | instance default (500) | image / video / audio |
| Bluesky    | 300 chars | up to 4 images                 |
| LinkedIn   | 3000 chars | image / video                  |
| Discord    | 2000 chars (per msg) | embeds / attachments   |
| Reddit     | title 300, body 40000 | image (some subreddits)|
| GitHub Gist| large (gist) | —                            |

> The composer warns you when a platform's limit would be exceeded and offers to auto-shorten or split.

---

## 🖼️ Attaching Media

On supported platforms you can attach files:

- **Images:** JPG, PNG, WebP, GIF (platform-dependent).
- **Videos:** MP4, MOV (Telegram, Mastodon, YouTube, Instagram).
- **Audio:** MP3, OGG, WAV (Mastodon).

### How to attach
1. In the composer, click **Attach** (or drag-and-drop onto the composer).
2. Select the file. Fed-Poster reads it in-browser (no upload to our servers).
3. The file appears as a thumbnail; supported platforms enable the media badge.
4. On publish, the file is uploaded to each selected platform that supports it.

> ⚠️ Some platforms have size/format limits. The composer shows warnings per platform. Large files may be transcoded if a transcoding pipeline is enabled.

---

## ⏰ Scheduling

1. In the composer, toggle **Schedule**.
2. Pick a date & time (timezone-aware; uses your browser locale).
3. (Optional) Set **recurring** for content series.
4. Click **Schedule**. The post enters the queue.

### Queue & delivery
- The queue shows scheduled, pending, sent, and failed posts.
- Failed posts retry with **exponential backoff** for rate-limited platforms.
- You can edit, cancel, or re-run queued posts from the queue view.

> ⚠️ Scheduling requires the app to be open (client-side) or a self-hosted worker (optional backend) for offline delivery. See [ROADMAP.md](ROADMAP.md) for the planned always-on scheduler.

---

## 📊 Analytics & Audit Logs

- **Delivery dashboard:** per-post, per-platform status (sent / failed / pending).
- **Engagement (paid plans):** reach and engagement aggregated across platforms.
- **Export:** download logs as CSV or JSON for audit and reporting.
- **Filters:** by platform, date range, status.

> Free/open-source core includes delivery status; advanced analytics require a paid plan. See [PRICING.md](PRICING.md).

---

## ⚡ Zapier Extension (450+ platforms)

1. In Zapier, create a **Zap** with a Webhook trigger.
2. Copy the webhook URL.
3. In Fed-Poster, open the **Zapier** panel and add the webhook URL.
4. Map which platforms/automations a post triggers.
5. When you publish with Zapier selected, Fed-Poster sends the payload to your Zapier webhook.

> Each Zapier automation may consume one or more Zapier tasks per post. You manage your own Zapier account and task limits.

---

## 🧪 Testing a Connection

Every platform panel has a **Test** button that performs a safe read-only or ping action (e.g., fetch profile, send a test message to yourself). Use it after connecting or rotating credentials to confirm everything works before a real post.

---

## 🧹 Managing Drafts

Drafts are auto-saved to **IndexedDB** as you type. You can:
- Resume a draft from the drafts list.
- Duplicate a draft as a template.
- Delete drafts.
- Export/import drafts (JSON).

---

## 🌐 Self-Hosting Notes

- Serve over HTTPS (see [DEPLOYMENT.md](DEPLOYMENT.md)).
- For OAuth platforms (Tumblr, SafeW, DeviantArt), deploy the Supabase Edge Functions and set the function URLs.
- Enable security headers (CSP, etc.) per the [SECURITY.md](SECURITY.md) checklist.
- Back up nothing server-side — there's nothing to back up (state is in the user's browser).

---

## ❓ FAQ (Usage)

**Where are my credentials stored?**
In your browser's `localStorage`, scoped per platform. They never go to our servers unless you post. See [SECURITY.md](SECURITY.md).

**Can I use Fed-Poster offline?**
Composing and drafting work offline. Publishing requires network access to each platform's API.

**Does Fed-Poster post on a schedule even if my browser is closed?**
In the client-only mode, no — the app must be open. An always-on scheduler is on the roadmap ([ROADMAP.md](ROADMAP.md)) and available via the optional self-hosted worker.

**Can I post the same media to all platforms?**
Yes, where the platform supports the media type. Unsupported platforms are skipped with a warning.

**How do I add a platform not listed?**
Use Zapier (450+), or propose a direct adapter — see [ADR-0007](ADR.md#adr-0007-adding-a-new-platform-adapter).

**Is my data sold or shared?**
Never. See [SECURITY.md](SECURITY.md) and [PRICING.md](PRICING.md).

---

## 🆘 Need More Help?

- 💬 [GitHub Discussions](https://github.com/FED-OS/Fed-Poster/discussions)
- 📖 [Wiki](https://github.com/FED-OS/Fed-Poster/wiki)
- 📧 business@fedpromptly.com
- See [SUPPORT.md](SUPPORT.md) for the full support guide.

---

<div align="center">
  <sub>📖 <strong>Write once, publish everywhere — here's how.</strong></sub>
</div>
