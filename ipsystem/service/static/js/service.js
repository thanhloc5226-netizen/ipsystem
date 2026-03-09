/* ============================================================
   service.js – Scroll Reveal cho trang Dịch vụ & Quy trình
   ============================================================ */

(function () {

  /* ── CSS inject ── */
  const style = document.createElement('style');
  style.textContent = `
    /* ── ẨN mặc định ── */
    .reveal {
      opacity: 0;
      transform: translateY(50px);
      transition: opacity 0.7s cubic-bezier(0.22, 0.68, 0, 1.2),
                  transform 0.7s cubic-bezier(0.22, 0.68, 0, 1.2);
    }
    .reveal--scale {
      opacity: 0;
      transform: scale(0.88) translateY(30px);
      transition: opacity 0.65s cubic-bezier(0.22, 0.68, 0, 1.2),
                  transform 0.65s cubic-bezier(0.22, 0.68, 0, 1.2);
    }
    .reveal--left {
      opacity: 0;
      transform: translateX(-60px);
      transition: opacity 0.7s cubic-bezier(0.22, 0.68, 0, 1.2),
                  transform 0.7s cubic-bezier(0.22, 0.68, 0, 1.2);
    }
    .reveal--right {
      opacity: 0;
      transform: translateX(60px);
      transition: opacity 0.7s cubic-bezier(0.22, 0.68, 0, 1.2),
                  transform 0.7s cubic-bezier(0.22, 0.68, 0, 1.2);
    }

    /* ── HIỆN khi is-visible ── */
    .reveal.is-visible,
    .reveal--scale.is-visible,
    .reveal--left.is-visible,
    .reveal--right.is-visible {
      opacity: 1;
      transform: none;
    }

    /* ── Stagger delay ── */
    .stagger-1 { transition-delay: 0.08s !important; }
    .stagger-2 { transition-delay: 0.16s !important; }
    .stagger-3 { transition-delay: 0.24s !important; }

    /* ── Workflow step: chẵn slide từ phải ── */
    .workflow-step:nth-child(even) .step-content {
      order: 2;
    }
  `;
  document.head.appendChild(style);

  /* ── Gán stagger cho pricing cards ── */
  function assignStagger() {
    document.querySelectorAll('.grid').forEach(function (grid) {
      const cards = Array.from(grid.children).filter(function (el) {
        return el.classList.contains('reveal') ||
               el.classList.contains('reveal--scale') ||
               el.classList.contains('reveal--left') ||
               el.classList.contains('reveal--right');
      });
      cards.forEach(function (card, i) {
        if (i > 0 && i <= 3) card.classList.add('stagger-' + i);
      });
    });
  }

  /* ── Workflow: xen kẽ trái/phải ── */
  function assignWorkflowDirection() {
    const steps = document.querySelectorAll('.workflow-step');
    steps.forEach(function (step, i) {
      step.classList.remove('reveal'); // bỏ class gốc
      if (i % 2 === 0) {
        step.classList.add('reveal--left');
      } else {
        step.classList.add('reveal--right');
      }
    });
  }

  /* ── IntersectionObserver ── */
  function initObserver() {
    const SELECTORS = '.reveal, .reveal--scale, .reveal--left, .reveal--right';
    const els = document.querySelectorAll(SELECTORS);

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });

    els.forEach(function (el) { observer.observe(el); });
  }

  /* ── Khởi chạy ── */
  function init() {
    assignStagger();
    assignWorkflowDirection();
    initObserver();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();