// ===== MOBILE MENU =====
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        menuIcon.textContent = mobileMenu.classList.contains('hidden') ? 'menu' : 'close';
    });

    // ===== PAGE TRANSITION =====
    const overlay = document.getElementById('page-transition-overlay');
    const mainEl = document.querySelector('main');

    // Khi trang load xong: kéo overlay ra khỏi màn hình + hiện nội dung
    window.addEventListener('DOMContentLoaded', () => {
        // Nhỏ delay để browser vẽ xong trước khi animate
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                overlay.classList.add('slide-out');
                mainEl.classList.add('page-visible');
            });
        });
    });

    // Khi click vào link nội bộ: kéo overlay vào trước khi chuyển trang
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href]');
        if (!link) return;

        const href = link.getAttribute('href');

        // Bỏ qua: link ngoài, anchor (#), target blank, javascript:
        if (
            !href ||
            href.startsWith('#') ||
            href.startsWith('http') ||
            href.startsWith('mailto') ||
            href.startsWith('tel') ||
            link.target === '_blank'
        ) return;

        e.preventDefault();

        // Kéo overlay vào che màn hình
        overlay.classList.remove('slide-out');
        overlay.classList.add('slide-in');

        // Sau khi animation xong thì chuyển trang
        setTimeout(() => {
            window.location.href = href;
        }, 420);
    });


    // ===== SCROLL REVEAL =====
    const revealEls = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Stagger: delay dựa trên vị trí trong nhóm anh em
                const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
                const index = siblings.indexOf(entry.target);
                const delay = index * 90;

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
            } else {
                // Lướt ra khỏi viewport → ẩn lại
                entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -48px 0px'
    });

    revealEls.forEach(el => revealObserver.observe(el));