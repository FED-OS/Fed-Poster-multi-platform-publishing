#!/usr/bin/env python3
"""
Integrate the FED Ecosystem (About) page into the Fed-Poster site:
  1. Add Font Awesome + fedposter.css + fedposter.js links to <head>
  2. Insert the site navbar at the top of <body> (with About link, active)
  3. Reposition .header-actions below the navbar to avoid overlap
  4. Add CSS overrides so the site navbar matches the about page's neon dark aesthetic
  5. Apply data-theme="dark" so fedposter.js theme picker initializes cleanly
  6. Add a small theme bridge: keep the about page dark even if user picks a light theme
     (the about page is intentionally a fixed dark visual showcase)
"""
import re

ABOUT = "/workspace/extracted_e264/site/about.html"

with open(ABOUT, "r", encoding="utf-8") as f:
    html = f.read()

original_len = len(html)

# ── 1. Add <html data-theme="dark"> so fedposter.js theme picker initializes ──
html = html.replace('<html lang="en">', '<html lang="en" data-theme="dark">', 1)

# ── 2. Insert Font Awesome + fedposter.css + fedposter.js in <head> (before </head>) ──
head_inject = (
    '    <!-- Fed-Poster site integration -->\n'
    '    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />\n'
    '    <link rel="stylesheet" href="assets/fedposter.css" />\n'
)
# Insert the CSS links right before the inline <style> to keep page styles winning where needed
html = html.replace('    <style>', head_inject + '    <style>', 1)

# ── 3. Define the site navbar (matches other pages, with About link + active state) ──
navbar = (
    '    <!-- Fed-Poster site navbar -->\n'
    '    <nav class="navbar">\n'
    '      <div class="nav-inner">\n'
    '        <a href="index.html" class="nav-brand">\n'
    '          <span class="logo-mark"><i class="fa-solid fa-paper-plane"></i></span>\n'
    '          Fed-Poster\n'
    '        </a>\n'
    '        <div class="nav-links">\n'
    '          <a href="index.html">Home</a>\n'
    '          <a href="dashboard.html">Dashboard</a>\n'
    '          <a href="calendar.html">Calendar</a>\n'
    '          <a href="analytics.html">Analytics</a>\n'
    '          <a href="pricing.html">Pricing</a>\n'
    '          <a href="settings.html">Settings</a>\n'
    '          <a href="forum.html">Forum</a>\n'
    '          <a href="about.html" class="active">About</a>\n'
    '        </div>\n'
    '        <div class="nav-right">\n'
    '          <div class="nav-theme-picker"></div>\n'
    '          <a href="dashboard.html" class="btn btn-primary btn-sm">Open App <i class="fa-solid fa-arrow-right"></i></a>\n'
    '          <button class="nav-toggle"><i class="fa-solid fa-bars"></i></button>\n'
    '        </div>\n'
    '      </div>\n'
    '    </nav>\n'
)

# Insert navbar immediately after <body> and before the header-actions block
html = html.replace('<body>', '<body>\n' + navbar, 1)

# ── 4. Reposition .header-actions so it sits below the navbar (right side) ──
# Change the fixed top from 20px to 84px (navbar ~64px + margin) so they no longer overlap.
html = html.replace(
    '.header-actions {\n            position: fixed;\n            top: 20px;\n            right: 24px;',
    '.header-actions {\n            position: fixed;\n            top: 84px;\n            right: 24px;',
    1,
)
# mobile: move down too
html = html.replace(
    '.header-actions {\n                top: 12px;\n                right: 12px;',
    '.header-actions {\n                top: 76px;\n                right: 12px;',
    1,
)

