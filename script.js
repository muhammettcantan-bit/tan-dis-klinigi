/**
 * ==========================================================================
 * Antigravity Eğitim - Dinamik İstemci Mantığı (Client Logic)
 * Standart: ES6+, Strict Mode, High Performance & Clean Code Principles
 * ==========================================================================
 */

'use strict';

/**
 * DOM yüklendiğinde uygulama modüllerini başlatan ana giriş noktası.
 */
document.addEventListener('DOMContentLoaded', () => {
    initDynamicGreeting();
    initThemeSwitcher();
    initMobileNavigation();
    initScrollReveal();
    initAnimatedCounters();
    initFeatureCards();
    initActionButtons();
    initActiveNavHighlight();

    console.log('🚀 Antigravity Eğitim Modülü (v2.4 - Senior Grade) Başarıyla Yüklendi.');
});

/**
 * Kullanıcının yerel saatine göre dinamik karşılama mesajı oluşturan fonksiyon.
 */
function initDynamicGreeting() {
    const greetingTextElement = document.getElementById('greetingText');
    if (!greetingTextElement) return;

    const currentHour = new Date().getHours();
    let greetingMessage = '';

    if (currentHour >= 5 && currentHour < 12) {
        greetingMessage = 'Günaydın! Harika Bir Kodlama Günü ☀️';
    } else if (currentHour >= 12 && currentHour < 18) {
        greetingMessage = 'Tünaydın! Geliştirmeye Devam 🔥';
    } else {
        greetingMessage = 'İyi Akşamlar! Gece Kodcularına Selamlar 🌙';
    }

    greetingTextElement.textContent = greetingMessage;
}

/**
 * Otomatik sistem tercihi destekli ve erişilebilir Tema Yöneticisi.
 */
function initThemeSwitcher() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (!themeToggleBtn) return;

    const themeIcon = themeToggleBtn.querySelector('.theme-icon');
    
    // 1. Önceki tercih var mı, yoksa sistem teması tercihini kontrol et
    const storedTheme = localStorage.getItem('antigravity_theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');

    // Başlangıç temasını uygula
    applyTheme(currentTheme, false);

    // Sistem teması değişirse canlı tepki ver (kullanıcı elle seçmediyse)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('antigravity_theme')) {
            applyTheme(e.matches ? 'dark' : 'light', true);
        }
    });

    themeToggleBtn.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('antigravity_theme', currentTheme);
        applyTheme(currentTheme, true);
    });

    /**
     * Temayı HTML niteliğine, ikonuna ve ARIA durumuna yansıtan yardımcı fonksiyon.
     */
    function applyTheme(theme, notify = true) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            themeToggleBtn.setAttribute('aria-pressed', 'true');
            if (themeIcon) themeIcon.textContent = '☀️';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggleBtn.setAttribute('aria-pressed', 'false');
            if (themeIcon) themeIcon.textContent = '🌙';
        }

        if (notify) {
            showToast(
                `Tema Değiştirildi: ${theme === 'dark' ? 'Koyu Mod 🌙' : 'Açık Mod ☀️'}`,
                '🎨'
            );
        }
    }
}

/**
 * Mobil Hamburger Menü Kontrolü ve Klavye Erişilebilirliği (Escape ile kapatma)
 */
function initMobileNavigation() {
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const navWrapper = document.getElementById('navMenuWrapper');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!toggleBtn || !navWrapper) return;

    function toggleMenu(show) {
        const isOpen = show !== undefined ? show : !navWrapper.classList.contains('is-open');
        navWrapper.classList.toggle('is-open', isOpen);
        toggleBtn.classList.toggle('active', isOpen);
        toggleBtn.setAttribute('aria-expanded', isOpen.toString());

        if (isOpen) {
            const firstLink = navWrapper.querySelector('a, button');
            if (firstLink) firstLink.focus();
        }
    }

    toggleBtn.addEventListener('click', () => toggleMenu());

    // Menü bağlantılarına tıklandığında menüyü kapat
    navLinks.forEach((link) => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // Escape tuşuna basıldığında menüyü kapat
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navWrapper.classList.contains('is-open')) {
            toggleMenu(false);
            toggleBtn.focus();
        }
    });
}

