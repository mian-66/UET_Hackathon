import React from 'react';
import { RiskBadge, TagBadge } from '../common/Badge.jsx';
import { SyntaxBlock } from './SyntaxBlock.jsx';
import { getCommandForShell } from '../../utils/shellFormatter.js';
import { Star, ChevronRight, Terminal, Info } from 'lucide-react';

export function CommandCard({
  command,
  selectedShell,
  onSelectCommand,
  isFavorite = false,
  onToggleFavorite,
  onCopySuccess
}) {
  const currentSyntax = getCommandForShell(command, selectedShell);
  const isDestructive = command.risk === 'destructive';

  return (
    <div
      onClick={() => onSelectCommand(command)}
      className="group flex flex-col justify-between p-4 rounded-xl bg-term-card/80 hover:bg-term-card border border-term-border hover:border-cyan-500/30 shadow-lg hover:shadow-card-hover transition-all duration-200 cursor-pointer"
    >
      <div>
        {/* Card Header: Category, Risk Badge, and Bookmark Star */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <RiskBadge risk={command.risk} size="xs" />
            <span className="text-[11px] font-mono uppercase text-slate-400 px-1.5 py-0.5 rounded bg-term-surface border border-term-border">
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
                : 'text-slate-500 hover:text-slate-300 hover:bg-term-surface'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label="Toggle favorite"
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        {/* Title / Intent */}
        <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-cyan-300 transition-colors mb-1.5 leading-snug">
          {command.title}
        </h3>

        {/* Description Excerpt */}
        <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {command.description}
        </p>

        {/* Syntax Code Block */}
        <div className="mb-3">
          <SyntaxBlock
            syntax={currentSyntax}
            isDestructive={isDestructive}
            onCopySuccess={() => onCopySuccess && onCopySuccess(command, currentSyntax)}
            shellLabel={selectedShell !== 'all' ? selectedShell : null}
          />
        </div>
      </div>

      {/* Footer: Tags & Inspect Action */}
      <div className="pt-2 border-t border-term-border/40 flex items-center justify-between text-xs gap-2">
        <div className="flex flex-wrap items-center gap-1.5 overflow-hidden">
          {command.personas.slice(0, 2).map((persona) => (
            <TagBadge key={persona} variant="persona">
              {persona}
            </TagBadge>
          ))}
          {command.tags.slice(0, 2).map((tag) => (
            <TagBadge key={tag} variant="default">
              #{tag}
            </TagBadge>
          ))}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectCommand(command);
          }}
          className="flex items-center gap-1 text-[11px] font-medium text-cyan-400 hover:text-cyan-300 group-hover:translate-x-0.5 transition-all shrink-0"
        >
          <span>Inspect</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
