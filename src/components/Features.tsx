import React from 'react';
import { Sparkles, ShieldCheck, HeartPulse, Award, Flame, Smile } from 'lucide-react';

interface FeaturesProps {
    onFeatureClick: (title: string) => void;
}

export const Features: React.FC<FeaturesProps> = ({ onFeatureClick }) => {
    const treatmentsList = [
        {
            icon: <Sparkles size={28} className="text-sky-400" />,
            wrapperClass: 'blue',
            title: 'Estetik Gülüş Tasarımı',
            desc: 'Dijital planlama (Digital Smile Design) ile yüz tipinize ve karakterinize özel en doğal gülüş estetiği.'
        },
        {
            icon: <Smile size={28} className="text-cyan-400" />,
            wrapperClass: 'purple',
            title: 'Ağrısız İmplant Tedavisi',
            desc: 'Son teknoloji 3D çene tomografisi ve bilgisayar destekli kılavuzlar ile dikişsiz ve acısız implant uygulamaları.'
        },
        {
            icon: <Award size={28} className="text-emerald-400" />,
            wrapperClass: 'green',
            title: 'Zirkonyum & Porselen Lamine',
            desc: 'Yüksek ışık geçirgenliğine sahip, sararmayan ve diş etinizle kusursuz uyum sağlayan zirkonyum kaplamalar.'
        },
        {
            icon: <Flame size={28} className="text-sky-400" />,
            wrapperClass: 'blue',
            title: 'Lazerle Diş Beyazlatma',
            desc: 'Klinik ortamında sadece 45 dakikada 3-4 tona kadar kalıcı, hassasiyetsiz lazer diş beyazlatma (Bleaching).'
        },
        {
            icon: <HeartPulse size={28} className="text-cyan-400" />,
            wrapperClass: 'purple',
            title: 'Şeffaf Plak & Ortodonti',
            desc: 'Telsiz ve görünmeyen şeffaf plaklar (Invisalign) ile günlük yaşamınızı etkilemeden çapraşık dişlerin düzeltilmesi.'
        },
        {
            icon: <ShieldCheck size={28} className="text-emerald-400" />,
            wrapperClass: 'green',
            title: '7/24 Acil Diş Sağlığı & Sterilizasyon',
            desc: 'Biyolojik sterilizasyon standartları, panoramik röntgen teşhisi ve acil diş ağrısı müdahaleleri.'
        }
    ];

    return (
        <section id="features" className="features-section" aria-labelledby="features-title">
            <div className="section-header reveal-on-scroll is-visible">
                <span className="section-tag">Uzmanlık Alanlarımız</span>
                <h2 className="section-title" id="features-title">Tedavilerimiz & Klinik Hizmetlerimiz</h2>
                <p className="section-subtitle">Ağız ve diş sağlığınız için en son teknoloji ve hijyenik klinik ortamı.</p>
            </div>

            <div className="features-grid">
                {treatmentsList.map((item, index) => (
                    <article 
                        key={index}
                        className="glass-card feature-card reveal-on-scroll is-visible"
                        onClick={() => onFeatureClick(item.title)}
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onFeatureClick(item.title); }}
                    >
                        <div className={`feature-icon-wrapper ${item.wrapperClass}`} aria-hidden="true">
                            {item.icon}
                        </div>
                        <h3 className="feature-title">{item.title}</h3>
                        <p className="feature-desc">{item.desc}</p>
                        <span className="card-action-text">
                            Detaylı Bilgi & Randevu <span className="action-arrow" aria-hidden="true">→</span>
                        </span>
                    </article>
                ))}
            </div>
        </section>
    );
};
