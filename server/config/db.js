import mysql from 'mysql2/promise.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'tan_dis_klinigi_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let pool = null;
let isFallback = false;

const DATA_FILE = path.join(__dirname, '../data_fallback.json');

function loadFallbackData() {
    if (!fs.existsSync(DATA_FILE)) {
        const initial = {
            messages: [
                {
                    id: 1,
                    name: 'Ahmet Yılmaz',
                    email: 'ahmet@example.com',
                    phone: '0555 123 45 67',
                    subject: 'Estetik Gülüş Tasarımı',
                    message: 'Merhaba, Zirkonyum lamine ve 3D dijital gülüş tasarımı için muayene randevusu almak istiyorum.',
                    file_path: null,
                    file_name: null,
                    reply_text: null,
                    replied_at: null,
                    is_replied: 0,
                    is_read: 0,
                    created_at: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'Ayşe Demir',
                    email: 'ayse@company.org',
                    phone: '0532 987 65 43',
                    subject: 'Ağrısız İmplant Tedavisi',
                    message: 'Sağ alt çene implant muayenesi için detaylı bilgi almak istiyorum, panoramik röntgenim mevcuttur.',
                    file_path: null,
                    file_name: null,
                    reply_text: 'Sayın Ayşe Hanım, klinik koordinatörümüz tarafından randevu saatiniz onaylanmıştır.',
                    replied_at: new Date(Date.now() - 3600000 * 5).toISOString(),
                    is_replied: 1,
                    is_read: 1,
                    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
                }
            ],
            nextId: 3
        };
        fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
}

function saveFallbackData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export async function initDb() {
    try {
        pool = mysql.createPool(dbConfig);
        const connection = await pool.getConnection();
        console.log('✅ MySQL TAN DİŞ KLİNİĞİ Veritabanı Bağlantısı Başarılı!');
        
        await connection.query(`
            CREATE TABLE IF NOT EXISTS contact_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(150) NOT NULL,
                phone VARCHAR(30) NOT NULL,
                subject VARCHAR(200) NOT NULL,
                message TEXT NOT NULL,
                file_path VARCHAR(255) DEFAULT NULL,
                file_name VARCHAR(255) DEFAULT NULL,
                reply_text TEXT DEFAULT NULL,
                replied_at TIMESTAMP NULL DEFAULT NULL,
                is_replied TINYINT(1) DEFAULT 0,
                is_read TINYINT(1) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        const alterQueries = [
            "ALTER TABLE contact_messages ADD COLUMN file_path VARCHAR(255) DEFAULT NULL;",
            "ALTER TABLE contact_messages ADD COLUMN file_name VARCHAR(255) DEFAULT NULL;",
            "ALTER TABLE contact_messages ADD COLUMN reply_text TEXT DEFAULT NULL;",
            "ALTER TABLE contact_messages ADD COLUMN replied_at TIMESTAMP NULL DEFAULT NULL;",
            "ALTER TABLE contact_messages ADD COLUMN is_replied TINYINT(1) DEFAULT 0;"
        ];

        for (const alterSql of alterQueries) {
            try { await connection.query(alterSql); } catch (e) { /* Kolon mevcutsa yut */ }
        }

        connection.release();
        isFallback = false;
    } catch (error) {
        console.warn('⚠️  MySQL Bağlantısı Kurulamadı (TAN DİŞ KLİNİĞİ Geliştirme Modu Fallback Aktif):', error.message);
        isFallback = true;
        loadFallbackData();
    }
}

export async function query(sql, params = []) {
    if (!isFallback && pool) {
        try {
            const [rows] = await pool.execute(sql, params);
            return rows;
        } catch (err) {
            console.error('MySQL Query Hatası:', err);
            throw err;
        }
    }

    const data = loadFallbackData();
    const cleanSql = sql.trim().toUpperCase();

    if (cleanSql.startsWith('INSERT INTO CONTACT_MESSAGES')) {
        const [name, email, phone, subject, message, filePath, fileName] = params;
        const newMsg = {
            id: data.nextId++,
            name,
            email,
            phone,
            subject,
            message,
            file_path: filePath || null,
            file_name: fileName || null,
            reply_text: null,
            replied_at: null,
            is_replied: 0,
            is_read: 0,
            created_at: new Date().toISOString()
        };
        data.messages.unshift(newMsg);
        saveFallbackData(data);
        return { insertId: newMsg.id };
    }

    if (cleanSql.startsWith('SELECT') && cleanSql.includes('CONTACT_MESSAGES')) {
        let list = [...data.messages];

        if (params.length > 0) {
            const searchParam = params.find(p => typeof p === 'string' && p.startsWith('%'));
            if (searchParam) {
                const term = searchParam.replace(/%/g, '').toLowerCase();
                list = list.filter(m => 
                    m.name.toLowerCase().includes(term) ||
                    m.email.toLowerCase().includes(term) ||
                    m.phone.toLowerCase().includes(term) ||
                    m.subject.toLowerCase().includes(term) ||
                    m.message.toLowerCase().includes(term)
                );
            }
        }

        return list;
    }

    if (cleanSql.includes('REPLY_TEXT = ?')) {
        const [replyText, id] = params;
        const target = data.messages.find(m => m.id === parseInt(id, 10));
        if (target) {
            target.reply_text = replyText;
            target.replied_at = new Date().toISOString();
            target.is_replied = 1;
            target.is_read = 1;
            saveFallbackData(data);
        }
        return { affectedRows: target ? 1 : 0 };
    }

    if (cleanSql.startsWith('UPDATE CONTACT_MESSAGES')) {
        const [isRead, id] = params;
        const target = data.messages.find(m => m.id === parseInt(id, 10));
        if (target) {
            target.is_read = parseInt(isRead, 10);
            saveFallbackData(data);
        }
        return { affectedRows: target ? 1 : 0 };
    }

    if (cleanSql.startsWith('DELETE FROM CONTACT_MESSAGES')) {
        const [id] = params;
        const initialLen = data.messages.length;
        data.messages = data.messages.filter(m => m.id !== parseInt(id, 10));
        saveFallbackData(data);
        return { affectedRows: initialLen - data.messages.length };
    }

    return [];
}
