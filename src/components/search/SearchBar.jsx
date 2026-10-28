import React from 'react';
import { Search, X, Sparkles, Terminal } from 'lucide-react';

const SUGGESTION_PILLS = [
  { label: 'Undo git commit', query: 'undo commit soft' },
  { label: 'Kill stuck port 3000', query: 'kill port 3000' },
  { label: 'Find large files >100MB', query: 'large files 100M' },
  { label: 'Docker prune cache', query: 'docker system prune' },
  { label: 'Grep lines recursively', query: 'grep recursive lines' },
  { label: 'Switch Git to SSH', query: 'switch remote ssh' }
];

export function SearchBar({
  searchRef,
  query,
  onQueryChange,
  onClear,
  totalMatches,
  totalCommands
}) {
  return (
    <div className="w-full">
      {/* Main Search Input Container */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-sky-500/10 to-emerald-500/20 rounded-xl blur-md opacity-40 group-hover:opacity-75 group-focus-within:opacity-100 transition-all duration-300 -z-10" />

        <div className="relative flex items-center bg-term-card/95 border border-term-border group-focus-within:border-cyan-500/50 rounded-xl shadow-2xl transition-all">
          {/* Terminal prompt symbol */}
          <div className="pl-4 pr-2 text-cyan-400 flex items-center font-mono font-bold select-none text-base">
            <span className="text-slate-500 mr-1.5 font-normal">$</span>pls
          </div>

          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Describe what you want to do... (e.g., 'undo last commit', 'free port 3000', 'find large files')"
            className="w-full py-4 px-2 bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none font-mono"
            autoComplete="off"
            spellCheck="false"
          />

          {/* Right Action Icons: Clear / Hotkey hint */}
          <div className="pr-4 flex items-center gap-2">
            {query ? (
              <button
                onClick={onClear}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-term-surface transition-colors"
                title="Clear search (Esc)"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-term-surface border border-term-border text-[11px] font-mono text-slate-400 select-none">
                <span>Press</span>
                <kbd className="text-cyan-400 font-semibold px-1 rounded bg-term-border">/</kbd>
                <span>to search</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Suggested Quick Prompt Pills */}
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 flex items-center gap-1 select-none font-medium">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Try:</span>
        </span>
        {SUGGESTION_PILLS.map((pill) => (
          <button
            key={pill.label}
            onClick={() => onQueryChange(pill.query)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              query === pill.query
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-term-surface hover:bg-term-border text-slate-300 border border-term-border hover:text-white'
            }`}
          >
            {pill.label}
          </button>
        ))}
      </div>
    </div>
  );
}
