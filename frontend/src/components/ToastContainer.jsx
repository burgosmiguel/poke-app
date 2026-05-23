import React from 'react';
import { useToastStore } from '../stores/toast';

export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast toast--${toast.type}`}
          onClick={() => remove(toast.id)}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
