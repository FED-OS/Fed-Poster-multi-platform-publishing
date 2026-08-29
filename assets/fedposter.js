/* ================================================================
   FED-POSTER SHARED JAVASCRIPT
   Theme persistence, mobile nav, scroll reveal, Discord count
   ================================================================ */
(function() {
  'use strict';

  // ---- THEME PERSISTENCE (shared across all pages) ----
  const THEMES = ['dark','light','blue','green','purple','orange','cyberpunk','sunset','ocean','rose','midnight','synthwave'];
  const THEME_LABELS = {
    dark:'Deep Space', light:'Cloud', blue:'Azure Depth', green:'Emerald Forest',
    purple:'Royal Nebula', orange:'Molten Lava', cyberpunk:'Cyberpunk', sunset:'Sunset',
    ocean:'Abyssal Teal', rose:'Luxe Blush', midnight:'Cobalt Steel', synthwave:'Synthwave'
  };
  const THEME_GRADIENTS = {
    dark:'linear-gradient(135deg,#0a0e1a,#6c5ce7)',
    light:'linear-gradient(135deg,#eef1f6,#6c5ce7)',
    blue:'linear-gradient(135deg,#061a2e,#0a84ff)',
    green:'linear-gradient(135deg,#06231a,#00b87a)',
    purple:'linear-gradient(135deg,#160833,#8b5cf6)',
    orange:'linear-gradient(135deg,#2e1206,#ff6b1a)',
    cyberpunk:'linear-gradient(135deg,#0d0118,#ff2e88)',
    sunset:'linear-gradient(135deg,#3d1a2e,#ff4d6d)',
    ocean:'linear-gradient(135deg,#022829,#00b8a9)',
    rose:'linear-gradient(135deg,#3d2a28,#e8a0a0)',
    midnight:'linear-gradient(135deg,#080b1a,#4f8cff)',
    synthwave:'linear-gradient(135deg,#0d041a,#ff79c6)'
  };

  function applyTheme(theme) {
    if (!THEMES.includes(theme)) theme = 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('fedposter_theme', theme);
    // update swatches
    document.querySelectorAll('.nav-theme-picker .swatch').forEach(s => {
      s.classList.toggle('active', s.dataset.theme === theme);
    });
  }

  function initTheme() {
    const saved = localStorage.getItem('fedposter_theme') || 'dark';
    applyTheme(saved);
  }

  // Build the theme picker into any .nav-theme-picker container
  function buildThemePicker(container) {
    if (!container) return;
    container.innerHTML = '';
    THEMES.forEach(t => {
      const s = document.createElement('div');
      s.className = 'swatch';
      s.dataset.theme = t;
      s.title = THEME_LABELS[t];
      s.style.background = THEME_GRADIENTS[t];
      s.addEventListener('click', () => applyTheme(t));
      container.appendChild(s);
    });
    const saved = localStorage.getItem('fedposter_theme') || 'dark';
    container.querySelectorAll('.swatch').forEach(s => {
      s.classList.toggle('active', s.dataset.theme === saved);
    });
  }

  // ---- MOBILE NAV TOGGLE ----
  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');
    if (toggle && links) {
      toggle.addEventListener('click', () => links.classList.toggle('open'));
    }
  }

  // ---- SCROLL REVEAL ----
  function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // ---- DISCORD LIVE COUNT (shared) ----
  const DISCORD_SERVER_ID = '1400235929154879490';
  function initDiscordCount() {
    const el = document.getElementById('discord-online-count');
    if (!el) return;
    async function fetchCount() {
      try {
        const resp = await fetch('https://discord.com/api/guilds/' + DISCORD_SERVER_ID + '/widget.json');
        if (!resp.ok) throw new Error('widget unavailable');
        const data = await resp.json();
        const count = data.presence_count || 0;
        el.textContent = count.toLocaleString();
        el.parentElement.style.opacity = '1';
      } catch(e) {
        el.textContent = '?';
        el.parentElement.style.opacity = '0.6';
      }
    }
    fetchCount();
    setInterval(fetchCount, 60000);
  }

  // ---- ACTIVE NAV LINK ----
  function initActiveNav() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(a => {
      const href = a.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  }

  // ---- INIT ON DOM READY ----
  function init() {
    initTheme();
    buildThemePicker(document.querySelector('.nav-theme-picker'));
    initMobileNav();
    initScrollReveal();
    initDiscordCount();
    initActiveNav();
    injectMeshBg();
    injectCmdkHint();
    initCounters();
    document.addEventListener('keydown', globalKeydown);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ================================================================
  // UPGRADE v2 — Toasts, Command Palette, Keyboard Shortcuts
  // ================================================================

  // ---- TOAST SYSTEM ----
  function ensureToastStack() {
    let stack = document.querySelector('.fp-toast-stack');
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'fp-toast-stack';
      document.body.appendChild(stack);
    }
    return stack;
  }
  const TOAST_ICONS = { success:'fa-circle-check', error:'fa-circle-xmark', warn:'fa-triangle-exclamation', info:'fa-circle-info' };
  function toast(title, msg, type, timeout) {
    const stack = ensureToastStack();
    const t = document.createElement('div');
    t.className = 'fp-toast ' + (type || 'info');
    t.innerHTML = '<i class="fa-solid ' + (TOAST_ICONS[type] || TOAST_ICONS.info) + ' t-ico"></i>' +
      '<div class="t-body"><div class="t-title"></div><div class="t-msg"></div></div>' +
      '<i class="fa-solid fa-xmark t-close"></i>';
    t.querySelector('.t-title').textContent = title || '';
    t.querySelector('.t-msg').textContent = msg || '';
    const close = () => { t.classList.add('leaving'); setTimeout(() => t.remove(), 260); };
    t.querySelector('.t-close').addEventListener('click', close);
    stack.appendChild(t);
    if (timeout !== 0) setTimeout(close, timeout || 4200);
    return t;
  }

  // ---- COMMAND PALETTE (Cmd/Ctrl+K) ----
  function buildCommands() {
    const cmds = [];
    // Pages
    const pages = [
      { id:'index', label:'Go to Home', ico:'fa-house', hint:'Landing page', url:'index.html', group:'Navigation' },
      { id:'dashboard', label:'Go to Dashboard', ico:'fa-gauge-high', hint:'Composer & platforms', url:'dashboard.html', group:'Navigation' },
      { id:'calendar', label:'Go to Calendar', ico:'fa-calendar-days', hint:'Scheduled posts', url:'calendar.html', group:'Navigation' },
      { id:'analytics', label:'Go to Analytics', ico:'fa-chart-line', hint:'Insights & charts', url:'analytics.html', group:'Navigation' },
      { id:'inbox', label:'Go to Inbox', ico:'fa-inbox', hint:'Unified feed reader', url:'inbox.html', group:'Navigation' },
      { id:'pricing', label:'Go to Pricing', ico:'fa-tags', hint:'Plans & tiers', url:'pricing.html', group:'Navigation' },
      { id:'settings', label:'Go to Settings', ico:'fa-gear', hint:'Preferences & accounts', url:'settings.html', group:'Navigation' },
    ];
    pages.forEach(p => cmds.push({ ...p, run: () => { window.location.href = p.url; } }));
    // Themes
    THEMES.forEach(t => cmds.push({
      id:'theme-'+t, label:'Theme: ' + THEME_LABELS[t], ico:'fa-palette', hint:'Appearance', group:'Themes',
      run: () => { applyTheme(t); toast('Theme changed', THEME_LABELS[t] + ' applied', 'success'); }
    }));
    // Actions
    cmds.push({ id:'act-shortcuts', label:'Keyboard Shortcuts', ico:'fa-keyboard', hint:'Show help', group:'Actions', run: openShortcuts });
    cmds.push({ id:'act-top', label:'Scroll to Top', ico:'fa-arrow-up', hint:'Jump up', group:'Actions', run: () => window.scrollTo({top:0,behavior:'smooth'}) });
    cmds.push({ id:'act-toggle-nav', label:'Toggle Mobile Nav', ico:'fa-bars', hint:'Menu', group:'Actions', run: () => { const l=document.querySelector('.nav-links'); if(l) l.classList.toggle('open'); } });
    return cmds;
  }

  let cmdkState = { open:false, cmds:[], filtered:[], active:0 };
  function buildCmdk() {
    if (document.querySelector('.fp-cmdk-overlay')) return;
    const ov = document.createElement('div');
    ov.className = 'fp-cmdk-overlay';
    ov.innerHTML =
      '<div class="fp-cmdk">' +
        '<div class="fp-cmdk-search"><i class="fa-solid fa-magnifying-glass"></i>' +
        '<input type="text" placeholder="Search pages, themes, actions…" autocomplete="off" />' +
        '<kbd>esc</kbd></div>' +
        '<div class="fp-cmdk-list"></div>' +
        '<div class="fp-cmdk-foot">' +
          '<span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>' +
          '<span><kbd>↵</kbd> select</span>' +
          '<span><kbd>esc</kbd> close</span>' +
        '</div>' +
      '</div>';
    document.body.appendChild(ov);
    const input = ov.querySelector('input');
    const list = ov.querySelector('.fp-cmdk-list');
    cmdkState.cmds = buildCommands();

    function render() {
      const q = input.value.trim().toLowerCase();
      cmdkState.filtered = cmdkState.cmds.filter(c =>
        !q || c.label.toLowerCase().indexOf(q) >= 0 || (c.hint||'').toLowerCase().indexOf(q) >= 0);
      cmdkState.active = 0;
      let html = ''; let lastGroup = '';
      cmdkState.filtered.forEach((c, i) => {
        if (c.group !== lastGroup) { html += '<div class="fp-cmdk-group">' + c.group + '</div>'; lastGroup = c.group; }
        html += '<div class="fp-cmdk-item' + (i === 0 ? ' active' : '') + '" data-i="' + i + '">' +
          '<span class="ico"><i class="fa-solid ' + c.ico + '"></i></span>' +
          '<span class="label"></span><span class="hint"></span></div>';
      });
      if (!cmdkState.filtered.length) html = '<div class="fp-cmdk-group">No results</div>';
      list.innerHTML = html;
      list.querySelectorAll('.fp-cmdk-item').forEach(el => {
        const c = cmdkState.filtered[+el.dataset.i];
        el.querySelector('.label').textContent = c.label;
        el.querySelector('.hint').textContent = c.hint || '';
        el.addEventListener('click', () => { c.run(); closeCmdk(); });
        el.addEventListener('mouseenter', () => { cmdkState.active = +el.dataset.i; updateActive(); });
      });
    }
    function updateActive() {
      list.querySelectorAll('.fp-cmdk-item').forEach(el => {
        el.classList.toggle('active', +el.dataset.i === cmdkState.active);
        if (+el.dataset.i === cmdkState.active) el.scrollIntoView({ block:'nearest' });
      });
    }
    input.addEventListener('input', render);
    ov.addEventListener('click', e => { if (e.target === ov) closeCmdk(); });
    cmdkState._input = input; cmdkState._list = list; cmdkState._render = render; cmdkState._updateActive = updateActive;
  }
  function openCmdk() {
    buildCmdk();
    const ov = document.querySelector('.fp-cmdk-overlay');
    ov.classList.add('open'); cmdkState.open = true;
    cmdkState._input.value = ''; cmdkState._render();
    setTimeout(() => cmdkState._input.focus(), 30);
  }
  function closeCmdk() {
    const ov = document.querySelector('.fp-cmdk-overlay');
    if (ov) ov.classList.remove('open'); cmdkState.open = false;
  }
  function cmdkKeydown(e) {
    if (!cmdkState.open) return;
    if (e.key === 'Escape') { e.preventDefault(); closeCmdk(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); cmdkState.active = (cmdkState.active + 1) % Math.max(1, cmdkState.filtered.length); cmdkState._updateActive(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); cmdkState.active = (cmdkState.active - 1 + Math.max(1, cmdkState.filtered.length)) % Math.max(1, cmdkState.filtered.length); cmdkState._updateActive(); }
    else if (e.key === 'Enter') { e.preventDefault(); const c = cmdkState.filtered[cmdkState.active]; if (c) { c.run(); closeCmdk(); } }
  }

  // ---- KEYBOARD SHORTCUTS OVERLAY ----
  function buildShortcuts() {
    if (document.querySelector('.fp-shortcuts-overlay')) return;
    const ov = document.createElement('div');
    ov.className = 'fp-shortcuts-overlay';
    const rows = [
      ['Open Command Palette', ['Ctrl','K']],
      ['Keyboard Shortcuts', ['?']],
      ['Go to Dashboard', ['g','d']],
      ['Go to Calendar', ['g','c']],
      ['Go to Analytics', ['g','a']],
      ['Go to Inbox', ['g','i']],
      ['Go to Settings', ['g','s']],
      ['Scroll to Top', ['g','t']],
      ['Toggle Mobile Nav', ['m']],
      ['Close any overlay', ['Esc']],
    ];
    let body = '';
    rows.forEach(r => {
      body += '<div class="fp-sc-row"><span class="desc"></span><span class="keys">' +
        r[1].map(k => '<kbd></kbd>').join('') + '</span></div>';
    });
    ov.innerHTML = '<div class="fp-shortcuts"><div class="fp-shortcuts-head">' +
      '<i class="fa-solid fa-keyboard"></i><h3>Keyboard Shortcuts</h3></div>' +
      '<div class="fp-shortcuts-body">' + body + '</div></div>';
    document.body.appendChild(ov);
    const descs = ov.querySelectorAll('.desc'); const keyEls = ov.querySelectorAll('.keys');
    rows.forEach((r, i) => {
      descs[i].textContent = r[0];
      keyEls[i].querySelectorAll('kbd').forEach((k, j) => k.textContent = r[1][j]);
    });
    ov.addEventListener('click', e => { if (e.target === ov) closeShortcuts(); });
  }
  function openShortcuts() { buildShortcuts(); document.querySelector('.fp-shortcuts-overlay').classList.add('open'); }
  function closeShortcuts() { const o = document.querySelector('.fp-shortcuts-overlay'); if (o) o.classList.remove('open'); }

  // ---- GLOBAL KEY HANDLER ----
  let gKey = null; let gTimer = null;
  function globalKeydown(e) {
    // ignore when typing in fields (except Esc and the palette toggle)
    const tag = (e.target.tagName || '').toLowerCase();
    const typing = (tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable);
    if (typing && !(e.key === 'Escape')) { cmdkKeydown(e); return; }
    // Cmd/Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); cmdkState.open ? closeCmdk() : openCmdk(); return; }
    if (cmdkState.open) { cmdkKeydown(e); return; }
    if (e.key === 'Escape') { closeShortcuts(); return; }
    if (e.key === '?' && !typing) { e.preventDefault(); openShortcuts(); return; }
    // 'g' prefix sequences
    if (gKey === 'g' && !typing) {
      const map = { d:'dashboard.html', c:'calendar.html', a:'analytics.html', i:'inbox.html', s:'settings.html' };
      if (map[e.key.toLowerCase()]) { e.preventDefault(); window.location.href = map[e.key.toLowerCase()]; }
      if (e.key.toLowerCase() === 't') { e.preventDefault(); window.scrollTo({top:0,behavior:'smooth'}); }
      gKey = null; clearTimeout(gTimer); return;
    }
    if (!typing && e.key === 'g') { gKey = 'g'; clearTimeout(gTimer); gTimer = setTimeout(() => gKey = null, 900); return; }
    if (!typing && e.key.toLowerCase() === 'm') { e.preventDefault(); const l = document.querySelector('.nav-links'); if (l) l.classList.toggle('open'); }
  }

  // ---- ANIMATED COUNTERS ----
  function initCounters() {
    const els = document.querySelectorAll('[data-counter]');
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target; io.unobserve(el);
        const target = parseFloat(el.dataset.counter);
        const dur = parseInt(el.dataset.duration || 1400, 10);
        const dec = (el.dataset.decimals ? parseInt(el.dataset.decimals, 10) : 0);
        const suffix = el.dataset.suffix || ''; const prefix = el.dataset.prefix || '';
        const start = performance.now();
        function tick(now) {
          const p = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target * eased;
          el.textContent = prefix + val.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    els.forEach(el => io.observe(el));
  }

  // ---- CMD+K HINT PILL (inject into navbar on app pages) ----
  function injectCmdkHint() {
    const navRight = document.querySelector('.nav-right');
    if (!navRight || document.querySelector('.fp-cmdk-hint')) return;
    const pill = document.createElement('div');
    pill.className = 'fp-cmdk-hint';
    pill.innerHTML = 'Search <kbd>⌘K</kbd>';
    pill.addEventListener('click', openCmdk);
    navRight.insertBefore(pill, navRight.firstChild);
  }

  // ---- MESH BACKGROUND (inject once) ----
  function injectMeshBg() {
    if (document.querySelector('.fp-mesh-bg')) return;
    const bg = document.createElement('div');
    bg.className = 'fp-mesh-bg';
    bg.innerHTML = '<div class="fp-mesh-orb"></div>';
    document.body.insertBefore(bg, document.body.firstChild);
  }

  // Expose for other scripts
  window.FedPoster = { applyTheme, THEMES, THEME_LABELS, buildThemePicker, toast, openCmdk, closeCmdk, openShortcuts, injectMeshBg };
})();
