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
    { id:'deviantart', name:'DeviantArt', color:'#00E59B', icon:'fa-brands fa-deviantart', posts:18 },
    { id:'reddit', name:'Reddit', color:'#FF4500', icon:'fa-brands fa-reddit', posts:22 },
    { id:'x', name:'X', color:'#000000', icon:'fa-brands fa-x-twitter', posts:35 },
    { id:'linkedin', name:'LinkedIn', color:'#0A66C2', icon:'fa-brands fa-linkedin', posts:16 },
    { id:'facebook', name:'Facebook', color:'#1877F2', icon:'fa-brands fa-facebook', posts:20 },
    { id:'pinterest', name:'Pinterest', color:'#E60023', icon:'fa-brands fa-pinterest', posts:9 },
    { id:'threads', name:'Threads', color:'#000000', icon:'fa-brands fa-threads', posts:14 },
    { id:'tumblr', name:'Tumblr', color:'#36465D', icon:'fa-brands fa-tumblr', posts:7 },
    { id:'nostr', name:'Nostr', color:'#8B5CF6', icon:'fa-solid fa-bolt', posts:5 },
    { id:'instagram', name:'Instagram', color:'#E1306C', icon:'fa-brands fa-instagram', posts:26 },
    { id:'youtube', name:'YouTube', color:'#FF0000', icon:'fa-brands fa-youtube', posts:11 },
    { id:'tiktok', name:'TikTok', color:'#25F4EE', icon:'fa-brands fa-tiktok', posts:19 },
    { id:'snapchat', name:'Snapchat', color:'#FFFC00', icon:'fa-brands fa-snapchat', posts:4 },
    { id:'whatsapp', name:'WhatsApp', color:'#25D366', icon:'fa-brands fa-whatsapp', posts:10 },
    { id:'slack', name:'Slack', color:'#611F69', icon:'fa-brands fa-slack', posts:15 },
    { id:'medium', name:'Medium', color:'#12100E', icon:'fa-brands fa-medium', posts:6 },
    { id:'wordpress', name:'WordPress', color:'#21759B', icon:'fa-brands fa-wordpress', posts:8 },
    { id:'vk', name:'VKontakte', color:'#0077FF', icon:'fa-brands fa-vk', posts:3 },
    { id:'weibo', name:'Weibo', color:'#E6162D', icon:'fa-brands fa-weibo', posts:7 },
    { id:'nextdoor', name:'Nextdoor', color:'#8BC53F', icon:'fa-solid fa-house', posts:2 },
    { id:'flickr', name:'Flickr', color:'#FF0084', icon:'fa-brands fa-flickr', posts:4 },
    { id:'gbp', name:'Google Business', color:'#4285F4', icon:'fa-brands fa-google', posts:5 },
    { id:'farcaster', name:'Farcaster', color:'#855DCD', icon:'fa-solid fa-bolt', posts:6 }
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
    // Range-aware data generation
    const range = currentRange || 7;
    const points = range === 7 ? 7 : (range === 30 ? 30 : 13);
    const data = []; for (let i = 0; i < points; i++) data.push(Math.floor(4 + Math.random() * 22));
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

    // Compute point coordinates
    const coords = data.map((v, i) => ({
      x: pad + (cw / Math.max(1, data.length - 1)) * i,
      y: pad + ch - (v / max) * ch
    }));

    // Animated draw
    if (canvas._anim) cancelAnimationFrame(canvas._anim);
    const start = performance.now();
    const dur = 700;
    function frame(now) {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const n = Math.max(1, Math.ceil(coords.length * eased));
      ctx.clearRect(0, 0, w, h);
      // redraw grid
      ctx.strokeStyle = textColor + '20'; ctx.lineWidth = 1;
      for (let i = 0; i <= 4; i++) { const y = pad + (ch/4)*i; ctx.beginPath(); ctx.moveTo(pad,y); ctx.lineTo(w-pad,y); ctx.stroke(); }
      // fill
      ctx.beginPath();
      for (let i = 0; i < n; i++) { const c = coords[i]; if (i===0) ctx.moveTo(c.x,c.y); else ctx.lineTo(c.x,c.y); }
      const last = coords[n-1];
      ctx.lineTo(last.x, h-pad); ctx.lineTo(coords[0].x, h-pad); ctx.closePath();
      const grad = ctx.createLinearGradient(0, pad, 0, h-pad);
      grad.addColorStop(0, accent + '40'); grad.addColorStop(1, accent + '00');
      ctx.fillStyle = grad; ctx.fill();
      // stroke
      ctx.beginPath();
      for (let i = 0; i < n; i++) { const c = coords[i]; if (i===0) ctx.moveTo(c.x,c.y); else ctx.lineTo(c.x,c.y); }
      ctx.strokeStyle = accent; ctx.lineWidth = 3; ctx.lineJoin = 'round'; ctx.stroke();
      // points (only when fully drawn)
      if (p >= 1) {
        coords.forEach(c => {
          ctx.beginPath(); ctx.arc(c.x, c.y, 4, 0, Math.PI*2);
          ctx.fillStyle = accent; ctx.fill();
          ctx.strokeStyle = getCardBg(); ctx.lineWidth = 2; ctx.stroke();
        });
        canvas._anim = null;
      } else {
        canvas._anim = requestAnimationFrame(frame);
      }
    }
    canvas._anim = requestAnimationFrame(frame);
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
  let currentRange = 7;
  document.querySelectorAll('.tf-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tf-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentRange = parseInt(btn.dataset.range);
      // re-compute KPI numbers for the selected range
      const total = Math.floor(currentRange * 1.8 + Math.random() * 20);
      const success = Math.floor(total * 0.9);
      animateNumber('kpi-total', total);
      animateNumber('kpi-success', success);
      renderBreakdown();
      renderActivity();
      drawLineChart();
      drawDonutChart();
      if (window.FedPoster) window.FedPoster.toast('Range updated', 'Showing last ' + currentRange + ' days', 'info', 2000);
    });
  });

  // ---- ANIMATED NUMBER COUNTER ----
  function animateNumber(elId, target) {
    const el = document.getElementById(elId);
    if (!el) return;
    const start = parseInt(el.textContent.replace(/[^0-9]/g,'')) || 0;
    const dur = 700; const t0 = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - t0)/dur);
      const eased = 1 - Math.pow(1-p,3);
      el.textContent = Math.round(start + (target-start)*eased).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ---- CSV EXPORT ----
  function exportCSV() {
    const rows = [['Platform','Posts','Share %']];
    const total = PLATFORMS.reduce((s,p) => s+p.posts, 0);
    PLATFORMS.forEach(p => rows.push([p.name, p.posts, ((p.posts/total)*100).toFixed(1) + '%']));
    rows.push([]);
    rows.push(['Date Range', 'Last ' + currentRange + ' days']);
    rows.push(['Total Posts', document.getElementById('kpi-total') ? document.getElementById('kpi-total').textContent : '']);
    rows.push(['Successful', document.getElementById('kpi-success') ? document.getElementById('kpi-success').textContent : '']);
    const csv = rows.map(r => r.map(c => '"' + String(c).replace(/"/g,'""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'fedposter-analytics-' + currentRange + 'd.csv';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (window.FedPoster) window.FedPoster.toast('Exported', 'Analytics CSV downloaded', 'success', 2600);
  }
  const exportBtn = document.getElementById('btn-export-csv');
  if (exportBtn) exportBtn.addEventListener('click', exportCSV);

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
