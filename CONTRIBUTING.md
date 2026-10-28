# Contributing to Pls-CLI

Thank you for your interest in contributing to **Pls-CLI: The Agentic Terminal Executor**! 

Pls-CLI is a 100% client-side, developer-first tool designed to bridge the gap between human natural-language intent and command-line syntax with strict safety guardrails.

---

## 🛠️ Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/pls-cli.git
   cd pls-cli
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local dev server:**
   ```bash
   npm run dev
   ```

4. **Verify production build:**
   ```bash
   npm run build
   ```

---

## 📝 Adding New Command Records

All command records live inside `src/data/commands/`, organized by category:
- `git.js`: Version control workflows (basic to advanced repair)
- `filesystem.js`: Disk usage, find queries, file permissions, sync
- `node.js`: Node, npm, pnpm, yarn workflows
- `diagnostics.js`: Ports, processes, system monitoring, networking
- `text.js`: grep, awk, sed, ripgrep, jq, tr
- `devops.js`: Docker, container orchestration, SSL, curl
- `recipes.js`: Multi-step troubleshooting tasks

### Command Record Template

When adding a new command, adhere strictly to the schema:

```javascript
{
  id: "category-action-slug",                   // Unique kebab-case slug
  title: "Clear plain English description",     // Plain English intent
  description: "Detailed explanation of what the command does and why.",
  syntax: "command --flag <parameter>",         // Canonical POSIX default
  category: "git",                              // One of: git, filesystem, node-pkg, system-diagnostics, text-processing, devops-network, recipes
  personas: ["beginner", "frontend"],           // One or more: beginner, frontend, backend, devops, data-science
  shells: ["bash", "zsh", "powershell", "cmd"], // Supported environments
  shellVariants: [                              // Optional: shell adaptations where syntax differs
    {
      shell: "powershell",
      syntax: "PowerShell-Equivalent-Command"
    }
  ],
  risk: "modifying",                            // One of: safe, read-only, modifying, destructive
  riskReason: "Explanation of risk or cautionary guidance.",
  parameters: [
    {
      name: "paramName",
      placeholder: "example",
      type: "string",                           // string, number, path, branch, port, commit-hash
      required: true,
      defaultValue: "example",
      description: "Parameter explanation."
    }
  ],
  flags: [
    {
      flag: "--flag",
      alias: "-f",
      description: "Flag explanation.",
      isDefault: false
    }
  ],
  examples: [
    {
      scenario: "Real-world context or error reproduction",
      command: "command --flag example",
      expectedOutcome: "Expected terminal output or state change."
    }
  ],
  tags: ["keyword1", "keyword2", "synonym"],
  aliases: [
    "alternative natural language description",
    "common typo or slang"
  ],
  docsUrl: "https://official-documentation-link"
}
```

---

## 🛡️ Risk Classification Guidelines

Please classify the `risk` level accurately:
- **`safe`**: Read-only, non-mutating info commands (`pwd`, `git status`, `uptime`).
- **`read-only`**: Diagnostic commands reading system, port, or process state (`lsof -i`, `df -h`).
- **`modifying`**: State-altering commands that modify files, branches, or dependencies (`git commit`, `npm install`, `mkdir`).
- **`destructive`**: Permanent deletion, history rewriting, or force process killing (`git reset --hard`, `rm -rf`, `kill -9`). Requires explicit `riskReason` warning.

---

## 🚀 Submitting a Pull Request

1. Create a feature branch: `git checkout -b feat/add-kubernetes-commands`
2. Test your changes locally: `npm run build`
3. Commit your changes: `git commit -m "feat(commands): add kubectl diagnostic recipes"`
4. Push to origin and open a Pull Request with a clear description.
