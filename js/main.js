/* ============================================================
   APIS — Interacciones (corre después de layout.js e i18n.js).
   ============================================================ */
(function () {
  'use strict';

  /* Header sólido al scrollear + barra de progreso */
  var hdr = document.getElementById('hdr');
  var prog = document.getElementById('scrollProg');
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (hdr) hdr.classList.toggle('solid', y > 60);
    if (prog) {
      var hgt = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.width = (hgt > 0 ? (y / hgt) * 100 : 0) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Hero slideshow (solo en la home) */
  (function () {
    var host = document.getElementById('heroSlides');
    if (!host) return;
    var srcs = [
      'assets/IMG_5615.jpg',
      'assets/IMG_5537.jpg',
      'assets/LINE_ALBUM_Pixs-for-Website-and-Marketing_250127_15.jpg',
      'assets/IMG_5616.jpg'
    ];
    var dotsHost = document.getElementById('heroDots');
    var slides = [], dots = [], idx = 0, timer;
    function show(i) {
      if (!slides.length) return;
      slides[idx].classList.remove('on'); if (dots[idx]) dots[idx].classList.remove('on');
      idx = (i + slides.length) % slides.length;
      slides[idx].classList.add('on'); if (dots[idx]) dots[idx].classList.add('on');
    }
    function start() { clearInterval(timer); if (slides.length > 1) timer = setInterval(function () { show(idx + 1); }, 5200); }
    srcs.forEach(function (src) {
      var im = new Image();
      im.onload = function () {
        var d = document.createElement('div');
        d.className = 'hero-slide';
        d.style.backgroundImage = "url('" + src + "')";
        host.appendChild(d); slides.push(d);
        if (dotsHost) {
          var dot = document.createElement('i'); var mine = slides.length - 1;
          dot.addEventListener('click', function () { show(mine); start(); });
          dotsHost.appendChild(dot); dots.push(dot);
        }
        if (slides.length === 1) { d.classList.add('on'); if (dots[0]) dots[0].classList.add('on'); }
        start();
      };
      im.src = src;
    });
  })();

  /* Scroll reveal */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.04, rootMargin: '0px 0px -3% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* Count-up */
  function animateCount(el) {
    var to = parseFloat(el.getAttribute('data-to')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1400, t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counts = document.querySelectorAll('.count');
  if ('IntersectionObserver' in window && counts.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counts.forEach(function (el) { cio.observe(el); });
  }

  /* Galería dinámica con filtros por categoría (117 fotos) */
  (function () {
    var grid = document.getElementById('galGridDyn');
    if (!grid || !window.APIS_GALLERY) return;
    var frag = document.createDocumentFragment();
    window.APIS_GALLERY.forEach(function (it) {
      var fig = document.createElement('figure');
      fig.className = 'gitem'; fig.setAttribute('data-cat', it.cat);
      var img = document.createElement('img');
      img.loading = 'lazy'; img.decoding = 'async'; img.src = it.src; img.alt = 'APIS ' + it.cat;
      fig.appendChild(img); frag.appendChild(fig);
    });
    grid.appendChild(frag);
    var tabs = document.getElementById('galFilter');
    if (tabs) {
      tabs.addEventListener('click', function (e) {
        var b = e.target.closest('.gal-tab'); if (!b) return;
        tabs.querySelectorAll('.gal-tab').forEach(function (t) { t.classList.remove('active'); });
        b.classList.add('active');
        var f = b.getAttribute('data-filter');
        grid.querySelectorAll('.gitem').forEach(function (g) {
          g.style.display = (f === 'all' || g.getAttribute('data-cat') === f) ? '' : 'none';
        });
      });
    }
    // Re-aplicar i18n para traducir los tabs recién creados
    if (window.APIS_setLang) { try { window.APIS_setLang(localStorage.getItem('apis_lang') || 'en'); } catch (e) {} }
  })();

  /* Cursor glow (desktop, puntero fino) */
  var glow = document.querySelector('.cursor-glow');
  if (glow && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('mousemove', function (e) {
      glow.style.opacity = '1'; glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px';
    });
    window.addEventListener('mouseout', function () { glow.style.opacity = '0'; });
  }

  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var fine = window.matchMedia('(pointer:fine)').matches;

  /* Parallax suave: sello del hero + fondo de los hero internos */
  if (!reduce) {
    var seal = document.querySelector('.hero .seal-lg');
    var pHero = document.querySelector('.page-hero');
    var ticking = false;
    function parallax() {
      var y = window.pageYOffset || document.documentElement.scrollTop;
      if (seal) seal.style.transform = 'translateY(' + (y * 0.12) + 'px) scale(' + (1 - Math.min(y / 4000, 0.06)) + ')';
      if (pHero) pHero.style.backgroundPosition = '50% calc(50% + ' + (y * 0.15) + 'px)';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
    }, { passive: true });
    parallax();
  }

  /* Botones primarios "magnéticos" (estilo Apple) */
  if (fine && !reduce) {
    document.querySelectorAll('.btn.gold, .btn.solid').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        var mx = e.clientX - r.left - r.width / 2;
        var my = e.clientY - r.top - r.height / 2;
        b.style.transform = 'translate(' + (mx * 0.18) + 'px,' + (my * 0.28) + 'px)';
      });
      b.addEventListener('mouseleave', function () { b.style.transform = ''; });
    });
  }
})();
