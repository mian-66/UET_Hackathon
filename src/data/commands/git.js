export const gitCommands = [
  {
    id: "git-undo-last-commit-soft",
    title: "Undo last Git commit while keeping changes staged",
    description: "Moves HEAD back by one commit without discarding your modified files or unstaging changes in the index.",
    syntax: "git reset --soft HEAD~1",
    category: "git",
    personas: ["beginner", "frontend", "backend"],
    shells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    risk: "modifying",
    riskReason: "Rewinds local commit history. Completely safe for unpushed commits; requires force-push if already pushed to a remote.",
    parameters: [
      {
        name: "count",
        placeholder: "1",
        type: "number",
        required: false,
        defaultValue: "1",
        description: "Number of commits back from HEAD to rewind."
      }
    ],
    flags: [
      {
        flag: "--soft",
        description: "Leaves all modified files staged in the index ready for re-committing.",
        isDefault: true
      }
    ],
    examples: [
      {
        scenario: "Committed too early with a typo in the commit message",
        command: "git reset --soft HEAD~1",
        expectedOutcome: "Last commit is undone; modified files remain staged in git status."
      }
    ],
    tags: ["git", "undo", "uncommit", "soft reset", "revert", "commit history", "amend"],
    aliases: [
      "uncommit last commit",
      "cancel commit keep files",
      "undo git commit keep staged",
      "rewind commit without losing code"
    ],
    docsUrl: "https://git-scm.com/docs/git-reset"
  },
  {
    id: "git-undo-last-commit-hard",
    title: "Completely discard last commit and wipe all changes",
    description: "Resets the current branch tip to the previous commit, permanently deleting all uncommitted and committed modifications.",
    syntax: "git reset --hard HEAD~1",
    category: "git",
    personas: ["frontend", "backend", "devops"],
    shells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    risk: "destructive",
    riskReason: "PERMANENT DELETION: Uncommitted working tree changes and the target commit's file changes are erased from disk.",
    parameters: [
      {
        name: "count",
        placeholder: "1",
        type: "number",
        required: false,
        defaultValue: "1",
        description: "Number of commits to erase."
      }
    ],
    flags: [
      {
        flag: "--hard",
        description: "Resets the index and working tree. Any changes to tracked files since <commit> are discarded."
      }
    ],
    examples: [
      {
        scenario: "Experimental commit caused breaking bugs and should be eradicated",
        command: "git reset --hard HEAD~1",
        expectedOutcome: "HEAD moves to previous commit; working tree is wiped clean."
      }
    ],
    tags: ["git", "reset", "hard reset", "delete commit", "wipe changes", "discard"],
    aliases: [
      "delete last commit permanently",
      "erase commit and changes",
      "hard reset git HEAD"
    ],
    docsUrl: "https://git-scm.com/docs/git-reset"
  },
  {
    id: "git-amend-commit-message",
    title: "Change the message of the most recent commit",
    description: "Updates the text of your last commit without creating a duplicate commit node in history.",
    syntax: 'git commit --amend -m "new message"',
    category: "git",
    personas: ["beginner", "frontend", "backend"],
    shells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    risk: "modifying",
    riskReason: "Rewrites the SHA-1 hash of the last commit. Safe for local unpushed commits.",
    parameters: [
      {
        name: "message",
        placeholder: "new message",
        type: "string",
        required: true,
        description: "The replacement commit message."
      }
    ],
    flags: [
      {
        flag: "--amend",
        description: "Replace the tip of the current branch by creating a new commit."
      },
      {
        flag: "-m",
        description: "Specifies the commit message inline."
      }
    ],
    examples: [
      {
        scenario: "Fix typo in previous commit message",
        command: 'git commit --amend -m "fix(auth): correct token validation check"',
        expectedOutcome: "Last commit has updated message with current staged changes incorporated."
      }
    ],
    tags: ["git", "amend", "rename commit", "fix message", "typo", "edit commit"],
    aliases: [
      "edit last commit message",
      "rename commit message",
      "fix typo in git commit",
      "change commit title"
    ],
    docsUrl: "https://git-scm.com/docs/git-commit"
  },
  {
    id: "git-unstage-all-files",
    title: "Unstage all files while preserving local modifications",
    description: "Removes all modified files from the Git staging area (index) without touching the code in your working tree.",
    syntax: "git restore --staged .",
    category: "git",
    personas: ["beginner", "frontend", "backend"],
    shells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    shellVariants: [
      {
        shell: "powershell",
        syntax: "git restore --staged ."
      },
      {
        shell: "cmd",
        syntax: "git reset HEAD"
      }
    ],
    risk: "modifying",
    riskReason: "Changes staging status. Does not discard or lose any file edits.",
    parameters: [],
    flags: [
      {
        flag: "--staged",
        description: "Restores the staging area (index) to match HEAD."
      }
    ],
    examples: [
      {
        scenario: "Accidentally ran `git add .` on secrets or unnecessary files",
        command: "git restore --staged .",
        expectedOutcome: "All files revert from staged (green) to unstaged (red)."
      }
    ],
    tags: ["git", "unstage", "restore", "reset index", "git add undo"],
    aliases: [
      "undo git add",
      "unstage everything",
      "remove all files from staging area",
      "cancel git add ."
    ],
    docsUrl: "https://git-scm.com/docs/git-restore"
  },
  {
    id: "git-clean-untracked-files",
    title: "Remove all untracked files and directories",
    description: "Recursively deletes untracked files and directories from the repository working tree.",
    syntax: "git clean -fd",
    category: "git",
    personas: ["frontend", "backend", "devops"],
    shells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    risk: "destructive",
    riskReason: "PERMANENT: Untracked files that were never committed are deleted forever. Run with -n (dry run) first to verify.",
    parameters: [],
    flags: [
      {
        flag: "-f",
        description: "Force deletion of untracked files."
      },
      {
        flag: "-d",
        description: "Remove untracked directories in addition to untracked files."
      },
      {
        flag: "-n",
        description: "Dry run: preview which files will be deleted without actually deleting them."
      }
    ],
    examples: [
      {
        scenario: "Preview files before deletion (safe dry run)",
        command: "git clean -nd",
        expectedOutcome: "Lists untracked files that would be removed."
      },
      {
        scenario: "Purge untracked build artifacts and scratch files",
        command: "git clean -fd",
        expectedOutcome: "Untracked files and directories are removed."
      }
    ],
    tags: ["git", "clean", "purge untracked", "delete untracked", "cleanup"],
    aliases: [
      "delete untracked files in git",
      "wipe new untracked files",
      "clean working directory"
    ],
    docsUrl: "https://git-scm.com/docs/git-clean"
  },
  {
    id: "git-stash-include-untracked",
    title: "Stash current changes including new untracked files",
    description: "Saves both modified tracked files and newly created untracked files into the stash stack to restore a clean workspace.",
    syntax: 'git stash push -u -m "wip: feature progress"',
    category: "git",
    personas: ["beginner", "frontend", "backend"],
    shells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    risk: "safe",
    riskReason: "Non-destructive. Changes are safely preserved in the Git stash storage and can be popped at any time.",
    parameters: [
      {
        name: "message",
        placeholder: "wip: feature progress",
        type: "string",
        required: false,
        defaultValue: "wip",
        description: "Descriptive label for the stash entry."
      }
    ],
    flags: [
      {
        flag: "-u",
        alias: "--include-untracked",
        description: "Also stash untracked files so the working directory becomes 100% clean."
      },
      {
        flag: "-m",
        description: "Attach an informative message to the stash."
      }
    ],
    examples: [
      {
        scenario: "Need to switch branches immediately without committing half-finished work",
        command: 'git stash push -u -m "temp save before hotfix"',
        expectedOutcome: "Workspace becomes clean; changes stored in stash list."
      }
    ],
    tags: ["git", "stash", "save changes", "stash untracked", "switch branch"],
    aliases: [
      "save work in stash",
      "git stash with new files",
      "temporarily hide changes"
    ],
    docsUrl: "https://git-scm.com/docs/git-stash"
  },
  {
    id: "git-prune-deleted-remote-branches",
    title: "Prune stale remote-tracking branch references",
    description: "Updates local references and deletes tracking branches that have already been merged and deleted on the remote repository.",
    syntax: "git fetch --prune",
    category: "git",
    personas: ["frontend", "backend", "devops"],
    shells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    risk: "read-only",
    riskReason: "Synchronizes branch metadata. Does not delete any local branches or unpushed work.",
    parameters: [],
    flags: [
      {
        flag: "--prune",
        alias: "-p",
        description: "Before fetching, remove any remote-tracking references that no longer exist on the remote."
      }
    ],
    examples: [
      {
        scenario: "Clean up local list of origin branches deleted via merged pull requests",
        command: "git fetch --prune origin",
        expectedOutcome: "Stale remote branch pointers (e.g. origin/feature-1) are cleanly removed."
      }
    ],
    tags: ["git", "prune", "remote", "branches", "fetch", "cleanup stale"],
    aliases: [
      "clean up deleted remote branches",
      "sync deleted github branches",
      "remove stale origin branches"
    ],
    docsUrl: "https://git-scm.com/docs/git-fetch"
  },
  {
    id: "git-rename-branch-local-and-remote",
    title: "Rename a Git branch both locally and on the remote",
    description: "Renames the current local branch, pushes the new name to origin, and cleans up the old remote tracking branch.",
    syntax: "git branch -m new-name && git push origin -u new-name && git push origin --delete old-name",
    category: "git",
    personas: ["frontend", "backend", "devops"],
    shells: ["bash", "zsh", "git-bash", "powershell"],
    shellVariants: [
      {
        shell: "powershell",
        syntax: "git branch -m new-name; git push origin -u new-name; git push origin --delete old-name"
      },
      {
        shell: "cmd",
        syntax: "git branch -m new-name && git push origin -u new-name && git push origin --delete old-name"
      }
    ],
    risk: "modifying",
    riskReason: "Renames remote branch. Ensure teammates are aware if they have checked out the old branch.",
    parameters: [
      {
        name: "newName",
        placeholder: "new-name",
        type: "branch",
        required: true,
        description: "The new branch name."
      },
      {
        name: "oldName",
        placeholder: "old-name",
        type: "branch",
        required: true,
        description: "The previous branch name to delete from remote."
      }
    ],
    flags: [
      {
        flag: "-m",
        description: "Move/rename a branch and its reflog."
      },
      {
        flag: "-u",
        description: "Set upstream tracking to the newly named remote branch."
      }
    ],
    examples: [
      {
        scenario: "Rename 'master' to 'main' on GitHub",
        command: "git branch -m main && git push origin -u main && git push origin --delete master",
        expectedOutcome: "Local branch becomes main, pushed to origin, old branch removed."
      }
    ],
    tags: ["git", "rename branch", "branch", "remote branch", "origin"],
    aliases: [
      "rename current branch",
      "change branch name locally and remote",
      "rename git branch"
    ],
    docsUrl: "https://git-scm.com/docs/git-branch"
  },
  {
    id: "git-cherry-pick-commit",
    title: "Apply a specific commit from another branch",
    description: "Copies a specific commit from another branch and replays its diff onto your current active branch.",
    syntax: "git cherry-pick <commit-hash>",
    category: "git",
    personas: ["frontend", "backend", "devops"],
    shells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    risk: "modifying",
    riskReason: "Creates a new commit on the current branch. May encounter merge conflicts if context differs.",
    parameters: [
      {
        name: "commitHash",
        placeholder: "a1b2c3d",
        type: "commit-hash",
        required: true,
        description: "The SHA-1 hash of the commit you wish to copy."
      }
    ],
    flags: [
      {
        flag: "-x",
        description: "Appends a line saying '(cherry picked from commit ...)' to the original commit message."
      },
      {
        flag: "-n",
        alias: "--no-commit",
        description: "Applies changes to working tree without auto-creating a commit."
      }
    ],
    examples: [
      {
        scenario: "Backport a hotfix commit from main to a v1.0 release branch",
        command: "git cherry-pick 7f83a9e",
        expectedOutcome: "Hotfix diff is committed to the current branch."
      }
    ],
    tags: ["git", "cherry-pick", "copy commit", "port commit", "backport"],
    aliases: [
      "copy commit from another branch",
      "apply single commit",
      "cherry pick git"
    ],
    docsUrl: "https://git-scm.com/docs/git-cherry-pick"
  },
  {
    id: "git-find-deleted-file-history",
    title: "Find the commit that deleted a specific file",
    description: "Searches Git log history across all commits to identify when and who deleted a given file.",
    syntax: "git log -1 --full-history -- <file-path>",
    category: "git",
    personas: ["backend", "devops", "beginner"],
    shells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    risk: "read-only",
    riskReason: "Read-only inspection of git log history.",
    parameters: [
      {
        name: "filePath",
        placeholder: "src/utils/legacyAuth.js",
        type: "path",
        required: true,
        description: "Relative path to the deleted file."
      }
    ],
    flags: [
      {
        flag: "--full-history",
        description: "Does not simplify history, ensuring deleted files are matched."
      },
      {
        flag: "-1",
        description: "Limits output to the most recent commit touching this path."
      }
    ],
    examples: [
      {
        scenario: "Investigate when config/db.json was removed",
        command: "git log -1 --full-history -- config/db.json",
        expectedOutcome: "Outputs author, date, and commit message that removed the file."
      }
    ],
    tags: ["git", "log", "deleted file", "find deleted", "history", "who deleted"],
    aliases: [
      "who deleted file in git",
      "find commit that deleted file",
      "recover deleted file commit"
    ],
    docsUrl: "https://git-scm.com/docs/git-log"
  },
  {
    id: "git-view-compact-graph-log",
    title: "View compact terminal Git history graph",
    description: "Displays a clean, colorized, one-line-per-commit ASCII graph of branches and merges.",
    syntax: "git log --graph --oneline --decorate --all",
    category: "git",
    personas: ["beginner", "frontend", "backend", "devops"],
    shells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    risk: "safe",
    riskReason: "Read-only visual command.",
    parameters: [],
    flags: [
      { flag: "--graph", description: "Draws an ASCII graph of commit history branches." },
      { flag: "--oneline", description: "Condenses commit hash and title to single lines." },
      { flag: "--decorate", description: "Prints branch names and tags alongside commits." },
      { flag: "--all", description: "Shows history across all local and remote branches." }
    ],
    examples: [
      {
        scenario: "Quickly visualize branching and merge commits",
        command: "git log --graph --oneline --decorate -15",
        expectedOutcome: "Displays visual tree of last 15 commits."
      }
    ],
    tags: ["git", "log", "graph", "tree", "history", "visualize"],
    aliases: [
      "git tree visual log",
      "view branch graph",
      "pretty git log"
    ],
    docsUrl: "https://git-scm.com/docs/git-log"
  },
  {
    id: "git-revert-published-commit",
    title: "Safely revert a commit that has already been pushed",
    description: "Creates a new inverse commit that undoes the changes of a specified commit, safe for shared branches.",
    syntax: "git revert <commit-hash>",
    category: "git",
    personas: ["frontend", "backend", "devops"],
    shells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    risk: "modifying",
    riskReason: "Creates a new forward commit on the branch. Does not rewrite past history.",
    parameters: [
      {
        name: "commitHash",
        placeholder: "abc1234",
        type: "commit-hash",
        required: true,
        description: "The hash of the bad commit you want to invert."
      }
    ],
    flags: [
      { flag: "--no-edit", description: "Reuses default revert message without opening editor." }
    ],
    examples: [
      {
        scenario: "Bug pushed to production main branch needs immediate safe rollback",
        command: "git revert --no-edit abc1234",
        expectedOutcome: "A new commit 'Revert ...' is created that inverts the bad code."
      }
    ],
    tags: ["git", "revert", "rollback", "safe undo", "undo push"],
    aliases: [
      "undo pushed commit safely",
      "revert commit on main",
      "rollback published git change"
    ],
    docsUrl: "https://git-scm.com/docs/git-revert"
  }
];

