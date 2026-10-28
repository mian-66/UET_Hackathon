import React from 'react';
import { CommandCard } from './CommandCard.jsx';
import { EmptyState } from './EmptyState.jsx';

export function CommandGrid({
  commands = [],
  selectedShell,
  onSelectCommand,
  favorites = [],
  onToggleFavorite,
  onCopySuccess,
  query,
  onResetFilters,
  onTryQuery
}) {
  if (commands.length === 0) {
    return (
      <EmptyState
        query={query}
        onResetFilters={onResetFilters}
        onTryQuery={onTryQuery}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
      {commands.map((cmd) => (
        <CommandCard
          key={cmd.id}
          command={cmd}
          selectedShell={selectedShell}
          onSelectCommand={onSelectCommand}
          isFavorite={favorites.includes(cmd.id)}
          onToggleFavorite={onToggleFavorite}
          onCopySuccess={onCopySuccess}
        />
      ))}
    </div>
  );
}

