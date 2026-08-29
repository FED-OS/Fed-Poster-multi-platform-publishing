/* ================================================================
   FED-POSTER — KO-FI SUPPORT WIDGET
   Loads the floating Ko-fi chat overlay and provides a function
   to programmatically open it when pricing/upgrade buttons clicked.
   --------------------------------------------------------------
   Behavior added per request:
   * Clicking the navbar "Pricing" link opens the Ko-fi floating
     support widget instead of navigating to pricing.html.
   * Upgrade / "Choose Pro" / "Learn More" style buttons also open
     the widget.
   * The floating "Support me" button is always present on every
     page so the widget can be opened manually as well.
   ================================================================ */
(function () {
  'use strict';

  // Ko-fi handle
  const KOFI_HANDLE = 'fedpromptly';

  // Track whether the widget has been drawn
  let widgetReady = false;

  function initKofi() {
    if (typeof window.kofiWidgetOverlay === 'undefined') {
      // Script not loaded yet — retry shortly
      setTimeout(initKofi, 500);
      return;
    }
    if (widgetReady) return;
    try {
      window.kofiWidgetOverlay.draw(KOFI_HANDLE, {
        'type': 'floating-chat',
        'floating-chat.donateButton.text': 'Support me',
        'floating-chat.donateButton.background-color': '#794bc4',
        'floating-chat.donateButton.text-color': '#fff'
      });
      widgetReady = true;
    } catch (e) {
      console.warn('Ko-fi widget init error:', e);
    }
  }

  /**
   * Attempt to find and click the open button inside the Ko-fi
   * floating-chat widget. The widget renders one or two iframes
   * (desktop + mobile). Returns true if a click was dispatched.
   */
  function clickOpenButton(iframe) {
    if (!iframe) return false;
    try {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      if (!doc) return false;
      // The donate / open button id ends with "-donate-button"
      const btn =
        doc.querySelector('[id$="-donate-button"]') ||
        doc.querySelector('.donate-button') ||
        doc.querySelector('a[href*="ko-fi.com"]') ||
        doc.querySelector('button, a');
      if (btn) {
        btn.click();
        return true;
      }
    } catch (e) {
      // cross-origin or not ready — fall through
    }
    return false;
  }

  /**
   * Programmatically open the Ko-fi popup by simulating a click
   * on the donate button inside the widget iframe.
   * Retries a few times in case the widget is still rendering.
   */
  function openKofiWidget() {
    // Make sure the widget has been drawn first
    if (!widgetReady) initKofi();

    const iframes = document.querySelectorAll(
      'iframe.floatingchat-container, iframe.floatingchat-container-mobi, iframe[src*="ko-fi.com"]'
    );

    let opened = false;
    iframes.forEach(function (iframe) {
      if (!opened) opened = clickOpenButton(iframe);
    });

    // The widget can take a moment to render its iframe after draw().
    // Retry a few times with a short delay.
    let attempts = 0;
    const maxAttempts = 8;
    function retry() {
      if (opened || attempts >= maxAttempts) return;
      attempts++;
      const freshIframes = document.querySelectorAll(
        'iframe.floatingchat-container, iframe.floatingchat-container-mobi, iframe[src*="ko-fi.com"]'
      );
      freshIframes.forEach(function (iframe) {
        if (!opened) opened = clickOpenButton(iframe);
      });
      if (!opened) setTimeout(retry, 250);
    }
    if (!opened) setTimeout(retry, 250);

    return opened;
  }

  /**
   * Wire up all elements with [data-kofi] attribute to open the widget.
   */
  function bindKofiTriggers() {
    document.querySelectorAll('[data-kofi]').forEach(function (el) {
      if (el.__kofiBound) return;
      el.__kofiBound = true;
      el.addEventListener('click', function (e) {
        e.preventDefault();
        openKofiWidget();
      });
    });
  }

  /**
   * Intercept clicks on the navbar "Pricing" link (and upgrade-style
   * buttons) so that they open the Ko-fi support widget instead of
   * navigating to pricing.html.
   *
   * We target:
   *   - .nav-links a[href="pricing.html"]  (desktop + mobile nav)
   *   - a.upgrade-card[href="pricing.html"]
   *   - a.btn[href="pricing.html"] that are upgrade CTAs (Choose Pro, etc.)
   *
   * The actual pricing.html page is still reachable via the footer
   * and via middle-click / ctrl-click (we only intercept plain left
   * clicks) so power users keep full access.
   */
  function bindPricingTriggers() {
    const selector =
      '.nav-links a[href="pricing.html"], ' +
      'a.upgrade-card[href="pricing.html"], ' +
      'a.suggestion-card[href="pricing.html"], ' +
      'a.btn[href="pricing.html"]';

    document.querySelectorAll(selector).forEach(function (el) {
      if (el.__kofiPricingBound) return;
      el.__kofiPricingBound = true;

      // Visual affordance: show a pointer + hint that it opens support
      if (!el.hasAttribute('data-kofi')) el.setAttribute('data-kofi', 'pricing');

      el.addEventListener('click', function (e) {
        // Allow new-tab / background open to still go to the page
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        openKofiWidget();

        // Helpful toast so the user knows what just happened
        if (window.FedPosterToast) {
          window.FedPosterToast('Opening the support widget — upgrade & pricing details inside', 'info');
        }
      });
    });
  }

  // Expose for manual calls
  window.FedPosterKofi = { open: openKofiWidget, init: initKofi };

  // Init on DOM ready
  function start() {
    initKofi();
    bindKofiTriggers();
    bindPricingTriggers();
    // Re-bind triggers after a delay (in case dynamic content loads)
    setTimeout(function () {
      bindKofiTriggers();
      bindPricingTriggers();
    }, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
