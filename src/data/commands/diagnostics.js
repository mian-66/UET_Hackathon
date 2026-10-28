export const diagnosticCommands = [
  {
    id: "diag-check-port-listener",
    title: "Find which process is listening on a specific port",
    description: "Identifies the command name, Process ID (PID), and user bound to a local TCP/UDP port.",
    syntax: "lsof -i :3000",
    category: "system-diagnostics",
    personas: ["backend", "frontend", "devops"],
    shells: ["bash", "zsh", "git-bash"],
    shellVariants: [
      {
        shell: "powershell",
        syntax: "Get-NetTCPConnection -LocalPort 3000 | Select-Object LocalAddress, LocalPort, OwningProcess, State"
      },
      {
        shell: "cmd",
        syntax: "netstat -ano | findstr :3000"
      }
    ],
    risk: "read-only",
    riskReason: "Inspection only. Queries active kernel network sockets.",
    parameters: [
      {
        name: "port",
        placeholder: "3000",
        type: "port",
        required: true,
        defaultValue: "3000",
        description: "Port number to check."
      }
    ],
    flags: [
      { flag: "-i", description: "Select IPv[46] files matching address/port specification." }
    ],
    examples: [
      {
        scenario: "Find out what application is hogging port 8080",
        command: "lsof -i :8080",
        expectedOutcome: "Outputs COMMAND, PID, USER, FD, TYPE, DEVICE, SIZE/OFF, NODE, NAME (LISTEN)."
      }
    ],
    tags: ["lsof", "port", "network", "pid", "listening", "sockets", "netstat"],
    aliases: [
      "what is using port 3000",
      "find process by port",
      "check who is listening on port",
      "netstat find port"
    ],
    docsUrl: "https://man7.org/linux/man-pages/man8/lsof.8.html"
  },
  {
    id: "diag-top-cpu-processes",
    title: "List top 10 processes consuming the most CPU",
    description: "Queries the process table and sorts all running tasks by CPU percentage in descending order.",
    syntax: "ps aux --sort=-%cpu | head -n 11",
    category: "system-diagnostics",
    personas: ["devops", "backend", "data-science"],
    shells: ["bash", "zsh", "git-bash"],
    shellVariants: [
      {
        shell: "powershell",
        syntax: "Get-Process | Sort-Object CPU -Descending | Select-Object -First 10 Id, ProcessName, CPU, WorkingSet64"
      }
    ],
    risk: "read-only",
    riskReason: "Queries system process stats.",
    parameters: [],
    flags: [
      { flag: "aux", description: "Shows processes for all users (a), with process owner (u), including detached (x)." },
      { flag: "--sort=-%cpu", description: "Sorts descending by CPU consumption." }
    ],
    examples: [
      {
        scenario: "Identify runaway infinite loops heating up your CPU",
        command: "ps aux --sort=-%cpu | head -n 6",
        expectedOutcome: "Table of top 5 CPU hogging processes with PID and %CPU."
      }
    ],
    tags: ["ps", "cpu", "processes", "top", "performance", "high cpu"],
    aliases: [
      "find high cpu processes",
      "which process is using cpu",
      "top cpu processes"
    ],
    docsUrl: "https://man7.org/linux/man-pages/man1/ps.1.html"
  },
  {
    id: "diag-top-memory-processes",
    title: "List top 10 processes consuming the most RAM",
    description: "Queries the process table and sorts all running tasks by resident memory consumption.",
    syntax: "ps aux --sort=-%mem | head -n 11",
    category: "system-diagnostics",
    personas: ["devops", "backend", "data-science"],
    shells: ["bash", "zsh", "git-bash"],
    shellVariants: [
      {
        shell: "powershell",
        syntax: "Get-Process | Sort-Object WorkingSet64 -Descending | Select-Object -First 10 Id, ProcessName, @{Name='RAM_MB';Expression={[math]::Round($_.WorkingSet64 / 1MB, 2)}}"
      }
    ],
    risk: "read-only",
    riskReason: "Queries system memory metrics.",
    parameters: [],
    flags: [
      { flag: "--sort=-%mem", description: "Sorts descending by percentage of physical RAM used." }
    ],
    examples: [
      {
        scenario: "Investigate memory leak or out-of-memory crashes",
        command: "ps aux --sort=-%mem | head -n 6",
        expectedOutcome: "Lists top 5 memory-heavy processes with exact RAM usage."
      }
    ],
    tags: ["ps", "memory", "ram", "leak", "top memory", "oom"],
    aliases: [
      "find processes using most ram",
      "top memory processes",
      "memory leak diagnostic"
    ],
    docsUrl: "https://man7.org/linux/man-pages/man1/ps.1.html"
  },
  {
    id: "diag-disk-free-space",
    title: "Check available disk space on all mounted filesystems",
    description: "Shows total, used, and available disk space in human-readable gigabytes (GB) across root, data, and external partitions.",
    syntax: "df -h",
    category: "system-diagnostics",
    personas: ["beginner", "frontend", "backend", "devops"],
    shells: ["bash", "zsh", "git-bash"],
    shellVariants: [
      {
        shell: "powershell",
        syntax: "Get-PSDrive -PSProvider 'FileSystem' | Select-Object Name, @{Name='UsedGB';Expression={[math]::Round($_.Used / 1GB, 2)}}, @{Name='FreeGB';Expression={[math]::Round($_.Free / 1GB, 2)}}"
      },
      {
        shell: "cmd",
        syntax: "wmic logicaldisk get caption, freespace, size"
      }
    ],
    risk: "safe",
    riskReason: "Pure storage capacity inspection.",
    parameters: [],
    flags: [
      { flag: "-h", description: "Human-readable (sizes in K, M, G)." }
    ],
    examples: [
      {
        scenario: "Verify how many gigabytes remain on root drive before running large builds",
        command: "df -h /",
        expectedOutcome: "Displays Filesystem, Size, Used, Avail, Use%, Mounted on."
      }
    ],
    tags: ["df", "disk space", "storage", "free space", "hard drive"],
    aliases: [
      "how much disk space is left",
      "check free space",
      "view hard drive capacity"
    ],
    docsUrl: "https://man7.org/linux/man-pages/man1/df.1.html"
  },
  {
    id: "diag-system-uptime-load",
    title: "View system uptime and CPU load averages",
    description: "Displays how long the machine has been running without reboot and reports the 1, 5, and 15 minute CPU load averages.",
    syntax: "uptime",
    category: "system-diagnostics",
    personas: ["beginner", "backend", "devops"],
    shells: ["bash", "zsh", "git-bash"],
    shellVariants: [
      {
        shell: "powershell",
        syntax: "(Get-CimInstance -ClassName Win32_OperatingSystem).LastBootUpTime"
      }
    ],
    risk: "safe",
    riskReason: "Read-only system uptime report.",
    parameters: [],
    flags: [],
    examples: [
      {
        scenario: "Check if a server rebooted recently after an outage",
        command: "uptime",
        expectedOutcome: "e.g., '14:20:05 up 42 days, 3:12, 2 users, load average: 0.15, 0.22, 0.18'"
      }
    ],
    tags: ["uptime", "load average", "system load", "server status"],
    aliases: [
      "how long has server been up",
      "check system uptime",
      "view cpu load average"
    ],
    docsUrl: "https://man7.org/linux/man-pages/man1/uptime.1.html"
  },
  {
    id: "diag-fast-dns-lookup",
    title: "Perform fast DNS resolution for a domain",
    description: "Queries DNS nameservers using dig to return just the clean resolved IP address without header clutter.",
    syntax: "dig +short example.com",
    category: "system-diagnostics",
    personas: ["devops", "backend", "frontend"],
    shells: ["bash", "zsh", "git-bash"],
    shellVariants: [
      {
        shell: "powershell",
        syntax: "Resolve-DnsName -Name example.com | Select-Object -Property Name, Type, IPAddress"
      },
      {
        shell: "cmd",
        syntax: "nslookup example.com"
      }
    ],
    risk: "safe",
    riskReason: "DNS network lookup query.",
    parameters: [
      {
        name: "domain",
        placeholder: "example.com",
        type: "string",
        required: true,
        defaultValue: "example.com",
        description: "Target domain name."
      }
    ],
    flags: [
      { flag: "+short", description: "Provides terse answer containing only the resolved IP address." }
    ],
    examples: [
      {
        scenario: "Quickly verify if your domain's A record has propagated",
        command: "dig +short api.github.com",
        expectedOutcome: "Outputs IP address (e.g. 140.82.121.6)."
      }
    ],
    tags: ["dig", "dns", "nslookup", "ip", "resolve", "domain"],
    aliases: [
      "resolve domain ip",
      "check dns record",
      "lookup ip with dig"
    ],
    docsUrl: "https://man7.org/linux/man-pages/man1/dig.1.html"
  },
  {
    id: "diag-test-tcp-port-connection",
    title: "Test if a remote TCP port is open and accepting traffic",
    description: "Uses netcat (nc) with a quick timeout to check if a remote firewall or server is permitting connections on a target port.",
    syntax: "nc -zv -w 3 example.com 443",
    category: "system-diagnostics",
    personas: ["backend", "devops"],
    shells: ["bash", "zsh", "git-bash"],
    shellVariants: [
      {
        shell: "powershell",
        syntax: "Test-NetConnection -ComputerName example.com -Port 443"
      }
    ],
    risk: "read-only",
    riskReason: "Standard TCP connection handshake probe.",
    parameters: [
      {
        name: "host",
        placeholder: "example.com",
        type: "string",
        required: true,
        description: "Target hostname or IP."
      },
      {
        name: "port",
        placeholder: "443",
        type: "port",
        required: true,
        description: "Target TCP port."
      }
    ],
    flags: [
      { flag: "-z", description: "Zero-I/O mode: scan for listening daemons without sending data." },
      { flag: "-v", description: "Verbose: print connection success or failure." },
      { flag: "-w 3", description: "Timeout connection attempt after 3 seconds." }
    ],
    examples: [
      {
        scenario: "Check if PostgreSQL database on remote host is reachable",
        command: "nc -zv -w 3 db.internal 5432",
        expectedOutcome: "Connection to db.internal 5432 port [tcp/postgresql] succeeded!"
      }
    ],
    tags: ["nc", "netcat", "test port", "firewall", "tcp connection", "ping port"],
    aliases: [
      "test if port is open",
      "ping tcp port",
      "test-netconnection powershell"
    ],
    docsUrl: "https://man7.org/linux/man-pages/man1/nc.1.html"
  },
  {
    id: "diag-kill-process-by-pid",
    title: "Force terminate a hanging process by its PID",
    description: "Sends the uncatchable SIGKILL (Signal 9) to immediately stop an unresponsive process.",
    syntax: "kill -9 <PID>",
    category: "system-diagnostics",
    personas: ["backend", "frontend", "devops"],
    shells: ["bash", "zsh", "git-bash"],
    shellVariants: [
      {
        shell: "powershell",
        syntax: "Stop-Process -Id <PID> -Force"
      },
      {
        shell: "cmd",
        syntax: "taskkill /F /PID <PID>"
      }
    ],
    risk: "destructive",
    riskReason: "IMMEDIATE TERMINATION: Process cannot clean up open files, write buffers, or close sockets gracefully. Double check the PID.",
    parameters: [
      {
        name: "pid",
        placeholder: "12345",
        type: "number",
        required: true,
        description: "Target Process ID."
      }
    ],
    flags: [
      { flag: "-9", description: "SIGKILL signal: terminates process immediately without catch or ignore." }
    ],
    examples: [
      {
        scenario: "Kill frozen local dev server that won't respond to Ctrl+C",
        command: "kill -9 4821",
        expectedOutcome: "Process 4821 is immediately removed from the operating system."
      }
    ],
    tags: ["kill", "kill -9", "terminate", "stop process", "sigkill", "taskkill"],
    aliases: [
      "force kill process",
      "stop process by pid",
      "kill hanging program"
    ],
    docsUrl: "https://man7.org/linux/man-pages/man1/kill.1.html"
  }
];
