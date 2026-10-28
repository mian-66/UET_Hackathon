/**
 * Pls-CLI: Deterministic Search, Synonym Expansion & Multi-Faceted Filtering Engine
 * Pure, decoupled client-side algorithmic search with zero external runtime dependencies.
 */

// Domain Synonym Dictionary: maps human conversational vocabulary to terminal tokens
export const SYNONYM_MAP = {
  // Discovery & Viewing
  show: ['list', 'ls', 'status', 'view', 'display', 'see', 'inspect', 'cat'],
  view: ['list', 'ls', 'status', 'show', 'display', 'see', 'inspect'],
  display: ['list', 'ls', 'status', 'show', 'view', 'see'],
  see: ['list', 'ls', 'status', 'show', 'view'],
  inspect: ['status', 'ps', 'lsof', 'stats', 'view', 'info', 'check'],
  check: ['status', 'inspect', 'verify', 'test', 'audit'],
  verify: ['check', 'status', 'test', 'inspect'],

  // Git specific
  diff: ['status', 'diff', 'changes', 'uncommitted', 'modified'],
  changes: ['status', 'diff', 'modified', 'uncommitted', 'staged'],
  uncommitted: ['status', 'diff', 'unstaged', 'changes'],
  undo: ['reset', 'revert', 'restore', 'unstage', 'cancel'],
  uncommit: ['reset', 'soft', 'undo', 'rewind'],
  revert: ['undo', 'reset', 'restore', 'rollback'],
  rollback: ['revert', 'reset', 'undo'],
  stash: ['save', 'hide', 'preserve', 'pop', 'wip'],
  unstage: ['restore', 'reset', 'staged'],

  // Process & Port Termination
  kill: ['stop', 'terminate', 'end', 'kill-9', 'taskkill', 'sigkill', 'close'],
  stop: ['kill', 'terminate', 'end', 'down', 'halt'],
  terminate: ['kill', 'stop', 'end', 'sigkill'],
  end: ['kill', 'stop', 'terminate'],
  free: ['kill', 'port', 'clear', 'release'],

  // Filesystem & Search
  find: ['locate', 'search', 'grep', 'ripgrep', 'rg', 'dir'],
  locate: ['find', 'search', 'where'],
  search: ['find', 'locate', 'grep', 'rg', 'query'],
  where: ['find', 'locate', 'which'],
  size: ['large', 'big', 'du', 'heavy', 'space', 'mb', 'gb'],
  large: ['size', 'big', 'heavy', '100m', 'huge'],
  big: ['size', 'large', 'heavy', 'huge'],

  // Deletion & Cleaning
  clean: ['remove', 'rm', 'delete', 'prune', 'wipe', 'purge', 'clear'],
  erase: ['remove', 'rm', 'delete', 'wipe', 'purge'],
  wipe: ['clean', 'erase', 'remove', 'rm', 'delete', 'purge', 'reset'],
  purge: ['clean', 'prune', 'wipe', 'remove', 'delete'],
  delete: ['remove', 'rm', 'erase', 'clean', 'purge'],
  remove: ['delete', 'rm', 'clean', 'erase'],
  prune: ['clean', 'purge', 'delete', 'remove'],

  // Server & Execution
  start: ['run', 'dev', 'launch', 'boot', 'serve'],
  launch: ['start', 'run', 'dev', 'boot', 'serve'],
  boot: ['start', 'run', 'launch', 'up'],
  server: ['dev', 'serve', 'preview', 'port', 'host'],
  run: ['start', 'exec', 'execute'],

  // Container & Docker
  docker: ['container', 'image', 'compose', 'daemon', 'volumes'],
  containers: ['docker', 'container', 'ps', 'images']
};

/**
 * Normalizes input text by stripping non-essential punctuation,
 * collapsing whitespace, and converting to lowercase.
 * Preserves meaningful CLI characters (-, --, ., /, *, ~).
 * @param {string} text
 * @returns {string}
 */
