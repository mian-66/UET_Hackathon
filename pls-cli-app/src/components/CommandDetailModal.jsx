import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  X,
  Copy,
  Check,
  AlertCircle,
  Star,
  Shield,
  AlertTriangle,
  Flame,
  Terminal,
  Flag,
  Code2,
  Layers,
  ArrowRight,
  Lock,
  Unlock,
  ShieldAlert
} from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard.js';
import { scanCommandSecurity, RISK_LEVELS } from '../utils/securityScanner.js';
import { SafetyBanner } from './SafetyBanner.jsx';

export function CommandDetailModal({
  command,
  onClose,
  isFavorite = false,
  onToggleFavorite,
  onSelectRelated,
  allCommands = [],
  recordView
}) {
  const [copyStatus, setCopyStatus] = useState('idle'); // 'idle' | 'copied' | 'failed'
  const [isCriticalUnlocked, setIsCriticalUnlocked] = useState(false);
  const modalRef = useRef(null);
  const previousActiveElementRef = useRef(null);

  // Extract command fields
  const commandSyntax = command ? (command.command || command.syntax || '') : '';
  const commandTitle = command ? (command.title || command.id || 'Command Details') : '';
  const commandDescription = command ? (command.taskDescription || command.description || '') : '';
  const commandExplanation = command ? (command.explanation || '') : '';
  const commandOS = command?.supportedOperatingSystems || ['linux', 'macos', 'windows'];
  const commandShells = command?.supportedShells || command?.shells || ['bash', 'zsh', 'powershell'];

  // Security Assessment Dossier
  const scanResult = useMemo(() => {
    if (!command) return null;
    return scanCommandSecurity(commandSyntax, command);
  }, [commandSyntax, command]);

  // Reset critical unlock state when command changes
  useEffect(() => {
    setIsCriticalUnlocked(false);
  }, [command?.id]);

  // Record command view in LRU history on open
  useEffect(() => {
    if (command && command.id && recordView) {
      recordView(command.id);
    }
  }, [command?.id, recordView]);

  // Focus Trapping & Escape Key Listener
  useEffect(() => {
    previousActiveElementRef.current = document.activeElement;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Trap Tab Focus inside Modal
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Auto-focus first focusable element inside modal
    if (modalRef.current) {
      const firstBtn = modalRef.current.querySelector('button');
      if (firstBtn) {
        firstBtn.focus();
      } else {
        modalRef.current.focus();
      }
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Restore focus to triggering element
      if (
        previousActiveElementRef.current &&
        typeof previousActiveElementRef.current.focus === 'function'
      ) {
        previousActiveElementRef.current.focus();
      }
    };
  }, [onClose]);

  if (!command || !scanResult) return null;

  const isCritical = scanResult.isCritical;
  const canCopy = !isCritical || isCriticalUnlocked;

  const handleCopy = async () => {
    if (!commandSyntax || !canCopy) return;
    const result = await copyToClipboard(commandSyntax);
    if (result.success) {
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } else {
      setCopyStatus('failed');
      setTimeout(() => setCopyStatus('idle'), 2500);
    }
  };

  // Resolve related commands
  const relatedCommands =
    command.relatedCommandIds && command.relatedCommandIds.length > 0
      ? allCommands.filter((c) => command.relatedCommandIds.includes(c.id)).slice(0, 3)
      : allCommands.filter((c) => c.category === command.category && c.id !== command.id).slice(0, 3);

  // Normalize example
  const exampleData = command.example
    ? [
        {
          scenario: command.example.scenario,
          command: command.example.commandWithArgs,
          expectedOutcome: command.example.expectedOutput
        }
      ]
    : command.examples || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-command-title"
        tabIndex={-1}
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-2xl overflow-hidden focus:outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-start justify-between p-6 border-b border-[#1E293B] bg-[#0B0F19]/80">
          <div className="pr-6">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${
                  scanResult.riskLevel === RISK_LEVELS.CRITICAL
                    ? 'bg-rose-500/15 text-rose-300 border-rose-500/40'
                    : scanResult.riskLevel === RISK_LEVELS.HIGH
                    ? 'bg-orange-500/15 text-orange-400 border-orange-500/30'
                    : scanResult.riskLevel === RISK_LEVELS.MEDIUM
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}
              >
                {scanResult.riskLevel === RISK_LEVELS.CRITICAL ? (
                  <Flame className="w-3.5 h-3.5 animate-pulse" />
                ) : scanResult.riskLevel === RISK_LEVELS.HIGH ? (
                  <AlertTriangle className="w-3.5 h-3.5" />
                ) : scanResult.riskLevel === RISK_LEVELS.MEDIUM ? (
                  <AlertTriangle className="w-3.5 h-3.5" />
                ) : (
                  <Shield className="w-3.5 h-3.5" />
                )}
                <span className="capitalize">{scanResult.riskLevel} Risk</span>
              </span>

              <span className="text-xs font-mono uppercase text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                {command.category}
              </span>

              {scanResult.isElevated && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30 font-bold">
                  <Lock className="w-3 h-3" />
                  <span>{scanResult.privilegeRequired}</span>
                </span>
              )}
            </div>
            <h2
              id="modal-command-title"
              className="text-xl sm:text-2xl font-bold text-white font-mono leading-snug"
            >
              {commandTitle}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleFavorite && onToggleFavorite(command.id)}
              className={`p-2 rounded-xl transition-colors ${
                isFavorite
                  ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={isFavorite}
            >
              <Star className={`w-5 h-5 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Deep Safety Assessment Dossier Banner */}
          <SafetyBanner scanResult={scanResult} />

          {/* Description & Technical Explanation */}
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                Task Intent
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed font-sans">
                {commandDescription}
              </p>
            </div>
            {commandExplanation && (
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-1 font-semibold">
                  Technical Explanation
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {commandExplanation}
                </p>
              </div>
            )}
          </div>

          {/* Syntax Execution Box with Critical Confirmation Gate */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-lime-400" />
                <span>Command Syntax</span>
              </h4>
              <span className="text-[11px] font-mono text-slate-400">1-click copy enabled</span>
            </div>

            {/* Critical Safety Gate Checkbox (if Critical Tier) */}
            {isCritical && (
              <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/40 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="critical-ack-toggle"
                  checked={isCriticalUnlocked}
                  onChange={(e) => setIsCriticalUnlocked(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded bg-slate-900 border-rose-500 text-rose-500 focus:ring-rose-500 cursor-pointer"
                />
                <label
                  htmlFor="critical-ack-toggle"
                  className="text-xs font-mono text-rose-200 cursor-pointer select-none leading-relaxed"
                >
                  <strong className="text-rose-100 font-bold block">Acknowledge Destructive Risk to Unlock Copy:</strong>
                  I verify this command modifies disk, forces remote branch changes, or executes destructive file deletion. I have checked target paths and parameters.
                </label>
              </div>
            )}

            <div className="flex items-center justify-between p-4 rounded-xl bg-[#0B0F19] border border-[#1E293B] font-mono text-sm text-lime-200 transition-all select-all shadow-inner">
              <div className="flex items-center gap-2 overflow-x-auto pr-4 scrollbar-none">
                <span className="text-lime-400 font-bold select-none">$</span>
                <code className="text-lime-300 font-mono">{commandSyntax}</code>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                disabled={!canCopy}
                className={`px-3.5 py-1.5 rounded-lg font-mono text-xs flex items-center gap-1.5 transition-all shrink-0 ${
                  !canCopy
                    ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                    : copyStatus === 'copied'
                    ? 'bg-lime-400 text-slate-950 font-bold shadow-lime-glow'
                    : copyStatus === 'failed'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : isCritical
                    ? 'bg-rose-500 hover:bg-rose-400 text-white font-bold shadow-sm'
                    : 'bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold'
                }`}
                aria-label={canCopy ? "Copy command syntax" : "Safety locked: acknowledge risk above to enable copy"}
              >
                {!canCopy ? (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Locked</span>
                  </>
                ) : copyStatus === 'copied' ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Copied!</span>
                  </>
                ) : copyStatus === 'failed' ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <span>Failed</span>
                  </>
                ) : isCritical ? (
                  <>
                    <Unlock className="w-3.5 h-3.5" />
                    <span>Copy Critical</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Platform Compatibility Matrix */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
              Platform &amp; Shell Compatibility
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-[#0B0F19] border border-[#1E293B]">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Supported OS:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {commandOS.map((os) => (
                    <span
                      key={os}
                      className="px-2 py-0.5 rounded text-xs font-mono bg-[#182234] border border-slate-700 text-slate-200 capitalize"
                    >
                      {os}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  Supported Shells:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {commandShells.map((sh) => (
                    <span
                      key={sh}
                      className="px-2 py-0.5 rounded text-xs font-mono bg-[#182234] border border-slate-700 text-lime-300 font-semibold"
                    >
                      {sh}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Flags Breakdown */}
          {command.flags && command.flags.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-lime-400" />
                <span>Flags &amp; Options</span>
              </h4>
              <div className="border border-[#1E293B] rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#182234] border-b border-[#1E293B] text-slate-400 font-mono">
                    <tr>
                      <th className="py-2.5 px-4">Flag</th>
                      <th className="py-2.5 px-4">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E293B] font-mono text-slate-300">
                    {command.flags.map((flag) => (
                      <tr key={flag.flag} className="hover:bg-slate-900/40">
                        <td className="py-2.5 px-4 font-bold text-lime-400">{flag.flag}</td>
                        <td className="py-2.5 px-4 font-sans text-slate-300">{flag.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Parameters Breakdown */}
          {command.parameters && command.parameters.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-lime-400" />
                <span>Argument Parameters</span>
              </h4>
              <div className="border border-[#1E293B] rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#182234] border-b border-[#1E293B] text-slate-400 font-mono">
                    <tr>
                      <th className="py-2.5 px-4">Parameter</th>
                      <th className="py-2.5 px-4">Type</th>
                      <th className="py-2.5 px-4">Default</th>
                      <th className="py-2.5 px-4">Explanation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E293B] font-mono text-slate-300">
                    {command.parameters.map((p) => (
                      <tr key={p.name} className="hover:bg-slate-900/40">
                        <td className="py-2.5 px-4 font-bold text-cyan-400">&lt;{p.placeholder}&gt;</td>
                        <td className="py-2.5 px-4 text-slate-400">{p.type}</td>
                        <td className="py-2.5 px-4 text-amber-300">{p.defaultValue || 'None'}</td>
                        <td className="py-2.5 px-4 font-sans text-slate-300">{p.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Real-World Examples */}
          {exampleData.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-lime-400" />
                <span>Sample Usage &amp; Expected Output</span>
              </h4>
              <div className="space-y-3">
                {exampleData.map((ex, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#182234]/70 border border-[#1E293B] space-y-2">
                    <div className="text-xs font-medium text-slate-200 font-sans">{ex.scenario}</div>
                    <div className="p-2.5 rounded-lg bg-[#0B0F19] font-mono text-xs text-lime-300 border border-[#1E293B] select-all">
                      $ {ex.command}
                    </div>
                    <div className="text-xs font-mono text-slate-400 flex items-start gap-2 pt-1 whitespace-pre-wrap">
                      <span className="text-emerald-400">➜</span>
                      <span>{ex.expectedOutcome}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Commands */}
          {relatedCommands.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
                Related Tasks
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {relatedCommands.map((rel) => (
                  <button
                    key={rel.id}
                    onClick={() => onSelectRelated && onSelectRelated(rel)}
                    className="p-3 rounded-xl bg-[#182234] hover:bg-slate-800 border border-[#1E293B] text-left transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-lime-300">
                        {rel.title}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 truncate max-w-xs">
                        $ {rel.command || rel.syntax}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-lime-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tag Cloud */}
          {command.tags && command.tags.length > 0 && (
            <div className="pt-2 border-t border-[#1E293B] flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-mono text-slate-400">Tags:</span>
              {command.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 border border-slate-800 text-slate-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
