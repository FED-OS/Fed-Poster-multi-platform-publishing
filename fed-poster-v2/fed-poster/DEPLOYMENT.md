# 🚀 Deployment Guide

<div align="center">
  <img src="https://img.shields.io/badge/deploy-static%20%2F%20container%20%2F%20edge-blue?style=for-the-badge" alt="Deploy" />
  <img src="https://img.shields.io/badge/time-~5%20min-green?style=for-the-badge" alt="Time" />
</div>

Fed-Poster is a **static front-end** (HTML + CSS + JS) with optional **Supabase Edge Functions** for OAuth proxies. That means you can deploy it almost anywhere. This guide covers the recommended options from simplest to most flexible.

> 🔑 **Principle:** The front-end has no server state. Credentials live in the user's browser (`localStorage`). You only need a backend if you enable Tumblr / SafeW / DeviantArt OAuth (see [ADR-0005](ADR.md#adr-0005-use-supabase-edge-functions-for-oauth-proxies)).

---

## 🧭 Choose Your Deployment

| Option                | Best for                          | Backend needed? | Difficulty |
|-----------------------|-----------------------------------|-----------------|------------|
| **GitHub Pages**      | Free, zero-config, open-source hosting | No          | ⭐ Easy    |
| **Cloudflare Pages**  | Fast global CDN, free, generous    | No              | ⭐ Easy    |
| **Netlify / Vercel**  | CI/CD, previews, serverless funcs  | Optional (funcs)| ⭐⭐ Medium |
| **Docker (self-host)**| Full control, on-prem, air-gapped  | Optional        | ⭐⭐⭐ Advanced |
| **Nginx/Caddy (VPS)** | Self-host on your own server       | Optional        | ⭐⭐⭐ Advanced |

---

## 1️⃣ GitHub Pages (Easiest — Free)

Fed-Poster is a static site, so GitHub Pages is a perfect zero-cost home.

```bash
# From your fork's main branch, the site root is the repo root.
```

1. Push your code to `main`.
2. In your repo: **Settings → Pages**.
3. **Source:** Deploy from a branch → **`main` / `(root)`** → Save.
4. Wait ~1 minute. Your site is live at `https://<your-username>.github.io/Fed-Poster/`.

> ✅ Because `index.html` and `styles.css` use **relative paths**, it works under any subpath — no build step required.

### GitHub Actions (optional CI deploy)

Add `.github/workflows/deploy.yml` to build and deploy on push. (Dependabot is already configured via [`.github/dependabot.yml`](.github/dependabot.yml) to keep your deploy action versions current.)

---

## 2️⃣ Cloudflare Pages

