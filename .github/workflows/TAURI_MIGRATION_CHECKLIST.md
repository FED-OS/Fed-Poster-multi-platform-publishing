# Tauri Migration Checklist (Option B) — file-by-file scope

This is the concrete work required to move **macOS only** to Tauri while
keeping Electron on Windows/Linux. Each item maps to real code in your repo.

> Read alongside `SURF_FED_TAURI_FEASIBILITY_STUDY.md`.
> The blocker items (🚫) are why Option A is recommended.

---

## 1. New files you must create

- [ ] `src-tauri/Cargo.toml` — Rust manifest with `tauri` crate dependency.
- [ ] `src-tauri/src/main.rs` / `src-tauri/src/lib.rs` — Rust entry; window
      creation moves here from `main.js`'s `createWindow()`.
- [ ] `src-tauri/tauri.conf.json` — Tauri config. Set:
      - `build.frontendDist` → a **web-asset** folder (e.g. `../dist-web`),
        NOT the Electron `dist/` (which holds installers).
      - `build.beforeBuildCommand` → your web build step (or empty if static).
      - `bundle.targets` → `["dmg"]` (add `["app"]` if you want the .app too).
      - `app.windows[].title` → `Surf FED`, dimensions to match `main.js`
        (1200x800, minWidth 600, minHeight 400).
      - `app.windows[].icon` → reuse `assets/icons/icon.png` (Tauri wants
        `.icns` for macOS; generate with `tauri icon`).
- [ ] `src-tauri/capabilities/*.json` — Tauri v2 permission/capability files
      for any plugins you use (dialog, window, etc.).
- [ ] `platform.js` (shared) — abstraction so `renderer.js` can call either
      Electron IPC or Tauri `invoke()` depending on runtime.

## 2. package.json changes

- [ ] Add devDependency: `@tauri-apps/cli`.
- [ ] Add script: `"tauri": "tauri"`.
- [ ] Keep `"dist": "electron-builder"` and the `build` block (still used by
      the Windows/Linux Electron jobs).
- [ ] Add a web-build script that copies `index.html`, `renderer.js`,
      `styles.css`, `assets/` into `dist-web/` for Tauri to consume.

## 3. main.js — does NOT run in Tauri (428 lines, Electron-only)

Every item below is Electron API that has no direct Tauri equivalent:

- [ ] 🚫 `session.fromPartition()` + `session.loadExtension()` —
      **the entire extension loading system.** No equivalent in Tauri/WebKit.
      This breaks all four built-in extensions on macOS.
- [ ] 🚫 `app.on('web-contents-created')` webview hook — no `<webview>` in Tauri.
- [ ] `BrowserWindow` creation → replaced by Tauri window config + Rust.
- [ ] `webPreferences: { webviewTag: true }` → N/A.
- [ ] `ipcMain.handle('extensions:list'|'enable'|'disable'|'add'|'remove'|...)`
      → re implemented as Rust `#[tauri::command]` functions (only the
      non-extension-loading parts, e.g. listing manifests, can survive).
- [ ] `ipcMain.on('window:minimize'|'maximize'|'close')` → Tauri window APIs
      (`appWindow.minimize()`, etc.) from the JS side, no Rust needed.
- [ ] `dialog.showOpenDialog` → Tauri `dialog` plugin (`@tauri-apps/plugin-dialog`).
- [ ] `shell.openPath` → Tauri `opener`/`shell` plugin.
- [ ] `builtinExtDir()` asar-unpacked path logic → Electron-only; delete on
      the Tauri path.
- [ ] `app.getPath('userData')` → Tauri `path` plugin app data dir.

## 4. preload.js — does NOT run in Tauri (20 lines)

- [ ] `contextBridge.exposeInMainWorld('electronAPI', ...)` → replace with a
      `platform.js` shim that uses `invoke()` from `@tauri-apps/api/core`.
- [ ] Every `ipcRenderer.send/invoke` → a Tauri command or plugin call.

## 5. renderer.js — partial rewrite (248 lines)

