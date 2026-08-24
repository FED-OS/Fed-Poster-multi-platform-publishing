# 🔐 Security Policy

<div align="center">
  <img src="https://img.shields.io/badge/status-active-brightgreen?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/reported-vulnerabilities-0-blue?style=for-the-badge" alt="Vulnerabilities" />
  <img src="https://img.shields.io/badge/response_time-<24h-success?style=for-the-badge" alt="Response Time" />
  <br />
  <strong>Your safety is our priority.</strong>
</div>

---

## ✅ Supported Versions

We actively support the **latest stable release** of Fed-Poster. Older versions may receive critical patches, but we strongly recommend upgrading to the newest version for the best security.

| Version               | Supported          | Notes                               |
| --------------------- | ------------------ | ----------------------------------- |
| **Latest (v1.x)**     | ✅ Fully supported | All new features and security fixes |
| v0.x (legacy)         | ❌ End of life     | Upgrade to v1.x                     |
| Experimental branches | ⚠️ Limited         | Use at your own risk                |

> 🔒 **We use [Semantic Versioning](https://semver.org/).** Security patches will increment the **PATCH** version number.

---

## 🚨 Reporting a Vulnerability

If you discover a security flaw, **please do not open a public issue** – that could put users at risk before we have a fix ready.

### 📧 How to Report

1. Send an email to **`security@fed-poster.example.com`** (replace with actual email).
2. Include a clear description of the vulnerability.
3. Provide steps to reproduce, with code or screenshots if possible.
4. Tell us your name/handle if you'd like to be credited (optional).

### ⏳ What to Expect

| Step                          | Timeframe                      |
| ----------------------------- | ------------------------------ |
| **Acknowledgment**            | Within 48 hours                |
| **Investigation & triage**    | 3–5 business days              |
| **Fix development & testing** | Up to 14 days (critical = ASAP)|
| **Public disclosure**         | After patch is released        |

We will work with you to confirm the vulnerability, and we will credit you in the release notes (unless you prefer to remain anonymous).

> 🛡️ **We take every report seriously.** Even if we can't reproduce it, we will investigate thoroughly.

---

## 🔒 Security Best Practices for Fed-Poster

Because Fed-Poster runs entirely in your browser, **your credentials are stored locally** in `localStorage`. While convenient, this means you must take extra care:

- ✅ **Use app‑specific passwords** wherever possible (Bluesky, GitHub, WordPress).
- ✅ **Limit token scopes** – e.g., for GitHub, use a token with only the `gist` or `repo` scope you need.
- ✅ **Rotate your tokens regularly** – revoke unused tokens via each platform's settings.
- ✅ **Avoid using Fed-Poster on public or shared computers** – if you must, clear your browser data after each session.
- ✅ **Keep your browser and OS updated** – to protect against cross‑site scripting and other attacks.
- ❌ **Never share your `localStorage` data** – it contains sensitive tokens.
- ❌ **Don't use your main account passwords** – always use tokens or app passwords.

### 📦 Third‑Party Integrations

Fed-Poster uses Supabase Edge Functions for Tumblr, SafeW, and DeviantArt OAuth. These functions **do not store** any of your data – they act as stateless proxies. All communication is over HTTPS.

---

## 🗑️ Disclosure Policy

- We will **not** publicly disclose a vulnerability until a fix has been released.
- We will give credit to the reporter in the patch notes (unless you opt out).
- We will provide a **detailed changelog** entry describing the fix.

---

## 📬 Contact

For any security‑related inquiries, reach out to us at:

📧 **business@fedpromptly.com**  
🔐 PGP key: [available upon request]

---

<div align="center">
  <sub>🔰 <strong>Together, we keep Fed-Poster safe for everyone.</strong></sub>
</div>
