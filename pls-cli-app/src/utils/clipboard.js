/**
 * Pls-CLI Clipboard Utility Engine
 * Provides resilient, cross-browser text copying with asynchronous Clipboard API
 * and deterministic synchronous fallback via hidden DOM textarea.
 */

/**
 * Copies the given text string to the system clipboard.
 * 
 * Strategy:
 * 1. Checks if navigator.clipboard.writeText is supported and accessible.
 * 2. If Clipboard API fails (e.g. permission denied, non-secure origin, iframe restrictions),
 *    falls back to creating a hidden, off-screen textarea with document.execCommand('copy').
 * 
 * @param {string} text - The text content to copy to clipboard.
 * @returns {Promise<{ success: boolean, error?: Error }>} Result object indicating status.
 */
export async function copyToClipboard(text) {
  if (typeof text !== 'string') {
    return {
      success: false,
      error: new TypeError('Clipboard utility expects a string argument.')
    };
  }

  // 1. Attempt Modern Asynchronous Clipboard API
  if (
    typeof navigator !== 'undefined' &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === 'function' &&
    (typeof window === 'undefined' || window.isSecureContext !== false)
  ) {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true };
    } catch (apiError) {
      // Permission rejected, user denied prompt, or iframe focus restriction.
      // Fall through directly to legacy DOM fallback.
      console.warn('Navigator clipboard API failed, attempting execCommand fallback:', apiError);
    }
  }

  // 2. Deterministic Fallback via Hidden Textarea & document.execCommand
  if (typeof document !== 'undefined') {
    let textarea = null;
    try {
      textarea = document.createElement('textarea');
      textarea.value = text;

      // Prevent zooming and scrolling shifts on iOS/Android
      textarea.style.position = 'fixed';
      textarea.style.top = '0';
      textarea.style.left = '-9999px';
      textarea.style.width = '2em';
      textarea.style.height = '2em';
      textarea.style.padding = '0';
      textarea.style.border = 'none';
      textarea.style.outline = 'none';
      textarea.style.boxShadow = 'none';
      textarea.style.background = 'transparent';
      textarea.style.opacity = '0';
      textarea.style.pointerEvents = 'none';
      textarea.setAttribute('readonly', '');
      textarea.setAttribute('aria-hidden', 'true');

      document.body.appendChild(textarea);

      // Save previous selection if any
      const selected =
        document.getSelection() && document.getSelection().rangeCount > 0
          ? document.getSelection().getRangeAt(0)
          : false;

      textarea.select();
      textarea.setSelectionRange(0, text.length);

      const successful = document.execCommand('copy');

      if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
      }

      if (successful) {
        return { success: true };
      } else {
        throw new Error('document.execCommand returned false');
      }
    } catch (fallbackError) {
      console.error('All clipboard operations failed:', fallbackError);
      return {
        success: false,
        error: fallbackError instanceof Error ? fallbackError : new Error(String(fallbackError))
      };
    } finally {
      if (textarea && textarea.parentNode) {
        textarea.parentNode.removeChild(textarea);
      }
    }
  }

  return {
    success: false,
    error: new Error('Clipboard operation unavailable: missing document context.')
  };
}

