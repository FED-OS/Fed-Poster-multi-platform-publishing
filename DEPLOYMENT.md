# 🚀 Fed-Poster Deployment Guide

> How to ship Fed-Poster from a working copy to a live URL. Because the app is a **static, multi-page site with no required backend** (ADR-001), deployment is mostly "push files to a static host." This guide covers the common targets, the optional backend for self-hosters who want persistent scheduling, the Supabase edge functions for OAuth platforms, and the operational checklist for a safe release.

<div align="center">
  <img src="https://img.shields.io/badge/type-static%20site-success?style=for-the-badge" alt="Static site" />
  <img src="https://img.shields.io/badge/backend-optional-blue?style=for-the-badge" alt="Backend optional" />
  <img src="https://img.shields.io/badge/build%20step-none-brightgreen?style=for-the-badge" alt="No build step" />
</div>

---

## 📦 Prerequisites

- A working copy of the repo on `main` (or your release branch), with all changes committed.
- `CHANGELOG.md` `[Unreleased]` promoted to a versioned section (see ADR-009 / SemVer).
- The version badge in `README.md` / `index.html` bumped to match.
- No real credentials, tokens, or secrets anywhere in the tree (run the secret-scan below before shipping).
- Node.js 20.x **only if** you're deploying the optional backend or the Supabase functions.

### Pre-deploy secret scan
```bash
# Fail fast if a real-looking token slipped in. Adjust patterns per platform as needed.
grep -rnIE "(bot[0-9]{6,}:|xox[baprs]-|ghp_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,}|AIza[A-Za-z0-9_-]{30,})" \
  --include="*.html" --include="*.js" --include="*.css" --include="*.md" . \
  | grep -v "your-" | grep -v "example" | grep -v "placeholder"
# Expected: no output. Any hit = block the deploy.
```

---

## 🌐 Option A — Static hosting (recommended; covers 95% of cases)

Fed-Poster is a set of static `*.html` files plus the `assets/` directory. Any static host works. The homepage is `index.html`.

### A1. GitHub Pages
1. Push your release to the default branch.
2. Settings → Pages → Source: `Deploy from a branch` → branch `main` / root.
3. Wait ~1 minute; site lives at `https://<user>.github.io/fed-poster/`.
4. **Note:** GitHub Pages serves over HTTPS — required for the privacy promise and for most platform APIs.
5. For a custom domain, add a `CNAME` file containing your domain and configure DNS.

### A2. Netlify
1. Connect the repo (or drag the folder into the Netlify deploy panel).
2. Build command: *(none)*. Publish directory: `.` (repo root).
3. Add a `netlify.toml` (optional) for headers/CSP (see the Hardening section).
4. Site lives at `https://<random>.netlify.app`; map a custom domain in Domain settings.

### A3. Vercel
1. Import the repo.
2. Framework preset: **Other**. Build command: *(leave empty)*. Output directory: `.`.
3. Add headers via `vercel.json` for CSP (see Hardening).
4. Live at `https://<project>.vercel.app`.

### A4. Cloudflare Pages
1. Connect repo; build command empty; output dir `.`.
2. Cloudflare gives free HTTPS, edge caching, and an easy `assets/` cache policy.
3. Live at `https://<project>.pages.dev`.

### A5. S3 + CloudFront (or any S3-compatible object store)
```bash
# Sync the tree, excluding scratch files
aws s3 sync . s3://your-bucket/ \
  --exclude ".git/*" --exclude ".screenshots/*" \
  --exclude "node_modules/*" --exclude "*.local" \
  --delete --cache-control "public, max-age=300"
# Invalidate the CloudFront distribution after updates
aws cloudfront create-invalidation --distribution-id EXXXXX --paths "/*"
```
Set the bucket/index-document to `index.html` and the error document to `404.html`.

