# 🖼️ Fed-Poster — Social Preview Assets & Prompts

<div align="center">
  <img src="https://img.shields.io/badge/assets-social%20preview-7c5cfc?style=for-the-badge" alt="Social Preview" />
  <img src="https://img.shields.io/badge/size-1280x640-blue?style=for-the-badge" alt="Size" />
</div>

This folder holds **social preview assets** for Fed-Poster — the image shown when the repo is shared on social media, GitHub, Discord, Slack, etc. — plus the **generation prompts** used to create them (so anyone can regenerate or remix consistently).

> 📐 **Recommended size:** `1280×640` px (GitHub social preview / Open Graph standard). Use PNG for crispness.

---

## 🎨 Brand Guidelines (use in every prompt)

Keep visuals on-brand so previews are instantly recognizable:

- **Product name:** `Fed-Poster` (with the hyphen). Tagline: *One Dashboard. Every Platform. Zero Hassle.*
- **Logo mark:** a stylized paper-plane / send icon on a rounded gradient tile.
- **Palette (from `styles.css` `:root`):**
  - Background: `#07090f` (deep space) → `#0e111c` (surface)
  - Accent gradient: `#7c5cfc` (purple) → `#5b8def` (blue) → `#f472b6` (pink)
  - Text: `#edf0fa` (primary), `#8890b0` (secondary)
  - Gold accent: `#f59e0b` → `#fbbf24`
- **Type:** `Inter` (or geometric sans-serif equivalent). Bold, tight tracking for the wordmark.
- **Vibe:** sleek, modern, dark-mode dashboard, soft glow, rounded corners (`~20px`), subtle grid/dots.
- **Iconography:** Font Awesome style line icons for platforms (Telegram, Bluesky, Mastodon, Discord, GitHub, etc.).

---

## 🧩 Required Assets

| File                        | Purpose                          | Size         | Status |
|-----------------------------|----------------------------------|--------------|--------|
| `social-preview.png`        | GitHub repo social preview       | 1280×640     | Generate |
| `og-image.png`              | Open Graph image (website)       | 1200×630     | Generate |
| `twitter-card.png`          | X/Twitter summary large card     | 1200×675     | Generate |
| `logo.png`                  | Standalone logo mark             | 512×512      | Generate |
| `logo-wordmark.png`         | Logo + "Fed-Poster" text         | 1280×320     | Generate |
| `banner.png`                | Repo header banner               | 2560×600     | Generate |
| `favicon.png`               | Browser favicon                  | 64×64        | Generate |

> Place generated images in this folder (`assets/social-preview/`). Reference them from `index.html` (`<meta property="og:image" ...>`) and the repo's social preview setting.

---

## 🤖 Generation Prompts

Copy these into your image generator (DALL·E, Midjourney, Stable Diffusion, etc.). Adjust `--ar`/dimensions per tool. All prompts enforce the brand guidelines above.

### 1. `social-preview.png` — GitHub Social Preview (1280×640)

```
A sleek dark-mode product social preview card, 1280x640, deep space background
#07090f fading to #0e111c. Centered: a glowing rounded tile (corner radius 20px)
with a stylized white paper-plane / send icon over a diagonal gradient from
purple #7c5cfc to blue #5b8def to pink #f472b6. Below the tile, the wordmark
"Fed-Poster" in bold Inter typeface, color #edf0fa, tight letter spacing, with
the tagline "One Dashboard. Every Platform. Zero Hassle." in #8890b0 beneath.
A subtle row of small platform icons (Telegram, Bluesky, Mastodon, Discord,
GitHub, Tumblr) along the bottom in muted blue. Soft purple glow, faint dot grid
texture, modern SaaS aesthetic, no photographic elements, no extra text.
```

### 2. `og-image.png` — Open Graph (1200×630)