export function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s\-./*~]/g, ' ') // Strip punctuation except CLI symbols
    .replace(/\s+/g, ' ')           // Collapse multiple spaces
    .trim();
}

/**
 * Splits query string into atomic normalized search tokens.
 * @param {string} query
 * @returns {string[]}
 */
export function tokenizeQuery(query) {
  const normalized = normalizeText(query);
  if (!normalized) return [];
  return normalized.split(' ').filter((token) => token.length > 0);
}

/**
 * Expands atomic query tokens using the domain synonym dictionary.
 * @param {string[]} tokens
 * @returns {Set<string>}
 */
export function expandSynonyms(tokens) {
  const expanded = new Set(tokens);

  tokens.forEach((token) => {
    // Direct synonym lookup
    if (SYNONYM_MAP[token]) {
      SYNONYM_MAP[token].forEach((syn) => expanded.add(syn));
    }

    // Check partial substring in synonym keys
    Object.keys(SYNONYM_MAP).forEach((key) => {
      if (token.includes(key) || key.includes(token)) {
        SYNONYM_MAP[key].forEach((syn) => expanded.add(syn));
      }
    });
  });

  return expanded;
}

/**
 * Calculates a weighted relevance score for a command based on query tokens
 * and expanded synonyms.
 * @param {Object} command
 * @param {string[]} queryTokens
 * @param {Set<string>} expandedTokens
 * @param {string} [activeOS]
 * @param {string} [activeShell]
 * @returns {number}
 */
export function scoreCommand(command, queryTokens, expandedTokens, activeOS = 'all', activeShell = 'all') {
  if (!queryTokens || queryTokens.length === 0) return 0;

  let score = 0;
  const rawQuery = queryTokens.join(' ');

  const titleNorm = normalizeText(command.title);
  const commandNorm = normalizeText(command.command);
  const descNorm = normalizeText(command.taskDescription || command.description);
  const expNorm = normalizeText(command.explanation);
  const tagsNorm = (command.tags || []).map(normalizeText);

  // 1. Exact / Full Phrase Matches
  if (titleNorm.includes(rawQuery)) {
    score += 50;
    if (titleNorm.startsWith(rawQuery)) score += 20; // Prefix bonus
  }
  if (commandNorm.includes(rawQuery)) {
    score += 45;
  }
  if (descNorm.includes(rawQuery)) {
    score += 25;
  }

  // 2. Individual Query Token Matching
  queryTokens.forEach((token) => {
    // Title match
    if (titleNorm.includes(token)) score += 35;

    // Command syntax token match (e.g., `git`, `reset`, `lsof`, `chmod`)
    if (commandNorm.includes(token)) score += 40;

    // Direct tag match
    if (tagsNorm.some((tag) => tag === token || tag.includes(token))) score += 30;

    // Task description match
    if (descNorm.includes(token)) score += 20;

    // Explanation / flags match
    if (expNorm.includes(token)) score += 10;
  });

  // 3. Synonym Expansion Hits
  expandedTokens.forEach((synToken) => {
    if (!queryTokens.includes(synToken)) {
      if (commandNorm.includes(synToken)) score += 18;
      if (titleNorm.includes(synToken)) score += 15;
      if (tagsNorm.some((tag) => tag.includes(synToken))) score += 12;
      if (descNorm.includes(synToken)) score += 8;
    }
  });

  // 4. Secondary Contextual Boost for selected OS / Shell affinity
  if (activeOS !== 'all' && (command.supportedOperatingSystems || []).includes(activeOS)) {
    score += 5;
  }
  if (activeShell !== 'all' && (command.supportedShells || []).includes(activeShell)) {
    score += 5;
  }

  return score;
}

/**
 * Filter and sort commands through a unified, composable multi-faceted pipeline.
 * @param {Object[]} commands
 * @param {Object} criteria
 * @param {string} [criteria.query]
 * @param {string} [criteria.category]
 * @param {string} [criteria.role]
 * @param {string} [criteria.os]
 * @param {string} [criteria.shell]
 * @param {string|string[]} [criteria.riskLevels]
 * @param {string} [criteria.sortBy]
 * @returns {Object[]}
 */
