document.addEventListener('DOMContentLoaded', function () {

    // ===== MOBILE MENU =====
    const menuBtn    = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon   = document.getElementById('menu-icon');

    if (menuBtn && mobileMenu && menuIcon) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            menuIcon.textContent = mobileMenu.classList.contains('hidden') ? 'menu' : 'close';
        });

        // Đóng menu khi click ra ngoài
        document.addEventListener('click', (e) => {
            if (!mobileMenu.classList.contains('hidden')) {
                if (!menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                    mobileMenu.classList.add('hidden');
                    menuIcon.textContent = 'menu';
                }
            }
        });
    }

    // ===== PAGE TRANSITION =====
    const overlay = document.getElementById('page-transition-overlay');
    const mainEl  = document.querySelector('main');

    if (overlay && mainEl) {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                overlay.classList.add('slide-out');
                mainEl.classList.add('page-visible');
            });
        });

        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href]');
            if (!link) return;
            const href = link.getAttribute('href');
            if (
                !href ||
                href.startsWith('#') ||
                href.startsWith('http') ||
                href.startsWith('mailto') ||
                href.startsWith('tel') ||
                link.target === '_blank'
            ) return;

            e.preventDefault();
            overlay.classList.remove('slide-out');
            overlay.classList.add('slide-in');
            setTimeout(() => { window.location.href = href; }, 420);
        });
    }

    // ===== SCROLL REVEAL =====
    const revealEls = document.querySelectorAll('.reveal');

    if (revealEls.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
                    const index    = siblings.indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 90);
                } else {
                    entry.target.classList.remove('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -48px 0px'
        });

        revealEls.forEach(el => revealObserver.observe(el));
    }

});