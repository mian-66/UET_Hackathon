export const filesystemCommands = [
  {
    id: "fs-find-large-files",
    title: "Find files larger than 100MB recursively",
    description: "Searches from the current directory downwards to identify files consuming large amounts of disk space.",
    syntax: "find . -type f -size +100M -exec ls -lh {} +",
    category: "filesystem",
    personas: ["backend", "devops", "beginner"],
    shells: ["bash", "zsh", "git-bash"],
    shellVariants: [
      {
        shell: "powershell",
        syntax: "Get-ChildItem -Path . -Recurse -File | Where-Object { $_.Length -gt 100MB } | Select-Object FullName, @{Name='SizeMB';Expression={[math]::Round($_.Length / 1MB, 2)}}"
      },
      {
        shell: "cmd",
        syntax: "forfiles /S /M * /C \"cmd /c if @fsize GEQ 104857600 echo @path @fsize\""
      }
    ],
    risk: "read-only",
    riskReason: "Inspection only. Scans filesystem metadata without modifying files.",
    parameters: [
      {
        name: "size",
        placeholder: "+100M",
        type: "string",
        required: false,
        defaultValue: "+100M",
        description: "Minimum size threshold (e.g. +50M, +1G)."
      }
    ],
    flags: [
      { flag: "-type f", description: "Match files only (ignoring directory objects)." },
      { flag: "-size", description: "File size filter (+ for greater than, - for less than)." }
    ],
    examples: [
      {
        scenario: "Diagnose why disk space is suddenly full",
        command: "find /var/log -type f -size +100M -exec ls -lh {} +",
        expectedOutcome: "Lists file paths and exact sizes for all files exceeding 100MB."
      }
    ],
    tags: ["find", "disk space", "large files", "storage", "cleanup", "size"],
    aliases: [
      "find files bigger than 100mb",
      "locate huge files taking disk space",
      "search large files"
    ],
    docsUrl: "https://man7.org/linux/man-pages/man1/find.1.html"
  },
  {
    id: "fs-disk-usage-by-folder",
    title: "Calculate disk space used by top-level folders",
    description: "Displays human-readable disk usage for each folder in the current directory, sorted from largest to smallest.",
    syntax: "du -sh ./* | sort -hr",
    category: "filesystem",
    personas: ["backend", "devops", "beginner"],
    shells: ["bash", "zsh", "git-bash"],
    shellVariants: [
      {
        shell: "powershell",
        syntax: "Get-ChildItem -Directory | ForEach-Object { [PSCustomObject]@{ Directory = $_.Name; SizeMB = [math]::Round(((Get-ChildItem $_.FullName -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB), 2) } } | Sort-Object SizeMB -Descending"
      }
    ],
    risk: "read-only",
    riskReason: "Calculates directory sizes. Does not change filesystem content.",
    parameters: [],
    flags: [
      { flag: "-s", description: "Summary: display only a total for each argument." },
      { flag: "-h", description: "Human-readable format (e.g., 24K, 15M, 2G)." },
      { flag: "-r", description: "Reverse order to show largest at top." }
    ],
    examples: [
      {
        scenario: "Check which subfolder is eating project disk space",
        command: "du -sh ./* | sort -hr | head -n 10",
        expectedOutcome: "Outputs top 10 largest folders and their sizes."
      }
    ],
    tags: ["du", "disk usage", "folder size", "storage", "sort", "cleanup"],
    aliases: [
      "check folder size",
      "how much space folders take",
      "disk usage by directory"
    ],
    docsUrl: "https://man7.org/linux/man-pages/man1/du.1.html"
  },
  {
    id: "fs-find-modified-recently",
    title: "Find all files modified in the last 24 hours",
    description: "Searches for files changed, created, or touched within the past 24 hours (1 day).",
    syntax: "find . -type f -mtime -1",
    category: "filesystem",
    personas: ["backend", "frontend", "devops"],
    shells: ["bash", "zsh", "git-bash"],
    shellVariants: [
      {
        shell: "powershell",
        syntax: "Get-ChildItem -Recurse -File | Where-Object { $_.LastWriteTime -gt (Get-Date).AddDays(-1) }"
      }
    ],
    risk: "read-only",
    riskReason: "Safe filesystem metadata query.",
    parameters: [
      {
        name: "days",
        placeholder: "-1",
        type: "number",
        required: false,
        defaultValue: "-1",
        description: "Number of days back to search (-1 = last 24h, -7 = last 7 days)."
      }
    ],
    flags: [
      { flag: "-mtime", description: "File data modification time in 24-hour periods." }
    ],
    examples: [
      {
        scenario: "Identify which config files were touched today during debugging",
        command: "find /etc -type f -mtime -1",
        expectedOutcome: "Prints paths of files updated within 24 hours."
      }
    ],
    tags: ["find", "modified", "recent files", "timestamp", "debug"],
    aliases: [
      "find files edited today",
      "files modified last 24 hours",
      "recent changed files"
    ],
    docsUrl: "https://man7.org/linux/man-pages/man1/find.1.html"
  },
  {
    id: "fs-chmod-recursive-permissions",
    title: "Set permissions recursively: 755 for dirs, 644 for files",
    description: "Standard web security baseline: directories get execute/browse permissions (755), while files remain non-executable (644).",
    syntax: "find . -type d -exec chmod 755 {} + && find . -type f -exec chmod 644 {} +",
    category: "filesystem",
    personas: ["devops", "backend"],
    shells: ["bash", "zsh", "git-bash"],
    risk: "modifying",
    riskReason: "Alters file permission bits. May affect server execution if specific binary scripts require 755.",
    parameters: [],
    flags: [],
    examples: [
      {
        scenario: "Fix permissions after cloning or extracting an archive on a Linux web server",
        command: "find /var/www/html -type d -exec chmod 755 {} + && find /var/www/html -type f -exec chmod 644 {} +",
        expectedOutcome: "All directories are set to 755 and all regular files to 644."
      }
    ],
    tags: ["chmod", "permissions", "security", "755", "644", "web server"],
    aliases: [
      "fix file permissions",
      "make dirs 755 and files 644",
      "chmod directories and files separately"
    ],
    docsUrl: "https://man7.org/linux/man-pages/man1/chmod.1.html"
  },
  {
    id: "fs-rsync-sync-directories",
    title: "Synchronize two directories with progress indicator",
    description: "Transfers only modified files between source and destination, preserving permissions, timestamps, and symlinks.",
    syntax: "rsync -avz --progress ./source/ ./destination/",
    category: "filesystem",
    personas: ["devops", "backend"],
    shells: ["bash", "zsh", "git-bash"],
    shellVariants: [
      {
        shell: "powershell",
        syntax: "robocopy .\\source .\\destination /E /Z /ETA"
      },
      {
        shell: "cmd",
        syntax: "robocopy source destination /E /Z /ETA"
      }
    ],
    risk: "modifying",
    riskReason: "Overwrites files in destination directory with matching names from source.",
    parameters: [
      {
        name: "source",
        placeholder: "./source/",
        type: "path",
        required: true,
        description: "Source directory path (trailing slash copies directory contents)."
      },
      {
        name: "destination",
        placeholder: "./destination/",
        type: "path",
        required: true,
        description: "Destination directory path."
      }
    ],
    flags: [
      { flag: "-a", description: "Archive mode: preserves permissions, symlinks, timestamps." },
      { flag: "-v", description: "Verbose output." },
      { flag: "-z", description: "Compresses file data during transfer." },
      { flag: "--progress", description: "Shows real-time progress bar for each file." }
    ],
    examples: [
      {
        scenario: "Mirror local backup folder to secondary drive or mount",
        command: "rsync -avz --progress /data/db_backups/ /mnt/backup_drive/",
        expectedOutcome: "Incremental copy of new and changed files with speed and ETA."
      }
    ],
    tags: ["rsync", "sync", "backup", "copy", "transfer", "incremental"],
    aliases: [
      "sync directories rsync",
      "copy folder with progress bar",
      "incremental folder sync"
    ],
    docsUrl: "https://download.samba.org/pub/rsync/rsync.1"
  },
  {
    id: "fs-tree-ignore-heavy-folders",
    title: "Generate directory tree ignoring node_modules and .git",
    description: "Prints a clean visual directory tree structure to inspect architecture without polluting the terminal with thousands of dependencies.",
    syntax: "tree -I 'node_modules|.git|.next|dist' -L 3",
    category: "filesystem",
    personas: ["beginner", "frontend", "backend"],
    shells: ["bash", "zsh", "git-bash"],
    shellVariants: [
      {
        shell: "powershell",
        syntax: "Get-ChildItem -Recurse -Depth 3 -Exclude 'node_modules','.git','dist' | Select-Object FullName"
      }
    ],
    risk: "safe",
    riskReason: "Pure visualization tool.",
    parameters: [
      {
        name: "depth",
        placeholder: "3",
        type: "number",
        required: false,
        defaultValue: "3",
        description: "Maximum directory depth level to traverse."
      }
    ],
    flags: [
      { flag: "-I", description: "Pattern of directory or file names to ignore." },
      { flag: "-L", description: "Max display depth of the directory tree." }
    ],
    examples: [
      {
        scenario: "Review project codebase structure for a presentation or documentation",
        command: "tree -I 'node_modules|.git|dist' -L 2",
        expectedOutcome: "Clean ASCII tree of folders 2 levels deep."
      }
    ],
    tags: ["tree", "directory structure", "visualize folders", "ignore node_modules"],
    aliases: [
      "print project structure tree",
      "show directory tree without node_modules",
      "folder hierarchy tree"
    ],
    docsUrl: "https://linux.die.net/man/1/tree"
  },
  {
    id: "fs-count-lines-of-code",
    title: "Count total lines of code across project files",
    description: "Recursively scans source files and calculates total lines of code, skipping node_modules and build output.",
    syntax: "find src -name '*.js' -o -name '*.jsx' | xargs wc -l",
    category: "filesystem",
    personas: ["frontend", "backend", "beginner"],
    shells: ["bash", "zsh", "git-bash"],
    shellVariants: [
      {
        shell: "powershell",
        syntax: "(Get-ChildItem -Path src -Include *.js,*.jsx -Recurse | Get-Content | Measure-Object -Line).Lines"
      }
    ],
    risk: "safe",
    riskReason: "Read-only text inspection.",
    parameters: [],
    flags: [
      { flag: "wc -l", description: "Word count with line counting mode." }
    ],
    examples: [
      {
        scenario: "Check how many lines of JavaScript/JSX are in your src folder",
        command: "find src -name '*.jsx' | xargs wc -l",
        expectedOutcome: "Lists file line counts and a total line summary."
      }
    ],
    tags: ["cloc", "lines of code", "count lines", "metrics", "wc"],
    aliases: [
      "count lines of code in project",
      "how many lines of code",
      "wc -l across files"
    ],
    docsUrl: "https://man7.org/linux/man-pages/man1/wc.1.html"
  },
  {
    id: "fs-batch-rename-extensions",
    title: "Batch rename all .txt files to .md in directory",
    description: "Iterates through all matching files and changes their file extensions without moving their location.",
    syntax: "for f in *.txt; do mv -- \"$f\" \"${f%.txt}.md\"; done",
    category: "filesystem",
    personas: ["backend", "devops"],
    shells: ["bash", "zsh", "git-bash"],
    shellVariants: [
      {
        shell: "powershell",
        syntax: "Get-ChildItem *.txt | Rename-Item -NewName { $_.Name -replace '\\.txt$','.md' }"
      },
      {
        shell: "cmd",
        syntax: "ren *.txt *.md"
      }
    ],
    risk: "modifying",
    riskReason: "Renames files in-place. Verify target directory before execution.",
    parameters: [
      {
        name: "fromExt",
        placeholder: "txt",
        type: "string",
        required: true,
        description: "Original extension."
      },
      {
        name: "toExt",
        placeholder: "md",
        type: "string",
        required: true,
        description: "Target extension."
      }
    ],
    flags: [],
    examples: [
      {
        scenario: "Convert markdown notes exported as plain text to .md",
        command: "for f in *.txt; do mv -- \"$f\" \"${f%.txt}.md\"; done",
        expectedOutcome: "All .txt files in the current directory are renamed to .md."
      }
    ],
    tags: ["rename", "batch rename", "extensions", "mv", "powershell"],
    aliases: [
      "rename all txt to md",
      "batch change file extension",
      "bulk rename files"
    ],
    docsUrl: "https://man7.org/linux/man-pages/man1/mv.1.html"
  }
];
