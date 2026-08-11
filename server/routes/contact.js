import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { query } from '../config/db.js';
import { sendAdminNotification } from '../services/mailer.js';
import { sendWhatsAppNotification } from '../services/whatsapp.js';
import { sendNtfyNotification } from '../services/ntfy.js';

const router = express.Router();

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'file-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedExts = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.png', '.jpg', '.jpeg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExts.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Geçersiz dosya formatı! Sadece PDF, Word, Excel ve Resim (PNG/JPG) yükleyebilirsiniz.'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

/**
 * GET /api/contact/test-whatsapp
 * WhatsApp Bildirim Gönderimini Anında Test Etme Endpoint'i
 */
router.get('/test-whatsapp', async (req, res) => {
    const testData = {
        name: 'Test Kullanıcısı',
        email: 'test@antigravity.edu',
        phone: '0555 000 00 00',
        subject: 'WhatsApp Entegrasyonu Test Bildirimi',
        message: 'Bu bir test mesajıdır. Kişisel WhatsApp entegrasyonu başarıyla çalışıyor!'
    };

    console.log('🧪 WhatsApp Test Endpoint`i Tetiklendi...');
    const result = await sendWhatsAppNotification(testData);

    return res.json({
        success: true,
        message: 'WhatsApp test bildirimi işlendi. Detaylar sunucu loglarında.',
        result
    });
});

/**
 * POST /api/contact
 * Veritabanına kayıt, E-posta bildirimi ve WhatsApp bildirimi
 */
router.post('/', upload.single('attachment'), async (req, res) => {
    try {
        const { name, email, phone, subject, message, recaptchaToken } = req.body;

        if (!name || !email || !phone || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Lütfen zorunlu tüm alanları doldurunuz.'
            });
        }

        if (recaptchaToken === 'invalid') {
            return res.status(400).json({
                success: false,
                message: 'reCAPTCHA doğrulaması başarısız oldu. Lütfen tekrar deneyin.'
            });
        }

        const filePath = req.file ? `/uploads/${req.file.filename}` : null;
        const fileName = req.file ? req.file.originalname : null;

        const sql = `
            INSERT INTO contact_messages (name, email, phone, subject, message, file_path, file_name, is_read, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, 0, NOW())
        `;
        const params = [
            name.trim(),
            email.trim(),
            phone.trim(),
            subject.trim(),
            message.trim(),
            filePath,
            fileName
        ];

        const result = await query(sql, params);

        const contactData = { name, email, phone, subject, message, fileName };

        // Admin E-posta Bildirimi
        sendAdminNotification(contactData).catch(err => {
            console.error('❌ E-posta bildirimi hatası:', err.message || err);
        });

        // Kişisel WhatsApp Bildirimi
        sendWhatsAppNotification(contactData).catch(err => {
            console.error('❌ WhatsApp bildirimi hatası:', err.message || err);
        });
        // Telefon Bildirimi (ntfy)
        const ntfyMessage = `
📩 Yeni İletişim Mesajı

👤 Ad: ${name}
📧 Mail: ${email}
📞 Telefon: ${phone}

📌 Konu:
${subject}

💬 Mesaj:
${message}
`;

        sendNtfyNotification(ntfyMessage).catch(err => {
            console.error('❌ ntfy bildirimi hatası:', err.message || err);
        });
        return res.status(201).json({
            success: true,
            message: 'Mesajınız, eklentiniz ve WhatsApp bildiriminiz başarıyla işlendi!',
            messageId: result.insertId,
            file: fileName
        });
    } catch (error) {
        console.error('İletişim Formu Kayıt Hatası:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Mesaj iletilirken sunucu hatası oluştu.'
        });
    }
});

export default router;
