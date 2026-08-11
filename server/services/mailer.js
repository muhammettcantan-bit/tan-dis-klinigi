import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: path.resolve(process.cwd(), '../.env')
});

console.log('📧 SMTP_USER:', process.env.SMTP_USER);
console.log('📧 ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
console.log('📧 SMTP_HOST:', process.env.SMTP_HOST);
console.log('📧 SMTP_PORT:', process.env.SMTP_PORT);

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },

    tls: {
        rejectUnauthorized: false
    },

    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
});


export async function sendAdminNotification(contactData) {

    try {

        const mailOptions = {

            from: `"TAN DİŞ KLİNİĞİ" <${process.env.SMTP_USER}>`,

            to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,

            subject: `🔔 Yeni Randevu Talebi: ${contactData.subject}`,

            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    padding: 30px;
                    background:#f0f9ff;
                ">

                    <div style="
                        max-width:600px;
                        margin:auto;
                        background:white;
                        padding:30px;
                        border-radius:12px;
                        border:1px solid #0ea5e9;
                    ">

                        <h2 style="color:#0ea5e9;">
                            🦷 TAN DİŞ KLİNİĞİ
                        </h2>

                        <h3>
                            Yeni Randevu / İletişim Talebi
                        </h3>

                        <hr>

                        <p>
                            <strong>Hasta Adı Soyadı:</strong>
                            ${contactData.name}
                        </p>

                        <p>
                            <strong>E-posta:</strong>
                            ${contactData.email}
                        </p>

                        <p>
                            <strong>Telefon:</strong>
                            ${contactData.phone}
                        </p>

                        <p>
                            <strong>Tedavi / Konu:</strong>
                            ${contactData.subject}
                        </p>

                        <p>
                            <strong>Mesaj:</strong>
                        </p>

                        <div style="
                            background:#f8fafc;
                            padding:18px;
                            border-radius:8px;
                            border-left:4px solid #0ea5e9;
                        ">
                            ${contactData.message}
                        </div>

                        ${contactData.fileName
                    ? `
                                <p>
                                    <strong>Ek Dosya:</strong>
                                    ${contactData.fileName}
                                </p>
                            `
                    : ''
                }

                        <hr>

                        <p style="
                            font-size:12px;
                            color:#888;
                        ">
                            TAN DİŞ KLİNİĞİ otomatik bildirim sistemi
                        </p>

                    </div>

                </div>
            `
        };


        const info = await transporter.sendMail(mailOptions);


        console.log(
            '✅ TAN DİŞ KLİNİĞİ - Admin e-posta gönderildi:',
            info.messageId
        );


        return true;


    } catch (error) {

        console.error(
            '❌ TAN DİŞ KLİNİĞİ - Admin e-posta gönderilemedi:',
            error.message
        );

        return false;
    }
}



export async function sendUserReplyEmail(
    toEmail,
    toName,
    originalSubject,
    replyText
) {

    try {

        const mailOptions = {

            from: `"TAN DİŞ KLİNİĞİ" <${process.env.SMTP_USER}>`,

            to: toEmail,

            subject: `Re: ${originalSubject} - TAN DİŞ KLİNİĞİ`,

            html: `
                <div style="
                    font-family:Arial,sans-serif;
                    padding:30px;
                    background:#f0f9ff;
                ">

                    <div style="
                        max-width:600px;
                        margin:auto;
                        background:white;
                        padding:30px;
                        border-radius:12px;
                        border:1px solid #0ea5e9;
                    ">

                        <h2 style="color:#0ea5e9;">
                            Sayın ${toName},
                        </h2>

                        <p>
                            TAN DİŞ KLİNİĞİ olarak
                            iletişim talebinize ilişkin yanıtımız:
                        </p>

                        <div style="
                            background:#f0f9ff;
                            padding:20px;
                            border-left:4px solid #0ea5e9;
                            border-radius:6px;
                        ">
                            ${replyText.replace(/\n/g, '<br>')}
                        </div>

                        <p>
                            Sağlıklı günler ve mutlu gülüşler dileriz.
                        </p>

                        <hr>

                        <p style="
                            font-size:12px;
                            color:#888;
                            text-align:center;
                        ">
                            TAN DİŞ KLİNİĞİ | Ağız ve Diş Sağlığı Merkezi
                        </p>

                    </div>

                </div>
            `
        };


        const info = await transporter.sendMail(mailOptions);


        console.log(
            '✅ TAN DİŞ KLİNİĞİ - Hastaya yanıt e-postası gönderildi:',
            info.messageId
        );


        return true;


    } catch (error) {

        console.error(
            '❌ TAN DİŞ KLİNİĞİ - Hastaya e-posta gönderilemedi:',
            error.message
        );

        return false;
    }
}