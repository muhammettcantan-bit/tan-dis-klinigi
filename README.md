# TAN DİŞ KLİNİĞİ - Ağız ve Diş Sağlığı Merkezi (v2.5 Full-Stack)

Bu proje, **TAN DİŞ KLİNİĞİ** için özel olarak tasarlanmış; modern web mimarileri (React 18, TypeScript, Vite, Express, MySQL) ile kıdemli yazılım mühendisliği standartlarına göre geliştirilmiş **hasta randevu portalı**, **röntgen eklenti yönetim sistemi** ve **şifre korumalı klinik yönetim panelidir**.

---

## 🎯 Projenin Amacı ve Kalite Standartları

1. **Senior Full-Stack Mimarisi**: React 18 + TypeScript istemci mimarisi, Express.js backend API, MySQL bağlantı havuzu & fail-safe fallback veritabanı.
2. **Kullanıcı Deneyimi & Medikal Estetik (UX/UI)**: Ocean Cyan (`#0ea5e9`), Sky Blue ve Hijyen Yeşil renk paleti, 3D dijital gülüş tasarımı kartı, akıcı sayfa animasyonları.
3. **Hasta Randevu & Röntgen Eklenti Sistemi**: Şikayet/tedavi seçimi, Panoramik Röntgen ekleme olanağı (PDF, Word, Excel, Görsel - max 10MB), Google reCAPTCHA v3 güvenliği.
4. **Çok Kanallı Anında Bildirimler**: Form gönderildiğinde anında **Kişisel WhatsApp** ve **E-posta (Gmail SMTP)** bildirimi.
5. **Klinik Yönetim Paneli (`/admin`)**: Şifre korumalı dashboard (Kullanıcı adı: `admin` | Şifre: `admin123`), metrik kartları, çoklu arama/filtreleme, hastaya e-posta yanıtı gönderme ve yanıt geçmişini saklama.

---

## 📁 Proje Dosya Yapısı

```text
TAN DİŞ KLİNİĞİ/
├── index.html            # Semantik, erişilebilir (a11y) Klinik başlık & Vite şablonu
├── src/                  # React + TypeScript İstemci Kodları
│   ├── components/       # Header, Hero, Features, Stats, ContactSection, AdminPanel, Toast, Footer
│   ├── services/         # Frontend API İstemci Katmanı
│   ├── types/            # TypeScript Tip Tanımlamaları
│   ├── App.tsx           # İstemci Kök Bileşeni
│   ├── index.css         # Clinical Glassmorphic CSS Tasarım Tokens & Medikal Temalar
│   └── main.tsx          # Vite Giriş Noktası
├── server/               # Express Backend Servisi
│   ├── config/           # MySQL & Fallback DB Yapılandırması
│   ├── routes/           # İletişim & Admin Paneli API Rotaları
│   ├── services/         # Nodemailer E-posta & CallMeBot WhatsApp Bildirim Servisleri
│   ├── schema.sql        # MySQL Veritabanı Şeması (tan_dis_klinigi_db)
│   └── server.js         # Express Sunucu Giriş Dosyası (Port 5000)
├── uploads/              # Yüklenen Röntgen ve Eklenti Dosyaları
├── package.json          # Proje Bağımlılıkları ve Komutları
└── README.md             # Dokümantasyon
```

---

## 🚀 Öne Çıkan Gelişmiş Özellikler

- 🎨 **Dinamik Dark & Light Medikal Tema**:
  - İşletim sistemi tercihlerine (`prefers-color-scheme`) otomatik uyum.
  - `localStorage` ile tema kalıcılığı.
  - Aydınlık modda kristal netliğinde klinik beyazlığı, koyu modda derin safir mavi ve turkuaz glassmorphism.
- 📱 **WhatsApp & E-posta Bildirim Entegrasyonu**:
  - Kişisel WhatsApp hesabınıza 10 saniyede uyarı düşüren CallMeBot entegrasyonu.
  - Gmail SMTP canlı e-posta gönderimi ve Ethereal canlı test önizleme bağlantıları.
- ♿ **Erişilebilirlik (a11y - WCAG 2.1 AA)**:
  - "Ana İçeriğe Atla" (`.skip-link`) kısayolu.
  - Belirgin odak göstergeleri (`:focus-visible`).
  - Tam ARIA semantik etiketleri.

---

## 🛠️ Kurulum ve Çalıştırma

### 1. Bağımlılıkları Yükleyin:
```bash
npm install
```

### 2. Projeyi Çalıştırın (Frontend + Backend):
```bash
npm start
```

- **Klinik Web Portalı**: `http://localhost:5173`
- **Klinik Yönetim Paneli**: `http://localhost:5173/#admin`
- **Backend API**: `http://localhost:5000`
