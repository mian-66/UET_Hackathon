import React, { useState, useRef } from 'react';
import { Header } from './components/layout/Header.jsx';
import { Footer } from './components/layout/Footer.jsx';
import { SearchBar } from './components/search/SearchBar.jsx';
import { FilterBar } from './components/search/FilterBar.jsx';
import { ActiveFilters } from './components/search/ActiveFilters.jsx';
import { CommandGrid } from './components/command/CommandGrid.jsx';
import { CommandModal } from './components/command/CommandModal.jsx';
import { ShortcutsModal } from './components/common/ShortcutsModal.jsx';
import { ToastContainer } from './components/common/Toast.jsx';

import { useLocalStorage } from './hooks/useLocalStorage.js';
import { useCommandSearch } from './hooks/useCommandSearch.js';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts.js';
import { useToast } from './hooks/useToast.js';

export default function App() {
  const searchInputRef = useRef(null);
  const [favorites, setFavorites] = useLocalStorage('pls_cli_favorites', []);
  const [history, setHistory] = useLocalStorage('pls_cli_history', []);

  const [activeModalCommand, setActiveModalCommand] = useState(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const { toasts, addToast, removeToast } = useToast();

  const {
    query,
    setQuery,
    selectedCategory,
    setSelectedCategory,
    selectedPersona,
    setSelectedPersona,
    selectedShell,
    setSelectedShell,
    selectedRisk,
    setSelectedRisk,
    activeTab,
    setActiveTab,
    filteredCommands,
    totalCommands,
    resetFilters,
    hasActiveFilters
  } = useCommandSearch({ favorites, history });

  // Handle global shortcuts (e.g. '/' focuses search, 'Esc' clears search / closes modal)
  useKeyboardShortcuts({
    searchRef: searchInputRef,
    onClearSearch: () => setQuery(''),
    onCloseModal: () => {
      if (activeModalCommand) setActiveModalCommand(null);
      if (isShortcutsOpen) setIsShortcutsOpen(false);
    },
    isModalOpen: Boolean(activeModalCommand || isShortcutsOpen)
  });

  // Favorite toggle handler
  const handleToggleFavorite = (commandId) => {
    setFavorites((prev) => {
      const exists = prev.includes(commandId);
      if (exists) {
        addToast({ message: 'Removed from bookmarks', type: 'info' });
        return prev.filter((id) => id !== commandId);
      } else {
        addToast({ message: 'Saved to bookmarks!', type: 'success' });
        return [...prev, commandId];
      }
    });
  };

  // Copy success handler
  const handleCopySuccess = (command, syntaxCopied) => {
    // Record to history (most recent first, max 30)
    setHistory((prev) => {
      const filtered = prev.filter((item) => (typeof item === 'string' ? item !== command.id : item.id !== command.id));
      return [{ id: command.id, syntax: syntaxCopied, timestamp: Date.now() }, ...filtered].slice(0, 30);
    });

    addToast({
      message: `Copied to clipboard: "${command.title}"`,
      type: command.risk === 'destructive' ? 'warning' : 'success'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-term-bg text-term-text font-sans">
      {/* Top Application Header */}
      <Header
        totalCommands={totalCommands}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 space-y-6">
        {/* Hero & Search Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4 pt-4 pb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-400">
            <span>Deterministic Natural Language Command Assistant</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-mono">
            Translate Intent into <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400">Terminal Syntax</span>
          </h2>

          <p className="text-xs sm:text-sm text-term-muted max-w-xl mx-auto leading-relaxed">
            Stop searching stack traces or memorizing esoteric flags. Search workflows in plain English with instant client-side fuzzy matching and safety guardrails.
          </p>

          <div className="pt-2">
            <SearchBar
              searchRef={searchInputRef}
              query={query}
              onQueryChange={setQuery}
              onClear={() => setQuery('')}
              totalMatches={filteredCommands.length}
              totalCommands={totalCommands}
            />
          </div>
        </section>

        {/* Filter Navigation Toolbar */}
        <section className="bg-term-card/60 border border-term-border rounded-2xl p-4 sm:p-5 shadow-lg backdrop-blur-sm space-y-3">
          <FilterBar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedPersona={selectedPersona}
            onPersonaChange={setSelectedPersona}
            selectedShell={selectedShell}
            onShellChange={setSelectedShell}
            selectedRisk={selectedRisk}
            onRiskChange={setSelectedRisk}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            favoritesCount={favorites.length}
            historyCount={history.length}
          />

          <ActiveFilters
            query={query}
            selectedCategory={selectedCategory}
            selectedPersona={selectedPersona}
            selectedShell={selectedShell}
            selectedRisk={selectedRisk}
            onResetFilters={resetFilters}
            onClearQuery={() => setQuery('')}
            onResetCategory={() => setSelectedCategory('all')}
            onResetPersona={() => setSelectedPersona('all')}
            onResetShell={() => setSelectedShell('all')}
            onResetRisk={() => setSelectedRisk('all')}
            totalMatches={filteredCommands.length}
            totalCommands={totalCommands}
          />
        </section>

        {/* Command Catalog Grid */}
        <section>
          <CommandGrid
            commands={filteredCommands}
            selectedShell={selectedShell}
            onSelectCommand={setActiveModalCommand}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onCopySuccess={handleCopySuccess}
            query={query}
            onResetFilters={resetFilters}
            onTryQuery={(keyword) => setQuery(keyword)}
          />
        </section>
      </main>

      {/* Global Modals & Notifications */}
      {activeModalCommand && (
        <CommandModal
          command={activeModalCommand}
          onClose={() => setActiveModalCommand(null)}
          isFavorite={favorites.includes(activeModalCommand.id)}
          onToggleFavorite={handleToggleFavorite}
          onCopySuccess={handleCopySuccess}
          defaultShell={selectedShell}
        />
      )}

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* Application Footer */}
      <Footer />
    </div>
  );
}
