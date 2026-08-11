import React from 'react';
import { Smile } from 'lucide-react';

interface FooterProps {
    onAdminClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
    return (
        <footer class="app-footer" id="about">
            <div class="footer-container">
                <div class="footer-info">
                    <a href="#hero" class="brand-logo" aria-label="TAN DİŞ KLİNİĞİ Ana Sayfa">
                        <Smile size={24} style={{ color: 'var(--accent-sky)' }} />
                        <span class="logo-text">TAN DİŞ <span class="logo-highlight">KLİNİĞİ</span></span>
                    </a>
                    <p class="footer-desc">Ağız ve Diş Sağlığı Merkezi | Dijital Gülüş Tasarımı, İmplant ve Şeffaf Plak Tedavileri.</p>
                </div>
                <div class="footer-copyright" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                    <p>&copy; 2026 TAN DİŞ KLİNİĞİ. Tüm hakları saklıdır.</p>
                    <button 
                        type="button" 
                        onClick={onAdminClick}
                        style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        🔐 Klinik Yönetim Girişi (/admin)
                    </button>
                </div>
            </div>
        </footer>
    );
};
