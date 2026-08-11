import React, { useState } from 'react';
import { Moon, Sun, Menu, X, ShieldCheck, Smile } from 'lucide-react';

interface HeaderProps {
    theme: 'dark' | 'light';
    toggleTheme: () => void;
    currentView: 'home' | 'admin';
    navigateTo: (view: 'home' | 'admin') => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, currentView, navigateTo }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleNavClick = (sectionId: string) => {
        setMobileMenuOpen(false);
        if (currentView !== 'home') {
            navigateTo('home');
            setTimeout(() => {
                const el = document.getElementById(sectionId);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header class="app-header">
            <nav class="nav-container" aria-label="TAN DİŞ KLİNİĞİ Ana Gezinme">
                <a 
                    href="#hero" 
                    class="brand-logo" 
                    onClick={(e) => { e.preventDefault(); handleNavClick('hero'); }}
                    aria-label="TAN DİŞ KLİNİĞİ Ana Sayfa"
                >
                    <Smile class="logo-icon" style={{ color: 'var(--accent-sky)' }} size={28} />
                    <span class="logo-text">TAN DİŞ <span class="logo-highlight">KLİNİĞİ</span></span>
                </a>

                {/* Mobil Menü Butonu */}
                <button 
                    type="button" 
                    class={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-expanded={mobileMenuOpen}
                    aria-label="Navigasyon Menüsünü Aç/Kapat"
                >
                    {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
                
                {/* Navigasyon Bağlantıları & Butonlar */}
                <div class={`nav-menu-wrapper ${mobileMenuOpen ? 'is-open' : ''}`}>
                    <ul class="nav-links">
                        <li>
                            <a 
                                href="#hero" 
                                class={`nav-link ${currentView === 'home' ? 'active' : ''}`}
                                onClick={(e) => { e.preventDefault(); handleNavClick('hero'); }}
                            >
                                Ana Sayfa
                            </a>
                        </li>
                        <li>
                            <a 
                                href="#features" 
                                class="nav-link"
                                onClick={(e) => { e.preventDefault(); handleNavClick('features'); }}
                            >
                                Tedavilerimiz
                            </a>
                        </li>
                        <li>
                            <a 
                                href="#stats" 
                                class="nav-link"
                                onClick={(e) => { e.preventDefault(); handleNavClick('stats'); }}
                            >
                                İstatistikler
                            </a>
                        </li>
                        <li>
                            <a 
                                href="#contact" 
                                class="nav-link"
                                onClick={(e) => { e.preventDefault(); handleNavClick('contact'); }}
                            >
                                Randevu & İletişim
                            </a>
                        </li>
                    </ul>

                    <div class="nav-actions">
                        <button 
                            type="button" 
                            class="btn btn-icon" 
                            onClick={toggleTheme}
                            aria-label="Aydınlık/Karanlık Temayı Değiştir"
                            aria-pressed={theme === 'light'}
                        >
                            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        <button 
                            type="button" 
                            class={`btn ${currentView === 'admin' ? 'btn-primary' : 'btn-outline'}`}
                            onClick={() => { setMobileMenuOpen(false); navigateTo(currentView === 'admin' ? 'home' : 'admin'); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                            <ShieldCheck size={16} />
                            <span>{currentView === 'admin' ? 'Klinik Ana Sayfa' : 'Yönetim Paneli'}</span>
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
};
