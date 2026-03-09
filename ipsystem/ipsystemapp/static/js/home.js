/* ============================================================
   home.js – Scroll Reveal + Carousel
   Compatible với Django template ipsystemapp
   ============================================================ */

/* ── 1. SCROLL REVEAL ─────────────────────────────────────── */
(function () {
  /* Inject CSS một lần duy nhất */
  const style = document.createElement('style');
  style.textContent = `
    /* ── Base trạng thái ẨN ── */
    .reveal {
      opacity: 0;
      transform: translateY(48px);
      transition: opacity 0.65s cubic-bezier(.22,.68,0,1.2),
                  transform 0.65s cubic-bezier(.22,.68,0,1.2);
    }
    .reveal--left {
      opacity: 0;
      transform: translateX(-60px);
      transition: opacity 0.7s cubic-bezier(.22,.68,0,1.2),
                  transform 0.7s cubic-bezier(.22,.68,0,1.2);
    }
    .reveal--right {
      opacity: 0;
      transform: translateX(60px);
      transition: opacity 0.7s cubic-bezier(.22,.68,0,1.2),
                  transform 0.7s cubic-bezier(.22,.68,0,1.2);
    }
    .reveal--scale {
      opacity: 0;
      transform: scale(0.88);
      transition: opacity 0.6s cubic-bezier(.22,.68,0,1.2),
                  transform 0.6s cubic-bezier(.22,.68,0,1.2);
    }

    /* ── Trạng thái HIỆN ── */
    .reveal.is-visible,
    .reveal--left.is-visible,
    .reveal--right.is-visible,
    .reveal--scale.is-visible {
      opacity: 1;
      transform: none;
    }

    /* ── Stagger delay cho card trong grid ── */
    .reveal.delay-1 { transition-delay: 0.08s; }
    .reveal.delay-2 { transition-delay: 0.16s; }
    .reveal.delay-3 { transition-delay: 0.24s; }
    .reveal.delay-4 { transition-delay: 0.32s; }
  `;
  document.head.appendChild(style);

  /* ── Tự động gán delay cho các card trong cùng một grid ── */
  function assignStaggerDelay() {
    document.querySelectorAll('.grid, .flex').forEach(function (grid) {
      const cards = Array.from(grid.children).filter(function (el) {
        return el.classList.contains('reveal') ||
               el.classList.contains('reveal--scale') ||
               el.classList.contains('reveal--left') ||
               el.classList.contains('reveal--right');
      });
      cards.forEach(function (card, i) {
        if (i > 0 && i <= 4) card.classList.add('delay-' + i);
      });
    });
  }
  assignStaggerDelay();

  /* ── IntersectionObserver ── */
  const SELECTORS = '.reveal, .reveal--left, .reveal--right, .reveal--scale';

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        /* Giữ lại class để hiệu ứng không bị reset khi scroll lên lại */
        /* Nếu muốn replay khi scroll lên, xoá dòng dưới và bỏ comment unobserve */
        observer.unobserve(entry.target); // ← bỏ dòng này để replay 2 chiều
      }
      /* Uncomment block dưới để có hiệu ứng fade OUT khi scroll ngược */
      /*
      else {
        entry.target.classList.remove('is-visible');
      }
      */
    });
  }, {
    threshold: 0.12,       /* phần tử hiện 12% thì trigger */
    rootMargin: '0px 0px -60px 0px'  /* bắt sớm hơn 60px trước khi vào viewport */
  });

  function observeAll() {
    document.querySelectorAll(SELECTORS).forEach(function (el) {
      observer.observe(el);
    });
  }
  observeAll();

  /* ── Re-observe nếu DOM thay đổi (SPA / AJAX) ── */
  const mutationObserver = new MutationObserver(function () {
    assignStaggerDelay();
    observeAll();
  });
  mutationObserver.observe(document.body, { childList: true, subtree: true });
})();


/* ── 2. CAROUSEL ──────────────────────────────────────────── */
(function () {
  const container = document.getElementById('carousel');
  if (!container) return;

  const items     = container.querySelectorAll('.carousel-item');
  const dots      = document.querySelectorAll('.dot');
  const prevBtn   = document.getElementById('prevBtn');
  const nextBtn   = document.getElementById('nextBtn');
  const total     = items.length;
  let current     = 0;
  let timer       = null;
  const INTERVAL  = 5000;

  /* ── CSS cho slide transition ── */
  const style = document.createElement('style');
  style.textContent = `
    .carousel-container {
      transition: transform 0.6s cubic-bezier(.77,0,.175,1);
      will-change: transform;
    }
    .dot {
      transition: width 0.35s ease, background-color 0.35s ease;
    }
    .dot.active {
      width: 2.5rem !important;
      background-color: white !important;
      opacity: 1 !important;
    }
  `;
  document.head.appendChild(style);

  function goTo(index) {
    current = (index + total) % total;
    container.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === current);
    });
  }

  function startAuto() {
    clearInterval(timer);
    timer = setInterval(function () { goTo(current + 1); }, INTERVAL);
  }

  function resetAuto() { startAuto(); }

  if (prevBtn) prevBtn.addEventListener('click', function () { goTo(current - 1); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', function () { goTo(current + 1); resetAuto(); });

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      goTo(parseInt(dot.dataset.index));
      resetAuto();
    });
  });

  /* Swipe support cho mobile */
  let touchStartX = 0;
  container.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  container.addEventListener('touchend', function (e) {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? current + 1 : current - 1);
      resetAuto();
    }
  }, { passive: true });

  /* Pause khi hover */
  container.closest('section').addEventListener('mouseenter', function () { clearInterval(timer); });
  container.closest('section').addEventListener('mouseleave', startAuto);

  goTo(0);
  startAuto();
})();


/* ── 3. ACTIVE NAV LINK (highlight menu theo trang hiện tại) ── */
(function () {
  const path = window.location.pathname;
  document.querySelectorAll('a[href]').forEach(function (a) {
    if (a.getAttribute('href') === path) {
      a.classList.add('active-nav');
    }
  });
})();