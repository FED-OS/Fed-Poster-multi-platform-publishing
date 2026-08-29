/* ================================================================
   CALENDAR PAGE JAVASCRIPT
   Monthly grid, scheduled posts in localStorage, add/edit
   ================================================================ */
(function() {
  'use strict';

  const PLATFORM_COLORS = {
    telegram:'#229ED9', bluesky:'#0EA5E9', mastodon:'#6364FF',
    discord:'#5865F2', github:'#444c56', stoat:'#FF6B35', deviantart:'#00E59B'
  };
  const PLATFORM_LIST = ['telegram','bluesky','mastodon','discord','github','stoat','deviantart'];
  const STORE_KEY = 'fedposter_calendar';

  let currentDate = new Date();
  let viewYear = currentDate.getFullYear();
  let viewMonth = currentDate.getMonth();

  function getPosts() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch(e) { return []; } }
  function savePosts(p) { localStorage.setItem(STORE_KEY, JSON.stringify(p)); }

  // Seed with demo posts if empty
  function seedDemo() {
    const posts = getPosts();
    if (posts.length > 0) return;
    const today = new Date();
    const demos = [
      { text: '🚀 New product launch announcement!', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2), time: '09:00', platforms: ['telegram','bluesky','mastodon','discord'], status: 'scheduled' },
      { text: '📊 Weekly analytics recap', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5), time: '14:00', platforms: ['telegram','discord'], status: 'scheduled' },
      { text: '🎨 New artwork drop', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1), time: '18:00', platforms: ['deviantart','stoat'], status: 'scheduled' },
      { text: '💡 Dev tips thread', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7), time: '11:00', platforms: ['github','bluesky'], status: 'draft' },
      { text: '✅ Morning motivation post', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1), time: '08:00', platforms: ['telegram','bluesky','mastodon'], status: 'posted' },
      { text: '🔥 Friday community shoutout', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4), time: '16:00', platforms: ['discord','telegram'], status: 'scheduled' }
    ];
    savePosts(demos.map((d,i) => ({ ...d, id: Date.now() + i, date: d.date.toISOString() })));
  }
  seedDemo();

  function dateKey(d) { return d.getFullYear() + '-' + d.getMonth() + '-' + d.getDate(); }

  function renderCalendar() {
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    document.getElementById('month-label').textContent = monthNames[viewMonth] + ' ' + viewYear;

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();
    const posts = getPosts();
    const today = new Date();
    const todayKey = dateKey(today);

    // Update stats
    let scheduled = 0, posted = 0, draft = 0;
    posts.forEach(p => {
      if (p.status === 'scheduled') scheduled++;
      else if (p.status === 'posted') posted++;
      else if (p.status === 'draft') draft++;
    });
    document.getElementById('stat-scheduled').textContent = scheduled;
    document.getElementById('stat-posted').textContent = posted;
    document.getElementById('stat-draft').textContent = draft;

    const grid = document.getElementById('cal-grid');
    grid.innerHTML = '';

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      grid.appendChild(makeDay(d, true, '', []));
    }
    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const key = viewYear + '-' + viewMonth + '-' + d;
      const isToday = key === todayKey;
      const dayPosts = posts.filter(p => {
        const pd = new Date(p.date);
        return pd.getFullYear() === viewYear && pd.getMonth() === viewMonth && pd.getDate() === d;
      });
      const hasPosts = dayPosts.length > 0;
      const dayEl = makeDay(d, false, isToday ? 'today' : '', dayPosts);
      if (hasPosts) dayEl.classList.add('has-posts');
      dayEl.addEventListener('click', (e) => {
        if (e.target.classList.contains('post-pill')) return;
        openModal(new Date(viewYear, viewMonth, d));
      });
      grid.appendChild(dayEl);
    }
    // Next month filler
    const totalCells = firstDay + daysInMonth;
    const remaining = (7 - (totalCells % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      grid.appendChild(makeDay(d, true, '', []));
    }
  }

  function makeDay(num, otherMonth, extraClass, posts) {
    const div = document.createElement('div');
    div.className = 'cal-day' + (otherMonth ? ' other-month' : '') + (extraClass ? ' ' + extraClass : '');
    let postsHtml = '<div class="day-posts">';
    posts.slice(0, 3).forEach(p => {
      const plat = p.platforms[0] || 'telegram';
      postsHtml += '<div class="post-pill ' + plat + (p.status === 'draft' ? ' draft' : '') + '" title="' + p.text.replace(/"/g,'&quot;') + '">' + (p.time || '') + ' ' + p.text.substring(0,20) + '</div>';
    });
    if (posts.length > 3) postsHtml += '<div style="font-size:10px;color:var(--text-muted);padding:2px 4px;">+' + (posts.length - 3) + ' more</div>';
    postsHtml += '</div>';
    div.innerHTML = '<div class="day-num">' + num + '</div>' + postsHtml;
    return div;
  }

  // Modal
  function openModal(date) {
    const modal = document.getElementById('postModal');
    modal.classList.add('open');
    document.getElementById('cal-post-date').value = date.toISOString().split('T')[0];
    document.getElementById('cal-post-text').value = '';
    document.getElementById('cal-post-status').value = 'scheduled';

    const mp = document.getElementById('modal-platforms');
    mp.innerHTML = '';
    PLATFORM_LIST.forEach(p => {
      const lbl = document.createElement('label');
      lbl.innerHTML = '<input type="checkbox" value="' + p + '" checked> ' + p.charAt(0).toUpperCase() + p.slice(1);
      mp.appendChild(lbl);
    });
  }

  document.getElementById('prev-month').addEventListener('click', () => {
    viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } renderCalendar();
  });
  document.getElementById('next-month').addEventListener('click', () => {
    viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; } renderCalendar();
  });
  document.getElementById('today-btn').addEventListener('click', () => {
    const t = new Date(); viewYear = t.getFullYear(); viewMonth = t.getMonth(); renderCalendar();
  });
  document.getElementById('add-post-btn').addEventListener('click', () => openModal(new Date()));

  document.getElementById('save-post-btn').addEventListener('click', () => {
    const text = document.getElementById('cal-post-text').value.trim();
    const dateStr = document.getElementById('cal-post-date').value;
    const time = document.getElementById('cal-post-time').value;
    const status = document.getElementById('cal-post-status').value;
    const platforms = [];
    document.querySelectorAll('#modal-platforms input:checked').forEach(cb => platforms.push(cb.value));
    if (!text || !dateStr) { showToast('Please add content and a date', true); return; }
    const posts = getPosts();
    posts.push({ id: Date.now(), text, date: new Date(dateStr + 'T' + (time || '09:00')).toISOString(), time, platforms, status });
    savePosts(posts);
    document.getElementById('postModal').classList.remove('open');
    renderCalendar();
    showToast('Post scheduled for ' + new Date(dateStr).toLocaleDateString());
  });

  // Close modal on overlay click
  document.getElementById('postModal').addEventListener('click', (e) => {
    if (e.target.id === 'postModal') e.target.classList.remove('open');
  });

  function showToast(msg, isError) {
    const c = document.getElementById('toastContainer');
    const t = document.createElement('div');
    t.className = 'toast' + (isError ? ' error' : '');
    t.innerHTML = '<i class="fa-solid ' + (isError ? 'fa-circle-xmark' : 'fa-circle-check') + '"></i> ' + msg;
    c.appendChild(t);
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 3000);
  }

  renderCalendar();
})();
