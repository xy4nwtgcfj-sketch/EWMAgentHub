export interface AgentDef {
  cmd: string;
  name: string;
  description: string;
}

export interface CategoryDef {
  label: string;
  icon: string;
  color: string; // Tailwind text-* colour for the icon
  agents: AgentDef[];
}

export const AGENT_CATEGORIES: CategoryDef[] = [
  {
    label: 'Pre-Sales & Proposals',
    icon: '💼',
    color: 'text-emerald-600',
    agents: [
      {
        cmd: '/rfp',
        name: 'RFP Response Drafter',
        description: 'Drafts a structured proposal response from an RFP document.',
      },
      {
        cmd: '/estimate',
        name: 'Scoping & Effort Estimator',
        description: 'Produces an effort estimate by role from a scope description.',
      },
      {
        cmd: '/demo-script',
        name: 'Demo Script Generator',
        description: 'Creates a tailored EWM demo script for a prospect.',
      },
    ],
  },
  {
    label: 'Workshops & Specifications',
    icon: '📋',
    color: 'text-amber-600',
    agents: [
      {
        cmd: '/workshop-prep',
        name: 'Workshop Planner',
        description:
          'Generates a timed agenda, 20+ discovery questions, and pre-work for a workshop.',
      },
      {
        cmd: '/minutes',
        name: 'Minutes Writer',
        description:
          'Converts raw notes into structured minutes with decisions, actions, and next steps.',
      },
      {
        cmd: '/gap-analysis',
        name: 'Gap Analyser',
        description:
          'Classifies requirements as standard EWM, config-only, BAdI, custom dev, or not feasible.',
      },
      {
        cmd: '/process-flow',
        name: 'Process Flow Diagrammer',
        description:
          'Generates a Mermaid swimlane flowchart with actors, decisions, and exception paths.',
      },
      {
        cmd: '/fs',
        name: 'Functional Spec Writer',
        description:
          'Writes a complete FS-00N with numbered requirements, auth concept, and sign-off section.',
      },
    ],
  },
  {
    label: 'Architecture & Design',
    icon: '🏗️',
    color: 'text-blue-600',
    agents: [
      {
        cmd: '/ts',
        name: 'Technical Spec Writer',
        description:
          'Writes a TS with ABAP object list, real EWM table names, BAdI points, and transport strategy.',
      },
      {
        cmd: '/solution-narrative',
        name: 'Solution Narrative',
        description:
          'Drafts a credible why-SAP-EWM / why-us narrative — no generic marketing language.',
      },
    ],
  },
  {
    label: 'System Configuration',
    icon: '🔧',
    color: 'text-cyan-600',
    agents: [
      {
        cmd: '/config-guide',
        name: 'Config Guide',
        description: 'Step-by-step IMG guide with exact paths, t-codes, values, and common pitfalls.',
      },
      {
        cmd: '/config-workbook',
        name: 'Config Workbook Generator',
        description:
          'Full warehouse configuration workbook across structure, strategies, queues, and resources.',
      },
      {
        cmd: '/config-check',
        name: 'Config Reviewer',
        description:
          'Reviews configuration decisions for inconsistencies, missing objects, and EWM pitfalls.',
      },
    ],
  },
  {
    label: 'WRICEF Coding',
    icon: '⚙️',
    color: 'text-orange-600',
    agents: [
      {
        cmd: '/badi',
        name: 'BAdI Developer',
        description:
          'Generates production-ready Clean ABAP BAdI implementation with unit test skeleton.',
      },
      {
        cmd: '/report',
        name: 'ABAP Report Generator',
        description: 'Creates a complete ALV report using CL_SALV_TABLE with authority check.',
      },
      {
        cmd: '/interface',
        name: 'Interface Developer',
        description: 'Builds IDoc, BAPI, REST, or RFC interface code with error handling and app log.',
      },
      {
        cmd: '/ppf',
        name: 'PPF Action Developer',
        description:
          'Generates PPF action definition steps, ABAP action method, and condition technique setup.',
      },
    ],
  },
  {
    label: 'Testing',
    icon: '🧪',
    color: 'text-pink-600',
    agents: [
      {
        cmd: '/test-scripts',
        name: 'Test Script Writer',
        description:
          'Creates scripts for happy path, alternative paths, and error scenarios in your chosen format.',
      },
      {
        cmd: '/uat-package',
        name: 'UAT Pack Generator',
        description: 'Role-based UAT package in plain language — zero SAP jargon — with sign-off sheet.',
      },
      {
        cmd: '/triage',
        name: 'Defect Triager',
        description:
          'Classifies root cause, provides investigation checklist, fix approach, and workaround.',
      },
    ],
  },
  {
    label: 'Cutover & Migration',
    icon: '🚀',
    color: 'text-red-600',
    agents: [
      {
        cmd: '/runbook',
        name: 'Cutover Runbook Generator',
        description:
          'Detailed task table with owners, gate criteria, EWM-specific tasks, and rollback procedure.',
      },
      {
        cmd: '/go-nogo',
        name: 'Go / No-Go Checker',
        description:
          'Readiness checklist across technical, functional, data, integration, and business dimensions.',
      },
    ],
  },
  {
    label: 'Project Delivery & PMO',
    icon: '📊',
    color: 'text-violet-600',
    agents: [
      {
        cmd: '/regression',
        name: 'Regression Scope Advisor',
        description:
          'Recommends the minimum regression test scope after a change, with priority and effort estimate.',
      },
      {
        cmd: '/data-quality',
        name: 'Data Quality Validator',
        description:
          'Defines migration validation rules, load sequence dependencies, and post-load queries.',
      },
    ],
  },
  {
    label: 'Training & Go-Live',
    icon: '🎓',
    color: 'text-teal-600',
    agents: [
      {
        cmd: '/training',
        name: 'Training Material Creator',
        description:
          'Role-specific material as quick-reference card, full guide, or e-learning storyboard.',
      },
      {
        cmd: '/release-notes',
        name: 'Release Notes Writer',
        description: 'Audience-tuned notes for business users, key users, IT team, or management.',
      },
    ],
  },
  {
    label: 'AMS, Compliance & Upgrades',
    icon: '🛡️',
    color: 'text-indigo-600',
    agents: [
      {
        cmd: '/incident',
        name: 'Incident Triager',
        description: 'Classifies and investigates AMS incidents with root cause and resolution approach.',
      },
      {
        cmd: '/knowledge-article',
        name: 'KB Article Writer',
        description: 'Creates reusable knowledge base articles from resolved incidents or defects.',
      },
      {
        cmd: '/compliance',
        name: 'Compliance Assessor',
        description: 'FDA, EU GMP, ISO gap analysis with audit trail coverage and validation approach.',
      },
      {
        cmd: '/upgrade',
        name: 'Upgrade Impact Assessor',
        description:
          'Breaking changes list, Clean Core assessment, custom object risk table, and remediation plan.',
      },
    ],
  },
];

export const WORKSPACE_ITEMS = [
  { id: 'processes' as const, label: 'Processes', icon: '📁' },
  { id: 'artefacts' as const, label: 'Artefacts', icon: '🗂️' },
];

export type WorkspaceView = 'processes' | 'artefacts';
export type PanelView = string | WorkspaceView; // category label OR workspace id
