/**
 * Pls-CLI: Core Production Command Dataset
 * Handcrafted, validated command specifications across Git, Filesystem,
 * Node/npm, Frontend Tooling, Backend/Docker, and System Diagnostics.
 */

export const commands = [
  // ==========================================
  // 1. GIT & VERSION CONTROL (12 Commands)
  // ==========================================
  {
    id: "git-status-short",
    title: "View Concise Git Working Tree Status",
    taskDescription: "Inspect modified, staged, and untracked files in a high-density two-column status format.",
    command: "git status -s",
    explanation: "Prints status output in short format with two-letter status indicators (M for modified, A for added, ?? for untracked).",
    category: "git",
    roles: ["beginner", "frontend", "backend", "devops"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["git", "status", "clean", "working tree", "short", "inspect"],
    riskLevel: "low",
    safetyNotes: "Completely safe read-only operation. Does not modify working directory or commit history.",
    example: {
      scenario: "Quickly verify what has changed before staging commits without verbose helper text.",
      commandWithArgs: "git status -s",
      expectedOutput: " M src/App.jsx\n?? src/data/newFile.js"
    },
    relatedCommandIds: ["git-undo-last-commit-soft", "git-unstage-all-files"]
  },
  {
    id: "git-undo-last-commit-soft",
    title: "Undo Last Commit (Keep Changes Staged)",
    taskDescription: "Undo the most recent Git commit while keeping all your modified files staged in the index ready for revision.",
    command: "git reset --soft HEAD~1",
    explanation: "Rewinds the HEAD pointer back by one commit node without touching the index (staging area) or working tree files.",
    category: "git",
    roles: ["beginner", "frontend", "backend"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["git", "undo", "commit", "soft reset", "amend", "rewind"],
    riskLevel: "medium",
    safetyNotes: "Safe for local unpushed commits. If the commit was already pushed to origin, rewriting history will require force-pushing and coordination.",
    example: {
      scenario: "You committed prematurely before adding a missing test file or want to modify staged contents.",
      commandWithArgs: "git reset --soft HEAD~1",
      expectedOutput: "[No terminal output on success; files remain staged in git status]"
    },
    relatedCommandIds: ["git-amend-commit-message", "git-undo-last-commit-hard", "git-status-short"]
  },
  {
    id: "git-undo-last-commit-hard",
    title: "Permanently Erase Last Commit & Changes",
    taskDescription: "Completely discard the last commit, all staged files, and all uncommitted working tree modifications.",
    command: "git reset --hard HEAD~1",
    explanation: "Moves HEAD back by one commit and forcefully overwrites both index and working tree to match that earlier commit.",
    category: "git",
    roles: ["frontend", "backend", "devops"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["git", "hard reset", "delete commit", "wipe changes", "discard", "destructive"],
    riskLevel: "critical",
    safetyNotes: "CRITICAL: Permanent data destruction. Any uncommitted code changes in working directory will be permanently erased and cannot be recovered.",
    example: {
      scenario: "An experimental commit introduced breaking changes and you want to completely erase it back to prior state.",
      commandWithArgs: "git reset --hard HEAD~1",
      expectedOutput: "HEAD is now at a3f1b0c chore: previous commit message"
    },
    relatedCommandIds: ["git-undo-last-commit-soft", "git-discard-all-unstaged"]
  },
  {
    id: "git-amend-commit-message",
    title: "Change Last Commit Message In-Place",
    taskDescription: "Rewrite the message of your most recent commit without creating an extra commit node.",
    command: 'git commit --amend -m "new commit message"',
    explanation: "Replaces the tip of the current branch by creating a replacement commit with the updated text and any currently staged files.",
    category: "git",
    roles: ["beginner", "frontend", "backend"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["git", "amend", "message", "typo", "edit commit", "rename"],
    riskLevel: "medium",
    safetyNotes: "Generates a new commit SHA hash. Only use on local commits that have not been pushed to shared remote branches.",
    example: {
      scenario: "Fix a typo or append ticket reference ID to the previous commit message.",
      commandWithArgs: 'git commit --amend -m "fix(auth): correct token validation check (#104)"',
      expectedOutput: "[main 84df21a] fix(auth): correct token validation check (#104)\n Date: ...\n 1 file changed, 2 insertions(+)"
    },
    relatedCommandIds: ["git-undo-last-commit-soft", "git-status-short"]
  },
  {
    id: "git-unstage-all-files",
    title: "Unstage All Staged Files",
    taskDescription: "Remove all files from the Git staging area while preserving all your local code edits in the working tree.",
    command: "git restore --staged .",
    explanation: "Restores index entries from HEAD so files revert from staged green status to unstaged red status without losing code.",
    category: "git",
    roles: ["beginner", "frontend", "backend"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["git", "unstage", "restore", "reset index", "undo add"],
    riskLevel: "low",
    safetyNotes: "Non-destructive. Modifies index status only; working file modifications remain completely untouched.",
    example: {
      scenario: "You ran `git add .` accidentally including secret credentials or large temporary data files.",
      commandWithArgs: "git restore --staged .",
      expectedOutput: "[Files unstage; git status shows files in red under 'Changes not staged for commit']"
    },
    relatedCommandIds: ["git-status-short", "git-discard-all-unstaged"]
  },
  {
    id: "git-discard-all-unstaged",
    title: "Discard All Unstaged Working Tree Changes",
    taskDescription: "Revert all modified tracked files in the current directory back to their last committed state.",
    command: "git restore .",
    explanation: "Discards local working tree edits for tracked files by restoring their contents directly from the index/HEAD.",
    category: "git",
    roles: ["frontend", "backend", "devops"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["git", "restore", "discard", "revert changes", "clean working tree"],
    riskLevel: "high",
    safetyNotes: "HIGH RISK: All unstaged modifications made since the last commit are permanently deleted from your files.",
    example: {
      scenario: "Local debugging edits produced syntax errors and you wish to revert tracked files to clean branch state.",
      commandWithArgs: "git restore .",
      expectedOutput: "[No terminal output; files revert cleanly to match last committed state]"
    },
    relatedCommandIds: ["git-unstage-all-files", "git-clean-untracked-force"]
  },
  {
    id: "git-clean-untracked-force",
    title: "Delete All Untracked Files and Folders",
    taskDescription: "Recursively eradicate newly created files and directories not tracked by Git version control.",
    command: "git clean -fd",
    explanation: "Forcibly cleans the working tree by recursively removing untracked files (-f) and untracked directories (-d).",
    category: "git",
    roles: ["frontend", "backend", "devops"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["git", "clean", "untracked", "purge", "delete files", "workspace"],
    riskLevel: "critical",
    safetyNotes: "CRITICAL: Untracked files that were never committed are permanently erased from disk. Test with `git clean -nd` first.",
    example: {
      scenario: "Wipe out accidental scratch files, local bundle outputs, and untracked artifacts.",
      commandWithArgs: "git clean -fd",
      expectedOutput: "Removing scratch.txt\nRemoving build_temp/"
    },
    relatedCommandIds: ["git-discard-all-unstaged", "git-status-short"]
  },
  {
    id: "git-stash-with-untracked",
    title: "Stash All Modifications Including Untracked Files",
    taskDescription: "Save modified tracked files and newly created untracked files into the stash stack to restore a clean workspace.",
    command: 'git stash push -u -m "wip: feature progress"',
    explanation: "Pushes working directory edits and untracked files (-u) onto the stash list tagged with a custom descriptive message.",
    category: "git",
    roles: ["beginner", "frontend", "backend"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["git", "stash", "save work", "untracked", "clean repo", "switch branch"],
    riskLevel: "low",
    safetyNotes: "Completely safe. Code is archived in Git's internal stash storage ref and can be restored anytime with `git stash pop`.",
    example: {
      scenario: "Need to switch branches immediately for a critical production bug without committing half-finished work.",
      commandWithArgs: 'git stash push -u -m "wip before hotfix"',
      expectedOutput: "Saved working directory and index state WIP on main: wip before hotfix"
    },
    relatedCommandIds: ["git-stash-pop-latest", "git-status-short"]
  },
  {
    id: "git-stash-pop-latest",
    title: "Restore and Remove Latest Stash Entry",
    taskDescription: "Reapply the changes from the most recent stash entry and remove it from your stash stack.",
    command: "git stash pop",
    explanation: "Applies the changes recorded in stash@{0} to the working tree and drops that stash entry if application succeeds without conflict.",
    category: "git",
    roles: ["beginner", "frontend", "backend"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["git", "stash", "pop", "restore", "apply stash"],
    riskLevel: "medium",
    safetyNotes: "May trigger merge conflicts if active branch files have changed since stashing. If conflicts occur, the stash is retained.",
    example: {
      scenario: "Returned to feature branch and ready to resume working on stashed code.",
      commandWithArgs: "git stash pop",
      expectedOutput: "On branch feature/auth\nChanges to be committed:\n  modified: src/auth.js\nDropped refs/stash@{0}"
    },
    relatedCommandIds: ["git-stash-with-untracked", "git-status-short"]
  },
  {
    id: "git-log-compact-graph",
    title: "Display Compact Terminal Git Branch Graph",
    taskDescription: "Print a colorized ASCII tree diagram of branch commits, merges, and tags across all branches.",
    command: "git log --graph --oneline --decorate --all -15",
    explanation: "Draws text-based commit topology showing branch bifurcations and merge commits condensed to single lines.",
    category: "git",
    roles: ["beginner", "frontend", "backend", "devops"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["git", "log", "graph", "tree", "history", "branches", "visualize"],
    riskLevel: "low",
    safetyNotes: "Read-only inspection command.",
    example: {
      scenario: "Visualize how feature branches diverge from main and inspect recent merge histories.",
      commandWithArgs: "git log --graph --oneline --decorate --all -15",
      expectedOutput: "* 49f12ab (HEAD -> main, origin/main) feat: add auth\n| * 812cde4 (feature/ui) chore: update icons\n|/  \n* 33ab990 initial commit"
    },
    relatedCommandIds: ["git-status-short", "git-revert-published-commit"]
  },
  {
    id: "git-revert-published-commit",
    title: "Safely Revert a Pushed Public Commit",
    taskDescription: "Create a new inverse commit that rolls back changes introduced by a bad commit on a shared remote branch.",
    command: "git revert --no-edit <commit-hash>",
    explanation: "Calculates the exact inverse diff of the target commit and records a new commit without opening an interactive editor.",
    category: "git",
    roles: ["frontend", "backend", "devops"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["git", "revert", "rollback", "undo pushed", "public commit", "safe"],
    riskLevel: "medium",
    safetyNotes: "Preserves git history by moving forward. Safe for shared branches where rewriting commit hashes is forbidden.",
    example: {
      scenario: "A breaking bug was merged and pushed to staging/main and must be reversed cleanly.",
      commandWithArgs: "git revert --no-edit a1b2c3d",
      expectedOutput: "[main f4e3d2c] Revert \"feat: experimental payment flow\"\n 2 files changed, 10 deletions(-)"
    },
    relatedCommandIds: ["git-undo-last-commit-soft", "git-status-short"]
  },
  {
    id: "git-fetch-prune-remotes",
    title: "Prune Stale Remote Tracking Branches",
    taskDescription: "Synchronize local Git metadata and remove local references to branches deleted on origin.",
    command: "git fetch --prune origin",
    explanation: "Retrieves latest remote refs and automatically removes local remote-tracking branches that no longer exist on the remote host.",
    category: "git",
    roles: ["frontend", "backend", "devops"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["git", "fetch", "prune", "remote", "cleanup", "branches", "origin"],
    riskLevel: "low",
    safetyNotes: "Safe metadata synchronization. Does not delete any of your local working branches.",
    example: {
      scenario: "Clean up hundreds of stale origin/feature-xyz branches merged and deleted via GitHub Pull Requests.",
      commandWithArgs: "git fetch --prune origin",
      expectedOutput: "From github.com:org/repo\n - [deleted]         (none)     -> origin/feat/user-login"
    },
    relatedCommandIds: ["git-status-short", "git-log-compact-graph"]
  },

  // ==========================================
  // 2. FILESYSTEM & STORAGE (8 Commands)
  // ==========================================
  {
    id: "fs-list-detailed-human",
    title: "List Directory Contents with Human-Readable Sizes",
    taskDescription: "View all directory files including hidden items with permissions, owners, and file sizes formatted in KB/MB.",
    command: "ls -la --color=auto",
    explanation: "Lists directory contents in long listing format (-l), showing all hidden files (-a) with colorized terminal output.",
    category: "files",
    roles: ["beginner", "frontend", "backend", "devops"],
    supportedOperatingSystems: ["linux", "macos"],
    supportedShells: ["bash", "zsh"],
    tags: ["ls", "list files", "directory", "hidden files", "permissions", "filesystem"],
    riskLevel: "low",
    safetyNotes: "Read-only filesystem command.",
    example: {
      scenario: "Verify permissions and inspect presence of hidden .env or .git files.",
      commandWithArgs: "ls -la --color=auto",
      expectedOutput: "drwxr-xr-x  6 user staff   192 Oct 28 12:00 .\n-rw-r--r--  1 user staff   420 Oct 28 12:00 package.json"
    },
    relatedCommandIds: ["fs-find-large-files-posix", "fs-disk-usage-folders"]
  },
  {
    id: "fs-find-large-files-posix",
    title: "Find Files Exceeding 100MB Recursively",
    taskDescription: "Scan recursively from the current directory to locate space-consuming files greater than 100 Megabytes.",
    command: "find . -type f -size +100M -exec ls -lh {} +",
    explanation: "Finds regular files (-type f) with size strictly exceeding 100M and executes long listing with human units (-lh).",
    category: "files",
    roles: ["backend", "devops", "beginner"],
    supportedOperatingSystems: ["linux", "macos"],
    supportedShells: ["bash", "zsh"],
    tags: ["find", "large files", "disk space", "storage", "cleanup", "size"],
    riskLevel: "low",
    safetyNotes: "Read-only inspection. Scans filesystem metadata without modifying or deleting files.",
    example: {
      scenario: "Diagnose why laptop hard drive or VM root volume is rapidly running out of disk space.",
      commandWithArgs: "find /var/log -type f -size +100M -exec ls -lh {} +",
      expectedOutput: "-rw-r--r-- 1 root root 412M Oct 28 09:12 /var/log/syslog.1"
    },
    relatedCommandIds: ["fs-disk-usage-folders", "fs-list-detailed-human"]
  },
  {
    id: "fs-disk-usage-folders",
    title: "Calculate Disk Space Usage by Top Folders",
    taskDescription: "Calculate and summarize total disk space used by each folder in current directory, ordered from largest to smallest.",
    command: "du -sh ./* | sort -hr",
    explanation: "Summarizes disk space (-s) in human units (-h) for items in current folder and pipes into numeric reverse sort (-hr).",
    category: "files",
    roles: ["backend", "devops", "beginner"],
    supportedOperatingSystems: ["linux", "macos"],
    supportedShells: ["bash", "zsh"],
    tags: ["du", "disk usage", "folder size", "storage", "sort", "cleanup"],
    riskLevel: "low",
    safetyNotes: "Read-only storage calculation.",
    example: {
      scenario: "Determine whether node_modules, cache, or build output folders are taking up gigabytes of space.",
      commandWithArgs: "du -sh ./* | sort -hr | head -n 5",
      expectedOutput: "1.2G\t./node_modules\n410M\t./dist\n28M\t./src"
    },
    relatedCommandIds: ["fs-find-large-files-posix", "fs-list-detailed-human"]
  },
  {
    id: "fs-chmod-web-permissions",
    title: "Harden Permissions: 755 Folders & 644 Files",
    taskDescription: "Recursively configure standard web security permissions: directories executable (755) and files non-executable (644).",
    command: "find . -type d -exec chmod 755 {} + && find . -type f -exec chmod 644 {} +",
    explanation: "Applies 755 (rwxr-xr-x) strictly to directories and 644 (rw-r--r--) strictly to regular files across subdirectories.",
    category: "files",
    roles: ["backend", "devops"],
    supportedOperatingSystems: ["linux", "macos"],
    supportedShells: ["bash", "zsh"],
    tags: ["chmod", "permissions", "security", "755", "644", "webserver", "harden"],
    riskLevel: "high",
    safetyNotes: "Modifies permissions recursively across files. Ensure custom shell scripts or binaries that require execute permissions (+x) are excluded.",
    example: {
      scenario: "Fix 403 Forbidden errors or insecure file permissions on web deployment directories.",
      commandWithArgs: "find /var/www/html -type d -exec chmod 755 {} + && find /var/www/html -type f -exec chmod 644 {} +",
      expectedOutput: "[No terminal output on success; file modes updated across directory]"
    },
    relatedCommandIds: ["fs-list-detailed-human", "fs-create-nested-directories"]
  },
  {
    id: "fs-recursive-delete-folder",
    title: "Force Delete Directory and All Contents",
    taskDescription: "Recursively and forcibly eradicate a directory tree, subfolders, and files without interactive prompts.",
    command: "rm -rf <directory_path>",
    explanation: "Runs rm with recursive (-r) and force (-f) flags, bypassing confirmations and ignoring non-existent files.",
    category: "files",
    roles: ["backend", "devops", "frontend"],
    supportedOperatingSystems: ["linux", "macos"],
    supportedShells: ["bash", "zsh"],
    tags: ["rm", "delete", "remove directory", "force delete", "purge", "rm -rf"],
    riskLevel: "critical",
    safetyNotes: "CRITICAL: Irreversible deletion without Trash bin. Never run with `/` or undefined variable paths (e.g. `rm -rf $DIR/`).",
    example: {
      scenario: "Eradicate corrupted project build output folder or temporary scratch directory.",
      commandWithArgs: "rm -rf ./dist_corrupted",
      expectedOutput: "[No terminal output on success; directory is immediately erased]"
    },
    relatedCommandIds: ["fs-create-nested-directories", "fs-disk-usage-folders"]
  },
  {
    id: "fs-create-nested-directories",
    title: "Create Deeply Nested Directories In One Command",
    taskDescription: "Create a target directory along with any missing parent directories without throwing errors.",
    command: "mkdir -p path/to/nested/folder",
    explanation: "Creates directory tree where the -p flag automatically instantiates non-existent intermediate directories.",
    category: "files",
    roles: ["beginner", "frontend", "backend", "devops"],
    supportedOperatingSystems: ["linux", "macos"],
    supportedShells: ["bash", "zsh"],
    tags: ["mkdir", "directories", "folders", "nested", "mkdir -p", "scaffold"],
    riskLevel: "low",
    safetyNotes: "Safe filesystem creation command. Does not overwrite existing files or directories.",
    example: {
      scenario: "Scaffold a new modular directory structure for nested component tests.",
      commandWithArgs: "mkdir -p src/components/modals/tests",
      expectedOutput: "[No terminal output on success; intermediate and leaf directories created]"
    },
    relatedCommandIds: ["fs-list-detailed-human", "fs-recursive-delete-folder"]
  },
  {
    id: "fs-rsync-sync-progress",
    title: "Sync Directories Incrementally with Progress",
    taskDescription: "Mirror and synchronize files between two directories, copying only modified chunks with speed metrics.",
    command: "rsync -avz --progress ./source/ ./destination/",
    explanation: "Transfers files in archive mode (-a), verbose (-v), compressed (-z), displaying real-time transfer progress.",
    category: "files",
    roles: ["backend", "devops"],
    supportedOperatingSystems: ["linux", "macos"],
    supportedShells: ["bash", "zsh"],
    tags: ["rsync", "sync", "backup", "copy", "transfer", "incremental"],
    riskLevel: "medium",
    safetyNotes: "Overwrites files in destination if source files are newer. Notice trailing slashes: `./source/` transfers directory contents.",
    example: {
      scenario: "Backup project media assets or transfer assets to mounted volume.",
      commandWithArgs: "rsync -avz --progress ./public/assets/ /mnt/backup/assets/",
      expectedOutput: "sending incremental file list\nlogo.png\n      1.42M 100%   45.2MB/s    0:00:00 (xfr#1, to-chk=0/1)\ntotal size is 1.42M  speedup is 1.00"
    },
    relatedCommandIds: ["fs-disk-usage-folders", "fs-recursive-delete-folder"]
  },
  {
    id: "fs-count-lines-project",
    title: "Count Total Lines of Code in Source Files",
    taskDescription: "Recursively scan project JavaScript and JSX files to tally line counts.",
    command: 'find src -name "*.js" -o -name "*.jsx" | xargs wc -l',
    explanation: "Searches the src directory for matching extensions and pipes matching paths to wc -l to compute lines per file and total sum.",
    category: "files",
    roles: ["frontend", "backend", "beginner"],
    supportedOperatingSystems: ["linux", "macos"],
    supportedShells: ["bash", "zsh"],
    tags: ["lines of code", "count", "metrics", "find", "wc", "codebase"],
    riskLevel: "low",
    safetyNotes: "Read-only text stream count.",
    example: {
      scenario: "Assess total lines of JavaScript code across your application frontend.",
      commandWithArgs: 'find src -name "*.js" -o -name "*.jsx" | xargs wc -l',
      expectedOutput: "     120 src/main.jsx\n     450 src/App.jsx\n    1420 src/data/commands.js\n    1990 total"
    },
    relatedCommandIds: ["fs-list-detailed-human", "fs-find-large-files-posix"]
  },

  // ==========================================
  // 3. NODE.JS & NPM TOOLCHAINS (8 Commands)
  // ==========================================
  {
    id: "node-clean-cache-force",
    title: "Force Clear Corrupted npm Cache",
    taskDescription: "Wipe out the local npm cache directory to resolve corrupted tarballs and integrity checksum mismatches.",
    command: "npm cache clean --force",
    explanation: "Deletes all cached package tarballs and metadata from the local ~/.npm cache directory.",
    category: "node",
    roles: ["beginner", "frontend", "backend"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["npm", "cache", "integrity error", "clean", "fix install", "corrupted"],
    riskLevel: "medium",
    safetyNotes: "Requires re-downloading packages from the registry during subsequent installs, increasing network usage.",
    example: {
      scenario: "Resolve 'npm ERR! code EINTEGRITY sha512 checksum mismatch' errors when installing dependencies.",
      commandWithArgs: "npm cache clean --force",
      expectedOutput: "npm WARN using --force Recommended protections disabled."
    },
    relatedCommandIds: ["node-clean-install-ci", "node-purge-modules-install"]
  },
  {
    id: "node-clean-install-ci",
    title: "Perform Deterministic Clean Install via Lockfile",
    taskDescription: "Install exact dependency versions from package-lock.json with automated node_modules reset.",
    command: "npm ci",
    explanation: "Deletes current node_modules and installs dependencies strictly matching the lockfile without mutating package-lock.json.",
    category: "node",
    roles: ["frontend", "backend", "devops"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["npm", "ci", "clean install", "package-lock", "reproducible", "pipeline"],
    riskLevel: "medium",
    safetyNotes: "Removes existing node_modules before installing. Requires valid package-lock.json and package.json to be in sync.",
    example: {
      scenario: "Standard dependency installation inside CI/CD pipelines (GitHub Actions, Docker) to guarantee reproducible builds.",
      commandWithArgs: "npm ci",
      expectedOutput: "added 135 packages in 3.4s"
    },
    relatedCommandIds: ["node-clean-cache-force", "node-purge-modules-install"]
  },
  {
    id: "node-list-global-depth0",
    title: "List Globally Installed Top-Level npm Packages",
    taskDescription: "Inspect all CLI packages installed globally without cluttering the screen with transitive dependencies.",
    command: "npm list -g --depth=0",
    explanation: "Lists top-level global packages (--depth=0) with their installed semver versions.",
    category: "node",
    roles: ["beginner", "frontend", "backend", "devops"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["npm", "global", "list", "packages", "cli", "versions"],
    riskLevel: "low",
    safetyNotes: "Read-only inspection.",
    example: {
      scenario: "Check installed global versions of nodemon, pnpm, or vercel CLI.",
      commandWithArgs: "npm list -g --depth=0",
      expectedOutput: "/usr/local/lib\n├── corepack@0.24.0\n├── npm@10.8.2\n└── pnpm@9.5.0"
    },
    relatedCommandIds: ["node-evaluate-versions", "node-clean-install-ci"]
  },
  {
    id: "node-audit-fix-safe",
    title: "Automatically Patch Non-Breaking Vulnerabilities",
    taskDescription: "Update vulnerable dependency versions within compatible semver constraints.",
    command: "npm audit fix",
    explanation: "Scans dependency tree against advisory database and updates vulnerable sub-dependencies without introducing breaking major versions.",
    category: "node",
    roles: ["frontend", "backend", "devops"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["npm", "audit", "security", "vulnerability", "cve", "patch"],
    riskLevel: "medium",
    safetyNotes: "Modifies package-lock.json. Run unit/integration tests following execution to verify package compatibility.",
    example: {
      scenario: "Resolve low and moderate security alerts flagged in dependency trees.",
      commandWithArgs: "npm audit fix",
      expectedOutput: "upgraded 4 packages in 2.1s\nfound 0 vulnerabilities"
    },
    relatedCommandIds: ["node-clean-install-ci", "node-interactive-update-ncu"]
  },
  {
    id: "node-kill-dev-port-npx",
    title: "Kill Hung Process on Local Development Port",
    taskDescription: "Locate and terminate any process listening on local development ports (e.g. 3000, 5173, 8080).",
    command: "npx kill-port 3000",
    explanation: "Executes kill-port CLI without persistent installation to look up socket PIDs and terminate hung node servers.",
    category: "node",
    roles: ["beginner", "frontend", "backend"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["kill port", "port 3000", "port in use", "npx", "dev server", "eaddrinuse"],
    riskLevel: "high",
    safetyNotes: "Terminates the process currently bound to target port. Ensure you do not kill unintended system background daemons.",
    example: {
      scenario: "Resolve 'Error: listen EADDRINUSE: address already in use :::3000' after dev server crash.",
      commandWithArgs: "npx kill-port 3000",
      expectedOutput: "Process on port 3000 killed"
    },
    relatedCommandIds: ["node-clean-cache-force", "sys-check-port-lsof"]
  },
  {
    id: "node-interactive-update-ncu",
    title: "Interactively Upgrade package.json Dependencies",
    taskDescription: "Launch an interactive CLI menu to selectively choose which dependencies to bump to latest versions.",
    command: "npx npm-check-updates -i",
    explanation: "Queries npm registry, compares installed versions against newest releases, and displays an interactive prompt.",
    category: "node",
    roles: ["frontend", "backend"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["ncu", "upgrade", "dependencies", "npm-check-updates", "outdated", "package.json"],
    riskLevel: "medium",
    safetyNotes: "Rewrites versions in package.json. Upgrading across major semver versions may introduce breaking changes requiring code refactoring.",
    example: {
      scenario: "Review available dependency updates across minor and major versions interactively.",
      commandWithArgs: "npx npm-check-updates -i",
      expectedOutput: "? Choose which packages to update: (Press <space> to select)\n❯ [x] lucide-react   0.450.0  →  0.460.0\n  [ ] tailwindcss    3.4.10   →  3.4.14"
    },
    relatedCommandIds: ["node-audit-fix-safe", "node-clean-install-ci"]
  },
  {
    id: "node-purge-modules-install",
    title: "Nuclear Purge of node_modules and Fresh Install",
    taskDescription: "Completely delete node_modules and package-lock.json, clear npm cache, and perform clean reinstall.",
    command: "rm -rf node_modules package-lock.json && npm install",
    explanation: "Eliminates local dependency folders and lockfiles to force clean resolution of all packages directly from package.json.",
    category: "node",
    roles: ["beginner", "frontend", "backend"],
    supportedOperatingSystems: ["linux", "macos"],
    supportedShells: ["bash", "zsh"],
    tags: ["npm", "reinstall", "node_modules", "nuclear", "reset", "clean install"],
    riskLevel: "high",
    safetyNotes: "Regenerates package-lock.json from scratch, which may resolve newer minor/patch versions of non-pinned sub-dependencies.",
    example: {
      scenario: "Fix intractable 'Module not found' or broken native binary binding errors after branch rebase.",
      commandWithArgs: "rm -rf node_modules package-lock.json && npm install",
      expectedOutput: "added 142 packages in 12.8s"
    },
    relatedCommandIds: ["node-clean-cache-force", "node-clean-install-ci"]
  },
  {
    id: "node-evaluate-versions",
    title: "Inspect Node.js Engine & V8 Runtime Versions",
    taskDescription: "Print active Node.js, V8 engine, OpenSSL, and libuv runtime version strings.",
    command: 'node -e "console.log(process.versions)"',
    explanation: "Evaluates inline JS expression accessing the process.versions object and prints JSON output to stdout.",
    category: "node",
    roles: ["backend", "devops", "beginner"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["node", "versions", "v8", "openssl", "runtime", "engine"],
    riskLevel: "low",
    safetyNotes: "Read-only process environment query.",
    example: {
      scenario: "Verify exact V8 engine and cryptographic OpenSSL versions before deploying services.",
      commandWithArgs: 'node -e "console.log(process.versions)"',
      expectedOutput: "{\n  node: '22.13.0',\n  v8: '12.4.254.21-node.15',\n  uv: '1.48.0',\n  openssl: '3.0.15+quic'\n}"
    },
    relatedCommandIds: ["node-list-global-depth0", "node-clean-install-ci"]
  },

  // ==========================================
  // 4. FRONTEND TOOLING & BUILD ENGINES (6 Commands)
  // ==========================================
  {
    id: "vite-build-analyze",
    title: "Visualize Production JavaScript Bundle Chunks",
    taskDescription: "Generate an interactive treemap visualizer of bundled client JavaScript assets to detect bloated libraries.",
    command: "npx vite-bundle-visualizer",
    explanation: "Builds production assets and launches a browser view showing byte size contributions per npm package.",
    category: "frontend",
    roles: ["frontend"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["vite", "bundle", "analyze", "treemap", "size", "performance"],
    riskLevel: "low",
    safetyNotes: "Build inspection tool; does not alter source code.",
    example: {
      scenario: "Identify which third-party packages are causing bundle sizes to exceed performance budgets.",
      commandWithArgs: "npx vite-bundle-visualizer",
      expectedOutput: "Building assets with Vite...\nBundle visualizer ready at: http://localhost:5000"
    },
    relatedCommandIds: ["vite-preview-production", "serve-static-dist"]
  },
  {
    id: "tailwind-standalone-compile",
    title: "Compile Standalone Tailwind CSS Bundle with Minification",
    taskDescription: "Execute Tailwind CLI compiler directly to build minified output CSS from template classes.",
    command: "npx tailwindcss -i ./src/index.css -o ./dist/output.css --minify",
    explanation: "Runs Tailwind JIT scanner against files specified in content config, generating a production-optimized CSS bundle.",
    category: "frontend",
    roles: ["frontend"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["tailwind", "css", "minify", "compile", "jit", "styles"],
    riskLevel: "low",
    safetyNotes: "Writes output to `./dist/output.css`.",
    example: {
      scenario: "Generate standalone production stylesheet for static HTML landing pages or micro-frontends.",
      commandWithArgs: "npx tailwindcss -i ./src/index.css -o ./dist/output.css --minify",
      expectedOutput: "Done in 142ms.\nOutput written to dist/output.css (18.4 kB)"
    },
    relatedCommandIds: ["vite-build-analyze", "prettier-format-write"]
  },
  {
    id: "eslint-fix-directory",
    title: "Autofix Code Style & Lint Errors with ESLint",
    taskDescription: "Scan JavaScript and JSX files to automatically correct fixable formatting and lint issues.",
    command: "npx eslint . --fix --ext .js,.jsx",
    explanation: "Applies ESLint rules to all matching files and applies automatic fixes directly in place.",
    category: "frontend",
    roles: ["frontend", "backend"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["eslint", "lint", "autofix", "code style", "code quality"],
    riskLevel: "medium",
    safetyNotes: "Modifies source files in-place. Ensure code is committed to Git prior to running bulk autofixes.",
    example: {
      scenario: "Clean up unused imports, semicolon conventions, and quote consistency prior to opening a PR.",
      commandWithArgs: "npx eslint . --fix --ext .js,.jsx",
      expectedOutput: "[No terminal output when all fixable errors are cleanly resolved]"
    },
    relatedCommandIds: ["prettier-format-write", "vite-build-analyze"]
  },
  {
    id: "prettier-format-write",
    title: "Format Entire Codebase with Prettier",
    taskDescription: "Format source code, stylesheets, and JSON configurations according to Prettier rules.",
    command: 'npx prettier --write "src/**/*.{js,jsx,css}"',
    explanation: "Re-indents and formats files matching the glob pattern and rewrites them in place.",
    category: "frontend",
    roles: ["frontend", "backend"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["prettier", "format", "code style", "indentation", "clean code"],
    riskLevel: "medium",
    safetyNotes: "Modifies file contents in-place. Stash or commit working tree before executing.",
    example: {
      scenario: "Standardize indentation and line wrapping across all React components and CSS files.",
      commandWithArgs: 'npx prettier --write "src/**/*.{js,jsx,css}"',
      expectedOutput: "src/App.jsx 45ms\nsrc/components/Header.jsx 22ms\nsrc/index.css 12ms"
    },
    relatedCommandIds: ["eslint-fix-directory", "tailwind-standalone-compile"]
  },
  {
    id: "vite-preview-production",
    title: "Preview Built Production Assets Locally",
    taskDescription: "Boot Vite's lightweight built-in HTTP preview server to test the `./dist` build folder before deploying.",
    command: "npx vite preview --port 4173",
    explanation: "Serves compiled distribution assets at port 4173 with gzip and production routing behavior.",
    category: "frontend",
    roles: ["frontend", "devops"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["vite", "preview", "production", "dist", "static server"],
    riskLevel: "low",
    safetyNotes: "Read-only local web server.",
    example: {
      scenario: "Test production asset links, client routing, and minified bundles before deploying to Vercel.",
      commandWithArgs: "npx vite preview --port 4173",
      expectedOutput: "  ➜  Local:   http://localhost:4173/\n  ➜  Network: use --host to expose"
    },
    relatedCommandIds: ["serve-static-dist", "vite-build-analyze"]
  },
  {
    id: "serve-static-dist",
    title: "Serve SPA Distribution Folder with Single-Page Routing",
    taskDescription: "Launch a production-grade static web server with automatic index.html fallback for client-side SPAs.",
    command: "npx serve -s dist -l 3000",
    explanation: "Executes `serve` in SPA mode (-s), ensuring direct URL visits redirect properly to index.html.",
    category: "frontend",
    roles: ["frontend", "devops"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["serve", "static server", "spa", "production preview", "port 3000"],
    riskLevel: "low",
    safetyNotes: "Read-only server. Binds port 3000.",
    example: {
      scenario: "Simulate a live static CDN or Nginx server locally for testing React Router URL deep links.",
      commandWithArgs: "npx serve -s dist -l 3000",
      expectedOutput: "Serving! Local: http://localhost:3000"
    },
    relatedCommandIds: ["vite-preview-production", "node-kill-dev-port-npx"]
  },

  // ==========================================
  // 5. BACKEND, DOCKER & CONTAINERS (8 Commands)
  // ==========================================
  {
    id: "docker-list-all-containers",
    title: "List All Docker Containers (Including Stopped)",
    taskDescription: "Display formatted table of all containers including running, exited, and stopped instances.",
    command: "docker ps -a",
    explanation: "Queries Docker daemon and prints container IDs, image tags, exit codes, and status.",
    category: "backend",
    roles: ["backend", "devops", "beginner"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["docker", "ps", "containers", "status", "list", "exited"],
    riskLevel: "low",
    safetyNotes: "Read-only Docker daemon query.",
    example: {
      scenario: "Check if a postgres container crashed or inspect its container name and mapped host ports.",
      commandWithArgs: "docker ps -a",
      expectedOutput: "CONTAINER ID   IMAGE         COMMAND     STATUS                   PORTS\n7e82b9a4c110   postgres:16   \"docker…\"   Exited (1) 2 hours ago   5432/tcp"
    },
    relatedCommandIds: ["docker-stream-live-logs", "docker-stop-all-running"]
  },
  {
    id: "docker-stop-all-running",
    title: "Stop All Currently Running Docker Containers",
    taskDescription: "Gracefully shut down all active containers across the entire Docker engine in parallel.",
    command: "docker stop $(docker ps -q)",
    explanation: "Passes list of active container IDs (-q) to docker stop, which dispatches SIGTERM followed by SIGKILL after timeout.",
    category: "backend",
    roles: ["backend", "devops"],
    supportedOperatingSystems: ["linux", "macos"],
    supportedShells: ["bash", "zsh"],
    tags: ["docker", "stop all", "containers", "cleanup", "shutdown"],
    riskLevel: "high",
    safetyNotes: "Gracefully halts all active containerized services, databases, and microservices.",
    example: {
      scenario: "Halt all background services before machine reboot or laptop battery conservation.",
      commandWithArgs: "docker stop $(docker ps -q)",
      expectedOutput: "7e82b9a4c110\n9f10a8c42b01"
    },
    relatedCommandIds: ["docker-list-all-containers", "docker-system-prune-volumes"]
  },
  {
    id: "docker-system-prune-volumes",
    title: "Purge All Unused Docker Containers, Images & Volumes",
    taskDescription: "Reclaim tens of gigabytes by wiping all stopped containers, untagged images, build cache, and unattached volumes.",
    command: "docker system prune -af --volumes",
    explanation: "Erases all stopped containers, unused networks, unreferenced images (-a), and persistent anonymous/named volumes (--volumes).",
    category: "backend",
    roles: ["backend", "devops"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["docker", "prune", "volumes", "images", "clean disk", "purge"],
    riskLevel: "critical",
    safetyNotes: "CRITICAL: Irreversible data deletion. Deletes all database storage inside unattached Docker volumes. Ensure backups exist.",
    example: {
      scenario: "Free up disk space when Docker fails with 'no space left on device'.",
      commandWithArgs: "docker system prune -af --volumes",
      expectedOutput: "Deleted Containers:\n...\nDeleted Volumes:\nTotal reclaimed space: 32.4GB"
    },
    relatedCommandIds: ["docker-stop-all-running", "docker-remove-exited-containers"]
  },
  {
    id: "docker-compose-rebuild-fresh",
    title: "Rebuild and Restart Docker Compose Services Fresh",
    taskDescription: "Force rebuild of images from Dockerfiles and recreate service containers in detached background mode.",
    command: "docker compose up -d --build --force-recreate",
    explanation: "Reads docker-compose.yml, builds fresh image layers (--build), recreation is forced (--force-recreate), running detached (-d).",
    category: "backend",
    roles: ["backend", "devops", "frontend"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["docker compose", "rebuild", "force recreate", "detach", "services"],
    riskLevel: "medium",
    safetyNotes: "Temporarily restarts services causing transient downtime while containers swap.",
    example: {
      scenario: "Dependencies or environment configs changed and require fresh container layer compilation.",
      commandWithArgs: "docker compose up -d --build --force-recreate",
      expectedOutput: "[+] Running 3/3\n ✔ Container redis-db     Recreated\n ✔ Container api-service  Recreated"
    },
    relatedCommandIds: ["docker-stream-live-logs", "docker-list-all-containers"]
  },
  {
    id: "docker-stream-live-logs",
    title: "Stream Live Docker Container Logs with Timestamps",
    taskDescription: "Follow real-time stdout and stderr output from a specific container with ISO timestamps.",
    command: "docker logs -f --tail 100 -t <container-id>",
    explanation: "Follows logs (-f), showing last 100 lines (--tail 100) and prepending timestamp metadata (-t).",
    category: "backend",
    roles: ["backend", "devops"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["docker", "logs", "stream", "tail", "timestamps", "debug container"],
    riskLevel: "low",
    safetyNotes: "Read-only streaming command.",
    example: {
      scenario: "Debug connection handshake failures inside an API container.",
      commandWithArgs: "docker logs -f --tail 50 -t api-service",
      expectedOutput: "2026-10-28T12:00:02.124Z [INFO] Database connection pool initialized on port 5432"
    },
    relatedCommandIds: ["docker-list-all-containers", "docker-exec-bash-shell"]
  },
  {
    id: "docker-exec-bash-shell",
    title: "Open Interactive Shell Inside Running Container",
    taskDescription: "Attach a pseudo-terminal shell session inside an active Docker container for direct inspection.",
    command: "docker exec -it <container-id> /bin/sh",
    explanation: "Runs an interactive (-i) terminal session (-t) inside the container using /bin/sh (compatible with Alpine and Debian).",
    category: "backend",
    roles: ["backend", "devops"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["docker", "exec", "shell", "interactive", "terminal inside", "bash"],
    riskLevel: "low",
    safetyNotes: "Attaches a live shell session inside container. Modifications made inside container filesystem are ephemeral unless mounted on volumes.",
    example: {
      scenario: "Check internal environment variables or test database connectivity from inside container network.",
      commandWithArgs: "docker exec -it web-api /bin/sh",
      expectedOutput: "/app # whoami\nroot\n/app # exit"
    },
    relatedCommandIds: ["docker-stream-live-logs", "docker-list-all-containers"]
  },
  {
    id: "docker-view-resource-stats",
    title: "Inspect Live CPU & RAM Usage by Docker Containers",
    taskDescription: "Display a real-time snapshot of memory usage, CPU percentage, and network I/O per container.",
    command: "docker stats --no-stream",
    explanation: "Queries container metrics and outputs a one-time tabular summary without continuous terminal lock.",
    category: "backend",
    roles: ["backend", "devops"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["docker", "stats", "cpu", "ram", "memory usage", "resources"],
    riskLevel: "low",
    safetyNotes: "Read-only container monitoring.",
    example: {
      scenario: "Verify how much RAM your local Redis and PostgreSQL containers are consuming.",
      commandWithArgs: "docker stats --no-stream",
      expectedOutput: "CONTAINER ID   NAME       CPU %   MEM USAGE / LIMIT     MEM %   NET I/O\n7e82b9a4c110   postgres   0.12%   42.15MiB / 7.671GiB   0.54%   1.2kB / 0B"
    },
    relatedCommandIds: ["docker-list-all-containers", "sys-top-ram-processes"]
  },
  {
    id: "docker-remove-exited-containers",
    title: "Clean Up Stopped & Exited Containers",
    taskDescription: "Quickly prune stopped containers without removing images or persistent storage volumes.",
    command: "docker container prune -f",
    explanation: "Cleans up stopped container instances and frees container ID slots without interactive prompt (-f).",
    category: "backend",
    roles: ["backend", "devops"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["docker", "cleanup", "prune", "stopped containers", "exited"],
    riskLevel: "high",
    safetyNotes: "Permanently removes all stopped containers. Ensure no stopped containers have uncommitted test data.",
    example: {
      scenario: "Clear accumulated test containers resulting from CI test runs.",
      commandWithArgs: "docker container prune -f",
      expectedOutput: "Deleted Containers:\n4a2f8b1c90\nTotal reclaimed space: 420MB"
    },
    relatedCommandIds: ["docker-list-all-containers", "docker-system-prune-volumes"]
  },

  // ==========================================
  // 6. SYSTEM DIAGNOSTICS & NETWORKING (10 Commands)
  // ==========================================
  {
    id: "sys-check-port-lsof",
    title: "Identify Process Listening on a Local TCP Port",
    taskDescription: "Find the Process ID (PID) and program name bound to a specific local port (e.g. 3000, 8080).",
    command: "lsof -i :3000",
    explanation: "Queries open files and network sockets matching port 3000, printing PID, user, and command.",
    category: "system",
    roles: ["beginner", "frontend", "backend", "devops"],
    supportedOperatingSystems: ["linux", "macos"],
    supportedShells: ["bash", "zsh"],
    tags: ["lsof", "port", "listening", "network", "pid", "find process"],
    riskLevel: "low",
    safetyNotes: "Read-only inspection of network socket tables.",
    example: {
      scenario: "Identify which Node.js or background process is blocking port 3000.",
      commandWithArgs: "lsof -i :3000",
      expectedOutput: "COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME\nnode    42102 user   22u  IPv6 0x3d4f      0t0  TCP *:3000 (LISTEN)"
    },
    relatedCommandIds: ["sys-kill-process-sigkill", "node-kill-dev-port-npx"]
  },
  {
    id: "sys-top-cpu-processes",
    title: "List Top 10 CPU-Consuming Processes",
    taskDescription: "Query process table and rank active tasks by processor consumption in descending order.",
    command: "ps aux --sort=-%cpu | head -n 11",
    explanation: "Lists processes across all users (aux), sorted descending by CPU percent (--sort=-%cpu), truncated to top 10.",
    category: "system",
    roles: ["backend", "devops"],
    supportedOperatingSystems: ["linux", "macos"],
    supportedShells: ["bash", "zsh"],
    tags: ["ps", "cpu", "high cpu", "processes", "performance", "top"],
    riskLevel: "low",
    safetyNotes: "Read-only process table query.",
    example: {
      scenario: "Find which background compiler or runaway loop is maxing out CPU cores.",
      commandWithArgs: "ps aux --sort=-%cpu | head -n 6",
      expectedOutput: "USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nuser     84120 98.2  1.4 841024 112000 ?       R    12:00   4:10 node server.js"
    },
    relatedCommandIds: ["sys-top-ram-processes", "sys-kill-process-sigkill"]
  },
  {
    id: "sys-top-ram-processes",
    title: "List Top 10 Memory-Consuming Processes",
    taskDescription: "Query process table and rank active tasks by physical RAM resident memory consumption.",
    command: "ps aux --sort=-%mem | head -n 11",
    explanation: "Lists processes across all users (aux), sorted descending by memory percent (--sort=-%mem), truncated to top 10.",
    category: "system",
    roles: ["backend", "devops"],
    supportedOperatingSystems: ["linux", "macos"],
    supportedShells: ["bash", "zsh"],
    tags: ["ps", "memory", "ram", "oom", "leak", "top memory"],
    riskLevel: "low",
    safetyNotes: "Read-only process table query.",
    example: {
      scenario: "Identify memory leaks in microservices causing swap file thrashing.",
      commandWithArgs: "ps aux --sort=-%mem | head -n 6",
      expectedOutput: "USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nuser     41201  0.4  8.2 4120400 680000 ?      Sl   10:00   1:20 chrome"
    },
    relatedCommandIds: ["sys-top-cpu-processes", "sys-disk-free-human"]
  },
  {
    id: "sys-disk-free-human",
    title: "Check Free Disk Space on Mounted Partitions",
    taskDescription: "Display total, used, and available storage capacity across root and data partitions in gigabytes.",
    command: "df -h",
    explanation: "Reports filesystem disk space usage formatted in human-readable powers of 1024 (-h).",
    category: "system",
    roles: ["beginner", "backend", "devops"],
    supportedOperatingSystems: ["linux", "macos"],
    supportedShells: ["bash", "zsh"],
    tags: ["df", "disk space", "storage", "free space", "hard drive"],
    riskLevel: "low",
    safetyNotes: "Read-only filesystem metric query.",
    example: {
      scenario: "Verify available storage capacity before initiating heavy container builds or database dumps.",
      commandWithArgs: "df -h /",
      expectedOutput: "Filesystem     Size  Used Avail Use% Mounted on\n/dev/root      120G   68G   48G  59% /"
    },
    relatedCommandIds: ["fs-find-large-files-posix", "fs-disk-usage-folders"]
  },
  {
    id: "sys-kill-process-sigkill",
    title: "Force Terminate a Hanging Process by PID",
    taskDescription: "Send uncatchable SIGKILL (Signal 9) to immediately stop an unresponsive process.",
    command: "kill -9 <PID>",
    explanation: "Dispatches non-maskable SIGKILL to kernel process table, immediately terminating the target process.",
    category: "system",
    roles: ["backend", "devops", "frontend"],
    supportedOperatingSystems: ["linux", "macos"],
    supportedShells: ["bash", "zsh"],
    tags: ["kill", "kill -9", "terminate", "sigkill", "force quit", "hung process"],
    riskLevel: "critical",
    safetyNotes: "CRITICAL: Process is killed abruptly without opportunity to flush file buffers, close database sockets, or run exit hooks. Double-check the target PID.",
    example: {
      scenario: "Terminate frozen local server or hung test runner that fails to respond to Ctrl+C.",
      commandWithArgs: "kill -9 48120",
      expectedOutput: "[Process 48120 terminated immediately; returns to shell prompt]"
    },
    relatedCommandIds: ["sys-check-port-lsof", "node-kill-dev-port-npx"]
  },
  {
    id: "sys-fast-dns-lookup",
    title: "Perform Fast DNS Resolution for a Domain",
    taskDescription: "Query DNS nameservers via dig to cleanly return resolved IPv4 A record addresses.",
    command: "dig +short example.com",
    explanation: "Queries DNS using dig with the +short option to print only the answer IP address, omitting headers and authority records.",
    category: "system",
    roles: ["frontend", "backend", "devops"],
    supportedOperatingSystems: ["linux", "macos"],
    supportedShells: ["bash", "zsh"],
    tags: ["dig", "dns", "nslookup", "ip address", "resolve", "domain"],
    riskLevel: "low",
    safetyNotes: "Read-only DNS query.",
    example: {
      scenario: "Quickly verify if your newly configured Cloudflare or Route53 DNS A record has propagated.",
      commandWithArgs: "dig +short api.github.com",
      expectedOutput: "140.82.121.6"
    },
    relatedCommandIds: ["sys-test-tcp-port-nc", "sys-http-head-headers"]
  },
  {
    id: "sys-test-tcp-port-nc",
    title: "Test if Remote TCP Port is Open and Reachable",
    taskDescription: "Probe remote hostname and port using netcat to verify firewall rules and listener availability.",
    command: "nc -zv -w 3 example.com 443",
    explanation: "Opens socket in zero-I/O scan mode (-z), verbose (-v), with 3-second timeout (-w 3).",
    category: "system",
    roles: ["backend", "devops"],
    supportedOperatingSystems: ["linux", "macos"],
    supportedShells: ["bash", "zsh"],
    tags: ["nc", "netcat", "test port", "firewall", "tcp connection", "port check"],
    riskLevel: "low",
    safetyNotes: "Standard network connection handshake.",
    example: {
      scenario: "Verify whether database host is permitting traffic through security group port 5432.",
      commandWithArgs: "nc -zv -w 3 db.internal 5432",
      expectedOutput: "Connection to db.internal 5432 port [tcp/postgresql] succeeded!"
    },
    relatedCommandIds: ["sys-fast-dns-lookup", "sys-check-port-lsof"]
  },
  {
    id: "sys-http-head-headers",
    title: "Inspect HTTP Response Headers and Status Code",
    taskDescription: "Send HEAD request via curl to examine status codes, CORS headers, and redirect chains without downloading body.",
    command: "curl -IL -s https://example.com",
    explanation: "Requests headers only (-I), follows 301/302 redirects (-L), in silent mode (-s) to omit progress meter.",
    category: "system",
    roles: ["frontend", "backend", "devops"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["curl", "http headers", "status code", "cors", "redirect", "head request"],
    riskLevel: "low",
    safetyNotes: "Read-only HTTP query.",
    example: {
      scenario: "Verify whether API returns correct Access-Control-Allow-Origin CORS header and 200 OK status.",
      commandWithArgs: "curl -IL -s https://api.github.com",
      expectedOutput: "HTTP/2 200\nserver: GitHub.com\ncontent-type: application/json; charset=utf-8"
    },
    relatedCommandIds: ["sys-fast-dns-lookup", "sys-check-ssl-expiry"]
  },
  {
    id: "sys-generate-ssh-ed25519",
    title: "Generate Modern Secure Ed25519 SSH Keypair",
    taskDescription: "Create elliptic curve Ed25519 private and public SSH keys recommended by GitHub and modern clouds.",
    command: 'ssh-keygen -t ed25519 -C "user@example.com"',
    explanation: "Invokes ssh-keygen specifying the Edwards-curve Digital Signature Algorithm (-t ed25519) and user comment (-C).",
    category: "system",
    roles: ["beginner", "frontend", "backend", "devops"],
    supportedOperatingSystems: ["linux", "macos", "windows"],
    supportedShells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    tags: ["ssh", "ssh-keygen", "ed25519", "github key", "security", "credentials"],
    riskLevel: "medium",
    safetyNotes: "Writes keypair to ~/.ssh/id_ed25519. Prompts before overwriting existing keys.",
    example: {
      scenario: "Set up SSH key authentication for GitHub or a remote Linux virtual machine.",
      commandWithArgs: 'ssh-keygen -t ed25519 -C "dev@company.com"',
      expectedOutput: "Generating public/private ed25519 key pair.\nYour identification has been saved in /home/user/.ssh/id_ed25519\nYour public key has been saved in /home/user/.ssh/id_ed25519.pub"
    },
    relatedCommandIds: ["sys-test-tcp-port-nc", "sys-check-ssl-expiry"]
  },
  {
    id: "sys-check-ssl-expiry",
    title: "Check SSL/TLS Certificate Expiration Dates",
    taskDescription: "Connect via OpenSSL TLS handshake to view certificate validity notBefore and notAfter timestamps.",
    command: "openssl s_client -connect example.com:443 -servername example.com < /dev/null 2>/dev/null | openssl x509 -noout -dates",
    explanation: "Initiates SSL handshake with SNI (-servername), pipes certificate to x509 utility, and extracts validity dates.",
    category: "system",
    roles: ["backend", "devops"],
    supportedOperatingSystems: ["linux", "macos"],
    supportedShells: ["bash", "zsh"],
    tags: ["ssl", "tls", "certificate", "expiry", "openssl", "https", "security"],
    riskLevel: "low",
    safetyNotes: "Read-only TLS handshake query.",
    example: {
      scenario: "Verify how many days remain before an HTTPS production certificate expires.",
      commandWithArgs: "openssl s_client -connect github.com:443 -servername github.com < /dev/null 2>/dev/null | openssl x509 -noout -dates",
      expectedOutput: "notBefore=Mar 15 00:00:00 2024 GMT\nnotAfter=Mar 15 23:59:59 2025 GMT"
    },
    relatedCommandIds: ["sys-http-head-headers", "sys-fast-dns-lookup"]
  }
];

export const ALLOWED_CATEGORIES = [
  "git",
  "files",
  "node",
  "frontend",
  "backend",
  "system"
];

export const ALLOWED_ROLES = [
  "beginner",
  "frontend",
  "backend",
  "devops",
  "git"
];

export const ALLOWED_RISK_LEVELS = [
  "low",
  "medium",
  "high",
  "critical"
];

export const ALLOWED_OPERATING_SYSTEMS = [
  "linux",
  "macos",
  "windows"
];

export const ALLOWED_SHELLS = [
  "bash",
  "zsh",
  "powershell",
  "cmd",
  "git-bash"
];
