import React from 'react';
import { Terminal, RotateCcw, HelpCircle } from 'lucide-react';

export function EmptyState({
  query,
  onResetFilters,
  onTryQuery
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-term-border rounded-2xl bg-term-card/40 my-6">
      <div className="w-12 h-12 rounded-xl bg-term-surface border border-term-border flex items-center justify-center text-slate-400 mb-4 shadow-inner">
        <Terminal className="w-6 h-6 text-cyan-400" />
      </div>

      <h3 className="text-base font-semibold text-white mb-1 font-mono">
        No terminal commands found
      </h3>

      <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6">
        {query ? (
          <>
            No matching recipes or commands found for <span className="text-cyan-300 font-mono">"{query}"</span> under the active filters.
          </>
        ) : (
          'No commands match the selected filter combination.'
        )}
      </p>

      {/* Suggested Alternative Queries */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2 max-w-md">
        <span className="text-xs text-slate-500 w-full mb-1">Try common queries instead:</span>
        {['git reset', 'kill port', 'find files', 'docker prune', 'chmod'].map((keyword) => (
          <button
            key={keyword}
            onClick={() => onTryQuery(keyword)}
            className="px-2.5 py-1 rounded-md text-xs font-mono bg-term-surface hover:bg-term-border text-slate-300 hover:text-white border border-term-border transition-colors"
          >
            {keyword}
          </button>
        ))}
      </div>

      <button
        onClick={onResetFilters}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-medium transition-all shadow-sm"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset all filters and search</span>
      </button>
    </div>
  );
}

