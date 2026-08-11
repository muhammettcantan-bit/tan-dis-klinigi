import React from 'react';
import { ToastState } from '../types';

interface ToastProps {
    toasts: ToastState[];
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts }) => {
    return (
        <div class="toast-container" aria-live="polite">
            {toasts.map((toast) => (
                <div key={toast.id} class="toast" role="status">
                    <span class="toast-icon">{toast.icon || (toast.type === 'error' ? '⚠️' : '✅')}</span>
                    <span class="toast-message">{toast.message}</span>
                </div>
            ))}
        </div>
    );
};
