// assets/js/hero-slider.js
// Autoplay hero slider (fade). Mulai otomatis tanpa perlu ditekan.
// Pause on hover/focus, resume on leave/blur.

(function () {
  const SLIDE_INTERVAL = 4500; // waktu antar slide (ms) — ubah sesuai keinginan
  let timer = null;
  let currentIndex = 0;

  function $ (sel, ctx = document) { return ctx.querySelector(sel); }
  function $all (sel, ctx = document) { return Array.from(ctx.querySelectorAll(sel)); }
  function log(...args) { if (window.console) console.log('[hero-slider]', ...args); }

  function init() {
    const hero = $('#hero');
    if (!hero) {
      log('Tidak menemukan elemen #hero — slider dibatalkan.');
      return;
    }

    const slides = $all('.hero-slide', hero);
    if (!slides.length) {
      log('Tidak ada .hero-slide — slider dibatalkan.');
      return;
    }

    // Pastikan ada container dots
    let dotsContainer = $('.hero-dots', hero);
    if (!dotsContainer) {
      dotsContainer = document.createElement('div');
      dotsContainer.className = 'hero-dots';
      dotsContainer.setAttribute('role', 'tablist');
      dotsContainer.setAttribute('aria-label', 'Slide navigation');
      hero.appendChild(dotsContainer);
      log('Membuat container .hero-dots otomatis.');
    }

    // Sinkronkan jumlah dot
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
    }

    const dots = $all('.hero-dot', dotsContainer);
    const btnPrev = $('.hero-control.prev', hero);
    const btnNext = $('.hero-control.next', hero);

    // Preload gambar agar transisi mulus
    slides.forEach(s => {
      const bg = window.getComputedStyle(s).backgroundImage;
      const match = bg && bg.match(/url\(["']?(.*?)["']?\)/);
      if (match && match[1]) {
        const img = new Image();
        img.src = match[1];
      }
    });

    function show(index, userTriggered = false) {
      index = ((index % slides.length) + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('active', i === index));
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === index);
        d.setAttribute('aria-selected', i === index ? 'true' : 'false');
      });
      currentIndex = index;
      if (userTriggered) restartAutoplay();
    }

    function next() { show(currentIndex + 1, true); }
    function prev() { show(currentIndex - 1, true); }

    function startAutoplay() {
      stopAutoplay();
      timer = setInterval(() => next(), SLIDE_INTERVAL);
      log('Autoplay dimulai, interval', SLIDE_INTERVAL);
    }

    function stopAutoplay() {
      if (timer) {
        clearInterval(timer);
        timer = null;
        log('Autoplay dihentikan');
      }
    }

    function restartAutoplay() {
      stopAutoplay();
      // beri jeda kecil untuk interaksi pengguna, lalu mulai lagi
      setTimeout(() => startAutoplay(), 600);
    }

    // Pasang event handler untuk kontrol prev/next
    if (btnNext) btnNext.addEventListener('click', () => next());
    if (btnPrev) btnPrev.addEventListener('click', () => prev());

    // Pasang event handler untuk dot
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => show(idx, true));
      dot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          show(idx, true);
        }
      });
    });

    // Pause saat hover/fokus, resume saat leave/blur
    hero.addEventListener('mouseenter', stopAutoplay);
    hero.addEventListener('mouseleave', startAutoplay);
    hero.addEventListener('focusin', stopAutoplay);
    hero.addEventListener('focusout', startAutoplay);

    // Inisialisasi tampilan pertama dan otomatis mulai
    show(0, false);
    // Delay very small supaya browser sudah mem-render initial state
    setTimeout(() => startAutoplay(), 80);

    // exposed for debugging
    window.__heroSlider = { show, next, prev, startAutoplay, stopAutoplay };
    log('Slider otomatis siap dengan', slides.length, 'slide.');
  }

  // Jalankan setelah DOM siap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 10);
  }
})();