export function filterAndSortCommands(
  commands = [],
  {
    query = '',
    category = 'all',
    role = 'all',
    os = 'all',
    shell = 'all',
    riskLevels = 'all',
    sortBy = 'relevance'
  } = {}
) {
  if (!Array.isArray(commands)) return [];

  const queryTokens = tokenizeQuery(query);
  const expandedTokens = expandSynonyms(queryTokens);
  const hasQuery = queryTokens.length > 0;

  // Normalize risk levels filter into Set
  let activeRisks = null;
  if (Array.isArray(riskLevels) && riskLevels.length > 0 && !riskLevels.includes('all')) {
    activeRisks = new Set(riskLevels);
  } else if (typeof riskLevels === 'string' && riskLevels !== 'all' && riskLevels.trim().length > 0) {
    activeRisks = new Set([riskLevels]);
  }

  // 1. Compound Predicate Filtering (Boolean AND)
  const filtered = commands.filter((cmd) => {
    // Category facet
    if (category !== 'all' && cmd.category !== category) {
      return false;
    }

    // Role facet
    const cmdRoles = cmd.roles || cmd.personas || [];
    if (role !== 'all' && !cmdRoles.includes(role)) {
      return false;
    }

    // Operating System facet
    const cmdOS = cmd.supportedOperatingSystems || [];
    if (os !== 'all' && !cmdOS.includes(os)) {
      return false;
    }

    // Shell facet
    const cmdShells = cmd.supportedShells || cmd.shells || [];
    if (shell !== 'all' && !cmdShells.includes(shell)) {
      return false;
    }

    // Risk level facet
    const cmdRisk = cmd.riskLevel || cmd.risk;
    if (activeRisks && !activeRisks.has(cmdRisk)) {
      return false;
    }

    return true;
  });

  // 2. Relevance Scoring & Candidate Filtering
  let scoredResults = filtered.map((cmd) => {
    const relevance = hasQuery ? scoreCommand(cmd, queryTokens, expandedTokens, os, shell) : 0;
    return { cmd, relevance };
  });

  // When query is active, only retain commands with positive relevance score
  if (hasQuery) {
    scoredResults = scoredResults.filter((item) => item.relevance > 0);
  }

  // 3. Deterministic Sorting
  const riskRank = {
    low: 1,
    safe: 1,
    medium: 2,
    modifying: 2,
    high: 3,
    critical: 4,
    destructive: 4
  };

  scoredResults.sort((a, b) => {
    if (sortBy === 'relevance' && hasQuery) {
      if (b.relevance !== a.relevance) {
        return b.relevance - a.relevance;
      }
      return a.cmd.title.localeCompare(b.cmd.title);
    }

    if (sortBy === 'title-asc' || (sortBy === 'relevance' && !hasQuery)) {
      return a.cmd.title.localeCompare(b.cmd.title);
    }

    if (sortBy === 'title-desc') {
      return b.cmd.title.localeCompare(a.cmd.title);
    }

    if (sortBy === 'risk-asc') {
      const rankA = riskRank[a.cmd.riskLevel || a.cmd.risk] || 1;
      const rankB = riskRank[b.cmd.riskLevel || b.cmd.risk] || 1;
      if (rankA !== rankB) return rankA - rankB;
      return a.cmd.title.localeCompare(b.cmd.title);
    }

    if (sortBy === 'risk-desc') {
      const rankA = riskRank[a.cmd.riskLevel || a.cmd.risk] || 1;
      const rankB = riskRank[b.cmd.riskLevel || b.cmd.risk] || 1;
      if (rankA !== rankB) return rankB - rankA;
      return a.cmd.title.localeCompare(b.cmd.title);
    }

    return 0;
  });

  return scoredResults.map((item) => item.cmd);
}

