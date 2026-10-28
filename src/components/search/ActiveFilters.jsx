import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { CATEGORIES, PERSONAS, SHELLS, RISK_FILTERS } from '../../data/commands/index.js';

export function ActiveFilters({
  query,
  selectedCategory,
  selectedPersona,
  selectedShell,
  selectedRisk,
  onResetFilters,
  onClearQuery,
  onResetCategory,
  onResetPersona,
  onResetShell,
  onResetRisk,
  totalMatches,
  totalCommands
}) {
  const hasActive =
    query.trim() ||
    selectedCategory !== 'all' ||
    selectedPersona !== 'all' ||
    selectedShell !== 'all' ||
    selectedRisk !== 'all';

  const categoryLabel = CATEGORIES.find((c) => c.id === selectedCategory)?.label;
  const personaLabel = PERSONAS.find((p) => p.id === selectedPersona)?.label;
  const shellLabel = SHELLS.find((s) => s.id === selectedShell)?.label;
  const riskLabel = RISK_FILTERS.find((r) => r.id === selectedRisk)?.label;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-2 text-xs border-b border-term-border/40">
      {/* Result Metrics */}
      <div className="text-slate-400 font-mono">
        Showing <span className="text-cyan-400 font-semibold">{totalMatches}</span> of{' '}
        <span className="text-slate-300">{totalCommands}</span> commands
      </div>

      {/* Filter Badges & Reset Button */}
      {hasActive && (
        <div className="flex flex-wrap items-center gap-2">
          {query && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono">
              <span>query: "{query}"</span>
              <button onClick={onClearQuery} className="hover:text-white" aria-label="Clear query">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-term-surface border border-term-border text-slate-300">
              <span>category: {categoryLabel}</span>
              <button onClick={onResetCategory} className="hover:text-white" aria-label="Clear category">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedPersona !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/15 border border-purple-500/30 text-purple-300">
              <span>persona: {personaLabel}</span>
              <button onClick={onResetPersona} className="hover:text-white" aria-label="Clear persona">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedShell !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono">
              <span>shell: {shellLabel}</span>
              <button onClick={onResetShell} className="hover:text-white" aria-label="Clear shell">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedRisk !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300">
              <span>risk: {riskLabel}</span>
              <button onClick={onResetRisk} className="hover:text-white" aria-label="Clear risk">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-slate-400 hover:text-white hover:bg-term-surface transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>
      )}
    </div>
  );
}

