import { useEffect } from 'react';

export function useKeyboardShortcuts({
  searchRef,
  onClearSearch,
  onCloseModal,
  isModalOpen = false
}) {
  useEffect(() => {
    function handleKeyDown(event) {
      // Don't intercept if user is typing in an input/textarea unless it's Escape or hotkey combo
      const activeElement = document.activeElement;
      const isInputFocused =
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.isContentEditable);

      // Escape key behavior
      if (event.key === 'Escape') {
        if (isModalOpen && onCloseModal) {
          event.preventDefault();
          onCloseModal();
          return;
        }
        if (isInputFocused && onClearSearch) {
          event.preventDefault();
          onClearSearch();
          activeElement.blur();
          return;
        }
      }

      // '/' to focus search (when not in an active input)
      if (event.key === '/' && !isInputFocused && !isModalOpen) {
        event.preventDefault();
        searchRef?.current?.focus();
        searchRef?.current?.select();
        return;
      }

      // 'Cmd+K' or 'Ctrl+K' to focus search
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef?.current?.focus();
        searchRef?.current?.select();
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchRef, onClearSearch, onCloseModal, isModalOpen]);
}

