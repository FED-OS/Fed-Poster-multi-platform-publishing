#!/usr/bin/env python3
"""Debug: attach and print ALL messages received for 8 seconds after sending a session command."""
import json, urllib.request, time
from websocket import create_connection

ver = json.loads(urllib.request.urlopen("http://127.0.0.1:9222/json/version").read())
ws = create_connection(ver["webSocketDebuggerUrl"], timeout=15)

ws.send(json.dumps({"id":1,"method":"Target.getTargets"}))
ws.settimeout(10)
tg = None
while True:
    m = json.loads(ws.recv())
    if m.get("id")==1: tg=m; break
pages = [t for t in tg["result"]["targetInfos"] if t["type"]=="page" and "about.html" in t.get("url","")]
pt = pages[0]
print("target:", pt["targetId"][:20])

ws.send(json.dumps({"id":2,"method":"Target.attachToTarget","params":{"targetId":pt["targetId"],"flatten":True}}))
att=None
while True:
    m=json.loads(ws.recv())
    if m.get("id")==2: att=m; break
sid=att["result"]["sessionId"]
print("session:", sid[:16])

# Now send a session command and print everything for 8s
ws.send(json.dumps({"id":3,"method":"Runtime.evaluate","params":{"expression":"document.title"},"sessionId":sid}))
print("sent Runtime.evaluate(id=3). Listening 8s...")
ws.settimeout(8)
count=0
try:
    while True:
        raw=ws.recv()
        count+=1
        print(f"  msg[{count}]:", raw[:300])
except Exception as e:
    print("recv ended:", type(e).__name__)
print(f"Total: {count} messages")
ws.close()
