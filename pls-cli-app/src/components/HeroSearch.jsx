import React, { useRef, useState } from 'react';
import { Search, X, Sparkles, Terminal, CornerDownLeft, Clock, Trash2 } from 'lucide-react';

export function HeroSearch({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  recentSearches = [],
  onClearRecentSearches
}) {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  const suggestionChips = [
    { label: "Undo last Git commit", query: "undo last commit soft" },
    { label: "Kill process on port 3000", query: "kill port 3000" },
    { label: "Find files over 100MB", query: "find large files 100M" },
    { label: "Purge Docker volumes", query: "docker prune volumes" },
    { label: "Clean npm cache", query: "npm cache clean" },
    { label: "Harden web permissions", query: "chmod 755 644" }
  ];

  const handleClear = () => {
    onSearchChange('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClear();
    } else if (e.key === 'Enter') {
      if (onSearchSubmit) onSearchSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto text-center space-y-5 pt-4 pb-2">
      {/* Eyebrow badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/30 text-xs font-mono text-lime-400">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Deterministic Natural-Language Terminal Translator</span>
      </div>

      {/* Hero Headline & Subtitle */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-mono leading-tight">
          What do you want your{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-emerald-400">
            terminal
          </span>{' '}
          to do?
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Type tasks in plain English. Pls-CLI expands intent synonyms and calculates weighted relevance across 52+ production commands with zero latency.
        </p>
      </div>

      {/* Oversized Input Container */}
      <div className="relative group max-w-3xl mx-auto">
        <div className="absolute -inset-1 bg-gradient-to-r from-lime-400/20 via-emerald-400/10 to-lime-400/20 rounded-2xl blur-lg opacity-40 group-focus-within:opacity-100 transition duration-300" />

        <div className="relative flex items-center bg-[#0F172A] border-2 border-[#1E293B] group-focus-within:border-lime-400 rounded-2xl shadow-card-elevated overflow-hidden transition-all">
          <div className="pl-5 pr-2 text-lime-400 font-mono font-bold text-lg select-none flex items-center">
            <span className="text-slate-400 mr-2 font-normal">$</span>pls
          </div>

          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. show files, undo commit soft, kill port 3000, docker purge..."
            className="w-full py-4 px-2 bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none font-mono"
            autoComplete="off"
            spellCheck="false"
          />

          <div className="pr-3 flex items-center gap-2">
            {searchQuery ? (
              <button
                onClick={handleClear}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Clear query (Esc)"
                aria-label="Clear query"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-[11px] font-mono text-slate-400 select-none">
                <kbd className="text-lime-400 font-bold">/</kbd>
              </div>
            )}

            <button
              onClick={onSearchSubmit}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-mono font-bold text-xs shadow-lime-glow transition-all active:scale-95 shrink-0"
              aria-label="Search"
            >
              <span>Translate</span>
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Searches Pills (when query is empty or input is focused) */}
      {recentSearches && recentSearches.length > 0 && !searchQuery && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 text-xs animate-in fade-in duration-150">
          <span className="text-slate-400 font-mono flex items-center gap-1 mr-1">
            <Clock className="w-3.5 h-3.5 text-lime-400/80" />
            <span>Recent Searches:</span>
          </span>
          {recentSearches.map((term) => (
            <button
              key={term}
              onClick={() => {
                onSearchChange(term);
                if (onSearchSubmit) onSearchSubmit();
              }}
              className="px-2.5 py-1 rounded-full text-xs font-mono bg-[#182234] hover:bg-slate-800 text-lime-300 hover:text-white border border-[#1E293B] hover:border-lime-400/30 transition-all"
            >
              "{term}"
            </button>
          ))}
          {onClearRecentSearches && (
            <button
              onClick={onClearRecentSearches}
              className="p-1 text-slate-500 hover:text-rose-400 transition-colors rounded"
              title="Clear recent searches"
              aria-label="Clear recent searches"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Suggested Quick Prompts */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs">
        <span className="text-slate-400 font-mono flex items-center gap-1 mr-1">
          <Terminal className="w-3.5 h-3.5 text-lime-400" />
          <span>Quick Prompts:</span>
        </span>
        {suggestionChips.map((chip) => (
          <button
            key={chip.label}
            onClick={() => onSearchChange(chip.query)}
            className={`px-3 py-1 rounded-full text-xs font-mono transition-all ${
              searchQuery === chip.query
                ? 'bg-lime-400/20 text-lime-300 border border-lime-400/50 shadow-sm'
                : 'bg-[#182234] hover:bg-slate-800 text-slate-300 hover:text-white border border-[#1E293B]'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}
