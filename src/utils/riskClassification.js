export const RISK_LEVELS = {
  safe: {
    id: 'safe',
    label: 'Safe',
    color: '#10b981',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    dot: 'bg-emerald-400',
    glow: 'hover:shadow-glow-emerald',
    description: 'Idempotent & non-mutating. Does not write to disk or alter system state.',
    guidance: 'Safe to execute repeatedly without unintended side effects.'
  },
  'read-only': {
    id: 'read-only',
    label: 'Read-Only',
    color: '#0ea5e9',
    badge: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    dot: 'bg-sky-400',
    glow: 'hover:border-sky-500/40',
    description: 'Diagnostic or inspection operation. Reads system, disk, or network metrics.',
    guidance: 'Exposes diagnostic information; does not modify persistent system files.'
  },
  modifying: {
    id: 'modifying',
    label: 'Modifying',
    color: '#f59e0b',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    dot: 'bg-amber-400',
    glow: 'hover:border-amber-500/40',
    description: 'Mutates local files, branches, or dependencies. Standard developer workflow.',
    guidance: 'Changes system state. Generally reversible, but review paths and flags before running.'
  },
  destructive: {
    id: 'destructive',
    label: 'Destructive',
    color: '#ef4444',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/40',
    dot: 'bg-rose-400',
    glow: 'hover:shadow-glow-rose',
    description: 'Irreversible action: permanently removes data, rewrites commit history, or terminates processes.',
    guidance: 'CAUTION: Verify targets, commit hashes, or PIDs before running. Data loss may occur.'
  }
};

export function getRiskMeta(risk) {
  return RISK_LEVELS[risk] || RISK_LEVELS.safe;
}
