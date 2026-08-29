// =============================================
//  齋藤林業 グローバルJavaScript
// =============================================

document.addEventListener('DOMContentLoaded', () => {

    // -----------------------------------------------
    // 1. Header scroll state
    // -----------------------------------------------
    const header = document.getElementById('header');
    if (header) {
        const updateHeader = () => {
            header.classList.toggle('scrolled', window.scrollY > 60);
        };
        window.addEventListener('scroll', updateHeader, { passive: true });
        updateHeader();
    }

    // -----------------------------------------------
    // 2. Mobile hamburger menu
    // -----------------------------------------------
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.classList.toggle('active');
            mobileNav.classList.toggle('open', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close on link click
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // -----------------------------------------------
    // 3. Scroll animations (fade-up)
    // -----------------------------------------------
    const animEls = document.querySelectorAll('.fade-up, .fade-in');
    if (animEls.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

        animEls.forEach((el, i) => {
            el.style.transitionDelay = (i % 4 * 0.1) + 's';
            observer.observe(el);
        });
    }

    // -----------------------------------------------
    // 4. Smooth scroll for anchor links
    // -----------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = (document.getElementById('header')?.offsetHeight || 80) + 16;
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - offset,
                behavior: 'smooth'
            });
        });
    });

    // -----------------------------------------------
    // 5. Hero parallax
    // -----------------------------------------------
    const heroBg = document.querySelector('.hero__bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            heroBg.style.transform = `scale(1.08) translateY(${window.scrollY * 0.2}px)`;
        }, { passive: true });
    }

    // -----------------------------------------------
    // 6. FAQ accordion
    // -----------------------------------------------
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item   = btn.closest('.faq-item');
            const answer = item.querySelector('.faq-answer');
            const isOpen = item.classList.contains('open');

            // Close all
            document.querySelectorAll('.faq-item.open').forEach(openItem => {
                openItem.classList.remove('open');
                openItem.querySelector('.faq-answer').style.maxHeight = '0';
            });

            // Open clicked (if was closed)
            if (!isOpen) {
                item.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // -----------------------------------------------
    // 6b. 薪ページ「薪を知る」アコーディオン
    // -----------------------------------------------
    document.querySelectorAll('.kb-question').forEach(btn => {
        const item = btn.closest('.kb-item');
        const answer = item.querySelector('.kb-answer');

        // 初期状態（open クラス付きの項目のみ最初から展開）
        if (item.classList.contains('open')) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }

        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');

            // Close all
            document.querySelectorAll('.kb-item.open').forEach(openItem => {
                openItem.classList.remove('open');
                openItem.querySelector('.kb-question').setAttribute('aria-expanded', 'false');
                openItem.querySelector('.kb-answer').style.maxHeight = '0';
            });

            // Open clicked (if was closed)
            if (!isOpen) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // ハッシュ付きアクセス時（例: firewood/#stove）は該当項目を開いて自動スクロール
    if (location.hash) {
        const target = document.querySelector('.kb-item' + location.hash);
        if (target) {
            document.querySelectorAll('.kb-item.open').forEach(openItem => {
                openItem.classList.remove('open');
                openItem.querySelector('.kb-question').setAttribute('aria-expanded', 'false');
                openItem.querySelector('.kb-answer').style.maxHeight = '0';
            });
            target.classList.add('open');
            const q = target.querySelector('.kb-question');
            const a = target.querySelector('.kb-answer');
            q.setAttribute('aria-expanded', 'true');
            a.style.maxHeight = a.scrollHeight + 'px';
            setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        }
    }

    // -----------------------------------------------
    // 7. Contact & Slab form validation
    // -----------------------------------------------
    const forms = document.querySelectorAll('form[data-validate]');
    forms.forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const errors = [];

            // Check required fields
            form.querySelectorAll('[required]').forEach(field => {
                const val = field.value.trim();
                if (!val) {
                    field.classList.add('error');
                    errors.push(field.name || 'field');
                } else {
                    field.classList.remove('error');
                }
            });

            // Email format
            const emailFields = form.querySelectorAll('input[type="email"]');
            emailFields.forEach(field => {
                if (field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
                    field.classList.add('error');
                    errors.push('email');
                }
            });

            if (errors.length > 0) {
                showFormMessage(form, 'error', '入力に不備があります。必須項目をご確認ください。');
                form.querySelector('.error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }

            // Simulate success (replace with actual API call)
            const submitBtn = form.querySelector('[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = '送信中…';
            }

            setTimeout(() => {
                showFormMessage(form, 'success', 'お問い合わせを受け付けました。担当者より3営業日以内にご連絡いたします。');
                form.reset();
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = '送信する';
                }
            }, 1200);
        });

        // Remove error state on input
        form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('input', () => field.classList.remove('error'));
        });
    });

    function showFormMessage(form, type, message) {
        let msgEl = form.querySelector('.form-message');
        if (!msgEl) {
            msgEl = document.createElement('div');
            msgEl.className = 'form-message';
            form.appendChild(msgEl);
        }
        msgEl.className = `form-message form-message--${type}`;
        msgEl.textContent = message;
        msgEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // -----------------------------------------------
    // 8. Slab form conditional field
    // -----------------------------------------------
    const usageSelect = document.querySelector('#slab-usage');
    const usageOther  = document.querySelector('#usage-other-group');
    if (usageSelect && usageOther) {
        usageSelect.addEventListener('change', () => {
            usageOther.hidden = usageSelect.value !== 'other';
        });
    }

});