- [ ] 🚫 `document.createElement('webview')` + `setAttribute('partition', ...)`
      + `allowpopups` → **no `<webview>` in Tauri.** Tabs must be implemented
      with Tauri's webview/window management (e.g. a Rust-managed webview pool
      or `tauri-plugin-webview`). This is the biggest single rewrite.
- [ ] `webview.loadURL / goBack / goForward / reload / getTitle / getURL` →
      Tauri webview navigation APIs (different signatures, async).
- [ ] `webview.addEventListener('did-stop-loading' / 'page-title-updated')` →
      Tauri webview events (different event names/types).
- [ ] `window.electronAPI.extensions.*` → route through `platform.js`.
- [ ] `window.electronAPI.minimize/maximize/close` → Tauri window APIs.

## 6. index.html — minor

- [ ] The `<webview>` usage is dynamic (created in JS), so the HTML itself is
      mostly reusable. The injected analytics `<script>` (`sites.super.myninja.ai`)
      stays as-is.
- [ ] Ensure `renderer.js` is loaded the same way under Tauri's frontendDist.

## 7. Extensions — 🚫 the headline problem

For each built-in extension, the macOS/Tauri (WebKit) fate:

- [ ] 🚫 `ad-blocker` — uses `declarativeNetRequest`. WebKit has no DNR.
      Would need a Rust-side request-blocking layer (e.g. intercept via
      Tauri's HTTP/webview APIs) — significant custom work.
- [ ] ⚠️ `dark-reader` — content script at `document_start`, `all_frames`.
      WebKit can inject JS via `evaluateJavaScript`, but per-frame,
      at `document_start`, across navigations is a custom reimplementation.
- [ ] 🚫 `fed-gram` — `background.service_worker` + popup. No service-worker
      extension background in WebKit. The popup UI could become a Tauri
      window, but the background logic must move to Rust.
- [ ] ⚠️ `page-info` — content script + popup. Same injection issue as
      dark-reader; popup becomes a Tauri window.

Realistic outcomes for macOS:
  (a) Ship macOS **without** the Extensions panel (simplest, feature loss), or
  (b) Hand-port each extension to Rust + JS injection (weeks of work, and DNR
      still won't be a clean port).

## 8. macOS distribution extras

- [ ] Apple Developer ID certificate + notarization (add secrets
      `APPLE_CERTIFICATE`, `APPLE_CERTIFICATE_PASSWORD`, `APPLE_ID`,
      `APPLE_PASSWORD`, `APPLE_TEAM_ID` and Tauri signing config).
      Without this, Gatekeeper blocks/quarantines the .dmg.
- [ ] Intel Mac support: add `x86_64-apple-darwin` Rust target and build a
      second DMG (currently only Apple Silicon via `macos-14`).
- [ ] App icon: generate `.icns` via `npx tauri icon assets/icons/icon.png`.

## 9. Workflow

- [ ] Use `build.option-b-tauri-mac-electron-win-linux.yml` (provided).
- [ ] The `build-tauri-macos` job will **fail** until items in section 1, 2,
      and the `<webview>` rewrite (5) are done and committed.

---

## Effort estimate (rough)

| Area | Effort | Extensions survive on macOS? |
|---|---|---|
| Tauri init + config + window/IPC | Medium (1–2 days) | n/a |
| `<webview>` → Tauri webview tab engine | High (3–5 days) | n/a |
| Extension runtime | Very high (weeks) or drop | **No** (unless hand-ported) |
| macOS signing/notarization | Medium (half day + Apple account) | n/a |
| **Total to feature-parity macOS** | **Weeks** | Only with custom reimplementation |

Compare to Option A: **~5 minutes**, full feature parity on all platforms.

---

## Recommendation

Start with **Option A** (`build.option-a-electron-all.yml`) to ship now on all
three platforms with extensions working everywhere. If you later want a
smaller, native macOS binary and are willing to fund the extension rework,
create a `tauri-macos` branch and use this checklist + Option B workflow.
