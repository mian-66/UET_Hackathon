import React, { useState, useMemo } from 'react';
import {
  Copy,
  Check,
  AlertCircle,
  Star,
  Shield,
  AlertTriangle,
  Flame,
  ChevronRight,
  Terminal,
  Cpu,
  Apple,
  Monitor,
  Lock,
  Unlock,
  X
} from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard.js';
import { scanCommandSecurity, RISK_LEVELS } from '../utils/securityScanner.js';

/**
 * Helper to highlight CLI syntax with tokens (base command, flags, arguments)
 */
function renderHighlightedSyntax(commandStr) {
  if (!commandStr) return null;
  const tokens = commandStr.split(/(\s+)/);

  let isFirstToken = true;

  return tokens.map((token, idx) => {
    if (/^\s+$/.test(token)) {
      return <span key={idx}>{token}</span>;
    }

    if (isFirstToken) {
      isFirstToken = false;
      return (
        <span key={idx} className="text-lime-400 font-bold">
          {token}
        </span>
      );
    }

    // Flags: --flag or -f
    if (token.startsWith('--')) {
      return (
        <span key={idx} className="text-amber-300 font-semibold">
          {token}
        </span>
      );
    }
    if (token.startsWith('-') && token.length > 1) {
      return (
        <span key={idx} className="text-amber-400 font-medium">
          {token}
        </span>
      );
    }

    // Numbers / Ports / Sizes (e.g. 3000, 100M, 755, 644)
    if (/^\d+[A-Za-z]?$/.test(token)) {
      return (
        <span key={idx} className="text-cyan-300">
          {token}
        </span>
      );
    }

    // Subcommands or arguments
    return (
      <span key={idx} className="text-slate-200">
        {token}
      </span>
    );
  });
}

/**
 * OS icon / label mapping
 */
function getPlatformBadges(osList = []) {
  return osList.map((os) => {
    switch (os.toLowerCase()) {
      case 'linux':
        return { label: 'Linux', icon: Cpu, key: 'linux' };
      case 'macos':
        return { label: 'macOS', icon: Apple, key: 'macos' };
      case 'windows':
        return { label: 'Win', icon: Monitor, key: 'windows' };
      default:
        return { label: os, icon: Monitor, key: os };
    }
  });
}

