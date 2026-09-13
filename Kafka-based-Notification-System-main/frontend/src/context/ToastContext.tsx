import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Notification Container (Google Material 3 Snackbars) */}
      <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 max-w-md w-[92%] sm:w-auto pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-google-lg text-sm font-medium transition-all duration-300 animate-toast-in border ${
              toast.type === 'success'
                ? 'bg-[#e6f4ea] text-[#137333] border-[#ceead6] dark:bg-[#0d2818] dark:text-[#81c995] dark:border-[#1e4620]'
                : toast.type === 'error'
                ? 'bg-[#fce8e6] text-[#c5221f] border-[#fad2cf] dark:bg-[#371514] dark:text-[#f28b82] dark:border-[#5c2423]'
                : 'bg-[#1f1f1f] text-white border-[#3c4043] dark:bg-[#28292a] dark:text-[#e3e3e3]'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 text-[#1e8e3e] dark:text-[#81c995]" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0 text-[#d93025] dark:text-[#f28b82]" />}
            {toast.type === 'info' && <Info className="w-4 h-4 shrink-0 text-[#1a73e8] dark:text-[#8ab4f8]" />}
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
