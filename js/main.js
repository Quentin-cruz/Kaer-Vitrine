(function() {
  'use strict';

  // --- Sélecteurs ---
  var header = document.querySelector('.header');
  var menuToggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav');
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

  // --- Menu mobile ---
  function toggleMenu() {
    var isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isOpen);
    nav.setAttribute('aria-hidden', isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
  }

  // Fermer le menu quand on clique sur un lien
  navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      if (menuToggle.getAttribute('aria-expanded') === 'true') {
        toggleMenu();
      }
    });
  });

  // Fermer le menu avec Échap
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      toggleMenu();
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
