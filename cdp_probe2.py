#!/usr/bin/env python3
"""CDP via browser-level endpoint: attach to the page target and run commands via Target.sendMessageToTarget."""
import json, urllib.request, time
from websocket import create_connection

# Browser-level WS
ver = json.loads(urllib.request.urlopen("http://127.0.0.1:9222/json/version").read())
bws_url = ver["webSocketDebuggerUrl"]
print("Browser WS:", bws_url)
ws = create_connection(bws_url, timeout=10)

_seq = 0
def send(method, params=None):
    global _seq
    _seq += 1
    myid = _seq
    ws.send(json.dumps({"id": myid, "method": method, "params": params or {}}))
    return myid

# Discover targets
send("Target.getTargets")
ws.settimeout(8)
targets = None
events = []
try:
    for i in range(30):
        raw = ws.recv()
        msg = json.loads(raw)
        events.append(msg)
        if msg.get("id") == 1:
            targets = msg["result"]["targetInfos"]
            break
except Exception as e:
    print("recv err:", e)
print(f"Got {len(events)} messages, targets found: {bool(targets)}")
if targets:
    page_targets = [t for t in targets if t["type"] == "page"]
    for t in page_targets:
        print("  page target:", t["targetId"][:20], t.get("title","")[:30], t.get("url","")[:40])
    if page_targets:
        pt = page_targets[0]
        send("Target.attachToTarget", {"targetId": pt["targetId"], "flatten": True})
        session_id = None
        try:
            for i in range(30):
                raw = ws.recv()
                msg = json.loads(raw)
                if msg.get("id") == 2:
                    session_id = msg["result"]["sessionId"]
                    print("Attached! sessionId:", session_id[:20])
                    break
        except Exception as e:
            print("attach recv err:", e)
        if session_id:
            # Send Runtime.evaluate to the page via the session
            _seq += 1
            ws.send(json.dumps({"id": _seq, "method": "Runtime.evaluate",
                                "params": {"expression": "document.title + ' | nav:' + (document.querySelector('.navbar')?'YES':'NO')"},
                                "sessionId": session_id}))
            try:
                for i in range(40):
                    raw = ws.recv()
                    msg = json.loads(raw)
                    if msg.get("id") == _seq:
                        print("EVAL RESULT:", json.dumps(msg.get("result",{}).get("result",{}))[:200])
                        break
            except Exception as e:
                print("eval recv err:", e)
ws.close()
print("done")
