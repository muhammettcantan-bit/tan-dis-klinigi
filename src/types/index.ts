export interface ContactMessage {
    id: number;
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    file_path?: string | null;
    file_name?: string | null;
    reply_text?: string | null;
    replied_at?: string | null;
    is_replied?: number | boolean;
    is_read: number | boolean;
    created_at: string;
}

export interface AdminStats {
    total: number;
    unread: number;
    today: number;
    thisMonth: number;
}

export interface ToastState {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
    icon?: string;
}
