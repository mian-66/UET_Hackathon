/**
 * Pls-CLI Security Scanner & Heuristic Risk Governance Engine
 * 
 * Provides deterministic AST/pattern-based risk analysis, privilege detection,
 * shell dialect footguns, and anti-pattern identification for both curated
 * and dynamic/AI-generated CLI syntax.
 * 
 * Threat Philosophy:
 * - Never execute: purely analytical client-side inspection.
 * - Defense-in-depth: combines curation metadata with deep pattern heuristics.
 * - Always err on the side of caution: escalate risk if heuristics detect elevated impact.
 */

/**
 * Standardized Risk Levels
 * @readonly
 * @enum {string}
 */
export const RISK_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
};

/**
 * Standardized Privilege Tiers
 * @readonly
 * @enum {string}
 */
export const PRIVILEGE_TIERS = {
  STANDARD: 'Standard User',
  ELEVATED: 'Elevated / Administrator',
  ROOT: 'Root / Superuser'
};

/**
 * High-Risk Anti-Pattern Detection Matrix
 */
const THREAT_PATTERNS = [
  // 1. Recursive Root / Broad Filesystem Deletion
  {
    code: 'DESTRUCTIVE_ROOT_DELETION',
    name: 'Destructive Root / Broad Directory Deletion',
    riskLevel: RISK_LEVELS.CRITICAL,
    regex: /\b(?:rm\s+-[a-zA-Z]*[rf][a-zA-Z]*|del\s+\/[a-zA-Z]*[fsq][a-zA-Z]*|Remove-Item\s+[^;\n]*-(?:Recurse|Force))\s+(?:(?:\/|\/\*|~|~\/\*|\.\.|\.\.\/\*|\*|[a-zA-Z]:\\|\$env:[a-zA-Z_]+)(?:\s|$))/i,
    description: 'Attempts recursive deletion targeted at root, user home directory, or entire drives with force flags.',
    footgun: 'Executing this with elevated permissions will cause catastrophic, unrecoverable system corruption.'
  },

  // 2. Recursive Filesystem Deletion (Targeted)
  {
    code: 'RECURSIVE_FORCE_DELETION',
    name: 'Recursive Force Deletion',
    riskLevel: RISK_LEVELS.HIGH,
    regex: /\b(?:rm\s+-[a-zA-Z]*[rf][a-zA-Z]*|rmdir\s+\/s\s+\/q|del\s+\/[a-zA-Z]*[fsq][a-zA-Z]*|Remove-Item\b[^;\n]*-(?:Recurse|Force))\b/i,
    description: 'Permanently deletes files and folder trees bypassing the trash or confirmation prompts.',
    footgun: 'Bypasses operating system recycle bins. Files cannot be recovered without specialized forensics.'
  },

  // 3. Pipe to Shell / Remote Code Execution (RCE)
  {
    code: 'PIPE_TO_SHELL_RCE',
    name: 'Unverified Remote Code Execution (Pipe to Shell)',
    riskLevel: RISK_LEVELS.CRITICAL,
    regex: /(?:curl|wget|fetch|iwr|invoke-webrequest|irm)\b[^|;&\n]*\|\s*(?:bash|sh|zsh|dash|ksh|python|perl|ruby|iex|invoke-expression)\b/i,
    description: 'Streams remote code directly from the network into an executable shell without local integrity verification.',
    footgun: 'Subject to Man-in-the-Middle (MITM) tampering, DNS poisoning, and untrusted arbitrary remote execution.'
  },

  // 4. Raw Block Device / Disk Formatting
  {
    code: 'RAW_BLOCK_OVERWRITE',
    name: 'Direct Disk / Raw Block Overwrite',
    riskLevel: RISK_LEVELS.CRITICAL,
    regex: /\b(?:dd\s+[^;\n]*of=\/dev\/(?:sd[a-z]|nvme[0-9]n[0-9]|hd[a-z]|vd[a-z]|disk[0-9])|mkfs(?:\.[a-zA-Z0-9]+)?\s+|fdisk\b|diskpart\b|Format-Volume\b|format\s+[a-zA-Z]:\b)/i,
    description: 'Directly writes to raw disk partitions, reformats filesystem volumes, or modifies master boot tables.',
    footgun: 'Overwrites partition tables and sector data immediately, causing irreversible storage volume wipe.'
  },

  // 5. Privilege Escalation Commands
  {
    code: 'PRIVILEGE_ESCALATION',
    name: 'Elevated Privilege Invocation',
    riskLevel: RISK_LEVELS.HIGH,
    regex: /\b(?:sudo\b|su\s+-?|doas\b|runas\b|Start-Process\b[^;\n]*-Verb\s+RunAs\b|Set-ExecutionPolicy\b[^;\n]*(?:Bypass|Unrestricted)\b)/i,
    description: 'Executes operations under superuser (root) or Administrator authority, bypassing standard user boundaries.',
    footgun: 'Elevated processes inherit full host control; mistaken paths or commands affect the entire operating system.'
  },

  // 6. Credential & Private Secret Inspection
  {
    code: 'CREDENTIAL_EXPOSURE',
    name: 'Potential Credential / Secret Exposure',
    riskLevel: RISK_LEVELS.HIGH,
    regex: /\b(?:cat|type|more|less|head|tail|Get-Content|gc)\b[^;\n]*(?:\.ssh[\\/](?:id_rsa|id_ed25519|id_ecdsa|authorized_keys)|\.aws[\\/](?:credentials|config)|\.env(?:\.[a-zA-Z0-9_-]+)?|\.docker[\\/]config\.json|\.npmrc|history\b)/i,
    description: 'Reads private SSH keys, cloud API tokens, environment variables, or shell history directly to standard output.',
    footgun: 'Echoing credentials in terminal windows risks exposing sensitive secrets in process logs, screen sharing, or terminal replays.'
  },

  // 7. Network / Firewall Modification
  {
    code: 'FIREWALL_SECURITY_TAMPERING',
    name: 'Firewall / Security Policy Alteration',
    riskLevel: RISK_LEVELS.HIGH,
    regex: /\b(?:iptables\s+-[FX]|ufw\s+disable|Set-NetFirewallProfile\b[^;\n]*-Enabled\s+\$false|Set-MpPreference\b[^;\n]*-DisableRealtimeMonitoring\s+\$true)/i,
    description: 'Flushes network packet filtering rules, disables firewalls, or shuts off real-time antivirus defenses.',
    footgun: 'Exposes open ports and listening sockets to local subnet and public network attack vectors.'
  },

  // 8. Raw Listening Socket
  {
    code: 'RAW_LISTENING_SOCKET',
    name: 'Raw Network Listener Spawning',
    riskLevel: RISK_LEVELS.MEDIUM,
    regex: /\b(?:nc|ncat|netcat)\b[^;\n]*-(?:l|lvp|lp)\b/i,
    description: 'Opens an arbitrary unauthenticated TCP/UDP listening port on the host machine.',
    footgun: 'Exposing untrusted listening ports can facilitate reverse shells or unauthorized inbound connections.'
  },

  // 9. Git Force Push / History Rewrite
  {
    code: 'GIT_FORCE_REWRITE',
    name: 'Remote History Overwrite / Force Push',
    riskLevel: RISK_LEVELS.CRITICAL,
    regex: /\bgit\s+push\b[^;\n]*--force(?:\s|$|\b)|git\s+push\b[^;\n]*\s+-f(?:\s|$|\b)/i,
    description: 'Forcefully pushes local history to remote branch, overwriting existing commits on upstream.',
    footgun: 'Overwrites team commits permanently on shared Git branches. Disallowed on protected branches in production.'
  },

  // 10. Process Kill Force
  {
    code: 'FORCE_PROCESS_TERMINATION',
    name: 'Unconditional Process Termination',
    riskLevel: RISK_LEVELS.HIGH,
    regex: /\b(?:kill\s+-9|killall\s+-9|taskkill\b[^;\n]*\/f|Stop-Process\b[^;\n]*-Force)\b/i,
    description: 'Sends SIGKILL or forces immediate task destruction without allowing applications to save state.',
    footgun: 'Processes cannot perform cleanup hooks, leading to database lock corruption and unsaved file loss.'
  }
];

