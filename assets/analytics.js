/* ================================================================
   ANALYTICS PAGE JAVASCRIPT
   Canvas charts (line + donut), per-platform breakdown, activity
   ================================================================ */
(function() {
  'use strict';

  const PLATFORMS = [
    { id:'telegram', name:'Telegram', color:'#229ED9', icon:'fa-brands fa-telegram', posts:38 },
    { id:'bluesky', name:'Bluesky', color:'#0EA5E9', icon:'fa-solid fa-cloud', posts:32 },
    { id:'mastodon', name:'Mastodon', color:'#6364FF', icon:'fa-brands fa-mastodon', posts:24 },
    { id:'discord', name:'Discord', color:'#5865F2', icon:'fa-brands fa-discord', posts:28 },
    { id:'github', name:'GitHub Gist', color:'#444c56', icon:'fa-brands fa-github', posts:12 },
    { id:'stoat', name:'Stoat', color:'#FF6B35', icon:'fa-solid fa-comment-dots', posts:8 },
    { id:'deviantart', name:'DeviantArt', color:'#00E59B', icon:'fa-brands fa-deviantart', posts:18 }
  ];

  function getAccent() {
    return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#6c5ce7';
  }
  function getTextColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#8a8aaa';
  }
  function getCardBg() {
    return getComputedStyle(document.documentElement).getPropertyValue('--bg-input').trim() || '#f5f6fa';
  }

  // ---- LINE CHART ----
  function drawLineChart() {
    const canvas = document.getElementById('lineChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth, h = 260;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const accent = getAccent();
    const textColor = getTextColor();
    const data = [8, 12, 6, 15, 11, 18, 22, 14, 9, 16, 20, 13, 17, 24];
    const labels = ['','','','','','','','','','','','','',''];
    const max = Math.max(...data) * 1.2;
    const pad = 40;
    const cw = w - pad * 2;
    const ch = h - pad * 2;

    // Grid lines
    ctx.strokeStyle = textColor + '20';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad + (ch / 4) * i;
      ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(w - pad, y); ctx.stroke();
    }

    // Line + fill
    ctx.beginPath();
    data.forEach((v, i) => {
      const x = pad + (cw / (data.length - 1)) * i;
      const y = pad + ch - (v / max) * ch;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    // Fill gradient
    const grad = ctx.createLinearGradient(0, pad, 0, h - pad);
    grad.addColorStop(0, accent + '40');
    grad.addColorStop(1, accent + '00');
    ctx.lineTo(w - pad, h - pad); ctx.lineTo(pad, h - pad); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();

    // Line stroke
    ctx.beginPath();
    data.forEach((v, i) => {
      const x = pad + (cw / (data.length - 1)) * i;
      const y = pad + ch - (v / max) * ch;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = accent; ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.stroke();

    // Points
    data.forEach((v, i) => {
      const x = pad + (cw / (data.length - 1)) * i;
      const y = pad + ch - (v / max) * ch;
      ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = accent; ctx.fill();
      ctx.strokeStyle = getCardBg(); ctx.lineWidth = 2; ctx.stroke();
    });
  }

  // ---- DONUT CHART ----
  function drawDonutChart() {
    const canvas = document.getElementById('donutChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = 260;
    canvas.width = size * dpr; canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size, size);

    const total = PLATFORMS.reduce((s, p) => s + p.posts, 0);
    const cx = size / 2, cy = size / 2;
    const outerR = 110, innerR = 70;
    let start = -Math.PI / 2;

    PLATFORMS.forEach(p => {
      const angle = (p.posts / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, start, start + angle);
      ctx.arc(cx, cy, innerR, start + angle, start, true);
      ctx.closePath();
      ctx.fillStyle = p.color; ctx.fill();
      start += angle;
    });

    // Center text
    ctx.fillStyle = getTextColor();
    ctx.font = '600 13px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('Total', cx, cy - 8);
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim();
    ctx.font = '800 28px Inter';
    ctx.fillText(total, cx, cy + 18);

    // Legend
    const legend = document.getElementById('donut-legend');
    legend.innerHTML = PLATFORMS.map(p =>
      '<div class="donut-legend-item"><span class="dl-dot" style="background:' + p.color + '"></span>' + p.name + '<span class="dl-val">' + p.posts + '</span></div>'
    ).join('');
  }

  // ---- BREAKDOWN ----
  function renderBreakdown() {
    const total = PLATFORMS.reduce((s, p) => s + p.posts, 0);
    const grid = document.getElementById('breakdown-grid');
    grid.innerHTML = PLATFORMS.map(p => {
      const pct = ((p.posts / total) * 100).toFixed(0);
      return '<div class="breakdown-row">' +
        '<div class="br-icon" style="background:' + p.color + '"><i class="' + p.icon + '"></i></div>' +
        '<div class="br-info"><div class="br-name">' + p.name + '</div>' +
        '<div class="br-bar"><div class="br-bar-fill" style="width:' + pct + '%;background:' + p.color + '"></div></div></div>' +
        '<div class="br-stats"><div class="br-num">' + p.posts + '</div><div class="br-pct">' + pct + '%</div></div>' +
      '</div>';
    }).join('');
    // Animate bars
    setTimeout(() => {
      document.querySelectorAll('.br-bar-fill').forEach(b => { b.style.width = b.style.width; });
    }, 100);
  }

  // ---- ACTIVITY ----
  function renderActivity() {
    const activities = [
      { platform:'telegram', text:'🚀 Product launch announcement', time:'2 hours ago', ok:true },
      { platform:'bluesky', text:'📊 Weekly analytics recap', time:'5 hours ago', ok:true },
      { platform:'discord', text:'🔥 Friday community shoutout', time:'Yesterday', ok:true },
      { platform:'mastodon', text:'💡 Dev tips thread', time:'2 days ago', ok:false },
      { platform:'deviantart', text:'🎨 New artwork drop', time:'3 days ago', ok:true },
      { platform:'github', text:'📝 Published new gist', time:'4 days ago', ok:true }
    ];
    const list = document.getElementById('activity-list');
    list.innerHTML = activities.map(a => {
      const p = PLATFORMS.find(x => x.id === a.platform);
      return '<div class="activity-item">' +
        '<div class="ai-icon" style="background:' + p.color + '"><i class="' + p.icon + '"></i></div>' +
        '<div class="ai-content"><div class="ai-text">' + a.text + '</div><div class="ai-meta">' + p.name + ' · ' + a.time + '</div></div>' +
        '<div class="ai-status ' + (a.ok ? 'ok' : 'fail') + '">' + (a.ok ? '✅ Sent' : '⚠️ Failed') + '</div>' +
      '</div>';
    }).join('');
  }

  // ---- TIME FILTER ----
  document.querySelectorAll('.tf-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tf-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      // re-randomize KPI numbers slightly for demo
      const range = parseInt(btn.dataset.range);
      const total = Math.floor(range * 1.8 + Math.random() * 20);
      const success = Math.floor(total * 0.9);
      document.getElementById('kpi-total').textContent = total;
      document.getElementById('kpi-success').textContent = success;
      drawLineChart();
    });
  });

  // ---- INIT ----
  function init() {
    drawLineChart();
    drawDonutChart();
    renderBreakdown();
    renderActivity();
  }
  init();

  // Redraw charts on theme change (observer on data-theme)
  const observer = new MutationObserver(() => { drawLineChart(); drawDonutChart(); });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // Redraw on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { drawLineChart(); }, 200);
  });
})();
