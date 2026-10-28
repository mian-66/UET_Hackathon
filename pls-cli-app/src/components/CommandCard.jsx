import React, { useState } from 'react';
import {
  Copy,
  Check,
  Star,
  ExternalLink,
  Shield,
  AlertTriangle,
  Flame,
  Terminal,
  ChevronRight
} from 'lucide-react';

export function CommandCard({
  command,
  onInspect,
  isFavorite = false,
  onToggleFavorite,
  onCopySuccess
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(command.syntax);
    setCopied(true);
    if (onCopySuccess) {
      onCopySuccess(command);
    }
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  // Color mappings for Risk Badges
  const riskStyles = {
    safe: {
      badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      icon: Shield,
      label: 'Safe / Read-Only'
    },
    modifying: {
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: AlertTriangle,
      label: 'Modifying'
    },
    destructive: {
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      icon: Flame,
      label: 'Destructive'
    }
  };

  const risk = riskStyles[command.risk] || riskStyles.safe;
  const RiskIcon = risk.icon;

  return (
    <div
      onClick={() => onInspect(command)}
      className="group flex flex-col justify-between p-5 rounded-2xl bg-[#0F172A] border border-[#1E293B] hover:border-lime-400/40 shadow-lg hover:shadow-card-elevated transition-all duration-200 cursor-pointer"
    >
      <div>
        {/* Card Header: Category, Risk Badge, and Favorite Star */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium border ${risk.badge}`}
              title={command.riskReason}
            >
              <RiskIcon className="w-3 h-3" />
              <span>{risk.label}</span>
            </span>

            <span className="text-[10px] font-mono uppercase text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
              {command.category}
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(command.id);
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              isFavorite
                ? 'text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            aria-label="Bookmark command"
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Task Title in Plain English */}
        <h3 className="text-base font-bold text-white group-hover:text-lime-300 transition-colors mb-2 leading-snug font-sans">
          {command.title}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed font-sans">
          {command.description}
        </p>

        {/* Formatted Monospace Snippet Container */}
        <div
          onClick={handleCopy}
          className="relative flex items-center justify-between p-3 rounded-xl bg-[#0B0F19] border border-[#1E293B] group-hover:border-slate-700 font-mono text-xs text-slate-100 hover:bg-slate-950 transition-all select-all mb-4"
          title="Click to copy syntax"
        >
          <div className="flex items-center gap-2 overflow-x-auto pr-8 scrollbar-none">
            <span className="text-lime-400 font-bold select-none shrink-0">$</span>
            <code className="text-lime-200 font-medium whitespace-pre break-all">
              {command.syntax}
            </code>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className={`p-1.5 rounded-lg shrink-0 transition-all ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700'
            }`}
            aria-label="Copy syntax"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Card Footer: Platforms & Inspect Trigger */}
      <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between text-xs gap-2">
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
          <span>Shells:</span>
          {command.shells.map((sh) => (
            <span key={sh} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 uppercase">
              {sh}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onInspect(command);
          }}
          className="inline-flex items-center gap-1 text-xs font-mono font-medium text-lime-400 hover:text-lime-300 group-hover:translate-x-0.5 transition-all"
        >
          <span>Inspect</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

