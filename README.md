<img width="2560" height="1440" alt="fed-poster-fun-music-festival" src="https://github.com/user-attachments/assets/5685cee2-97ef-43c2-8638-2d35a861dc86" />
<div align="center">
  <img src="https://img.shields.io/badge/status-active-success?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/platforms-12-blue?style=for-the-badge" alt="Platforms" />
  <img src="https://img.shields.io/badge/license-MIT-yellow?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/badge/made%20with-❤️-red?style=for-the-badge" alt="Made with love" />
  <img src="https://img.shields.io/badge/version-2.0-brightgreen?style=for-the-badge" alt="Version" />
</div>

<br />

<div align="center">
  <h1>📨 Fed-Poster V1 
    
  [![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/W3T61ZU5FS) </h1>
  <p><strong>One Dashboard. Twelve Platforms. Zero Hassle.</strong></p>
  <p>Cross‑post to Telegram, Bluesky, Mastodon, Discord, GitHub, Tumblr, DeviantArt & more — all from a single, sleek interface.</p>
  <br />
  <img src="https://via.placeholder.com/800x450/161b22/e6edf3?text=Fed-Poster+Dashboard+Preview" alt="Fed-Poster Dashboard Preview" style="border-radius: 16px; border: 1px solid #30363d; max-width: 100%;" />
  <br /><br />
  <a href="#pricing"><img src="https://img.shields.io/badge/💰_Pricing-View_Plans-blue?style=for-the-badge" alt="Pricing" /></a>
  <a href="#installation"><img src="https://img.shields.io/badge/🚀_Get_Started-Install_now-green?style=for-the-badge" alt="Get Started" /></a>
</div>

---

## ✨ Why Fed-Poster?

Tired of juggling tabs, APIs, and credentials for every social platform? **Fed-Poster** brings everything together in one clean dashboard. Write once, select your platforms, and hit send — your content reaches your audience everywhere, instantly.

> **12 Social Networks** • **Auto‑saved Credentials** • **File Uploads** • **Proxy Support** • **No Verification Required**

---

## 🚀 Supported Platforms

| Platform | Type | Media | Status |
|----------|------|-------|--------|
| <img src="https://img.icons8.com/color/20/telegram-app.png" /> **Telegram** | Direct | 📷 📹 | ✅ |
| <img src="https://img.icons8.com/color/20/bluesky.png" /> **Bluesky** | Direct | 🖼️ | ✅ |
| <img src="https://img.icons8.com/color/20/mastodon.png" /> **Mastodon** | Direct | 📷 📹 🎵 | ✅ |
| <img src="https://img.icons8.com/color/20/discord.png" /> **Discord** | Direct | — | ✅ |
| <img src="https://img.icons8.com/color/20/github.png" /> **GitHub (Classic)** | Gist | — | ✅ |
| <img src="https://img.icons8.com/color/20/github.png" /> **GitHub (Repo)** | File Push | — | ✅ |
| <img src="https://img.icons8.com/color/20/tumblr.png" /> **Tumblr** | Direct | — | ✅ |
| <img src="https://img.icons8.com/color/20/deviantart.png" /> **DeviantArt** | OAuth | 🖼️ | ✅ |
| **🔐 SafeW** | Direct | — | ✅ |
| **⏳ Buffer Proxy** | Proxy → Twitter, LinkedIn, FB, IG | — | ✅ |
| **📄 WordPress Jetpack** | Proxy → Twitter, LinkedIn, FB, Tumblr | — | ✅ |

> 🔹 **Proxy platforms** — Buffer and WordPress Jetpack act as bridges, letting you post to Twitter, LinkedIn, Facebook, Instagram, and Tumblr without managing individual APIs.

---

## 🖥️ Dashboard Features

### 🔹 Multi‑Platform Post  
Select any combination of platforms, write your message once, attach a file, and post everywhere simultaneously. No per‑platform copy‑pasting.

### 🔹 Individual Platform Tabs  
Each platform has its own dedicated panel with:
- Credential management (auto‑saved in your browser)
- Message composition
- File uploads (where supported)
- Test & Send buttons
- Real‑time status feedback

### 🔹 Smart Credential Storage  
All tokens, passwords, and API keys are stored locally in your browser's `localStorage` — they never leave your machine unless you explicitly send a post.

### 🔹 File Attachments  
Upload images, videos, or audio files and attach them to your posts on supported platforms:
- **Telegram** – photos, videos
- **Bluesky** – images
- **Mastodon** – images, videos, audio
- **DeviantArt** – images (OAuth)

---

## 💰 Pricing

Post to 12+ platforms. One dashboard. No contract. **Now at half the original price!**

| Plan | Price | What You Get |
|------|-------|--------------|
| **Starter** | **$13.50/month** | 12 platforms, unlimited posts, schedule posts, analytics, 24/7 support |
| **Growth** | **$73.50/month** | Everything in Starter + done‑for‑you content + AI image/video generation + priority support |
| **Agency** | **$248.50/month** | Everything in Growth + white‑label rights + unlimited client accounts + API access + dedicated manager |

**Free Trial:** 7 days. No credit card required. One post to all platforms.

[**View full pricing breakdown →**](PRICING.md)

---

## 📦 Tech Stack

| Area | Technology |
|------|------------|
| **Frontend** | React, TypeScript, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express (optional, can run fully client‑side) |
| **Storage** | localStorage (credentials), IndexedDB (drafts) |
| **APIs** | REST, OAuth 2.0, GraphQL (for GitHub) |
| **Deployment** | Docker, Vercel / Netlify (frontend), Heroku / Render (backend) |

---

## 🛠️ Installation

### 🐳 Docker (recommended)

```bash
git clone https://github.com/yourusername/fed-poster.git
cd fed-poster
docker-compose up -d
