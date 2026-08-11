import React, { useState, useEffect } from 'react';
import { 
    ShieldCheck, Lock, Search, Filter, Calendar, Eye, Trash2, 
    CheckCircle, Clock, X, LogOut, Mail, Phone, User, MessageSquare, 
    Reply, Send, Paperclip, Download, Inbox, AlertCircle, Smile 
} from 'lucide-react';
import { 
    adminLogin, fetchAdminMessages, fetchAdminStats, 
    toggleMessageReadStatus, deleteAdminMessage, sendAdminReply 
} from '../services/api';
import { ContactMessage, AdminStats } from '../types';

interface AdminPanelProps {
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onSuccess, onError }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('antigravity_admin_token'));
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    const [stats, setStats] = useState<AdminStats>({ total: 0, unread: 0, today: 0, thisMonth: 0 });
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(false);

    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [replyingMessage, setReplyingMessage] = useState<ContactMessage | null>(null);
    const [replyText, setReplyText] = useState('');
    const [sendingReply, setSendingReply] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterName, setFilterName] = useState('');
    const [filterEmail, setFilterEmail] = useState('');
    const [filterPhone, setFilterPhone] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        if (token) {
            loadDashboardData();
        }
    }, [token, searchTerm, filterName, filterEmail, filterPhone, statusFilter, startDate, endDate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginLoading(true);

        try {
            const data = await adminLogin(usernameInput, passwordInput);
            if (data.success && data.token) {
                localStorage.setItem('antigravity_admin_token', data.token);
                setToken(data.token);
                onSuccess('TAN DİŞ KLİNİĞİ Yönetim Paneline Başarıyla Giriş Yapıldı.');
            }
        } catch (err: any) {
            onError(err.message || 'Giriş Başarısız!');
        } finally {
            setLoginLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('antigravity_admin_token');
        setToken(null);
        onSuccess('Oturum Kapatıldı.');
    };

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            const [statsData, msgsData] = await Promise.all([
                fetchAdminStats(),
                fetchAdminMessages({
                    search: searchTerm,
                    name: filterName,
                    email: filterEmail,
                    phone: filterPhone,
                    status: statusFilter,
                    startDate,
                    endDate
                })
            ]);
            setStats(statsData);
            setMessages(msgsData);
        } catch (err: any) {
            if (err.message.includes('Token') || err.message.includes('Yetkisiz')) {
                handleLogout();
            }
            onError(err.message || 'Veriler yüklenemedi.');
        } finally {
            setLoading(false);
        }
    };

    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyingMessage || !replyText.trim()) return;

        setSendingReply(true);
        try {
            await sendAdminReply(replyingMessage.id, replyText.trim());
            onSuccess(`${replyingMessage.name} hastasına klinik yanıt e-postası başarıyla iletildi.`);
            
            setMessages(prev => prev.map(m => m.id === replyingMessage.id ? { 
                ...m, reply_text: replyText.trim(), replied_at: new Date().toISOString(), is_replied: 1, is_read: 1 
            } : m));
            
            if (selectedMessage?.id === replyingMessage.id) {
                setSelectedMessage(prev => prev ? { 
                    ...prev, reply_text: replyText.trim(), replied_at: new Date().toISOString(), is_replied: 1, is_read: 1 
                } : null);
            }

            setReplyingMessage(null);
            setReplyText('');
            loadDashboardData();
        } catch (err: any) {
            onError(err.message || 'Yanıt gönderilemedi.');
        } finally {
            setSendingReply(false);
        }
    };

    const handleToggleRead = async (msg: ContactMessage, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        try {
            const newStatus = !(msg.is_read == 1 || msg.is_read === true);
            await toggleMessageReadStatus(msg.id, newStatus);
            setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: newStatus ? 1 : 0 } : m));
            loadDashboardData();
            onSuccess(`Talebin durumu ${newStatus ? 'Okundu' : 'Okunmadı'} olarak güncellendi.`);
        } catch (err: any) {
            onError(err.message || 'Durum güncellenemedi.');
        }
    };

    const handleDelete = async (id: number, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (!window.confirm('Bu randevu kaydını ve röntgen eklentisini silmek istediğinize emin misiniz?')) return;

        try {
            await deleteAdminMessage(id);
            setMessages(prev => prev.filter(m => m.id !== id));
            if (selectedMessage?.id === id) setSelectedMessage(null);
            if (replyingMessage?.id === id) setReplyingMessage(null);
            loadDashboardData();
            onSuccess('Kayıt başarıyla silindi.');
        } catch (err: any) {
            onError(err.message || 'Silme işlemi başarısız.');
        }
    };

    // Login Screen
    if (!token) {
        return (
            <div style={{ maxWidth: '440px', margin: '4rem auto', padding: '0 1rem' }}>
                <div class="glass-card" style={{ padding: '2.5rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                        <div style={{
                            width: '56px', height: '56px', borderRadius: '50%',
                            background: 'rgba(14, 165, 233, 0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1rem auto', color: 'var(--accent-sky)'
                        }}>
                            <Smile size={32} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>TAN DİŞ KLİNİĞİ</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.3rem' }}>
                            Randevu ve İletişim Yönetim Paneli
                        </p>
                    </div>

                    <form onSubmit={handleLogin} style={{ display: 'grid', gap: '1.2rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Kullanıcı Adı</label>
                            <input 
                                type="text"
                                value={usernameInput}
                                onChange={(e) => setUsernameInput(e.target.value)}
                                placeholder="admin"
                                required
                                style={{
                                    width: '100%', padding: '0.75rem',
                                    background: 'var(--bg-glass-card)', border: '1px solid var(--border-glass)',
                                    borderRadius: 'var(--radius-sm)', color: 'var(--text-main)'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>Şifre</label>
                            <input 
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={{
                                    width: '100%', padding: '0.75rem',
                                    background: 'var(--bg-glass-card)', border: '1px solid var(--border-glass)',
                                    borderRadius: 'var(--radius-sm)', color: 'var(--text-main)'
                                }}
                            />
                        </div>

                        <div style={{ background: 'rgba(14, 165, 233, 0.1)', padding: '0.8rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--accent-sky)' }}>
                            💡 <b>Klinik Giriş Bilgileri:</b> Kullanıcı adı: <code>admin</code> | Şifre: <code>admin123</code>
                        </div>

                        <button 
                            type="submit" 
                            class="btn btn-primary btn-large"
                            disabled={loginLoading}
                            style={{ width: '100%', justifyContent: 'center' }}
                        >
                            {loginLoading ? 'Giriş Yapılıyor...' : 'Klinik Paneline Giriş Yap'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1240px', margin: '3rem auto', padding: '0 1.5rem' }}>
            {/* Header Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <Smile size={30} style={{ color: 'var(--accent-sky)' }} />
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>TAN DİŞ KLİNİĞİ Yönetim Paneli</h2>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        Randevu talepleri, hasta röntgen eklentileri ve e-posta/WhatsApp yanıt merkezi.
                    </p>
                </div>

                <button type="button" class="btn btn-outline" onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>Çıkış Yap</span>
                </button>
            </div>

            {/* Dashboard İstatistik Kartları */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.4rem', marginBottom: '2rem' }}>
                <div class="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-md)', background: 'rgba(14, 165, 233, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-sky)' }}>
                        <Inbox size={26} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.total}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Toplam Randevu & Mesaj</div>
                    </div>
                </div>

                <div class="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-md)', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444' }}>
                        <AlertCircle size={26} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800, color: stats.unread > 0 ? '#ef4444' : 'inherit' }}>{stats.unread}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Okunmamış Talep</div>
                    </div>
                </div>

                <div class="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                        <Clock size={26} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.today}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Bugün Gelen</div>
                    </div>
                </div>

                <div class="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-md)', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4' }}>
                        <Calendar size={26} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{stats.thisMonth}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Bu Ay Gelen</div>
                    </div>
                </div>
            </div>

            {/* Gelişmiş Çoklu Filtre Paneli */}
            <div class="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: 700, fontSize: '0.95rem' }}>
                    <Filter size={18} style={{ color: 'var(--accent-sky)' }} />
                    <span>Hasta Arama & Randevu Filtreleme</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.9rem' }}>
                    <div>
                        <input 
                            type="text" 
                            placeholder="Genel Arama..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%', padding: '0.6rem',
                                background: 'var(--bg-glass-card)', border: '1px solid var(--border-glass)',
                                borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.85rem'
                            }}
                        />
                    </div>

                    <div>
                        <input 
                            type="text" 
                            placeholder="Hasta Adı..."
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                            style={{
                                width: '100%', padding: '0.6rem',
                                background: 'var(--bg-glass-card)', border: '1px solid var(--border-glass)',
                                borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.85rem'
                            }}
                        />
                    </div>

                    <div>
                        <input 
                            type="text" 
                            placeholder="E-posta..."
                            value={filterEmail}
                            onChange={(e) => setFilterEmail(e.target.value)}
                            style={{
                                width: '100%', padding: '0.6rem',
                                background: 'var(--bg-glass-card)', border: '1px solid var(--border-glass)',
                                borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.85rem'
                            }}
                        />
                    </div>

                    <div>
                        <input 
                            type="text" 
                            placeholder="Telefon..."
                            value={filterPhone}
                            onChange={(e) => setFilterPhone(e.target.value)}
                            style={{
                                width: '100%', padding: '0.6rem',
                                background: 'var(--bg-glass-card)', border: '1px solid var(--border-glass)',
                                borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.85rem'
                            }}
                        />
                    </div>

                    <div>
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{
                                width: '100%', padding: '0.6rem',
                                background: 'var(--bg-glass-card)', border: '1px solid var(--border-glass)',
                                borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.85rem'
                            }}
                        >
                            <option value="all">Tüm Randevular</option>
                            <option value="unread">🔴 Okunmamış</option>
                            <option value="read">🟢 Okunmuş</option>
                            <option value="replied">💬 Yanıtlanmış</option>
                        </select>
                    </div>

                    <div>
                        <input 
                            type="date" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            title="Başlangıç Tarihi"
                            style={{
                                width: '100%', padding: '0.6rem',
                                background: 'var(--bg-glass-card)', border: '1px solid var(--border-glass)',
                                borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.85rem'
                            }}
                        />
                    </div>

                    <div>
                        <input 
                            type="date" 
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            title="Bitiş Tarihi"
                            style={{
                                width: '100%', padding: '0.6rem',
                                background: 'var(--bg-glass-card)', border: '1px solid var(--border-glass)',
                                borderRadius: 'var(--radius-sm)', color: 'var(--text-main)', fontSize: '0.85rem'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Mesaj Listesi Tablosu */}
            <div class="glass-card" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--border-glass)' }}>
                                <th style={{ padding: '1rem 1.2rem' }}>Durum</th>
                                <th style={{ padding: '1rem 1.2rem' }}>Hasta Bilgileri</th>
                                <th style={{ padding: '1rem 1.2rem' }}>Tedavi & Mesaj</th>
                                <th style={{ padding: '1rem 1.2rem' }}>Röntgen / Eklenti</th>
                                <th style={{ padding: '1rem 1.2rem' }}>Tarih</th>
                                <th style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        Klinik Kayıtları Yükleniyor...
                                    </td>
                                </tr>
                            ) : messages.length === 0 ? (
                                <tr>
                                    <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        Filtre kriterlerine uygun hasta randevu kaydı bulunamadı.
                                    </td>
                                </tr>
                            ) : (
                                messages.map((msg) => {
                                    const isRead = (msg.is_read == 1 || msg.is_read === true);
                                    const isReplied = (msg.is_replied == 1 || msg.is_replied === true);

                                    return (
                                        <tr 
                                            key={msg.id}
                                            onClick={() => { setSelectedMessage(msg); if (!isRead) handleToggleRead(msg); }}
                                            style={{
                                                borderBottom: '1px solid var(--border-glass)',
                                                cursor: 'pointer',
                                                background: isRead ? 'transparent' : 'rgba(14, 165, 233, 0.05)',
                                                fontWeight: isRead ? 400 : 600
                                            }}
                                        >
                                            <td style={{ padding: '1rem 1.2rem' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'flex-start' }}>
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                                        padding: '0.2rem 0.55rem', borderRadius: '50px', fontSize: '0.75rem',
                                                        background: isRead ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                                                        color: isRead ? '#10b981' : '#ef4444',
                                                        border: `1px solid ${isRead ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                                                    }}>
                                                        {isRead ? <CheckCircle size={11} /> : <Clock size={11} />}
                                                        {isRead ? 'Okundu' : 'Okunmadı'}
                                                    </span>

                                                    {isReplied && (
                                                        <span style={{
                                                            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                                                            padding: '0.2rem 0.55rem', borderRadius: '50px', fontSize: '0.75rem',
                                                            background: 'rgba(14, 165, 233, 0.15)', color: 'var(--accent-sky)',
                                                            border: '1px solid rgba(14, 165, 233, 0.3)'
                                                        }}>
                                                            <Reply size={11} /> Yanıtlandı
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td style={{ padding: '1rem 1.2rem' }}>
                                                <div style={{ fontWeight: 600 }}>{msg.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{msg.email}</div>
                                                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{msg.phone}</div>
                                            </td>

                                            <td style={{ padding: '1rem 1.2rem' }}>
                                                <div style={{ fontWeight: 600 }}>{msg.subject}</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {msg.message}
                                                </div>
                                            </td>

                                            <td style={{ padding: '1rem 1.2rem' }}>
                                                {msg.file_name ? (
                                                    <a 
                                                        href={msg.file_path || '#'} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                        style={{
                                                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                                            fontSize: '0.8rem', color: 'var(--accent-sky)', textDecoration: 'underline'
                                                        }}
                                                    >
                                                        <Paperclip size={14} />
                                                        <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {msg.file_name}
                                                        </span>
                                                    </a>
                                                ) : (
                                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Yok</span>
                                                )}
                                            </td>

                                            <td style={{ padding: '1rem 1.2rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                                {new Date(msg.created_at).toLocaleString('tr-TR')}
                                            </td>

                                            <td style={{ padding: '1rem 1.2rem', textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                                                    <button 
                                                        type="button" 
                                                        class="btn btn-primary"
                                                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', minHeight: '34px' }}
                                                        onClick={(e) => { e.stopPropagation(); setReplyingMessage(msg); setReplyText(''); }}
                                                        title="Hastaya E-posta Yanıtı Gönder"
                                                    >
                                                        <Reply size={13} /> Yanıtla
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        class="btn btn-icon" 
                                                        style={{ width: '34px', height: '34px' }}
                                                        onClick={(e) => { e.stopPropagation(); setSelectedMessage(msg); }}
                                                        title="Detayı Gör"
                                                    >
                                                        <Eye size={15} />
                                                    </button>
                                                    <button 
                                                        type="button" 
                                                        class="btn btn-icon" 
                                                        style={{ width: '34px', height: '34px', color: '#ef4444' }}
                                                        onClick={(e) => handleDelete(msg.id, e)}
                                                        title="Kaydı Sil"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mesaj Detay Modalı */}
            {selectedMessage && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)',
                    zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
                }} onClick={() => setSelectedMessage(null)}>
                    <div class="glass-card" style={{ maxWidth: '650px', width: '100%', padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
                        <button 
                            type="button" 
                            onClick={() => setSelectedMessage(null)}
                            style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', color: 'var(--text-muted)' }}
                        >
                            <X size={24} />
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '50%',
                                background: 'rgba(14, 165, 233, 0.15)', color: 'var(--accent-sky)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <User size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{selectedMessage.name}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    {new Date(selectedMessage.created_at).toLocaleString('tr-TR')}
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gap: '0.8rem', padding: '1rem', background: 'var(--bg-glass-card)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <Mail size={16} style={{ color: 'var(--accent-sky)' }} />
                                <span><b>E-posta:</b> {selectedMessage.email}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <Phone size={16} style={{ color: '#10b981' }} />
                                <span><b>Telefon:</b> {selectedMessage.phone}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                <MessageSquare size={16} style={{ color: '#06b6d4' }} />
                                <span><b>Tedavi / Konu:</b> {selectedMessage.subject}</span>
                            </div>
                            {selectedMessage.file_name && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                    <Paperclip size={16} style={{ color: '#f59e0b' }} />
                                    <span><b>Röntgen / Eklenti:</b> </span>
                                    <a 
                                        href={selectedMessage.file_path || '#'} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        style={{ color: 'var(--accent-sky)', textDecoration: 'underline', fontWeight: 600 }}
                                    >
                                        {selectedMessage.file_name}
                                    </a>
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.6rem' }}>Hasta Şikayeti / Mesajı:</h4>
                            <div style={{ 
                                padding: '1.2rem',
                                background: 'var(--bg-glass-card)',
                                border: '1px solid var(--border-glass)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-wrap'
                            }}>
                                {selectedMessage.message}
                            </div>
                        </div>

                        {selectedMessage.reply_text && (
                            <div style={{ padding: '1.2rem', background: 'rgba(14, 165, 233, 0.1)', borderLeft: '4px solid #0ea5e9', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-sky)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <Reply size={14} /> Gönderilen Klinik Yanıtı ({new Date(selectedMessage.replied_at || '').toLocaleString('tr-TR')}):
                                </div>
                                <div style={{ fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                                    {selectedMessage.reply_text}
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                            <div style={{ display: 'flex', gap: '0.6rem' }}>
                                <button 
                                    type="button" 
                                    class="btn btn-primary"
                                    onClick={() => { setReplyingMessage(selectedMessage); setSelectedMessage(null); setReplyText(''); }}
                                >
                                    <Reply size={16} /> Yanıtla
                                </button>
                                <button 
                                    type="button" 
                                    class="btn btn-secondary"
                                    onClick={() => handleToggleRead(selectedMessage)}
                                >
                                    {(selectedMessage.is_read == 1 || selectedMessage.is_read === true) ? 'Okunmadı Yap' : 'Okundu Yap'}
                                </button>
                            </div>

                            <button 
                                type="button" 
                                class="btn btn-outline"
                                style={{ color: '#ef4444' }}
                                onClick={() => handleDelete(selectedMessage.id)}
                            >
                                <Trash2 size={16} /> Sil
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* E-posta Yanıtlama Modalı */}
            {replyingMessage && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)',
                    zIndex: 2500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
                }} onClick={() => setReplyingMessage(null)}>
                    <div class="glass-card" style={{ maxWidth: '600px', width: '100%', padding: '2rem', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                        <button 
                            type="button" 
                            onClick={() => setReplyingMessage(null)}
                            style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', color: 'var(--text-muted)' }}
                        >
                            <X size={24} />
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                            <Reply size={24} style={{ color: 'var(--accent-sky)' }} />
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Hastaya Yanıt E-postası Gönder</h3>
                        </div>

                        <div style={{ padding: '1rem', background: 'var(--bg-glass-card)', borderRadius: 'var(--radius-md)', marginBottom: '1.2rem', fontSize: '0.9rem' }}>
                            <div><b>Hasta:</b> {replyingMessage.name} &lt;{replyingMessage.email}&gt;</div>
                            <div style={{ marginTop: '0.3rem' }}><b>Konu:</b> Re: {replyingMessage.subject}</div>
                        </div>

                        <form onSubmit={handleSendReply}>
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                    Klinik Yanıt Metniniz
                                </label>
                                <textarea 
                                    rows={6}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Hastanıza verilecek klinik cevabı ve randevu saatini buraya yazınız..."
                                    required
                                    style={{
                                        width: '100%', padding: '0.85rem 1rem',
                                        background: 'var(--bg-glass-card)',
                                        border: '1px solid var(--border-glass-hover)',
                                        borderRadius: 'var(--radius-md)',
                                        color: 'var(--text-main)',
                                        fontSize: '0.95rem', fontFamily: 'inherit', resize: 'vertical',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                                    }}
                                ></textarea>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.8rem' }}>
                                <button 
                                    type="button" 
                                    class="btn btn-secondary"
                                    onClick={() => setReplyingMessage(null)}
                                >
                                    İptal
                                </button>
                                <button 
                                    type="submit" 
                                    class="btn btn-primary"
                                    disabled={sendingReply}
                                >
                                    {sendingReply ? 'Gönderiliyor...' : 'E-posta Gönder & Kaydet'}
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
