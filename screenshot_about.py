#!/usr/bin/env python3
"""Raw CDP browser-level: attach to about page target, run checks + screenshot.
Works against a standalone Chrome (no Playwright holding the target)."""
import json, urllib.request, base64, time
from websocket import create_connection

ver = json.loads(urllib.request.urlopen("http://127.0.0.1:9222/json/version").read())
ws = create_connection(ver["webSocketDebuggerUrl"], timeout=15)
print("Connected to browser WS")

_seq = 0
def bcmd(method, params=None):  # browser-level
    global _seq; _seq += 1; myid = _seq
    ws.send(json.dumps({"id": myid, "method": method, "params": params or {}}))
    ws.settimeout(12)
    while True:
        msg = json.loads(ws.recv())
        if msg.get("id") == myid:
            return msg

def scmd(sid, method, params=None):  # session-scoped
    global _seq; _seq += 1; myid = _seq
    ws.send(json.dumps({"id": myid, "method": method, "params": params or {}, "sessionId": sid}))
    ws.settimeout(15)
    while True:
        msg = json.loads(ws.recv())
        if msg.get("id") == myid:
            return msg

tg = bcmd("Target.getTargets")
pages = [t for t in tg["result"]["targetInfos"] if t["type"] == "page" and "about.html" in t.get("url","")]
print("About page targets:", len(pages))
if not pages:
    pages = [t for t in tg["result"]["targetInfos"] if t["type"] == "page"]
pt = pages[0]
print("Target:", pt.get("title","")[:30], pt.get("url","")[:45])

att = bcmd("Target.attachToTarget", {"targetId": pt["targetId"], "flatten": True})
sid = att["result"]["sessionId"]
print("Session:", sid[:16])

# Enable on session
print("Runtime.enable:", scmd(sid, "Runtime.enable").get("result"))
print("Page.enable:", scmd(sid, "Page.enable").get("result"))

def ev(expr):
    r = scmd(sid, "Runtime.evaluate", {"expression": expr, "returnByValue": True})
    res = r.get("result",{}).get("result",{})
    return res.get("value", res.get("description", str(res)[:120]))

print("\n=== Render checks ===")
print("URL:", ev("location.href"))
print("Title:", ev("document.title"))
print("Navbar:", ev("document.querySelector('.navbar') ? 'YES' : 'NO'"))
print("Nav links:", ev("Array.from(document.querySelectorAll('.nav-links a')).map(a=>a.textContent.trim()).join(', ')"))
print("About active:", ev("document.querySelector('.nav-links a.active') ? document.querySelector('.nav-links a.active').textContent.trim() : 'none'"))
print("Theme swatches:", ev("document.querySelectorAll('.nav-theme-picker .swatch').length"))
print("data-theme:", ev("document.documentElement.getAttribute('data-theme')"))
print("orb-canvas:", ev("document.getElementById('orb-canvas') ? 'YES' : 'NO'"))
print("ecosystem:", ev("document.querySelector('.ecosystem') ? 'YES' : 'NO'"))
print("carousel:", ev("document.querySelector('.featured-carousel') ? 'YES' : 'NO'"))
print("FedPoster:", ev("window.FedPoster ? 'loaded' : 'NOT loaded'"))
print("FedPoster.THEMES:", ev("window.FedPoster ? window.FedPoster.THEMES.join(',') : 'n/a'"))
print("header-actions:", ev("document.querySelector('.header-actions') ? 'YES' : 'NO'"))
print("body padding-top:", ev("getComputedStyle(document.body).paddingTop"))
print("nav-brand:", ev("document.querySelector('.nav-brand') ? document.querySelector('.nav-brand').textContent.trim() : 'none'"))

print("\n=== Screenshot ===")
try:
    r = scmd(sid, "Page.captureScreenshot", {"format": "png", "captureBeyondViewport": False})
    if "result" in r and "data" in r["result"]:
        img = base64.b64decode(r["result"]["data"])
        with open("/workspace/about_screenshot.png", "wb") as f:
            f.write(img)
        print(f"Saved /workspace/about_screenshot.png ({len(img)} bytes)")
    else:
        print("Screenshot resp:", json.dumps(r)[:300])
except Exception as e:
    print("Screenshot failed:", e)

# Full-page screenshot
try:
    r2 = scmd(sid, "Page.captureScreenshot", {"format": "png", "captureBeyondViewport": True})
    if "result" in r2 and "data" in r2["result"]:
        img2 = base64.b64decode(r2["result"]["data"])
        with open("/workspace/about_fullpage.png", "wb") as f:
            f.write(img2)
        print(f"Saved /workspace/about_fullpage.png ({len(img2)} bytes)")
except Exception as e:
    print("Fullpage failed:", e)

ws.close()
print("DONE")
