/* ================================================================
   FED-POSTER — KO-FI SUPPORT WIDGET
   Loads the floating Ko-fi chat overlay and provides a function
   to programmatically open it when pricing/upgrade buttons clicked
   ================================================================ */
(function() {
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
    } catch(e) {
      console.warn('Ko-fi widget init error:', e);
    }
  }

  /**
   * Programmatically open the Ko-fi popup by simulating a click
   * on the donate button inside the widget iframe.
   */
  function openKofiWidget() {
    // Find the desktop iframe container by class
    const desktopIframe = document.querySelector('iframe.floatingchat-container');
    const mobiIframe = document.querySelector('iframe.floatingchat-container-mobi');

    function clickButton(iframe) {
      if (!iframe) return false;
      try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        if (!doc) return false;
        // The donate button id ends with "-donate-button"
        const btn = doc.querySelector('[id$="-donate-button"]');
        if (btn) {
          btn.click();
          return true;
        }
      } catch(e) {
        // cross-origin or not ready
      }
      return false;
    }

    // Try desktop first, then mobile
    if (!clickButton(desktopIframe)) {
      clickButton(mobiIframe);
    }
  }

  // Wire up all elements with [data-kofi] attribute to open the widget
  function bindKofiTriggers() {
    document.querySelectorAll('[data-kofi]').forEach(el => {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        openKofiWidget();
      });
    });
  }

  // Expose for manual calls
  window.FedPosterKofi = { open: openKofiWidget, init: initKofi };

  // Init on DOM ready
  function start() {
    initKofi();
    bindKofiTriggers();
    // Re-bind triggers after a delay (in case dynamic content loads)
    setTimeout(bindKofiTriggers, 1500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
