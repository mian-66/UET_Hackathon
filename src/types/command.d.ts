export type RiskLevel = 'safe' | 'read-only' | 'modifying' | 'destructive';

export type UserPersona = 'beginner' | 'frontend' | 'backend' | 'devops' | 'data-science';

export type ShellEnvironment = 'bash' | 'zsh' | 'powershell' | 'cmd' | 'git-bash';

export type CommandCategory = 
  | 'git' 
  | 'filesystem' 
  | 'node-pkg' 
  | 'system-diagnostics' 
  | 'text-processing' 
  | 'devops-network' 
  | 'recipes';

export interface CommandParameter {
  name: string;
  placeholder: string;
  type: 'string' | 'number' | 'path' | 'branch' | 'port' | 'commit-hash';
  required: boolean;
  defaultValue?: string;
  description: string;
}

export interface CommandFlag {
  flag: string;
  alias?: string;
  description: string;
  isDefault?: boolean;
}

export interface CommandExample {
  scenario: string;
  command: string;
  expectedOutcome: string;
}

export interface ShellVariant {
  shell: ShellEnvironment;
  syntax: string;
  notes?: string;
}

export interface CommandRecord {
  id: string;
  title: string;
  description: string;
  syntax: string;
  category: CommandCategory;
  personas: UserPersona[];
  shells: ShellEnvironment[];
  shellVariants?: ShellVariant[];
  risk: RiskLevel;
  riskReason: string;
  parameters: CommandParameter[];
  flags: CommandFlag[];
  examples: CommandExample[];
  tags: string[];
  aliases: string[];
  docsUrl?: string;
}

