/* Tim Gelens — Kinesitherapie · interacties */
(function () {
  'use strict';

  // Markeer dat JS actief is (voor scroll-reveal)
  document.documentElement.classList.add('js');

  // Mobiel menu
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
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
