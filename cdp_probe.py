#!/usr/bin/env python3
"""Minimal CDP probe: connect, send one Runtime.evaluate, print everything received."""
import json, urllib.request, time
from websocket import create_connection

targets = json.loads(urllib.request.urlopen("http://127.0.0.1:9222/json/list").read())
page = next(t for t in targets if t["type"] == "page")
print("Connecting to:", page["webSocketDebuggerUrl"][:70], "...")
ws = create_connection(page["webSocketDebuggerUrl"], timeout=10)
print("Connected. Sending Runtime.evaluate 1+1...")
ws.send(json.dumps({"id": 1, "method": "Runtime.evaluate", "params": {"expression": "1+1"}}))
ws.settimeout(8)
got = []
try:
    for i in range(20):
        raw = ws.recv()
        got.append(raw[:200])
        print(f"  recv[{i}]:", raw[:200])
except Exception as e:
    print("recv ended:", type(e).__name__, e)
print(f"Total messages received: {len(got)}")
ws.close()