### A6. Any plain web server (nginx, Caddy, Apache)
```nginx
server {
  listen 443 ssl http2;
  server_name poster.example.com;
  root /var/www/fed-poster;
  index index.html;
  # Send unknown paths to the branded 404
  error_page 404 /404.html;
  # Long-cache the immutable assets, short-cache HTML
  location ~* \.(?:js|css|woff2?|png|jpg|jpeg|gif|svg|ico)$ {
    expires 30d; add_header Cache-Control "public, immutable";
  }
  location / { try_files $uri $uri/ /404.html; }
  # Strong CSP (see Hardening)
  add_header Content-Security-Policy "default-src 'self'; img-src 'self' https: data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; script-src 'self' https://cdnjs.cloudflare.com; connect-src 'self' https:; frame-src https://ko-fi.com; base-uri 'self'; form-action 'self';" always;
}
```

---

## ⚙️ Option B — Optional backend (persistent scheduling only)

If you need scheduled posts to fire even when the browser is closed, deploy the optional Node/Express scheduling daemon. **This is not required for any posting flow** — it's an opt-in enhancement for self-hosters (ADR-001).

```bash
git clone https://github.com/fedpromptly/fed-poster.git
cd fed-poster
cp .env.example .env        # configure ports + an encryption key for the queue
npm ci                      # backend deps only (frontend needs no install)
npm run start:server        # or use the provided docker-compose.yml
```
The daemon stores a **locally-encrypted** posting queue (never plaintext credentials) and triggers posts at their scheduled time. Frontend talks to it over HTTPS only. Never expose this port unauthenticated on the public internet — put it behind the same origin or an authenticated reverse proxy.

### Docker (full stack, optional backend)
```bash
docker compose up -d        # frontend static + optional scheduler
docker compose logs -f
```
The compose file builds the static frontend and runs the scheduler with a mounted, encrypted queue volume.

---

## 🔌 Option C — Supabase Edge Functions (OAuth platforms)

Tumblr, SafeW, and DeviantArt OAuth flows require the stateless edge functions (ADR-005). These are **not** deployed by the static host — deploy them to your own Supabase project if you offer those platforms.

```bash
# From the supabase/ directory (if/when present)
supabase functions deploy tumblr-oauth --no-verify-jwt
supabase functions deploy safew-oauth   --no-verify-jwt
supabase functions deploy deviantart-oauth --no-verify-jwt
```
Set the required env vars (client ID/secret per platform) in the Supabase project settings. **Confirm the functions are stateless**: no DB writes, no logging of tokens, HTTPS only. Document the deployed function URLs so the frontend can call them.

If you self-host **without** Supabase, those three platforms are simply unavailable — everything else works.

---

## 🛡️ Hardening Checklist (apply on any managed host)

- [ ] **HTTPS only.** Force redirects from HTTP. Required for platform APIs and for the privacy promise.
- [ ] **Content-Security-Policy.** Ship a strict CSP (see the nginx example). `default-src 'self'`; allow `fonts.googleapis.com`, `cdnjs.cloudflare.com` for the CDN assets; allow `connect-src https:` for platform APIs; allow `frame-src https://ko-fi.com` for the funding widget; disallow `unsafe-eval`.
- [ ] **Subresource Integrity (SRI).** Add `integrity=` hashes to the Font Awesome and Google Fonts `<link>` tags so a CDN compromise can't inject code.
- [ ] **Referrer-Policy:** `strict-origin-when-cross-origin` so platform tokens in URLs (if any) don't leak.
- [ ] **X-Content-Type-Options: nosniff**, **X-Frame-Options: DENY** (unless you intentionally embed), **Permissions-Policy** locking down camera/mic/geolocation.
- [ ] **Cache policy:** immutable long-cache for `assets/*`, short-cache for `*.html` so updates roll out fast.
- [ ] **404 page:** confirm `404.html` is wired as the error document.
- [ ] **Secret scan passed** (see Prerequisites).

---

