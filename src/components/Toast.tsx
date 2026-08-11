import React from 'react';
import { ToastState } from '../types';

interface ToastProps {
    toasts: ToastState[];
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts }) => {
    return (
        <div className="toast-container" aria-live="polite">
            {toasts.map((toast) => (
                <div key={toast.id} className="toast" role="status">
                    <span className="toast-icon">{toast.icon || (toast.type === 'error' ? '⚠️' : '✅')}</span>
                    <span className="toast-message">{toast.message}</span>
                </div>
            ))}
        </div>
    );
};
