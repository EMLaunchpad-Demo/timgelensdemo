/* Tim Gelens — Kinesitherapie · interacties */
(function () {
  'use strict';

  // Markeer dat JS actief is (voor scroll-reveal)
  document.documentElement.classList.add('js');

  // Mobiel menu (fullscreen)
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    toggle.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(!nav.classList.contains('open'));
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) setMenu(false);
    });
  }

  // Scrollspy — markeer de actieve sectie in het menu
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var sections = navLinks
    .map(function (a) {
      var id = a.getAttribute('href');
      return id && id.charAt(0) === '#' ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  // Scroll-reveal
  var reveals = document.querySelectorAll('[data-reveal]');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  }

  // Scroll-indicator met lopend mannetje
  var rail = document.querySelector('.scroll-rail');
  if (rail) {
    var fill = rail.querySelector('.rail-fill');
    var runner = rail.querySelector('.rail-runner');
    var ticking = false;
    var idle;
    function updateRail() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      var pct = (p * 100).toFixed(2) + '%';
      fill.style.height = pct;
      runner.style.top = pct;
      ticking = false;
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(updateRail); }
      rail.classList.add('is-running');
      clearTimeout(idle);
      idle = setTimeout(function () { rail.classList.remove('is-running'); }, 180);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateRail);
    updateRail();
  }

  // Contactformulier (demo — verstuurt niet echt)
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  if (form && note) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var naam = (document.getElementById('naam') || {}).value || '';
      var email = (document.getElementById('email') || {}).value || '';
      if (!naam.trim() || !email.trim()) {
        note.textContent = 'Vul zeker je naam en e-mailadres in.';
        note.className = 'form-note';
        return;
      }
      note.textContent = 'Bedankt ' + naam.trim().split(' ')[0] +
        '! Je aanvraag is goed ontvangen — ik neem snel contact op. (Demo)';
      note.className = 'form-note ok';
      form.reset();
    });
  }
})();
