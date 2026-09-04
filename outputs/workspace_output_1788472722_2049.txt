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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for other scripts
  window.FedPoster = { applyTheme, THEMES, THEME_LABELS, buildThemePicker };
})();
