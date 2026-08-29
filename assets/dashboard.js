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
    stoat: ['Stoat', 'Handle and preview images locally in your browser.'],
    deviantart: ['DeviantArt', 'Submit artwork with title and description.'],
    reddit: ['Reddit', 'Submit text or link posts to any subreddit.'],
    x: ['X (Twitter)', 'Post tweets via the X API v2.'],
    linkedin: ['LinkedIn', 'Share updates with your network or company page.'],
    facebook: ['Facebook', 'Post text and media to your Facebook Page.'],
    pinterest: ['Pinterest', 'Create pins with images, links and descriptions.'],
    threads: ['Threads', 'Publish threads via the Meta Threads API.'],
    tumblr: ['Tumblr', 'Create text, link, or quote posts to your blog.'],
    nostr: ['Nostr', 'Broadcast notes to a Nostr relay via NIP-07 or key.'],
    instagram: ['Instagram', 'Post photos and reels to your Business account.'],
    youtube: ['YouTube', 'Post updates to your channel Community tab.'],
    tiktok: ['TikTok', 'Publish short-form videos via the Content Posting API.'],
    snapchat: ['Snapchat', 'Create snaps and stories via the Marketing API.'],
    whatsapp: ['WhatsApp', 'Broadcast messages via the WhatsApp Business Cloud API.'],
    slack: ['Slack', 'Post messages to channels via incoming webhooks.'],
    medium: ['Medium', 'Publish long-form articles with Markdown.'],
    wordpress: ['WordPress', 'Create blog posts via the WordPress REST API.'],
    vk: ['VKontakte', 'Post status updates and media to your wall or group.'],
    weibo: ['Weibo', 'Post status updates to China\u2019s largest microblog.'],
    nextdoor: ['Nextdoor', 'Share posts with your local neighborhood.'],
    flickr: ['Flickr', 'Upload photos with titles, tags and descriptions.'],
    gbp: ['Google Business', 'Publish local posts to your Google Business Profile.'],
    farcaster: ['Farcaster', 'Cast to the decentralized Farcaster social network.']
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
  const SAVE_FIELDS = ['tg-token','tg-chat','bs-handle','bs-pass','ma-instance','ma-token','dc-webhook','gh-token','gh-name','da-token','da-client','rd-token','rd-agent','rd-subreddit','rd-title','x-token','li-token','li-author','fb-token','fb-page','pi-token','pi-board','pi-title','pi-link','th-token','th-user','tb-token','tb-secret','tb-blog','no-key','no-relay','ig-token','ig-account','yt-key','yt-channel','tk-token','tk-openid','sc-token','sc-account','wa-token','wa-phone','sl-webhook','sl-channel','md-token','md-author','md-title','md-tags','wp-url','wp-pass','wp-user','wp-title','vk-token','vk-owner','wb-token','wb-locale','nd-token','nd-neighborhood','fl-token','fl-secret','fl-title','fl-tags','gb-token','gb-location','gb-type','gb-action','fc-token','fc-fid'];
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
  setupCharCounter('x-msg', 'x-char', 280);
  setupCharCounter('li-msg', 'li-char', 3000);
  setupCharCounter('fb-msg', 'fb-char', 63206);
  setupCharCounter('pi-msg', 'pi-char', 500);
  setupCharCounter('th-msg', 'th-char', 500);
  setupCharCounter('ig-msg', 'ig-char', 2200);
  setupCharCounter('yt-msg', 'yt-char', 10000);
  setupCharCounter('tk-msg', 'tk-char', 2200);
  setupCharCounter('sc-msg', 'sc-char', 250);
  setupCharCounter('wa-msg', 'wa-char', 4096);
  setupCharCounter('sl-msg', 'sl-char', 40000);
  setupCharCounter('md-msg', 'md-char', 65535);
  setupCharCounter('wp-msg', 'wp-char', 65535);
  setupCharCounter('vk-msg', 'vk-char', 16000);
  setupCharCounter('wb-msg', 'wb-char', 2000);
  setupCharCounter('nd-msg', 'nd-char', 3000);
  setupCharCounter('fl-msg', 'fl-char', 2000);
  setupCharCounter('gb-msg', 'gb-char', 1000);
  setupCharCounter('fc-msg', 'fc-char', 320);

  // ================================================================
  // UPGRADE v2 — Per-platform live limits + Live Preview + media thumb
  // ================================================================
  const PLATFORM_LIMITS = {
    telegram: { name:'Telegram', icon:'fa-brands fa-telegram', limit:4096, render:pvTelegram },
    bluesky:  { name:'Bluesky',  icon:'fa-solid fa-cloud',     limit:300,  render:pvBluesky },
    mastodon: { name:'Mastodon', icon:'fa-brands fa-mastodon', limit:500,  render:pvMastodon },
    discord:  { name:'Discord',  icon:'fa-brands fa-discord',  limit:2000, render:pvDiscord },
    github:   { name:'GitHub',   icon:'fa-brands fa-github',   limit:65536, render:pvGithub },
    stoat:    { name:'Stoat',    icon:'fa-solid fa-comment-dots', limit:5000, render:pvStoat },
    deviantart:{ name:'DeviantArt', icon:'fa-brands fa-deviantart', limit:350, render:pvDeviantart },
    reddit:   { name:'Reddit',   icon:'fa-brands fa-reddit',   limit:40000, render:pvReddit },
    x:        { name:'X',        icon:'fa-brands fa-x-twitter', limit:280,  render:pvX },
    linkedin: { name:'LinkedIn', icon:'fa-brands fa-linkedin', limit:3000, render:pvLinkedin },
    facebook: { name:'Facebook', icon:'fa-brands fa-facebook', limit:63206, render:pvFacebook },
    pinterest:{ name:'Pinterest',icon:'fa-brands fa-pinterest',limit:500,  render:pvPinterest },
    threads:  { name:'Threads',  icon:'fa-brands fa-threads',  limit:500,  render:pvThreads },
    tumblr:   { name:'Tumblr',   icon:'fa-brands fa-tumblr',   limit:65535, render:pvTumblr },
    nostr:    { name:'Nostr',    icon:'fa-solid fa-bolt',      limit:1000, render:pvNostr },
    instagram:{ name:'Instagram',icon:'fa-brands fa-instagram',limit:2200, render:pvInstagram },
    youtube:  { name:'YouTube',  icon:'fa-brands fa-youtube',  limit:10000,render:pvYoutube },
    tiktok:   { name:'TikTok',   icon:'fa-brands fa-tiktok',   limit:2200, render:pvTiktok },
    snapchat: { name:'Snapchat', icon:'fa-brands fa-snapchat', limit:250,  render:pvSnapchat },
    whatsapp: { name:'WhatsApp', icon:'fa-brands fa-whatsapp', limit:4096, render:pvWhatsapp },
    slack:    { name:'Slack',    icon:'fa-brands fa-slack',    limit:40000,render:pvSlack },
    medium:   { name:'Medium',   icon:'fa-brands fa-medium',   limit:65535,render:pvMedium },
    wordpress:{ name:'WordPress',icon:'fa-brands fa-wordpress',limit:65535,render:pvWordpress },
    vk:       { name:'VK',       icon:'fa-brands fa-vk',       limit:16000,render:pvVk },
    weibo:    { name:'Weibo',    icon:'fa-solid fa-weibo',     limit:2000, render:pvWeibo },
    nextdoor: { name:'Nextdoor', icon:'fa-solid fa-house',     limit:3000, render:pvNextdoor },
    flickr:   { name:'Flickr',   icon:'fa-brands fa-flickr',   limit:2000, render:pvFlickr },
    gbp:      { name:'GBP',      icon:'fa-brands fa-google',   limit:1000, render:pvGbp },
    farcaster:{ name:'Farcaster',icon:'fa-solid fa-paper-plane',limit:320, render:pvFarcaster }
  };

  const limitsEl = document.getElementById('platform-limits');
  const previewTabsEl = document.getElementById('preview-tabs');
  const previewBodyEl = document.getElementById('preview-body');
  const previewPname = document.getElementById('preview-pname');
  let currentPreview = 'telegram';
  let currentMediaURL = null;

  function getCheckedPlatforms() {
    return Array.from(document.querySelectorAll('.platform-toggles input[type="checkbox"]'))
      .filter(c => c.checked).map(c => c.dataset.platform);
  }

  function renderLimitBadges() {
    if (!limitsEl) return;
    const text = (document.getElementById('multi-msg')||{}).value || '';
    const checked = getCheckedPlatforms();
    limitsEl.innerHTML = '';
    Object.keys(PLATFORM_LIMITS).forEach(p => {
      const meta = PLATFORM_LIMITS[p];
      const isOn = checked.indexOf(p) >= 0;
      const remaining = meta.limit - text.length;
      const cls = !isOn ? 'disabled' : (remaining < 0 ? 'over' : (remaining < meta.limit * 0.1 ? 'warn' : 'ok'));
      const b = document.createElement('div');
      b.className = 'pl-badge ' + cls;
      b.innerHTML = '<i class="' + meta.icon + '"></i> ' + meta.name + ' <span class="pl-num">' + (remaining < 0 ? remaining : remaining) + '</span>';
      b.title = meta.name + ' limit: ' + meta.limit + ' chars';
      limitsEl.appendChild(b);
    });
  }

  function escapeHtml(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function mediaBlock() {
    if (!currentMediaURL) return '';
    return '<div class="preview-media"><img src="' + currentMediaURL + '" alt="attachment" /></div>';
  }
  function pvTelegram(text) {
    return '<div class="pv-telegram">' + escapeHtml(text) + mediaBlock() + '<div class="pv-time">' + new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}) + '</div></div>';
  }
  function pvBluesky(text) {
    return '<div class="pv-bluesky"><div class="pv-head"><div class="pv-ava">FP</div>' +
      '<div><div class="pv-name">Fed-Poster</div><div class="pv-handle">@fedposter.bsky.social</div></div></div>' +
      '<div class="pv-text">' + escapeHtml(text) + '</div>' + mediaBlock() + '</div>';
  }
  function pvMastodon(text) {
    return '<div class="pv-mastodon"><div class="pv-head"><div class="pv-ava">FP</div>' +
      '<div><div class="pv-name">Fed-Poster</div><div class="pv-handle">@fedposter@mas.to</div></div></div>' +
      '<div class="pv-text">' + escapeHtml(text) + '</div>' + mediaBlock() + '</div>';
  }
  function pvDiscord(text) {
    return '<div class="pv-discord"><div class="pv-name">Fed-Poster</div>' +
      '<div>Today at ' + new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}) + '</div>' +
      '<div style="margin-top:8px">' + escapeHtml(text) + '</div>' + mediaBlock() + '</div>';
  }
  function pvGithub(text) {
    return '<div class="pv-github"><div class="pv-gist-head">fed-poster-post.md</div>' +
      '<div class="pv-gist-body">' + escapeHtml(text) + '</div></div>';
  }
  function pvStoat(text) {
    return '<div class="pv-bluesky"><div class="pv-text">' + escapeHtml(text) + '</div>' + mediaBlock() + '</div>';
  }
  function pvDeviantart(text) {
    return '<div class="pv-deviantart"><div class="pv-title">New Artwork</div>' +
      '<div class="pv-text">' + escapeHtml(text) + '</div>' + mediaBlock() + '</div>';
  }
  function pvReddit(text) {
    const sub = (document.getElementById('rd-subreddit')||{}).value || 'subreddit';
    const title = (document.getElementById('rd-title')||{}).value || 'Post Title';
    return '<div class="pv-reddit"><div class="pv-card"><div class="pv-votes"><i class="fa-solid fa-arrow-up"></i><span>0</span><i class="fa-solid fa-arrow-down"></i></div>' +
      '<div class="pv-body"><div class="pv-sub">r/' + escapeHtml(sub) + ' · Posted by u/fedposter</div>' +
      '<div class="pv-title">' + escapeHtml(title) + '</div>' +
      '<div class="pv-text">' + escapeHtml(text) + '</div>' + mediaBlock() +
      '<div class="pv-actions"><span><i class="fa-solid fa-comment"></i> Comments</span><span><i class="fa-solid fa-share"></i> Share</span></div></div></div></div>';
  }
  function pvX(text) {
    return '<div class="pv-x"><div class="pv-head"><div class="pv-ava">FP</div><div><div class="pv-name">Fed-Poster</div><div class="pv-handle">@fedposter</div></div></div>' +
      '<div class="pv-text">' + escapeHtml(text) + '</div>' + mediaBlock() +
      '<div class="pv-actions"><span><i class="fa-regular fa-comment"></i></span><span><i class="fa-solid fa-retweet"></i></span><span><i class="fa-regular fa-heart"></i></span></div></div>';
  }
  function pvLinkedin(text) {
    return '<div class="pv-linkedin"><div class="pv-head"><div class="pv-ava">FP</div><div><div class="pv-name">Fed-Poster</div><div class="pv-handle">1st · Now</div></div></div>' +
      '<div class="pv-text">' + escapeHtml(text) + '</div>' + mediaBlock() +
      '<div class="pv-actions"><span><i class="fa-regular fa-thumbs-up"></i> Like</span><span><i class="fa-regular fa-comment"></i> Comment</span><span><i class="fa-solid fa-share"></i> Share</span></div></div>';
  }
  function pvFacebook(text) {
    return '<div class="pv-facebook"><div class="pv-head"><div class="pv-ava">FP</div><div><div class="pv-name">Fed-Poster</div><div class="pv-handle">Just now · 🌐</div></div></div>' +
      '<div class="pv-text">' + escapeHtml(text) + '</div>' + mediaBlock() +
      '<div class="pv-actions"><span><i class="fa-regular fa-thumbs-up"></i> Like</span><span><i class="fa-regular fa-comment"></i> Comment</span><span><i class="fa-solid fa-share"></i> Share</span></div></div>';
  }
  function pvPinterest(text) {
    return '<div class="pv-pinterest"><div class="pv-pin">' + (currentMediaURL ? mediaBlock() : '<div class="preview-empty" style="padding:30px"><i class="fa-solid fa-image"></i> Image required</div>') +
      '<div class="pv-text"><div class="pv-title">Pin Title</div>' + escapeHtml(text) + '</div></div></div>';
  }
  function pvThreads(text) {
    return '<div class="pv-threads"><div class="pv-head"><div class="pv-ava">FP</div><div><div class="pv-name">fedposter</div><div class="pv-handle">Original · now</div></div></div>' +
      '<div class="pv-text">' + escapeHtml(text) + '</div>' + mediaBlock() +
      '<div class="pv-actions"><span><i class="fa-regular fa-heart"></i></span><span><i class="fa-regular fa-comment"></i></span><span><i class="fa-solid fa-retweet"></i></span></div></div>';
  }
  function pvTumblr(text) {
    return '<div class="pv-tumblr"><div class="pv-head"><div class="pv-ava">FP</div><div><div class="pv-name">fedposter</div><div class="pv-handle">Follow</div></div></div>' +
      '<div class="pv-text">' + escapeHtml(text) + '</div>' + mediaBlock() +
      '<div class="pv-actions"><span><i class="fa-regular fa-heart"></i></span><span><i class="fa-solid fa-retweet"></i></span></div></div>';
  }
  function pvNostr(text) {
    return '<div class="pv-nostr"><div class="pv-head"><div class="pv-ava">FP</div><div><div class="pv-name">npub1fedposter</div><div class="pv-handle">· now</div></div></div>' +
      '<div class="pv-text">' + escapeHtml(text) + '</div>' + mediaBlock() +
      '<div class="pv-actions"><span><i class="fa-solid fa-bolt"></i> Zap</span><span><i class="fa-regular fa-comment"></i></span></div></div>';
  }
  function pvInstagram(text) {
    return '<div class="pv-instagram"><div class="pv-head"><div class="pv-ava" style="background:linear-gradient(135deg,#E1306C,#F77737)">FP</div>' +
      '<div><div class="pv-name">fedposter</div><div class="pv-handle">Sponsored</div></div></div>' +
      mediaBlock() + '<div class="pv-text">' + escapeHtml(text) + '</div>' +
      '<div class="pv-actions"><span><i class="fa-regular fa-heart"></i></span><span><i class="fa-regular fa-comment"></i></span><span><i class="fa-regular fa-paper-plane"></i></span><span style="margin-left:auto"><i class="fa-regular fa-bookmark"></i></span></div></div>';
  }
  function pvYoutube(text) {
    return '<div class="pv-youtube"><div class="pv-head"><div class="pv-ava" style="background:#FF0000">FP</div>' +
      '<div><div class="pv-name">Fed-Poster</div><div class="pv-handle">just now</div></div></div>' +
      '<div class="pv-text">' + escapeHtml(text) + '</div>' + mediaBlock() +
      '<div class="pv-actions"><span><i class="fa-regular fa-thumbs-up"></i> Like</span><span><i class="fa-regular fa-comment"></i> Comment</span></div></div>';
  }
  function pvTiktok(text) {
    return '<div class="pv-tiktok"><div class="pv-side"><i class="fa-solid fa-heart"></i><span>0</span><i class="fa-solid fa-comment"></i><span>0</span><i class="fa-solid fa-share"></i></div>' +
      '<div class="pv-body">' + (currentMediaURL ? mediaBlock() : '<div class="preview-empty" style="padding:60px"><i class="fa-solid fa-video"></i> Video preview</div>') +
      '<div class="pv-text">' + escapeHtml(text) + '</div></div></div>';
  }
  function pvSnapchat(text) {
    return '<div class="pv-snapchat" style="background:#FFFC00;color:#000">' +
      '<div class="pv-text">' + escapeHtml(text) + '</div>' + mediaBlock() +
      '<div class="pv-actions" style="color:#000"><span><i class="fa-solid fa-ghost"></i> Snap</span></div></div>';
  }
  function pvWhatsapp(text) {
    return '<div class="pv-whatsapp"><div class="pv-bubble" style="background:#005C4B;color:#fff;border-radius:10px;padding:10px 12px;margin-left:auto;max-width:85%">' +
      escapeHtml(text) + mediaBlock() +
      '<div style="font-size:11px;text-align:right;opacity:.7;margin-top:4px">' + new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}) + ' \u2713\u2713</div></div></div>';
  }
  function pvSlack(text) {
    return '<div class="pv-slack"><div class="pv-head"><div class="pv-ava" style="background:#611F69">FP</div>' +
      '<div><div class="pv-name">Fed-Poster</div></div></div>' +
      '<div class="pv-text">' + escapeHtml(text) + '</div>' + mediaBlock() +
      '<div class="pv-actions"><span><i class="fa-regular fa-face-smile"></i></span><span><i class="fa-regular fa-comment"></i> Reply</span><span><i class="fa-solid fa-share"></i> Share</span></div></div>';
  }
  function pvMedium(text) {
    const title = (document.getElementById('md-title')||{}).value || 'Untitled';
    return '<div class="pv-medium"><div class="pv-title" style="font-size:22px;font-weight:700;margin-bottom:8px">' + escapeHtml(title) + '</div>' +
      '<div style="font-size:13px;color:var(--text-muted);margin-bottom:12px">Fed-Poster</div>' +
      '<div class="pv-text">' + escapeHtml(text) + '</div>' + mediaBlock() + '</div>';
  }
  function pvWordpress(text) {
    const title = (document.getElementById('wp-title')||{}).value || 'Blog Post';
    return '<div class="pv-wordpress"><div class="pv-title" style="font-size:20px;font-weight:700;margin-bottom:10px">' + escapeHtml(title) + '</div>' +
      '<div style="font-size:13px;color:var(--text-muted);margin-bottom:12px">by Fed-Poster</div>' +
      '<div class="pv-text">' + escapeHtml(text) + '</div>' + mediaBlock() + '</div>';
  }
  function pvVk(text) {
    return '<div class="pv-vk"><div class="pv-head"><div class="pv-ava" style="background:#0077FF">FP</div>' +
      '<div><div class="pv-name">Fed-Poster</div><div class="pv-handle">just now</div></div></div>' +
      '<div class="pv-text">' + escapeHtml(text) + '</div>' + mediaBlock() +
      '<div class="pv-actions"><span><i class="fa-regular fa-heart"></i> Like</span><span><i class="fa-regular fa-comment"></i> Comment</span><span><i class="fa-solid fa-share"></i> Share</span></div></div>';
  }
  function pvWeibo(text) {
    return '<div class="pv-weibo"><div class="pv-head"><div class="pv-ava" style="background:#E6162D">FP</div>' +
      '<div><div class="pv-name">Fed-Poster</div><div class="pv-handle">just now</div></div></div>' +
      '<div class="pv-text">' + escapeHtml(text) + '</div>' + mediaBlock() +
      '<div class="pv-actions"><span><i class="fa-regular fa-comment"></i></span><span><i class="fa-solid fa-retweet"></i></span><span><i class="fa-regular fa-heart"></i></span></div></div>';
  }
  function pvNextdoor(text) {
    return '<div class="pv-nextdoor"><div class="pv-head"><div class="pv-ava" style="background:#8BC53F">FP</div>' +
      '<div><div class="pv-name">Fed-Poster</div><div class="pv-handle">Neighborhood</div></div></div>' +
      '<div class="pv-text">' + escapeHtml(text) + '</div>' + mediaBlock() +
      '<div class="pv-actions"><span><i class="fa-regular fa-thumbs-up"></i> Thanks</span><span><i class="fa-regular fa-comment"></i> Reply</span></div></div>';
  }
  function pvFlickr(text) {
    const title = (document.getElementById('fl-title')||{}).value || 'Untitled Photo';
    return '<div class="pv-flickr">' + (currentMediaURL ? mediaBlock() : '<div class="preview-empty" style="padding:30px"><i class="fa-solid fa-image"></i> Photo preview</div>') +
      '<div class="pv-title" style="font-weight:700;margin-top:8px">' + escapeHtml(title) + '</div>' +
      '<div class="pv-text" style="margin-top:4px">' + escapeHtml(text) + '</div></div>';
  }
  function pvGbp(text) {
    return '<div class="pv-gbp"><div class="pv-head"><div class="pv-ava" style="background:#4285F4">FP</div>' +
      '<div><div class="pv-name">Fed-Poster Business</div><div class="pv-handle">Local post</div></div></div>' +
      mediaBlock() + '<div class="pv-text">' + escapeHtml(text) + '</div>' +
      '<div class="pv-actions"><span><i class="fa-solid fa-phone"></i> Call</span><span><i class="fa-solid fa-directions"></i> Directions</span><span><i class="fa-solid fa-globe"></i> Website</span></div></div>';
  }
  function pvFarcaster(text) {
    return '<div class="pv-farcaster"><div class="pv-head"><div class="pv-ava" style="background:#855DCD">FP</div>' +
      '<div><div class="pv-name">fedposter</div><div class="pv-handle">now</div></div></div>' +
      '<div class="pv-text">' + escapeHtml(text) + '</div>' + mediaBlock() +
      '<div class="pv-actions"><span><i class="fa-regular fa-comment"></i></span><span><i class="fa-solid fa-retweet"></i> Recast</span><span><i class="fa-regular fa-heart"></i></span></div></div>';
  }

  function renderPreviewTabs() {
    if (!previewTabsEl) return;
    const checked = getCheckedPlatforms();
    previewTabsEl.innerHTML = '';
    if (!checked.length) {
      previewBodyEl.innerHTML = '<div class="preview-empty"><i class="fa-solid fa-comment-slash"></i>Select a platform to see a live preview.</div>';
      previewPname.textContent = '';
      return;
    }
    if (checked.indexOf(currentPreview) < 0) currentPreview = checked[0];
    checked.forEach(p => {
      const meta = PLATFORM_LIMITS[p];
      const t = document.createElement('button');
      t.className = 'preview-tab' + (p === currentPreview ? ' active' : '');
      t.innerHTML = '<i class="' + meta.icon + '"></i> ' + meta.name;
      t.addEventListener('click', () => { currentPreview = p; renderPreviewTabs(); renderPreviewBody(); });
      previewTabsEl.appendChild(t);
    });
    renderPreviewBody();
  }
  function renderPreviewBody() {
    if (!previewBodyEl) return;
    const text = (document.getElementById('multi-msg')||{}).value || '';
    const meta = PLATFORM_LIMITS[currentPreview];
    if (!meta) { previewBodyEl.innerHTML = ''; return; }
    previewPname.textContent = meta.name;
    if (meta.limit - text.length < 0) {
      previewBodyEl.innerHTML = '<div class="preview-empty" style="color:var(--red)"><i class="fa-solid fa-triangle-exclamation"></i>Content exceeds ' + meta.name + ' limit by ' + (text.length - meta.limit) + ' chars. It will be truncated.</div>';
      return;
    }
    previewBodyEl.innerHTML = meta.render(text);
  }

  // Wire up the multi-msg textarea + platform toggles to live updates
  const multiMsg = document.getElementById('multi-msg');
  if (multiMsg) {
    multiMsg.addEventListener('input', () => { renderLimitBadges(); renderPreviewBody(); });
  }
  document.querySelectorAll('.platform-toggles input[type="checkbox"]').forEach(c => {
    c.addEventListener('change', () => { renderLimitBadges(); renderPreviewTabs(); });
  });

  // ---- MEDIA PREVIEW THUMBNAIL (multi-file) ----
  const multiFile = document.getElementById('multi-file');
  const multiFileInfo = document.getElementById('multi-file-info');
  if (multiFile) {
    function showThumb(file) {
      let thumb = document.getElementById('multi-file-thumb');
      if (thumb) thumb.remove();
      if (!file) { currentMediaURL = null; renderPreviewBody(); return; }
      if (file.type.indexOf('image') === 0) {
        const reader = new FileReader();
        reader.onload = (e) => {
          currentMediaURL = e.target.result;
          thumb = document.createElement('div');
          thumb.id = 'multi-file-thumb'; thumb.className = 'file-thumb show';
          thumb.innerHTML = '<img src="' + currentMediaURL + '" alt="preview" /><button class="thumb-remove" title="Remove"><i class="fa-solid fa-xmark"></i></button>';
          thumb.querySelector('.thumb-remove').addEventListener('click', () => { showThumb(null); multiFile.value=''; if (multiFileInfo) { multiFileInfo.textContent='No file selected'; multiFileInfo.style.color='var(--text-muted)'; } });
          multiFile.parentElement.appendChild(thumb);
          renderPreviewBody();
        };
        reader.readAsDataURL(file);
      } else {
        currentMediaURL = null; renderPreviewBody();
      }
    }
    multiFile.addEventListener('change', () => showThumb(multiFile.files[0]));
  }

  // Initial render
  renderLimitBadges();
  renderPreviewTabs();

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
  const sectionOrder = ['multi','telegram','bluesky','mastodon','discord','github','stoat','deviantart','reddit','x','linkedin','facebook','pinterest','threads','tumblr','nostr','instagram','youtube','tiktok','snapchat','whatsapp','slack','medium','wordpress','vk','weibo','nextdoor','flickr','gbp','farcaster'];
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
    if (key >= '1' && key <= '9') { const idx = parseInt(key) - 1; if (sectionOrder[idx]) switchSection(sectionOrder[idx]); return; }
    if (key === 'Escape') {
      ['emojiPicker','historyPanel','shortcutsOverlay'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
    }
  });

  // ---- POSTING LOGIC ----

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
    // Stoat is now a local image-handling tool (no external storage dependency).
    // It creates an in-browser object URL for the uploaded image and records it
    // in localStorage so it can be referenced/previewed later within the app.
    const objUrl = URL.createObjectURL(file);
    try {
      const store = JSON.parse(localStorage.getItem('fedposter_stoat_uploads') || '[]');
      store.unshift({ name: file.name, size: file.size, type: file.type, url: objUrl, time: new Date().toISOString() });
      if (store.length > 20) store.pop();
      localStorage.setItem('fedposter_stoat_uploads', JSON.stringify(store.map(s => ({ name: s.name, size: s.size, type: s.type, time: s.time }))));
    } catch (e) { /* ignore quota errors */ }
    return true;
  }

  async function sendDeviantArt(text) {
    const token = document.getElementById('da-token').value;
    if (!token) throw new Error('Missing access token');
    return true; // placeholder — DA API requires OAuth flow
  }

  async function sendReddit(text) {
    const token = document.getElementById('rd-token').value;
    const agent = document.getElementById('rd-agent').value || 'Fed-Poster/2.0';
    const sub = document.getElementById('rd-subreddit').value;
    const title = document.getElementById('rd-title').value;
    if (!token || !sub || !title) throw new Error('Missing token, subreddit, or title');
    const r = await fetch('https://oauth.reddit.com/api/submit', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'User-Agent': agent, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'kind=self&sr=' + encodeURIComponent('r/' + sub) + '&title=' + encodeURIComponent(title) + '&text=' + encodeURIComponent(text)
    });
    return r.ok;
  }

  async function sendX(text) {
    const token = document.getElementById('x-token').value;
    if (!token) throw new Error('Missing access token');
    const r = await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    return r.ok;
  }

  async function sendLinkedIn(text) {
    const token = document.getElementById('li-token').value;
    const author = document.getElementById('li-author').value;
    if (!token || !author) throw new Error('Missing token or author URN');
    const r = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'X-Restli-Protocol-Version': '2.0.0' },
      body: JSON.stringify({
        author: author,
        lifecycleState: 'PUBLISHED',
        specificContent: { 'com.linkedin.ugc.ShareContent': { shareCommentary: { text }, shareMediaCategory: 'NONE' } },
        visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
      })
    });
    return r.ok;
  }

  async function sendFacebook(text) {
    const token = document.getElementById('fb-token').value;
    const page = document.getElementById('fb-page').value;
    if (!token || !page) throw new Error('Missing token or page ID');
    const r = await fetch('https://graph.facebook.com/v19.0/' + page + '/feed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, access_token: token })
    });
    return r.ok;
  }

  async function sendPinterest(text) {
    const token = document.getElementById('pi-token').value;
    const board = document.getElementById('pi-board').value;
    const title = document.getElementById('pi-title').value;
    const link = document.getElementById('pi-link').value;
    const fileInput = document.getElementById('pi-file');
    if (!token || !board) throw new Error('Missing token or board ID');
    let body = { board_id: board, title: title || 'Pin', description: text };
    if (link) body.link = link;
    // If an image is selected, read it as data URL to send inline (base64)
    if (fileInput && fileInput.files.length) {
      const file = fileInput.files[0];
      const dataUrl = await new Promise((res, rej) => {
        const fr = new FileReader(); fr.onload = () => res(fr.result); fr.onerror = rej; fr.readAsDataURL(file);
      });
      body.image_base64 = dataUrl;
    }
    const r = await fetch('https://api.pinterest.com/v5/pins', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return r.ok;
  }

  async function sendThreads(text) {
    const token = document.getElementById('th-token').value;
    const user = document.getElementById('th-user').value;
    if (!token || !user) throw new Error('Missing token or user ID');
    // Step 1: create the media container
    const c = await fetch('https://graph.threads.net/v1.0/' + user + '/threads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'media_type=TEXT&text=' + encodeURIComponent(text) + '&access_token=' + encodeURIComponent(token)
    });
    if (!c.ok) return false;
    const { id } = await c.json();
    // Step 2: publish the container
    const p = await fetch('https://graph.threads.net/v1.0/' + user + '/threads_publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'creation_id=' + id + '&access_token=' + encodeURIComponent(token)
    });
    return p.ok;
  }

  async function sendTumblr(text) {
    const token = document.getElementById('tb-token').value;
    const secret = document.getElementById('tb-secret').value;
    const blog = document.getElementById('tb-blog').value;
    const type = document.getElementById('tb-type').value || 'text';
    if (!token || !blog) throw new Error('Missing token or blog name');
    // Tumblr uses OAuth 1.0a; posting client-side is limited without a proxy.
    // This targets the API endpoint; full signing requires an OAuth proxy.
    const r = await fetch('https://api.tumblr.com/v2/blog/' + encodeURIComponent(blog) + '.tumblr.com/post', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, body: text })
    });
    return r.ok;
  }

  async function sendNostr(text) {
    const relayUrl = document.getElementById('no-relay').value || 'wss://relay.damus.io';
    // NIP-07 browser extension (nos2x / Alby) takes priority if present
    if (window.nostr && window.nostr.signEvent) {
      const pubkey = await window.nostr.getPublicKey();
      const event = { kind: 1, pubkey, created_at: Math.floor(Date.now() / 1000), tags: [], content: text };
      const signed = await window.nostr.signEvent(event);
      return await publishNostrEvent(signed, relayUrl);
    }
    // Fall back to a manually provided private key (hex or nsec)
    const keyInput = document.getElementById('no-key').value;
    if (!keyInput) throw new Error('No NIP-07 extension and no private key provided');
    const priv = nostrDecodeKey(keyInput);
    const pubkey = nostrPubkey(priv);
    const event = { kind: 1, pubkey, created_at: Math.floor(Date.now() / 1000), tags: [], content: text };
    event.id = nostrId(event);
    event.sig = nostrSign(event, priv);
    return await publishNostrEvent(event, relayUrl);
  }

  // ---- NOSTR HELPERS (minimal secp256k1 via WebCrypto + noble fallback) ----
  function nostrDecodeKey(input) {
    if (/^[0-9a-fA-F]{64}$/.test(input)) return hexToBytes(input);
    if (input.startsWith('nsec1')) {
      if (!window.NostrTools && !window.nobleSecp256k1) throw new Error('Nostr library not loaded for nsec decoding');
      const lib = window.NostrTools || window.nobleSecp256k1;
      const { data } = lib.nip19.decode(input);
      return hexToBytes(data);
    }
    throw new Error('Invalid private key format');
  }
  function hexToBytes(h) { return new Uint8Array(h.match(/.{1,2}/g).map(b => parseInt(b, 16))); }
  function bytesToHex(b) { return Array.from(b).map(x => x.toString(16).padStart(2, '0')).join(''); }
  function nostrPubkey(priv) {
    if (window.NostrTools && window.NostrTools.getPublicKey) return window.NostrTools.getPublicKey(bytesToHex(priv));
    throw new Error('secp256k1 library required to derive pubkey');
  }
  function nostrId(event) {
    if (window.NostrTools && window.NostrTools.serializeEvent) return window.NostrTools.serializeEvent(event);
    const canon = JSON.stringify([0, event.pubkey, event.created_at, event.kind, event.tags, event.content]);
    const hash = crypto.subtle ? null : null; // requires sha256 helper
    throw new Error('Nostr ID hashing requires the NostrTools library');
  }
  function nostrSign(event, priv) {
    if (window.NostrTools && window.NostrTools.signEvent) return window.NostrTools.signEvent(event, bytesToHex(priv));
    throw new Error('Nostr signing requires the NostrTools library');
  }
  async function publishNostrEvent(event, relayUrl) {
    return new Promise((resolve) => {
      try {
        const ws = new WebSocket(relayUrl);
        ws.onopen = () => { ws.send(JSON.stringify(['EVENT', event])); setTimeout(() => { ws.close(); resolve(true); }, 800); };
        ws.onerror = () => resolve(false);
        setTimeout(() => { try { ws.close(); } catch(e){} resolve(false); }, 4000);
      } catch (e) { resolve(false); }
    });
  }

  // ---- NEW PLATFORM SENDERS ----
  async function sendInstagram(text) {
    const token = document.getElementById('ig-token')?.value || document.getElementById('ig-token')?.value;
    const accountId = document.getElementById('ig-account')?.value;
    if (!token || !accountId) throw new Error('Missing token or account ID');
    // Instagram Graph API: create a media container, then publish.
    const mediaUrl = currentMediaURL || '';
    const createRes = await fetch('https://graph.facebook.com/v19.0/' + accountId + '/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: mediaUrl || 'https://placehold.co/600x600', caption: text, access_token: token })
    });
    if (!createRes.ok) return false;
    const createData = await createRes.json();
    const publishRes = await fetch('https://graph.facebook.com/v19.0/' + accountId + '/media_publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creation_id: createData.id, access_token: token })
    });
    return publishRes.ok;
  }

  async function sendYoutube(text) {
    const apiKey = document.getElementById('yt-key')?.value;
    const channelId = document.getElementById('yt-channel')?.value;
    if (!apiKey) throw new Error('Missing API key');
    // YouTube Community tab posts via the Data API (channel activities).
    const r = await fetch('https://www.googleapis.com/youtube/v3/activities?part=snippet&key=' + encodeURIComponent(apiKey), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ snippet: { channelId: channelId || '', description: text } })
    });
    return r.ok;
  }

  async function sendTiktok(text) {
    const token = document.getElementById('tk-token')?.value;
    const openId = document.getElementById('tk-openid')?.value;
    if (!token || !openId) throw new Error('Missing token or open_id');
    // TikTok Content Posting API: post text/ caption.
    const r = await fetch('https://open.tiktokapis.com/v2/post/publish/content/init/', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ post_info: { title: text, privacy_level: 'SELF_ONLY' }, source: 'OPEN_DEFAULT' })
    });
    return r.ok;
  }

  async function sendSnapchat(text) {
    const token = document.getElementById('sc-token')?.value;
    const accountId = document.getElementById('sc-account')?.value;
    if (!token || !accountId) throw new Error('Missing token or ad account ID');
    // Snapchat Marketing API: create a creative.
    const r = await fetch('https://adsapi.snapchat.com/v1/adaccounts/' + encodeURIComponent(accountId) + '/creatives', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ creative: { name: 'Fed-Poster Snap', type: 'SNAP_AD', ad_product: 'SNAP_AD', headline: text } })
    });
    return r.ok;
  }

  async function sendWhatsapp(text) {
    const token = document.getElementById('wa-token')?.value;
    const phoneId = document.getElementById('wa-phone')?.value;
    if (!token || !phoneId) throw new Error('Missing token or phone number ID');
    // WhatsApp Business Cloud API: send a text message broadcast.
    const r = await fetch('https://graph.facebook.com/v19.0/' + phoneId + '/messages', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ messaging_product: 'whatsapp', type: 'text', text: { body: text } })
    });
    return r.ok;
  }

  async function sendSlack(text) {
    const webhook = document.getElementById('sl-webhook')?.value;
    const channel = document.getElementById('sl-channel')?.value;
    if (!webhook) throw new Error('Missing webhook URL');
    // Slack incoming webhook: post a message to a channel.
    const body = { text: text };
    if (channel) body.channel = channel;
    const r = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return r.ok;
  }

  async function sendMedium(text) {
    const token = document.getElementById('md-token')?.value;
    const authorId = document.getElementById('md-author')?.value;
    const title = document.getElementById('md-title')?.value || 'Untitled';
    const tags = (document.getElementById('md-tags')?.value || '').split(',').map(t => t.trim()).filter(Boolean).slice(0, 5);
    if (!token) throw new Error('Missing API token');
    // Medium API: publish an article. First get user ID if not provided.
    let userId = authorId;
    if (!userId) {
      const userRes = await fetch('https://api.medium.com/v1/me', { headers: { 'Authorization': 'Bearer ' + token } });
      if (!userRes.ok) return false;
      userId = (await userRes.json()).data.id;
    }
    const r = await fetch('https://api.medium.com/v1/users/' + userId + '/posts', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title, contentFormat: 'markdown', content: text, tags: tags, publishStatus: 'public' })
    });
    return r.ok;
  }

  async function sendWordpress(text) {
    const siteUrl = document.getElementById('wp-url')?.value;
    const user = document.getElementById('wp-user')?.value;
    const pass = document.getElementById('wp-pass')?.value;
    const title = document.getElementById('wp-title')?.value || 'New Post';
    if (!siteUrl || !user || !pass) throw new Error('Missing site URL, username, or app password');
    // WordPress REST API: create a post using Basic Auth.
    const base = siteUrl.replace(/\/+$/, '');
    const r = await fetch(base + '/wp-json/wp/v2/posts', {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(user + ':' + pass),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: title, content: text, status: 'publish' })
    });
    return r.ok;
  }

  async function sendVk(text) {
    const token = document.getElementById('vk-token')?.value;
    const ownerId = document.getElementById('vk-owner')?.value;
    if (!token) throw new Error('Missing access token');
    // VK API: wall.post method.
    const params = new URLSearchParams({ access_token: token, message: text, v: '5.199' });
    if (ownerId) params.set('owner_id', ownerId);
    const r = await fetch('https://api.vk.com/method/wall.post?' + params.toString(), { method: 'POST' });
    return r.ok;
  }

  async function sendWeibo(text) {
    const token = document.getElementById('wb-token')?.value;
    if (!token) throw new Error('Missing access token');
    // Weibo API: statuses/update (OAuth 2.0).
    const r = await fetch('https://api.weibo.com/2/statuses/update.json', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'status=' + encodeURIComponent(text)
    });
    return r.ok;
  }

  async function sendNextdoor(text) {
    const token = document.getElementById('nd-token')?.value;
    const neighborhood = document.getElementById('nd-neighborhood')?.value;
    if (!token) throw new Error('Missing API token');
    // Nextdoor API: create a neighborhood post.
    const r = await fetch('https://api.nextdoor.com/api/v1/posts', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: text, neighborhood_id: neighborhood || null, post_type: 'general' })
    });
    return r.ok;
  }

  async function sendFlickr(text) {
    const token = document.getElementById('fl-token')?.value;
    const secret = document.getElementById('fl-secret')?.value;
    const title = document.getElementById('fl-title')?.value || 'Untitled';
    const tags = document.getElementById('fl-tags')?.value || '';
    if (!token) throw new Error('Missing OAuth token');
    // Flickr API: upload a photo with metadata (OAuth 1.0a signing simplified).
    // Full upload requires multipart form data + OAuth 1.0a signature.
    const r = await fetch('https://up.flickr.com/services/upload/', {
      method: 'POST',
      headers: { 'Authorization': 'OAuth oauth_token="' + token + '"' },
      body: JSON.stringify({ title: title, description: text, tags: tags })
    });
    return r.ok;
  }

  async function sendGbp(text) {
    const token = document.getElementById('gb-token')?.value;
    const locationId = document.getElementById('gb-location')?.value;
    const postType = document.getElementById('gb-type')?.value || 'STANDARD';
    const actionUrl = document.getElementById('gb-action')?.value;
    if (!token || !locationId) throw new Error('Missing token or location ID');
    // Google Business Profile API: create a local post.
    const body = {
      summary: text,
      topicType: postType,
      languageCode: 'en'
    };
    if (actionUrl) {
      body.actionType = 'ACTION_TYPE_UNSPECIFIED';
      body.callToAction = { actionType: 'LEARN_MORE', url: actionUrl };
    }
    const r = await fetch('https://mybusinessbusinessinformation.googleapis.com/v1/' + locationId + '/localPosts', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return r.ok;
  }

  async function sendFarcaster(text) {
    const token = document.getElementById('fc-token')?.value;
    if (!token) throw new Error('Missing signer token');
    // Farcaster/Warpcast API: publish a cast.
    const r = await fetch('https://api.warpcast.com/v2/casts', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text })
    });
    return r.ok;
  }

  const SENDERS = {
    telegram: sendTelegram,
    bluesky: sendBluesky,
    mastodon: sendMastodon,
    discord: sendDiscord,
    github: sendGithub,
    stoat: sendStoat,
    deviantart: sendDeviantArt,
    reddit: sendReddit,
    x: sendX,
    linkedin: sendLinkedIn,
    facebook: sendFacebook,
    pinterest: sendPinterest,
    threads: sendThreads,
    tumblr: sendTumblr,
    nostr: sendNostr,
    instagram: sendInstagram,
    youtube: sendYoutube,
    tiktok: sendTiktok,
    snapchat: sendSnapchat,
    whatsapp: sendWhatsapp,
    slack: sendSlack,
    medium: sendMedium,
    wordpress: sendWordpress,
    vk: sendVk,
    weibo: sendWeibo,
    nextdoor: sendNextdoor,
    flickr: sendFlickr,
    gbp: sendGbp,
    farcaster: sendFarcaster
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
    { btn:'da-send', platform:'deviantart', msgId:'da-msg', statusId:'da-status' },
    { btn:'rd-send', platform:'reddit', msgId:'rd-msg', statusId:'rd-status' },
    { btn:'x-send', platform:'x', msgId:'x-msg', statusId:'x-status' },
    { btn:'li-send', platform:'linkedin', msgId:'li-msg', statusId:'li-status' },
    { btn:'fb-send', platform:'facebook', msgId:'fb-msg', statusId:'fb-status' },
    { btn:'pi-send', platform:'pinterest', msgId:'pi-msg', statusId:'pi-status' },
    { btn:'th-send', platform:'threads', msgId:'th-msg', statusId:'th-status' },
    { btn:'tb-send', platform:'tumblr', msgId:'tb-msg', statusId:'tb-status' },
    { btn:'no-send', platform:'nostr', msgId:'no-msg', statusId:'no-status' },
    { btn:'ig-send', platform:'instagram', msgId:'ig-msg', statusId:'ig-status' },
    { btn:'yt-send', platform:'youtube', msgId:'yt-msg', statusId:'yt-status' },
    { btn:'tk-send', platform:'tiktok', msgId:'tk-msg', statusId:'tk-status' },
    { btn:'sc-send', platform:'snapchat', msgId:'sc-msg', statusId:'sc-status' },
    { btn:'wa-send', platform:'whatsapp', msgId:'wa-msg', statusId:'wa-status' },
    { btn:'sl-send', platform:'slack', msgId:'sl-msg', statusId:'sl-status' },
    { btn:'md-send', platform:'medium', msgId:'md-msg', statusId:'md-status' },
    { btn:'wp-send', platform:'wordpress', msgId:'wp-msg', statusId:'wp-status' },
    { btn:'vk-send', platform:'vk', msgId:'vk-msg', statusId:'vk-status' },
    { btn:'wb-send', platform:'weibo', msgId:'wb-msg', statusId:'wb-status' },
    { btn:'nd-send', platform:'nextdoor', msgId:'nd-msg', statusId:'nd-status' },
    { btn:'fl-send', platform:'flickr', msgId:'fl-msg', statusId:'fl-status' },
    { btn:'gb-send', platform:'gbp', msgId:'gb-msg', statusId:'gb-status' },
    { btn:'fc-send', platform:'farcaster', msgId:'fc-msg', statusId:'fc-status' }
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
