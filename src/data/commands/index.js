import { gitCommands } from './git.js';
import { filesystemCommands } from './filesystem.js';
import { nodeCommands } from './node.js';
import { diagnosticCommands } from './diagnostics.js';
import { textCommands } from './text.js';
import { devopsCommands } from './devops.js';
import { recipeCommands } from './recipes.js';

export const ALL_COMMANDS = [
  ...gitCommands,
  ...filesystemCommands,
  ...nodeCommands,
  ...diagnosticCommands,
  ...textCommands,
  ...devopsCommands,
  ...recipeCommands,
];

export const CATEGORIES = [
  { id: 'all', label: 'All Tasks', icon: 'Terminal' },
  { id: 'git', label: 'Git & Versioning', icon: 'GitBranch' },
  { id: 'filesystem', label: 'Filesystem & Storage', icon: 'Folder' },
  { id: 'node-pkg', label: 'Node & Packages', icon: 'Package' },
  { id: 'system-diagnostics', label: 'Diagnostics & Monitoring', icon: 'Activity' },
  { id: 'text-processing', label: 'Text Tools (grep, sed, awk)', icon: 'FileText' },
  { id: 'devops-network', label: 'DevOps & Docker', icon: 'Server' },
  { id: 'recipes', label: 'Troubleshooting Recipes', icon: 'Flame' },
];

export const PERSONAS = [
  { id: 'all', label: 'All Personas' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'devops', label: 'DevOps / SRE' },
  { id: 'data-science', label: 'Data Science' },
];

export const SHELLS = [
  { id: 'all', label: 'All Shells' },
  { id: 'bash', label: 'Linux (Bash/Zsh)' },
  { id: 'zsh', label: 'macOS (Zsh)' },
  { id: 'powershell', label: 'PowerShell' },
  { id: 'cmd', label: 'Windows CMD' },
  { id: 'git-bash', label: 'Git Bash' },
];

export const RISK_FILTERS = [
  { id: 'all', label: 'All Risk Levels' },
  { id: 'safe', label: 'Safe Only' },
  { id: 'read-only', label: 'Read-Only' },
  { id: 'modifying', label: 'Modifying' },
  { id: 'destructive', label: 'Destructive' },
];
