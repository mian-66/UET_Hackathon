import React from 'react';
import { ShieldCheck, Github, Terminal, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[#1E293B] bg-[#0B0F19] py-10 mt-20 text-xs font-mono text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-white tracking-tight">pls-cli</span>
            <span className="text-slate-400">&bull;</span>
            <span>The Agentic Terminal Executor</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero Host Execution</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[11px]">
              MIT License
            </span>
            <span className="px-2 py-0.5 rounded bg-lime-400/10 border border-lime-400/30 text-lime-400 text-[11px]">
              Hackathon Edition
            </span>
          </div>
        </div>

        <div className="pt-6 border-t border-[#1E293B]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
          <div>
            Built with React 18, Vite, and Tailwind CSS. Offline-first client architecture.
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-lime-400 transition-colors"
            >
              GitHub Source
            </a>
            <a href="#" className="hover:text-lime-400 transition-colors">
              Documentation
            </a>
            <a href="#" className="hover:text-lime-400 transition-colors">
              Report Issue
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

