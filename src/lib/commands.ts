export interface Command {
  cmd: string;
  description: string;
  category: CommandCategory;
  args?: string;
}

export type CommandCategory =
  | 'Process'
  | 'Artefacts'
  | 'Pre-Sales'
  | 'Workshop'
  | 'Specification'
  | 'Configuration'
  | 'WRICEF'
  | 'Testing'
  | 'Cutover'
  | 'Training'
  | 'AMS'
  | 'Workflow';

export const COMMANDS: Command[] = [
  // Process management
  { cmd: '/define-process', description: 'Define a new EWM process and save to registry', category: 'Process' },
  { cmd: '/list-processes', description: 'List all defined processes', category: 'Process' },
  { cmd: '/edit-process', description: 'Edit an existing process definition', category: 'Process', args: '[name]' },
  { cmd: '/delete-process', description: 'Remove a process from the registry', category: 'Process', args: '[name]' },

  // Artefact management
  { cmd: '/artefacts', description: 'List all saved artefacts', category: 'Artefacts' },
  { cmd: '/show', description: 'Display a saved artefact', category: 'Artefacts', args: '[artefact-id]' },
  { cmd: '/link', description: 'Link an artefact to a process', category: 'Artefacts', args: '[artefact-id] [process-name]' },

  // Pre-sales
  { cmd: '/rfp', description: 'Write a full RFP response', category: 'Pre-Sales', args: '[client] [industry]' },
  { cmd: '/estimate', description: 'Produce a detailed effort estimate', category: 'Pre-Sales', args: '[scope description]' },
  { cmd: '/demo-script', description: 'Create a story-driven demo script', category: 'Pre-Sales', args: '[client] [industry] [pain points]' },
  { cmd: '/solution-narrative', description: 'Draft the why-SAP-EWM / why-us narrative', category: 'Pre-Sales', args: '[client] [industry] [challenges]' },

  // Workshop
  { cmd: '/workshop-prep', description: 'Generate a complete workshop package', category: 'Workshop', args: '[process area] [duration]' },
  { cmd: '/minutes', description: 'Convert raw notes into professional workshop minutes', category: 'Workshop', args: '[topic] [date]' },
  { cmd: '/gap-analysis', description: 'Classify requirements by EWM standard vs custom dev', category: 'Workshop', args: '[ewm-version]' },
  { cmd: '/process-flow', description: 'Generate a Mermaid flowchart with swimlanes', category: 'Workshop', args: '[process name]' },

  // Specification
  { cmd: '/fs', description: 'Write a complete Functional Specification', category: 'Specification', args: '[title]' },
  { cmd: '/ts', description: 'Write a complete Technical Specification', category: 'Specification', args: '[fs-reference]' },

  // Configuration
  { cmd: '/config-guide', description: 'Step-by-step configuration guide with IMG paths', category: 'Configuration', args: '[topic] [ewm-version]' },
  { cmd: '/config-workbook', description: 'Full configuration workbook for a warehouse', category: 'Configuration', args: '[warehouse number and name]' },
  { cmd: '/config-check', description: 'Review config decisions for errors and gaps', category: 'Configuration' },

  // WRICEF
  { cmd: '/badi', description: 'Generate production-quality BAdI ABAP code', category: 'WRICEF', args: '[badi-name] [requirement]' },
  { cmd: '/report', description: 'Generate a complete ABAP ALV report', category: 'WRICEF', args: '[name] [purpose]' },
  { cmd: '/interface', description: 'Generate interface code (IDoc / BAPI / REST / RFC)', category: 'WRICEF', args: '[type] [description]' },
  { cmd: '/code-review', description: 'Structured review of ABAP code', category: 'WRICEF' },
  { cmd: '/ppf', description: 'Generate PPF action definition and ABAP method', category: 'WRICEF', args: '[action name] [trigger] [output]' },

  // Testing
  { cmd: '/test-scripts', description: 'Generate comprehensive test scripts', category: 'Testing', args: '[process or feature]' },
  { cmd: '/uat-package', description: 'Create role-based UAT package in plain language', category: 'Testing', args: '[business role]' },
  { cmd: '/triage', description: 'Diagnose a defect with root cause and fix approach', category: 'Testing' },
  { cmd: '/regression', description: 'Recommend minimum regression test scope', category: 'Testing', args: '[changes made]' },

  // Cutover
  { cmd: '/runbook', description: 'Generate a detailed cutover runbook', category: 'Cutover', args: '[warehouse name] [go-live date]' },
  { cmd: '/go-nogo', description: 'Generate a Go/No-Go readiness checklist', category: 'Cutover', args: '[project name]' },
  { cmd: '/data-quality', description: 'Define migration data validation rules', category: 'Cutover', args: '[data object type]' },

  // Training & Go-Live
  { cmd: '/training', description: 'Create role-specific training material', category: 'Training', args: '[role] [format]' },
  { cmd: '/release-notes', description: 'Create release notes for any audience', category: 'Training', args: '[release name] [audience]' },

  // AMS
  { cmd: '/incident', description: 'Triage and classify an AMS incident', category: 'AMS' },
  { cmd: '/knowledge-article', description: 'Create a reusable knowledge base article', category: 'AMS' },
  { cmd: '/compliance', description: 'Compliance gap analysis (FDA / EU GMP / ISO)', category: 'AMS', args: '[regulation] [process]' },
  { cmd: '/upgrade', description: 'Upgrade impact and clean core assessment', category: 'AMS', args: '[current version] [target version]' },

  // Chained workflows
  { cmd: '/chain-blueprint', description: 'Full discovery chain: workshop → minutes → gap → FS', category: 'Workflow', args: '[process area]' },
  { cmd: '/chain-build', description: 'Full build chain: TS → code → test scripts', category: 'Workflow', args: '[fs title or artefact id]' },
  { cmd: '/chain-go-live', description: 'Go-live chain: runbook → go/no-go → training → notes', category: 'Workflow', args: '[project name]' },
];

export const COMMAND_CATEGORIES: CommandCategory[] = [
  'Process',
  'Artefacts',
  'Pre-Sales',
  'Workshop',
  'Specification',
  'Configuration',
  'WRICEF',
  'Testing',
  'Cutover',
  'Training',
  'AMS',
  'Workflow',
];
