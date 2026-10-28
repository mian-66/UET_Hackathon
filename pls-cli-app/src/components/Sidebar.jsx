import React from 'react';
import {
  Terminal,
  Home,
  Layers,
  Star,
  Clock,
  GitBranch,
  Folder,
  Package,
  Layout,
  Server,
  Activity,
  X,
  Sparkles
} from 'lucide-react';
import { CATEGORIES } from '../data/mockCommands.js';

const CATEGORY_ICONS = {
  git: GitBranch,
  files: Folder,
  node: Package,
  frontend: Layout,
  backend: Server,
  system: Activity
};

export function Sidebar({
  isOpen,
  onClose,
  activeView,
  onViewChange,
  activeCategory,
  onCategoryChange,
  favoritesCount = 0,
  recentCount = 0,
  onOpenAI
}) {
  const primaryNav = [
    { id: 'overview', label: 'Home / Overview', icon: Home },
    { id: 'all', label: 'All Commands', icon: Layers },
    { id: 'favorites', label: 'Favorites', icon: Star, count: favoritesCount },
    { id: 'recent', label: 'Recent Commands', icon: Clock, count: recentCount }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0B0F19] border-r border-[#1E293B] select-none text-slate-300">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-lime-400/10 border border-lime-400/30 flex items-center justify-center text-lime-400 shadow-lime-subtle">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-bold text-base text-white tracking-tight">pls</span>
              <span className="font-mono font-bold text-base text-lime-400">-cli</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono leading-none">Agentic Executor</p>
          </div>
        </div>

        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        {/* Primary Views */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Primary Views
          </div>
          <div className="space-y-1">
            {primaryNav.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onViewChange(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-lime-400/10 text-lime-400 border border-lime-400/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-lime-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {typeof item.count === 'number' && item.count > 0 && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Filters */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Command Categories
          </div>
          <div className="space-y-1">
            {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => {
              const Icon = CATEGORY_ICONS[cat.id] || Layers;
              const isActive = activeCategory === cat.id && activeView !== 'favorites' && activeView !== 'recent';
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    onCategoryChange(cat.id);
                    if (activeView === 'favorites' || activeView === 'recent') {
                      onViewChange('all');
                    }
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-lime-400/10 text-lime-400 border border-lime-400/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-lime-400' : 'text-slate-400'}`} />
                    <span>{cat.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">{cat.count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Agentic Gemma Banner */}
        <div className="pt-2">
          <button
            onClick={() => {
              if (onOpenAI) onOpenAI();
              if (onClose) onClose();
            }}
            className="w-full text-left p-3.5 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900 to-lime-950/40 border border-lime-500/20 hover:border-lime-500/40 transition-all group"
          >
            <div className="flex items-center gap-2 text-lime-400 mb-1">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">
                Gemma AI Copilot
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Translate multi-step tasks into terminal pipelines using local inference.
            </p>
            <div className="mt-2.5 text-[10px] font-mono text-lime-400/90 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
              <span>Launch workspace</span>
              <span>&rarr;</span>
            </div>
          </button>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-[#1E293B] text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>Offline-Ready</span>
        <span className="text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Active
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-64 h-screen fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />
          {/* Slide-out drawer */}
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl z-10 animate-fade-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