export function CommandCard({
  command,
  onInspect,
  isFavorite = false,
  onToggleFavorite,
  onCopySuccess
}) {
  const [copyStatus, setCopyStatus] = useState('idle'); // 'idle' | 'confirming' | 'copied' | 'failed'

  const commandSyntax = command.command || command.syntax || '';
  const commandTitle = command.title || command.id || 'Command';
  const commandDescription = command.taskDescription || command.description || '';
  const commandShells = command.supportedShells || command.shells || [];
  const commandOS = command.supportedOperatingSystems || ['linux', 'macos', 'windows'];

  // Deep Security Analysis
  const scanResult = useMemo(() => {
    return scanCommandSecurity(commandSyntax, command);
  }, [commandSyntax, command]);

  const isCritical = scanResult.isCritical;
  const effectiveRisk = scanResult.riskLevel;

  // Execute clipboard write
  const executeCopy = async () => {
    if (!commandSyntax) return;
    const result = await copyToClipboard(commandSyntax);
    if (result.success) {
      setCopyStatus('copied');
      if (onCopySuccess) {
        onCopySuccess(command);
      }
      setTimeout(() => {
        setCopyStatus('idle');
      }, 2000);
    } else {
      setCopyStatus('failed');
      setTimeout(() => {
        setCopyStatus('idle');
      }, 2500);
    }
  };

  const handleCopyClick = (e) => {
    e.stopPropagation();

    // If critical tier, require safety confirmation before writing to clipboard
    if (isCritical && copyStatus !== 'confirming') {
      setCopyStatus('confirming');
      return;
    }

    executeCopy();
  };

  const handleCancelConfirm = (e) => {
    e.stopPropagation();
    setCopyStatus('idle');
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(command.id);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (e.target === e.currentTarget) {
        e.preventDefault();
        onInspect(command);
      }
    }
  };

  // Color mappings for Risk Badges
  const riskStyles = {
    [RISK_LEVELS.LOW]: {
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: Shield,
      label: 'Safe / Read-Only'
    },
    [RISK_LEVELS.MEDIUM]: {
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: AlertTriangle,
      label: 'Modifying'
    },
    [RISK_LEVELS.HIGH]: {
      badge: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      icon: AlertTriangle,
      label: 'High Impact'
    },
    [RISK_LEVELS.CRITICAL]: {
      badge: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
      icon: Flame,
      label: 'Critical / Destructive'
    }
  };

  const risk = riskStyles[effectiveRisk] || riskStyles[RISK_LEVELS.LOW];
  const RiskIcon = risk.icon;
  const platformBadges = getPlatformBadges(commandOS);

  return (
    <div
      role="article"
      tabIndex={0}
      aria-label={`${commandTitle} command`}
      onClick={() => onInspect(command)}
      onKeyDown={handleKeyDown}
      className={`group relative flex flex-col justify-between p-5 rounded-2xl bg-[#0F172A] border shadow-lg hover:shadow-card-elevated transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 ${
        isCritical
          ? 'border-rose-900/60 hover:border-rose-500/70 focus:ring-rose-500/50'
          : 'border-[#1E293B] hover:border-lime-400/40 focus:ring-lime-400/50'
      }`}
    >
      <div>
        {/* Card Header: Category Badge, Risk Badge, and Favorite Star */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border ${risk.badge}`}
              title={scanResult.warnings.join(' • ') || risk.label}
            >
              <RiskIcon className={`w-3 h-3 ${isCritical ? 'animate-pulse' : ''}`} />
              <span>{risk.label}</span>
            </span>

            <span className="text-[10px] font-mono uppercase text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
              {command.category}
            </span>

            {scanResult.isElevated && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950/40 border border-purple-800/40 text-purple-300 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" />
                <span>Elevated</span>
              </span>
            )}
          </div>

          <button
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={isFavorite}
            className={`p-1.5 rounded-lg border transition-all ${
              isFavorite
                ? 'bg-amber-400/10 border-amber-400/30 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Command Title & Natural Language Description */}
        <div className="mb-4 space-y-1">
          <h3 className="font-mono text-base font-bold text-white group-hover:text-lime-300 transition-colors flex items-center justify-between">
            <span>{commandTitle}</span>
          </h3>
          <p className="text-xs text-slate-300 font-sans line-clamp-2 leading-relaxed">
            {commandDescription}
          </p>
        </div>

        {/* Code Snippet Display with Syntax Highlighting */}
        <div className="relative mb-4 rounded-xl bg-[#0B0F19] border border-[#1E293B] p-3 font-mono text-xs overflow-x-auto scrollbar-none group-hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-2 text-slate-400 select-none text-[11px] mb-1.5 pb-1 border-b border-slate-900">
            <Terminal className="w-3 h-3 text-lime-400/70" />
            <span>terminal syntax</span>
          </div>
          <code className="block whitespace-pre font-mono leading-relaxed select-all">
            {renderHighlightedSyntax(commandSyntax)}
          </code>
        </div>
      </div>

      {/* Card Footer: Platform Compatibility & Action Toolbar */}
      <div className="pt-3 border-t border-[#1E293B] space-y-3">
        {/* Compatibility Glyphs (OS & Shells) */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 uppercase">OS:</span>
            <div className="flex items-center gap-1">
              {platformBadges.map(({ label, icon: Icon, key }) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#182234] border border-slate-800 text-[10px] text-slate-300"
                  title={`Supported on ${label}`}
                >
                  <Icon className="w-2.5 h-2.5 text-lime-400/80" />
                  <span>{label}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Shell pills */}
          <div className="flex items-center gap-1">
            {commandShells.slice(0, 2).map((shell) => (
              <span
                key={shell}
                className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono"
              >
                {shell}
              </span>
            ))}
            {commandShells.length > 2 && (
              <span className="text-[10px] text-slate-400">
                +{commandShells.length - 2}
              </span>
            )}
          </div>
        </div>

        {/* Action Toolbar with Safety-Gated Critical Confirmation */}
        <div className="flex items-center justify-between gap-2">
          {/* View Details CTA */}
          <button
            onClick={() => onInspect(command)}
            className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-white transition-colors py-1 px-2 rounded-lg hover:bg-slate-800"
            aria-label={`View full details for ${commandTitle}`}
          >
            <span>Inspect</span>
            <ChevronRight className="w-3.5 h-3.5 text-lime-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Critical Confirmation Mode vs Standard Copy */}
          {copyStatus === 'confirming' ? (
            <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
              <button
                onClick={handleCopyClick}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold shadow-sm transition-all"
                title="Acknowledge destructive risk and copy syntax"
                aria-label="Confirm critical command copy"
              >
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Confirm?</span>
              </button>
              <button
                onClick={handleCancelConfirm}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="Cancel copy"
                aria-label="Cancel critical command copy"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleCopyClick}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all shadow-sm ${
                copyStatus === 'copied'
                  ? 'bg-lime-400 text-slate-950 shadow-lime-glow font-bold'
                  : copyStatus === 'failed'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : isCritical
                  ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40'
                  : 'bg-[#182234] hover:bg-slate-800 text-slate-200 border border-[#1E293B] hover:border-slate-700'
              }`}
              aria-label={`Copy syntax for ${commandTitle}`}
            >
              {copyStatus === 'copied' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                  <span>Copied!</span>
                </>
              ) : copyStatus === 'failed' ? (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Failed</span>
                </>
              ) : isCritical ? (
                <>
                  <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  <span>Copy (Critical)</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
