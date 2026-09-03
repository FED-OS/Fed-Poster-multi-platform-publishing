#!/usr/bin/env python3
"""Capture screenshot via page-level CDP WebSocket (direct, no flatten)."""
import json, time, websocket, sys, os

# Get the about.html page target
import urllib.request
targets = json.loads(urllib.request.urlopen("http://127.0.0.1:9222/json/list").read())
page = None
for t in targets:
    if t.get("type") == "page" and "about.html" in t.get("url", ""):
        page = t
        break

if not page:
    print("ERROR: No about.html page target found", file=sys.stderr)
    sys.exit(1)

ws_url = page["webSocketDebuggerUrl"]
print(f"Connecting to page WS: {ws_url[:70]}...", flush=True)

ws = websocket.create_connection(ws_url, timeout=10)
print("Connected.", flush=True)

# Send Page.enable then Page.captureScreenshot
def send(method, params=None, msg_id=1):
    cmd = {"id": msg_id, "method": method}
    if params:
        cmd["params"] = params
    ws.send(json.dumps(cmd))
    print(f"  -> sent {method} (id={msg_id})", flush=True)

# Try captureScreenshot directly
send("Page.captureScreenshot", {"format": "png", "captureBeyondViewport": False}, 1)

# Collect messages for up to 15s
ws.settimeout(2.0)
deadline = time.time() + 15
got = []
while time.time() < deadline:
    try:
        raw = ws.recv()
        if raw:
            got.append(raw)
            msg = json.loads(raw)
            print(f"  <- recv id={msg.get('id')} method={msg.get('method','')} keys={list(msg.keys())}", flush=True)
            if msg.get("id") == 1:
                data = msg.get("result", {}).get("data")
                if data:
                    out = "/workspace/about_screenshot.png"
                    import base64
                    with open(out, "wb") as f:
                        f.write(base64.b64decode(data))
                    print(f"SAVED screenshot to {out} ({len(base64.b64decode(data))} bytes)", flush=True)
                    ws.close()
                    sys.exit(0)
                else:
                    print(f"  id=1 response has no data: {str(msg)[:300]}", flush=True)
    except websocket.WebSocketTimeoutException:
        continue
    except Exception as e:
        print(f"  recv error: {e}", flush=True)
        break

print(f"Total messages received: {len(got)}", flush=True)
ws.close()
