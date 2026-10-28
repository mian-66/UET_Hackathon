import { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';

export function useClipboard({ timeout = 2000, enableConfetti = false } = {}) {
  const [copiedText, setCopiedText] = useState(null);

  const copy = useCallback(
    async (text, { isHighImpact = false } = {}) => {
      if (!text) return false;

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          // Fallback using temporary textarea
          const textArea = document.createElement('textarea');
          textArea.value = text;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          textArea.style.top = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }

        setCopiedText(text);

        if (enableConfetti || isHighImpact) {
          confetti({
            particleCount: 25,
            spread: 50,
            origin: { y: 0.85 },
            colors: ['#06b6d4', '#10b981', '#38bdf8']
          });
        }

        setTimeout(() => {
          setCopiedText(null);
        }, timeout);

        return true;
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        return false;
      }
    },
    [timeout, enableConfetti]
  );

  return { copy, copiedText, isCopied: Boolean(copiedText) };
}
