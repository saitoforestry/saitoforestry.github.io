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
            hamburger.setAttribute('aria-expanded', String(isOpen));
            hamburger.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close on link click
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('open');
                hamburger.setAttribute('aria-expanded', 'false');
                hamburger.setAttribute('aria-label', 'メニューを開く');
                document.body.style.overflow = '';
            });
        });
    }

    // -----------------------------------------------
    // 3. Scroll animations (fade-up)
    // -----------------------------------------------
    const animEls = document.querySelectorAll('.fade-up, .fade-in, .reveal');
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
            if (!el.classList.contains('reveal')) {
                el.style.transitionDelay = (i % 4 * 0.1) + 's';
            }
            observer.observe(el);
        });
    }

    // -----------------------------------------------
    // 3b. Respect reduced-motion preference for video
    // -----------------------------------------------
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncVideoMotion = () => {
        document.querySelectorAll('video[autoplay]').forEach(video => {
            if (reducedMotion.matches) {
                video.pause();
            } else {
                video.play().catch(() => {});
            }
        });
    };
    syncVideoMotion();
    reducedMotion.addEventListener?.('change', syncVideoMotion);

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
                openItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
                openItem.querySelector('.faq-answer').style.maxHeight = '0';
            });

            // Open clicked (if was closed)
            if (!isOpen) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
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

            if (form.dataset.submitMode === 'external') {
                form.submit();
                return;
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

    if (new URLSearchParams(window.location.search).get('sent') === '1') {
        const completedForm = document.querySelector('form[data-validate]');
        if (completedForm) {
            showFormMessage(completedForm, 'success', '送信が完了しました。お問い合わせいただきありがとうございます。');
        }
    }

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

    // -----------------------------------------------
    // 9. Gallery random layout (new order and scale on each visit)
    // -----------------------------------------------
    const galleryGrid = document.querySelector('.page-gallery .gallery-grid');
    if (galleryGrid) {
        const galleryItems = Array.from(galleryGrid.querySelectorAll('.gallery-item'));
        const layoutSizes = ['small', 'medium', 'wide', 'tall', 'feature'];

        for (let i = galleryItems.length - 1; i > 0; i -= 1) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [galleryItems[i], galleryItems[randomIndex]] = [galleryItems[randomIndex], galleryItems[i]];
        }

        galleryItems.forEach((item, index) => {
            const sizeOffset = Math.floor(Math.random() * layoutSizes.length);
            item.dataset.gallerySize = layoutSizes[(index + sizeOffset) % layoutSizes.length];
            item.style.setProperty('--float-duration', `${(5.4 + Math.random() * 3.2).toFixed(2)}s`);
            item.style.setProperty('--float-delay', `${(-Math.random() * 5).toFixed(2)}s`);
            galleryGrid.appendChild(item);
        });
    }

    // -----------------------------------------------
    // 10. Image lightbox (gallery and rack reference)
    // -----------------------------------------------
    const zoomTargets = document.querySelectorAll('.page-gallery .gallery-item, img[data-lightbox]');
    if (zoomTargets.length) {
        const lightbox = document.createElement('div');
        lightbox.className = 'image-lightbox';
        lightbox.hidden = true;
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('aria-label', '画像拡大表示');
        lightbox.innerHTML = `
            <button class="image-lightbox__close" type="button" aria-label="拡大表示を閉じる">×</button>
            <figure class="image-lightbox__figure">
                <img class="image-lightbox__image" src="" alt="">
                <figcaption class="image-lightbox__caption"></figcaption>
            </figure>`;
        document.body.appendChild(lightbox);

        const lightboxImage = lightbox.querySelector('.image-lightbox__image');
        const lightboxCaption = lightbox.querySelector('.image-lightbox__caption');
        const closeButton = lightbox.querySelector('.image-lightbox__close');
        let lastTrigger = null;

        const closeLightbox = () => {
            if (lightbox.hidden) return;
            lightbox.classList.remove('is-open');
            document.body.classList.remove('lightbox-open');
            window.setTimeout(() => {
                lightbox.hidden = true;
                lightboxImage.removeAttribute('src');
            }, 240);
            lastTrigger?.focus();
        };

        const openLightbox = (target) => {
            const image = target.matches('img') ? target : target.querySelector('img');
            if (!image) return;
            const caption = target.closest('.gallery-item')?.querySelector('.gallery-item__caption')?.textContent
                || target.closest('figure')?.querySelector('figcaption')?.textContent
                || image.alt;
            lastTrigger = target;
            lightboxImage.src = image.currentSrc || image.src;
            lightboxImage.alt = image.alt;
            lightboxCaption.textContent = caption.trim();
            lightbox.hidden = false;
            document.body.classList.add('lightbox-open');
            window.requestAnimationFrame(() => lightbox.classList.add('is-open'));
            closeButton.focus();
        };

        zoomTargets.forEach(target => {
            target.classList.add('is-zoomable');
            target.setAttribute('tabindex', '0');
            target.setAttribute('role', 'button');
            target.setAttribute('aria-label', `${target.querySelector?.('img')?.alt || target.alt || '画像'}を拡大表示`);
            target.addEventListener('click', () => openLightbox(target));
            target.addEventListener('keydown', event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openLightbox(target);
                }
            });
        });

        closeButton.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', event => {
            if (event.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') closeLightbox();
        });
    }

});
