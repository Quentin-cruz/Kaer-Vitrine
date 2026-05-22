/* ============================================
   PAGE CONTACT — VALIDATION + MAILTO + MODALE
   ============================================ */

(function() {
  'use strict';

  // === Configuration ===
  // ⚠️ À remplacer par l'adresse mail définitive transmise par le maître de stage
  var DESTINATAIRE = 'contact@kaersellier.fr';

  // === Sélecteurs ===
  var form = document.getElementById('contact-form');
  if (!form) return;

  var modal = document.getElementById('confirmation-modal');
  var modalBackdrop = modal ? modal.querySelector('.modal__backdrop') : null;
  var modalCloseBtns = modal ? modal.querySelectorAll('.modal__close, .modal__close-cta') : [];

  // Libellés lisibles des types de demande pour le sujet du mail
  var LIBELLES_DEMANDES = {
    'saddle-fitting': 'Bilan Saddle Fitting',
    'bit-fitting': 'Bilan Bit Fitting',
    'essai-stubben': 'Essai Stübben',
    'accessoires': 'Accessoires',
    'autre': 'Autre demande'
  };

  // === Validation ===
  function showError(field, message) {
    var wrapper = field.closest('.form-field');
    if (!wrapper) return;

    wrapper.classList.add('is-error');
    var existing = wrapper.querySelector('.form-error');
    if (existing) existing.remove();

    var error = document.createElement('span');
    error.className = 'form-error';
    error.textContent = message;
    wrapper.appendChild(error);
  }

  function clearError(field) {
    var wrapper = field.closest('.form-field');
    if (!wrapper) return;
    wrapper.classList.remove('is-error');
    var existing = wrapper.querySelector('.form-error');
    if (existing) existing.remove();
  }

  // Reset erreur quand l'utilisateur recommence à taper
  var allFields = form.querySelectorAll('input, textarea, select');
  allFields.forEach(function(field) {
    field.addEventListener('input', function() { clearError(field); });
    field.addEventListener('change', function() { clearError(field); });
  });

  function validateForm() {
    var valid = true;
    var prenom = form.elements['prenom'];
    var nom = form.elements['nom'];
    var email = form.elements['email'];
    var telephone = form.elements['telephone'];
    var localisation = form.elements['localisation'];
    var demande = form.elements['demande'];
    var cheval = form.elements['cheval'];
    var message = form.elements['message'];

    // Champs requis
    if (!prenom.value.trim()) {
      showError(prenom, 'Veuillez saisir votre prénom.');
      valid = false;
    }
    if (!nom.value.trim()) {
      showError(nom, 'Veuillez saisir votre nom.');
      valid = false;
    }

    // Validation email
    var emailValue = email.value.trim();
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailValue) {
      showError(email, 'Veuillez saisir votre adresse email.');
      valid = false;
    } else if (!emailRegex.test(emailValue)) {
      showError(email, 'Adresse email invalide.');
      valid = false;
    }

    // Validation téléphone (souple : au moins 8 chiffres, autorise espaces, points, tirets, +, parenthèses)
    var telValue = telephone.value.trim();
    var telDigits = telValue.replace(/[^0-9]/g, '');
    if (!telValue) {
      showError(telephone, 'Veuillez saisir votre numéro de téléphone.');
      valid = false;
    } else if (telDigits.length < 8) {
      showError(telephone, 'Numéro de téléphone trop court.');
      valid = false;
    }

    if (!localisation.value.trim()) {
      showError(localisation, 'Veuillez indiquer votre département ou ville.');
      valid = false;
    }

    if (!demande.value) {
      showError(demande, 'Veuillez sélectionner la nature de votre demande.');
      valid = false;
    }

    if (!cheval.value.trim()) {
      showError(cheval, 'Veuillez renseigner les informations sur le cheval.');
      valid = false;
    }

    if (!message.value.trim()) {
      showError(message, 'Veuillez saisir votre message.');
      valid = false;
    } else if (message.value.trim().length < 10) {
      showError(message, 'Votre message est un peu court.');
      valid = false;
    }

    // Focus sur le premier champ en erreur
    if (!valid) {
      var firstError = form.querySelector('.is-error input, .is-error textarea, .is-error select');
      if (firstError) firstError.focus();
    }

    return valid;
  }

  // === Construction du mail ===
  function buildMailto() {
    var data = {
      prenom: form.elements['prenom'].value.trim(),
      nom: form.elements['nom'].value.trim(),
      email: form.elements['email'].value.trim(),
      telephone: form.elements['telephone'].value.trim(),
      localisation: form.elements['localisation'].value.trim(),
      demande: form.elements['demande'].value,
      cheval: form.elements['cheval'].value.trim(),
      message: form.elements['message'].value.trim()
    };

    var libelleDemande = LIBELLES_DEMANDES[data.demande] || 'Demande';
    var sujet = '[Kaer Sellier] ' + libelleDemande + ' — ' + data.prenom + ' ' + data.nom;

    var corps = '';
    corps += 'Bonjour,\n\n';
    corps += 'Voici ma demande via le formulaire du site :\n\n';
    corps += '— Nom : ' + data.prenom + ' ' + data.nom + '\n';
    corps += '— Email : ' + data.email + '\n';
    corps += '— Téléphone : ' + data.telephone + '\n';
    corps += '— Localisation : ' + data.localisation + '\n';
    corps += '— Nature de la demande : ' + libelleDemande + '\n';
    corps += '— Cheval : ' + data.cheval + '\n';
    corps += '\nMessage :\n';
    corps += data.message + '\n\n';
    corps += 'Cordialement,\n';
    corps += data.prenom + ' ' + data.nom;

    return 'mailto:' + DESTINATAIRE
         + '?subject=' + encodeURIComponent(sujet)
         + '&body=' + encodeURIComponent(corps);
  }

  // === Modale ===
  function openModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // Focus sur le bouton de fermeture pour l'accessibilité
    setTimeout(function() {
      var firstBtn = modal.querySelector('.modal__close-cta');
      if (firstBtn) firstBtn.focus();
    }, 100);
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  modalCloseBtns.forEach(function(btn) {
    btn.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') {
      closeModal();
    }
  });

  // === Submit ===
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    if (!validateForm()) return;

    var mailtoUrl = buildMailto();

    // Déclenche l'ouverture du client mail sans changer de page
    // (window.location.href fait son job sans nouvel onglet créé par nous)
    window.location.href = mailtoUrl;

    // On ouvre la modale juste après pour rassurer le visiteur,
    // car les comportements mailto varient selon l'OS / le navigateur
    setTimeout(openModal, 400);
  });

  // ============================================
  // CARROUSEL DES BLOCS INFO (mobile)
  // ============================================
  var carousel = document.querySelector('.contact-info__carousel');
  var dots = document.querySelectorAll('.carousel-dot');

  if (carousel && dots.length > 0) {

    // Mise à jour des dots selon le slide visible (au scroll utilisateur)
    var scrollTimeout = null;
    function updateActiveDot() {
      // On désactive sur desktop (le carrousel n'est plus actif)
      if (window.innerWidth >= 1024) return;

      var slides = carousel.querySelectorAll('.info-block');
      var carouselRect = carousel.getBoundingClientRect();
      var center = carouselRect.left + carouselRect.width / 2;

      var closestIndex = 0;
      var closestDistance = Infinity;

      slides.forEach(function(slide, index) {
        var slideRect = slide.getBoundingClientRect();
        var slideCenter = slideRect.left + slideRect.width / 2;
        var distance = Math.abs(slideCenter - center);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      dots.forEach(function(dot, index) {
        if (index === closestIndex) {
          dot.classList.add('is-active');
          dot.setAttribute('aria-current', 'true');
        } else {
          dot.classList.remove('is-active');
          dot.removeAttribute('aria-current');
        }
      });
    }

    carousel.addEventListener('scroll', function() {
      // Throttling léger : on recalcule après que le scroll s'est calmé
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(updateActiveDot, 60);
    }, { passive: true });

    // Clic sur un dot : scroll vers le slide correspondant
    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        var index = parseInt(dot.dataset.slide, 10);
        var slides = carousel.querySelectorAll('.info-block');
        if (slides[index]) {
          var slide = slides[index];
          // On calcule le décalage à appliquer pour centrer le slide
          var carouselWidth = carousel.offsetWidth;
          var slideLeft = slide.offsetLeft;
          var slideWidth = slide.offsetWidth;
          var targetScroll = slideLeft - (carouselWidth - slideWidth) / 2;
          carousel.scrollTo({ left: targetScroll, behavior: 'smooth' });
        }
      });
    });

    // Recalcul lors d'un redimensionnement (rotation mobile, par exemple)
    window.addEventListener('resize', updateActiveDot, { passive: true });

    // Init au chargement
    updateActiveDot();
  }

})();