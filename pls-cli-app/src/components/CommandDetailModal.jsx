import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Star,
  Shield,
  AlertTriangle,
  Flame,
  Terminal,
  Flag,
  Code2,
  Layers,
  ArrowRight
} from 'lucide-react';

export function CommandDetailModal({
  command,
  onClose,
  isFavorite = false,
  onToggleFavorite,
  onSelectRelated,
  allCommands = []
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!command) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(command.syntax);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const riskStyles = {
    safe: {
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      banner: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200',
      icon: Shield,
      label: 'Safe / Read-Only'
    },
    modifying: {
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      banner: 'bg-amber-500/10 border-amber-500/30 text-amber-200',
      icon: AlertTriangle,
      label: 'Modifying Operation'
    },
    destructive: {
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      banner: 'bg-rose-500/10 border-rose-500/30 text-rose-200',
      icon: Flame,
      label: 'Potentially Destructive Operation'
    }
  };

  const risk = riskStyles[command.risk] || riskStyles.safe;
  const RiskIcon = risk.icon;

  // Filter related commands in same category
  const relatedCommands = allCommands
    .filter((c) => c.category === command.category && c.id !== command.id)
    .slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-[#0F172A] border border-[#1E293B] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-start justify-between p-6 border-b border-[#1E293B] bg-[#0B0F19]/60">
          <div className="pr-6">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border ${risk.badge}`}>
                <RiskIcon className="w-3.5 h-3.5" />
                <span>{risk.label}</span>
              </span>
              <span className="text-xs font-mono uppercase text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                {command.category}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-sans leading-snug">
              {command.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleFavorite(command.id)}
              className={`p-2 rounded-xl transition-colors ${
                isFavorite
                  ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label="Toggle favorite"
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
          {/* Safety Notice Callout */}
          <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${risk.banner}`}>
            <RiskIcon className="w-5 h-5 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider font-mono mb-1">
                Safety Guidance &amp; Risk Impact
              </div>
              <p className="text-xs sm:text-sm leading-relaxed">{command.riskReason}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold">
              Functional Purpose
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">{command.description}</p>
          </div>

          {/* Syntax Execution Box */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-lime-400" />
                <span>Command Syntax</span>
              </h4>
              <span className="text-[11px] font-mono text-slate-500">1-click copy enabled</span>
            </div>

            <div
              onClick={handleCopy}
              className="flex items-center justify-between p-4 rounded-xl bg-[#0B0F19] border border-[#1E293B] hover:border-lime-400/50 cursor-pointer font-mono text-sm text-lime-200 transition-all select-all shadow-inner"
              title="Click to copy syntax"
            >
              <div className="flex items-center gap-2 overflow-x-auto pr-4 scrollbar-none">
                <span className="text-lime-400 font-bold select-none">$</span>
                <code>{command.syntax}</code>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className={`p-2 rounded-lg font-mono text-xs flex items-center gap-1.5 transition-all shrink-0 ${
                  copied
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-lime-400 hover:bg-lime-300 text-slate-950 font-bold'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
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
          {command.examples && command.examples.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2 font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-lime-400" />
                <span>Sample Usage &amp; Expected Output</span>
              </h4>
              <div className="space-y-3">
                {command.examples.map((ex, i) => (
                  <div key={i} className="p-4 rounded-xl bg-[#182234]/70 border border-[#1E293B] space-y-2">
                    <div className="text-xs font-medium text-slate-200 font-sans">{ex.scenario}</div>
                    <div className="p-2.5 rounded-lg bg-[#0B0F19] font-mono text-xs text-lime-300 border border-[#1E293B] select-all">
                      $ {ex.command}
                    </div>
                    <div className="text-xs font-mono text-slate-400 flex items-start gap-2 pt-1">
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
                    onClick={() => onSelectRelated(rel)}
                    className="p-3 rounded-xl bg-[#182234] hover:bg-slate-800 border border-[#1E293B] text-left transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-lime-300">
                        {rel.title}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 truncate max-w-xs">
                        $ {rel.syntax}
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-lime-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tag Cloud */}
          <div className="pt-2 border-t border-[#1E293B] flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-mono text-slate-500">Tags:</span>
            {command.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900 border border-slate-800 text-slate-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

