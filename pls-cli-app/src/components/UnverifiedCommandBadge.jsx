import React, { useState } from 'react';
import {
  ShieldAlert,
  Lock,
  Unlock,
  Check,
  Copy,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard.js';

export function UnverifiedCommandBadge({
  command = '',
  source = 'AI Generation / Heuristic',
  onCopySuccess,
  className = ''
}) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!isUnlocked || !command) return;
    const result = await copyToClipboard(command);
    if (result.success) {
      setCopied(true);
      if (onCopySuccess) onCopySuccess(command);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      role="region"
      aria-label="Unverified Command Advisory"
      className={`rounded-xl border-2 border-dashed border-amber-500/50 bg-[#0F172A] p-4 space-y-3.5 shadow-xl ${className}`}
    >
      {/* Badge Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-500/15 border border-amber-500/40 text-amber-300">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>UNVERIFIED / EXPERIMENTAL SUGGESTION</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-lime-400" />
            <span>{source}</span>
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
          {isUnlocked ? (
            <span className="text-lime-400 flex items-center gap-1 font-semibold">
              <Unlock className="w-3 h-3" />
              <span>Unlocked</span>
            </span>
          ) : (
            <span className="text-amber-400 flex items-center gap-1 font-semibold">
              <Lock className="w-3 h-3" />
              <span>Safety Locked</span>
            </span>
          )}
        </div>
      </div>

      {/* Advisory Text */}
      <div className="text-xs text-slate-300 font-sans leading-relaxed space-y-1">
        <p className="flex items-start gap-1.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            This command was generated via AI or heuristic translation and has{' '}
            <strong className="text-white font-semibold">not been manually verified</strong> by maintainers. Thoroughly inspect all flags, targets, and parameters before running.
          </span>
        </p>
      </div>

      {/* Command Display (Blurred or Gated if Locked) */}
      <div className="relative rounded-lg bg-[#0B0F19] border border-slate-800 p-3 font-mono text-xs overflow-hidden">
        <div className={`transition-all duration-300 ${!isUnlocked ? 'filter blur-sm select-none opacity-60' : 'select-all'}`}>
          <div className="flex items-center gap-2 text-lime-300">
            <span className="text-lime-400 font-bold select-none">$</span>
            <code>{command}</code>
          </div>
        </div>

        {!isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <span className="text-xs font-mono text-amber-300 font-bold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Command locked pending review</span>
            </span>
          </div>
        )}
      </div>

      {/* Safety Gate Controls */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        {!isUnlocked ? (
          <button
            onClick={() => setIsUnlocked(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-mono text-xs font-bold transition-all active:scale-95 shadow-sm"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Acknowledge Risk &amp; Unlock Command</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopy}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all shadow-sm ${
                copied
                  ? 'bg-lime-400 text-slate-950 shadow-lime-glow'
                  : 'bg-lime-400 hover:bg-lime-300 text-slate-950'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Copied Syntax!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Unlocked Command</span>
                </>
              )}
            </button>
            <button
              onClick={() => setIsUnlocked(false)}
              className="text-xs font-mono text-slate-400 hover:text-slate-200 px-2 py-1"
            >
              Relock
            </button>
          </div>
        )}

        <span className="text-[11px] font-mono text-slate-400 text-center sm:text-right">
          Zero-execution guarantee • Pls-CLI assistant
        </span>
      </div>
    </div>
  );
}

