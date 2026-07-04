/* ============================================================
   APIS — Motor i18n. Aplica APIS_I18N[lang] a todo elemento con
   data-i18n / data-i18n-html / data-i18n-ph / data-i18n-list.
   Guarda el idioma en localStorage y actualiza el toggle.
   ============================================================ */
(function () {
  'use strict';
  var DICT = window.APIS_I18N || { en: {}, th: {} };
  var KEY = 'apis_lang';

  function t(lang, key) {
    var d = DICT[lang] || {};
    if (key in d) return d[key];
    if (key in (DICT.en || {})) return DICT.en[key]; // fallback a inglés
    return null;
  }

  function apply(lang) {
    // Texto simple
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = t(lang, el.getAttribute('data-i18n'));
      if (v != null) el.textContent = v;
    });
    // HTML (permite <br>, <b>, etc.)
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = t(lang, el.getAttribute('data-i18n-html'));
      if (v != null) el.innerHTML = v;
    });
    // Placeholder
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var v = t(lang, el.getAttribute('data-i18n-ph'));
      if (v != null) el.setAttribute('placeholder', v);
    });
    // Listas: "item1|item2|item3" -> <li>…</li>
    document.querySelectorAll('[data-i18n-list]').forEach(function (el) {
      var v = t(lang, el.getAttribute('data-i18n-list'));
      if (v != null) el.innerHTML = v.split('|').map(function (i) { return '<li>' + i + '</li>'; }).join('');
    });
    // <title> de la página
    var titleEl = document.querySelector('title[data-i18n]');
    if (titleEl) { var tv = t(lang, titleEl.getAttribute('data-i18n')); if (tv) document.title = tv; }

    // Estado global
    document.documentElement.setAttribute('lang', lang);
    document.body.classList.toggle('th', lang === 'th');
    var toggle = document.getElementById('langToggle');
    if (toggle) toggle.textContent = (lang === 'th') ? 'EN' : 'ไทย';
  }

  function getLang() {
    try { return localStorage.getItem(KEY) || 'en'; } catch (e) { return 'en'; }
  }
  function setLang(lang) {
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    apply(lang);
  }

  // Init
  apply(getLang());
  var toggle = document.getElementById('langToggle');
  if (toggle) toggle.addEventListener('click', function () {
    setLang(getLang() === 'th' ? 'en' : 'th');
  });

  window.APIS_setLang = setLang;
})();
