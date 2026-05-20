/* ============================================
   KAER SELLIER — Script principal
   ============================================ */

(function() {
  'use strict';

  // --- Sélecteurs ---
  var header = document.querySelector('.header');
  var menuToggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav');
  var navClose = document.querySelector('.nav__close');
  var navOverlay = document.querySelector('.nav-overlay');
  var navLinks = document.querySelectorAll('.nav__link');
  var revealElements = document.querySelectorAll('.reveal');

  // --- Header transparent → opaque au scroll ---
  function handleScroll() {
    if (window.scrollY > 60) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // état initial

  // --- Menu drawer ---
  function openMenu() {
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Fermer le menu');
    nav.setAttribute('aria-hidden', 'false');
    if (navOverlay) navOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('nav-open');
  }

  function closeMenu() {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Ouvrir le menu');
    nav.setAttribute('aria-hidden', 'true');
    if (navOverlay) navOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('nav-open');
  }

  function toggleMenu() {
    var isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }

  // Bouton close dédié dans le drawer
  if (navClose) {
    navClose.addEventListener('click', closeMenu);
  }

  // Fermer en cliquant sur l'overlay
  if (navOverlay) {
    navOverlay.addEventListener('click', closeMenu);
  }

  // Fermer le menu quand on clique sur un lien
  navLinks.forEach(function(link) {
    link.addEventListener('click', closeMenu);
  });

  // Fermer le menu avec Échap
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
    }
  });

  // --- Animations au scroll (IntersectionObserver) ---
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(function(el) {
      observer.observe(el);
    });
  } else {
    // Fallback : tout est visible direct
    revealElements.forEach(function(el) {
      el.classList.add('reveal--visible');
    });
  }
})();
