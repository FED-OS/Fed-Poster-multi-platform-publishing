# Surf FED — Tauri (macOS) + Electron (Windows/Linux) Feasibility Study

> Based on a direct read of your actual repository files:
> `main.js` (428 lines), `preload.js` (20 lines), `renderer.js` (248 lines),
> `index.html`, `styles.css`, `package.json`, `.github/workflows/build.yml`,
> and all four `extensions/builtin/*/manifest.json` files.

---

## TL;DR — short answer

**Yes, the CI/CD split is technically possible** (Tauri job on `macos-14`,
Electron jobs on `windows-2022` + `ubuntu-24.04`, one GitHub Release at the end).

**But for *your specific code*, Tauri on macOS is not a drop-in swap — it is a
partial rewrite of the browser engine and the extension system.** Your app is
not a generic desktop UI that happens to be built with Electron. It is a
**Chromium-based web browser with Chrome Manifest V3 extensions loaded via
Electron's `session.loadExtension()` and rendered with `<webview>` tags.**
Neither of those two pillars exists in Tauri.

**Concrete recommendation:** keep Electron on all three platforms (including
macOS). Your existing workflow already does this correctly. The Tauri path is
documented below so you can decide with full information, but it would cost you
the extension system on macOS.

---

## 1. What your project actually is

I read every file. Here is the verified architecture:

### 1.1 The renderer is a multi-tab browser built on `<webview>` tags

`renderer.js` creates tabs like this:

```js
const webview = document.createElement('webview');
webview.setAttribute('src', url);
webview.setAttribute('partition', WEBVIEW_PARTITION);   // 'persist:surf-fed'
webview.setAttribute('allowpopups', '');
```

`<webview>` is an **Electron-only custom element**. It runs each web page in a
sandboxed, separate Chromium renderer with its own session partition. The
navigation logic (`webview.loadURL`, `goBack`, `goForward`, `reload`,
`getTitle`, `getURL`) all comes from the Electron `<webview>` API.

`index.html` enables it via `webviewTag: true` in `main.js`:

```js
webPreferences: {
  preload: path.join(__dirname, 'preload.js'),
  contextIsolation: true,
  nodeIntegration: false,
  webviewTag: true,   // REQUIRED for <webview> tags to work at all
}
```

### 1.2 The extension system is Chrome MV3 loaded through Electron

`main.js` loads extensions into a session partition:

```js
const WEBVIEW_PARTITION = 'persist:surf-fed';
...
async function loadExtensionIntoSession(ext) {
  const targetSession = session.fromPartition(WEBVIEW_PARTITION);
  const loaded = await targetSession.loadExtension(ext.path, { allowUncheckedErrors: true });
  ext.loadedId = loaded.id;
  ...
}
```

`session.loadExtension()` is an **Electron-only API** that loads a real
unpacked Chrome/Chromium extension into a session so it runs inside the
`<webview>` pages you browse.

Your four bundled extensions are genuine **Manifest V3** Chrome extensions
(verified from their `manifest.json`):

| Extension | manifest_version | Key MV3 features used |
|---|---|---|
| `ad-blocker` | 3 | `declarativeNetRequest` rule resources |
| `dark-reader` | 3 | `content_scripts`, `scripting`, `storage`, `run_at: document_start`, `all_frames` |
| `fed-gram` | 3 | `background.service_worker`, `action.default_popup`, `host_permissions` |
| `page-info` | 3 | `content_scripts`, `action.default_popup` |

These rely on Chrome extension APIs: `declarativeNetRequest`, content scripts,
service-worker backgrounds, and the `chrome.action` popup mechanism. These only
run inside a Chromium engine that implements the Chrome Extensions runtime.

### 1.3 IPC bridge

`preload.js` exposes `window.electronAPI` (window chrome + an
`extensions.*` namespace) via `contextBridge.exposeInMainWorld` and
`ipcRenderer.invoke/send`. `main.js` handles all of it through `ipcMain`
(extensions list/enable/disable/add/remove/openFolder/reload, window
minimize/maximize/close). The renderer calls `window.electronAPI.extensions.*`
throughout.

### 1.4 Packaging

`package.json` uses `electron-builder` with `asarUnpack: ["extensions/builtin/**/*"]`
specifically because **`session.loadExtension()` requires real files on disk**
(not files inside `app.asar`). `main.js` has elaborate `builtinExtDir()` logic
to find the unpacked folder across dev/packaged/Windows paths. This is
Electron-specific packaging behavior.

---

## 2. Why Tauri cannot run this code as-is

Tauri is a *different desktop runtime*, not a different packager. Here is the
platform-by-platform gap for moving **only macOS** to Tauri:

| Your feature | Electron (Windows/Linux, unchanged) | Tauri on macOS | Gap |
|---|---|---|---|
| Web page rendering | `<webview>` (Chromium) | `WKWebView` (WebKit/Safari) via Tauri's webview | **No `<webview>` tag exists.** You must use a Rust webview widget or a Tauri multi-webview plugin and rebuild the tab container. |
| Browser engine | Bundled Chromium | System WebKit | Pages render as Safari, not Chrome. Some sites behave differently; devtools differ. |
| Chrome MV3 extensions | `session.loadExtension()` | **Does not exist.** WebKit/WKWebView has no Chrome extension runtime. | **Your entire extension system breaks on macOS.** `declarativeNetRequest`, content scripts, service workers, `chrome.action` popups — none run. |
| Multi-tab browsing | `<webview>` per tab + Electron session partition | Must be reimplemented with Tauri webview APIs + Rust | Significant rewrite of `renderer.js` tab logic. |
| IPC | `ipcRenderer` / `ipcMain` | `invoke()` from `@tauri-apps/api/core` + Rust `#[tauri::command]` | `preload.js` and every `window.electronAPI.*` call must be replaced. |
| Window chrome buttons | `ipcMain` `window:minimize/maximize/close` | Tauri window APIs | Rewrite needed (though minor). |
| `dialog.showOpenDialog` ("Load unpacked extension") | Electron `dialog` | Tauri `dialog` plugin | Movable, but the extension you then "load" cannot run in WebKit anyway. |
| `asarUnpack` real-file requirement | Electron packaging | N/A in Tauri | The whole `builtinExtDir()` resilience logic is Electron-only. |

