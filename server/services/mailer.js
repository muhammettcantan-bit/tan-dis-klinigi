import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// .env dosyasını ana dizinden kesin yolla yükle
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

let transporterPool = null;

function getTransporter() {
    if (!transporterPool) {
        const user = process.env.SMTP_USER || 'muhammettcantan@gmail.com';
        const pass = process.env.SMTP_PASS || 'qexaewvtaaruqyoc';
        const host = process.env.SMTP_HOST || 'smtp.gmail.com';
        const port = parseInt(process.env.SMTP_PORT || '587', 10);

        if (host.includes('gmail')) {
            transporterPool = nodemailer.createTransport({
                service: 'gmail',
                pool: true, // Açık bağlantı havuzu (Anlık 0-Gecikme gönderim)
                maxConnections: 5,
                maxMessages: 100,
                auth: { user, pass }
            });
        } else {
            transporterPool = nodemailer.createTransport({
                host,
                port,
                pool: true,
                secure: port === 465,
                auth: { user, pass },
                tls: { rejectUnauthorized: false }
            });
        }
    }
    return transporterPool;
}

/**
 * Yeni Randevu / İletişim Formu Doldurulduğunda Klinik Yöneticisine Anlık E-posta Bildirimi Gönderir
 */
export async function sendAdminNotification(contactData) {
    try {
        const transporter = getTransporter();
        const smtpUser = process.env.SMTP_USER || 'muhammettcantan@gmail.com';
        const adminEmail = process.env.ADMIN_EMAIL || smtpUser;

        const mailOptions = {
            from: `"TAN DİŞ KLİNİĞİ Bildirim" <${smtpUser}>`,
            to: adminEmail,
            replyTo: contactData.email || smtpUser,
            subject: `⚡ [ANLIK RANDEVU TALEBİ] ${contactData.name} - ${contactData.subject}`,
            headers: {
                'X-Priority': '1 (Highest)',
                'X-MSMail-Priority': 'High',
                'Importance': 'High'
            },
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f0f9ff;">
                    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 25px; border-radius: 8px; border: 2px solid #0ea5e9;">
                        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #0ea5e9; padding-bottom: 12px; margin-bottom: 20px;">
                            <h2 style="color: #0ea5e9; margin: 0;">🦷 TAN DİŞ KLİNİĞİ</h2>
                            <span style="background: #10b981; color: #fff; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: bold;">ANLIK RANDEVU TALEBİ</span>
                        </div>

                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <tr>
                                <td style="padding: 8px; font-weight: bold; width: 35%; color: #475569;">Hasta Adı Soyadı:</td>
                                <td style="padding: 8px; color: #0f172a;">${contactData.name}</td>
                            </tr>
                            <tr style="background-color: #f8fafc;">
                                <td style="padding: 8px; font-weight: bold; color: #475569;">E-posta:</td>
                                <td style="padding: 8px; color: #0ea5e9;"><a href="mailto:${contactData.email}">${contactData.email}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 8px; font-weight: bold; color: #475569;">Telefon:</td>
                                <td style="padding: 8px; color: #0f172a;"><b>${contactData.phone}</b></td>
                            </tr>
                            <tr style="background-color: #f8fafc;">
                                <td style="padding: 8px; font-weight: bold; color: #475569;">Tedavi / Konu:</td>
                                <td style="padding: 8px; color: #0ea5e9;"><b>${contactData.subject}</b></td>
                            </tr>
                            ${contactData.fileName ? `
                            <tr>
                                <td style="padding: 8px; font-weight: bold; color: #475569;">Panoramik Röntgen / Eklenti:</td>
                                <td style="padding: 8px; color: #d97706;"><b>${contactData.fileName}</b></td>
                            </tr>` : ''}
                        </table>

                        <div style="background: #f0f9ff; padding: 15px; border-left: 4px solid #0ea5e9; border-radius: 4px; margin-bottom: 20px;">
                            <strong style="color: #0ea5e9; display: block; margin-bottom: 6px;">Hasta Şikayeti / Mesajı:</strong>
                            <p style="margin: 0; color: #334155; line-height: 1.5; font-style: italic;">${contactData.message}</p>
                        </div>

                        <div style="text-align: center; border-top: 1px solid #e2e8f0; padding-top: 15px; font-size: 12px; color: #94a3b8;">
                            TAN DİŞ KLİNİĞİ Otomatik Hasta Randevu ve Anlık İletim Servisi
                        </div>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('⚡ [ANLIK E-POSTA İLETİLDİ] TAN DİŞ KLİNİĞİ - Admin E-postası:', info.messageId);
        return true;
    } catch (error) {
        console.error('❌ TAN DİŞ KLİNİĞİ - Admin e-posta gönderim hatası:', error.message || error);
        return false;
    }
}

/**
 * Klinik Yönetim Panelinden Hastaya Anlık E-posta Yanıtı Gönderir
 */
export async function sendUserReplyEmail(toEmail, toName, originalSubject, replyText) {
    try {
        const transporter = getTransporter();
        const smtpUser = process.env.SMTP_USER || 'muhammettcantan@gmail.com';

        const mailOptions = {
            from: `"TAN DİŞ KLİNİĞİ Hasta İlişkileri" <${smtpUser}>`,
            to: toEmail,
            replyTo: smtpUser,
            subject: `Re: ${originalSubject} - TAN DİŞ KLİNİĞİ`,
            headers: {
                'X-Priority': '1 (Highest)',
                'Importance': 'High'
            },
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f0f9ff;">
                    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 25px; border-radius: 8px; border: 2px solid #0ea5e9;">
                        <h2 style="color: #0ea5e9; margin-top: 0;">Sayın ${toName},</h2>
                        <p style="font-size: 15px; color: #333; line-height: 1.6;">
                            TAN DİŞ KLİNİĞİ olarak randevu ve muayene talebiniz incelenmiş olup klinik yanıtımız aşağıda bilgilerinize sunulmuştur:
                        </p>
                        <div style="background: #f0f9ff; padding: 18px; border-left: 4px solid #0ea5e9; border-radius: 4px; margin: 20px 0; font-size: 15px; line-height: 1.6;">
                            ${replyText.replace(/\n/g, '<br/>')}
                        </div>
                        <p style="font-size: 14px; color: #666;">
                            Sağlıklı günler ve mutlu gülüşler dileriz.
                        </p>
                        <hr style="border: 0; border-top: 1px solid #eee; margin-top: 30px;" />
                        <p style="font-size: 12px; color: #888; text-align: center;">
                            TAN DİŞ KLİNİĞİ | Ağız ve Diş Sağlığı Merkezi
                        </p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('⚡ [ANLIK E-POSTA İLETİLDİ] TAN DİŞ KLİNİĞİ - Hastaya Yanıt E-postası:', info.messageId);
        return true;
    } catch (error) {
        console.error('❌ TAN DİŞ KLİNİĞİ - Hastaya e-posta gönderim hatası:', error.message || error);
        return false;
    }
}