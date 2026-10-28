import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';

export function ShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const SHORTCUTS = [
    { key: '/', desc: 'Focus the natural-language search bar' },
    { key: 'Ctrl + K / Cmd + K', desc: 'Alternative focus shortcut for search bar' },
    { key: 'Esc', desc: 'Clear search input or close modal / inspector' },
    { key: 'Click Syntax', desc: 'Instantly copies command to clipboard' },
    { key: 'Star Icon', desc: 'Bookmarks command to local storage favorites' },
    { key: 'Inspect Button', desc: 'Opens deep parameter, flag & safety breakdown' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md rounded-2xl bg-term-card border border-term-border shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-term-border mb-4">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white font-mono">
              Keyboard Shortcuts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-term-surface transition-colors"
            aria-label="Close shortcuts dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {SHORTCUTS.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between p-2.5 rounded-lg bg-term-surface/70 border border-term-border text-xs"
            >
              <span className="text-slate-300">{s.desc}</span>
              <kbd className="px-2 py-1 rounded bg-term-bg border border-term-border font-mono text-cyan-400 font-semibold shrink-0 ml-2">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-term-border/40 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-medium font-mono transition-colors"
          >
            Got it (Esc)
          </button>
        </div>
      </div>
    </div>
  );
}

