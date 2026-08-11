import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Stats } from './components/Stats';
import { ContactSection } from './components/ContactSection';
import { AdminPanel } from './components/AdminPanel';
import { ToastContainer } from './components/Toast';
import { Footer } from './components/Footer';
import { ToastState } from './types';

export const App: React.FC = () => {
    // Route state: 'home' | 'admin'
    const [currentView, setCurrentView] = useState<'home' | 'admin'>('home');
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [toasts, setToasts] = useState<ToastState[]>([]);

    useEffect(() => {
        // Detect initial theme preference
        const savedTheme = localStorage.getItem('antigravity_theme') as 'dark' | 'light';
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
        setTheme(initialTheme);
        document.documentElement.setAttribute('data-theme', initialTheme);

        // Simple Hash Router check
        if (window.location.hash === '#admin') {
            setCurrentView('admin');
        }

        const handleHashChange = () => {
            if (window.location.hash === '#admin') {
                setCurrentView('admin');
            } else if (window.location.hash === '#home' || window.location.hash === '') {
                setCurrentView('home');
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('antigravity_theme', nextTheme);
        addToast(`Tema Değiştirildi: ${nextTheme === 'dark' ? 'Koyu Mod 🌙' : 'Açık Mod ☀️'}`, 'info');
    };

    const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info', icon?: string) => {
        const newToast: ToastState = { id: Date.now(), message, type, icon };
        setToasts(prev => [...prev, newToast]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== newToast.id));
        }, 3500);
    };

    const navigateTo = (view: 'home' | 'admin') => {
        setCurrentView(view);
        window.location.hash = view === 'admin' ? 'admin' : 'home';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="app-root">
            <a href="#main-content" className="skip-link">Ana içeriğe atla</a>

            {/* Background Blur Circles */}
            <div className="bg-blur-circle bg-blur-1" aria-hidden="true"></div>
            <div className="bg-blur-circle bg-blur-2" aria-hidden="true"></div>

            {/* Header */}
            <Header 
                theme={theme} 
                toggleTheme={toggleTheme} 
                currentView={currentView}
                navigateTo={navigateTo}
            />

            {/* Main Content */}
            <main id="main-content">
                {currentView === 'home' ? (
                    <>
                        <Hero 
                            onExploreClick={() => {
                                const el = document.getElementById('features');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }} 
                            onDemoClick={() => addToast('İnteraktif Demo Modu Aktif Edildi!', 'info', '⚡')} 
                        />
                        <Features 
                            onFeatureClick={(title) => addToast(`${title} modülü seçildi! Detaylar yükleniyor...`, 'info', '💎')} 
                        />
                        <Stats />
                        <ContactSection 
                            onSuccess={(msg) => addToast(msg, 'success', '🚀')}
                            onError={(msg) => addToast(msg, 'error', '⚠️')}
                        />
                    </>
                ) : (
                    <AdminPanel 
                        onSuccess={(msg) => addToast(msg, 'success', '🔐')}
                        onError={(msg) => addToast(msg, 'error', '⚠️')}
                    />
                )}
            </main>

            {/* Toast Container */}
            <ToastContainer toasts={toasts} />

            {/* Footer */}
            <Footer onAdminClick={() => navigateTo('admin')} />
        </div>
    );
};
