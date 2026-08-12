import React from 'react';
import { Smile } from 'lucide-react';

interface FooterProps {
    onAdminClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
    return (
        <footer className="app-footer" id="about">
            <div className="footer-container">
                <div className="footer-info">
                    <a href="#hero" className="brand-logo" aria-label="TAN DİŞ KLİNİĞİ Ana Sayfa">
                        <Smile size={24} style={{ color: 'var(--accent-sky)' }} />
                        <span className="logo-text">TAN DİŞ <span className="logo-highlight">KLİNİĞİ</span></span>
                    </a>
                    <p className="footer-desc">Ağız ve Diş Sağlığı Merkezi | Dijital Gülüş Tasarımı, İmplant ve Şeffaf Plak Tedavileri.</p>
                </div>
                <div className="footer-copyright" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                    <p>© 2026 TAN DİŞ KLİNİĞİ. Tüm hakları saklıdır.</p>
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
