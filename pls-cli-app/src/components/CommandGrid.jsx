import React from 'react';
import { CommandCard } from './CommandCard.jsx';
import { EmptyState } from './EmptyState.jsx';

export function CommandGrid({
  commands = [],
  query = '',
  onInspect,
  favorites = [],
  onToggleFavorite,
  onCopySuccess,
  onResetFilters,
  onTryQuery,
  activeView = 'all',
  onExploreAll
}) {
  if (commands.length === 0) {
    if (activeView === 'favorites') {
      return (
        <EmptyState
          type="favorites"
          onExploreAll={onExploreAll}
        />
      );
    }

    if (activeView === 'recent') {
      return (
        <EmptyState
          type="recent"
          onExploreAll={onExploreAll}
        />
      );
    }

    return (
      <EmptyState
        type="search"
        query={query}
        onResetFilters={onResetFilters}
        onTryQuery={onTryQuery}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {commands.map((cmd) => (
          <CommandCard
            key={cmd.id}
            command={cmd}
            onInspect={onInspect}
            isFavorite={favorites.includes(cmd.id)}
            onToggleFavorite={onToggleFavorite}
            onCopySuccess={onCopySuccess}
          />
        ))}
      </div>
    </div>
  );
}