```
Open Graph share image, 1200x630, dark background #07090f with a faint diagonal
gradient. Left side: the Fed-Poster wordmark in bold white Inter and the tagline
"One Dashboard. Every Platform. Zero Hassle." in muted grey #8890b0. Right side:
a glowing rounded dashboard mockup card showing a multi-platform composer with
checkboxes for Telegram, Bluesky, Mastodon, Discord, GitHub, and a purple "Send"
button. Accent gradient purple #7c5cfc to blue #5b8def to pink #f472b6. Soft glow,
rounded 20px corners, clean SaaS look, no photographic elements, no extra text.
```

### 3. `twitter-card.png` — X Summary Card (1200×675)

```
Twitter summary large image, 1200x675, dark mode. Bold "Fed-Poster" wordmark in
white Inter at top-left, tagline "Publish everywhere from one dashboard." beneath
in grey. Center-right: a stylized send/paper-plane icon on a rounded gradient
tile (purple #7c5cfc → blue #5b8def → pink #f472b6) with soft glow. A row of
muted platform icons along the bottom (Telegram, Bluesky, Mastodon, Discord,
GitHub, Tumblr, Reddit, LinkedIn). Deep space background #07090f, subtle dot
grid, modern, minimal, no photos, no extra text.
```

### 4. `logo.png` — Logo Mark (512×512)

```
App icon, 512x512, centered on a dark rounded-square tile #0e111c with corner
radius 96px. Inside: a white stylized paper-plane / send icon over a diagonal
gradient purple #7c5cfc to blue #5b8def to pink #f472b6. Soft purple glow around
the tile. Flat, modern, minimal, no text, no photographic elements.
```

### 5. `logo-wordmark.png` — Logo + Wordmark (1280×320)

```
Horizontal lockup, 1280x320, transparent or dark background. Left: a rounded
gradient tile (purple #7c5cfc → blue #5b8def → pink #f472b6) with a white
paper-plane icon. Right: "Fed-Poster" in bold white Inter, tight tracking. Clean,
minimal, modern, no extra text, no photos.
```

### 6. `banner.png` — Repo Header Banner (2560×600)

```
Wide repo banner, 2560x600, dark gradient background #07090f to #0e111c. Centered
"Fed-Poster" wordmark in bold white Inter with the tagline "One Dashboard. Every
Platform. Zero Hassle." in grey #8890b0. A glowing paper-plane gradient icon above
the text (purple #7c5cfc → blue #5b8def → pink #f472b6). A faint row of platform
icons (Telegram, Bluesky, Mastodon, Discord, GitHub, Tumblr, Reddit, LinkedIn,
WordPress, Medium) spread along the bottom in muted blue. Subtle dot grid, soft
glow, modern SaaS, no photos, no extra text.
```

### 7. `favicon.png` — Favicon (64×64)

```
Favicon, 64x64, rounded-square dark tile #0e111c with a small white paper-plane
icon over a purple-to-blue gradient. Simple, high-contrast, readable at 16x16,
no text.
```

---

## 🏷️ Using the Previews

### GitHub repo social preview
1. Generate `social-preview.png` (1280×640) from the prompt above.
2. Repo **Settings → Social preview → Edit → Upload** → Save.

### Open Graph (website)
Add to `<head>` in `index.html`:
```html
<meta property="og:image" content="https://your-domain/assets/social-preview/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://your-domain/assets/social-preview/twitter-card.png" />
```

### Favicon
```html
<link rel="icon" type="image/png" href="assets/social-preview/favicon.png" />
```

---

## 🔁 Regenerating / Remixing

- Reuse the **Brand Guidelines** + prompts to regenerate consistently.
- Variations (e.g. light theme, seasonal) should still keep the wordmark, palette, and paper-plane mark.
- If the brand palette changes in `styles.css`, update the hex values in these prompts to match.

---

## 📜 License

Preview assets generated from these prompts are released under the project's **MIT License** (see [LICENSE](../../LICENSE)), unless they incorporate third-party trademarked logos. Platform logos (Telegram, Discord, etc.) are trademarks of their owners — use them only as factual references to supported integrations and follow each platform's brand guidelines.

---

<div align="center">
  <sub>🖼️ <strong>First impressions matter — make them consistent.</strong></sub>
</div>
