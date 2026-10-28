import React from 'react';
import {
  CATEGORIES,
  PERSONAS,
  SHELLS,
  RISK_FILTERS
} from '../../data/commands/index.js';
import {
  Terminal,
  GitBranch,
  Folder,
  Package,
  Activity,
  FileText,
  Server,
  Flame,
  Star,
  Clock,
  Filter,
  ShieldAlert
} from 'lucide-react';

const CATEGORY_ICON_MAP = {
  Terminal,
  GitBranch,
  Folder,
  Package,
  Activity,
  FileText,
  Server,
  Flame
};

export function FilterBar({
  selectedCategory,
  onCategoryChange,
  selectedPersona,
  onPersonaChange,
  selectedShell,
  onShellChange,
  selectedRisk,
  onRiskChange,
  activeTab,
  onTabChange,
  favoritesCount = 0,
  historyCount = 0
}) {
  return (
    <div className="space-y-4">
      {/* Top View Mode Tabs: Explore, Favorites, History */}
      <div className="flex flex-wrap items-center justify-between border-b border-term-border pb-3 gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-term-surface/70 border border-term-border">
          <button
            onClick={() => onTabChange('explore')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'explore'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Explore Catalog</span>
          </button>

          <button
            onClick={() => onTabChange('favorites')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'favorites'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-mono">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onTabChange('history')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'history'
                ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Recently Copied</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-500/20 text-sky-300 font-mono">
                {historyCount}
              </span>
            )}
          </button>
        </div>

        {/* Global Shell Context Switcher */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 hidden sm:inline">Shell Context:</span>
          <select
            value={selectedShell}
            onChange={(e) => onShellChange(e.target.value)}
            className="bg-term-surface border border-term-border rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 font-mono"
            aria-label="Select Target Shell"
          >
            {SHELLS.map((shell) => (
              <option key={shell.id} value={shell.id}>
                {shell.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Domain Category Scrollable Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const IconComp = CATEGORY_ICON_MAP[cat.icon] || Terminal;
          const isActive = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-glow-cyan'
                  : 'bg-term-surface/80 hover:bg-term-border text-slate-400 hover:text-slate-200 border border-term-border/60'
              }`}
            >
              <IconComp className="w-3.5 h-3.5 shrink-0" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Secondary Multi-Faceted Filters (Persona & Risk) */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
        {/* Persona Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 font-medium mr-1 select-none flex items-center gap-1">
            <Filter className="w-3 h-3 text-cyan-400" />
            <span>Persona:</span>
          </span>
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              onClick={() => onPersonaChange(p.id)}
              className={`px-2 py-0.5 rounded text-xs transition-colors ${
                selectedPersona === p.id
                  ? 'bg-purple-500/25 text-purple-200 border border-purple-500/40 font-medium'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-term-surface'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Risk Level Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 font-medium mr-1 select-none flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-amber-400" />
            <span>Risk:</span>
          </span>
          {RISK_FILTERS.map((r) => {
            const isRiskActive = selectedRisk === r.id;
            return (
              <button
                key={r.id}
                onClick={() => onRiskChange(r.id)}
                className={`px-2 py-0.5 rounded text-xs transition-colors ${
                  isRiskActive
                    ? 'bg-term-border text-white border border-slate-500 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-term-surface'
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

