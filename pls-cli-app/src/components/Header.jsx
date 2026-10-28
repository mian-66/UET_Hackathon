import React from 'react';
import {
  Menu,
  Search,
  Github,
  BookOpen,
  Sparkles,
  Star,
  ChevronDown,
  Monitor
} from 'lucide-react';

export function Header({
  onToggleSidebar,
  searchQuery,
  onSearchChange,
  selectedShell,
  onShellChange,
  onOpenAI
}) {
  const shells = [
    { id: 'bash', label: 'Linux (Bash/Zsh)' },
    { id: 'zsh', label: 'macOS (Zsh)' },
    { id: 'powershell', label: 'Windows (PowerShell)' },
    { id: 'cmd', label: 'Windows (CMD)' }
  ];

  return (
    <header className="h-16 border-b border-[#1E293B] bg-[#0B0F19]/90 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile Hamburger & Search Shortcut Input */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Toggle mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Quick Search Input */}
        <div className="relative w-full max-w-sm hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Quick search commands..."
            className="w-full bg-[#182234] border border-[#1E293B] focus:border-lime-400/50 rounded-lg pl-9 pr-12 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none font-mono transition-colors"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
              /
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Shell Selector, AI Launcher & Badges */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* OS / Shell Dropdown */}
        <div className="relative flex items-center">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400 mr-2 font-mono">
            <Monitor className="w-3.5 h-3.5 text-lime-400" />
            <span>Target OS:</span>
          </div>
          <div className="relative">
            <select
              value={selectedShell}
              onChange={(e) => onShellChange(e.target.value)}
              className="appearance-none bg-[#182234] border border-[#1E293B] hover:border-slate-700 rounded-lg pl-3 pr-8 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-lime-400/50 cursor-pointer transition-colors"
              aria-label="Select Target Shell"
            >
              {shells.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* AI Copilot Trigger */}
        <button
          onClick={onOpenAI}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-400/10 hover:bg-lime-400/20 border border-lime-400/30 text-lime-400 text-xs font-mono font-semibold transition-all shadow-sm"
          title="Open Agentic Gemma AI Workspace"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Gemma AI</span>
        </button>

        {/* Version Badge */}
        <span className="hidden xl:inline-block px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-800 border border-slate-700 text-slate-400">
          v0.1.0-alpha
        </span>

        {/* GitHub Star Button */}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#182234] hover:bg-slate-800 border border-[#1E293B] text-xs font-mono text-slate-300 transition-colors"
          aria-label="GitHub Repository"
        >
          <Github className="w-4 h-4" />
          <span className="hidden sm:inline">Star</span>
          <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 border border-slate-700 text-lime-400">
            ★ 1.2k
          </span>
        </a>
      </div>
    </header>
  );
}

