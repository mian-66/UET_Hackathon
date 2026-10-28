import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar.jsx';
import { Header } from './components/Header.jsx';
import { HeroSearch } from './components/HeroSearch.jsx';
import { FilterToolbar } from './components/FilterToolbar.jsx';
import { CommandGrid } from './components/CommandGrid.jsx';
import { CommandDetailModal } from './components/CommandDetailModal.jsx';
import { AIAssistantPanel } from './components/AIAssistantPanel.jsx';
import { Footer } from './components/Footer.jsx';
import { commands as coreCommands } from './data/commands.js';
import { useCommandSearch } from './hooks/useCommandSearch.js';
import { useCommandStorage } from './hooks/useCommandStorage.js';
import { ToastProvider, useToast } from './context/ToastContext.jsx';
import { Trash2, ArrowLeft, Star, Clock } from 'lucide-react';

function PlsCliDashboard() {
  // Navigation & Drawer States
  const [activeView, setActiveView] = useState('all'); // 'overview' | 'all' | 'favorites' | 'recent'
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [activeModalCommand, setActiveModalCommand] = useState(null);

  // Storage Engine
  const {
    favorites,
    recentCommandIds,
    recentSearches,
    toggleFavorite,
    isFavorite,
    recordView,
    recordSearch,
    clearFavorites,
    clearHistory,
    clearSearches
  } = useCommandStorage();

  // Toast System
  const { showToast } = useToast();

  // Global keyboard shortcut listeners ('/' or 'Ctrl+K' focuses search)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        const heroInput = document.querySelector('input[type="text"]');
        if (heroInput) heroInput.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toggle Favorite with Toast Feedback
  const handleToggleFavorite = useCallback(
    (id) => {
      const added = toggleFavorite(id);
      if (added) {
        showToast('Saved to starred favorites! ★', 'success');
      } else {
        showToast('Removed from favorites', 'info');
      }
    },
    [toggleFavorite, showToast]
  );

  // Command Copy Success Handler
  const handleCopySuccess = useCallback(
    (cmd) => {
      const syntax = cmd.command || cmd.syntax;
      const isCritical = cmd.riskLevel === 'critical' || cmd.risk === 'destructive';
      recordView(cmd.id);

      if (isCritical) {
        showToast(`Copied critical command: ${syntax}`, 'warning', 3500);
      } else {
        showToast(`Copied syntax: ${syntax}`, 'success');
      }
    },
    [recordView, showToast]
  );

  // Candidate dataset slice based on active view (Favorites / Recent / All)
  const candidateCommands = useMemo(() => {
    if (activeView === 'favorites') {
      return coreCommands.filter((cmd) => favorites.includes(cmd.id));
    }
    if (activeView === 'recent') {
      return recentCommandIds
        .map((id) => coreCommands.find((c) => c.id === id))
        .filter(Boolean);
    }
    return coreCommands;
  }, [activeView, favorites, recentCommandIds]);

  // Multi-Faceted Deterministic Search Engine Hook
  const {
    filters,
    inputQuery,
    setInputQuery,
    setFilter,
    removeFilter,
    resetAllFilters,
    filteredCommands,
    activeFiltersList,
    hasActiveFilters
  } = useCommandSearch(candidateCommands);

  // Record Search on submit
  const handleSearchSubmit = useCallback(() => {
    if (inputQuery && inputQuery.trim()) {
      recordSearch(inputQuery.trim());
    }
  }, [inputQuery, recordSearch]);

  // Dynamic category counts for Toolbar & Sidebar
  const categoryCounts = useMemo(() => {
    const counts = { all: candidateCommands.length };
    candidateCommands.forEach((cmd) => {
      counts[cmd.category] = (counts[cmd.category] || 0) + 1;
    });
    return counts;
  }, [candidateCommands]);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-lime-400/20 selection:text-lime-300">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeView={activeView}
        onViewChange={(view) => {
          setActiveView(view);
          if (view === 'favorites' || view === 'recent') {
            setFilter('category', 'all');
          }
        }}
        activeCategory={filters.category}
        onCategoryChange={(cat) => setFilter('category', cat)}
        favoritesCount={favorites.length}
        recentCount={recentCommandIds.length}
        onOpenAI={() => setIsAIOpen(true)}
      />

      {/* Main Canvas Area (Offset by sidebar width on desktop) */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top Header */}
        <Header
          onToggleSidebar={() => setIsSidebarOpen(true)}
          searchQuery={inputQuery}
          onSearchChange={(q) => setFilter('query', q)}
          selectedShell={filters.shell}
          onShellChange={(sh) => setFilter('shell', sh)}
          onOpenAI={() => setIsAIOpen(true)}
        />

        {/* Core Body Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Intent Hero Section */}
          <HeroSearch
            searchQuery={inputQuery}
            onSearchChange={(q) => setFilter('query', q)}
            onSearchSubmit={handleSearchSubmit}
            recentSearches={recentSearches}
            onClearRecentSearches={() => {
              clearSearches();
              showToast('Cleared search history', 'info');
            }}
          />

          {/* Filter & Toolbar Ribbon */}
          <FilterToolbar
            resultCount={filteredCommands.length}
            filters={filters}
            onSetFilter={setFilter}
            onRemoveFilter={removeFilter}
            onResetAllFilters={resetAllFilters}
            activeFiltersList={activeFiltersList}
            hasActiveFilters={hasActiveFilters}
            categoryCounts={categoryCounts}
          />

          {/* Active View Header Bar (for Starred or Recent History) */}
          {activeView === 'favorites' && (
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-mono text-sm font-bold text-white">
                  Starred Workflows
                </span>
                <span className="text-xs font-mono text-slate-400">
                  ({filteredCommands.length} saved)
                </span>
              </div>
              <div className="flex items-center gap-3">
                {favorites.length > 0 && (
                  <button
                    onClick={() => {
                      clearFavorites();
                      showToast('Cleared all starred favorites', 'info');
                    }}
                    className="text-xs font-mono text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Favorites</span>
                  </button>
                )}
                <button
                  onClick={() => setActiveView('all')}
                  className="text-xs font-mono text-lime-400 hover:text-lime-300 flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to all commands</span>
                </button>
              </div>
            </div>
          )}

          {activeView === 'recent' && (
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-lime-400" />
                <span className="font-mono text-sm font-bold text-white">
                  Recently Viewed History
                </span>
                <span className="text-xs font-mono text-slate-400">
                  ({filteredCommands.length} items)
                </span>
              </div>
              <div className="flex items-center gap-3">
                {recentCommandIds.length > 0 && (
                  <button
                    onClick={() => {
                      clearHistory();
                      showToast('Cleared command history', 'info');
                    }}
                    className="text-xs font-mono text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear History</span>
                  </button>
                )}
                <button
                  onClick={() => setActiveView('all')}
                  className="text-xs font-mono text-lime-400 hover:text-lime-300 flex items-center gap-1 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to all commands</span>
                </button>
              </div>
            </div>
          )}

          {/* Command Cards Grid or Contextual Empty State */}
          <CommandGrid
            commands={filteredCommands}
            query={inputQuery}
            activeView={activeView}
            onInspect={(cmd) => {
              setActiveModalCommand(cmd);
              recordView(cmd.id);
            }}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onCopySuccess={handleCopySuccess}
            onResetFilters={resetAllFilters}
            onTryQuery={(kw) => {
              setFilter('query', kw);
              recordSearch(kw);
            }}
            onExploreAll={() => setActiveView('all')}
          />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Accessible Detail Modal */}
      {activeModalCommand && (
        <CommandDetailModal
          command={activeModalCommand}
          onClose={() => setActiveModalCommand(null)}
          isFavorite={isFavorite(activeModalCommand.id)}
          onToggleFavorite={handleToggleFavorite}
          onSelectRelated={(related) => {
            setActiveModalCommand(related);
            recordView(related.id);
          }}
          allCommands={coreCommands}
          recordView={recordView}
        />
      )}

      {/* Agentic Gemma AI Assistant Panel */}
      <AIAssistantPanel
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        shellContext={filters.shell}
        activeOS={
          filters.shell === 'powershell' || filters.shell === 'cmd'
            ? 'windows'
            : filters.shell === 'zsh'
            ? 'macos'
            : 'linux'
        }
        onApplyCommand={(cmd) => {
          setFilter('query', cmd);
          showToast(`Applied command to search: "${cmd}"`, 'info');
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <PlsCliDashboard />
    </ToastProvider>
  );
}