## 🧪 Pre-release Verification

Walk this list before announcing a deploy:

- [ ] Open the deployed URL in a fresh browser profile (no cached state).
- [ ] Landing page loads, hero renders, nav works, theme picker persists across reload.
- [ ] Cycle through 2–3 themes; verify no broken tokens/contrast.
- [ ] Mobile viewport (375px): nav toggle, composer, cards all usable.
- [ ] DevTools Console: zero errors. Network: no failed/HTTP requests.
- [ ] localStorage after using a panel: all keys prefixed `fedposter_`.
- [ ] If OAuth platforms are offered: complete one OAuth round-trip (e.g. Tumblr) end to end.
- [ ] Ko-fi widget opens from a CTA button.
- [ ] `404.html` renders for a bogus path.
- [ ] `CHANGELOG.md` version section matches the deployed version; README badge matches.

---

## 🚦 Release Procedure

1. Merge the release PR into `main` (all checklist items above green).
2. Tag: `git tag -s v1.X.Y -m "Fed-Poster v1.X.Y"` and `git push --tags`.
3. Publish a GitHub Release pasting the `CHANGELOG.md` section for that version; attach any deliverable screenshots.
4. Trigger the static deploy (auto on most hosts via the tag/branch push; manual sync for S3).
5. If Supabase functions changed, redeploy them and update the documented URLs.
6. Post the release note to [Discussions → Announcements](https://github.com/fedpromptly/fed-poster/discussions/categories/announcements).
7. If a security fix, follow the disclosure timeline in `SECURITY.md`.

---

## 🔁 Rollback

- **Static host:** redeploy the previous tag/commit. Because there's no backend state, rollback is near-instant. Clear edge cache / invalidate CDN.
- **Optional backend:** redeploy the previous scheduler image; the encrypted queue volume is forward/backward compatible within a minor.
- **Supabase functions:** redeploy the previous function version; functions are stateless so no data migration is needed.
- **Communicate:** drop a note in Announcements if the rollback is user-visible.

---

## 🧭 Environment Variables Reference

The frontend (static site) needs **zero** environment variables — everything is user-supplied at runtime. The optional backend and Supabase functions use:

| Var | Where | Purpose |
|-----|-------|---------|
| `SCHEDULER_PORT` | optional backend | Port the scheduling daemon listens on |
| `QUEUE_ENCRYPTION_KEY` | optional backend | Key encrypting the at-rest posting queue |
| `TUMBLR_CLIENT_ID` / `TUMBLR_CLIENT_SECRET` | Supabase fn | Tumblr OAuth app creds |
| `SAFEW_CLIENT_ID` / `SAFEW_CLIENT_SECRET` | Supabase fn | SafeW OAuth app creds |
| `DEVIANTART_CLIENT_ID` / `DEVIANTART_CLIENT_SECRET` | Supabase fn | DeviantArt OAuth app creds |

Never commit these. They live in your host's secret store or Supabase project settings.

---

## 🆘 Troubleshooting

- **Posts fail with CORS errors:** the platform blocks direct browser calls; you need the proxy bridge (Buffer/Jetpack) or, for OAuth platforms, the Supabase function. Check the platform's row in `wiki/`.
- **OAuth platforms 404:** the edge functions aren't deployed to your Supabase project, or their URLs aren't wired into the frontend settings.
- **Theme resets on reload:** `localStorage` is being cleared by a privacy extension or the page is served from a different origin than when the theme was set.
- **Mixed-content warnings:** the host is serving over HTTP while a script/asset is HTTPS. Force HTTPS at the host level.
- **Ko-fi widget doesn't open:** confirm `assets/kofi-widget.js` loaded and the CTA has a `data-kofi` attribute; check the CSP allows `frame-src https://ko-fi.com`.

---

<div align="center">
  <sub>🚀 <strong>Static-first, privacy-always. Deploy in minutes.</strong></sub>
</div>
