export const devopsCommands = [
  {
    id: "devops-stop-all-containers",
    title: "Stop all currently running Docker containers",
    description: "Queries all active container IDs and gracefully terminates them in parallel.",
    syntax: "docker stop $(docker ps -q)",
    category: "devops-network",
    personas: ["devops", "backend"],
    shells: ["bash", "zsh", "git-bash"],
    shellVariants: [
      {
        shell: "powershell",
        syntax: "docker ps -q | ForEach-Object { docker stop $_ }"
      },
      {
        shell: "cmd",
        syntax: "FOR /f \"tokens=*\" %i IN ('docker ps -q') DO docker stop %i"
      }
    ],
    risk: "modifying",
    riskReason: "Terminates running containers. Active requests or transactions will be interrupted.",
    parameters: [],
    flags: [
      { flag: "-q", description: "Quiet: only display numeric container IDs." }
    ],
    examples: [
      {
        scenario: "Halt all background databases and microservices before laptop sleep",
        command: "docker stop $(docker ps -q)",
        expectedOutcome: "Outputs stopped container IDs one by one."
      }
    ],
    tags: ["docker", "containers", "stop all", "devops", "cleanup"],
    aliases: [
      "stop all docker containers",
      "kill all running containers",
      "docker stop everything"
    ],
    docsUrl: "https://docs.docker.com/engine/reference/commandline/stop/"
  },
  {
    id: "devops-purge-docker-cache",
    title: "Completely purge unused Docker images, containers, and volumes",
    description: "Reclaims tens of gigabytes of disk space by deleting all stopped containers, untagged images, build caches, and unattached volumes.",
    syntax: "docker system prune -af --volumes",
    category: "devops-network",
    personas: ["devops", "backend"],
    shells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    risk: "destructive",
    riskReason: "PERMANENT DELETION: Wipes all stopped containers, untagged images, and unused volumes. Ensure database volumes have backups.",
    parameters: [],
    flags: [
      { flag: "-a", alias: "--all", description: "Remove all unused images, not just dangling ones." },
      { flag: "-f", alias: "--force", description: "Do not prompt for confirmation." },
      { flag: "--volumes", description: "Prune all unused anonymous and unattached named volumes." }
    ],
    examples: [
      {
        scenario: "Docker disk usage is at 95% and builds are failing due to 'no space left on device'",
        command: "docker system prune -af --volumes",
        expectedOutcome: "Total reclaimed space: 34.5GB"
      }
    ],
    tags: ["docker", "prune", "disk space", "clean docker", "volumes", "images"],
    aliases: [
      "clean up all docker data",
      "docker clean disk space",
      "purge all docker containers and images"
    ],
    docsUrl: "https://docs.docker.com/engine/reference/commandline/system_prune/"
  },
  {
    id: "devops-check-http-headers",
    title: "Inspect HTTP response status, headers, and redirects",
    description: "Sends a HEAD request via curl to view status code, CORS headers, caching directives, and redirect chains.",
    syntax: "curl -IL -s https://example.com",
    category: "devops-network",
    personas: ["frontend", "backend", "devops"],
    shells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    risk: "safe",
    riskReason: "Standard HTTP HEAD request probe.",
    parameters: [
      {
        name: "url",
        placeholder: "https://example.com",
        type: "string",
        required: true,
        defaultValue: "https://example.com",
        description: "Target URL to inspect."
      }
    ],
    flags: [
      { flag: "-I", alias: "--head", description: "Fetch HTTP headers only (no body content)." },
      { flag: "-L", alias: "--location", description: "Follow HTTP 301/302 redirects to destination." },
      { flag: "-s", alias: "--silent", description: "Silent mode (hides progress meter)." }
    ],
    examples: [
      {
        scenario: "Verify Cloudflare SSL redirect, gzip headers, and status code (200 OK)",
        command: "curl -IL -s https://api.github.com",
        expectedOutcome: "HTTP/2 200\nserver: GitHub.com\ncontent-type: application/json..."
      }
    ],
    tags: ["curl", "http headers", "status code", "cors", "redirect", "head request"],
    aliases: [
      "check http status code curl",
      "view response headers",
      "curl head request"
    ],
    docsUrl: "https://curl.se/docs/manpage.html"
  },
  {
    id: "devops-generate-ed25519-ssh-key",
    title: "Generate modern secure Ed25519 SSH keypair",
    description: "Creates an elliptic curve Ed25519 SSH private/public keypair, recommended over legacy RSA by GitHub and GitLab.",
    syntax: 'ssh-keygen -t ed25519 -C "your_email@example.com"',
    category: "devops-network",
    personas: ["beginner", "frontend", "backend", "devops"],
    shells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    risk: "modifying",
    riskReason: "Writes new key files to ~/.ssh/id_ed25519. Will prompt before overwriting existing keys.",
    parameters: [
      {
        name: "email",
        placeholder: "your_email@example.com",
        type: "string",
        required: true,
        defaultValue: "your_email@example.com",
        description: "Comment label attached to public key for identification."
      }
    ],
    flags: [
      { flag: "-t ed25519", description: "Specifies the Ed25519 elliptic curve signature algorithm." },
      { flag: "-C", description: "Appends a descriptive comment to the key." }
    ],
    examples: [
      {
        scenario: "Set up SSH authentication for a new GitHub or GitLab account",
        command: 'ssh-keygen -t ed25519 -C "developer@company.com"',
        expectedOutcome: "Generates ~/.ssh/id_ed25519 and ~/.ssh/id_ed25519.pub with key fingerprint."
      }
    ],
    tags: ["ssh", "ssh-keygen", "ed25519", "github key", "security", "credentials"],
    aliases: [
      "create new ssh key",
      "generate github ssh key",
      "ssh keygen ed25519"
    ],
    docsUrl: "https://www.openssh.com/manual.html"
  },
  {
    id: "devops-check-ssl-cert-expiry",
    title: "Check SSL certificate expiration date and issuer",
    description: "Connects using OpenSSL TLS handshake and prints certificate validity dates without opening a browser.",
    syntax: "openssl s_client -connect example.com:443 -servername example.com 2>/dev/null | openssl x509 -noout -dates -issuer",
    category: "devops-network",
    personas: ["devops", "backend"],
    shells: ["bash", "zsh", "git-bash"],
    risk: "safe",
    riskReason: "TLS handshake query.",
    parameters: [
      {
        name: "domain",
        placeholder: "example.com",
        type: "string",
        required: true,
        defaultValue: "example.com",
        description: "Domain to check."
      }
    ],
    flags: [
      { flag: "-servername", description: "Enables SNI (Server Name Indication)." },
      { flag: "-dates", description: "Prints notBefore and notAfter certificate validity dates." }
    ],
    examples: [
      {
        scenario: "Verify how many days remain before Let's Encrypt certificate renews",
        command: "openssl s_client -connect github.com:443 -servername github.com 2>/dev/null | openssl x509 -noout -dates",
        expectedOutcome: "notBefore=Mar 15 00:00:00 2024 GMT\nnotAfter=Mar 15 23:59:59 2025 GMT"
      }
    ],
    tags: ["ssl", "tls", "certificate", "expiry", "openssl", "https"],
    aliases: [
      "check ssl certificate expiry date",
      "verify https certificate openssl",
      "when does ssl expire"
    ],
    docsUrl: "https://www.openssl.org/docs/manmaster/man1/openssl-s_client.html"
  },
  {
    id: "devops-rebuild-docker-compose-fresh",
    title: "Rebuild and restart Docker Compose containers without cache",
    description: "Forces Docker Compose to rebuild container images from scratch and restart services in detached background mode.",
    syntax: "docker compose up -d --build --force-recreate",
    category: "devops-network",
    personas: ["backend", "devops", "frontend"],
    shells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    risk: "modifying",
    riskReason: "Recreates containers and rebuilds images. Transient service downtime during restart.",
    parameters: [],
    flags: [
      { flag: "-d", alias: "--detach", description: "Runs containers in the background and prints new container names." },
      { flag: "--build", description: "Rebuilds images before starting containers." },
      { flag: "--force-recreate", description: "Recreates containers even if their configuration hasn't changed." }
    ],
    examples: [
      {
        scenario: "Updated Dockerfile or package.json dependencies and need fresh containers",
        command: "docker compose up -d --build --force-recreate",
        expectedOutcome: "Builds fresh image layers and starts containers."
      }
    ],
    tags: ["docker", "docker compose", "rebuild", "force recreate", "detach"],
    aliases: [
      "rebuild docker compose",
      "docker compose up without cache",
      "restart docker compose fresh"
    ],
    docsUrl: "https://docs.docker.com/compose/reference/up/"
  },
  {
    id: "devops-list-all-containers",
    title: "List all Docker containers with status, ports, and names",
    description: "Displays a formatted table of all containers, including exited, stopped, and running instances.",
    syntax: "docker ps -a",
    category: "devops-network",
    personas: ["beginner", "backend", "devops"],
    shells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    risk: "safe",
    riskReason: "Read-only inspection.",
    parameters: [],
    flags: [
      { flag: "-a", alias: "--all", description: "Show all containers (default shows just running)." }
    ],
    examples: [
      {
        scenario: "Check if your database or redis container exited with an error code",
        command: "docker ps -a",
        expectedOutcome: "CONTAINER ID   IMAGE     COMMAND    CREATED    STATUS    PORTS    NAMES"
      }
    ],
    tags: ["docker", "docker ps", "containers", "list containers", "status"],
    aliases: [
      "view all docker containers",
      "list stopped docker containers",
      "docker ps all"
    ],
    docsUrl: "https://docs.docker.com/engine/reference/commandline/ps/"
  },
  {
    id: "devops-view-container-logs",
    title: "Follow live Docker container logs with timestamps",
    description: "Streams stdout and stderr output from a container in real-time, prefixed by ISO timestamps.",
    syntax: "docker logs -f --tail 100 -t <container-id>",
    category: "devops-network",
    personas: ["devops", "backend"],
    shells: ["bash", "zsh", "powershell", "cmd", "git-bash"],
    risk: "read-only",
    riskReason: "Continuous read-only log stream.",
    parameters: [
      {
        name: "containerId",
        placeholder: "web-api",
        type: "string",
        required: true,
        description: "Container name or ID."
      }
    ],
    flags: [
      { flag: "-f", alias: "--follow", description: "Follow log output continuously." },
      { flag: "--tail 100", description: "Number of lines to show from the end of the logs." },
      { flag: "-t", alias: "--timestamps", description: "Show timestamps." }
    ],
    examples: [
      {
        scenario: "Debug database connection failure inside a running postgres container",
        command: "docker logs -f --tail 50 -t postgres-db",
        expectedOutcome: "Streams database log lines with precise timestamps."
      }
    ],
    tags: ["docker", "logs", "container logs", "tail logs", "debug docker"],
    aliases: [
      "view docker container logs",
      "docker logs follow",
      "stream container output"
    ],
    docsUrl: "https://docs.docker.com/engine/reference/commandline/logs/"
  }
];

