import dotenv from 'dotenv';
dotenv.config();

/**
 * TAN DİŞ KLİNİĞİ - WhatsApp Bildirim Servisi
 * @param {Object} contactData - Randevu ve iletişim formu verileri
 */
export async function sendWhatsAppNotification(contactData) {
    try {
        const phone = process.env.CALLMEBOT_PHONE || process.env.WHATSAPP_RECIPIENT_PHONE;
        const apiKey = process.env.CALLMEBOT_API_KEY;

        const messageText = 
`🦷 TAN DİŞ KLİNİĞİ - Yeni Randevu & İletişim Talebi

Ad Soyad: ${contactData.name || ''}
E-posta: ${contactData.email || ''}
Telefon: ${contactData.phone || ''}
Tedavi / Konu: ${contactData.subject || ''}
Hasta Şikayeti / Mesaj: ${contactData.message || ''}`;

        console.log('📱 TAN DİŞ KLİNİĞİ - WhatsApp Bildirimi Gönderiliyor...');
        console.log('--------------------------------------------------');
        console.log(messageText);
        console.log('--------------------------------------------------');

        if (!apiKey || apiKey === 'YOUR_CALLMEBOT_API_KEY' || !phone) {
            console.warn('⚠️  [WhatsApp Service Info] CALLMEBOT_API_KEY veya CALLMEBOT_PHONE henüz .env dosyasına tanımlanmadı.');
            console.log('✅ [WhatsApp Simülasyonu] Tan Diş Kliniği bildirim metni sorunsuz loglandı.');
            return { 
                success: true, 
                simulated: true, 
                message: 'API Key henüz girilmediği için bildirim simüle edildi.' 
            };
        }

        const encodedText = encodeURIComponent(messageText);
        const url = `https://api.callmebot.com/whatsapp.php?phone=${phone.replace(/\+/g, '')}&text=${encodedText}&apikey=${apiKey}`;

        const response = await fetch(url, { method: 'GET' });
        const responseText = await response.text();

        if (response.ok && (responseText.includes('Success') || responseText.includes('queued') || responseText.includes('Message'))) {
            console.log('✅ [TAN DİŞ KLİNİĞİ WhatsApp]: Randevu bildirimi telefonunuza başarıyla iletildi!', responseText);
            return { success: true, response: responseText };
        } else {
            console.error('❌ [CallMeBot API Yanıt Hatası]:', responseText);
            return { success: false, response: responseText };
        }

    } catch (error) {
        console.error('❌ [WhatsApp Servis Hatası]:', error.message || error);
        return { success: false, error: error.message };
    }
}
