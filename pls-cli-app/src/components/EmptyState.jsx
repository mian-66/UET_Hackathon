import React from 'react';
import {
  Star,
  Clock,
  SearchX,
  RotateCcw,
  Lightbulb,
  Compass,
  ArrowRight
} from 'lucide-react';

/**
 * Reusable Empty State Component
 * Supports: 'favorites', 'recent', 'search', and 'default'
 */
export function EmptyState({
  type = 'search',
  query = '',
  onResetFilters,
  onExploreAll,
  onTryQuery
}) {
  if (type === 'favorites') {
    return (
      <div
        role="region"
        aria-label="No starred commands"
        className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-[#1E293B] rounded-2xl bg-[#0F172A]/40 my-6 max-w-2xl mx-auto space-y-5 animate-in fade-in duration-200"
      >
        <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-sm">
          <Star className="w-7 h-7 fill-amber-400/20" />
        </div>

        <div className="space-y-2 max-w-md">
          <h3 className="text-lg font-bold text-white font-mono">
            No Starred Commands Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
            Star commands to pin them here for rapid offline reference. Your starred workflows are saved locally and accessible anytime.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {onExploreAll && (
            <button
              onClick={onExploreAll}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-mono text-xs font-bold transition-all shadow-lime-glow active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>Explore All Commands</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  if (type === 'recent') {
    return (
      <div
        role="region"
        aria-label="No recent commands"
        className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-[#1E293B] rounded-2xl bg-[#0F172A]/40 my-6 max-w-2xl mx-auto space-y-5 animate-in fade-in duration-200"
      >
        <div className="w-14 h-14 rounded-2xl bg-[#182234] border border-[#1E293B] flex items-center justify-center text-slate-400 shadow-inner">
          <Clock className="w-7 h-7 text-lime-400" />
        </div>

        <div className="space-y-2 max-w-md">
          <h3 className="text-lg font-bold text-white font-mono">
            No Recent Command History
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
            Commands you inspect or copy will automatically appear here in your LRU history for immediate recall.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {onExploreAll && (
            <button
              onClick={onExploreAll}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-mono text-xs font-bold transition-all shadow-lime-glow active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>Browse Command Catalog</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Zero-search results state
  const popularWorkflows = [
    'git status',
    'kill port 3000',
    'find large files',
    'docker prune',
    'clean npm cache'
  ];

  return (
    <div
      role="region"
      aria-label="No matching commands"
      className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed border-[#1E293B] rounded-2xl bg-[#0F172A]/40 my-6 max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200"
    >
      <div className="w-14 h-14 rounded-2xl bg-[#182234] border border-[#1E293B] flex items-center justify-center text-slate-400 shadow-inner">
        <SearchX className="w-7 h-7 text-lime-400 animate-pulse" />
      </div>

      <div className="space-y-2 max-w-md">
        <h3 className="text-lg font-bold text-white font-mono">
          No matching terminal commands found
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
          {query ? (
            <>
              No executable commands scored for query{' '}
              <span className="text-lime-300 font-mono">"{query}"</span> under current active filters.
            </>
          ) : (
            'No commands match the current active filter combination.'
          )}
        </p>
      </div>

      {/* Recommendations Box */}
      <div className="w-full max-w-lg p-4 rounded-xl bg-[#0B0F19] border border-[#1E293B] text-left text-xs space-y-2 font-mono text-slate-300">
        <div className="flex items-center gap-1.5 text-lime-400 font-bold mb-1">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Search &amp; Filter Suggestions:</span>
        </div>
        <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px] leading-relaxed">
          <li>
            Try broadening keywords (e.g.{' '}
            <span className="text-slate-200">"status"</span> instead of{' '}
            <span className="text-slate-200">"git working tree status"</span>).
          </li>
          <li>Clear specific OS or Shell constraints to see cross-platform alternatives.</li>
          <li>Check for syntax typos or reset active role/category filters.</li>
        </ul>
      </div>

      {/* Suggested Queries */}
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-md">
        <span className="text-xs font-mono text-slate-400 w-full mb-1">
          Try popular queries:
        </span>
        {popularWorkflows.map((kw) => (
          <button
            key={kw}
            onClick={() => onTryQuery && onTryQuery(kw)}
            className="px-2.5 py-1 rounded-md text-xs font-mono bg-[#182234] hover:bg-slate-800 text-slate-300 hover:text-white border border-[#1E293B] transition-colors"
          >
            $ {kw}
          </button>
        ))}
      </div>

      {/* Reset Action */}
      {onResetFilters && (
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-mono text-xs font-bold transition-all shadow-lime-glow active:scale-95"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Search &amp; Filters</span>
        </button>
      )}
    </div>
  );
}

