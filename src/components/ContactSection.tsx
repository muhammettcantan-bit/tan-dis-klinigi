import React, { useState } from 'react';
import { Send, User, Mail, Phone, MessageSquare, Tag, CheckCircle2, Paperclip, ShieldCheck, FileText, X, Smile } from 'lucide-react';
import { submitContactForm } from '../services/api';

interface ContactSectionProps {
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onSuccess, onError }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [file, setFile] = useState<File | null>(null);
    const [recaptchaChecked, setRecaptchaChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/vnd.ms-excel',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'image/png',
                'image/jpeg',
                'image/jpg'
            ];

            if (!allowedTypes.includes(selectedFile.type) && !selectedFile.name.match(/\.(pdf|doc|docx|xls|xlsx|png|jpg|jpeg)$/i)) {
                onError('Geçersiz dosya biçimi! Yalnızca Röntgen, PDF veya Resim (PNG/JPG) yükleyebilirsiniz.');
                setFile(null);
                return;
            }

            if (selectedFile.size > 10 * 1024 * 1024) {
                onError('Dosya boyutu 10MB sınırını aşamaz.');
                setFile(null);
                return;
            }

            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
            onError('Lütfen randevu ve iletişim için tüm zorunlu alanları doldurunuz.');
            return;
        }

        if (!recaptchaChecked) {
            onError('Lütfen reCAPTCHA güvenlik doğrulamasını tamamlayınız.');
            return;
        }

        setLoading(true);

        const dataToSend = new FormData();
        dataToSend.append('name', formData.name);
        dataToSend.append('email', formData.email);
        dataToSend.append('phone', formData.phone);
        dataToSend.append('subject', formData.subject);
        dataToSend.append('message', formData.message);
        dataToSend.append('recaptchaToken', 'valid_token');
        if (file) {
            dataToSend.append('attachment', file);
        }

        try {
            const res = await submitContactForm(dataToSend);
            if (res.success) {
                onSuccess('Randevu talebiniz ve röntgen eklentiniz TAN DİŞ KLİNİĞİ sistemine iletildi!');
                setSubmitted(true);
                setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                setFile(null);
                setRecaptchaChecked(false);
            } else {
                onError(res.message || 'Randevu talebi iletilemedi.');
            }
        } catch (err: any) {
            onError(err.message || 'Bağlantı hatası oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="contact" class="features-section" style={{ paddingTop: '2rem' }}>
            <div class="section-header reveal-on-scroll is-visible">
                <span class="section-tag">Online İletişim & Danışma</span>
                <h2 class="section-title">Randevu & İletişim Formu</h2>
                <p class="section-subtitle">Ağız ve diş sağlığı şikayetlerinizi, muayene talebinizi veya panoramik röntgeninizi hemen iletebilirsiniz.</p>
            </div>

            <div style={{ maxWidth: '820px', margin: '0 auto' }}>
                <div class="glass-card" style={{ padding: '2.5rem' }}>
                    {submitted ? (
                        <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
                            <CheckCircle2 size={64} style={{ margin: '0 auto 1rem auto', color: '#10b981' }} />
                            <h3 style={{ fontSize: '1.6rem', marginBottom: '0.8rem' }}>Randevu Talebiniz Alındı!</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                Klinik hasta koordinatörümüz mesajınızı ve dosyanızı inceleyerek en kısa sürede telefon/WhatsApp üzerinden sizinle iletişime geçecektir.
                            </p>
                            <button 
                                type="button" 
                                class="btn btn-primary"
                                onClick={() => setSubmitted(false)}
                            >
                                Yeni Randevu Talebi Oluştur
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.4rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.4rem' }}>
                                {/* Ad Soyad */}
                                <div>
                                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                        Adınız ve Soyadınız <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input 
                                            type="text" 
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Ahmet Yılmaz"
                                            required
                                            style={{
                                                width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.6rem',
                                                background: 'var(--bg-glass-card)', border: '1px solid var(--border-glass)',
                                                borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.95rem'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* E-posta */}
                                <div>
                                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                        E-posta Adresiniz <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input 
                                            type="email" 
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="ahmet@example.com"
                                            required
                                            style={{
                                                width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.6rem',
                                                background: 'var(--bg-glass-card)', border: '1px solid var(--border-glass)',
                                                borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.95rem'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.4rem' }}>
                                {/* Telefon */}
                                <div>
                                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                        Telefon Numarası <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <Phone size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <input 
                                            type="tel" 
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="0555 123 45 67"
                                            required
                                            style={{
                                                width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.6rem',
                                                background: 'var(--bg-glass-card)', border: '1px solid var(--border-glass)',
                                                borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.95rem'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Konu / Tedaviniz */}
                                <div>
                                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                        Randevu Konusu / Tedavi Türü <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <Tag size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            style={{
                                                width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.6rem',
                                                background: 'var(--bg-glass-card)', border: '1px solid var(--border-glass)',
                                                borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.95rem'
                                            }}
                                        >
                                            <option value="" disabled style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>Randevu / Tedavi Seçiniz</option>
                                            <option value="Estetik Gülüş Tasarımı" style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>Estetik Gülüş Tasarımı</option>
                                            <option value="İmplant Tedavisi" style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>İmplant Tedavisi</option>
                                            <option value="Zirkonyum & Porselen Lamine" style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>Zirkonyum & Porselen Lamine</option>
                                            <option value="Diş Beyazlatma (Bleaching)" style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>Diş Beyazlatma (Bleaching)</option>
                                            <option value="Şeffaf Plak & Ortodonti" style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>Şeffaf Plak & Ortodonti</option>
                                            <option value="Genel Muayene & Temizlik" style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>Genel Muayene & Temizlik</option>
                                            <option value="Acil Diş Ağrısı Müdahalesi" style={{ background: 'var(--bg-secondary)', color: 'var(--text-main)' }}>Acil Diş Ağrısı Müdahalesi</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Mesaj */}
                            <div>
                                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                    Şikayetiniz veya Notunuz <span style={{ color: '#ef4444' }}>*</span>
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <MessageSquare size={18} style={{ position: 'absolute', left: '12px', top: '16px', color: 'var(--text-muted)' }} />
                                    <textarea 
                                        name="message"
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Diş şikayetinizi, tercih ettiğiniz muayene saatini veya sorularınızı yazabilirsiniz..."
                                        required
                                        style={{
                                            width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.6rem',
                                            background: 'var(--bg-glass-card)', border: '1px solid var(--border-glass)',
                                            borderRadius: 'var(--radius-sm)', color: 'var(--text-main)',
                                            fontSize: '0.95rem', resize: 'vertical', fontFamily: 'inherit'
                                        }}
                                    ></textarea>
                                </div>
                            </div>

                            {/* Röntgen / Dosya Yükleme */}
                            <div>
                                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                    Röntgen veya Dosya Ekleyin (Panoramik Röntgen, PDF, Görsel)
                                </label>
                                <div style={{
                                    border: '2px dashed var(--border-glass)', borderRadius: 'var(--radius-md)',
                                    padding: '1.2rem', textAlign: 'center', background: 'var(--bg-glass-card)',
                                    position: 'relative', cursor: 'pointer'
                                }}>
                                    {file ? (
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
                                            <FileText size={24} style={{ color: 'var(--accent-sky)' }} />
                                            <div style={{ textAlign: 'left' }}>
                                                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{file.name}</div>
                                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                                </div>
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => setFile(null)}
                                                style={{ marginLeft: '1rem', color: '#ef4444' }}
                                                title="Dosyayı Kaldır"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Paperclip size={28} style={{ color: 'var(--text-muted)', marginBottom: '0.4rem' }} />
                                            <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Röntgen dosyanızı veya belgenizi ekleyin</div>
                                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                                Panoramik röntgen, diş fotoğrafı veya PDF belgesi (Maks. 10MB)
                                            </div>
                                            <input 
                                                type="file" 
                                                onChange={handleFileChange}
                                                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                                                style={{
                                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                                    opacity: 0, cursor: 'pointer'
                                                }}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Google reCAPTCHA */}
                            <div style={{
                                background: 'var(--bg-glass-card)', border: '1px solid var(--border-glass)',
                                borderRadius: 'var(--radius-md)', padding: '1rem 1.2rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'
                            }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer', userSelect: 'none' }}>
                                    <input 
                                        type="checkbox" 
                                        checked={recaptchaChecked}
                                        onChange={(e) => setRecaptchaChecked(e.target.checked)}
                                        style={{ width: '22px', height: '22px', accentColor: 'var(--accent-sky)', cursor: 'pointer' }}
                                    />
                                    <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>Ben robot değilim</span>
                                </label>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                    <ShieldCheck size={20} style={{ color: '#10b981' }} />
                                    <span>Google reCAPTCHA v3 Güvenliği</span>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                class="btn btn-primary btn-large"
                                disabled={loading}
                                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
                            >
                                {loading ? 'Talebiniz İletiliyor...' : 'Randevu Talebini Gönder'}
                                <Send size={18} />
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};
