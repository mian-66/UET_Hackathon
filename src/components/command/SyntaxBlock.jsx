import React from 'react';
import { Copy, Check } from 'lucide-react';
import { useClipboard } from '../../hooks/useClipboard.js';

export function SyntaxBlock({
  syntax,
  onCopySuccess,
  isDestructive = false,
  className = '',
  shellLabel = null
}) {
  const { copy, isCopied } = useClipboard({ timeout: 2000, enableConfetti: isDestructive });

  const handleCopy = async (e) => {
    e.stopPropagation();
    const success = await copy(syntax, { isHighImpact: isDestructive });
    if (success && onCopySuccess) {
      onCopySuccess(syntax);
    }
  };

  return (
    <div
      onClick={handleCopy}
      className={`group relative flex items-center justify-between p-3 rounded-lg bg-term-bg/90 border border-term-border hover:border-cyan-500/40 font-mono text-xs sm:text-sm text-slate-100 cursor-pointer select-all transition-all ${className}`}
      title="Click anywhere to copy"
    >
      <div className="flex items-center gap-2 overflow-x-auto pr-8 scrollbar-none">
        <span className="text-cyan-400 font-bold select-none shrink-0">$</span>
        <code className="text-cyan-200 font-medium whitespace-pre break-all">{syntax}</code>
      </div>

      <div className="absolute right-2 flex items-center gap-1.5 shrink-0">
        {shellLabel && (
          <span className="text-[10px] text-slate-500 uppercase font-mono px-1.5 py-0.5 rounded bg-term-surface border border-term-border hidden group-hover:inline-block">
            {shellLabel}
          </span>
        )}
        <button
          type="button"
          onClick={handleCopy}
          className={`p-1.5 rounded-md transition-all ${
            isCopied
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-term-surface/80 hover:bg-term-border text-slate-400 hover:text-white border border-term-border'
          }`}
          aria-label="Copy command"
        >
          {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

