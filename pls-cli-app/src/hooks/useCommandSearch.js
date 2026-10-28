import { useState, useEffect, useMemo, useCallback } from 'react';
import { filterAndSortCommands } from '../utils/searchCommands.js';

export const DEFAULT_FILTERS = {
  query: '',
  category: 'all',
  role: 'all',
  os: 'all',
  shell: 'all',
  riskLevels: 'all',
  sortBy: 'relevance'
};

/**
 * Custom hook providing debounced multi-faceted search & filtering pipeline
 * @param {Object[]} commands
 * @param {Object} [initialFilters]
 */
export function useCommandSearch(commands = [], initialFilters = {}) {
  const [filters, setFilters] = useState(() => ({
    ...DEFAULT_FILTERS,
    ...initialFilters
  }));

  // Immediate input query for responsive typing
  const [inputQuery, setInputQuery] = useState(initialFilters.query || '');

  // Debounced query state (60ms for fluid local search feel)
  const [debouncedQuery, setDebouncedQuery] = useState(inputQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(inputQuery);
      setFilters((prev) => (prev.query !== inputQuery ? { ...prev, query: inputQuery } : prev));
    }, 60);

    return () => clearTimeout(handler);
  }, [inputQuery]);

  // Set an individual filter key-value
  const setFilter = useCallback((key, value) => {
    if (key === 'query') {
      setInputQuery(value);
    }
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Remove / clear an individual filter
  const removeFilter = useCallback((key) => {
    if (key === 'query') {
      setInputQuery('');
    }
    setFilters((prev) => ({
      ...prev,
      [key]: DEFAULT_FILTERS[key]
    }));
  }, []);

  // Reset all filters to baseline
  const resetAllFilters = useCallback(() => {
    setInputQuery('');
    setDebouncedQuery('');
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Check which non-default filters are active
  const activeFiltersList = useMemo(() => {
    const active = [];

    if (inputQuery.trim()) {
      active.push({ key: 'query', label: `Query: "${inputQuery.trim()}"`, value: inputQuery });
    }
    if (filters.category !== 'all') {
      active.push({ key: 'category', label: `Category: ${filters.category}`, value: filters.category });
    }
    if (filters.role !== 'all') {
      active.push({ key: 'role', label: `Role: ${filters.role}`, value: filters.role });
    }
    if (filters.os !== 'all') {
      active.push({ key: 'os', label: `OS: ${filters.os}`, value: filters.os });
    }
    if (filters.shell !== 'all') {
      active.push({ key: 'shell', label: `Shell: ${filters.shell}`, value: filters.shell });
    }
    if (filters.riskLevels !== 'all' && (!Array.isArray(filters.riskLevels) || filters.riskLevels.length > 0)) {
      const riskVal = Array.isArray(filters.riskLevels) ? filters.riskLevels.join(', ') : filters.riskLevels;
      active.push({ key: 'riskLevels', label: `Risk: ${riskVal}`, value: filters.riskLevels });
    }
    if (filters.sortBy !== 'relevance') {
      active.push({ key: 'sortBy', label: `Sort: ${filters.sortBy}`, value: filters.sortBy });
    }

    return active;
  }, [inputQuery, filters]);

  const hasActiveFilters = activeFiltersList.length > 0;

  // Memoized deterministic search & filter execution
  const filteredCommands = useMemo(() => {
    return filterAndSortCommands(commands, {
      ...filters,
      query: debouncedQuery
    });
  }, [commands, filters, debouncedQuery]);

  return {
    filters,
    inputQuery,
    setInputQuery,
    setFilter,
    removeFilter,
    resetAllFilters,
    filteredCommands,
    totalCommandsCount: commands.length,
    activeFiltersList,
    hasActiveFilters,
    isSearching: inputQuery !== debouncedQuery
  };
}

