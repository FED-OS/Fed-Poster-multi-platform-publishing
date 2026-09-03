#!/usr/bin/env python3
"""CDP non-flatten: attach with flatten=False, use Target.sendMessageToTarget + listen for receivedMessageFromTarget."""
import json, urllib.request, time
from websocket import create_connection

ver = json.loads(urllib.request.urlopen("http://127.0.0.1:9222/json/version").read())
ws = create_connection(ver["webSocketDebuggerUrl"], timeout=15)

def bsend(method, params=None, myid=None):
    if myid is None:
        bsend._n = getattr(bsend,'_n',0)+1; myid=bsend._n
    ws.send(json.dumps({"id":myid,"method":method,"params":params or {}}))
    return myid

# get targets
bsend("Target.getTargets", myid=1)
ws.settimeout(10)
tg=None
while True:
    m=json.loads(ws.recv())
    if m.get("id")==1: tg=m; break
pages=[t for t in tg["result"]["targetInfos"] if t["type"]=="page" and "about.html" in t.get("url","")]
pt=pages[0]
print("target:", pt["targetId"][:20])

# attach non-flatten
bsend("Target.attachToTarget", {"targetId":pt["targetId"],"flatten":False}, myid=2)
sid=None
while True:
    m=json.loads(ws.recv())
    if m.get("id")==2:
        sid=m["result"]["sessionId"]
        break
print("sessionId:", sid[:20])

# Send Runtime.evaluate via Target.sendMessageToTarget (legacy)
msg = json.dumps({"id":100,"method":"Runtime.evaluate","params":{"expression":"document.title"}})
bsend("Target.sendMessageToTarget", {"sessionId":sid, "message":msg}, myid=3)
print("sent message. Listening for receivedMessageFromTarget events (10s)...")
ws.settimeout(10)
count=0
try:
    while True:
        raw=ws.recv()
        m=json.loads(raw)
        count+=1
        if m.get("method")=="Target.receivedMessageFromTarget":
            print("  GOT RESPONSE:", m["params"]["message"][:200])
            break
        else:
            print(f"  msg[{count}]:", raw[:150])
except Exception as e:
    print("recv ended:", type(e).__name__)
print(f"Total messages: {count}")
ws.close()
