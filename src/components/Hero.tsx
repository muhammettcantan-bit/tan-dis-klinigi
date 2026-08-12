import React, { useEffect, useState } from 'react';
import { ArrowRight, CalendarCheck, Smile, Clock, PhoneCall, ShieldCheck, Sparkles, Award, Star } from 'lucide-react';

interface HeroProps {
    onExploreClick: () => void;
    onDemoClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onDemoClick }) => {
    const [greeting, setGreeting] = useState('TAN DİŞ KLİNİĞİ AİLESİNE HOŞ GELDİNİZ');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
            setGreeting('Günaydın! Sağlıklı Bir Gülüşle Güne Başlayın ☀️');
        } else if (hour >= 12 && hour < 18) {
            setGreeting('Tünaydın! Randevunuzu Kolayca Alın 🔥');
        } else {
            setGreeting('İyi Akşamlar! 7/24 Acil Ağız ve Diş Sağlığı 🌙');
        }
    }, []);

    return (
        <section id="hero" className="hero-section" aria-labelledby="hero-title-text">
            <div className="hero-container">
                {/* Sol Taraf: Metin ve Aksiyonlar */}
                <div className="hero-content reveal-on-scroll is-visible">
                    <div className="greeting-badge" aria-live="polite">
                        <span className="badge-dot" aria-hidden="true"></span>
                        <span>{greeting}</span>
                    </div>
                    
                    <h1 className="hero-title" id="hero-title-text">
                        Sağlıklı ve Estetik Gülüşler İçin <span className="gradient-text">TAN DİŞ KLİNİĞİ</span>
                    </h1>
                    
                    <p className="hero-description">
                        Uzman hekim kadromuz, 3D dijital gülüş tasarımı (Digital Smile Design), dikişsiz implant, zirkonyum lamine ve şeffaf plak tedavilerimiz ile doğal ve özgüvenli gülüşünüzü yeniden keşfedin.
                    </p>
                    
                    <div className="hero-buttons">
                        <button type="button" className="btn btn-primary btn-large" onClick={onExploreClick}>
                            <span>Tedavilerimizi Keşfet</span>
                            <ArrowRight size={18} className="btn-arrow" />
                        </button>
                        <button type="button" className="btn btn-outline btn-large" onClick={onDemoClick}>
                            <CalendarCheck size={18} />
                            <span>Hızlı Randevu Al</span>
                        </button>
                    </div>
                </div>

                {/* Sağ Taraf: Modern Klinik Kartı */}
                <div className="hero-visual reveal-on-scroll is-visible">
                    <div className="glass-card main-visual-card interactive-tilt" tabIndex={0} style={{ padding: '2rem' }}>
                        {/* Kart Üst Başlık */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-glass)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-sky)' }}>
                                    <Smile size={24} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>TAN DİŞ KLİNİĞİ</div>
                                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Ağız ve Diş Sağlığı Merkezi</div>
                                </div>
                            </div>

                            <span style={{
                                padding: '0.3rem 0.7rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700,
                                background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)',
                                display: 'flex', alignItems: 'center', gap: '0.4rem'
                            }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>
                                Hasta Kabulü Açık
                            </span>
                        </div>

                        {/* Çalışma Saatleri & İletişim Bilgileri */}
                        <div style={{ display: 'grid', gap: '0.9rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 1rem', background: 'var(--bg-glass-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                                <Clock size={18} style={{ color: 'var(--accent-sky)' }} />
                                <div style={{ fontSize: '0.85rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Çalışma Saatleri: </span>
                                    <b>Pzt - Cts: 09:00 - 20:00</b>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 1rem', background: 'var(--bg-glass-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                                <PhoneCall size={18} style={{ color: '#10b981' }} />
                                <div style={{ fontSize: '0.85rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Acil Diş Sağlığı: </span>
                                    <b>0553 733 91 98</b>
                                </div>
                            </div>
                        </div>

                        {/* Öne Çıkan Klinik Hizmetleri */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '1.5rem' }}>
                            <div style={{ padding: '0.9rem', background: 'var(--bg-glass-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.2rem', color: 'var(--accent-sky)' }}>
                                    <Sparkles size={14} /> Gülüş Tasarımı
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>3D Dijital Simülasyon</div>
                            </div>

                            <div style={{ padding: '0.9rem', background: 'var(--bg-glass-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.2rem', color: '#10b981' }}>
                                    <Award size={14} /> Ağrısız İmplant
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dikişsiz & Hızlı İyileşme</div>
                            </div>
                        </div>

                        {/* Kart Alt Mühür & Hasta Puanı */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-glass)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <ShieldCheck size={16} style={{ color: '#10b981' }} />
                                <span>Biyolojik Sterilizasyon</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b', fontWeight: 700 }}>
                                <Star size={14} fill="#f59e0b" />
                                <Star size={14} fill="#f59e0b" />
                                <Star size={14} fill="#f59e0b" />
                                <Star size={14} fill="#f59e0b" />
                                <Star size={14} fill="#f59e0b" />
                                <span style={{ color: 'var(--text-main)', marginLeft: '0.3rem' }}>4.9/5</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