1. Go to **Cloudflare → Pages → Create project → Connect to Git**.
2. Select your Fed-Poster fork.
3. **Build command:** *(none — it's static)*.
4. **Build output directory:** `/` (root).
5. Deploy. You get a `*.pages.dev` URL and can attach a custom domain for free.

> ⚡ Cloudflare's edge gives excellent global latency for a static dashboard.

---

## 3️⃣ Netlify or Vercel

### Netlify
1. **Add new site → Import from Git** → choose your repo.
2. **Build command:** leave empty (or `npm run build` if you add a bundler).
3. **Publish directory:** `.` (repo root).
4. Deploy.

### Vercel
1. **New Project → Import** your repo.
2. **Framework Preset:** Other / Static.
3. **Output directory:** `.`.
4. Deploy.

Both give you **preview deployments per PR**, which is great for reviewing UI changes before merge.

---

## 4️⃣ Docker (Self-Host)

### Quick run

```bash
# Build a tiny static image served by nginx
docker build -t fed-poster .
docker run -d -p 8080:80 --name fed-poster fed-poster
# → http://localhost:8080
```

### Example `Dockerfile`

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build   # if a build step exists; otherwise skip

FROM nginx:alpine
COPY --from=build /app /usr/share/nginx/html
# Copy these two if no build step:
# COPY index.html styles.css /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### `docker-compose.yml`

```yaml
version: "3.9"
services:
  fed-poster:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
    environment:
      - TZ=UTC
```

```bash
docker-compose up -d
```

---

## 5️⃣ Nginx / Caddy on a VPS

### Nginx

```nginx
server {
    listen 80;
    server_name poster.example.com;
    root /var/www/fed-poster;
    index index.html;

    # Security headers (see SECURITY.md hardening checklist)
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header Referrer-Policy "no-referrer" always;
    add_header Content-Security-Policy "default-src 'self'; ..." always;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Then enable HTTPS with **Let's Encrypt / certbot**.

### Caddy (auto-HTTPS)

```caddyfile
poster.example.com {
    root * /var/www/fed-poster
    file_server
    header {
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        Referrer-Policy no-referrer
    }
}
```

```bash
caddy run   # Caddy provisions & renews TLS automatically
```

---

## 🔌 Enabling OAuth Integrations (Supabase Edge Functions)

If you want Tumblr, SafeW, or DeviantArt, deploy the edge functions:

1. Create a project at [supabase.com](https://supabase.com).
2. Add your platform OAuth client secrets to Supabase **Edge Function secrets** (never in the repo).
3. Deploy the functions from the `supabase/functions/` directory:
   ```bash
   supabase functions deploy tumblr-oauth
   supabase functions deploy safew-oauth
   supabase functions deploy deviantart-oauth
   ```
4. Set your function URLs in a `.env` (see `.env.example`):
   ```env
   VITE_SUPABASE_URL=https://<your-project>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon-key>
   ```
5. Restrict the function origins to your domain in Supabase settings.

> 🔒 The functions are **stateless proxies** — they exchange OAuth codes for tokens and return them to the client. No user data is stored. See [ADR-0005](ADR.md#adr-0005-use-supabase-edge-functions-for-oauth-proxies) and [SECURITY.md](SECURITY.md).

---

## 🔧 Environment Variables

Create a `.env` (gitignored) from `.env.example`. Only non-secret values should be prefixed `VITE_`/exposed to the client. **Never** put OAuth client secrets in the front-end.

| Variable                       | Where used        | Example                                   |
|--------------------------------|-------------------|-------------------------------------------|
| `VITE_SUPABASE_URL`            | OAuth proxies     | `https://xyz.supabase.co`                 |
| `VITE_SUPABASE_ANON_KEY`       | OAuth proxies     | `eyJhbGci...`                             |
| `VITE_ZAPIER_WEBHOOK_URL`      | Zapier extension  | *(user-specific, optional)*               |
| *(secrets)*                    | Edge Functions only | set in Supabase, not in repo              |

---

## ✅ Production Checklist

Before going live:

- [ ] Serving over **HTTPS** with a valid certificate.
- [ ] Security headers set (`CSP`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`).
- [ ] `.env` is **not** committed (verified `.gitignore` covers it).
- [ ] OAuth client secrets are in Supabase, not the repo.
- [ ] Dependencies are up to date (Dependabot enabled).
- [ ] `index.html` and `styles.css` use relative paths (works under any subpath).
- [ ] Custom domain configured (optional) with DNS pointing to your host.
- [ ] Tested the deploy on a clean browser (no cached tokens).
- [ ] Error monitoring configured (e.g., Sentry — optional).

---

## 🔄 CI/CD Suggested Pipeline

1. **PR opened** → lint, test, build, deploy **preview** (Netlify/Vercel).
2. **Review & approval** → squash-merge to `main`.
3. **Push to `main`** → build → deploy to production (Pages/Cloudflare/Vercel).
4. **Release tag** → generate CHANGELOG entry, publish GitHub Release.

---

## 🧯 Rollback

- **Static hosts (Pages/Cloudflare/Netlify/Vercel):** each deploy is immutable; revert via the dashboard or redeploy a previous commit.
- **Docker:** `docker-compose down && docker run <previous-tag>`.
- **Keep releases tagged** (e.g., `v2.0.0`) so you can redeploy any version.

---

## 🆘 Troubleshooting

| Symptom                          | Likely cause / fix                                   |
|----------------------------------|------------------------------------------------------|
| Blank page after deploy          | Paths not relative → ensure `styles.css` is relative |
| OAuth integration 401            | Edge function URL/secret mismatch in Supabase        |
| Mixed-content warnings           | Platform loading over HTTP → enforce HTTPS           |
| Tokens not persisting            | `localStorage` disabled by browser / private mode    |
| CORS errors on direct APIs       | Some platforms require server-side calls → use proxy |

See [SUPPORT.md](SUPPORT.md) for more help channels.

---

<div align="center">
  <sub>🚀 <strong>Ship it. Then iterate.</strong></sub>
</div>
