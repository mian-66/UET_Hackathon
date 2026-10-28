import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from './components/Sidebar.jsx';
import { Header } from './components/Header.jsx';
import { HeroSearch } from './components/HeroSearch.jsx';
import { FilterToolbar } from './components/FilterToolbar.jsx';
import { CommandCard } from './components/CommandCard.jsx';
import { CommandDetailModal } from './components/CommandDetailModal.jsx';
import { AIAssistantPanel } from './components/AIAssistantPanel.jsx';
import { Footer } from './components/Footer.jsx';
import { mockCommands } from './data/mockCommands.js';
import { CheckCircle2, RotateCcw, Terminal, AlertCircle } from 'lucide-react';

export default function App() {
  // Navigation & View States
  const [activeView, setActiveView] = useState('all'); // 'overview' | 'all' | 'favorites' | 'recent'
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedShell, setSelectedShell] = useState('bash');
  const [sortBy, setSortBy] = useState('relevance');

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [activeModalCommand, setActiveModalCommand] = useState(null);

  // Persistence (Favorites & Recent)
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('pls_cli_favs');
      return saved ? JSON.parse(saved) : ['git-undo-soft', 'port-kill-3000'];
    } catch {
      return ['git-undo-soft', 'port-kill-3000'];
    }
  });

  const [recentIds, setRecentIds] = useState(() => {
    try {
      const saved = localStorage.getItem('pls_cli_recents');
      return saved ? JSON.parse(saved) : ['git-undo-soft'];
    } catch {
      return ['git-undo-soft'];
    }
  });

  // Toast Notification State
  const [toast, setToast] = useState(null);

  // Sync favorites with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pls_cli_favs', JSON.stringify(favorites));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [favorites]);

  // Sync recents with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pls_cli_recents', JSON.stringify(recentIds));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [recentIds]);

  // Global keyboard shortcut listeners ('/' or 'Ctrl+K' focuses search, 'Esc' closes modals)
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

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  // Toggle Favorite
  const handleToggleFavorite = (id) => {
    setFavorites((prev) => {
      if (prev.includes(id)) {
        showToast('Removed from favorites', 'info');
        return prev.filter((item) => item !== id);
      } else {
        showToast('Saved to favorites! ★', 'success');
        return [...prev, id];
      }
    });
  };

  // Record copied command
  const handleCopySuccess = (command) => {
    setRecentIds((prev) => [command.id, ...prev.filter((id) => id !== command.id)].slice(0, 20));
    showToast(`Copied syntax: ${command.syntax}`, command.risk === 'destructive' ? 'warning' : 'success');
  };

  // Computed Filtered & Ranked Command List
  const filteredCommands = useMemo(() => {
    let list = [...mockCommands];

    // Primary View Filter
    if (activeView === 'favorites') {
      list = list.filter((cmd) => favorites.includes(cmd.id));
    } else if (activeView === 'recent') {
      list = recentIds
        .map((id) => list.find((c) => c.id === id))
        .filter(Boolean);
    }

    // Category Filter
    if (activeCategory !== 'all') {
      list = list.filter((cmd) => cmd.category === activeCategory);
    }

    // Role Filter
    if (selectedRole !== 'all') {
      list = list.filter((cmd) => cmd.personas.includes(selectedRole));
    }

    // Search Query (Natural-language fuzzy match)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (cmd) =>
          cmd.title.toLowerCase().includes(q) ||
          cmd.syntax.toLowerCase().includes(q) ||
          cmd.description.toLowerCase().includes(q) ||
          cmd.tags.some((t) => t.toLowerCase().includes(q)) ||
          cmd.aliases.some((a) => a.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'alpha') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'risk') {
      const order = { safe: 1, modifying: 2, destructive: 3 };
      list.sort((a, b) => (order[a.risk] || 1) - (order[b.risk] || 1));
    } else if (sortBy === 'risk-desc') {
      const order = { destructive: 1, modifying: 2, safe: 3 };
      list.sort((a, b) => (order[a.risk] || 1) - (order[b.risk] || 1));
    }

    return list;
  }, [mockCommands, activeView, activeCategory, selectedRole, searchQuery, sortBy, favorites, recentIds]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setSelectedRole('all');
    setActiveView('all');
    setSortBy('relevance');
  };

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
            setActiveCategory('all');
          }
        }}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        favoritesCount={favorites.length}
        recentCount={recentIds.length}
        onOpenAI={() => setIsAIOpen(true)}
      />

      {/* Main Canvas Area (Offset by sidebar width on desktop) */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top Header */}
        <Header
          onToggleSidebar={() => setIsSidebarOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedShell={selectedShell}
          onShellChange={setSelectedShell}
          onOpenAI={() => setIsAIOpen(true)}
        />

        {/* Core Body Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Intent Hero Section */}
          <HeroSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={() => {}}
          />

          {/* Filter & Toolbar Ribbon */}
          <FilterToolbar
            resultCount={filteredCommands.length}
            selectedCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* Active View Title Indicator (if Favorites or Recent) */}
          {(activeView === 'favorites' || activeView === 'recent') && (
            <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-white capitalize">
                  {activeView === 'favorites' ? '★ Starred Workflows' : '🕒 Recently Copied History'}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  ({filteredCommands.length} saved)
                </span>
              </div>
              <button
                onClick={() => setActiveView('all')}
                className="text-xs font-mono text-lime-400 hover:text-lime-300 flex items-center gap-1"
              >
                <span>&larr; Back to all commands</span>
              </button>
            </div>
          )}

          {/* Command Cards Grid or Empty State */}
          {filteredCommands.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredCommands.map((command) => (
                <CommandCard
                  key={command.id}
                  command={command}
                  onInspect={(cmd) => setActiveModalCommand(cmd)}
                  isFavorite={favorites.includes(command.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onCopySuccess={handleCopySuccess}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-[#1E293B] rounded-2xl bg-[#0F172A]/50">
              <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
                <Terminal className="w-6 h-6 text-lime-400" />
              </div>
              <h3 className="text-lg font-bold text-white font-mono mb-1">
                No matching terminal commands
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
                {searchQuery
                  ? `No commands found matching "${searchQuery}" under current filters.`
                  : 'No commands in this view or category.'}
              </p>
              <button
                onClick={resetAllFilters}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-slate-950 font-mono text-xs font-bold transition-all shadow-lime-subtle"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset all filters</span>
              </button>
            </div>
          )}
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Detail Modal / Drawer */}
      {activeModalCommand && (
        <CommandDetailModal
          command={activeModalCommand}
          onClose={() => setActiveModalCommand(null)}
          isFavorite={favorites.includes(activeModalCommand.id)}
          onToggleFavorite={handleToggleFavorite}
          onSelectRelated={(related) => setActiveModalCommand(related)}
          allCommands={mockCommands}
        />
      )}

      {/* Agentic Gemma AI Assistant Panel */}
      <AIAssistantPanel
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
        onApplyCommand={(cmd) => {
          setSearchQuery(cmd);
          showToast(`Applied command to search: "${cmd}"`, 'info');
        }}
      />

      {/* Non-blocking Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#0F172A] border border-[#1E293B] shadow-2xl text-xs font-mono animate-slide-up backdrop-blur-md">
          {toast.type === 'warning' ? (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
          )}
          <span className="text-slate-100">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
