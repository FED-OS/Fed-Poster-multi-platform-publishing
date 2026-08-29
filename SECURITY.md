# 🔒 Security Policy

<div align="center">
  <img src="https://img.shields.io/badge/status-active-brightgreen?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/reported%20vulnerabilities-0-blue?style=for-the-badge" alt="Vulnerabilities" />
  <img src="https://img.shields.io/badge/response%20time-<48h-success?style=for-the-badge" alt="Response Time" />
  <img src="https://img.shields.io/badge/architecture-client--side%20only-9cf?style=for-the-badge" alt="Architecture" />
  <br />
  <strong>Your safety is our priority — privacy is built into the architecture, not promised in a policy.</strong>
</div>

---

## 🧱 Security Model at a Glance

Fed-Poster is a **privacy-first, browser-native** application with **no required backend** (see ADR-001). Your platform credentials are stored only in your browser's `localStorage`, namespaced under `fedposter_*` (ADR-002), and are transmitted **only** to the platform you are actively posting to, over **HTTPS**. No Fed-Poster server ever receives or stores your credentials. Where a platform requires OAuth or forbids direct browser calls (Tumblr, SafeW, DeviantArt), the exchange is brokered by **stateless** Supabase Edge Functions that hold no database, log no secrets, and persist nothing between requests (ADR-005). The product loads no third-party analytics or tracking scripts and ships a strict Content-Security-Policy on managed hosts.

This means the trust surface is small and inspectable: you can read the source, open DevTools, and watch exactly where your data goes. It also means the chief residual risk is **client-side**: if an attacker could execute arbitrary JavaScript on Fed-Poster's origin (an XSS), they could read `localStorage`. The mitigations below, the CSP/SRI hardening in [`DEPLOYMENT.md`](DEPLOYMENT.md), and the no-untrusted-scripts policy exist to keep that risk as close to zero as we can.

---

## ✅ Supported Versions

