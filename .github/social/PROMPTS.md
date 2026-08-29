[PROMPTS.md](https://github.com/user-attachments/files/31603091/PROMPTS.md)
# 🎨 Fed-Poster — Social Preview Image Prompts

> Prompts for generating the GitHub **social preview** images (the og:image / repository social card shown when the repo is shared on Twitter, LinkedIn, Discord, etc.). GitHub recommends **1280×640px** for the repository social preview. Use these prompts with an image generator (DALL·E, Midjourney, Stable Diffusion, etc.), then upload the result to the repo's Settings → Social preview. Keep the look consistent with the dashboard's design tokens (deep navy background `#0a0e1a`, purple accent `#6c5ce7`, Inter typography).

<div align="center">
  <img src="https://img.shields.io/badge/recommended%20size-1280×640-blue?style=for-the-badge" alt="Size" />
  <img src="https://img.shields.io/badge/theme-Deep%20Space-purple?style=for-the-badge" alt="Theme" />
</div>

---

## 1. Primary Repository Social Preview (1280×640)

> Use as the main GitHub repo social card.

**Prompt:**
> A sleek, modern social media card on a deep navy (#0a0e1a) background with a soft purple radial glow (#6c5ce7) in the upper-right corner. Centered, large bold sans-serif text reading "Fed-Poster" in white, with a smaller tagline beneath: "One Dashboard. Twelve Platforms. Zero Hassle." Below the tagline, a clean horizontal row of twelve minimal, monochrome platform icons (Telegram, Bluesky, Mastodon, Discord, GitHub, Tumblr, DeviantArt, plus abstract icons for proxy platforms) in muted white, evenly spaced. A single thin purple accent line under the title. Subtle frosted-glass dashboard mockup fading into the lower-left corner showing a composer textarea and platform toggle chips. No clutter, generous negative space, premium SaaS aesthetic, Inter font, high contrast, print-ready crisp edges. No photographic humans. 1280×640.

---

## 2. Landing/Hero Banner (1536×1024 — landscape)

> Use at the top of the README or the marketing landing page.

**Prompt:**
> A wide cinematic hero banner for a developer tool called "Fed-Poster", deep space navy gradient background (#0a0e1a to #111726) with a purple-to-violet radial glow. On the left, bold white headline "Post to every platform from your browser" in Inter, with a one-line subhead "Privacy-first. No backend. Your tokens never leave your device." in soft grey. On the right, a floating frosted-glass dashboard mockup with a browser top bar (three colored dots), a composer textarea containing placeholder text, a row of platform toggle chips with small icons (Telegram, Bluesky, Mastodon, Discord, GitHub), and a large gradient "Send to all" button in purple. Subtle particle/grid texture in the far background. Premium, clean, generous whitespace, soft shadows. No text errors, no real logos beyond abstract platform glyphs. 1536×1024.

---

## 3. Feature Highlight Card — "12 Platforms" (1024×1024 — square)

> Use in feature sections or social posts.

**Prompt:**
> A square social card on a deep navy (#0a0e1a) background with a purple radial glow. Centered bold white text "12+ Platforms" at the top. Below it, a 4×3 grid of twelve rounded, frosted-glass tiles, each containing a minimal monochrome platform glyph (Telegram, Bluesky, Mastodon, Discord, GitHub, Tumblr, DeviantArt, plus four abstract glyphs representing proxy/social platforms) with the platform name in small grey text beneath each glyph. A thin purple progress-like accent bar across the bottom. Clean, modern, Inter typography, high contrast, soft shadows, premium SaaS aesthetic. 1024×1024.

---

## 4. Privacy Highlight Card (1024×1024 — square)

> Use to communicate the privacy-first architecture.

**Prompt:**
> A square social card on a deep navy (#0a0e1a) background with a green (#00b894) accent glow. Centered bold white text "Your credentials never leave your browser" with a large shield-with-padlock icon in soft green above it. Below, a small stylized diagram: a laptop on the left (your browser, with a locked `localStorage` vault), arrows going directly to platform clouds on the right (Telegram, Mastodon, Bluesky), with a clear "no server in the middle" gap. A small caption "No backend. No telemetry. HTTPS only." in grey. Inter font, clean, minimal, trustworthy, premium. 1024×1024.

---

## 5. Theme Showcase Card (1536×1024 — landscape)

> Use to show off the twelve themes.

**Prompt:**
> A wide showcase banner for a theming system. Deep navy background. Bold white title "12 Built-in Themes" top-left. Below, a 4×3 grid of twelve rounded swatches, each filled with a distinct gradient representing a theme: deep navy→purple (Deep Space), light grey→purple (Cloud), deep blue→azure (Azure Depth), dark green→emerald (Emerald Forest), indigo→violet (Royal Nebula), dark→fiery orange (Molten Lava), near-black→hot pink (Cyberpunk), dusk→coral (Sunset), deep teal→teal (Abyssal Teal), warm→blush (Luxe Blush), steel blue→bright (Cobalt Steel), near-black→magenta (Synthwave). Each swatch labeled in small white text. Clean grid, generous gaps, soft shadows, Inter typography, premium. 1536×1024.

---

## 6. Pricing Teaser Card (1024×1024 — square)

> Use for pricing announcements.

**Prompt:**
> A square social card on a deep navy (#0a0e1a) background with a purple glow. Bold white headline "Post to 500+ platforms" at top. Below, three frosted-glass pricing tiles side by side, labeled "Starter $27", "Growth $147", "Agency $497" in white with feature bullets in grey beneath each. The middle (Growth) tile is highlighted with a purple gradient border and a small "Popular" badge. A line at the bottom in grey: "7-day free trial. No credit card." Inter font, clean, premium SaaS pricing aesthetic, soft shadows, high contrast. 1024×1024.

---

## 7. Open Graph / Default Share Image (1200×630)

> Generic og:image for link unfurls across the web.

**Prompt:**
> A clean 1200×630 link-preview card on a deep navy (#0a0e1a) gradient background with a soft purple radial glow top-right. Left-aligned, large bold white wordmark "Fed-Poster" with a small paper-plane 📨 glyph. Beneath it, the tagline "One Dashboard. Twelve Platforms. Zero Hassle." in white, and a second line "Privacy-first, browser-native social posting" in soft grey. A thin row of twelve tiny monochrome platform glyphs along the bottom. Minimal, premium, high contrast, Inter typography, no photographic humans, no clutter. 1200×630.

---

## Generation & Upload Notes

- Generate at the listed dimensions (or the closest supported size, then crop to exact pixels).
- After generation, optionally composite the real **Fed-Poster wordmark** and exact platform glyphs on top in Figma/Canva for pixel-perfect branding — image generators sometimes mangle text.
- Upload the primary 1280×640 card to **GitHub → Repo Settings → Social preview**.
- Reference the others from the README, the landing page, and social posts; store them under a `brand/` or `.github/social/` folder (do not commit huge generations to `main` lightly — consider Git LFS or a release asset).
- Keep a consistent visual language across all cards: Deep Space navy, purple accent, Inter font, frosted-glass panels, soft glows — matching `assets/fedposter.css`.

---

<div align="center">
  <sub>🎨 <strong>Consistent, premium, on-brand. The social card is the first impression — make it count.</strong></sub>
</div>