**The decisive blocker is the extension system.** Your app's identity is
"an Electron web browser with custom extension support" (that is literally your
`package.json` description). On Tauri/macOS/WebKit there is no
`session.loadExtension()` and no Chrome Extensions runtime, so:

- `ad-blocker` (declarativeNetRequest) — **will not work.** No DNR in WKWebView.
- `dark-reader` (content script injected at `document_start`, all frames) —
  partially possible only if you write your own injection layer via Tauri's
  webview; not via the manifest.
- `fed-gram` (service worker background + popup) — **will not work.** No
  service-worker extension background in WebKit.
- `page-info` (content script + popup) — needs a custom reimplementation.

You would be shipping a macOS build that **looks like Surf FED but cannot run
any of its built-in extensions.** That is a functional downgrade, not a
port.

---

## 3. The honest verdict per option

### Option A — Keep Electron everywhere (RECOMMENDED)

- **Effort:** ~5 minutes. Rename the workflow, keep everything else.
- **Result on macOS:** a working `.dmg` with full Chromium + all 4 extensions.
- **Risk:** none. This is exactly what your code is designed for.
- **Cost:** larger macOS binary (~150 MB, Chromium bundled) vs Tauri (~10 MB).

### Option B — Tauri on macOS + Electron on Windows/Linux

- **Effort:** high. You must add a real `src-tauri/` Rust project and
  reimplement: tab/webview management, the IPC bridge, window controls, and
  critically **the entire extension runtime** (or accept that extensions do
  not work on macOS).
- **Result on macOS:** small `.dmg`, WebKit engine, **extensions broken**,
  Safari-grade page rendering.
- **Risk:** you ship a macOS product that is missing its headline feature
  (extensions). Users on macOS get a worse Surf FED than users on Windows/Linux.
- **When it makes sense:** only if you are willing to either (a) drop extension
  support on macOS, or (b) build a custom WebKit-based content-script injection
  system in Rust — a substantial sub-project.

### Option C — Tauri everywhere

Not what you asked, and even more work than Option B for the same extension
loss on Windows/Linux too. Not recommended for this codebase.

---

## 4. Decision matrix

| What you value most | Choose |
|---|---|
| Extensions work on every platform | **Option A (Electron all)** |
| Smallest possible macOS binary | Option B (accept losing extensions on macOS) |
| Consistent Chromium behavior everywhere | **Option A** |
| Native macOS look/feel + Rust backend | Option B (large rewrite, extensions lost) |
| Ship something this week | **Option A** |
| Long-term modernization with a dedicated macOS maintainer | Option B, on a separate branch |

---

## 5. Files delivered with this study

1. **`build.option-a-electron-all.yml`** — the recommended, ready-to-use
   workflow. Electron on Windows, macOS, and Linux. Renamed to
   `Build Desktop Packages`, Node 20, `npm ci`, keeps your exact extension
   validation, fixes the `shellOpenPath` ordering, and produces a GitHub
   Release on `v*` tags. Drop-in replacement for your current `build.yml`.

2. **`build.option-b-tauri-mac-electron-win-linux.yml`** — the hybrid workflow
   you asked about, **if** you choose to proceed with Tauri on macOS. It
   builds Electron on Windows + Linux and Tauri on macOS in separate jobs,
   merges artifacts, and releases on `v*` tags. It will only succeed once you
   add the `src-tauri/` project (see section 6).

3. **`TAURI_MIGRATION_CHECKLIST.md`** — the concrete, file-by-file list of
   code changes required for Option B, so you can see the real scope before
   committing.

---

## 6. If you still want Option B — what you must build

These are not optional; each is required for the Tauri macOS job to produce a
working app:

1. **Initialize Tauri** (adds `src-tauri/` with Rust + config):
   ```bash
   npm install -D @tauri-apps/cli
   npx tauri init
   ```
   Point Tauri at your static frontend (`index.html`, `renderer.js`,
   `styles.css`). Use a **separate** web build dir (e.g. `dist-web/`), not the
   Electron `dist/` (which holds installers, not web assets).

2. **Replace the `<webview>` tab engine.** `<webview>` does not exist in Tauri.
   Use a Tauri multi-webview setup (e.g. the `tauri-plugin-webview` / window
   pool approach) and rewrite the tab creation/navigation in `renderer.js`.

3. **Replace the IPC bridge.** Convert `preload.js`'s
   `window.electronAPI.*` to `invoke()` calls to Rust `#[tauri::command]`
   functions. Update every call site in `renderer.js`.

4. **Reimplement or drop extensions on macOS.** `session.loadExtension()` has
   no Tauri equivalent. Options: (a) ship macOS *without* the extension panel,
   (b) hand-port each extension as Rust-side content-script injection (large
   effort, and `declarativeNetRequest`/service workers still won't map cleanly).

5. **macOS signing/notarization.** An unsigned `.dmg` builds fine but
   Gatekeeper will warn/block it. For public distribution you need an Apple
   Developer ID cert + notarization (add to the Tauri job).

6. **Intel Macs.** `macos-14` is Apple Silicon. For Intel support add a second
   Rust target (`x86_64-apple-darwin`) and build both DMGs.

See `TAURI_MIGRATION_CHECKLIST.md` for the line-by-line breakdown.