/**
 * Shell-Specific Footguns & Syntax Incompatibilities
 */
const SHELL_FOOTGUNS = [
  {
    id: 'pwsh-curly-brace',
    test: (cmd) => cmd.includes('{') && cmd.includes('}'),
    warning: 'PowerShell treats curly braces as script blocks, whereas Bash treats them as brace expansion.'
  },
  {
    id: 'posix-grep-pipe',
    test: (cmd) => /\bgrep\b/i.test(cmd),
    warning: 'POSIX "grep" is not natively available in Windows CMD or pure PowerShell (use "Select-String" or Git Bash).'
  },
  {
    id: 'windows-forward-slash',
    test: (cmd) => /\b(?:dir|copy|del|type)\b/i.test(cmd) && cmd.includes('/'),
    warning: 'Windows CMD treats forward slashes as option flags (e.g. /s /q), while PowerShell and Bash treat them as directory paths.'
  },
  {
    id: 'sudo-on-windows',
    test: (cmd) => /\bsudo\b/i.test(cmd),
    warning: '"sudo" is not a native Windows command unless third-party tools (gsudo / Sudo for Windows 11) are installed.'
  },
  {
    id: 'export-vs-set',
    test: (cmd) => /\bexport\s+[A-Za-z0-9_]+=/i.test(cmd),
    warning: '"export VAR=val" only sets environment variables in Bash/Zsh; use "$env:VAR=val" in PowerShell or "set VAR=val" in CMD.'
  }
];

