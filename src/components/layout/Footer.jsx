import React from 'react';
import { ShieldCheck, Command, CornerDownLeft, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-term-border bg-term-card/60 py-8 mt-16 text-xs text-term-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Shortcuts Reference */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-slate-400">
            <span className="font-medium text-slate-300">Quick Shortcuts:</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-term-surface border border-term-border font-mono text-[11px]">
              <kbd className="text-cyan-400">/</kbd> or <kbd className="text-cyan-400">Ctrl+K</kbd> Focus Search
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-term-surface border border-term-border font-mono text-[11px]">
              <kbd className="text-cyan-400">Esc</kbd> Clear / Close
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-term-surface border border-term-border font-mono text-[11px]">
              <kbd className="text-cyan-400">1-Click</kbd> Copy to Clipboard
            </span>
          </div>

          {/* Safety & Execution Boundary Pledge */}
          <div className="flex items-center gap-1.5 text-emerald-400/90 font-medium text-center">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>Zero Host Execution • 100% Client-Side Privacy</span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-term-border/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-500">
          <p>
            Pls-CLI: The Agentic Terminal Executor &copy; {new Date().getFullYear()}. Open Source under MIT License.
          </p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with React 18, Vite & Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
