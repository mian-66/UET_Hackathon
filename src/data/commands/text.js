export const textCommands = [
  {
    id: "text-ripgrep-by-filetype",
    title: "Blazing fast case-insensitive search in specific file types",
    description: "Uses ripgrep (rg) to search across files with multithreading, ignoring gitignore files by default.",
    syntax: 'rg -i "authToken" --type js',
    category: "text-processing",
    personas: ["frontend", "backend", "devops"],
    shells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    risk: "safe",
    riskReason: "Read-only text search.",
    parameters: [
      {
        name: "pattern",
        placeholder: "authToken",
        type: "string",
        required: true,
        defaultValue: "authToken",
        description: "Search term or regex pattern."
      },
      {
        name: "filetype",
        placeholder: "js",
        type: "string",
        required: false,
        defaultValue: "js",
        description: "Target file extension category (e.g. js, ts, py, json)."
      }
    ],
    flags: [
      { flag: "-i", description: "Case-insensitive search." },
      { flag: "--type", description: "Filter search to specific file type." }
    ],
    examples: [
      {
        scenario: "Find where 'API_KEY' is referenced in JavaScript and TypeScript files",
        command: 'rg -i "API_KEY" -g "*.{js,ts,jsx,tsx}"',
        expectedOutcome: "High-speed colorized matches with file paths and line numbers."
      }
    ],
    tags: ["ripgrep", "rg", "search text", "find string", "regex", "fast grep"],
    aliases: [
      "search for string with ripgrep",
      "fast code search",
      "rg search case insensitive"
    ],
    docsUrl: "https://github.com/BurntSushi/ripgrep"
  },
  {
    id: "text-grep-recursive-with-lines",
    title: "Recursively search for string with line numbers in directory",
    description: "Searches all files under a directory for a target string and prints matching file paths alongside line numbers.",
    syntax: 'grep -rn "TODO" ./src',
    category: "text-processing",
    personas: ["beginner", "frontend", "backend"],
    shells: ["bash", "zsh", "git-bash"],
    shellVariants: [
      {
        shell: "powershell",
        syntax: 'Select-String -Path "./src/*" -Pattern "TODO" -CaseSensitive:$false'
      },
      {
        shell: "cmd",
        syntax: 'findstr /S /N /I "TODO" src\\*'
      }
    ],
    risk: "safe",
    riskReason: "Standard non-destructive text grep.",
    parameters: [
      {
        name: "pattern",
        placeholder: "TODO",
        type: "string",
        required: true,
        defaultValue: "TODO",
        description: "Target search string."
      },
      {
        name: "directory",
        placeholder: "./src",
        type: "path",
        required: false,
        defaultValue: "./src",
        description: "Directory path to recursively scan."
      }
    ],
    flags: [
      { flag: "-r", description: "Recursively search subdirectories." },
      { flag: "-n", description: "Prefix each line of output with the 1-based line number." }
    ],
    examples: [
      {
        scenario: "Audit all remaining TODO and FIXME comments in the source directory",
        command: 'grep -rnE "TODO|FIXME" ./src',
        expectedOutcome: "src/utils/auth.js:42: // TODO: add token refresh"
      }
    ],
    tags: ["grep", "search", "line numbers", "recursive", "find text"],
    aliases: [
      "grep recursively with line numbers",
      "search folder for string",
      "findstr in directory"
    ],
    docsUrl: "https://man7.org/linux/man-pages/man1/grep.1.html"
  },
  {
    id: "text-awk-extract-columns",
    title: "Extract specific columns from comma-separated or tabbed output",
    description: "Uses awk to parse delimited rows of data and print chosen field numbers cleanly.",
    syntax: "awk -F',' '{print $1, $3}' data.csv",
    category: "text-processing",
    personas: ["data-science", "backend", "devops"],
    shells: ["bash", "zsh", "git-bash"],
    risk: "safe",
    riskReason: "Stream processing text filter. Prints to standard output.",
    parameters: [
      {
        name: "delimiter",
        placeholder: ",",
        type: "string",
        required: false,
        defaultValue: ",",
        description: "Field separator character."
      },
      {
        name: "columns",
        placeholder: "$1, $3",
        type: "string",
        required: true,
        defaultValue: "$1, $3",
        description: "1-based column indices to extract."
      }
    ],
    flags: [
      { flag: "-F", description: "Specifies the input field separator (delimiter)." }
    ],
    examples: [
      {
        scenario: "Extract usernames and email addresses from a CSV dump",
        command: "awk -F',' '{print $2 \": \" $4}' users.csv",
        expectedOutcome: "Prints formatted 'username: email@domain.com' for each line."
      }
    ],
    tags: ["awk", "extract column", "csv", "delimiter", "text parsing", "data science"],
    aliases: [
      "extract column from csv awk",
      "print first and third column",
      "parse text table with awk"
    ],
    docsUrl: "https://man7.org/linux/man-pages/man1/awk.1p.html"
  },
  {
    id: "text-sed-replace-in-place",
    title: "Find and replace text across a file in-place",
    description: "Performs stream editing to substitute all occurrences of an old pattern with a new string directly within the target file.",
    syntax: "sed -i 's/old_text/new_text/g' file.txt",
    category: "text-processing",
    personas: ["backend", "devops"],
    shells: ["bash", "zsh", "git-bash"],
    shellVariants: [
      {
        shell: "powershell",
        syntax: "(Get-Content file.txt) -replace 'old_text', 'new_text' | Set-Content file.txt"
      }
    ],
    risk: "modifying",
    riskReason: "Modifies the target file directly on disk. Create a backup first if regex is complex.",
    parameters: [
      {
        name: "oldText",
        placeholder: "old_text",
        type: "string",
        required: true,
        description: "Text or regex to match."
      },
      {
        name: "newText",
        placeholder: "new_text",
        type: "string",
        required: true,
        description: "Replacement string."
      },
      {
        name: "targetFile",
        placeholder: "file.txt",
        type: "path",
        required: true,
        description: "Path to file to edit."
      }
    ],
    flags: [
      { flag: "-i", description: "Edit files in place (modifies the file directly)." },
      { flag: "g", description: "Global replacement: replace all matches on each line, not just the first." }
    ],
    examples: [
      {
        scenario: "Replace localhost URL with production domain in an environment template",
        command: "sed -i 's|http://localhost:3000|https://api.production.com|g' .env",
        expectedOutcome: "All instances of localhost URL in .env are updated in-place."
      }
    ],
    tags: ["sed", "find and replace", "substitute", "regex", "in place edit"],
    aliases: [
      "sed find and replace in file",
      "replace string in file bash",
      "replace text in place"
    ],
    docsUrl: "https://man7.org/linux/man-pages/man1/sed.1.html"
  },
  {
    id: "text-sort-count-unique",
    title: "Count and sort unique occurrences in a text file or log",
    description: "Pipes text through sort and uniq to calculate the exact frequency of every distinct line, ordered by highest count.",
    syntax: "sort access.log | uniq -c | sort -nr",
    category: "text-processing",
    personas: ["data-science", "backend", "devops"],
    shells: ["bash", "zsh", "git-bash"],
    shellVariants: [
      {
        shell: "powershell",
        syntax: "Get-Content access.log | Group-Object | Sort-Object Count -Descending | Select-Object Count, Name"
      }
    ],
    risk: "safe",
    riskReason: "Read-only text pipe.",
    parameters: [
      {
        name: "file",
        placeholder: "access.log",
        type: "path",
        required: true,
        defaultValue: "access.log",
        description: "File to analyze."
      }
    ],
    flags: [
      { flag: "uniq -c", description: "Prefix lines by the number of occurrences." },
      { flag: "sort -nr", description: "Sort numerically (-n) in reverse order (-r) to show most frequent on top." }
    ],
    examples: [
      {
        scenario: "Count top IP addresses sending requests in Nginx web access logs",
        command: "awk '{print $1}' access.log | sort | uniq -c | sort -nr | head -n 10",
        expectedOutcome: "Table showing top 10 requesting IP addresses and their hit counts."
      }
    ],
    tags: ["sort", "uniq", "count occurrences", "frequency", "logs", "analytics"],
    aliases: [
      "count duplicate lines",
      "find most frequent lines in file",
      "frequency count bash"
    ],
    docsUrl: "https://man7.org/linux/man-pages/man1/uniq.1.html"
  },
  {
    id: "text-jq-extract-json-fields",
    title: "Parse, filter, and pretty-print JSON with jq",
    description: "Extracts arrays or key-value pairs from complex JSON API responses with jq syntax.",
    syntax: "jq '.users[] | {id: .id, email: .email}' response.json",
    category: "text-processing",
    personas: ["frontend", "backend", "data-science"],
    shells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    risk: "safe",
    riskReason: "Safe stream processor.",
    parameters: [
      {
        name: "filter",
        placeholder: ".users[] | {id: .id, email: .email}",
        type: "string",
        required: true,
        description: "jq projection filter expression."
      }
    ],
    flags: [],
    examples: [
      {
        scenario: "Extract specific fields from curl JSON output directly",
        command: "curl -s https://api.github.com/repos/facebook/react | jq '{name: .name, stars: .stargazers_count}'",
        expectedOutcome: '{\n  "name": "react",\n  "stars": 228000\n}'
      }
    ],
    tags: ["jq", "json", "parse json", "extract fields", "pretty print json"],
    aliases: [
      "parse json in terminal",
      "jq extract values",
      "filter json cli"
    ],
    docsUrl: "https://jqlang.github.io/jq/manual/"
  },
  {
    id: "text-tail-follow-filter-errors",
    title: "Live tail log file filtering for ERRORS and FATAL entries",
    description: "Follows real-time additions to a log file and pipes into grep to show only warning and error entries.",
    syntax: 'tail -f /var/log/app.log | grep -E --color=auto "ERROR|FATAL|Exception"',
    category: "text-processing",
    personas: ["backend", "devops"],
    shells: ["bash", "zsh", "git-bash"],
    shellVariants: [
      {
        shell: "powershell",
        syntax: 'Get-Content -Path app.log -Wait -Tail 20 | Where-Object { $_ -match "ERROR|FATAL|Exception" }'
      }
    ],
    risk: "read-only",
    riskReason: "Continuous streaming read.",
    parameters: [
      {
        name: "logPath",
        placeholder: "/var/log/app.log",
        type: "path",
        required: true,
        defaultValue: "/var/log/app.log",
        description: "Log file path to watch."
      }
    ],
    flags: [
      { flag: "-f", description: "Follow: output appended data as the file grows." },
      { flag: "-E", description: "Interpret pattern as an extended regular expression." }
    ],
    examples: [
      {
        scenario: "Monitor production application log while reproducing a bug in browser",
        command: 'tail -f ./logs/production.log | grep -E "500 Internal|Exception"',
        expectedOutcome: "Terminal remains open and only prints error lines as they happen."
      }
    ],
    tags: ["tail", "tail -f", "follow logs", "monitor", "grep errors", "live stream"],
    aliases: [
      "watch log file for errors",
      "tail -f with grep",
      "live monitor errors in log"
    ],
    docsUrl: "https://man7.org/linux/man-pages/man1/tail.1.html"
  },
  {
    id: "text-transform-case-tr",
    title: "Convert all uppercase text in file to lowercase",
    description: "Fast character translation using tr to normalize file contents or standard input to lowercase.",
    syntax: "tr '[:upper:]' '[:lower:]' < input.txt > output.txt",
    category: "text-processing",
    personas: ["data-science", "backend", "beginner"],
    shells: ["bash", "zsh", "git-bash"],
    shellVariants: [
      {
        shell: "powershell",
        syntax: "(Get-Content input.txt).ToLower() | Set-Content output.txt"
      }
    ],
    risk: "modifying",
    riskReason: "Writes converted text into output.txt.",
    parameters: [
      {
        name: "input",
        placeholder: "input.txt",
        type: "path",
        required: true,
        defaultValue: "input.txt",
        description: "Source file."
      },
      {
        name: "output",
        placeholder: "output.txt",
        type: "path",
        required: true,
        defaultValue: "output.txt",
        description: "Destination file."
      }
    ],
    flags: [],
    examples: [
      {
        scenario: "Normalize messy casing in a list of email addresses before data import",
        command: "tr '[:upper:]' '[:lower:]' < raw_emails.txt > clean_emails.txt",
        expectedOutcome: "Writes new file where all characters are converted to lowercase."
      }
    ],
    tags: ["tr", "lowercase", "uppercase", "transform", "normalize text"],
    aliases: [
      "convert text to lowercase in bash",
      "tr uppercase to lowercase",
      "change text casing"
    ],
    docsUrl: "https://man7.org/linux/man-pages/man1/tr.1.html"
  }
];
