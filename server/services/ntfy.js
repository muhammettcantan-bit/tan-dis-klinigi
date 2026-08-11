export async function sendNtfyNotification(message) {
    try {

        console.log("📱 ntfy fonksiyonu çalıştı");

        const topic = process.env.NTFY_TOPIC;

        console.log("📢 NTFY_TOPIC:", topic);

        if (!topic) {
            console.log("NTFY_TOPIC bulunamadı.");
            return {
                success: false,
                message: "NTFY_TOPIC eksik"
            };
        }

        await fetch(`https://ntfy.sh/${topic}`, {
            method: "POST",
            body: message
        });

        console.log("✅ ntfy gönderildi");

        return {
            success: true,
            message: "Bildirim gönderildi"
        };

    } catch (error) {
        console.error("❌ ntfy hatası:", error);
        return {
            success: false,
            error: error.message
        };
    }
}