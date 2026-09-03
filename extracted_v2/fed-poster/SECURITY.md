# 🔒 Security Policy

<div align="center">
  <img src="https://img.shields.io/badge/status-active-brightgreen?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/reported-vulnerabilities-0-blue?style=for-the-badge" alt="Vulnerabilities" />
  <img src="https://img.shields.io/badge/response_time-<24h-success?style=for-the-badge" alt="Response Time" />
  <img src="https://img.shields.io/badge/SECURE%20BY%20DESIGN-OAuth%20only-blueviolet?style=for-the-badge" alt="Secure by design" />
  <br />
  <strong>Your safety is our priority.</strong>
</div>

---

## ✅ Supported Versions

We actively support the **latest stable release** of Fed-Poster. Older versions may receive critical patches, but we strongly recommend upgrading to the newest version for the best security. We follow [Semantic Versioning](https://semver.org/).

| Version               | Supported          | Notes                               | End of Support |
| --------------------- | ------------------ | ----------------------------------- | -------------- |
| **2.x (current)**     | ✅ Fully supported | All new features and security fixes | — |
| **1.x (maintenance)** | 🟡 Security only   | Critical fixes only                 | 2026-12-31     |
| **0.x (legacy)**      | ❌ End of life     | Upgrade to 2.x                      | 2025-12-31     |
| Experimental branches | ⚠️ Limited         | Use at your own risk                | n/a            |

> 🔐 **We use [Semantic Versioning](https://semver.org/).** Security patches increment the **PATCH** version number and are documented in [CHANGELOG.md](CHANGELOG.md).

---

## 🚨 Reporting a Vulnerability

If you discover a security flaw, **please do not open a public issue** — that could put users at risk before we have a fix ready.

### 📧 How to Report

1. **Preferred:** Open a private security advisory on GitHub via the **Security → Advisories → Report a vulnerability** tab.
2. Alternatively, send an email to **`security@fed-poster.example.com`** (replace with actual email).
3. Include a clear description of the vulnerability.
4. Provide steps to reproduce, with code or screenshots if possible.
5. Tell us your name/handle if you'd like to be credited (optional).
6. If possible, suggest a fix or mitigation.

### ⏳ What to Expect

| Step                          | Timeframe                      |
| ----------------------------- | ------------------------------ |
| **Acknowledgment**            | Within 48 hours                |
| **Investigation & triage**    | 3–5 business days              |
| **Fix development & testing** | Up to 14 days (critical = ASAP)|
| **Public disclosure**         | After patch is released        |

We will work with you to confirm the vulnerability, and we will credit you in the release notes (unless you prefer to remain anonymous).

> 🛡️ **We take every report seriously.** Even if we can't reproduce it, we will investigate thoroughly.

### 🏆 Recognition

Reporters of confirmed vulnerabilities are listed (with consent) in our [Hall of Thanks](#) and the relevant CHANGELOG entry. We may also offer a small reward or swag for high-severity findings.

---

## 🔐 Security Best Practices for Fed-Poster

Because Fed-Poster runs primarily in your browser, **your credentials are stored locally** in `localStorage`. While convenient, this means you must take extra care:

- ✅ **Use app-specific passwords** wherever possible (Bluesky, GitHub, WordPress).
- ✅ **Limit token scopes** — e.g., for GitHub, use a token with only the `gist` or `repo` scope you need.
- ✅ **Rotate your tokens regularly** — revoke unused tokens via each platform's settings.
- ✅ **Avoid using Fed-Poster on public or shared computers** — if you must, clear your browser data after each session.
- ✅ **Keep your browser and OS updated** — to protect against cross-site scripting and other attacks.
- ✅ **Enable HTTPS everywhere** when self-hosting; redirect all HTTP traffic to HTTPS.
- ❌ **Never share your `localStorage` data** — it contains sensitive tokens.
- ❌ **Don't use your main account passwords** — always use tokens or app passwords.
- ❌ **Never commit `.env`, `tokens.json`, or `credentials.json`** — they are gitignored for a reason.

### 📦 Third-Party Integrations

Fed-Poster uses Supabase Edge Functions for Tumblr, SafeW, and DeviantArt OAuth. These functions **do not store** any of your data — they act as stateless proxies. All communication is over HTTPS.

| Integration       | Data stored | Transit | Notes |
|-------------------|-------------|---------|-------|
| Supabase Edge Fn  | None        | HTTPS   | Stateless OAuth proxy |
| Zapier extension  | None on our side | HTTPS via Zapier | Your Zapier account manages its own auth |
| Direct APIs (Telegram, Bluesky, etc.) | Token in `localStorage` only | HTTPS | Token never sent to our servers |

### 🧱 Self-Hosting Hardening Checklist

If you self-host Fed-Poster, please follow this checklist before exposing it:

- [ ] Serve over HTTPS with a valid certificate (Let's Encrypt / Caddy / Nginx).
- [ ] Set a strict `Content-Security-Policy` header.
- [ ] Enable `X-Content-Type-Options: nosniff` and `X-Frame-Options: DENY`.
- [ ] Set `Referrer-Policy: no-referrer` for sensitive routes.
- [ ] Restrict Supabase Edge Function URLs to your domain.
- [ ] Rotate any default secrets/keys.
- [ ] Keep dependencies updated (Dependabot is enabled by default).

---

## 🔑 Disclosure Policy

- We will **not** publicly disclose a vulnerability until a fix has been released.
- We will give credit to the reporter in the patch notes (unless you opt out).
- We will provide a **detailed changelog** entry describing the fix.
- We coordinate disclosure timelines with the reporter.
- We request a **90-day coordinated disclosure window** (flexible on request).

---

## 📬 Contact

For any security-related inquiries, reach out to us at:

📧 **business@fedpromptly.com**
🔐 PGP key: available upon request
🔒 GitHub Security Advisories: preferred channel

---

<div align="center">
  <sub>🛡️ <strong>Together, we keep Fed-Poster safe for everyone.</strong></sub>
</div>
