#!/usr/bin/env python3
"""
Add the "About" nav link to every existing site page (after the Forum link).
Pages: index, dashboard, calendar, analytics, pricing, settings, 404, forum.
"""
import os, re

SITE = "/workspace/extracted_e264/site"
pages = ["index.html", "dashboard.html", "calendar.html", "analytics.html",
         "pricing.html", "settings.html", "404.html", "forum.html"]

about_link = '        <a href="about.html">About</a>'
# The forum link in standard pages uses 8-space indent; forum.html may differ. Handle both.
forum_link_std = '        <a href="forum.html">Forum</a>'

for p in pages:
    path = os.path.join(SITE, p)
    with open(path, "r", encoding="utf-8") as f:
        html = f.read()
    if 'href="about.html"' in html:
        print(f"  {p}: already has About link, skipping")
        continue
    # Try the standard indented forum link first
    if forum_link_std in html:
        html = html.replace(forum_link_std, forum_link_std + "\n" + about_link, 1)
        with open(path, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"  {p}: added About link (standard)")
    else:
        # Fallback: regex match any <a href="forum.html">Forum</a> with surrounding whitespace
        m = re.search(r'(\s*)<a href="forum\.html">Forum</a>', html)
        if m:
            indent = m.group(1)
            html = html.replace(m.group(0), m.group(0) + "\n" + indent + '<a href="about.html">About</a>', 1)
            with open(path, "w", encoding="utf-8") as f:
                f.write(html)
            print(f"  {p}: added About link (regex, indent={repr(indent)})")
        else:
            print(f"  {p}: WARNING - could not find Forum link!")
print("Done.")
