/* ================================================================
   FED-POSTER — SETTINGS PAGE LOGIC
   Tab switching, accounts, theme gallery, data management
   ================================================================ */
(function() {
  'use strict';

  // ---- PLATFORM ACCOUNTS ----
  const ACCOUNTS = [
    { id:'telegram', name:'Telegram', icon:'fa-brands fa-telegram', color:'#229ED9',
      keys:['fedposter_tg-token'], label:'Bot Token' },
    { id:'bluesky', name:'Bluesky', icon:'fa-solid fa-cloud', color:'#1184FE',
      keys:['fedposter_bsky-identifier','fedposter_bsky-password'], label:'Identifier + App Password' },
    { id:'mastodon', name:'Mastodon', icon:'fa-brands fa-mastodon', color:'#6364FF',
      keys:['fedposter_masto-instance','fedposter_masto-token'], label:'Instance + Token' },
    { id:'discord', name:'Discord', icon:'fa-brands fa-discord', color:'#5865F2',
      keys:['fedposter_disc-webhook'], label:'Webhook URL' },
    { id:'github', name:'GitHub Gist', icon:'fa-brands fa-github', color:'#f0f6fc',
      keys:['fedposter_gh-token'], label:'Personal Access Token' },
    { id:'stoat', name:'Stoat', icon:'fa-solid fa-image', color:'#7C3AED',
      keys:['fedposter_stoat-bucket'], label:'No external storage required' },
    { id:'deviantart', name:'DeviantArt', icon:'fa-brands fa-deviantart', color:'#05CC47',
      keys:['fedposter_da-token'], label:'OAuth (coming soon)' },
    { id:'reddit', name:'Reddit', icon:'fa-brands fa-reddit', color:'#FF4500',
      keys:['fedposter_rd-token'], label:'Access Token + Agent' },
    { id:'x', name:'X (Twitter)', icon:'fa-brands fa-x-twitter', color:'#000000',
      keys:['fedposter_x-token'], label:'Bearer Token' },
    { id:'linkedin', name:'LinkedIn', icon:'fa-brands fa-linkedin', color:'#0A66C2',
      keys:['fedposter_li-token'], label:'Access Token' },
    { id:'facebook', name:'Facebook', icon:'fa-brands fa-facebook', color:'#1877F2',
      keys:['fedposter_fb-token'], label:'Page Access Token' },
    { id:'pinterest', name:'Pinterest', icon:'fa-brands fa-pinterest', color:'#E60023',
      keys:['fedposter_pi-token'], label:'Access Token' },
    { id:'threads', name:'Threads', icon:'fa-brands fa-threads', color:'#000000',
      keys:['fedposter_th-token'], label:'Threads API Token' },
    { id:'tumblr', name:'Tumblr', icon:'fa-brands fa-tumblr', color:'#36465D',
      keys:['fedposter_tb-token'], label:'OAuth Token + Secret' },
    { id:'nostr', name:'Nostr', icon:'fa-solid fa-bolt', color:'#A855F7',
      keys:['fedposter_no-key'], label:'Private Key (nsec)' },
    { id:'instagram', name:'Instagram', icon:'fa-brands fa-instagram', color:'#E1306C',
      keys:['fedposter_ig-token'], label:'Graph API Token + Account ID' },
    { id:'youtube', name:'YouTube', icon:'fa-brands fa-youtube', color:'#FF0000',
      keys:['fedposter_yt-key'], label:'API Key + Channel ID' },
    { id:'tiktok', name:'TikTok', icon:'fa-brands fa-tiktok', color:'#000000',
      keys:['fedposter_tk-token'], label:'Content API Token + Open ID' },
    { id:'snapchat', name:'Snapchat', icon:'fa-brands fa-snapchat', color:'#FFFC00',
      keys:['fedposter_sc-token'], label:'Marketing API Token' },
    { id:'whatsapp', name:'WhatsApp', icon:'fa-brands fa-whatsapp', color:'#25D366',
      keys:['fedposter_wa-token'], label:'Cloud API Token + Phone ID' },
    { id:'slack', name:'Slack', icon:'fa-brands fa-slack', color:'#611F69',
      keys:['fedposter_sl-webhook'], label:'Incoming Webhook URL' },
    { id:'medium', name:'Medium', icon:'fa-brands fa-medium', color:'#12100E',
      keys:['fedposter_md-token'], label:'Integration Token' },
    { id:'wordpress', name:'WordPress', icon:'fa-brands fa-wordpress', color:'#21759B',
      keys:['fedposter_wp-pass'], label:'Site URL + App Password' },
    { id:'vk', name:'VKontakte', icon:'fa-brands fa-vk', color:'#0077FF',
      keys:['fedposter_vk-token'], label:'Access Token + Owner ID' },
    { id:'weibo', name:'Weibo', icon:'fa-solid fa-weibo', color:'#E6162D',
      keys:['fedposter_wb-token'], label:'OAuth 2.0 Access Token' },
    { id:'nextdoor', name:'Nextdoor', icon:'fa-solid fa-house', color:'#8BC53F',
      keys:['fedposter_nd-token'], label:'API Token' },
    { id:'flickr', name:'Flickr', icon:'fa-brands fa-flickr', color:'#FF0084',
      keys:['fedposter_fl-token'], label:'OAuth Token + Secret' },
    { id:'gbp', name:'Google Business', icon:'fa-brands fa-google', color:'#4285F4',
      keys:['fedposter_gb-token'], label:'OAuth Token + Location ID' },
    { id:'farcaster', name:'Farcaster', icon:'fa-solid fa-paper-plane', color:'#855DCD',
      keys:['fedposter_fc-token'], label:'Signer Token / FID' }
  ];

  function isConnected(acc) {
    return acc.keys.some(k => localStorage.getItem(k));
  }

  function renderAccounts() {
    const grid = document.getElementById('accounts-grid');
    if (!grid) return;
    grid.innerHTML = '';
    ACCOUNTS.forEach(acc => {
      const connected = isConnected(acc);
      const card = document.createElement('div');
      card.className = 'account-card';
      card.innerHTML = `
        <div class="account-head">
          <div class="account-icon" style="background:${acc.color}"><i class="${acc.icon}"></i></div>
          <div>
            <h3>${acc.name}</h3>
            <div class="account-sub">${acc.label}</div>
          </div>
        </div>
        <div class="account-status ${connected ? 'connected' : 'not-connected'}">
          <span class="dot"></span> ${connected ? 'Connected' : 'Not connected'}
        </div>
        <div class="account-actions">
          <a href="dashboard.html" class="btn btn-primary btn-sm"><i class="fa-solid fa-pen"></i> Configure</a>
          <button class="btn btn-ghost btn-sm" data-clear="${acc.id}"><i class="fa-solid fa-trash"></i> Clear</button>
        </div>
      `;
      grid.appendChild(card);
    });
    // wire clear buttons
    grid.querySelectorAll('[data-clear]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.clear;
        const acc = ACCOUNTS.find(a => a.id === id);
        if (!acc) return;
        acc.keys.forEach(k => localStorage.removeItem(k));
        renderAccounts();
        updateDataStats();
        showToast(`Cleared ${acc.name} credentials`, 'success');
      });
    });
  }

  // ---- THEME GALLERY ----
  // Gradients (mirrors fedposter.js which doesn't export this map)
  const GRAD = {
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
  const LABELS = window.FedPoster?.THEME_LABELS || {
    dark:'Deep Space', light:'Cloud', blue:'Azure Depth', green:'Emerald Forest',
    purple:'Royal Nebula', orange:'Molten Lava', cyberpunk:'Cyberpunk', sunset:'Sunset',
    ocean:'Abyssal Teal', rose:'Luxe Blush', midnight:'Cobalt Steel', synthwave:'Synthwave'
  };

  function renderThemeGallery() {
    const gallery = document.getElementById('theme-gallery');
    if (!gallery) return;
    gallery.innerHTML = '';
    const themes = window.FedPoster?.THEMES || Object.keys(GRAD);
    const current = localStorage.getItem('fedposter_theme') || 'dark';
    themes.forEach(t => {
      const card = document.createElement('div');
      card.className = 'theme-card' + (t === current ? ' active' : '');
      card.dataset.theme = t;
      card.innerHTML = `
        <div class="theme-card-swatch" style="background:${GRAD[t]}">
          <span>${LABELS[t]}</span>
        </div>
        <div class="theme-card-check"><i class="fa-solid fa-check"></i></div>
      `;
      card.addEventListener('click', () => {
        if (window.FedPoster?.applyTheme) window.FedPoster.applyTheme(t);
        else {
          document.documentElement.setAttribute('data-theme', t);
          localStorage.setItem('fedposter_theme', t);
        }
        gallery.querySelectorAll('.theme-card').forEach(c => c.classList.toggle('active', c.dataset.theme === t));
        updateDataStats();
        showToast(`Theme set to ${LABELS[t]}`, 'success');
      });
      gallery.appendChild(card);
    });
  }

  // ---- TAB SWITCHING ----
  function initTabs() {
    const navItems = document.querySelectorAll('.settings-nav-item');
    const panels = document.querySelectorAll('.settings-panel');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const tab = item.dataset.tab;
        navItems.forEach(n => n.classList.toggle('active', n === item));
        panels.forEach(p => p.classList.toggle('active', p.id === 'panel-' + tab));
      });
    });
  }

  // ---- DATA STATS ----
  function countCreds() {
    let count = 0;
    ACCOUNTS.forEach(acc => {
      acc.keys.forEach(k => { if (localStorage.getItem(k)) count++; });
    });
    return count;
  }

  function updateDataStats() {
    const creds = document.getElementById('data-creds');
    const hist = document.getElementById('data-history');
    const cal = document.getElementById('data-calendar');
    const theme = document.getElementById('data-theme');
    if (creds) creds.textContent = countCreds() + ' items';
    if (hist) {
      try {
        const h = JSON.parse(localStorage.getItem('fedposter_history') || '[]');
        hist.textContent = h.length + ' entries';
      } catch(e) { hist.textContent = '0 entries'; }
    }
    if (cal) {
      try {
        const c = JSON.parse(localStorage.getItem('fedposter_calendar') || '[]');
        cal.textContent = c.length + ' posts';
      } catch(e) { cal.textContent = '0 posts'; }
    }
    if (theme) theme.textContent = localStorage.getItem('fedposter_theme') || 'dark';
  }

  // ---- DATA ACTIONS ----
  function initDataActions() {
    const exportBtn = document.getElementById('export-data');
    const clearHist = document.getElementById('clear-history');
    const clearAll = document.getElementById('clear-all');

    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const data = {};
        Object.keys(localStorage).filter(k => k.startsWith('fedposter_')).forEach(k => {
          data[k] = localStorage.getItem(k);
        });
        const blob = new Blob([JSON.stringify(data, null, 2)], { type:'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'fedposter-export-' + Date.now() + '.json';
        a.click();
        URL.revokeObjectURL(url);
        showToast('Data exported successfully', 'success');
      });
    }

    if (clearHist) {
      clearHist.addEventListener('click', () => {
        localStorage.removeItem('fedposter_history');
        updateDataStats();
        showToast('Post history cleared', 'success');
      });
    }

    if (clearAll) {
      clearAll.addEventListener('click', () => {
        if (!confirm('This will permanently delete ALL Fed-Poster data including credentials, history, and calendar posts. Continue?')) return;
        Object.keys(localStorage).filter(k => k.startsWith('fedposter_')).forEach(k => localStorage.removeItem(k));
        localStorage.setItem('fedposter_theme', 'dark');
        if (window.FedPoster?.applyTheme) window.FedPoster.applyTheme('dark');
        renderAccounts();
        renderThemeGallery();
        updateDataStats();
        showToast('All data cleared', 'success');
      });
    }
  }

  // ---- TOAST ----
  function showToast(msg, type) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const t = document.createElement('div');
    t.className = 'toast ' + (type || '');
    t.textContent = msg;
    container.appendChild(t);
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateX(20px)';
      t.style.transition = 'all .3s';
      setTimeout(() => t.remove(), 300);
    }, 3000);
  }

  // ---- INIT ----
  function init() {
    initTabs();
    renderAccounts();
    renderThemeGallery();
    updateDataStats();
    initDataActions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
