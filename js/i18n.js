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
    var flag = document.getElementById('langFlag'), code = document.getElementById('langCode');
    var opt = document.querySelector('.lang-opt[data-lang="' + lang + '"]');
    if (flag && opt) { var f = opt.querySelector('.flag'); if (f) flag.innerHTML = f.innerHTML; }
    if (code) code.textContent = (lang === 'th') ? 'TH' : 'EN';
    document.querySelectorAll('.lang-opt').forEach(function (o) { o.classList.toggle('active', o.getAttribute('data-lang') === lang); });
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
  var sel = document.getElementById('langSelect');
  var cur = document.getElementById('langCurrent');
  if (sel && cur) {
    cur.addEventListener('click', function (e) { e.stopPropagation(); var open = sel.classList.toggle('open'); cur.setAttribute('aria-expanded', open ? 'true' : 'false'); });
    sel.querySelectorAll('.lang-opt').forEach(function (o) {
      o.addEventListener('click', function () { setLang(o.getAttribute('data-lang')); sel.classList.remove('open'); cur.setAttribute('aria-expanded', 'false'); });
    });
    document.addEventListener('click', function (e) { if (!sel.contains(e.target)) { sel.classList.remove('open'); cur.setAttribute('aria-expanded', 'false'); } });
  }

  window.APIS_setLang = setLang;
})();
