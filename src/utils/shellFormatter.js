export const SHELL_LABELS = {
  bash: 'Bash / Zsh',
  zsh: 'macOS (Zsh)',
  powershell: 'PowerShell',
  cmd: 'Windows CMD',
  'git-bash': 'Git Bash'
};

/**
 * Returns the customized command syntax for the target shell if a variant exists,
 * otherwise falls back to the default syntax.
 */
export function getCommandForShell(command, shell) {
  if (!command) return '';
  if (!shell || shell === 'all') return command.syntax;

  if (command.shellVariants && Array.isArray(command.shellVariants)) {
    const variant = command.shellVariants.find(v => v.shell === shell);
    if (variant && variant.syntax) {
      return variant.syntax;
    }
  }

  return command.syntax;
}

