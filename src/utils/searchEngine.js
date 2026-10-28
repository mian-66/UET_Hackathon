import Fuse from 'fuse.js';

export const FUSE_OPTIONS = {
  isCaseSensitive: false,
  includeScore: true,
  shouldSort: true,
  threshold: 0.38,
  location: 0,
  distance: 100,
  minMatchCharLength: 2,
  keys: [
    { name: 'title', weight: 0.35 },
    { name: 'aliases', weight: 0.20 },
    { name: 'syntax', weight: 0.20 },
    { name: 'tags', weight: 0.15 },
    { name: 'description', weight: 0.10 }
  ]
};

/**
 * Creates and initializes a Fuse instance for the command dataset
 */
export function createSearchIndex(commands) {
  return new Fuse(commands, FUSE_OPTIONS);
}

/**
 * Multi-dimensional filter and search evaluator
 */
export function filterCommands({
  commands,
  fuseIndex,
  query = '',
  selectedCategory = 'all',
  selectedPersona = 'all',
  selectedShell = 'all',
  selectedRisk = 'all',
  favorites = [],
  view = 'explore' // 'explore' | 'favorites' | 'history'
}) {
  let candidates = commands;

  // View segmentation
  if (view === 'favorites') {
    candidates = candidates.filter((cmd) => favorites.includes(cmd.id));
  }

  // Text search via Fuse or exact match
  if (query && query.trim().length > 0) {
    const trimmed = query.trim().toLowerCase();
    
    // Fuzzy search
    const results = fuseIndex.search(trimmed);
    const matchedMap = new Map();
    results.forEach(({ item, score }) => {
      matchedMap.set(item.id, score);
    });

    // Check for exact substring match in syntax or aliases to boost
    candidates = candidates
      .filter((cmd) => matchedMap.has(cmd.id) || 
        cmd.syntax.toLowerCase().includes(trimmed) || 
        cmd.tags.some(t => t.toLowerCase().includes(trimmed)) ||
        cmd.aliases.some(a => a.toLowerCase().includes(trimmed))
      )
      .sort((a, b) => {
        // Boost if syntax starts with or exactly matches query
        const aExact = a.syntax.toLowerCase().includes(trimmed) ? 1 : 0;
        const bExact = b.syntax.toLowerCase().includes(trimmed) ? 1 : 0;
        if (aExact !== bExact) return bExact - aExact;

        const scoreA = matchedMap.get(a.id) ?? 0.5;
        const scoreB = matchedMap.get(b.id) ?? 0.5;
        return scoreA - scoreB;
      });
  }

  // Multi-faceted predicate filters
  return candidates.filter((cmd) => {
    // Category filter
    if (selectedCategory !== 'all' && cmd.category !== selectedCategory) {
      return false;
    }

    // Persona filter
    if (selectedPersona !== 'all' && !cmd.personas.includes(selectedPersona)) {
      return false;
    }

    // Shell filter
    if (selectedShell !== 'all' && !cmd.shells.includes(selectedShell)) {
      return false;
    }

    // Risk filter
    if (selectedRisk !== 'all' && cmd.risk !== selectedRisk) {
      return false;
    }

    return true;
  });
}
