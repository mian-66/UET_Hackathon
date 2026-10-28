export const nodeCommands = [
  {
    id: "node-clean-npm-cache-force",
    title: "Force clean corrupted npm cache",
    description: "Clears out the local npm cache directory to resolve corrupted download packages or SHA-512 integrity errors.",
    syntax: "npm cache clean --force",
    category: "node-pkg",
    personas: ["beginner", "frontend", "backend"],
    shells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    risk: "modifying",
    riskReason: "Wipes cached tarballs. Next installs will re-download packages from registry over the network.",
    parameters: [],
    flags: [
      { flag: "--force", description: "Bypasses npm's built-in safeguard preventing accidental cache clearance." }
    ],
    examples: [
      {
        scenario: "Fix npm ERR! integrity checksum failed during npm install",
        command: "npm cache clean --force",
        expectedOutcome: "Outputs 'npm WARN using --force I sure hope you know what you are doing' and empties cache."
      }
    ],
    tags: ["npm", "cache", "integrity error", "clean", "fix install"],
    aliases: [
      "clear npm cache",
      "fix npm integrity checksum error",
      "purge npm cache"
    ],
    docsUrl: "https://docs.npmjs.com/cli/v10/commands/npm-cache"
  },
  {
    id: "node-list-global-packages",
    title: "List top-level globally installed npm packages",
    description: "Inspects which CLI tools, frameworks, and packages are installed globally on your machine without cluttering sub-dependencies.",
    syntax: "npm list -g --depth=0",
    category: "node-pkg",
    personas: ["beginner", "frontend", "backend", "devops"],
    shells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    risk: "safe",
    riskReason: "Read-only inspection.",
    parameters: [],
    flags: [
      { flag: "-g", description: "Query global directory instead of current project." },
      { flag: "--depth=0", description: "Show only top-level packages, hiding transitive dependencies." }
    ],
    examples: [
      {
        scenario: "Check versions of globally installed tools like nodemon, yarn, or pnpm",
        command: "npm list -g --depth=0",
        expectedOutcome: "Prints tree showing only your root global packages."
      }
    ],
    tags: ["npm", "global", "list", "packages", "cli"],
    aliases: [
      "show global npm packages",
      "what npm packages are installed globally",
      "list global node modules"
    ],
    docsUrl: "https://docs.npmjs.com/cli/v10/commands/npm-ls"
  },
  {
    id: "node-clean-install-ci",
    title: "Perform deterministic clean install using lockfile",
    description: "Deletes existing node_modules and installs exact dependencies defined in package-lock.json without modifying the lockfile.",
    syntax: "npm ci",
    category: "node-pkg",
    personas: ["frontend", "backend", "devops"],
    shells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    risk: "modifying",
    riskReason: "Wipes current node_modules folder before installing exact lockfile versions.",
    parameters: [],
    flags: [],
    examples: [
      {
        scenario: "Standard command for CI/CD pipelines (GitHub Actions, Docker) to guarantee reproducible builds",
        command: "npm ci",
        expectedOutcome: "Installs exact tree in 2-3x faster time than regular npm install."
      }
    ],
    tags: ["npm", "ci", "clean install", "package-lock", "reproducible", "github actions"],
    aliases: [
      "install exact lockfile dependencies",
      "npm clean install",
      "reproducible npm build"
    ],
    docsUrl: "https://docs.npmjs.com/cli/v10/commands/npm-ci"
  },
  {
    id: "node-kill-dev-server-port",
    title: "Kill process occupying local development port",
    description: "Locates and immediately frees up ports commonly used by React, Vite, Next.js, or Express (e.g. 3000, 5173, 8080).",
    syntax: "npx kill-port 3000",
    category: "node-pkg",
    personas: ["beginner", "frontend", "backend"],
    shells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    risk: "modifying",
    riskReason: "Terminates the process currently bound to the specified port.",
    parameters: [
      {
        name: "port",
        placeholder: "3000",
        type: "port",
        required: true,
        defaultValue: "3000",
        description: "Port number to free up."
      }
    ],
    flags: [],
    examples: [
      {
        scenario: "Fix 'Port 3000 is already in use' error when starting a dev server",
        command: "npx kill-port 3000",
        expectedOutcome: "Kills hung node process; port becomes available immediately."
      }
    ],
    tags: ["kill port", "port 3000", "port in use", "npx", "dev server", "stuck port"],
    aliases: [
      "kill port 3000",
      "port already in use fix",
      "free up port 5173",
      "stop hung node dev server"
    ],
    docsUrl: "https://www.npmjs.com/package/kill-port"
  },
  {
    id: "node-update-interactive-ncu",
    title: "Upgrade package.json dependencies interactively with NCU",
    description: "Analyzes package.json against npm registry and launches an interactive checkbox CLI to choose which packages to update.",
    syntax: "npx npm-check-updates -i",
    category: "node-pkg",
    personas: ["frontend", "backend"],
    shells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    risk: "modifying",
    riskReason: "Edits package.json with newer versions (including major breaking versions if chosen).",
    parameters: [],
    flags: [
      { flag: "-i", alias: "--interactive", description: "Interactive mode: select packages with spacebar." }
    ],
    examples: [
      {
        scenario: "Selectively bump dependencies to latest versions",
        command: "npx npm-check-updates -i",
        expectedOutcome: "Opens interactive menu showing current vs target versions."
      }
    ],
    tags: ["ncu", "dependencies", "upgrade", "update", "npm", "outdated"],
    aliases: [
      "update all packages interactively",
      "upgrade package.json versions",
      "ncu interactive"
    ],
    docsUrl: "https://www.npmjs.com/package/npm-check-updates"
  },
  {
    id: "node-run-script-with-args",
    title: "Pass custom CLI arguments to an npm run script",
    description: "Uses the special `--` separator to forward flags and parameters directly to the underlying script or binary.",
    syntax: "npm run test -- --watch --coverage",
    category: "node-pkg",
    personas: ["beginner", "frontend", "backend"],
    shells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    risk: "safe",
    riskReason: "Executes configured project script with forwarded arguments.",
    parameters: [
      {
        name: "script",
        placeholder: "test",
        type: "string",
        required: true,
        defaultValue: "test",
        description: "Name of the script in package.json."
      },
      {
        name: "args",
        placeholder: "--watch",
        type: "string",
        required: true,
        description: "Arguments to pass to the script."
      }
    ],
    flags: [
      { flag: "--", description: "Tells npm to stop parsing options and forward all subsequent flags." }
    ],
    examples: [
      {
        scenario: "Run Jest or Vitest test suite in watch mode without editing package.json",
        command: "npm run test -- -u",
        expectedOutcome: "Forwards -u (update snapshots) flag directly to test runner."
      }
    ],
    tags: ["npm", "npm run", "args", "flags", "forward arguments", "scripts"],
    aliases: [
      "pass flags to npm run",
      "npm test with arguments",
      "forward options in npm script"
    ],
    docsUrl: "https://docs.npmjs.com/cli/v10/commands/npm-run-script"
  },
  {
    id: "node-audit-fix-safe",
    title: "Automatically fix security vulnerabilities safely",
    description: "Updates vulnerable packages only within compatible semver ranges, avoiding breaking changes.",
    syntax: "npm audit fix",
    category: "node-pkg",
    personas: ["frontend", "backend", "devops"],
    shells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    risk: "modifying",
    riskReason: "Upgrades minor and patch versions of dependencies in package-lock.json.",
    parameters: [],
    flags: [],
    examples: [
      {
        scenario: "Resolve low and moderate security alerts flagged by npm audit",
        command: "npm audit fix",
        expectedOutcome: "Updates compatible packages and regenerates lockfile."
      }
    ],
    tags: ["npm", "audit", "security", "vulnerabilities", "cve"],
    aliases: [
      "fix npm security vulnerabilities",
      "npm audit repair",
      "patch vulnerable packages"
    ],
    docsUrl: "https://docs.npmjs.com/cli/v10/commands/npm-audit"
  },
  {
    id: "node-check-runtime-engines",
    title: "Inspect Node.js runtime and engine versions",
    description: "Evaluates the active Node environment and prints exact version strings for Node, V8 engine, and OpenSSL.",
    syntax: "node -e 'console.log(process.versions)'",
    category: "node-pkg",
    personas: ["backend", "devops", "beginner"],
    shells: ["bash", "zsh", "powershell", "git-bash"],
    shellVariants: [
      {
        shell: "cmd",
        syntax: "node -e \"console.log(process.versions)\""
      }
    ],
    risk: "safe",
    riskReason: "Read-only process environment query.",
    parameters: [],
    flags: [
      { flag: "-e", description: "Evaluate inline JavaScript expression directly." }
    ],
    examples: [
      {
        scenario: "Verify exact V8 engine and OpenSSL versions before deploying crypto services",
        command: "node -e 'console.log(process.versions)'",
        expectedOutcome: "Outputs JSON object with node, v8, uv, zlib, openssl, modules versions."
      }
    ],
    tags: ["node", "v8", "versions", "openssl", "runtime"],
    aliases: [
      "check node v8 version",
      "print node runtime versions",
      "view node process versions"
    ],
    docsUrl: "https://nodejs.org/api/process.html#processversions"
  }
];
