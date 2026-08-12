import { ContactMessage, AdminStats } from '../types';

const API_BASE = 'https://tan-dis-klinigi-api.onrender.com/api';

function getAuthHeaders() {
    const token = localStorage.getItem('antigravity_admin_token');

    return {
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

export async function submitContactForm(formDataToSend: FormData) {
    const response = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        body: formDataToSend
    });

    const text = await response.text();

    let data: any;

    try {
        data = text ? JSON.parse(text) : {};
    } catch {
        console.error('Sunucudan gelen cevap JSON değil:', text);

        throw new Error(
            `Sunucu geçersiz cevap döndürdü. HTTP ${response.status}`
        );
    }

    if (!response.ok) {
        throw new Error(
            data.message || 'Mesaj gönderilirken hata oluştu.'
        );
    }

    return data;
}

export async function adminLogin(username: string, password: string) {
    const response = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Giriş başarısız.');
    }

    return data;
}

export async function fetchAdminStats() {
    const response = await fetch(`${API_BASE}/admin/stats`, {
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || 'İstatistikler yüklenemedi.'
        );
    }

    return data.stats as AdminStats;
}

export async function fetchAdminMessages(filters: {
    search?: string;
    name?: string;
    email?: string;
    phone?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
}) {
    const queryParams = new URLSearchParams();

    if (filters.search) queryParams.append('search', filters.search);
    if (filters.name) queryParams.append('name', filters.name);
    if (filters.email) queryParams.append('email', filters.email);
    if (filters.phone) queryParams.append('phone', filters.phone);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);

    const response = await fetch(
        `${API_BASE}/admin/messages?${queryParams.toString()}`,
        {
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || 'Mesajlar yüklenemedi.'
        );
    }

    return data.messages as ContactMessage[];
}

export async function sendAdminReply(
    id: number,
    replyText: string
) {
    const response = await fetch(
        `${API_BASE}/admin/messages/${id}/reply`,
        {
            method: 'POST',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                replyText
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || 'Yanıt gönderilemedi.'
        );
    }

    return data;
}

export async function toggleMessageReadStatus(
    id: number,
    is_read: boolean
) {
    const response = await fetch(
        `${API_BASE}/admin/messages/${id}/read`,
        {
            method: 'PATCH',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                is_read
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || 'Durum güncellenemedi.'
        );
    }

    return data;
}

export async function deleteAdminMessage(id: number) {
    const response = await fetch(
        `${API_BASE}/admin/messages/${id}`,
        {
            method: 'DELETE',
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'application/json'
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || 'Mesaj silinemedi.'
        );
    }

    return data;
}