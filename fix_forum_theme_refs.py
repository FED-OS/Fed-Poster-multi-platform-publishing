#!/usr/bin/env python3
"""Fix null reference errors in forum.html after header replacement.
The forum's JS references #themeToggle, #themeIcon, #themeDropdown which were
in the old forum header. We:
1. Add a hidden #themeDropdown with the 7 theme-option elements (so setTheme works)
2. Add a hidden #themeIcon element (so themeIcon.className works)
3. Make themeToggle.addEventListener null-safe
4. Make themeDropdown references null-safe in the click handler
"""
import re

forum_path = "/workspace/extracted_e264/site/forum.html"

with open(forum_path, "r", encoding="utf-8") as f:
    html = f.read()

print(f"forum.html: {len(html)} chars")

# ============================================================
# 1. Add hidden theme elements right after the navbar
#    (hidden so they exist in DOM but aren't visible)
# ============================================================
# Find the </nav> that closes the navbar
nav_close = html.find('</nav>')
if nav_close == -1:
    print("ERROR: Could not find </nav>")
    exit(1)
nav_close += len('</nav>')

hidden_theme_elements = """
    <!-- Hidden theme elements for forum JS compatibility (header was replaced with site navbar) -->
    <div style="display:none;" aria-hidden="true">
        <i id="themeIcon" class="fas fa-palette"></i>
        <div class="theme-dropdown" id="themeDropdown">
            <div class="theme-dropdown-label">Theme</div>
            <button class="theme-option" data-theme-val="dark"><span class="theme-swatch" style="background:linear-gradient(135deg,#0e0e14,#7c5cfc);"></span> Dark <i class="fas fa-check theme-check"></i></button>
            <button class="theme-option" data-theme-val="light"><span class="theme-swatch" style="background:linear-gradient(135deg,#f7f7fb,#7c5cfc);"></span> Light <i class="fas fa-check theme-check"></i></button>
            <button class="theme-option" data-theme-val="ocean"><span class="theme-swatch" style="background:linear-gradient(135deg,#07131c,#22d3ee);"></span> Ocean <i class="fas fa-check theme-check"></i></button>
            <button class="theme-option" data-theme-val="forest"><span class="theme-swatch" style="background:linear-gradient(135deg,#0a120c,#4ade80);"></span> Forest <i class="fas fa-check theme-check"></i></button>
            <button class="theme-option" data-theme-val="sunset"><span class="theme-swatch" style="background:linear-gradient(135deg,#1a0d10,#fb923c);"></span> Sunset <i class="fas fa-check theme-check"></i></button>
            <button class="theme-option" data-theme-val="midnight"><span class="theme-swatch" style="background:linear-gradient(135deg,#05060f,#818cf8);"></span> Midnight <i class="fas fa-check theme-check"></i></button>
            <button class="theme-option" data-theme-val="rose"><span class="theme-swatch" style="background:linear-gradient(135deg,#160a12,#e879f9);"></span> Rose <i class="fas fa-check theme-check"></i></button>
        </div>
    </div>"""

html = html[:nav_close] + hidden_theme_elements + html[nav_close:]
print("✅ Step 1: Added hidden theme elements (#themeIcon, #themeDropdown with 7 theme-options)")

# ============================================================
# 2. Make themeToggle.addEventListener null-safe
# ============================================================
old_listener = """        themeToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            themeDropdown.classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
            if (!themeDropdown.contains(e.target) && e.target !== themeToggle) {
                themeDropdown.classList.remove('open');
            }
        });"""

new_listener = """        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                if (themeDropdown) themeDropdown.classList.toggle('open');
            });
        }
        document.addEventListener('click', (e) => {
            if (themeDropdown && !themeDropdown.contains(e.target) && e.target !== themeToggle) {
                themeDropdown.classList.remove('open');
            }
        });"""

if old_listener in html:
    html = html.replace(old_listener, new_listener, 1)
    print("✅ Step 2: Made themeToggle/themeDropdown event listeners null-safe")
else:
    print("⚠ Step 2: Could not find the themeToggle listener block")
    # Try to find it with more context
    idx = html.find("themeToggle.addEventListener('click'")
    if idx >= 0:
        print(f"   Found at char {idx}")
        print(f"   Context: {html[idx-50:idx+200]}")

# ============================================================
# 3. Also check for themeOption click handlers that reference themeDropdown
# ============================================================
# Find: themeOption.addEventListener or .theme-option click handler
# that might close themeDropdown
old_option_handler = """        document.querySelectorAll('.theme-option').forEach(opt => {
            opt.addEventListener('click', () => {
                setTheme(opt.dataset.themeVal);
                themeDropdown.classList.remove('open');
            });
        });"""

new_option_handler = """        document.querySelectorAll('.theme-option').forEach(opt => {
            opt.addEventListener('click', () => {
                setTheme(opt.dataset.themeVal);
                if (themeDropdown) themeDropdown.classList.remove('open');
            });
        });"""

if old_option_handler in html:
    html = html.replace(old_option_handler, new_option_handler, 1)
    print("✅ Step 3: Made theme-option click handler null-safe for themeDropdown")
else:
    print("ℹ Step 3: No theme-option click handler found (may use different pattern)")

# ============================================================
# Write the fixed file
# ============================================================
with open(forum_path, "w", encoding="utf-8") as f:
    f.write(html)

print(f"\n✅ Fixed forum.html: {len(html)} chars, {html.count(chr(10))+1} lines")
