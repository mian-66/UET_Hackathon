# Pls-CLI: The Agentic Terminal Executor ⚡

[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Offline Safe](https://img.shields.io/badge/Security-100%25%20Client--Side-brightgreen.svg)]()

> **Bridge the gap between natural human intent and terminal syntax.**  
> Pls-CLI allows developers, students, and system administrators to discover, understand, and construct command-line workflows by describing their tasks in plain English.

---

## 🎯 Overview & Core Purpose

Modern terminal toolchains (Git, Docker, Linux diagnostics, package managers) require memorizing hundreds of cryptic flags and risk-prone commands. One wrong flag in `git reset` or `rm` can wipe uncommitted work or tear down servers.

**Pls-CLI acts as your intelligent client-side terminal copilot:**
- **Natural Language Intent Matching:** Type what you want to do (e.g. *"undo commit without losing staged code"*, *"free up port 3000"*, *"find files over 100MB"*).
- **Safety-First Guardrails:** Every command is labeled with a strict 4-tier risk classification (`Safe`, `Read-Only`, `Modifying`, `Destructive`) with cautionary recovery notes.
- **Cross-Shell Adaptability:** Seamlessly toggle command syntax between Linux Bash/Zsh, macOS, Windows PowerShell, and Windows CMD.
- **Deep Parameter Breakdown:** Inspect tokens, default values, flag options, and realistic output expectations before copying.

> 🔒 **Security & Execution Boundary:**  
> Pls-CLI is a 100% client-side web application. It acts as an interactive assistant, command translator, and reference tool. It **never** executes arbitrary shell commands on your host system and requires zero backend APIs or network access.

---

## ✨ Key Features

### 1. 🔍 Fast Deterministic Fuzzy Search
- Powered by client-side **Fuse.js** with Bitap fuzzy algorithms.
- Multi-tiered weighted scoring: Intent titles ($0.35$), Natural-language aliases ($0.20$), Syntax ($0.20$), and Tags ($0.15$).
- Forgiving of typos (e.g., *"comit"*, *"direcotry"*).

### 2. 📚 58+ Curated & Validated Command Records
Comprehensive coverage across 7 high-impact domains:
- **Git Workflows & Repair:** Soft/hard undos, branch renaming, cherry-picking, stash with untracked, graph logs, and published commit rollbacks.
- **Filesystem & Storage:** Recursive size queries, human-readable directory usage, 24h modified searches, 755/644 permission hardening, rsync, and tree inspection.
- **Node.js & Package Managers:** Integrity cache wipes, global module auditing, clean lockfile CI installs, dev server port killers, and interactive dependency upgrades.
- **Diagnostics & Monitoring:** Port listener lookups (`lsof`/`netstat`), top CPU/RAM processes, free disk metrics, uptime load averages, and fast DNS lookups.
- **Text Processing & Pipelines:** Multithreaded `ripgrep`, recursive `grep` with line numbers, `awk` column extractions, in-place `sed` substitutions, `sort | uniq -c`, and `jq` JSON transforms.
- **DevOps, Docker & Networking:** Container mass-stoppage, system prune reclaims, curl header inspection, Ed25519 SSH generation, and SSL expiry probes.
- **Troubleshooting Recipes:** Multi-step fixes for detached HEADs, broken `node_modules`, hung dev ports, and HTTPS-to-SSH remote migrations.

### 3. 🛡️ Standardized Safety Taxonomy
| Tier | Badge Color | Definition | Example Commands |
| :--- | :--- | :--- | :--- |
| **`Safe`** | Emerald | Non-mutating, zero side effects. Safe to run repeatedly. | `pwd`, `git status`, `uptime` |
| **`Read-Only`** | Sky Blue | Diagnostic inspection of system, disk, or network sockets. | `lsof -i :3000`, `df -h` |
| **`Modifying`** | Amber | Alters files, branches, or dependencies. Standard developer tasks. | `git checkout -b`, `npm install` |
| **`Destructive`** | Rose / Red | Permanent deletion, history rewriting, or force process killing. | `git reset --hard`, `kill -9` |

### 4. 🎛️ Multi-Dimensional Filtering
- **User Personas:** Beginner, Frontend, Backend, DevOps / SRE, Data Science.
- **Shell Environments:** Linux (Bash/Zsh), macOS (Zsh), Windows PowerShell, Windows CMD, Git Bash.
- **Domain Categories:** 7 modular categories + Favorites & History tabs.

### 5. 💾 Offline-First Local Persistence
- **Favorites / Bookmarking:** Pin essential workflows to `localStorage`.
- **Recently Copied History:** Tracks timestamped history of copied commands with 1-click re-copy.
- **Zero Remote Dependencies:** Zero tracking, zero telemetry, zero servers.

### 6. ⌨️ Developer-First Keyboard Shortcuts
- `/` or `Ctrl + K`: Quick-focus the natural language search bar.
- `Esc`: Clear search query or dismiss modals.
- `Click Anywhere`: Instantly copy command syntax to clipboard with animated toast notification.

---

## 🚀 Quickstart & Local Development

### Prerequisites
- Node.js `v18+` (tested on Node `v22.13`)
- npm `v9+`

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/pls-cli.git
cd pls-cli

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 🌐 One-Click Deployment to Vercel

Pls-CLI is pre-configured with `vercel.json` for immediate static deployment:

1. Push your repository to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. The build command `npm run build` and output directory `dist` will be auto-detected.
4. Deploy!

---

## 📂 Project Architecture

```
pls-cli/
├── src/
│   ├── components/
│   │   ├── common/         # Badges, Toasts, Shortcuts modal
│   │   ├── layout/         # Header, Footer, MainLayout
│   │   ├── search/         # SearchBar, FilterBar, ActiveFilters
│   │   └── command/        # CommandCard, CommandGrid, CommandModal, SyntaxBlock
│   ├── data/
│   │   └── commands/       # Modular category datasets (58+ records)
│   ├── hooks/              # useCommandSearch, useLocalStorage, useClipboard, useKeyboardShortcuts
│   ├── types/              # command.d.ts, commandSchema.json
│   ├── utils/              # searchEngine (Fuse.js), riskClassification, shellFormatter
│   ├── App.jsx             # Main application orchestrator
│   └── index.css           # Tailwind base + custom terminal scrollbars
├── vercel.json             # Vercel SPA deployment config
└── vite.config.js          # Fast Vite configuration
```

---

## 🤝 Contributing

Contributions are welcomed! Read [CONTRIBUTING.md](CONTRIBUTING.md) to learn how to add new commands or suggest features.

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for details.
