-- ==========================================================================
-- TAN DİŞ KLİNİĞİ - MySQL Veritabanı ve Tablo Şeması v2.5
-- Hasta Randevu, Röntgen Eklentisi ve Yönetim Paneli Şeması
-- ==========================================================================

CREATE DATABASE IF NOT EXISTS tan_dis_klinigi_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tan_dis_klinigi_db;

-- Hasta Randevu & İletişim Mesajları Tablosu
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT 'Hasta Ad Soyadı',
    email VARCHAR(150) NOT NULL COMMENT 'Hasta E-posta Adresi',
    phone VARCHAR(30) NOT NULL COMMENT 'Hasta Telefon Numarası',
    subject VARCHAR(200) NOT NULL COMMENT 'Randevu Konusu / Tedavi Türü',
    message TEXT NOT NULL COMMENT 'Hasta Şikayeti / Mesajı',
    file_path VARCHAR(255) DEFAULT NULL COMMENT 'Panoramik Röntgen / Eklenti Dosya Yolu',
    file_name VARCHAR(255) DEFAULT NULL COMMENT 'Eklenti Orijinal Adı',
    reply_text TEXT DEFAULT NULL COMMENT 'Klinik Admin Yanıt Metni',
    replied_at TIMESTAMP NULL DEFAULT NULL COMMENT 'Yanıtlanma Tarihi',
    is_replied TINYINT(1) DEFAULT 0 COMMENT '0: Yanıtlanmadı, 1: Yanıtlandı',
    is_read TINYINT(1) DEFAULT 0 COMMENT '0: Okunmadı, 1: Okundu',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Talebin Gönderim Tarihi',
    INDEX idx_created_at (created_at),
    INDEX idx_is_read (is_read),
    INDEX idx_is_replied (is_replied),
    INDEX idx_email (email),
    INDEX idx_name (name),
    INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Klinik Admin Kullanıcılar Tablosu
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO admin_users (username, password_hash) 
VALUES ('admin', '$2a$10$wE9l1o9qYmB/wP8NqYhJzeXw2B1k8N4A9c9C1D2E3F4G5H6I7J8K9')
ON DUPLICATE KEY UPDATE id=id;
