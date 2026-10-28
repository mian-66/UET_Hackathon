import { useState, useEffect, useCallback } from 'react';
import { sanitizeStorageInput } from '../utils/securityScanner.js';

/**
 * Storage Keys & Constraints
 */
const STORAGE_KEYS = {
  FAVORITES: 'pls_favorites',
  RECENT_COMMANDS: 'pls_recent_commands',
  RECENT_SEARCHES: 'pls_recent_searches'
};

const MAX_LIMITS = {
  FAVORITES: 50,
  RECENT_COMMANDS: 15,
  RECENT_SEARCHES: 8
};

const DEFAULT_FAVORITES = ['git-undo-last-commit-soft', 'sys-check-port-lsof'];
const DEFAULT_RECENTS = ['git-status-short'];
const DEFAULT_SEARCHES = ['git undo commit', 'kill port 3000', 'docker prune'];

/**
 * Safe localStorage wrapper with memory fallback for private browsing or quota limits.
 * Sanitizes parsed inputs to prevent prototype poisoning.
 */
function safeGetItem(key, fallbackValue) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return fallbackValue;
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallbackValue;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return fallbackValue;

    // Filter and sanitize each array item
    const sanitized = parsed
      .filter((item) => typeof item === 'string')
      .map((item) => sanitizeStorageInput(item, 150))
      .filter((item) => item.length > 0);

    return sanitized;
  } catch (err) {
    console.warn(`[Pls-CLI Storage] Unable to read localStorage key "${key}":`, err);
    return fallbackValue;
  }
}

function safeSetItem(key, value) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[Pls-CLI Storage] Unable to write localStorage key "${key}":`, err);
    return false;
  }
}

/**
 * Custom React Hook for Managing Local Command State & Offline Persistence
 */
export function useCommandStorage() {
  // In-memory state initialized from localStorage
  const [favorites, setFavorites] = useState(() =>
    safeGetItem(STORAGE_KEYS.FAVORITES, DEFAULT_FAVORITES)
  );

  const [recentCommandIds, setRecentCommandIds] = useState(() =>
    safeGetItem(STORAGE_KEYS.RECENT_COMMANDS, DEFAULT_RECENTS)
  );

  const [recentSearches, setRecentSearches] = useState(() =>
    safeGetItem(STORAGE_KEYS.RECENT_SEARCHES, DEFAULT_SEARCHES)
  );

  // Sync to localStorage on state changes
  useEffect(() => {
    safeSetItem(STORAGE_KEYS.FAVORITES, favorites);
  }, [favorites]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.RECENT_COMMANDS, recentCommandIds);
  }, [recentCommandIds]);

  useEffect(() => {
    safeSetItem(STORAGE_KEYS.RECENT_SEARCHES, recentSearches);
  }, [recentSearches]);

  /**
   * Toggle a command ID into or out of favorites
   * @param {string} rawCommandId
   * @returns {boolean} true if now favorited, false if removed
   */
  const toggleFavorite = useCallback((rawCommandId) => {
    const commandId = sanitizeStorageInput(rawCommandId, 80);
    if (!commandId) return false;

    let isAdded = false;
    setFavorites((prev) => {
      if (prev.includes(commandId)) {
        isAdded = false;
        return prev.filter((id) => id !== commandId);
      } else {
        isAdded = true;
        const next = [commandId, ...prev.filter((id) => id !== commandId)];
        return next.slice(0, MAX_LIMITS.FAVORITES);
      }
    });

    return isAdded;
  }, []);

  /**
   * Check if a command is in favorites
   * @param {string} rawCommandId
   * @returns {boolean}
   */
  const isFavorite = useCallback(
    (rawCommandId) => {
      const commandId = sanitizeStorageInput(rawCommandId, 80);
      if (!commandId) return false;
      return favorites.includes(commandId);
    },
    [favorites]
  );

  /**
   * Record a viewed or executed command ID in LRU order
   * Moves existing ID to index 0, capped at 15 items
   * @param {string} rawCommandId
   */
  const recordView = useCallback((rawCommandId) => {
    const commandId = sanitizeStorageInput(rawCommandId, 80);
    if (!commandId) return;

    setRecentCommandIds((prev) => {
      const filtered = prev.filter((id) => id !== commandId);
      return [commandId, ...filtered].slice(0, MAX_LIMITS.RECENT_COMMANDS);
    });
  }, []);

  /**
   * Record a search query in LRU order
   * @param {string} rawQuery
   */
  const recordSearch = useCallback((rawQuery) => {
    const trimmed = sanitizeStorageInput(rawQuery, 100);
    if (trimmed.length < 2) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (item) => item.toLowerCase() !== trimmed.toLowerCase()
      );
      return [trimmed, ...filtered].slice(0, MAX_LIMITS.RECENT_SEARCHES);
    });
  }, []);

  /**
   * Remove a single search item
   * @param {string} rawQuery
   */
  const removeRecentSearch = useCallback((rawQuery) => {
    const query = sanitizeStorageInput(rawQuery, 100);
    if (!query) return;
    setRecentSearches((prev) => prev.filter((item) => item.toLowerCase() !== query.toLowerCase()));
  }, []);

  /**
   * Clear all favorites
   */
  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  /**
   * Clear all recently viewed commands history
   */
  const clearHistory = useCallback(() => {
    setRecentCommandIds([]);
  }, []);

  /**
   * Clear all recent search queries
   */
  const clearSearches = useCallback(() => {
    setRecentSearches([]);
  }, []);

  return {
    favorites,
    recentCommandIds,
    recentSearches,
    toggleFavorite,
    isFavorite,
    recordView,
    recordSearch,
    removeRecentSearch,
    clearFavorites,
    clearHistory,
    clearSearches
  };
}
