import React from 'react';
import { CATEGORIES, ROLES } from '../data/mockCommands.js';
import { Filter, ArrowUpDown, ChevronDown } from 'lucide-react';

export function FilterToolbar({
  resultCount = 0,
  selectedCategory,
  onCategoryChange,
  selectedRole,
  onRoleChange,
  sortBy,
  onSortChange
}) {
  const sortOptions = [
    { id: 'relevance', label: 'Relevance' },
    { id: 'alpha', label: 'Alphabetical (A-Z)' },
    { id: 'risk', label: 'Risk Level (Safe first)' },
    { id: 'risk-desc', label: 'Risk Level (Destructive first)' }
  ];

  return (
    <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-4 sm:p-5 shadow-lg space-y-4">
      {/* Top Row: Category Pills & Result Counter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1E293B] pb-3">
        {/* Horizontal Category Nav */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-lime-400/20 text-lime-300 border border-lime-400/50 font-bold shadow-lime-subtle'
                    : 'bg-[#182234] hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-[#1E293B]'
                }`}
              >
                <span>{cat.label}</span>
                <span className="ml-1.5 text-[10px] opacity-60">({cat.count})</span>
              </button>
            );
          })}
        </div>

        {/* Result Counter */}
        <div className="text-xs font-mono text-slate-400 shrink-0">
          Showing <span className="text-lime-400 font-bold">{resultCount}</span> {resultCount === 1 ? 'command' : 'commands'}
        </div>
      </div>

      {/* Bottom Row: Role Filter Group & Sort Dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Role Toggle Group */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-400 font-mono flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-lime-400" />
            <span>Target Role:</span>
          </span>
          <div className="inline-flex rounded-lg bg-[#182234] p-1 border border-[#1E293B]">
            {ROLES.map((role) => {
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => onRoleChange(role.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
                    isSelected
                      ? 'bg-lime-400 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {role.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 font-mono">
          <span className="text-slate-400 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-lime-400" />
            <span>Sort:</span>
          </span>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none bg-[#182234] border border-[#1E293B] hover:border-slate-700 rounded-lg pl-3 pr-8 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-lime-400/50 cursor-pointer transition-colors"
              aria-label="Sort commands"
            >
              {sortOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}

