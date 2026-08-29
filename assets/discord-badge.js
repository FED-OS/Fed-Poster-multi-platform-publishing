/* ================================================================
   FED-POSTER — DISCORD ONLINE COUNT BADGE
   --------------------------------------------------------------
   Injects a live "X online" Discord badge into the navbar of
   every page. The badge is a normal inline-flex pill that flows
   inside .nav-right next to the theme picker.

   Server widget endpoint:
     https://discord.com/api/guilds/<ID>/widget.json
   The widget must be enabled in the server's settings for the
   presence_count field to be returned; otherwise we show "?".
   ================================================================ */
(function () {
  'use strict';

  const SERVER_ID = '1400235929154879490';
  const REFRESH_MS = 60000;

  /**
   * Build the badge DOM node. Mirrors the user-supplied markup but
   * uses the project's design tokens via the .discord-badge class
   * (styled in fedposter.css) so it adapts to every theme.
   */
  function buildBadge() {
    const badge = document.createElement('div');
    badge.id = 'discord-count';
    badge.className = 'discord-badge';
    badge.setAttribute('role', 'status');
    badge.setAttribute('aria-live', 'polite');
    badge.setAttribute('aria-label', 'Discord online members');
    badge.innerHTML =
      '<span class="discord-badge-dot" aria-hidden="true"></span>' +
      '<span id="online-number" class="discord-badge-num">…</span>' +
      '<span class="discord-badge-label">online</span>';
    return badge;
  }

  async function getOnlineCount(numEl, badge) {
    try {
      const response = await fetch(
        'https://discord.com/api/guilds/' + SERVER_ID + '/widget.json'
      );
      if (!response.ok) throw new Error('widget unavailable (' + response.status + ')');
      const data = await response.json();
      const count = data.presence_count || 0;
      numEl.textContent = count.toLocaleString();
      badge.classList.remove('is-error');
      badge.classList.add('is-live');
    } catch (error) {
      numEl.textContent = '?';
      badge.classList.add('is-error');
      badge.classList.remove('is-live');
    }
  }

  function initDiscordBadge() {
    // Already injected? (guard against double init)
    if (document.getElementById('discord-count')) return;

    // Prefer the navbar's right cluster; fall back to body.
    const target = document.querySelector('.nav-right') || document.body;
    const badge = buildBadge();

    // Insert as the first child of .nav-right (left of theme picker)
    if (target.classList && target.classList.contains('nav-right')) {
      target.insertBefore(badge, target.firstChild);
    } else {
      target.appendChild(badge);
    }

    const numEl = document.getElementById('online-number');
    getOnlineCount(numEl, badge);
    setInterval(function () { getOnlineCount(numEl, badge); }, REFRESH_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDiscordBadge);
  } else {
    initDiscordBadge();
  }

  // Expose for manual re-init if needed
  window.FedPosterDiscordBadge = { init: initDiscordBadge };
})();
