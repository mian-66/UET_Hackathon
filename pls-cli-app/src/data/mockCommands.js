export const mockCommands = [
  {
    id: "git-undo-soft",
    title: "Undo last Git commit keeping changes staged",
    description: "Rewinds the HEAD pointer by one commit without discarding your modified files or unstaging index changes.",
    syntax: "git reset --soft HEAD~1",
    category: "git",
    personas: ["beginner", "frontend", "backend"],
    shells: ["bash", "zsh", "powershell", "cmd"],
    risk: "modifying",
    riskReason: "Rewinds commit history locally. Safe for unpushed commits; requires force-push if pushed to remote.",
    parameters: [
      { name: "count", placeholder: "1", type: "number", required: false, defaultValue: "1", description: "Number of commits to unwrap from HEAD." }
    ],
    flags: [
      { flag: "--soft", description: "Leaves modified files intact and staged in index ready for re-committing." }
    ],
    examples: [
      {
        scenario: "Fix a typo in the previous commit message without losing staged code",
        command: "git reset --soft HEAD~1",
        expectedOutcome: "Last commit unwrapped; modified files remain staged in git status."
      }
    ],
    tags: ["git", "undo", "uncommit", "soft reset", "revert"],
    aliases: ["undo last git commit", "cancel commit keep files", "uncommit changes"]
  },
  {
    id: "git-undo-hard",
    title: "Completely discard last commit and wipe modifications",
    description: "Resets the current branch tip to the previous commit, permanently deleting all uncommitted and committed modifications.",
    syntax: "git reset --hard HEAD~1",
    category: "git",
    personas: ["frontend", "backend", "devops"],
    shells: ["bash", "zsh", "powershell", "cmd"],
    risk: "destructive",
    riskReason: "PERMANENT DATA LOSS: Uncommitted working tree edits and the target commit's file diffs are deleted forever.",
    parameters: [
      { name: "count", placeholder: "1", type: "number", required: false, defaultValue: "1", description: "Number of commits to erase." }
    ],
    flags: [
      { flag: "--hard", description: "Resets index and working tree. Any changes since <commit> are discarded." }
    ],
    examples: [
      {
        scenario: "Discard bad experimental commit that broke main branch locally",
        command: "git reset --hard HEAD~1",
        expectedOutcome: "HEAD moves back by 1 commit; working tree is wiped completely clean."
      }
    ],
    tags: ["git", "hard reset", "wipe", "delete commit", "discard"],
    aliases: ["delete last commit permanently", "hard reset git", "erase commit changes"]
  },
  {
    id: "git-amend-message",
    title: "Change message of the most recent commit",
    description: "Updates the text of your last commit without creating a duplicate commit node in history.",
    syntax: 'git commit --amend -m "new message"',
    category: "git",
    personas: ["beginner", "frontend", "backend"],
    shells: ["bash", "zsh", "powershell", "cmd"],
    risk: "modifying",
    riskReason: "Modifies SHA-1 hash of the last commit. Safe for local unpushed commits.",
    parameters: [
      { name: "message", placeholder: "new message", type: "string", required: true, description: "Replacement commit message." }
    ],
    flags: [
      { flag: "--amend", description: "Replace the tip of the current branch with a revised commit." },
      { flag: "-m", description: "Inline commit message string." }
    ],
    examples: [
      {
        scenario: "Correct issue reference number in commit message",
        command: 'git commit --amend -m "fix(auth): resolve JWT expiration bug (#402)"',
        expectedOutcome: "Last commit is updated with new commit message."
      }
    ],
    tags: ["git", "amend", "rename commit", "fix message", "typo"],
    aliases: ["change last commit message", "edit commit title", "fix typo in git commit"]
  },
  {
    id: "port-kill-3000",
    title: "Kill hanging process running on local port 3000",
    description: "Locates the Process ID (PID) occupying port 3000 and immediately terminates it to free up dev servers.",
    syntax: "lsof -ti:3000 | xargs kill -9",
    category: "system",
    personas: ["beginner", "frontend", "backend"],
    shells: ["bash", "zsh"],
    risk: "destructive",
    riskReason: "Immediately sends SIGKILL to the process on port 3000 without graceful shutdown.",
    parameters: [
      { name: "port", placeholder: "3000", type: "port", required: true, defaultValue: "3000", description: "Port number to inspect and clear." }
    ],
    flags: [
      { flag: "-t", description: "Terse mode: outputs only process IDs (PIDs)." },
      { flag: "-i:3000", description: "Select network sockets matching port 3000." }
    ],
    examples: [
      {
        scenario: "Fix 'Error: listen EADDRINUSE: address already in use :::3000'",
        command: "lsof -ti:3000 | xargs kill -9",
        expectedOutcome: "Process 34912 is killed. Port 3000 is immediately freed."
      }
    ],
    tags: ["port", "kill", "eaddrinuse", "port 3000", "lsof", "free port"],
    aliases: ["kill process on port 3000", "free up port 3000", "eaddrinuse fix"]
  },
  {
    id: "fs-find-large-files",
    title: "Find files larger than 100MB recursively",
    description: "Scans directories downwards from the current location to identify large files consuming excessive disk space.",
    syntax: "find . -type f -size +100M -exec ls -lh {} +",
    category: "files",
    personas: ["backend", "devops", "beginner"],
    shells: ["bash", "zsh"],
    risk: "safe",
    riskReason: "Read-only inspection of filesystem metadata.",
    parameters: [
      { name: "size", placeholder: "+100M", type: "string", required: false, defaultValue: "+100M", description: "Minimum size filter." }
    ],
    flags: [
      { flag: "-type f", description: "Match files only (ignoring directory nodes)." },
      { flag: "-size +100M", description: "Filter for file sizes strictly greater than 100 Megabytes." }
    ],
    examples: [
      {
        scenario: "Find large log files or ISOs eating laptop disk space",
        command: "find /var/log -type f -size +100M -exec ls -lh {} +",
        expectedOutcome: "Outputs formatted list of paths and exact MB/GB sizes."
      }
    ],
    tags: ["find", "large files", "disk space", "storage", "cleanup"],
    aliases: ["find large files over 100mb", "search huge files", "disk usage find"]
  },
  {
    id: "npm-clean-cache",
    title: "Force wipe corrupted npm cache",
    description: "Purges the entire local npm cache directory to resolve corrupted tarballs and integrity checksum mismatches.",
    syntax: "npm cache clean --force",
    category: "node",
    personas: ["beginner", "frontend", "backend"],
    shells: ["bash", "zsh", "powershell", "cmd"],
    risk: "modifying",
    riskReason: "Clears cached packages; subsequent installs will re-download modules over the network.",
    parameters: [],
    flags: [
      { flag: "--force", description: "Overrides npm's built-in safeguard preventing accidental cache clearance." }
    ],
    examples: [
      {
        scenario: "Fix npm ERR! code EINTEGRITY during package install",
        command: "npm cache clean --force",
        expectedOutcome: "npm cache is wiped clean."
      }
    ],
    tags: ["npm", "cache", "integrity error", "clean", "fix"],
    aliases: ["clear npm cache", "fix npm integrity error", "purge npm cache"]
  },
  {
    id: "npm-kill-reinstall",
    title: "Nuclear purge of node_modules and clean re-install",
    description: "Deletes the dependency folder and lockfile, cleans cache, and re-executes a fresh installation from package.json.",
    syntax: "rm -rf node_modules package-lock.json && npm install",
    category: "node",
    personas: ["beginner", "frontend", "backend"],
    shells: ["bash", "zsh"],
    risk: "modifying",
    riskReason: "Recreates node_modules and regenerates package-lock.json from scratch.",
    parameters: [],
    flags: [],
    examples: [
      {
        scenario: "Resolve ghost dependency conflicts after rebasing a branch",
        command: "rm -rf node_modules package-lock.json && npm install",
        expectedOutcome: "Fresh node_modules and lockfile created in ~45 seconds."
      }
    ],
    tags: ["npm", "node_modules", "reinstall", "clean", "reset"],
    aliases: ["reinstall node modules clean", "delete node_modules and install", "nuclear npm fix"]
  },
  {
    id: "sys-check-ram",
    title: "List top 10 processes consuming the most RAM",
    description: "Queries the process table and sorts all running tasks by resident memory consumption in descending order.",
    syntax: "ps aux --sort=-%mem | head -n 11",
    category: "system",
    personas: ["devops", "backend"],
    shells: ["bash", "zsh"],
    risk: "safe",
    riskReason: "Read-only inspection of kernel process table.",
    parameters: [],
    flags: [
      { flag: "--sort=-%mem", description: "Sorts descending by percentage of physical RAM used." },
      { flag: "head -n 11", description: "Limits output to the header plus top 10 processes." }
    ],
    examples: [
      {
        scenario: "Diagnose system slowdown caused by memory leaks",
        command: "ps aux --sort=-%mem | head -n 6",
        expectedOutcome: "Prints top 5 processes with user, PID, %CPU, %MEM, and command name."
      }
    ],
    tags: ["ps", "memory", "ram", "performance", "top memory", "oom"],
    aliases: ["check top memory processes", "which process is using ram", "find memory leaks"]
  },
  {
    id: "docker-purge-all",
    title: "Purge all unused Docker images, containers, and volumes",
    description: "Reclaims tens of gigabytes of disk space by eradicating stopped containers, untagged images, and unused volumes.",
    syntax: "docker system prune -af --volumes",
    category: "backend",
    personas: ["devops", "backend"],
    shells: ["bash", "zsh", "powershell", "cmd"],
    risk: "destructive",
    riskReason: "PERMANENT: Wipes all stopped containers, untagged image layers, and unattached volumes.",
    parameters: [],
    flags: [
      { flag: "-a", description: "Remove all unused images, not just dangling ones." },
      { flag: "-f", description: "Bypass confirmation prompt." },
      { flag: "--volumes", description: "Prune all unused storage volumes." }
    ],
    examples: [
      {
        scenario: "Free up disk space when Docker fails with 'no space left on device'",
        command: "docker system prune -af --volumes",
        expectedOutcome: "Total reclaimed space: 28.4GB"
      }
    ],
    tags: ["docker", "prune", "cleanup", "disk space", "volumes", "images"],
    aliases: ["clean up all docker data", "purge docker containers and images", "docker clean"]
  },
  {
    id: "fs-chmod-web",
    title: "Harden permissions: 755 for directories, 644 for files",
    description: "Standard web security baseline: sets execute/browse permissions on folders while keeping files non-executable.",
    syntax: "find . -type d -exec chmod 755 {} + && find . -type f -exec chmod 644 {} +",
    category: "files",
    personas: ["devops", "backend"],
    shells: ["bash", "zsh"],
    risk: "modifying",
    riskReason: "Modifies file permission bits across the current directory tree.",
    parameters: [],
    flags: [],
    examples: [
      {
        scenario: "Fix 403 Forbidden permission errors on cloned web root",
        command: "find /var/www/html -type d -exec chmod 755 {} + && find /var/www/html -type f -exec chmod 644 {} +",
        expectedOutcome: "All directories set to 755; all regular files set to 644."
      }
    ],
    tags: ["chmod", "permissions", "security", "755", "644", "web"],
    aliases: ["fix file permissions 755 644", "make directories 755 files 644", "chmod web files"]
  },
  {
    id: "text-ripgrep-auth",
    title: "Fast case-insensitive search for token in JavaScript files",
    description: "Uses ripgrep to quickly find occurrences of an auth token or API secret, respecting gitignore automatically.",
    syntax: 'rg -i "authToken" --type js',
    category: "frontend",
    personas: ["frontend", "backend"],
    shells: ["bash", "zsh", "powershell", "cmd"],
    risk: "safe",
    riskReason: "Read-only text search.",
    parameters: [
      { name: "pattern", placeholder: "authToken", type: "string", required: true, description: "String to locate." }
    ],
    flags: [
      { flag: "-i", description: "Case-insensitive matching." },
      { flag: "--type js", description: "Constrain search to JavaScript (.js, .jsx) files." }
    ],
    examples: [
      {
        scenario: "Audit where authToken header is assigned in frontend code",
        command: 'rg -i "authToken" --type js',
        expectedOutcome: "src/api/client.js:14: headers['authToken'] = token;"
      }
    ],
    tags: ["ripgrep", "rg", "search", "grep", "find string"],
    aliases: ["search code with ripgrep", "fast grep in javascript", "find authtoken"]
  },
  {
    id: "git-clean-untracked",
    title: "Remove all untracked files and directories",
    description: "Recursively deletes untracked files and build artifacts that are not under Git version control.",
    syntax: "git clean -fd",
    category: "git",
    personas: ["frontend", "backend", "devops"],
    shells: ["bash", "zsh", "powershell", "cmd"],
    risk: "destructive",
    riskReason: "PERMANENT DELETION: Untracked files that were never committed are removed forever.",
    parameters: [],
    flags: [
      { flag: "-f", description: "Force deletion of untracked files." },
      { flag: "-d", description: "Remove untracked directories in addition to files." }
    ],
    examples: [
      {
        scenario: "Clean up untracked temporary build output and scratch files",
        command: "git clean -fd",
        expectedOutcome: "Removing build_temp/\nRemoving scratch.txt"
      }
    ],
    tags: ["git", "clean", "purge untracked", "delete untracked", "reset repo"],
    aliases: ["delete untracked files git", "clean working tree", "git clean force"]
  }
];

export const CATEGORIES = [
  { id: "all", label: "All Commands", count: 12 },
  { id: "git", label: "Git & GitHub", count: 4 },
  { id: "files", label: "Files & Folders", count: 2 },
  { id: "node", label: "Node.js & npm", count: 2 },
  { id: "frontend", label: "Frontend Tooling", count: 1 },
  { id: "backend", label: "Backend Services", count: 1 },
  { id: "system", label: "System & Diagnostics", count: 2 }
];

export const ROLES = [
  { id: "all", label: "All Roles" },
  { id: "beginner", label: "Beginner" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "devops", label: "DevOps" }
];

