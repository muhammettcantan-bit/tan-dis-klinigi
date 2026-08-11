import React, { useEffect, useState, useRef } from 'react';

export const Stats: React.FC = () => {
    const [counts, setCounts] = useState({ stat1: 0, stat2: 0, stat3: 0 });
    const sectionRef = useRef<HTMLDivElement>(null);
    const animatedRef = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !animatedRef.current) {
                animatedRef.current = true;
                animateCounters();
            }
        }, { threshold: 0.3 });

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const animateCounters = () => {
        const duration = 1600;
        const startTime = performance.now();

        const targets = { stat1: 100, stat2: 15, stat3: 5 };

        function update(currentTime: number) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);

            setCounts({
                stat1: Math.floor(ease * targets.stat1),
                stat2: Math.floor(ease * targets.stat2),
                stat3: Math.floor(ease * targets.stat3)
            });

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                setCounts(targets);
            }
        }

        requestAnimationFrame(update);
    };

    return (
        <section id="stats" className="stats-section" ref={sectionRef} aria-label="TAN DİŞ KLİNİĞİ İstatistikleri">
            <div className="glass-card stats-container reveal-on-scroll is-visible">
                <div className="stat-item">
                    <span className="stat-number">{counts.stat1}</span><span className="stat-plus">%</span>
                    <span className="stat-label">Mutlu Hasta Memnuniyeti</span>
                </div>
                <div className="stat-divider" aria-hidden="true"></div>
                <div className="stat-item">
                    <span className="stat-number">{counts.stat2}</span><span className="stat-plus">+ Yıl</span>
                    <span className="stat-label">Klinik & Hekim Tecrübesi</span>
                </div>
                <div className="stat-divider" aria-hidden="true"></div>
                <div className="stat-item">
                    <span className="stat-number">{counts.stat3}</span><span className="stat-plus">★</span>
                    <span className="stat-label">Hijyen ve Kalite Puanı</span>
                </div>
            </div>
        </section>
    );
};