We actively support the **latest stable release** of Fed-Poster. Older versions may receive critical security patches, but we strongly recommend upgrading to the newest version for the best protection. We follow [Semantic Versioning](https://semver.org/) (ADR-009); security patches increment the **PATCH** number.

| Version               | Supported          | Notes                                          |
| --------------------- | ------------------ | ---------------------------------------------- |
| **Latest (v1.x)**     | ✅ Fully supported | All new features and security fixes            |
| v1.x − 1 minor        | ✅ Security only   | Security backports; upgrade recommended        |
| v0.x (legacy)         | ❌ End of life     | No patches — upgrade to v1.x                   |
| Experimental branches | ⚠️ Limited         | Use at your own risk; no SLA                   |

> 🔒 **Semantic Versioning:** Security patches increment the **PATCH** version (`1.2.0` → `1.2.1`). Breaking security changes would be a **MINOR** or **MAJOR** and would be clearly flagged in the release notes and [`CHANGELOG.md`](CHANGELOG.md).

---

## 🚨 Reporting a Vulnerability

If you discover a security flaw, **please do not open a public issue or post in Discussions** — that could put users at risk before a fix is ready. All security reports are handled privately.

### 📧 How to Report

1. Email **`security@fed-poster.example.com`** (replace with the live address once published). For added confidentiality, request our PGP key.
2. Include a clear description of the vulnerability and its impact.
3. Provide steps to reproduce, with code, screenshots, or a screen recording if possible.
4. Tell us your name/handle if you'd like to be credited in the release notes (optional — anonymity is fine).
5. If you have a proposed fix, include it; we'll review and credit you.

### ⏳ What to Expect

| Step                          | Timeframe                       |
| ----------------------------- | ------------------------------- |
| **Acknowledgment**            | Within **48 hours**             |
| **Investigation & triage**    | 3–5 business days               |
| **Fix development & testing** | Up to 14 days (critical = ASAP) |
| **Coordinated disclosure**    | After the patch is released     |

We will work with you to confirm the vulnerability, keep you informed of progress, and credit you in the release notes unless you prefer to remain anonymous. If we cannot reproduce the issue, we will still investigate thoroughly and report back.

### 💰 Recognition & (No) Bounties

Fed-Poster is a volunteer, community-funded project with no formal bug-bounty budget. We recognize contributors by name in [`CHANGELOG.md`](CHANGELOG.md) and the release announcement, and we're deeply grateful for every report. If you'd like to support the project financially instead, [Ko-fi](https://ko-fi.com/W3T61ZU5FS) is the channel.

---

## 🛡️ Security Best Practices for Users

Because Fed-Poster runs entirely in your browser and stores credentials locally, a few habits keep you safe:

### Do
- ✅ **Use app-specific passwords** wherever possible (Bluesky, GitHub, WordPress). They're scoped and revocable.
- ✅ **Limit token scopes** to the minimum required. GitHub: `gist` only for Gist posting, `repo` only if pushing files. Mastodon: `write:statuses` + `write:media` only.
- ✅ **Rotate your tokens regularly** — revoke unused tokens via each platform's settings.
- ✅ **Clear Fed-Poster data on shared machines** — use the "Clear all credentials" control in Settings, or clear site data in your browser, after each session.
- ✅ **Keep your browser and OS updated** — to protect against cross-site scripting and other attacks.
- ✅ **Serve over HTTPS** — never use Fed-Poster over plain HTTP; tokens could be intercepted.
- ✅ **Review stored keys** — DevTools → Application → localStorage should show only `fedposter_*` keys.

### Don't
- ❌ **Never use your main account password** — always tokens or app passwords.
- ❌ **Never share your `localStorage` data** — it contains sensitive tokens.
- ❌ **Never paste real tokens into a bug report, Discussion, or screenshot** — use placeholders.
- ❌ **Don't install untrusted browser extensions** while using Fed-Poster — extensions can read page storage.
- ❌ **Don't use Fed-Poster on a compromised or untrusted device.**

### 🔍 Token Scope Cheat Sheet

| Platform | Minimum scope for posting | Notes |
|----------|---------------------------|-------|
| Telegram | Bot token (BotFather) | Bot must be admin of the target chat |
| Bluesky | App password | Create at bsky.app → Settings → App passwords |
| Mastodon | `write:statuses`, `write:media` | Per-instance token; instance URL required |
| Discord | Webhook URL | No bot token needed for webhook posts |
| GitHub (Gist) | `gist` | Fine-grained or classic PAT |
| GitHub (Repo) | `repo` (or fine-grained `contents: write`) | Scope to the target repo if fine-grained |
| Tumblr | OAuth (via edge function) | Stateless bridge; no server storage |
| DeviantArt | OAuth (via edge function) | Stateless bridge; no server storage |
| Buffer | Buffer account auth | Proxy to Twitter/LinkedIn/FB/IG/Tumblr |
| WordPress Jetpack | Jetpack auth | Proxy to Twitter/LinkedIn/FB/Tumblr |

---

## 🔌 Third-Party Integrations

Fed-Poster uses **Supabase Edge Functions** as **stateless** proxies for the OAuth flows of Tumblr, SafeW, and DeviantArt. These functions:
- Do **not** write to any database.
- Do **not** log tokens, secrets, or user data.
- Hold **no state** between requests.
- Communicate only over **HTTPS**.

The functions exist solely to perform the OAuth handshake the browser cannot perform directly, and to return the resulting token to your browser (where it is stored locally per ADR-002). They are auditable in the repository.

Buffer and WordPress Jetpack are **third-party services** you authenticate with using your own account; Fed-Poster hands a post to that service, which then distributes to Twitter, LinkedIn, Facebook, Instagram, and Tumblr. Fed-Poster never sees the downstream platform credentials — the trust relationship is between you and Buffer/Jetpack (ADR-006).

Runtime CDN assets (Inter font, Font Awesome 6.5, Ko-fi widget) are loaded from their official CDNs. On managed deployments we recommend SRI integrity hashes and a strict CSP (see [`DEPLOYMENT.md`](DEPLOYMENT.md) → Hardening).

---

## 🧩 Threat Model Summary

| Threat | Mitigation |
|--------|-----------|
| **Credential theft from a Fed-Poster server** | No server stores credentials (ADR-001/ADR-002). |
| **Credential leak via telemetry/tracking** | No third-party analytics or tracking scripts; CSP restricts `connect-src`. |
| **XSS reading `localStorage`** | No untrusted remote scripts; strict CSP; SRI on CDN assets; no `unsafe-eval`. |
| **Token over-privilege** | UI recommends minimum scopes; scope cheat sheet above; planned "security checkup". |
| **Token reuse on a shared machine** | "Clear all credentials" in Settings; documented clear-after-use guidance. |
| **Man-in-the-middle on platform calls** | HTTPS-only outbound; managed hosts force HTTPS. |
| **OAuth-flow data retention** | Stateless edge functions; no DB, no logging of secrets (ADR-005). |
| **Supply-chain via CDN compromise** | SRI integrity hashes; CSP `script-src`/`style-src` allowlists. |

---

## 🔑 Disclosure Policy

- We will **not** publicly disclose a vulnerability until a fix has been released.
- We will give **credit** to the reporter in the patch notes (unless you opt out).
- We will provide a **detailed [`CHANGELOG.md`](CHANGELOG.md)** entry describing the fix and a CVE reference if one is assigned.
- We prefer **coordinated disclosure** and will agree a timeline with you; we will not publish ahead of an agreed date without your OK, except where active exploitation forces an emergency release.

---

## 📦 Secure Deployment

Anyone self-hosting should follow the **Hardening Checklist** in [`DEPLOYMENT.md`](DEPLOYMENT.md), which covers HTTPS enforcement, a strict Content-Security-Policy, Subresource Integrity for CDN assets, referrer-policy, cache headers, and the pre-deploy secret scan. The defaults in this repository are privacy-preserving, but the host's configuration determines the final security posture.

---

## 📬 Contact

For any security-related inquiries, reach out to:

📧 **business@fedpromptly.com** (general)
🔒 **security@fed-poster.example.com** (security reports — private)
🔐 PGP key: available upon request

---

<div align="center">
  <sub>🛡️ <strong>Together, we keep Fed-Poster safe for everyone. Report responsibly; we'll respond fast and credit generously.</strong></sub>
</div>
