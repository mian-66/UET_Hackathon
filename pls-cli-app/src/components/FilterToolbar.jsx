import React from 'react';
import {
  Filter,
  ArrowUpDown,
  ChevronDown,
  X,
  RotateCcw,
  ShieldAlert,
  Monitor,
  Terminal,
  UserCheck
} from 'lucide-react';
import {
  ALLOWED_CATEGORIES,
  ALLOWED_ROLES,
  ALLOWED_RISK_LEVELS,
  ALLOWED_OPERATING_SYSTEMS,
  ALLOWED_SHELLS
} from '../data/commands.js';

export function FilterToolbar({
  resultCount = 0,
  filters,
  onSetFilter,
  onRemoveFilter,
  onResetAllFilters,
  activeFiltersList = [],
  hasActiveFilters = false,
  categoryCounts = {}
}) {
  const categoryLabels = {
    all: 'All Commands',
    git: 'Git & GitHub',
    files: 'Files & Storage',
    node: 'Node.js & npm',
    frontend: 'Frontend Tooling',
    backend: 'Backend & Docker',
    system: 'System & Network'
  };

  const sortOptions = [
    { id: 'relevance', label: 'Relevance' },
    { id: 'title-asc', label: 'Alphabetical (A-Z)' },
    { id: 'title-desc', label: 'Alphabetical (Z-A)' },
    { id: 'risk-asc', label: 'Risk (Safe first)' },
    { id: 'risk-desc', label: 'Risk (Critical first)' }
  ];

  return (
    <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
      {/* Top Row: Category Pills Scrollable Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#1E293B] scrollbar-none">
        {['all', ...ALLOWED_CATEGORIES].map((catId) => {
          const isActive = filters.category === catId;
          const count = categoryCounts[catId] ?? 0;
          return (
            <button
              key={catId}
              onClick={() => onSetFilter('category', catId)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all shrink-0 ${
                isActive
                  ? 'bg-lime-400/20 text-lime-300 border border-lime-400/50 font-bold shadow-lime-subtle'
                  : 'bg-[#182234] hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-[#1E293B]'
              }`}
            >
              <span>{categoryLabels[catId] || catId}</span>
              <span className="ml-1.5 text-[10px] opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Middle Row: Multi-Faceted Dropdown Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Role Filter */}
          <div className="relative flex items-center">
            <span className="hidden sm:flex items-center gap-1 text-slate-400 mr-1.5 text-[11px]">
              <UserCheck className="w-3.5 h-3.5 text-lime-400" />
              <span>Role:</span>
            </span>
            <div className="relative">
              <select
                value={filters.role}
                onChange={(e) => onSetFilter('role', e.target.value)}
                className="appearance-none bg-[#182234] border border-[#1E293B] hover:border-slate-700 rounded-lg pl-2.5 pr-7 py-1 text-xs text-slate-200 focus:outline-none focus:border-lime-400/50 cursor-pointer"
                aria-label="Filter by Role"
              >
                <option value="all">All Roles</option>
                {ALLOWED_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Operating System Filter */}
          <div className="relative flex items-center">
            <span className="hidden sm:flex items-center gap-1 text-slate-400 mr-1.5 text-[11px]">
              <Monitor className="w-3.5 h-3.5 text-lime-400" />
              <span>OS:</span>
            </span>
            <div className="relative">
              <select
                value={filters.os}
                onChange={(e) => onSetFilter('os', e.target.value)}
                className="appearance-none bg-[#182234] border border-[#1E293B] hover:border-slate-700 rounded-lg pl-2.5 pr-7 py-1 text-xs text-slate-200 focus:outline-none focus:border-lime-400/50 cursor-pointer"
                aria-label="Filter by Operating System"
              >
                <option value="all">All OS</option>
                {ALLOWED_OPERATING_SYSTEMS.map((os) => (
                  <option key={os} value={os}>
                    {os.toUpperCase()}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Shell Filter */}
          <div className="relative flex items-center">
            <span className="hidden sm:flex items-center gap-1 text-slate-400 mr-1.5 text-[11px]">
              <Terminal className="w-3.5 h-3.5 text-lime-400" />
              <span>Shell:</span>
            </span>
            <div className="relative">
              <select
                value={filters.shell}
                onChange={(e) => onSetFilter('shell', e.target.value)}
                className="appearance-none bg-[#182234] border border-[#1E293B] hover:border-slate-700 rounded-lg pl-2.5 pr-7 py-1 text-xs text-slate-200 focus:outline-none focus:border-lime-400/50 cursor-pointer"
                aria-label="Filter by Shell"
              >
                <option value="all">All Shells</option>
                {ALLOWED_SHELLS.map((sh) => (
                  <option key={sh} value={sh}>
                    {sh}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Risk Level Filter */}
          <div className="relative flex items-center">
            <span className="hidden sm:flex items-center gap-1 text-slate-400 mr-1.5 text-[11px]">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Risk:</span>
            </span>
            <div className="relative">
              <select
                value={typeof filters.riskLevels === 'string' ? filters.riskLevels : 'all'}
                onChange={(e) => onSetFilter('riskLevels', e.target.value)}
                className="appearance-none bg-[#182234] border border-[#1E293B] hover:border-slate-700 rounded-lg pl-2.5 pr-7 py-1 text-xs text-slate-200 focus:outline-none focus:border-lime-400/50 cursor-pointer"
                aria-label="Filter by Risk Level"
              >
                <option value="all">All Risk</option>
                {ALLOWED_RISK_LEVELS.map((rl) => (
                  <option key={rl} value={rl}>
                    {rl.toUpperCase()}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 flex items-center gap-1 text-[11px]">
            <ArrowUpDown className="w-3.5 h-3.5 text-lime-400" />
            <span className="hidden sm:inline">Sort:</span>
          </span>
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) => onSetFilter('sortBy', e.target.value)}
              className="appearance-none bg-[#182234] border border-[#1E293B] hover:border-slate-700 rounded-lg pl-2.5 pr-7 py-1 text-xs text-slate-200 focus:outline-none focus:border-lime-400/50 cursor-pointer"
              aria-label="Sort commands"
            >
              {sortOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Bottom Row: Active Filter Pills & Results Feedback */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1E293B]/60 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-slate-400 text-[11px] mr-1">
            Found <span className="text-lime-400 font-bold">{resultCount}</span> {resultCount === 1 ? 'command' : 'commands'}:
          </span>

          {/* Active Filter Badges */}
          {activeFiltersList.map((item) => (
            <span
              key={item.key}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#182234] border border-lime-400/30 text-lime-300 font-mono text-[11px] animate-fade-in"
            >
              <span>{item.label}</span>
              <button
                onClick={() => onRemoveFilter(item.key)}
                className="hover:text-white p-0.5 rounded hover:bg-slate-700"
                aria-label={`Remove filter ${item.label}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Global Reset Trigger */}
        {hasActiveFilters && (
          <button
            onClick={onResetAllFilters}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 font-mono text-xs transition-colors shrink-0"
            title="Reset all filters and query"
          >
            <RotateCcw className="w-3.5 h-3.5 text-lime-400" />
            <span>Clear All Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