# ── 5. Add body padding-top for the navbar and CSS overrides for the navbar ──
# Insert navbar-override CSS right before the closing </style> of the inline page styles.
navbar_override_css = """
        /* ── Fed-Poster navbar integration: map site navbar to the About page neon dark aesthetic ── */
        body { padding-top: 84px; }
        @media (max-width: 768px) { body { padding-top: 76px; } }

        .navbar {
            position: fixed; top: 0; left: 0; right: 0; z-index: 200;
            background: color-mix(in srgb, var(--bg-base) 80%, transparent);
            backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid rgba(0, 212, 255, 0.08);
        }
        .nav-inner { max-width: 1400px; margin: 0 auto; padding: 0 32px; display: flex; align-items: center; justify-content: space-between; gap: 16px; height: 64px; }
        .nav-brand {
            display: flex; align-items: center; gap: 10px;
            font-family: var(--font-sans); font-weight: 800; font-size: 1.15rem;
            color: var(--text-primary); letter-spacing: -0.02em; flex-shrink: 0; text-decoration: none;
        }
        .nav-brand:hover { color: var(--neon-cyan); }
        .nav-brand .logo-mark {
            width: 32px; height: 32px;
            background: linear-gradient(135deg, var(--neon-cyan), var(--neon-purple));
            border-radius: 9px; display: flex; align-items: center; justify-content: center;
            font-size: 0.9rem; color: #05070e;
            box-shadow: 0 3px 16px rgba(0, 212, 255, 0.25);
        }
        .nav-links { display: flex; align-items: center; gap: 2px; flex-wrap: wrap; }
        .nav-links a {
            padding: 8px 13px; border-radius: var(--radius);
            font-family: var(--font-sans); font-size: 0.85rem; font-weight: 500;
            color: var(--text-secondary); text-decoration: none;
            transition: all .25s ease; white-space: nowrap;
        }
        .nav-links a:hover { color: var(--text-primary); background: rgba(255,255,255,0.04); }
        .nav-links a.active { color: var(--neon-cyan); background: rgba(0,212,255,0.08); font-weight: 600; box-shadow: inset 0 0 0 1px rgba(0,212,255,0.18); }
        .nav-right { display: flex; align-items: center; gap: 10px; }
        .nav-theme-picker { display: flex; gap: 5px; align-items: center; }
        .nav-theme-picker .swatch {
            width: 18px; height: 18px; border-radius: 50%; cursor: pointer;
            border: 2px solid transparent; transition: transform .2s ease, border-color .2s ease; flex-shrink: 0;
        }
        .nav-theme-picker .swatch:hover { transform: scale(1.15); }
        .nav-theme-picker .swatch.active { border-color: var(--text-primary); transform: scale(1.15); box-shadow: 0 0 0 2px rgba(0,212,255,0.18); }
        .navbar .btn.btn-primary {
            font-family: var(--font-sans); font-weight: 600; font-size: 0.82rem;
            padding: 0 16px; height: 36px; border-radius: var(--radius-pill);
            background: linear-gradient(135deg, var(--neon-cyan), var(--neon-purple));
            color: #05070e; border: none; text-decoration: none;
            display: inline-flex; align-items: center; gap: 7px; cursor: pointer;
            box-shadow: 0 4px 18px rgba(0,212,255,0.22); transition: transform .2s ease, box-shadow .2s ease;
        }
        .navbar .btn.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 26px rgba(0,212,255,0.35); }
        .nav-toggle { display: none; font-size: 22px; color: var(--text-primary); background: none; border: none; cursor: pointer; }

        /* Mobile nav */
        @media (max-width: 980px) {
            .nav-links {
                display: none; position: fixed; top: 64px; left: 0; right: 0;
                flex-direction: column; align-items: stretch; gap: 0;
                background: color-mix(in srgb, var(--bg-base) 96%, transparent);
                backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
                border-bottom: 1px solid rgba(0,212,255,0.1); padding: 10px 20px 18px;
            }
            .nav-links.open { display: flex; }
            .nav-links a { padding: 12px 14px; border-radius: 10px; }
            .nav-toggle { display: block; }
            .nav-right .btn.btn-primary { display: none; }
        }
        /* Hide header-actions on small screens to avoid clutter (Subscribe/Sponsor stay on desktop) */
        @media (max-width: 600px) {
            .header-actions { display: none; }
        }
"""

# Inject the override CSS just before the inline </style>
html = html.replace('    </style>', navbar_override_css + '    </style>', 1)

# ── 6. Add fedposter.js before the page's own inline <script> (so window.FedPoster exists) ──
# Insert just before the closing </body> script block. We add it right before the inline script.
# The page's inline script begins with: <script>\n        // ─── ORB CANVAS ...
# We insert fedposter.js right before that opening <script>.
js_inject = '    <script src="assets/fedposter.js"></script>\n'
html = html.replace(
    '    <script>\n        // ─── ORB CANVAS',
    js_inject + '    <script>\n        // ─── ORB CANVAS',
    1,
)

# ── 7. Theme bridge: keep the About page dark regardless of the site theme picker ──
# The about page is a fixed-dark visual showcase. We let the theme picker work for the rest
# of the site, but force the about page's neon dark palette by re-applying bg-base on theme change.
bridge_js = """
        // ── Theme bridge: About page stays dark (neon showcase) regardless of site theme picker ──
        (function(){
            function keepDark(){
                document.documentElement.setAttribute('data-theme','dark');
                // Keep the about page's dark base regardless of fedposter.css theme variables
                document.body.style.background = '';
            }
            // Observe data-theme changes made by fedposter.js theme picker
            const obs = new MutationObserver(keepDark);
            obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
            window.addEventListener('DOMContentLoaded', keepDark);
        })();
"""
# Insert the bridge just before the closing </script> of the inline page script
html = html.replace('    </script>\n\n</body>', bridge_js + '    </script>\n\n</body>', 1)

with open(ABOUT, "w", encoding="utf-8") as f:
    f.write(html)

print(f"Integrated About page. Size: {original_len} -> {len(html)} bytes (+{len(html)-original_len}).")
print("Done.")
