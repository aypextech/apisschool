/* ============================================================
   APIS — Layout compartido: inyecta header (nav + dropdown +
   toggle de idioma), footer y capa de FX en cada página.
   Se ejecuta al final del <body>, con el DOM ya disponible.
   ============================================================ */
(function () {
  'use strict';
  var LOGO = 'assets/logo-crest.png';

  // Página actual (para marcar el link activo)
  var file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (file === '') file = 'index.html';
  var academicsPages = ['academics.html', 'learning-support.html', 'activities.html', 'admissions.html'];

  var header =
    '<div class="wrap nav">' +
      '<a href="index.html" class="brand">' +
        '<span class="brand-seal"><img src="' + LOGO + '" alt="APIS crest"></span>' +
        '<span class="brand-txt"><b data-i18n="brand.name">American Prime</b><i data-i18n="brand.sub">International School</i></span>' +
      '</a>' +
      '<nav class="menu" id="menu">' +
        '<a href="about.html" data-page="about.html" data-i18n="nav.about">About Us</a>' +
        '<div class="has-sub" id="acadWrap">' +
          '<a href="academics.html" class="sub-toggle" id="acadToggle" data-i18n="nav.academics">Academics</a>' +
          '<div class="submenu">' +
            '<a href="academics.html" data-i18n="nav.academics">Academics</a>' +
            '<a href="learning-support.html" data-i18n="nav.learning">Learning Support</a>' +
            '<a href="activities.html" data-i18n="nav.activities">Activities</a>' +
            '<a href="admissions.html" data-i18n="nav.admissions">Admissions</a>' +
          '</div>' +
        '</div>' +
        '<a href="faculty.html" data-page="faculty.html" data-i18n="nav.faculty">Faculty &amp; Staff</a>' +
        '<a href="gallery.html" data-page="gallery.html" data-i18n="nav.gallery">Gallery</a>' +
        '<a href="calendar.html" data-page="calendar.html" data-i18n="nav.calendar">School Calendar</a>' +
        '<a href="contact.html" data-page="contact.html" data-i18n="nav.contact">Contact Us</a>' +
        '<button class="lang-toggle" id="langToggle" aria-label="Language">ไทย</button>' +
        '<a href="https://admission.apis-kk.com" target="_blank" rel="noopener" class="btn gold sm" data-i18n="btn.tour">Schedule a Tour</a>' +
      '</nav>' +
      '<button class="hamburger" id="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>' +
    '</div>';

  var svgPhone = '<svg viewBox="0 0 24 24"><path d="M6 3h3l1.5 5-2 1.5a12 12 0 0 0 6 6l1.5-2 5 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z"/></svg>';
  var svgMail = '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>';
  var svgChat = '<svg viewBox="0 0 24 24"><path d="M21 11.5c0 3.6-4 6.5-9 6.5-1 0-2-.1-2.9-.4L4 19l1.2-3.2A6.3 6.3 0 0 1 3 11.5C3 7.9 7 5 12 5s9 2.9 9 6.5Z"/></svg>';
  var svgFb = '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M13.5 21v-7.5m0 0V9.4c0-1 .6-1.9 1.8-1.9H16m-4.5 4.6h3.1"/></svg>';
  var svgPin = '<svg viewBox="0 0 24 24"><path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>';

  var footer =
    '<div class="wrap foot-grid">' +
      '<div class="foot-brand">' +
        '<span class="brand-seal lg"><img src="' + LOGO + '" alt="APIS crest"></span>' +
        '<p><b data-i18n="brand.name">American Prime</b> <span data-i18n="brand.sub">International School</span><br><span data-i18n="foot.tagline">Empowering future global citizens in the heart of Khon Kaen.</span></p>' +
        '<p class="motto-sm" data-i18n="motto">“Achieving Excellence, Embracing Responsibility”</p>' +
      '</div>' +
      '<div class="foot-col">' +
        '<h4 data-i18n="foot.explore">Explore</h4>' +
        '<a href="about.html" data-i18n="nav.about">About Us</a>' +
        '<a href="academics.html" data-i18n="nav.academics">Academics</a>' +
        '<a href="activities.html" data-i18n="nav.activities">Activities</a>' +
        '<a href="faculty.html" data-i18n="nav.faculty">Faculty &amp; Staff</a>' +
        '<a href="gallery.html" data-i18n="nav.gallery">Gallery</a>' +
      '</div>' +
      '<div class="foot-col">' +
        '<h4 data-i18n="foot.contact">Get in Touch</h4>' +
        '<a href="tel:0989742333">' + svgPhone + '098-974-2333</a>' +
        '<a href="mailto:info@apis-kk.com">' + svgMail + 'info@apis-kk.com</a>' +
        '<a href="https://line.me/R/ti/p/@apiskk" target="_blank" rel="noopener">' + svgChat + 'LINE @apiskk</a>' +
        '<a href="https://facebook.com/apiskkschool" target="_blank" rel="noopener">' + svgFb + 'APIS KK School</a>' +
        '<span class="foot-loc">' + svgPin + '<span data-i18n="foot.loc">Ban Ped, Mueang, Khon Kaen</span></span>' +
      '</div>' +
    '</div>' +
    '<div class="foot-bottom"><span data-i18n="foot.rights">© American Prime International School · Khon Kaen 2026</span> — <span class="demo" data-i18n="foot.demo">Concept redesign</span></div>';

  var fx =
    '<div class="cursor-glow" aria-hidden="true"></div>' +
    '<div class="page-fx" aria-hidden="true">' +
      '<span class="fx-orb fo1"></span><span class="fx-orb fo2"></span>' +
      '<span class="fx-orb fo3"></span><span class="fx-orb fo4"></span>' +
      '<span class="fx-vignette"></span>' +
    '</div>';

  // Inyección
  var h = document.getElementById('hdr');
  var f = document.getElementById('ftr');
  if (h) h.innerHTML = header;
  if (f) f.innerHTML = footer;
  document.body.insertAdjacentHTML('afterbegin', fx);
  document.body.insertAdjacentHTML('beforeend', '<div class="scroll-prog" id="scrollProg" aria-hidden="true"></div>');

  // Link activo
  var links = document.querySelectorAll('#menu a[data-page]');
  links.forEach(function (a) { if (a.getAttribute('data-page') === file) a.classList.add('active'); });
  if (academicsPages.indexOf(file) > -1) {
    var at = document.getElementById('acadToggle'); if (at) at.classList.add('active');
  }

  // Menú mobile
  var burger = document.getElementById('hamburger');
  var menu = document.getElementById('menu');
  if (burger && menu) {
    burger.addEventListener('click', function () { menu.classList.toggle('open'); });
  }
  // Dropdown Academics en mobile (tap para abrir); en desktop es hover por CSS
  var acadToggle = document.getElementById('acadToggle');
  var acadWrap = document.getElementById('acadWrap');
  if (acadToggle && acadWrap) {
    acadToggle.addEventListener('click', function (e) {
      if (window.matchMedia('(max-width:900px)').matches) { e.preventDefault(); acadWrap.classList.toggle('open'); }
    });
  }
})();
