// assets/js/main.js
// Main JS: footer year, mobile nav, product modal, contact->WhatsApp, scroll reveal
// Also includes a robust fallback hero slider initializer (runs only if no other slider initialized).

const BUSINESS_NUMBER = '6285758396819'; // <-- GANTI ke nomor WhatsApp bisnis Anda (format internasional tanpa +)

document.addEventListener('DOMContentLoaded', () => {
  /* FOOTER YEAR */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* MOBILE NAV */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      nav.style.display = isOpen ? 'flex' : '';
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close nav when clicking outside (useful on mobile)
    document.addEventListener('click', (e) => {
      if (!nav.classList.contains('open')) return;
      const withinNav = e.target.closest('.main-nav');
      const isToggle = e.target.closest('.nav-toggle');
      if (!withinNav && !isToggle) {
        nav.classList.remove('open');
        nav.style.display = '';
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* PRODUCT MODAL (accessible) */
  const modal = document.getElementById('productModal');
  const modalImg = document.getElementById('modalImg');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalPrice = document.getElementById('modalPrice');
  const closeBtn = modal?.querySelector('.modal-close');
  let lastFocusedEl = null;
  
  // === SLIDER STATE ===
let currentSlide = 0;
let slideImages = [];
const btnNext = modal?.querySelector('.slide-btn.next');
const btnPrev = modal?.querySelector('.slide-btn.prev');


  function trapFocus(e) {
    if (e.key !== 'Tab' || !modal) return;
    const focusable = modal.querySelectorAll('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

 function openModal(card) {
  if (!modal) return;
  lastFocusedEl = document.activeElement;

  // === AMBIL SEMUA GAMBAR ===
  if (card.dataset.images) {
    slideImages = card.dataset.images.split(',');
  } else {
    slideImages = [
      card.dataset.image ||
      (card.querySelector('img') && card.querySelector('img').src) ||
      ''
    ];
  }

  currentSlide = 0;

  if (modalImg) {
    modalImg.src = slideImages[0];
    modalImg.alt = card.dataset.title || 'Foto produk';
  }

  if (modalTitle) modalTitle.textContent = card.dataset.title || '';
  if (modalDesc) modalDesc.textContent = card.dataset.desc || '';
  if (modalPrice) modalPrice.textContent = card.dataset.price || '';

  modal.setAttribute('aria-hidden', 'false');
  closeBtn?.focus();

  document.addEventListener('keydown', handleModalKeydown);
  modal.addEventListener('click', handleModalClick);
  document.addEventListener('keydown', trapFocus);
}


  function closeModal() {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', handleModalKeydown);
    modal.removeEventListener('click', handleModalClick);
    document.removeEventListener('keydown', trapFocus);
    // restore focus
    try { lastFocusedEl?.focus(); } catch (e) {}
  }

  function handleModalKeydown(e) {
    if (e.key === 'Escape') closeModal();
  }

  function handleModalClick(e) {
    if (e.target === modal) closeModal();
  }

  document.querySelectorAll('.product').forEach(card => {
    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  closeBtn?.addEventListener('click', closeModal);
  
  // === SLIDER CONTROLS ===
btnNext?.addEventListener('click', (e) => {
  e.stopPropagation();
  if (!slideImages.length) return;
  currentSlide = (currentSlide + 1) % slideImages.length;
  modalImg.src = slideImages[currentSlide];
});

btnPrev?.addEventListener('click', (e) => {
  e.stopPropagation();
  if (!slideImages.length) return;
  currentSlide = (currentSlide - 1 + slideImages.length) % slideImages.length;
  modalImg.src = slideImages[currentSlide];
});


  (function () {
  const BUSINESS_NUMBER = '6281335422494'; // <-- GANTI DI SINI

  const form = document.getElementById('contactForm');
  const sendBtn = document.getElementById('sendBtn');

  function sanitizePhone(input) {
    if (!input) return '';
    const digits = input.replace(/[^+\d]/g, '');
    if (/^0\d+/.test(digits)) {
      return '62' + digits.slice(1);
    }
    return digits.replace(/^\+/, '');
  }

  function buildMessage(values) {
    const lines = [];
    lines.push('Pesan dari website Batik Panji:');
    if (values.name) lines.push('Nama: ' + values.name);
    if (values.message) lines.push('', 'Pesan / Detail:', values.message);
    lines.push('', '— Dikirim via situs batikpanji');
    return encodeURIComponent(lines.join('\n'));
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', function () {
      const name = form.name.value.trim();
      const message = form.message.value.trim();

      if (!name) {
        alert('Mohon isi Nama.');
        form.name.focus();
        return;
      }
      if (!message) {
        alert('Mohon isi Pesan / Detail Pesanan.');
        form.message.focus();
        return;
      }


      const toNumber = BUSINESS_NUMBER && BUSINESS_NUMBER.trim().length > 0
        ? BUSINESS_NUMBER.replace(/^\+/, '')
        : (visitorPhone || '');

      if (!toNumber) {
        alert('Nomor tujuan (BUSINESS_NUMBER) belum diset, dan pengunjung tidak mengisi nomor.');
        return;
      }

      const text = buildMessage({ name, message });

      // ✅ PERBAIKAN: Gunakan variabel toNumber, bukan hardcode nomor
      const waUrl = 'https://wa.me/' + toNumber + '?text=' + text;

      window.open(waUrl, '_blank', 'noopener');
    });
  }
})();

  /* SCROLL REVEAL (simple, respects reduced-motion) */
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduced) {
    const revealSelector = '.section, .card, .hero-feature, .sr, .reveal';
    const revealEls = document.querySelectorAll(revealSelector);
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(el => {
      // add base class if not present (helps if markup didn't include .reveal)
      if (!el.classList.contains('reveal') && !el.classList.contains('sr')) {
        el.classList.add('reveal');
      }
      revealObserver.observe(el);
    });
  } else {
    // Reduced motion: show everything immediately
    document.querySelectorAll('.reveal, .sr, .section, .card, .hero-feature').forEach(el => el.classList.add('show'));
  }

  /* HERO SLIDER FALLBACK (only if another slider isn't present) */
  // If you have a separate hero-slider.js that defines window.__heroSlider, this block will not run.
  if (typeof window.__heroSlider === 'undefined') {
    (function initFallbackHeroSlider() {
      const SLIDE_INTERVAL = 5000;
      let timer = null;
      let current = 0;

      function $ (sel, ctx = document) { return ctx.querySelector(sel); }
      function $all (sel, ctx = document) { return Array.from(ctx.querySelectorAll(sel)); }
      function log(...args) { if (window.console) console.log('[hero-slider-fallback]', ...args); }

      const hero = $('#hero');
      if (!hero) {
        log('No #hero element found — skipping fallback slider.');
        return;
      }

      let slides = $all('.hero-slide', hero);
      if (!slides.length) {
        const wrapper = $('.hero-slides', hero);
        if (wrapper) slides = $all('.hero-slide', wrapper);
      }
      if (!slides.length) {
        log('No .hero-slide elements found inside #hero — skipping slider.');
        return;
      }

      // Ensure dots container exists
      let dotsContainer = $('.hero-dots', hero);
      if (!dotsContainer) {
        dotsContainer = document.createElement('div');
        dotsContainer.className = 'hero-dots';
        dotsContainer.setAttribute('role', 'tablist');
        dotsContainer.setAttribute('aria-label', 'Slide navigation');
        hero.appendChild(dotsContainer);
        log('Created .hero-dots container (fallback).');
      }

      // Sync/create dots to match slide count
      const existingDots = $all('.hero-dot', dotsContainer);
      if (existingDots.length !== slides.length) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, i) => {
          const btn = document.createElement('button');
          btn.className = 'hero-dot';
          btn.setAttribute('role', 'tab');
          btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
          btn.setAttribute('aria-selected', 'false');
          dotsContainer.appendChild(btn);
        });
        log('Generated dots for slides:', slides.length);
      }

      const dots = $all('.hero-dot', dotsContainer);
      const btnPrev = $('.hero-control.prev', hero);
      const btnNext = $('.hero-control.next', hero);

      // Preload images
      slides.forEach(s => {
        const bg = window.getComputedStyle(s).backgroundImage;
        const match = bg && bg.match(/url\(["']?(.*?)["']?\)/);
        if (match && match[1]) {
          const img = new Image();
          img.src = match[1];
        }
      });

      function goTo(index, userTriggered = false) {
        if (!slides.length) return;
        index = ((index % slides.length) + slides.length) % slides.length; // normalize
        slides.forEach((s, i) => s.classList.toggle('active', i === index));
        dots.forEach((d, i) => {
          d.classList.toggle('active', i === index);
          d.setAttribute('aria-selected', i === index ? 'true' : 'false');
        });
        current = index;
        if (userTriggered) startAutoplay();
      }

      function next() { goTo(current + 1, true); }
      function prev() { goTo(current - 1, true); }

      function startAutoplay() {
        stopAutoplay();
        timer = setInterval(() => {
          next();
        }, SLIDE_INTERVAL);
        log('Autoplay started (fallback)', SLIDE_INTERVAL);
      }

      function stopAutoplay() {
        if (timer) {
          clearInterval(timer);
          timer = null;
          log('Autoplay stopped (fallback)');
        }
      }

      // Wire controls
      if (btnNext) btnNext.addEventListener('click', () => next());
      if (btnPrev) btnPrev.addEventListener('click', () => prev());

      // Wire dots
      dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => goTo(idx, true));
        dot.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            goTo(idx, true);
          }
        });
      });

      // Pause on hover/focus, resume on leave/blur
      hero.addEventListener('mouseenter', stopAutoplay);
      hero.addEventListener('mouseleave', startAutoplay);
      hero.addEventListener('focusin', stopAutoplay);
      hero.addEventListener('focusout', startAutoplay);

      // Init
      goTo(0);
      startAutoplay();

      // Expose (for debugging or external control)
      window.__heroSlider = { goTo, next, prev, startAutoplay, stopAutoplay };
      log('Fallback hero slider initialized with', slides.length, 'slides.');
    })();
  } // end fallback slider
}); // DOMContentLoaded end

	// NAV TOGGLE (append di akhir assets/js/main.js)
	document.addEventListener('DOMContentLoaded', function () {
	  const navToggle = document.querySelector('.nav-toggle');
	  const body = document.body;
	  const mainNav = document.querySelector('.main-nav');

	  if (navToggle && mainNav) {
		navToggle.addEventListener('click', function () {
		  const expanded = this.getAttribute('aria-expanded') === 'true';
		  this.setAttribute('aria-expanded', String(!expanded));
		  body.classList.toggle('nav-open', !expanded);
		});

		// close nav when clicking outside on mobile
		document.addEventListener('click', (e) => {
		  if (!body.classList.contains('nav-open')) return;
		  if (e.target.closest('.main-nav') || e.target.closest('.nav-toggle')) return;
		  body.classList.remove('nav-open');
		  navToggle.setAttribute('aria-expanded', 'false');
		});
	  }
	});