/**
 * Evaluates Privilege Tier based on command tokens
 * @param {string} commandStr
 * @returns {string}
 */
export function detectPrivilegeTier(commandStr) {
  if (!commandStr || typeof commandStr !== 'string') return PRIVILEGE_TIERS.STANDARD;

  if (/\b(?:sudo|su\s+-?|doas)\b/i.test(commandStr)) {
    return PRIVILEGE_TIERS.ROOT;
  }
  if (/\b(?:runas|Start-Process\b[^;\n]*-Verb\s+RunAs)\b/i.test(commandStr)) {
    return PRIVILEGE_TIERS.ELEVATED;
  }
  return PRIVILEGE_TIERS.STANDARD;
}

/**
 * Performs heuristic security audit on a command string
 * 
 * @param {string} commandStr - The raw terminal command string
 * @param {Object} [curatedMetadata={}] - Optional metadata from verified dataset
 * @returns {Object} Security Assessment Dossier
 */
export function scanCommandSecurity(commandStr = '', curatedMetadata = {}) {
  const safeStr = typeof commandStr === 'string' ? commandStr.trim() : '';

  const matchedThreats = [];
  const detectedWarnings = [];
  const activeFootguns = [];
  let calculatedRisk = curatedMetadata.riskLevel || RISK_LEVELS.LOW;

  // 1. Audit against Threat Patterns
  for (const threat of THREAT_PATTERNS) {
    if (threat.regex.test(safeStr)) {
      matchedThreats.push({
        code: threat.code,
        name: threat.name,
        riskLevel: threat.riskLevel,
        description: threat.description,
        footgun: threat.footgun
      });
      detectedWarnings.push(`${threat.name}: ${threat.description}`);

      // Escalate calculated risk if threat is more severe than current level
      if (threat.riskLevel === RISK_LEVELS.CRITICAL) {
        calculatedRisk = RISK_LEVELS.CRITICAL;
      } else if (threat.riskLevel === RISK_LEVELS.HIGH && calculatedRisk !== RISK_LEVELS.CRITICAL) {
        calculatedRisk = RISK_LEVELS.HIGH;
      } else if (threat.riskLevel === RISK_LEVELS.MEDIUM && calculatedRisk === RISK_LEVELS.LOW) {
        calculatedRisk = RISK_LEVELS.MEDIUM;
      }
    }
  }

  // 2. Audit against Shell-Specific Footguns
  for (const footgun of SHELL_FOOTGUNS) {
    if (footgun.test(safeStr)) {
      activeFootguns.push(footgun.warning);
    }
  }

  // 3. Detect Privilege Requirements
  const privilegeRequired = detectPrivilegeTier(safeStr);
  if (privilegeRequired !== PRIVILEGE_TIERS.STANDARD && calculatedRisk === RISK_LEVELS.LOW) {
    calculatedRisk = RISK_LEVELS.MEDIUM;
  }

  // 4. Universal Context Dependency Notes
  const contextNotes = [
    'Command impact varies directly based on your current working directory (pwd).',
    'Active user permissions (root/sudo vs standard) determine filesystem write scope.',
    'Piping output to external utilities can produce unexpected side-effects if unquoted.'
  ];

  const isCritical = calculatedRisk === RISK_LEVELS.CRITICAL;
  const isHigh = calculatedRisk === RISK_LEVELS.HIGH;

  return {
    command: safeStr,
    riskLevel: calculatedRisk,
    isCritical,
    isHigh,
    isElevated: privilegeRequired !== PRIVILEGE_TIERS.STANDARD,
    privilegeRequired,
    matchedThreats,
    warnings: detectedWarnings,
    footguns: activeFootguns,
    contextNotes,
    requiresConfirmationToCopy: isCritical,
    isVerifiedCurated: Boolean(curatedMetadata.id)
  };
}

/**
 * Storage Input Sanitizer
 * Strips prototype pollution vectors and limits maximum key/value byte length.
 * 
 * @param {string} input - Raw user input string
 * @param {number} [maxLength=200] - Maximum allowed string length
 * @returns {string} Sanitized string
 */
export function sanitizeStorageInput(input, maxLength = 200) {
  if (typeof input !== 'string') return '';

  // Prevent prototype pollution keys
  const trimmed = input.trim();
  if (
    trimmed === '__proto__' ||
    trimmed === 'constructor' ||
    trimmed === 'prototype'
  ) {
    return '';
  }

  // Strip null bytes and non-printable control characters (except common spaces)
  const cleaned = trimmed.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  return cleaned.slice(0, maxLength);
}
