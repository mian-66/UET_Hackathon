export const recipeCommands = [
  {
    id: "recipe-fix-detached-head",
    title: "Fix Git detached HEAD state without losing uncommitted work",
    description: "Safely creates a new temporary branch to capture commits made in a detached HEAD state and merges them back into your main branch.",
    syntax: "git checkout -b temp-recovery && git checkout main && git merge temp-recovery",
    category: "recipes",
    personas: ["beginner", "frontend", "backend"],
    shells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    risk: "modifying",
    riskReason: "Creates and merges branches. Preserves all commits made while in detached HEAD.",
    parameters: [
      {
        name: "targetBranch",
        placeholder: "main",
        type: "branch",
        required: false,
        defaultValue: "main",
        description: "Branch where you want to incorporate recovered commits."
      }
    ],
    flags: [],
    examples: [
      {
        scenario: "You checked out an older commit to test, made commits, and realized you're in 'detached HEAD'",
        command: "git checkout -b my-saved-work && git checkout main && git merge my-saved-work",
        expectedOutcome: "All commits are preserved in a new branch and safely merged into main."
      }
    ],
    tags: ["recipes", "detached head", "git rescue", "troubleshooting", "recover commits"],
    aliases: [
      "fix detached head git",
      "recover commits in detached head",
      "leave detached head without losing work"
    ],
    docsUrl: "https://git-scm.com/docs/git-checkout"
  },
  {
    id: "recipe-nuke-node-modules-reinstall",
    title: "Completely purge node_modules and reinstall cleanly",
    description: "The nuclear option for stubborn JavaScript build bugs: deletes node_modules and package-lock, clears cache, and runs fresh install.",
    syntax: "rm -rf node_modules package-lock.json && npm cache clean --force && npm install",
    category: "recipes",
    personas: ["beginner", "frontend", "backend"],
    shells: ["bash", "zsh", "git-bash"],
    shellVariants: [
      {
        shell: "powershell",
        syntax: "Remove-Item -Recurse -Force node_modules, package-lock.json; npm cache clean --force; npm install"
      },
      {
        shell: "cmd",
        syntax: "rmdir /s /q node_modules && del package-lock.json && npm cache clean --force && npm install"
      }
    ],
    risk: "modifying",
    riskReason: "Deletes installed packages and lockfile. Re-downloads everything from npm registry.",
    parameters: [],
    flags: [],
    examples: [
      {
        scenario: "Resolves strange module not found errors or ghost dependencies after branch merges",
        command: "rm -rf node_modules package-lock.json && npm cache clean --force && npm install",
        expectedOutcome: "Fresh node_modules directory created with updated lockfile."
      }
    ],
    tags: ["recipes", "node_modules", "npm", "reinstall", "purge", "nuclear option"],
    aliases: [
      "delete node modules and reinstall",
      "fresh npm install clean",
      "fix broken node modules"
    ],
    docsUrl: "https://docs.npmjs.com/cli/v10/commands/npm-install"
  },
  {
    id: "recipe-free-stuck-port",
    title: "Troubleshoot and kill process occupying local dev port",
    description: "Diagnoses which process has locked a port (e.g. 3000, 8080) and terminates it cleanly in a single combined step.",
    syntax: "lsof -ti:3000 | xargs kill -9",
    category: "recipes",
    personas: ["beginner", "frontend", "backend"],
    shells: ["bash", "zsh", "git-bash"],
    shellVariants: [
      {
        shell: "powershell",
        syntax: "Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force"
      },
      {
        shell: "cmd",
        syntax: "for /f \"tokens=5\" %a in ('netstat -aon ^| find \":3000\"') do taskkill /f /pid %a"
      }
    ],
    risk: "destructive",
    riskReason: "Terminates the process bound to the specified port immediately.",
    parameters: [
      {
        name: "port",
        placeholder: "3000",
        type: "port",
        required: true,
        defaultValue: "3000",
        description: "Port to free."
      }
    ],
    flags: [
      { flag: "-t", description: "Terse: outputs PID numbers only, ideal for piping to kill." },
      { flag: "-i:3000", description: "Select network sockets matching port." }
    ],
    examples: [
      {
        scenario: "React or Vite dev server crashed but left port 3000 locked in background",
        command: "lsof -ti:3000 | xargs kill -9",
        expectedOutcome: "Port 3000 is instantly freed up for reuse."
      }
    ],
    tags: ["recipes", "port in use", "kill port", "port 3000", "eaddrinuse"],
    aliases: [
      "kill port 3000 one line",
      "free port eaddrinuse",
      "kill process on port"
    ],
    docsUrl: "https://man7.org/linux/man-pages/man8/lsof.8.html"
  },
  {
    id: "recipe-change-remote-to-ssh",
    title: "Switch Git remote repository from HTTPS to SSH",
    description: "Updates origin URL to use SSH keys, eliminating the need to repeatedly enter Personal Access Tokens (PAT).",
    syntax: "git remote set-url origin git@github.com:username/repo.git",
    category: "recipes",
    personas: ["beginner", "frontend", "backend"],
    shells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    risk: "modifying",
    riskReason: "Changes remote origin address. Future pushes will use SSH key authentication.",
    parameters: [
      {
        name: "sshUrl",
        placeholder: "git@github.com:username/repo.git",
        type: "string",
        required: true,
        description: "SSH repository clone URL."
      }
    ],
    flags: [],
    examples: [
      {
        scenario: "GitHub password authentication failed; migrate to SSH key authentication",
        command: "git remote set-url origin git@github.com:octocat/hello-world.git",
        expectedOutcome: "Origin URL switched; `git remote -v` verifies SSH endpoint."
      }
    ],
    tags: ["recipes", "git remote", "ssh", "https to ssh", "authentication", "github"],
    aliases: [
      "change git remote from https to ssh",
      "switch to ssh git url",
      "update origin url"
    ],
    docsUrl: "https://docs.github.com/en/get-started/getting-started-with-git/managing-remote-repositories"
  },
  {
    id: "recipe-create-tar-gz-archive",
    title: "Create compressed tar.gz backup archive of directory",
    description: "Bundles and compresses a directory into a single portable archive with standard gzip compression.",
    syntax: "tar -czvf project_backup_$(date +%Y%m%d).tar.gz ./project",
    category: "recipes",
    personas: ["devops", "backend", "beginner"],
    shells: ["bash", "zsh", "git-bash"],
    shellVariants: [
      {
        shell: "powershell",
        syntax: "Compress-Archive -Path .\\project -DestinationPath project_backup.zip"
      }
    ],
    risk: "modifying",
    riskReason: "Creates a new archive file on disk.",
    parameters: [
      {
        name: "targetDir",
        placeholder: "./project",
        type: "path",
        required: true,
        defaultValue: "./project",
        description: "Directory to compress."
      }
    ],
    flags: [
      { flag: "-c", description: "Create a new archive." },
      { flag: "-z", description: "Compress archive using gzip." },
      { flag: "-v", description: "Verbosely list files processed." },
      { flag: "-f", description: "Use archive file specified." }
    ],
    examples: [
      {
        scenario: "Create a timestamped compressed backup before making dangerous edits",
        command: "tar -czvf site_backup.tar.gz /var/www/html",
        expectedOutcome: "Outputs list of archived files and produces site_backup.tar.gz."
      }
    ],
    tags: ["recipes", "tar", "tar.gz", "compress", "backup", "archive"],
    aliases: [
      "create tar gz backup",
      "compress folder to tar gz",
      "zip folder command line"
    ],
    docsUrl: "https://man7.org/linux/man-pages/man1/tar.1.html"
  },
  {
    id: "recipe-git-squash-last-n-commits",
    title: "Squash last N commits into one clean commit",
    description: "Combines messy intermediate work-in-progress commits into a single polished commit before opening a pull request.",
    syntax: "git reset --soft HEAD~3 && git commit -m 'feat: complete user authentication flow'",
    category: "recipes",
    personas: ["frontend", "backend"],
    shells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    risk: "modifying",
    riskReason: "Replaces the last N commits with a single new commit. Safe for local unpushed branches.",
    parameters: [
      {
        name: "count",
        placeholder: "3",
        type: "number",
        required: true,
        defaultValue: "3",
        description: "Number of recent commits to collapse."
      },
      {
        name: "message",
        placeholder: "feat: complete user authentication flow",
        type: "string",
        required: true,
        description: "Consolidated commit message."
      }
    ],
    flags: [],
    examples: [
      {
        scenario: "You made 4 tiny commits ('fix typo', 'wip test', 'fix bug') and want 1 clean commit for PR review",
        command: "git reset --soft HEAD~4 && git commit -m 'feat(auth): implement oauth login with google'",
        expectedOutcome: "4 intermediate commits are squashed into 1 clean commit with all changes intact."
      }
    ],
    tags: ["recipes", "squash", "git squash", "clean history", "pull request"],
    aliases: [
      "squash last 3 commits",
      "combine multiple commits into one",
      "merge commits before pr"
    ],
    docsUrl: "https://git-scm.com/book/en/v2/Git-Tools-Rewriting-History"
  }
];

