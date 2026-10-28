import React, { useState, useEffect } from 'react';
import { RiskBadge, TagBadge } from '../common/Badge.jsx';
import { SyntaxBlock } from './SyntaxBlock.jsx';
import { getCommandForShell, SHELL_LABELS } from '../../utils/shellFormatter.js';
import { getRiskMeta } from '../../utils/riskClassification.js';
import {
  X,
  Star,
  ExternalLink,
  AlertTriangle,
  Info,
  Terminal,
  Layers,
  Flag,
  Code2
} from 'lucide-react';

export function CommandModal({
  command,
  onClose,
  isFavorite = false,
  onToggleFavorite,
  onCopySuccess,
  defaultShell = 'bash'
}) {
  if (!command) return null;

  const [activeShell, setActiveShell] = useState(
    defaultShell !== 'all' ? defaultShell : 'bash'
  );

  const activeSyntax = getCommandForShell(command, activeShell);
  const isDestructive = command.risk === 'destructive';
  const riskMeta = getRiskMeta(command.risk);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-term-card border border-term-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 border-b border-term-border bg-term-surface/50">
          <div className="pr-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <RiskBadge risk={command.risk} size="sm" />
              <span className="text-xs font-mono uppercase text-slate-400 px-2 py-0.5 rounded bg-term-surface border border-term-border">
                {command.category}
              </span>
              <span className="text-xs font-mono text-cyan-400">#{command.id}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {command.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleFavorite(command.id)}
              className={`p-2 rounded-lg transition-colors ${
                isFavorite
                  ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-term-surface'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label="Toggle favorite"
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-term-surface transition-colors"
              aria-label="Close dialog (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 space-y-6">
          {/* Safety & Risk Explanation Callout */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              isDestructive
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-200'
                : command.risk === 'modifying'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                : 'bg-term-surface border-term-border text-slate-300'
            }`}
          >
            {isDestructive ? (
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider mb-1 font-mono">
                {riskMeta.label} Operation Guidance
              </div>
              <p className="text-xs sm:text-sm leading-relaxed">{command.riskReason}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-mono uppercase text-slate-400 mb-1.5 flex items-center gap-1.5 font-semibold">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>Description & Intent</span>
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">{command.description}</p>
          </div>

          {/* Shell-Specific Syntax Switcher & Viewer */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-mono uppercase text-slate-400 flex items-center gap-1.5 font-semibold">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>Command Syntax</span>
              </h4>

              {/* Shell Tabs */}
              <div className="flex items-center gap-1 bg-term-surface p-0.5 rounded-lg border border-term-border text-xs">
                {['bash', 'powershell', 'cmd'].map((shell) => {
                  const isSupported = command.shells.includes(shell);
                  return (
                    <button
                      key={shell}
                      onClick={() => setActiveShell(shell)}
                      disabled={!isSupported}
                      className={`px-2 py-0.5 rounded font-mono text-[11px] transition-all ${
                        activeShell === shell
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                          : isSupported
                          ? 'text-slate-400 hover:text-white'
                          : 'text-slate-600 cursor-not-allowed line-through'
                      }`}
                    >
                      {shell === 'bash' ? 'Bash/Zsh' : shell === 'powershell' ? 'PowerShell' : 'CMD'}
                    </button>
                  );
                })}
              </div>
            </div>

            <SyntaxBlock
              syntax={activeSyntax}
              isDestructive={isDestructive}
              onCopySuccess={() => onCopySuccess && onCopySuccess(command, activeSyntax)}
              shellLabel={SHELL_LABELS[activeShell]}
            />
          </div>

          {/* Parameters Table */}
          {command.parameters && command.parameters.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase text-slate-400 mb-2 flex items-center gap-1.5 font-semibold">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Parameters & Tokens</span>
              </h4>
              <div className="border border-term-border rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-term-surface border-b border-term-border text-slate-400 font-mono">
                    <tr>
                      <th className="py-2 px-3">Token</th>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">Default</th>
                      <th className="py-2 px-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-term-border/40 font-mono text-slate-300">
                    {command.parameters.map((param) => (
                      <tr key={param.name} className="hover:bg-term-surface/40">
                        <td className="py-2.5 px-3 font-semibold text-cyan-400">
                          &lt;{param.placeholder || param.name}&gt;
                        </td>
                        <td className="py-2.5 px-3 text-slate-400">{param.type}</td>
                        <td className="py-2.5 px-3 text-amber-300">
                          {param.defaultValue || 'None'}
                        </td>
                        <td className="py-2.5 px-3 font-sans text-slate-300">
                          {param.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Flags Table */}
          {command.flags && command.flags.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase text-slate-400 mb-2 flex items-center gap-1.5 font-semibold">
                <Flag className="w-3.5 h-3.5 text-cyan-400" />
                <span>Flags & Modifiers</span>
              </h4>
              <div className="border border-term-border rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-term-surface border-b border-term-border text-slate-400 font-mono">
                    <tr>
                      <th className="py-2 px-3">Flag</th>
                      <th className="py-2 px-3">Alias</th>
                      <th className="py-2 px-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-term-border/40 font-mono text-slate-300">
                    {command.flags.map((flag) => (
                      <tr key={flag.flag} className="hover:bg-term-surface/40">
                        <td className="py-2.5 px-3 font-semibold text-emerald-400">
                          {flag.flag}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400">{flag.alias || '-'}</td>
                        <td className="py-2.5 px-3 font-sans text-slate-300">
                          {flag.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Realistic Usage Examples */}
          {command.examples && command.examples.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase text-slate-400 mb-2 flex items-center gap-1.5 font-semibold">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Real-World Scenarios</span>
              </h4>
              <div className="space-y-3">
                {command.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-term-surface/70 border border-term-border"
                  >
                    <div className="text-xs font-medium text-slate-200 mb-1.5">
                      {ex.scenario}
                    </div>
                    <div className="p-2 rounded bg-term-bg border border-term-border/80 font-mono text-xs text-cyan-300 mb-2 select-all">
                      $ {ex.command}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono flex items-start gap-1.5">
                      <span className="text-emerald-400">➜</span>
                      <span>{ex.expectedOutcome}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata / Tags */}
          <div className="pt-2 border-t border-term-border/40 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-500 font-mono">Tags:</span>
              {command.tags.map((t) => (
                <TagBadge key={t} variant="default">
                  #{t}
                </TagBadge>
              ))}
            </div>

            {command.docsUrl && (
              <a
                href={command.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
              >
                <span>Official Documentation</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
