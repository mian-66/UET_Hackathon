import React from 'react';
import { Terminal, ShieldCheck, Github, Zap, BookOpen } from 'lucide-react';

export function Header({ totalCommands = 0, onOpenShortcuts }) {
  return (
    <header className="border-b border-term-border bg-term-card/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-glow-cyan">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white font-mono flex items-center">
                pls<span className="text-cyan-400 font-semibold">-cli</span>
              </h1>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                v1.0 MVP
              </span>
            </div>
            <p className="text-xs text-term-muted hidden sm:block">
              The Agentic Terminal Executor • Natural Language Translator
            </p>
          </div>
        </div>

        {/* Status Indicators & Metadata */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Total Commands Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-term-surface border border-term-border text-xs text-slate-300">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-mono font-medium text-cyan-400">{totalCommands}</span>
            <span>Commands Indexed</span>
          </div>

          {/* Offline Safe Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% Client-Side Safe</span>
          </div>

          {/* Help / Shortcuts Button */}
          {onOpenShortcuts && (
            <button
              onClick={onOpenShortcuts}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-term-surface transition-colors"
              title="Keyboard Shortcuts"
              aria-label="View Keyboard Shortcuts"
            >
              <BookOpen className="w-4 h-4" />
            </button>
          )}

          {/* GitHub Repo Link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-term-surface hover:bg-term-border/80 border border-term-border text-xs font-medium text-slate-200 transition-all"
            aria-label="View on GitHub"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}

