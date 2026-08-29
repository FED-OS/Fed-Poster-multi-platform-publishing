/* ================================================================
   INBOX PAGE JAVASCRIPT
   Unified feed: mock aggregated timeline, filter, search, actions
   ================================================================ */
(function() {
  'use strict';

  const PLATFORM_META = {
    telegram:   { name:'Telegram',   color:'#229ED9', icon:'fa-brands fa-telegram',     badge:'TG' },
    bluesky:    { name:'Bluesky',    color:'#0EA5E9', icon:'fa-solid fa-cloud',          badge:'BS' },
    mastodon:   { name:'Mastodon',   color:'#6364FF', icon:'fa-brands fa-mastodon',      badge:'MA' },
    discord:    { name:'Discord',    color:'#5865F2', icon:'fa-brands fa-discord',       badge:'DC' },
    github:     { name:'GitHub',     color:'#444c56', icon:'fa-brands fa-github',        badge:'GH' },
    deviantart: { name:'DeviantArt', color:'#00E59B', icon:'fa-brands fa-deviantart',    badge:'DA' }
  };

  // ---- Mock feed dataset ----
  const FEED = [
    { id:1, platform:'bluesky', type:'mention', author:'Aria Nakamura', handle:'aria.codes', avatar:'AN', time:'2m', unread:true, pinned:false,
      text:'Just tried @fedposter and it’s wild — queued a whole week of posts in like 5 minutes across 4 platforms. The privacy-first angle is exactly what the fediverse needed. 🔥', likes:42, reposts:8, replies:11, media:null },
    { id:2, platform:'mastodon', type:'reply', author:'Theo Lindqvist', handle:'theo@gts.social', avatar:'TL', time:'14m', unread:true, pinned:false,
      text:'This is exactly the kind of local-first tool I’ve been waiting for. No telemetry, credentials stay on-device — chef’s kiss. Bookmarked.', likes:27, reposts:3, replies:2, media:null },
    { id:3, platform:'telegram', type:'reaction', author:'Channel · Dev Updates', handle:'', avatar:'📢', time:'31m', unread:true, pinned:true,
      text:'New release v2.1 is live! Added multi-image upload and drag-and-drop scheduling. Drop a 🚀 if you want a walkthrough.', likes:88, reposts:0, replies:6, media:null },
    { id:4, platform:'discord', type:'mention', author:'mariposa', handle:'mariposa#0042', avatar:'MP', time:'1h', unread:false, pinned:false,
      text:'@FedPoster can it cross-post to Discord webhooks AND keep formatting? Trying to automate our changelog channel.', likes:5, reposts:0, replies:3, media:null },
    { id:5, platform:'deviantart', type:'reactions', author:'Kenji Visuals', handle:'kenjivis', avatar:'KV', time:'3h', unread:false, pinned:false,
      text:'Posted my new series via Fed-Poster — Stoat hosting worked flawlessly and it pushed to DA in seconds. Loving the workflow.', likes:156, reposts:0, replies:9,
      media:'https://images.unsplash.com/photo-1579546929517-090a4d7a5b30?w=600&q=70' },
    { id:6, platform:'github', type:'follows', author:'octo-fan', handle:'octo-fan', avatar:'OF', time:'5h', unread:false, pinned:false,
      text:'started watching your repository Fed-Poster ⭐ — 2,431 stars now!', likes:0, reposts:0, replies:0, media:null },
    { id:7, platform:'bluesky', type:'replies', author:'Devon Park', handle:'devonp.bsky', avatar:'DP', time:'8h', unread:false, pinned:false,
      text:'The keyboard shortcuts are a vibe. Cmd+K to jump anywhere, g+d for dashboard — feels like a real power-user tool.', likes:19, reposts:4, replies:1, media:null },
    { id:8, platform:'mastodon', type:'mention', author:'Sven @ Hometown', handle:'sven@hometown.example', avatar:'SV', time:'12h', unread:false, pinned:false,
      text:'Genuinely impressed that this runs with zero backend. The localStorage approach for credentials is bold and I respect it.', likes:34, reposts:7, replies:4, media:null },
    { id:9, platform:'telegram', type:'reactions', author:'Channel · Dev Updates', handle:'', avatar:'📢', time:'1d', unread:false, pinned:false,
      text:'Poll results: 94% of you want a dark-mode-first design. Say less. 🌙', likes:61, reposts:0, replies:12, media:null },
    { id:10, platform:'discord', type:'reply', author:'quinn', handle:'quinn#7711', avatar:'QN', time:'1d', unread:false, pinned:false,
      text:'Reporting back: the calendar view saved my content team an entire afternoon. The drag-to-reschedule is chef’s kiss 👌', likes:12, reposts:0, replies:2, media:null },
    { id:11, platform:'deviantart', type:'follows', author:'Lumen Arts', handle:'lumen.arts', avatar:'LA', time:'2d', unread:false, pinned:false,
      text:'is now watching you! Your gallery reached 4,200 watchers 🎉', likes:0, reposts:0, replies:0, media:null },
    { id:12, platform:'github', type:'mention', author:'dependabot', handle:'dependabot[bot]', avatar:'🤖', time:'2d', unread:false, pinned:false,
      text:'Bumped @octokit/rest from 9.0.0 to 9.2.1 in /site. 1 vulnerability resolved.', likes:3, reposts:0, replies:0, media:null }
  ];

  // ---- State ----
  let state = { filter:'all', platform:null, tab:'all', search:'', feed: FEED.map(f => ({...f, liked:false})) };
  let storeKey = 'fedposter_inbox_state';
  try {
    const saved = JSON.parse(localStorage.getItem(storeKey));
    if (saved && saved.readIds) state.readIds = new Set(saved.readIds);
    else state.readIds = new Set();
    if (saved && saved.pinnedIds) state.pinnedIds = new Set(saved.pinnedIds);
    else state.pinnedIds = new Set([3]); // pin the release note by default
    if (saved && saved.likedIds) state.likedIds = new Set(saved.likedIds);
    else state.likedIds = new Set();
  } catch(e) { state.readIds = new Set(); state.pinnedIds = new Set([3]); state.likedIds = new Set(); }

  function persist() {
    localStorage.setItem(storeKey, JSON.stringify({
      readIds: [...state.readIds], pinnedIds: [...state.pinnedIds], likedIds: [...state.likedIds]
    }));
  }

  // ---- Rendering ----
  const listEl = document.getElementById('feed-list');

  function showSkeletons() {
    listEl.innerHTML = '';
    for (let i = 0; i < 4; i++) {
      const sk = document.createElement('div');
      sk.className = 'feed-item';
      sk.innerHTML = '<div class="fp-skeleton" style="width:44px;height:44px;border-radius:12px;"></div>' +
        '<div class="fp-skeleton skeleton-feed" style="padding:0;"><div class="sk-row short"></div><div class="sk-block"></div><div class="sk-row short"></div></div>' +
        '<div></div>';
      listEl.appendChild(sk);
    }
  }

  function getFiltered() {
    return state.feed.filter(f => {
      if (state.platform && f.platform !== state.platform) return false;
      if (state.search) {
        const q = state.search.toLowerCase();
        if (f.text.toLowerCase().indexOf(q) < 0 && f.author.toLowerCase().indexOf(q) < 0 && f.handle.toLowerCase().indexOf(q) < 0) return false;
      }
      if (state.filter === 'unread' && state.readIds.has(f.id)) return false;
      if (state.filter === 'mentions' && f.type !== 'mention') return false;
      if (state.filter === 'pinned' && !state.pinnedIds.has(f.id)) return false;
      if (state.tab !== 'all' && f.type !== state.tab && !(state.tab === 'reactions' && f.type === 'reaction')) return false;
      return true;
    }).sort((a,b) => {
      // pinned first, then by id desc (recency proxy)
      const ap = state.pinnedIds.has(a.id) ? 1 : 0, bp = state.pinnedIds.has(b.id) ? 1 : 0;
      if (ap !== bp) return bp - ap;
      return b.id - a.id;
    });
  }

  function relativeTime(t) {
    if (t.endsWith('m') || t.endsWith('h') || t.endsWith('d')) return t + ' ago';
    return t;
  }

  function render() {
    const items = getFiltered();
    if (!items.length) {
      listEl.innerHTML = '<div class="inbox-empty"><i class="fa-solid fa-inbox"></i><h3>Nothing here yet</h3><div>Try a different filter or platform.</div></div>';
      updateCounts();
      return;
    }
    listEl.innerHTML = '';
    items.forEach(f => {
      const pm = PLATFORM_META[f.platform];
      const unread = !state.readIds.has(f.id);
      const pinned = state.pinnedIds.has(f.id);
      const liked = state.likedIds.has(f.id);
      const likeCount = f.likes + (liked ? 1 : 0);
      const el = document.createElement('div');
      el.className = 'feed-item' + (unread ? ' unread' : '');
      el.style.borderLeftColor = unread ? 'var(--accent)' : 'transparent';
      el.innerHTML =
        '<div class="feed-avatar" style="background:' + pm.color + '"><i class="' + pm.icon + '"></i></div>' +
        '<div class="feed-body">' +
          '<div class="feed-meta">' +
            '<span class="feed-author"></span>' +
            '<span class="feed-handle"></span>' +
            '<span class="feed-platform" style="background:' + pm.color + '"></span>' +
            '<span class="feed-time"></span>' +
          '</div>' +
          '<div class="feed-text"></div>' +
          (f.media ? '<div class="feed-media"><img src="' + f.media + '" alt="media" loading="lazy" /></div>' : '') +
          '<div class="feed-actions">' +
            '<button class="feed-action' + (liked ? ' liked' : '') + '" data-act="like"><i class="fa-solid fa-heart"></i> <span class="lk"></span></button>' +
            '<button class="feed-action" data-act="reply"><i class="fa-solid fa-comment"></i> <span>' + f.replies + '</span></button>' +
            '<button class="feed-action" data-act="repost"><i class="fa-solid fa-retweet"></i> <span>' + f.reposts + '</span></button>' +
            '<button class="feed-action" data-act="open"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open</button>' +
          '</div>' +
        '</div>' +
        '<div class="feed-side">' +
          '<div class="feed-unread-dot' + (unread ? '' : ' read') + '"></div>' +
          '<i class="fa-solid fa-thumbtack feed-pin' + (pinned ? ' pinned' : '') + '" data-act="pin" title="Pin"></i>' +
        '</div>';
      el.querySelector('.feed-author').textContent = f.author;
      el.querySelector('.feed-handle').textContent = f.handle ? '@' + f.handle : '';
      el.querySelector('.feed-platform').textContent = pm.badge;
      el.querySelector('.feed-time').textContent = relativeTime(f.time);
      el.querySelector('.feed-text').textContent = f.text;
      el.querySelector('.lk').textContent = likeCount;

      // mark read on click
      el.addEventListener('click', (e) => {
        if (e.target.closest('[data-act]')) return;
        if (!state.readIds.has(f.id)) { state.readIds.add(f.id); persist(); render(); }
      });
      // action buttons
      el.querySelectorAll('[data-act]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const act = btn.dataset.act;
          if (act === 'like') {
            if (state.likedIds.has(f.id)) state.likedIds.delete(f.id);
            else { state.likedIds.add(f.id); window.FedPoster && window.FedPoster.toast('Liked', 'You liked ' + f.author + '’s post', 'success', 2200); }
            persist(); render();
          } else if (act === 'pin') {
            if (state.pinnedIds.has(f.id)) state.pinnedIds.delete(f.id);
            else { state.pinnedIds.add(f.id); window.FedPoster && window.FedPoster.toast('Pinned', 'Pinned to top of inbox', 'info', 2200); }
            persist(); render();
          } else if (act === 'reply') {
            window.FedPoster && window.FedPoster.toast('Reply', 'Reply composer coming soon', 'info', 2400);
          } else if (act === 'repost') {
            window.FedPoster && window.FedPoster.toast('Reposted', 'Cross-posted to your feed', 'success', 2400);
          } else if (act === 'open') {
            window.FedPoster && window.FedPoster.toast('Opening', 'Viewing on ' + pm.name, 'info', 2000);
          }
        });
      });
      listEl.appendChild(el);
    });
    updateCounts();
  }

  function updateCounts() {
    const c = (pred) => state.feed.filter(pred).length;
    document.getElementById('cnt-all').textContent = state.feed.length;
    document.getElementById('cnt-unread').textContent = c(f => !state.readIds.has(f.id));
    document.getElementById('cnt-mentions').textContent = c(f => f.type === 'mention');
    document.getElementById('cnt-pinned').textContent = state.pinnedIds.size;
    document.getElementById('tab-mentions').textContent = c(f => f.type === 'mention');
    Object.keys(PLATFORM_META).forEach(p => {
      const el = document.getElementById('cnt-' + p);
      if (el) el.textContent = c(f => f.platform === p);
    });
  }

  // ---- Wire up controls ----
  document.querySelectorAll('.inbox-filter-item').forEach(item => {
    item.addEventListener('click', () => {
      if (item.dataset.platform) {
        document.querySelectorAll('.inbox-filter-item[data-platform]').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        document.querySelectorAll('.inbox-filter-item[data-filter]').forEach(i => i.classList.remove('active'));
        document.querySelector('.inbox-filter-item[data-filter="all"]').classList.add('active');
        state.platform = item.dataset.platform; state.filter = 'all';
      } else {
        document.querySelectorAll('.inbox-filter-item[data-filter]').forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        document.querySelectorAll('.inbox-filter-item[data-platform]').forEach(i => i.classList.remove('active'));
        state.filter = item.dataset.filter; state.platform = null;
      }
      render();
    });
  });

  document.querySelectorAll('.inbox-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.inbox-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.tab = tab.dataset.tab;
      render();
    });
  });

  const searchInput = document.getElementById('inbox-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => { state.search = searchInput.value; render(); });
  }

  const markAll = document.getElementById('mark-all-read');
  if (markAll) {
    markAll.addEventListener('click', () => {
      state.feed.forEach(f => state.readIds.add(f.id));
      persist(); render();
      window.FedPoster && window.FedPoster.toast('All caught up', 'Marked everything as read', 'success', 2400);
    });
  }

  // ---- Init with skeleton, then render ----
  showSkeletons();
  setTimeout(() => { render(); }, 600);

  // Simulate a live new item after a while
  setTimeout(() => {
    const live = { id: 99, platform:'bluesky', type:'mention', author:'New Follower', handle:'fresh.bsky', avatar:'NF', time:'just now', unread:true, pinned:false,
      text:'Just discovered Fed-Poster via the cyberpunk theme screenshot — that neon magenta is gorgeous. Installing now! ✨', likes:3, reposts:0, replies:0, media:null };
    state.feed.unshift(live);
    render();
    window.FedPoster && window.FedPoster.toast('New mention', 'fresh.bsky mentioned you on Bluesky', 'info', 4000);
  }, 9000);
})();
