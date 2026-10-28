import {
  normalizeText,
  tokenizeQuery,
  expandSynonyms,
  filterAndSortCommands
} from '../src/utils/searchCommands.js';
import { commands } from '../src/data/commands.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`\x1b[32m✔ PASS:\x1b[0m ${message}`);
    passed++;
  } else {
    console.error(`\x1b[31m✖ FAIL:\x1b[0m ${message}`);
    failed++;
  }
}

console.log('\n========================================');
console.log('Running Pls-CLI Search Engine Test Suite');
console.log('========================================\n');

// Test 1: Normalization and punctuation handling
const rawText = "   Undo   last commit?? --soft (HEAD~1)!!  ";
const normalized = normalizeText(rawText);
assert(
  normalized === 'undo last commit --soft head~1',
  `normalizeText handles punctuation and whitespace: "${normalized}"`
);

// Test 2: Tokenization
const tokens = tokenizeQuery("kill   port 3000   -9");
assert(
  tokens.length === 4 && tokens[0] === 'kill' && tokens[2] === '3000',
  `tokenizeQuery splits tokens correctly: [${tokens.join(', ')}]`
);

// Test 3: Synonym Expansion
const expanded = expandSynonyms(['show', 'kill']);
assert(
  expanded.has('list') && expanded.has('ls') && expanded.has('terminate') && expanded.has('stop'),
  `expandSynonyms expands "show" and "kill" into domain actions`
);

// Test 4: Natural Language Query Hit (Synonym match "show files")
const showFilesResults = filterAndSortCommands(commands, { query: 'show files' });
assert(
  showFilesResults.some((c) => c.command.includes('ls') || c.id.includes('fs-list')),
  `Natural language query "show files" matches ls listing commands (found ${showFilesResults.length} matches)`
);

// Test 5: Intent Matching for "kill port"
const killPortResults = filterAndSortCommands(commands, { query: 'kill port' });
assert(
  killPortResults.length > 0 && killPortResults[0].command.includes('3000'),
  `"kill port" returns port killing commands as top relevance: "${killPortResults[0]?.command}"`
);

// Test 6: Cross-Platform & Shell Separation Filter
// fs-list-detailed-human (`ls -la`) is supported on linux/macos only, not on windows powershell
const bashResults = filterAndSortCommands(commands, { shell: 'bash' });
const pwshResults = filterAndSortCommands(commands, { shell: 'powershell' });

assert(
  bashResults.some((c) => c.id === 'fs-list-detailed-human'),
  'Shell filter "bash" includes POSIX-specific ls command'
);
assert(
  !pwshResults.some((c) => c.id === 'fs-list-detailed-human'),
  'Shell filter "powershell" excludes POSIX-specific ls command'
);

// Test 7: Compound Filtering (Role + Category + Risk Level)
const compoundResults = filterAndSortCommands(commands, {
  category: 'git',
  role: 'beginner',
  riskLevels: ['low', 'medium']
});

assert(
  compoundResults.every((c) => c.category === 'git'),
  'All compound results belong to category "git"'
);
assert(
  compoundResults.every((c) => c.roles.includes('beginner')),
  'All compound results include role "beginner"'
);
assert(
  compoundResults.every((c) => c.riskLevel === 'low' || c.riskLevel === 'medium'),
  'All compound results conform to risk level constraints (no critical/high)'
);

// Test 8: Empty Query Sorting (Title A-Z)
const sortedAlpha = filterAndSortCommands(commands, { sortBy: 'title-asc' });
assert(
  sortedAlpha[0].title.localeCompare(sortedAlpha[1].title) <= 0,
  `Title-asc sorting verified: "${sortedAlpha[0].title}" comes before "${sortedAlpha[1].title}"`
);

// Test 9: Risk Level Sorting (Critical to Low)
const sortedRiskDesc = filterAndSortCommands(commands, { sortBy: 'risk-desc' });
assert(
  sortedRiskDesc[0].riskLevel === 'critical',
  `Risk-desc sorting starts with critical commands (found: ${sortedRiskDesc[0].riskLevel})`
);

console.log('\n----------------------------------------');
console.log(`Results: ${passed} Passed, ${failed} Failed`);
console.log('----------------------------------------\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}

