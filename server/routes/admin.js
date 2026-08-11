import express from 'express';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { authenticateToken } from '../middleware/auth.js';
import { sendUserReplyEmail } from '../services/mailer.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'antigravity_secret_key_2026';

/**
 * POST /api/admin/login
 * Admin girişi ve JWT token üretimi
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Kullanıcı adı ve şifre zorunludur.' });
        }

        const isValidAdmin = (username === 'admin' && password === 'admin123');

        if (!isValidAdmin) {
            return res.status(401).json({ success: false, message: 'Hatalı kullanıcı adı veya şifre!' });
        }

        const token = jwt.sign(
            { username: 'admin', role: 'administrator' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.json({
            success: true,
            message: 'Giriş başarılı!',
            token,
            user: { username: 'admin', role: 'administrator' }
        });
    } catch (error) {
        console.error('Admin Login Hatası:', error);
        return res.status(500).json({ success: false, message: 'Giriş işlemi sırasında sunucu hatası.' });
    }
});

/**
 * GET /api/admin/stats
 * Dashboard Metrik Kartları (Toplam, Okunmamış, Bugün, Bu Ay)
 */
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const allMessages = await query(`SELECT id, is_read, created_at FROM contact_messages`);

        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        let total = allMessages.length;
        let unread = 0;
        let today = 0;
        let thisMonth = 0;

        allMessages.forEach(msg => {
            if (msg.is_read == 0 || msg.is_read === false) unread++;

            const createdDate = new Date(msg.created_at);
            const dateStr = createdDate.toISOString().split('T')[0];

            if (dateStr === todayStr) today++;
            if (createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear) thisMonth++;
        });

        return res.json({
            success: true,
            stats: { total, unread, today, thisMonth }
        });
    } catch (error) {
        console.error('İstatistik Alma Hatası:', error);
        return res.status(500).json({ success: false, message: 'İstatistikler hesaplanırken sunucu hatası.' });
    }
});

/**
 * GET /api/admin/messages
 * Detaylı Filtreli Mesaj Listeleme (Ad, E-posta, Telefon, Tarih, Okundu Durumu)
 */
router.get('/messages', authenticateToken, async (req, res) => {
    try {
        const { search, name, email, phone, status, startDate, endDate } = req.query;

        let sql = `SELECT * FROM contact_messages WHERE 1=1`;
        const params = [];

        // Genel Arama
        if (search) {
            sql += ` AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR subject LIKE ? OR message LIKE ?)`;
            const pattern = `%${search}%`;
            params.push(pattern, pattern, pattern, pattern, pattern);
        }

        // Özel Alan Filtreleri
        if (name) {
            sql += ` AND name LIKE ?`;
            params.push(`%${name}%`);
        }

        if (email) {
            sql += ` AND email LIKE ?`;
            params.push(`%${email}%`);
        }

        if (phone) {
            sql += ` AND phone LIKE ?`;
            params.push(`%${phone}%`);
        }

        if (status === 'read') {
            sql += ` AND is_read = 1`;
        } else if (status === 'unread') {
            sql += ` AND is_read = 0`;
        } else if (status === 'replied') {
            sql += ` AND is_replied = 1`;
        }

        if (startDate) {
            sql += ` AND created_at >= ?`;
            params.push(`${startDate} 00:00:00`);
        }

        if (endDate) {
            sql += ` AND created_at <= ?`;
            params.push(`${endDate} 23:59:59`);
        }

        sql += ` ORDER BY created_at DESC`;

        const messages = await query(sql, params);

        return res.json({
            success: true,
            messages,
            total: messages.length
        });
    } catch (error) {
        console.error('Mesaj Listeleme Hatası:', error);
        return res.status(500).json({ success: false, message: 'Mesajlar yüklenirken sunucu hatası.' });
    }
});

/**
 * POST /api/admin/messages/:id/reply
 * Admin tarafından kullanıcının mesajına E-posta ile cevap verme ve DB'ye kaydetme
 */
router.post('/messages/:id/reply', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { replyText } = req.body;

        if (!replyText || !replyText.trim()) {
            return res.status(400).json({ success: false, message: 'Cevap metni boş olamaz.' });
        }

        // Mesaj bilgilerini çek
        const targetMessages = await query(`SELECT * FROM contact_messages WHERE id = ?`, [id]);
        if (!targetMessages || targetMessages.length === 0) {
            return res.status(404).json({ success: false, message: 'Mesaj bulunamadı.' });
        }

        const msg = targetMessages[0];

        // E-posta Gönderim Servisi
        await sendUserReplyEmail(msg.email, msg.name, msg.subject, replyText.trim());

        // Veritabanında Cevabı Kaydet ve Okundu İşaretle
        const updateSql = `
            UPDATE contact_messages 
            SET reply_text = ?, replied_at = NOW(), is_replied = 1, is_read = 1 
            WHERE id = ?
        `;
        await query(updateSql, [replyText.trim(), id]);

        return res.json({
            success: true,
            message: `${msg.name} adlı kullanıcıya yanıt e-postası başarıyla gönderildi ve kaydedildi.`
        });
    } catch (error) {
        console.error('Mesaj Yanıtlama Hatası:', error);
        return res.status(500).json({ success: false, message: 'Yanıt gönderilirken sunucu hatası.' });
    }
});

/**
 * PATCH /api/admin/messages/:id/read
 */
router.patch('/messages/:id/read', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { is_read } = req.body;

        const sql = `UPDATE contact_messages SET is_read = ? WHERE id = ?`;
        await query(sql, [is_read ? 1 : 0, id]);

        return res.json({ success: true, message: 'Durum güncellendi.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Güncelleme hatası.' });
    }
});

/**
 * DELETE /api/admin/messages/:id
 */
router.delete('/messages/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await query(`DELETE FROM contact_messages WHERE id = ?`, [id]);
        return res.json({ success: true, message: 'Mesaj silindi.' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Silme hatası.' });
    }
});

export default router;
