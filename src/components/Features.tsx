import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, HeartPulse, Award, Flame, Smile, X, ArrowRight, CheckCircle2, Calendar } from 'lucide-react';

interface FeaturesProps {
    onFeatureClick?: (title: string) => void;
}

interface TreatmentDetail {
    icon: React.ReactNode;
    wrapperClass: string;
    title: string;
    desc: string;
    fullDesc: string;
    benefits: string[];
    duration: string;
}

export const Features: React.FC<FeaturesProps> = ({ onFeatureClick }) => {
    const [activeModal, setActiveModal] = useState<TreatmentDetail | null>(null);

    // Escape tuşu ile modalı kapatma
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setActiveModal(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const treatmentsList: TreatmentDetail[] = [
        {
            icon: <Sparkles size={32} className="text-sky-400" />,
            wrapperClass: 'blue',
            title: 'Estetik Gülüş Tasarımı',
            desc: 'Dijital planlama (Digital Smile Design) ile yüz tipinize ve karakterinize özel en doğal gülüş estetiği.',
            fullDesc: 'Dijital Gülüş Tasarımı (Digital Smile Design), yüz hatlarınız, dudak yapınız ve karakterinizle %100 uyumlu kişiye özel estetik görünüm elde etmeyi sağlar. 3D ağız içi tarayıcılarımız ile tedavi başlamadan önce yeni gülüşünüzü bilgisayar ekranında canlı olarak simüle ediyor ve aynadaki yeni görünümünüzü önceden onaylamanıza olanak tanıyoruz.',
            benefits: [
                'Doğal ve yüz tipinizle %100 uyumlu gülüş',
                '3D simülasyon ile sonucu önceden görme imkanı',
                'Lekelenmeyen ve sararmayan premium malzeme dokusu',
                'Minimum diş aşındırması ile maksimum koruma'
            ],
            duration: '2 - 3 Seans (Yaklaşık 5-7 gün)'
        },
        {
            icon: <Smile size={32} className="text-cyan-400" />,
            wrapperClass: 'purple',
            title: 'Ağrısız Dijital İmplant Tedavisi',
            desc: 'Son teknoloji 3D çene tomografisi ve bilgisayar destekli kılavuzlar ile dikişsiz ve acısız implant uygulamaları.',
            fullDesc: 'Dijital implant tedavisinde, 3D çene tomografiniz bilgisayar ortamında analiz edilir. Dikişsiz kılavuz cerrahi (Flapless Implantology) sayesinde diş eti kesilmeden, minimal müdahale ile implantınız aynı gün yerleştirilir. Ağrı, morarma ve şişlik hissi geleneksel yöntemlere göre yok denecek kadar azdır.',
            benefits: [
                'Dikişsiz, neştersiz ve ağrısız cerrahi uygulama',
                'Bilgisayar rehberliğinde milimetrik titanyum yerleşimi',
                'Şişlik ve morarma olmadan hızlı iyileşme süreci',
                'Ömür boyu kullanım garantili saf titanyum implantlar'
            ],
            duration: 'Aynı Gün Cerrahi İşlem + 2 Ay Kemik Kaynaşması'
        },
        {
            icon: <Award size={32} className="text-emerald-400" />,
            wrapperClass: 'green',
            title: 'Zirkonyum & Porselen Lamine',
            desc: 'Yüksek ışık geçirgenliğine sahip, sararmayan ve diş etinizle kusursuz uyum sağlayan zirkonyum kaplamalar.',
            fullDesc: 'Zirkonyum altyapılı kaplamalar, doğal diş dokusunun ışık geçirgenliğini %100 taklit eder. Metal altyapı içermediği için diş eti kenarlarında morarma veya koyu renkli çizgi yapmaz, alerjik reaksiyon göstermez ve yıllar boyu doğal parlaklığını korur.',
            benefits: [
                'Diş eti kenarlarında morarma ve renk değişimi yapmaz',
                'Yüksek kırılma direnci ve uzun ömürlü biyouyum',
                'Sıcak-soğuk hassasiyeti oluşturmayan iletkenlik',
                'Işık geçirgenliği sayesinde %100 doğal görünüm'
            ],
            duration: '2 Seans (Yaklaşık 4-6 gün)'
        },
        {
            icon: <Flame size={32} className="text-sky-400" />,
            wrapperClass: 'blue',
            title: 'Lazerle Diş Beyazlatma (Bleaching)',
            desc: 'Klinik ortamında sadece 45 dakikada 3-4 tona kadar kalıcı, hassasiyetsiz lazer diş beyazlatma.',
            fullDesc: 'Klinik ortamında uygulanan lazer destekli diş beyazlatma (Office Bleaching), sigara, çay ve kahve lekelerini diş minesine hiçbir zarar vermeden yok eder. Özel diş eti koruyucu jeller ve soğuk lazer ışığı kullanılarak sıfır hassasiyetle tek seansta anında beyazlık sağlanır.',
            benefits: [
                'Sadece 45 dakikada 3-4 tona kadar kalıcı beyazlık',
                'Özel lazer koruması sayesinde diş minesine %100 zararsız',
                'Diş eti koruyucu izolasyon ile sıfır hassasiyet',
                'Uzun süreli parlaklık ve hijyenik görünüm'
            ],
            duration: 'Tek Seans (45 Dakika)'
        },
        {
            icon: <HeartPulse size={32} className="text-cyan-400" />,
            wrapperClass: 'purple',
            title: 'Şeffaf Plak & Ortodonti (Invisalign)',
            desc: 'Telsiz ve görünmeyen şeffaf plaklar ile günlük yaşamınızı etkilemeden çapraşık dişlerin düzeltilmesi.',
            fullDesc: 'Tel takmadan, dışarıdan kimsenin fark edemeyeceği kişiye özel 3D üretilen şeffaf plaklar (Invisalign) ile diş çapraşıklıklarınızı düzeltiyoruz. Yemek yerken veya fırçalarken plaklarınızı kolayca çıkarabilir, sosyal ve iş hayatınıza ara vermeden tedavinizi konforla sürdürebilirsiniz.',
            benefits: [
                'Dışarıdan tamamen görünmez, estetik plak yapısı',
                'Yemek yerken çıkarılabilen maksimum kullanım rahatlığı',
                'Tel batması, yara veya acı riski olmayan pürüzsüz doku',
                'Önceden bilinen tedavi süresi ve simülasyonu'
            ],
            duration: '6 - 14 Ay (Kişiye Özel Değişken)'
        },
        {
            icon: <ShieldCheck size={32} className="text-emerald-400" />,
            wrapperClass: 'green',
            title: '7/24 Acil Diş Sağlığı & Sterilizasyon',
            desc: 'Biyolojik sterilizasyon standartları, panoramik röntgen teşhisi ve acil diş ağrısı müdahaleleri.',
            fullDesc: 'Şiddetli diş ağrısı, kırılan diş, düşen dolgu veya implant sorunları gibi acil klinik durumlarında uzman ekibimiz anında müdahaleye hazırdır. Biyolojik otoklav sterilizasyon standartlarımız ile hastalarımıza %100 enfeksiyonsuz, hijyenik ve güvenli tedavi ortamı sunulmaktadır.',
            benefits: [
                'Anında acı ve diş ağrısı dindirici uzman müdahale',
                'Panoramik dijital röntgen ile anında doğru teşhis',
                'Biyolojik otoklav sterilizasyon mührü',
                '7/24 Kesintisiz acil danışma hattı'
            ],
            duration: 'Anında Müdahale (30 - 60 Dakika)'
        }
    ];

    const handleCardClick = (item: TreatmentDetail) => {
        setActiveModal(item);
        if (onFeatureClick) onFeatureClick(item.title);
    };

    const handleBookAppointment = (treatmentTitle: string) => {
        setActiveModal(null);
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
            // Select dropdown option if present
            setTimeout(() => {
                const subjectSelect = document.querySelector('select[name="subject"]') as HTMLSelectElement;
                if (subjectSelect) {
                    for (let i = 0; i < subjectSelect.options.length; i++) {
                        if (subjectSelect.options[i].value.toLowerCase().includes(treatmentTitle.toLowerCase().slice(0, 8))) {
                            subjectSelect.selectedIndex = i;
                            break;
                        }
                    }
                }
            }, 300);
        }
    };

    return (
        <section id="features" className="features-section" aria-labelledby="features-title">
            <div className="section-header reveal-on-scroll is-visible">
                <span className="section-tag">Uzmanlık Alanlarımız</span>
                <h2 className="section-title" id="features-title">Tedavilerimiz & Klinik Hizmetlerimiz</h2>
                <p className="section-subtitle">Detaylı bilgi almak için dilediğiniz tedavi kartına tıklayabilirsiniz.</p>
            </div>

            {/* Kart Izgarası */}
            <div className="features-grid">
                {treatmentsList.map((item, index) => (
                    <article 
                        key={index}
                        className="glass-card feature-card reveal-on-scroll is-visible"
                        onClick={() => handleCardClick(item)}
                        tabIndex={0}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(item); }}
                        style={{ position: 'relative', cursor: 'pointer' }}
                    >
                        <div className={`feature-icon-wrapper ${item.wrapperClass}`} aria-hidden="true">
                            {item.icon}
                        </div>
                        <h3 className="feature-title">{item.title}</h3>
                        <p className="feature-desc">{item.desc}</p>
                        <span className="card-action-text">
                            Büyüt & Detaylı İncele <span className="action-arrow" aria-hidden="true">→</span>
                        </span>
                    </article>
                ))}
            </div>

            {/* Büyütülmüş Odak Modalı (Backdrop Blur ile Rahat Okuma) */}
            {activeModal && (
                <div 
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(5, 10, 20, 0.82)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        zIndex: 3000,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '1.5rem',
                        animation: 'fadeIn 0.25s ease-out forwards'
                    }}
                    onClick={() => setActiveModal(null)}
                >
                    <div 
                        className="glass-card"
                        style={{
                            maxWidth: '720px', width: '100%',
                            padding: '2.5rem', position: 'relative',
                            maxHeight: '90vh', overflowY: 'auto',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-glass-hover)',
                            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(14, 165, 233, 0.2)',
                            borderRadius: 'var(--radius-lg)'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Kapat Butonu */}
                        <button 
                            type="button" 
                            onClick={() => setActiveModal(null)}
                            style={{
                                position: 'absolute', top: '1.2rem', right: '1.2rem',
                                width: '40px', height: '40px', borderRadius: '50%',
                                background: 'var(--bg-glass-card)', border: '1px solid var(--border-glass)',
                                color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', transition: 'all 0.2s ease'
                            }}
                            aria-label="Kapat"
                        >
                            <X size={22} />
                        </button>

                        {/* Modal Başlık Alanı */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '1.8rem', paddingBottom: '1.2rem', borderBottom: '1px solid var(--border-glass)' }}>
                            <div className={`feature-icon-wrapper ${activeModal.wrapperClass}`} style={{ width: '64px', height: '64px', margin: 0 }}>
                                {activeModal.icon}
                            </div>
                            <div>
                                <span style={{ textTransform: 'uppercase', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--accent-sky)' }}>
                                    Klinik Tedavi Detayı
                                </span>
                                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.2rem' }}>{activeModal.title}</h3>
                            </div>
                        </div>

                        {/* Detaylı Açıklama Metni (Büyük ve Rahat Okunabilir) */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent-sky)', marginBottom: '0.6rem' }}>
                                Tedavi Hakkında:
                            </h4>
                            <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--text-main)', background: 'var(--bg-glass-card)', padding: '1.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                                {activeModal.fullDesc}
                            </p>
                        </div>

                        {/* Avantajlar Listesi */}
                        <div style={{ marginBottom: '2rem' }}>
                            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#10b981', marginBottom: '0.8rem' }}>
                                Öne Çıkan Hastaya Özel Avantajlar:
                            </h4>
                            <div style={{ display: 'grid', gap: '0.75rem' }}>
                                {activeModal.benefits.map((b, idx) => (
                                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.98rem' }}>
                                        <CheckCircle2 size={20} style={{ color: '#10b981', flexShrink: 0 }} />
                                        <span>{b}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tedavi Süresi ve Aksiyon */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-glass)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                <Calendar size={18} style={{ color: 'var(--accent-sky)' }} />
                                <span><b>Tahmini Süre:</b> {activeModal.duration}</span>
                            </div>

                            <button 
                                type="button" 
                                className="btn btn-primary btn-large"
                                onClick={() => handleBookAppointment(activeModal.title)}
                                style={{ borderRadius: 'var(--radius-md)' }}
                            >
                                <span>Bu Tedavi İçin Randevu Al</span>
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};
