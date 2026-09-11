/* ===========================================================
   Regal Rest Cleaning — site interactions
   Vanilla JS. No external APIs, no environment variables.
   =========================================================== */
(function () {
  'use strict';

  /* -------------------------------------------------------
     1. Footer year
     ------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* -------------------------------------------------------
     2. Sticky header shadow on scroll
     ------------------------------------------------------- */
  var header = document.getElementById('header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 8) {
        header.classList.add('is-stuck');
      } else {
        header.classList.remove('is-stuck');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* -------------------------------------------------------
     3. Mobile navigation
     ------------------------------------------------------- */
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');

  function closeNav() {
    if (!nav || !navToggle) return;
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('nav-open');
  }

  function openNav() {
    if (!nav || !navToggle) return;
    nav.classList.add('is-open');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('nav-open');
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) {
        closeNav();
      } else {
        openNav();
      }
    });

    // Close when a nav link is tapped
    nav.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (link) closeNav();
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
        navToggle.focus();
      }
    });

    // Reset when resizing back to desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeNav();
    });
  }

  /* -------------------------------------------------------
     4. Smooth in-page scrolling with sticky-header offset
     ------------------------------------------------------- */
  var prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;

    var hash = link.getAttribute('href');
    if (!hash || hash === '#' || hash.length < 2) return;

    var target = document.getElementById(hash.slice(1));
    if (!target) return;

    e.preventDefault();

    var headerHeight = header ? header.offsetHeight : 0;
    var top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;

    window.scrollTo({
      top: top < 0 ? 0 : top,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });

    // Keep the URL and focus in sync for accessibility
    if (history.replaceState) {
      history.replaceState(null, '', hash);
    }
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });

  /* -------------------------------------------------------
     5. Scroll reveal animations
     ------------------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window) || prefersReducedMotion) {
    Array.prototype.forEach.call(revealEls, function (el) {
      el.classList.add('is-visible');
    });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = Math.min(i * 70, 280);
        window.setTimeout(function () {
          el.classList.add('is-visible');
        }, delay);
        observer.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    Array.prototype.forEach.call(revealEls, function (el) {
      observer.observe(el);
    });
  }

  /* -------------------------------------------------------
     6. Quote form — client-side validation + mailto handoff
     ------------------------------------------------------- */
  var form = document.getElementById('quoteForm');
  if (!form) return;

  var statusEl = document.getElementById('formStatus');
  var BUSINESS_EMAIL = 'info@regalrestllc.com';

  var RULES = {
    name: {
      required: true,
      test: function (v) { return v.length >= 2; },
      message: 'Please enter your full name.'
    },
    phone: {
      required: true,
      test: function (v) {
        var digits = v.replace(/\D/g, '');
        return digits.length >= 10 && digits.length <= 15;
      },
      message: 'Please enter a valid phone number with area code.'
    },
    email: {
      required: true,
      test: function (v) { return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v); },
      message: 'Please enter a valid email address.'
    },
    message: {
      required: true,
      test: function (v) { return v.length >= 10; },
      message: 'Please tell us a little about the space (at least 10 characters).'
    }
  };

  function fieldWrap(input) {
    return input.closest('.field');
  }

  function showError(input, message) {
    var wrap = fieldWrap(input);
    if (!wrap) return;
    wrap.classList.add('has-error');
    var errorEl = wrap.querySelector('.field__error');
    if (errorEl) errorEl.textContent = message;
    input.setAttribute('aria-invalid', 'true');
  }

  function clearError(input) {
    var wrap = fieldWrap(input);
    if (!wrap) return;
    wrap.classList.remove('has-error');
    var errorEl = wrap.querySelector('.field__error');
    if (errorEl) errorEl.textContent = '';
    input.removeAttribute('aria-invalid');
  }

  function validateField(input) {
    var rule = RULES[input.name];
    if (!rule) return true;

    var value = (input.value || '').trim();

    if (rule.required && !value) {
      showError(input, 'This field is required.');
      return false;
    }
    if (value && rule.test && !rule.test(value)) {
      showError(input, rule.message);
      return false;
    }
    clearError(input);
    return true;
  }

  function setStatus(message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.remove('is-success', 'is-error');
    statusEl.classList.add('is-visible', type === 'success' ? 'is-success' : 'is-error');
  }

  // Live validation once a field has been touched
  Object.keys(RULES).forEach(function (name) {
    var input = form.elements[name];
    if (!input) return;

    input.addEventListener('blur', function () { validateField(input); });
    input.addEventListener('input', function () {
      var wrap = fieldWrap(input);
      if (wrap && wrap.classList.contains('has-error')) validateField(input);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var firstInvalid = null;
    var valid = true;

    Object.keys(RULES).forEach(function (name) {
      var input = form.elements[name];
      if (!input) return;
      if (!validateField(input)) {
        valid = false;
        if (!firstInvalid) firstInvalid = input;
      }
    });

    if (!valid) {
      setStatus('Please fix the highlighted fields and try again.', 'error');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    var get = function (n) {
      var el = form.elements[n];
      return el ? (el.value || '').trim() : '';
    };

    var name = get('name');
    var phone = get('phone');
    var email = get('email');
    var service = get('service');
    var address = get('address');
    var message = get('message');

    var subject = 'Quote request — ' + (service || 'Cleaning service') + ' — ' + name;

    var bodyLines = [
      'New quote request from the Regal Rest Cleaning website.',
      '',
      'Name: ' + name,
      'Phone: ' + phone,
      'Email: ' + email,
      'Service needed: ' + (service || 'Not specified'),
      'Address / neighborhood: ' + (address || 'Not provided'),
      '',
      'Details:',
      message
    ];

    var mailto = 'mailto:' + BUSINESS_EMAIL +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(bodyLines.join('\n'));

    setStatus(
      'Thanks, ' + name.split(' ')[0] + '! Your email app is opening with the request ready to send. ' +
      'If it does not open, email ' + BUSINESS_EMAIL + ' or call (832) 871-3873 and we will get you scheduled.',
      'success'
    );

    window.location.href = mailto;
  });
})();
