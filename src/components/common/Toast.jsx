import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer({ toasts = [], onRemove }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-lg border shadow-xl backdrop-blur-md animate-slide-up transition-all ${
              isSuccess
                ? 'bg-term-surface/95 border-emerald-500/40 text-emerald-300'
                : isWarning
                ? 'bg-term-surface/95 border-amber-500/40 text-amber-300'
                : isError
                ? 'bg-term-surface/95 border-rose-500/40 text-rose-300'
                : 'bg-term-surface/95 border-term-border text-term-text'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {isWarning && <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
              {isError && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              {!isSuccess && !isWarning && !isError && <Info className="w-4 h-4 text-cyan-400 shrink-0" />}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            {onRemove && (
              <button
                onClick={() => onRemove(toast.id)}
                className="text-slate-400 hover:text-white p-1 rounded transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
