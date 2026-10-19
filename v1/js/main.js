/* Complexions Beauty Salon: menu, cookie consent, map loading, header on scroll */
(function () {
  'use strict';

  var CONSENT_KEY = 'complexions-cookie-consent'; // 'all' | 'essential'

  function readConsent() {
    try { return window.localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }
  function saveConsent(value) {
    try { window.localStorage.setItem(CONSENT_KEY, value); } catch (e) { /* storage blocked: banner shows again next visit */ }
  }

  /* ---------- Off-canvas menu ---------- */
  var menu = document.getElementById('site-menu');
  var openBtn = document.querySelector('[data-menu-open]');
  var lastFocus = null;

  function openMenu() {
    if (!menu) return;
    lastFocus = document.activeElement;
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    var first = menu.querySelector('.menu__close');
    if (first) first.focus();
  }
  function closeMenu() {
    if (!menu || !menu.classList.contains('is-open')) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    if (lastFocus) lastFocus.focus();
  }

  if (openBtn) openBtn.addEventListener('click', openMenu);
  document.querySelectorAll('[data-menu-close]').forEach(function (el) {
    el.addEventListener('click', closeMenu);
  });
  if (menu) {
    // Close after choosing a link on the same page (e.g. #about)
    menu.querySelectorAll('.menu__nav a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    // Keep keyboard focus inside the open menu
    menu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var items = menu.querySelectorAll('.menu__panel a, .menu__panel button');
      if (!items.length) return;
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- Google Map: only loads once cookies are accepted ---------- */
  function loadMaps() {
    document.querySelectorAll('[data-map]').forEach(function (box) {
      if (box.querySelector('iframe')) return;
      var iframe = document.createElement('iframe');
      iframe.src = box.getAttribute('data-map');
      iframe.title = 'Map showing Complexions Beauty Salon, Batsford';
      iframe.loading = 'lazy';
      iframe.referrerPolicy = 'no-referrer-when-downgrade';
      box.appendChild(iframe);
      var notice = box.querySelector('.map__consent');
      if (notice) notice.hidden = true;
    });
  }
  document.querySelectorAll('[data-map-load]').forEach(function (btn) {
    btn.addEventListener('click', loadMaps);
  });

  /* ---------- Cookie banner ---------- */
  var banner = document.getElementById('cookie-banner');

  function applyConsent(value) {
    if (value === 'all') {
      loadMaps();
      // Add analytics here once chosen, e.g. load the Google Analytics tag.
    }
  }
  function showBanner() { if (banner) banner.hidden = false; }
  function hideBanner() { if (banner) banner.hidden = true; }

  var current = readConsent();
  if (current) { applyConsent(current); } else { showBanner(); }

  document.querySelectorAll('[data-cookie]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.getAttribute('data-cookie');
      saveConsent(value);
      applyConsent(value);
      hideBanner();
    });
  });
  document.querySelectorAll('[data-cookie-settings]').forEach(function (btn) {
    btn.addEventListener('click', showBanner);
  });

  /* ---------- Overlay header turns solid after the hero (Version 2 home) ---------- */
  var overlay = document.querySelector('.site-header--overlay');
  if (overlay) {
    var onScroll = function () {
      overlay.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Current year in the footer ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
