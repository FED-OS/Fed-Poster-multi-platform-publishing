#!/usr/bin/env python3
"""Extract the forum HTML from the summarized conversation transcript.
The transcript file contains Python dict literals, one per line.
We need to find the line containing 'add this forum as a tab' and extract the HTML content.
"""
import ast
import re

transcript_path = "/workspace/summarized_conversations/original_conversation_1788472642_641.txt"
output_path = "/workspace/extracted_e264/site/forum.html"

with open(transcript_path, "r", encoding="utf-8") as f:
    raw = f.read()

# Split into lines - each line is a dict literal
lines = raw.split("\n")
print(f"Total lines: {len(lines)}")

# Find the line containing "add this forum as a tab"
target_idx = None
for i, line in enumerate(lines):
    if "add this forum as a tab" in line:
        target_idx = i
        print(f"Found 'add this forum as a tab' on line index {i} (line #{i+1})")
        print(f"Line length: {len(line)} chars")
        break

if target_idx is None:
    print("ERROR: Could not find the forum message")
    exit(1)

line = lines[target_idx]

# Try to parse as Python dict literal
try:
    parsed = ast.literal_eval(line)
    user_content = parsed['content']
    print(f"✅ ast.literal_eval succeeded. Content length: {len(user_content)} chars")
except Exception as e:
    print(f"ast.literal_eval failed: {e}")
    # The line might be truncated or have issues. Try regex.
    # Pattern: {'role': 'user', 'content': '...'}
    match = re.search(r"'content':\s*'(.*?)'\}\s*$", line, re.DOTALL)
    if match:
        user_content = match.group(1)
        # Unescape Python string escapes
        user_content = user_content.replace("\\n", "\n").replace("\\'", "'").replace('\\"', '"').replace("\\t", "\t").replace("\\\\", "\\")
        print(f"Regex extraction succeeded. Content length: {len(user_content)} chars")
    else:
        print("Regex also failed")
        exit(1)

# Remove the "add this forum as a tab: " prefix
prefix = "add this forum as a tab: "
if user_content.startswith(prefix):
    html_content = user_content[len(prefix):]
    print(f"Removed prefix. HTML length: {len(html_content)} chars")
else:
    html_content = user_content
    print(f"No prefix to remove. Using full content ({len(html_content)} chars)")

# Verify structure
html_stripped = html_content.strip()
starts_ok = html_stripped.startswith("<!DOCTYPE html>") or html_stripped.lower().startswith("<!doctype")
ends_ok = html_stripped.endswith("</html>")
print(f"Starts with DOCTYPE: {starts_ok}")
print(f"Ends with </html>: {ends_ok}")
print(f"First 80 chars: {html_stripped[:80]}")
print(f"Last 80 chars: ...{html_stripped[-80:]}")

# Write output
with open(output_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"\n✅ Forum HTML written to {output_path}")
print(f"File size: {len(html_content)} characters, ~{html_content.count(chr(10))+1} lines")
