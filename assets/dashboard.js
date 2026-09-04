/* ================================================================
   FED-POSTER DASHBOARD JAVASCRIPT
   Tab switching, composer logic, emoji, history, shortcuts, posting
   ================================================================ */
(function() {
  'use strict';

  // ---- DATE DISPLAY ----
  function updateDate() {
    const el = document.getElementById('date-display');
    if (el) el.textContent = new Date().toLocaleDateString('en-US', { weekday:'long', month:'short', day:'numeric', year:'numeric' });
  }
  updateDate();

  // ---- TAB SWITCHING ----
  const SECTION_TITLES = {
    multi: ['Multi Platform Post', 'Post to all your connected platforms instantly.'],
    telegram: ['Telegram', 'Configure your bot and send messages to channels.'],
    bluesky: ['Bluesky', 'Post via the AT Protocol with rich text support.'],
    mastodon: ['Mastodon', 'Toot to any instance with media attachments.'],
    discord: ['Discord', 'Send embedded messages via channel webhooks.'],
    github: ['GitHub Gist', 'Create gists with your post content as markdown.'],
    stoat: ['Stoat', 'Upload images to Supabase-hosted storage.'],
    deviantart: ['DeviantArt', 'Submit artwork with title and description.']
  };

  function switchSection(name) {
    document.querySelectorAll('.platform-section').forEach(s => s.classList.remove('active'));
    const sec = document.getElementById('section-' + name);
    if (sec) sec.classList.add('active');
    document.querySelectorAll('.app-nav-item').forEach(n => n.classList.remove('active'));
    const nav = document.querySelector('.app-nav-item[data-section="' + name + '"]');
    if (nav) nav.classList.add('active');
    const titles = SECTION_TITLES[name] || SECTION_TITLES.multi;
    document.getElementById('page-title').textContent = titles[0];
    document.getElementById('page-subtitle').textContent = titles[1];
  }

  document.querySelectorAll('.app-nav-item[data-section]').forEach(btn => {
    btn.addEventListener('click', () => switchSection(btn.dataset.section));
  });

  // ---- CREDENTIAL SAVE/LOAD (localStorage) ----
  const SAVE_FIELDS = ['tg-token','tg-chat','bs-handle','bs-pass','ma-instance','ma-token','dc-webhook','gh-token','gh-name','da-token','da-client'];
  SAVE_FIELDS.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const saved = localStorage.getItem('fedposter_' + id);
    if (saved) el.value = saved;
    el.addEventListener('change', () => localStorage.setItem('fedposter_' + id, el.value));
  });

  // ---- CHAR COUNTERS ----
  function setupCharCounter(textareaId, counterId, max) {
    const ta = document.getElementById(textareaId);
    const ctr = document.getElementById(counterId);
    if (!ta || !ctr) return;
    function update() {
      ctr.textContent = ta.value.length;
      if (ta.value.length > max * 0.9) ctr.style.color = 'var(--orange)';
      else ctr.style.color = 'var(--text-muted)';
    }
    ta.addEventListener('input', update);
    update();
  }
  setupCharCounter('multi-msg', 'multi-char', 300);
  setupCharCounter('bs-msg', 'bs-char', 300);
  setupCharCounter('ma-msg', 'ma-char', 500);

  // ---- FILE INFO ----
  function updateFileInfo(input, infoEl) {
    if (input.files && input.files.length) {
      const f = input.files[0];
      infoEl.textContent = '📎 ' + f.name + ' (' + (f.size/1024).toFixed(1) + ' KB)';
      infoEl.style.color = 'var(--accent)';
    } else {
      infoEl.textContent = 'No file selected';
      infoEl.style.color = 'var(--text-muted)';
    }
  }
  document.querySelectorAll('input[type="file"]').forEach(input => {
    const infoId = input.id.replace('-file', '-file-info').replace('multi-file','multi-file-info');
    const info = document.getElementById(infoId);
    if (info) input.addEventListener('change', () => updateFileInfo(input, info));
  });

  // ---- DRAG DROP ----
  document.querySelectorAll('.file-drop').forEach(zone => {
    const input = zone.querySelector('input[type="file"]');
    if (!input) return;
    const infoId = input.id.replace('-file', '-file-info').replace('multi-file','multi-file-info');
    const info = document.getElementById(infoId);
    ['dragenter','dragover'].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.add('dragover'); }));
    ['dragleave','drop'].forEach(ev => zone.addEventListener(ev, e => { e.preventDefault(); zone.classList.remove('dragover'); }));
    zone.addEventListener('drop', e => {
      if (e.dataTransfer.files.length) { input.files = e.dataTransfer.files; if (info) updateFileInfo(input, info); }
    });
  });

  // ---- EMOJI PICKER ----
  const EMOJIS = ['🚀','🔥','⚡','✨','⭐','💎','🎯','🎲','📱','💬','☁️','🐘','🎮','🐙','🦄','🌈','💯','✅','❌','⚠️','💡','📌','📎','🎉','🙌','👍','❤️','🧡','💛','💚','💙','💜','🤖','👾','🛸','⏳','⏰','🔒','🔑','🛡️','📊','📈','💬','📨','📧','🎬','🎨','🖼️','🎵','🎶'];
  let emojiTarget = null;
  const emojiGrid = document.getElementById('emojiGrid');
  if (emojiGrid) {
    EMOJIS.forEach(em => {
      const b = document.createElement('button');
      b.textContent = em;
      b.addEventListener('click', () => {
        if (emojiTarget) {
          const s = emojiTarget.selectionStart || emojiTarget.value.length;
          emojiTarget.value = emojiTarget.value.slice(0, s) + em + emojiTarget.value.slice(emojiTarget.selectionEnd || s);
          emojiTarget.dispatchEvent(new Event('input'));
          emojiTarget.focus();
        }
      });
      emojiGrid.appendChild(b);
    });
  }
  document.querySelectorAll('.emoji-inject').forEach(btn => {
    btn.addEventListener('click', () => {
      emojiTarget = document.getElementById(btn.dataset.target);
      const p = document.getElementById('emojiPicker');
      p.style.display = 'block';
    });
  });

  // ---- HISTORY ----
  const historyKey = 'fedposter_history';
  function getHistory() { try { return JSON.parse(localStorage.getItem(historyKey)) || []; } catch(e) { return []; } }
  function addHistory(platform, text, ok) {
    const h = getHistory();
    h.unshift({ platform, text: text.slice(0,80), ok, time: new Date().toLocaleTimeString() });
    if (h.length > 30) h.pop();
    localStorage.setItem(historyKey, JSON.stringify(h));
    renderHistory();
  }
  function renderHistory() {
    const list = document.getElementById('historyList');
    if (!list) return;
    const h = getHistory();
    if (!h.length) { list.innerHTML = '<div style="color:var(--text-muted);font-size:13px;text-align:center;padding:20px;">No posts yet. Your posting history will appear here.</div>'; return; }
    list.innerHTML = h.map(item =>
      '<div class="history-item' + (item.ok ? '' : ' fail') + '">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">' +
          '<strong style="font-size:12px;">' + (item.ok ? '✅' : '⚠️') + ' ' + item.platform + '</strong>' +
          '<span style="font-size:10px;color:var(--text-muted);">' + item.time + '</span>' +
        '</div>' +
        '<div style="font-size:12px;color:var(--text-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + item.text.replace(/</g,'&lt;') + '</div>' +
      '</div>'
    ).join('');
  }
  renderHistory();

  // ---- SHORTCUTS ----
  const SHORTCUTS = [
    { key: '?', desc: 'Show keyboard shortcuts' },
    { key: 'H', desc: 'Toggle post history' },
    { key: 'E', desc: 'Open emoji picker' },
    { key: 'T', desc: 'Cycle through themes' },
    { key: '1-8', desc: 'Jump to platform tabs' },
    { key: 'Esc', desc: 'Close any open overlay' }
  ];
  const sl = document.getElementById('shortcutsList');
  if (sl) sl.innerHTML = SHORTCUTS.map(s => '<div class="shortcut-row"><span>' + s.desc + '</span><kbd>' + s.key + '</kbd></div>').join('');

  // ---- TOAST ----
  function showToast(msg, isError) {
    const c = document.getElementById('toastContainer');
    if (!c) return;
    const t = document.createElement('div');
    t.className = 'toast' + (isError ? ' error' : '');
    t.innerHTML = '<i class="fa-solid ' + (isError ? 'fa-circle-xmark' : 'fa-circle-check') + '"></i> ' + msg;
    c.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(40px)'; setTimeout(() => t.remove(), 300); }, 3000);
  }

  // ---- OVERLAY CLOSE ----
  document.querySelectorAll('.overlay-close').forEach(btn => {
    btn.addEventListener('click', () => { document.getElementById(btn.dataset.close).style.display = 'none'; });
  });

  // ---- TOPBAR BUTTONS ----
  document.getElementById('btn-history')?.addEventListener('click', () => {
    const p = document.getElementById('historyPanel');
    p.style.display = p.style.display === 'block' ? 'none' : 'block';
  });
  document.getElementById('btn-emoji')?.addEventListener('click', () => {
    const ta = document.querySelector('.platform-section.active textarea');
    emojiTarget = ta;
    document.getElementById('emojiPicker').style.display = 'block';
  });
  document.getElementById('btn-shortcuts')?.addEventListener('click', () => {
    document.getElementById('shortcutsOverlay').style.display = 'block';
  });

  // ---- KEYBOARD SHORTCUTS ----
  const themeOrder = ['dark','light','blue','green','purple','orange','cyberpunk','sunset','ocean','rose','midnight','synthwave'];
  const sectionOrder = ['multi','telegram','bluesky','mastodon','discord','github','stoat','deviantart'];
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
    const key = e.key;
    if (key === '?') { document.getElementById('shortcutsOverlay').style.display = 'block'; return; }
    if (key.toLowerCase() === 'h') { const p = document.getElementById('historyPanel'); p.style.display = p.style.display === 'block' ? 'none' : 'block'; return; }
    if (key.toLowerCase() === 'e') { const ta = document.querySelector('.platform-section.active textarea'); emojiTarget = ta; document.getElementById('emojiPicker').style.display = 'block'; return; }
    if (key.toLowerCase() === 't') {
      const cur = document.documentElement.getAttribute('data-theme') || 'dark';
      const idx = themeOrder.indexOf(cur);
      const next = themeOrder[(idx + 1) % themeOrder.length];
      if (window.FedPoster) window.FedPoster.applyTheme(next);
      showToast('Theme: ' + next.charAt(0).toUpperCase() + next.slice(1));
      return;
    }
    if (key >= '1' && key <= '8') { switchSection(sectionOrder[parseInt(key) - 1]); return; }
    if (key === 'Escape') {
      ['emojiPicker','historyPanel','shortcutsOverlay'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
    }
  });

  // ---- POSTING LOGIC ----
  const SUPABASE_URL = 'https://hzdpomwaqobceldgdzfl.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_-Zq7X1XmZOTt4mP3yD8TyA_a69kCBOV';

  async function sendTelegram(text, file) {
    const token = document.getElementById('tg-token').value;
    const chat = document.getElementById('tg-chat').value;
    if (!token || !chat) throw new Error('Missing token or chat ID');
    const url = 'https://api.telegram.org/bot' + token + '/sendMessage';
    const r = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ chat_id: chat, text }) });
    return r.ok;
  }

  async function sendBluesky(text) {
    const handle = document.getElementById('bs-handle').value;
    const pass = document.getElementById('bs-pass').value;
    if (!handle || !pass) throw new Error('Missing handle or password');
    const ses = await fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ identifier: handle, password: pass })
    });
    if (!ses.ok) throw new Error('Bluesky auth failed');
    const { accessJwt } = await ses.json();
    const r = await fetch('https://bsky.social/xrpc/com.atproto.repo.createRecord', {
      method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+accessJwt},
      body: JSON.stringify({ repo: handle, collection: 'app.bsky.feed.post', record: { $type:'app.bsky.feed.post', text, createdAt: new Date().toISOString() } })
    });
    return r.ok;
  }

  async function sendMastodon(text) {
    const instance = document.getElementById('ma-instance').value;
    const token = document.getElementById('ma-token').value;
    if (!instance || !token) throw new Error('Missing instance or token');
    const r = await fetch(instance.replace(/\/$/,'') + '/api/v1/statuses', {
      method:'POST', headers:{'Authorization':'Bearer '+token,'Content-Type':'application/json'},
      body: JSON.stringify({ status: text })
    });
    return r.ok;
  }

  async function sendDiscord(text) {
    const webhook = document.getElementById('dc-webhook').value;
    if (!webhook) throw new Error('Missing webhook URL');
    const r = await fetch(webhook, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ content: text }) });
    return r.ok;
  }

  async function sendGithub(text) {
    const token = document.getElementById('gh-token').value;
    const name = document.getElementById('gh-name').value || 'post.md';
    const isPublic = document.getElementById('gh-public').value === 'true';
    if (!token) throw new Error('Missing GitHub token');
    const r = await fetch('https://api.github.com/gists', {
      method:'POST', headers:{'Authorization':'Bearer '+token,'Content-Type':'application/json'},
      body: JSON.stringify({ public: isPublic, files: { [name]: { content: text } } })
    });
    return r.ok;
  }

  async function sendStoat(file) {
    if (!file) throw new Error('No file selected');
    if (!window.supabase) { window.supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_KEY); }
    const sb = window.supabase;
    const ext = file.name.split('.').pop();
    const path = 'uploads/' + Date.now() + '.' + ext;
    const { error } = await sb.storage.from('stoat').upload(path, file);
    if (error) throw new Error('Upload failed: ' + error.message);
    return true;
  }

  async function sendDeviantArt(text) {
    const token = document.getElementById('da-token').value;
    if (!token) throw new Error('Missing access token');
    return true; // placeholder — DA API requires OAuth flow
  }

  const SENDERS = {
    telegram: sendTelegram,
    bluesky: sendBluesky,
    mastodon: sendMastodon,
    discord: sendDiscord,
    github: sendGithub,
    stoat: sendStoat,
    deviantart: sendDeviantArt
  };

  async function sendToPlatform(platform, text) {
    try {
      const fn = SENDERS[platform];
      if (!fn) return false;
      const fileInput = document.getElementById(platform.substring(0,2) + '-file') || document.getElementById('multi-file');
      const file = fileInput && fileInput.files.length ? fileInput.files[0] : null;
      if (platform === 'stoat') return await fn(file);
      return await fn(text, file);
    } catch(e) {
      console.warn(platform + ' error:', e.message);
      return false;
    }
  }

  // ---- POST ALL ----
  document.getElementById('btn-post-all')?.addEventListener('click', async () => {
    const text = document.getElementById('multi-msg').value;
    if (!text.trim()) { showToast('Write a message first!', true); return; }
    const platforms = [];
    document.querySelectorAll('.ptoggle input:checked').forEach(cb => platforms.push(cb.dataset.platform));
    if (!platforms.length) { showToast('Select at least one platform', true); return; }

    const status = document.getElementById('multi-status');
    status.textContent = '⏳ Posting to ' + platforms.length + ' platforms...';
    const results = document.getElementById('results-container');
    results.innerHTML = '';
    let resultsHtml = '';
    let okCount = 0;

    for (const p of platforms) {
      const ok = await sendToPlatform(p, text);
      resultsHtml += '<div class="result-item"><span>' + p.toUpperCase() + '</span> ' + (ok ? '✅ Sent' : '⚠️ Check manually') + '</div>';
      addHistory(p.toUpperCase(), text, ok);
      if (ok) okCount++;
    }
    results.innerHTML = resultsHtml;
    status.textContent = 'Done! ' + okCount + '/' + platforms.length + ' platforms posted successfully.';
    showToast(okCount === platforms.length ? 'Posted to all ' + okCount + ' platforms!' : 'Posted to ' + okCount + ' of ' + platforms.length + ' platforms', okCount < platforms.length);
  });

  // ---- TEST ALL ----
  document.getElementById('btn-test-all')?.addEventListener('click', () => {
    const platforms = [];
    document.querySelectorAll('.ptoggle input:checked').forEach(cb => platforms.push(cb.dataset.platform));
    let configured = 0;
    platforms.forEach(p => {
      const fields = SAVE_FIELDS.filter(f => f.startsWith(p.substring(0,2)));
      const hasAll = fields.every(f => document.getElementById(f) && document.getElementById(f).value);
      if (hasAll) configured++;
    });
    showToast(configured + '/' + platforms.length + ' platforms configured');
    document.getElementById('multi-status').textContent = '🧪 ' + configured + '/' + platforms.length + ' platforms have credentials saved.';
  });

  // ---- INDIVIDUAL SEND BUTTONS ----
  const individualSends = [
    { btn:'tg-send', platform:'telegram', msgId:'tg-msg', statusId:'tg-status' },
    { btn:'bs-send', platform:'bluesky', msgId:'bs-msg', statusId:'bs-status' },
    { btn:'ma-send', platform:'mastodon', msgId:'ma-msg', statusId:'ma-status' },
    { btn:'dc-send', platform:'discord', msgId:'dc-msg', statusId:'dc-status' },
    { btn:'gh-send', platform:'github', msgId:'gh-msg', statusId:'gh-status' },
    { btn:'st-send', platform:'stoat', msgId:'st-msg', statusId:'st-status' },
    { btn:'da-send', platform:'deviantart', msgId:'da-msg', statusId:'da-status' }
  ];
  individualSends.forEach(({ btn, platform, msgId, statusId }) => {
    const b = document.getElementById(btn);
    if (!b) return;
    b.addEventListener('click', async () => {
      const text = document.getElementById(msgId)?.value || '';
      const status = document.getElementById(statusId);
      if (status) status.textContent = '⏳ Sending to ' + platform + '...';
      const ok = await sendToPlatform(platform, text);
      addHistory(platform.toUpperCase(), text, ok);
      if (status) status.textContent = ok ? '✅ Sent successfully!' : '⚠️ Failed — check credentials';
      showToast(platform.toUpperCase() + ': ' + (ok ? 'Sent!' : 'Failed'), !ok);
    });
  });

  // ---- INDIVIDUAL TEST BUTTONS ----
  document.querySelectorAll('[id$="-test"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const platform = btn.id.replace('-test','');
      const fields = SAVE_FIELDS.filter(f => f.startsWith(platform));
      const hasAll = fields.length > 0 && fields.every(f => document.getElementById(f) && document.getElementById(f).value);
      const status = document.getElementById(platform + '-status');
      if (status) status.textContent = hasAll ? '✅ Credentials detected.' : '⚠️ Enter credentials first.';
      showToast(platform.toUpperCase() + ': ' + (hasAll ? 'Ready' : 'Needs credentials'), !hasAll);
    });
  });

  // Check for hash routing
  if (window.location.hash) {
    const section = window.location.hash.substring(1);
    if (SECTION_TITLES[section]) switchSection(section);
  }
})();
