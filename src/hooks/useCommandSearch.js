import { useState, useMemo } from 'react';
import { ALL_COMMANDS } from '../data/commands/index.js';
import { createSearchIndex, filterCommands } from '../utils/searchEngine.js';

export function useCommandSearch({ favorites = [], history = [] } = {}) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPersona, setSelectedPersona] = useState('all');
  const [selectedShell, setSelectedShell] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'favorites' | 'history'

  // Pre-index dataset into Fuse.js instance
  const fuseIndex = useMemo(() => {
    return createSearchIndex(ALL_COMMANDS);
  }, []);

  // Filter & rank commands
  const filteredCommands = useMemo(() => {
    let sourceCommands = ALL_COMMANDS;

    if (activeTab === 'history') {
      const historyIds = history.map(h => (typeof h === 'string' ? h : h.id));
      // Preserve history ordering (most recent first)
      const commandMap = new Map(ALL_COMMANDS.map(c => [c.id, c]));
      sourceCommands = historyIds
        .map(id => commandMap.get(id))
        .filter(Boolean);
    }

    return filterCommands({
      commands: sourceCommands,
      fuseIndex,
      query,
      selectedCategory,
      selectedPersona,
      selectedShell,
      selectedRisk,
      favorites,
      view: activeTab
    });
  }, [
    fuseIndex,
    query,
    selectedCategory,
    selectedPersona,
    selectedShell,
    selectedRisk,
    favorites,
    history,
    activeTab
  ]);

  const resetFilters = () => {
    setQuery('');
    setSelectedCategory('all');
    setSelectedPersona('all');
    setSelectedShell('all');
    setSelectedRisk('all');
  };

  const hasActiveFilters = Boolean(
    query.trim() ||
    selectedCategory !== 'all' ||
    selectedPersona !== 'all' ||
    selectedShell !== 'all' ||
    selectedRisk !== 'all'
  );

  return {
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
    totalCommands: ALL_COMMANDS.length,
    resetFilters,
    hasActiveFilters
  };
}
