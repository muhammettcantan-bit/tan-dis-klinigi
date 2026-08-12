import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// .env dosyasını ana dizinden kesin yolla yükle
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

function getTransporter() {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '587', 10);
    const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        tls: { rejectUnauthorized: false }
    });
}

/**
 * Yeni Randevu / İletişim Formu Doldurulduğunda Klinik Yöneticisine Canlı E-posta Bildirimi Gönderir
 */
export async function sendAdminNotification(contactData) {
    try {
        const transporter = getTransporter();
        const smtpUser = process.env.SMTP_USER || 'muhammettcantan@gmail.com';
        const adminEmail = process.env.ADMIN_EMAIL || smtpUser;

        const mailOptions = {
            from: `"TAN DİŞ KLİNİĞİ Bildirim" <${smtpUser}>`,
            to: adminEmail,
            subject: `🦷 Yeni Randevu Talebi: ${contactData.subject}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f0f9ff;">
                    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 25px; border-radius: 8px; border: 1px solid #0ea5e9;">
                        <h2 style="color: #0ea5e9; margin-top: 0;">🦷 TAN DİŞ KLİNİĞİ - Yeni Randevu Talebi</h2>
                        <hr style="border: 0; border-top: 1px solid #eee;" />
                        <p><strong>Hasta Adı Soyadı:</strong> ${contactData.name}</p>
                        <p><strong>E-posta:</strong> ${contactData.email}</p>
                        <p><strong>Telefon:</strong> ${contactData.phone}</p>
                        <p><strong>Tedavi / Konu:</strong> ${contactData.subject}</p>
                        <p><strong>Hasta Şikayeti / Mesaj:</strong></p>
                        <div style="background: #f8fafc; padding: 15px; border-radius: 6px; font-style: italic;">
                            ${contactData.message}
                        </div>
                        ${contactData.fileName ? `<p><strong>Röntgen / Eklenti:</strong> ${contactData.fileName}</p>` : ''}
                        <hr style="border: 0; border-top: 1px solid #eee;" />
                        <p style="font-size: 12px; color: #888;">TAN DİŞ KLİNİĞİ Otomatik Hasta Randevu Bildirimi</p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✉️  [CANLI GMAIL SUCCESS] TAN DİŞ KLİNİĞİ - Admin E-postası Gönderildi:', info.messageId);
        return true;
    } catch (error) {
        console.error('❌ TAN DİŞ KLİNİĞİ - Admin e-posta gönderim hatası:', error.message || error);
        return false;
    }
}

/**
 * Klinik Yönetim Panelinden Hastaya Canlı E-posta Yanıtı Gönderir
 */
export async function sendUserReplyEmail(toEmail, toName, originalSubject, replyText) {
    try {
        const transporter = getTransporter();
        const smtpUser = process.env.SMTP_USER || 'muhammettcantan@gmail.com';

        const mailOptions = {
            from: `"TAN DİŞ KLİNİĞİ Hasta İlişkileri" <${smtpUser}>`,
            to: toEmail,
            subject: `Re: ${originalSubject} - TAN DİŞ KLİNİĞİ`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f0f9ff;">
                    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 25px; border-radius: 8px; border: 1px solid #0ea5e9;">
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
        console.log('✉️  [CANLI GMAIL SUCCESS] TAN DİŞ KLİNİĞİ - Hastaya Yanıt E-postası Gönderildi:', info.messageId);
        return true;
    } catch (error) {
        console.error('❌ TAN DİŞ KLİNİĞİ - Hastaya e-posta gönderim hatası:', error.message || error);
        return false;
    }
}