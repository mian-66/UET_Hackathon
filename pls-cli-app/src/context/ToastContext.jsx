import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  // Dismiss a toast by id
  const dismissToast = useCallback((id) => {
    if (timersRef.current.has(id)) {
      clearTimeout(timersRef.current.get(id));
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Schedule auto-dismiss
  const scheduleDismiss = useCallback(
    (id, duration = 2500) => {
      if (timersRef.current.has(id)) {
        clearTimeout(timersRef.current.get(id));
      }
      const timer = setTimeout(() => {
        dismissToast(id);
      }, duration);
      timersRef.current.set(id, timer);
    },
    [dismissToast]
  );

  // Pause dismiss on hover
  const pauseDismiss = useCallback((id) => {
    if (timersRef.current.has(id)) {
      clearTimeout(timersRef.current.get(id));
      timersRef.current.delete(id);
    }
  }, []);

  // Resume dismiss on hover leave
  const resumeDismiss = useCallback(
    (id, remaining = 1500) => {
      scheduleDismiss(id, remaining);
    },
    [scheduleDismiss]
  );

  // Trigger a new toast notification
  const showToast = useCallback(
    (message, type = 'success', duration = 2500) => {
      const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
      const newToast = { id, message, type, duration };

      setToasts((prev) => [...prev.slice(-3), newToast]); // Keep up to 4 toasts max in stack
      scheduleDismiss(id, duration);
      return id;
    },
    [scheduleDismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast, dismissToast }}>
      {children}

      {/* Floating Toast Notification Stack (Bottom-Right) */}
      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
        aria-live="polite"
        role="region"
        aria-label="Notifications"
      >
        {toasts.map((toast) => {
          const typeStyles = {
            success: {
              border: 'border-lime-500/30 bg-[#0F172A]/95 text-slate-100',
              icon: <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />,
              accent: 'bg-lime-400'
            },
            warning: {
              border: 'border-amber-500/40 bg-[#0F172A]/95 text-slate-100',
              icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
              accent: 'bg-amber-400'
            },
            error: {
              border: 'border-rose-500/40 bg-[#0F172A]/95 text-slate-100',
              icon: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
              accent: 'bg-rose-400'
            },
            info: {
              border: 'border-cyan-500/30 bg-[#0F172A]/95 text-slate-100',
              icon: <Info className="w-4 h-4 text-cyan-400 shrink-0" />,
              accent: 'bg-cyan-400'
            }
          };

          const style = typeStyles[toast.type] || typeStyles.info;

          return (
            <div
              key={toast.id}
              onMouseEnter={() => pauseDismiss(toast.id)}
              onMouseLeave={() => resumeDismiss(toast.id, 1500)}
              className={`pointer-events-auto relative overflow-hidden flex items-center justify-between gap-3 px-4 py-3 rounded-xl border ${style.border} shadow-2xl backdrop-blur-md text-xs font-mono transition-all transform animate-in fade-in slide-in-from-bottom-2 duration-200`}
              role="alert"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                {style.icon}
                <span className="truncate">{toast.message}</span>
              </div>

              <button
                onClick={() => dismissToast(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded-md transition-colors shrink-0"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

