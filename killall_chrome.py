import os, signal, glob, subprocess, time
# Get chrome PIDs
out = subprocess.run(["pgrep","-f","chrome"], capture_output=True, text=True)
pids = [int(p) for p in out.stdout.split() if p.strip()]
killed = 0
for pid in pids:
    try:
        os.kill(pid, signal.SIGKILL)
        killed += 1
    except Exception:
        pass
# Clean singleton/lock files
for f in glob.glob("/workspace/.browser_data/Singleton*"):
    try: os.remove(f)
    except: pass
for f in glob.glob("/tmp/.config/google-chrome-for-testing/Singleton*"):
    try: os.remove(f)
    except: pass
print(f"killed {killed} chrome processes")