/**
 * IntersectionObserver ile Ekrana Giren Elemanları Yumuşakça Belirginleştirme (Scroll Reveal)
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!revealElements.length) return;

    // Düşük hareket tercihi varsa doğrudan görünür kıl
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        revealElements.forEach(el => el.classList.add('is-visible'));
        return;
    }

    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target); // Tek seferlik animasyon
            }
        });
    }, observerOptions);

    revealElements.forEach((el) => observer.observe(el));
}

/**
 * requestAnimationFrame + IntersectionObserver Tabanlı Performanslı İstatistik Sayaç Animasyonu
 */
function initAnimatedCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach((stat) => observer.observe(stat));

    function animateCounter(element) {
        const targetValue = parseInt(element.getAttribute('data-target') || '0', 10);
        const duration = 1600; // 1.6 saniye
        const startTime = performance.now();

        function update(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            
            // EaseOutCubic Yumuşatma Efekti
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(easeProgress * targetValue);

            element.textContent = currentValue.toString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = targetValue.toString();
            }
        }

        requestAnimationFrame(update);
    }
}

/**
 * Özellik Kartları Etkileşimleri ve Klavye Desteği (Enter/Space ile tetikleme)
 */
function initFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');

    featureCards.forEach((card) => {
        const triggerAction = () => {
            const featureName = card.getAttribute('data-feature') || 'Özellik';
            showToast(`${featureName} modülü seçildi! Detaylar yükleniyor...`, '💎');
        };

        card.addEventListener('click', triggerAction);

        // Klavye ile gezinirken Enter ve Space erişilebilirliği
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                triggerAction();
            }
        });
    });
}

/**
 * Aksiyon Butonları (Keşfet ve Demo) İş Mantığı
 */
function initActionButtons() {
    const btnExplore = document.getElementById('btnExplore');
    const btnDemo = document.getElementById('btnDemo');

    if (btnExplore) {
        btnExplore.addEventListener('click', () => {
            const featuresSection = document.getElementById('features');
            if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth' });
                showToast('Özellikler bölümüne yönlendiriliyorsunuz.', '🚀');
            }
        });
    }

    if (btnDemo) {
        btnDemo.addEventListener('click', () => {
            showToast('İnteraktif Demo Modu Aktif Edildi!', '⚡');
        });
    }
}

/**
 * Sayfa Kaydırıldıkça Aktif Navigasyon Bağlantısını (Active State) Güncelleme
 */
function initActiveNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!sections.length || !navLinks.length) return;

    const observerOptions = {
        root: null,
        threshold: 0.4
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');
                navLinks.forEach((link) => {
                    const href = link.getAttribute('href');
                    if (href === `#${activeId}`) {
                        link.classList.add('active');
                        link.setAttribute('aria-current', 'page');
                    } else {
                        link.classList.remove('active');
                        link.removeAttribute('aria-current');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach((sec) => observer.observe(sec));
}

/**
 * Sağ alt köşede uçucu Toast Bildirimleri Oluşturan Modüler Fonksiyon.
 * @param {string} message - Bildirim metni
 * @param {string} icon - Emoji veya ikon karakteri
 */
function showToast(message, icon = 'ℹ️') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = `
        <span class="toast-icon" aria-hidden="true">${icon}</span>
        <span class="toast-message">${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    // 3.5 Saniye sonra bildirimi kaldır
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        toast.style.transition = 'all 0.35s ease';

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 350);
    }, 3500);
}

/**
 * Metinleri XSS zafiyetine karşı emniyete alan yardımcı fonksiyon.
 * @param {string} str 
 * @returns {string} Güvenli HTML string
 */
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}
