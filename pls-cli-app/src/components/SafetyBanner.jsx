import React from 'react';
import {
  Shield,
  AlertTriangle,
  Flame,
  Info,
  Lock,
  Terminal,
  FileWarning
} from 'lucide-react';
import { RISK_LEVELS } from '../utils/securityScanner.js';

export function SafetyBanner({
  scanResult,
  compact = false,
  className = ''
}) {
  if (!scanResult) return null;

  const {
    riskLevel = RISK_LEVELS.LOW,
    matchedThreats = [],
    privilegeRequired,
    isElevated,
    footguns = [],
    contextNotes = []
  } = scanResult;

  // Styling and configuration per risk tier
  const tierConfig = {
    [RISK_LEVELS.LOW]: {
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-950/20',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      text: 'text-emerald-300',
      title: 'Low Risk • Read-Only / State Inspection',
      icon: Shield,
      summary: 'Safe for exploratory execution. Does not mutate working files, branch pointers, or system processes.'
    },
    [RISK_LEVELS.MEDIUM]: {
      border: 'border-amber-500/30',
      bg: 'bg-amber-950/20',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      text: 'text-amber-300',
      title: 'Medium Risk • Modifying / Scoped Impact',
      icon: AlertTriangle,
      summary: 'Creates or modifies local files, dependencies, or staging state in a scoped and standard reversible manner.'
    },
    [RISK_LEVELS.HIGH]: {
      border: 'border-orange-500/40',
      bg: 'bg-orange-950/25',
      badgeBg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      text: 'text-orange-300',
      title: 'High Risk • State Overwrite / Process Termination',
      icon: AlertTriangle,
      summary: 'Interrupts running processes, modifies filesystem permissions, or downloads scripts. Verify target arguments before executing.'
    },
    [RISK_LEVELS.CRITICAL]: {
      border: 'border-rose-500/50',
      bg: 'bg-rose-950/30',
      badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
      text: 'text-rose-200',
      title: 'Critical Risk • Irreversible Data Loss / Disk Destruction',
      icon: Flame,
      summary: 'Performs permanent file deletion, disk formatting, force pushes, or raw block overwrites. Bypasses confirmation safety mechanisms.'
    }
  };

  const config = tierConfig[riskLevel] || tierConfig[RISK_LEVELS.LOW];
  const Icon = config.icon;

  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 p-2.5 rounded-xl border ${config.border} ${config.bg} text-xs font-mono ${className}`}
      >
        <Icon className={`w-4 h-4 shrink-0 ${config.text} ${riskLevel === RISK_LEVELS.CRITICAL ? 'animate-pulse' : ''}`} />
        <span className={`font-semibold ${config.text}`}>{config.title}</span>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Safety Risk Dossier"
      className={`rounded-xl border p-4 space-y-3.5 ${config.border} ${config.bg} ${className}`}
    >
      {/* Banner Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg border ${config.badgeBg}`}>
            <Icon className={`w-4 h-4 ${riskLevel === RISK_LEVELS.CRITICAL ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              {config.title}
            </h4>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              {config.summary}
            </p>
          </div>
        </div>

        {/* Privilege Requirement Badge */}
        {isElevated && (
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/15 border border-purple-500/30 text-purple-300">
            <Lock className="w-3 h-3" />
            <span>{privilegeRequired}</span>
          </span>
        )}
      </div>

      {/* Detected Anti-Patterns Callouts */}
      {matchedThreats.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-300 uppercase">
            <FileWarning className="w-3.5 h-3.5 text-amber-400" />
            <span>Identified Threat Vectors ({matchedThreats.length}):</span>
          </div>
          <ul className="space-y-1">
            {matchedThreats.map((threat, i) => (
              <li
                key={i}
                className="text-xs font-mono text-slate-300 flex items-start gap-2 bg-[#0B0F19]/60 p-2 rounded-lg border border-slate-800"
              >
                <span className="text-rose-400 font-bold shrink-0 mt-0.5">&bull;</span>
                <div>
                  <span className="font-bold text-white mr-1.5">{threat.name}:</span>
                  <span className="text-slate-300 font-sans">{threat.description}</span>
                  {threat.footgun && (
                    <div className="text-[11px] text-amber-300/90 font-mono mt-1">
                      ⚠️ Caution: {threat.footgun}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Shell Dialect Incompatibilities */}
      {footguns.length > 0 && (
        <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-200 space-y-1">
          <div className="flex items-center gap-1 font-bold">
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span>Shell Dialect Warning:</span>
          </div>
          {footguns.map((fg, idx) => (
            <p key={idx} className="text-[11px] leading-relaxed text-amber-200/90 pl-4">
              &bull; {fg}
            </p>
          ))}
        </div>
      )}

      {/* Context Dependency Disclaimer */}
      <div className="flex items-start gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-sans text-slate-400">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="text-slate-300 font-medium">Context Dependency:</span> Command impact is contingent upon your active working directory, user privileges, shell configuration, and environment variables. Safety classifications provide guidance but cannot replace user verification.
        </p>
      </div>
    </div>
  );
}

