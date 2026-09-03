#!/usr/bin/env python3
"""Add 'Forum' link to the navbar in all e264 site HTML pages."""
import os
import re

site_dir = "/workspace/extracted_e264/site"
pages = ["index.html", "dashboard.html", "calendar.html", "analytics.html", "pricing.html", "settings.html", "404.html"]

# The nav-links block looks like:
#   <div class="nav-links">
#     <a href="index.html">Home</a>
#     ...
#     <a href="settings.html">Settings</a>
#   </div>
# We insert <a href="forum.html">Forum</a> before the closing </div>

for page in pages:
    filepath = os.path.join(site_dir, page)
    if not os.path.exists(filepath):
        print(f"⚠ {page} not found, skipping")
        continue
    
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Check if Forum link already exists
    if 'href="forum.html"' in content:
        print(f"✓ {page} already has Forum link, skipping")
        continue
    
    # Pattern: find the Settings link in nav-links and add Forum after it
    # The settings link: <a href="settings.html">Settings</a>
    # We add Forum link after it, inside the nav-links div
    old = '<a href="settings.html">Settings</a>'
    new = '<a href="settings.html">Settings</a>\n        <a href="forum.html">Forum</a>'
    
    if old in content:
        content = content.replace(old, new, 1)  # Replace only first occurrence (in nav)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"✅ Added Forum link to {page}")
    else:
        # Try a more flexible pattern for pages where Settings might be formatted differently
        # Some pages might have it on one line: <a href="settings.html">Settings</a>
        pattern = r'(<a href="settings\.html"[^>]*>Settings</a>)'
        match = re.search(pattern, content)
        if match:
            old_match = match.group(1)
            new_match = old_match + '\n        <a href="forum.html">Forum</a>'
            content = content.replace(old_match, new_match, 1)
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"✅ Added Forum link to {page} (via regex)")
        else:
            print(f"⚠ {page}: Could not find Settings link in nav, skipping")

print("\nDone!")
