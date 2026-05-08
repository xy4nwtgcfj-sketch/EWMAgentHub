export interface ProcessStep {
  number: number;
  text: string;
  description?: string;
}

export interface Process {
  id: string;
  name: string;
  description: string;
  steps: ProcessStep[];
  createdAt: string;
  updatedAt: string;
}

export interface Artefact {
  id: string;
  type: ArtefactType;
  title: string;
  content: string;
  linkedProcess?: string;
  createdAt: string;
}

export type ArtefactType =
  | 'RFP Response'
  | 'Estimate'
  | 'Demo Script'
  | 'Workshop Prep'
  | 'Workshop Minutes'
  | 'Gap Analysis'
  | 'Process Flow'
  | 'Functional Spec'
  | 'Technical Spec'
  | 'Config Guide'
  | 'Config Workbook'
  | 'Config Check'
  | 'ABAP Code'
  | 'Report Code'
  | 'Interface Code'
  | 'Code Review'
  | 'Test Scripts'
  | 'UAT Package'
  | 'Triage Report'
  | 'Regression Scope'
  | 'Cutover Runbook'
  | 'Go/No-Go Checklist'
  | 'Data Quality Rules'
  | 'Training Material'
  | 'Release Notes'
  | 'Incident Report'
  | 'Knowledge Article'
  | 'Compliance Assessment'
  | 'Upgrade Assessment'
  | 'Other';

export const ARTEFACT_TYPES: ArtefactType[] = [
  'RFP Response',
  'Estimate',
  'Demo Script',
  'Workshop Prep',
  'Workshop Minutes',
  'Gap Analysis',
  'Process Flow',
  'Functional Spec',
  'Technical Spec',
  'Config Guide',
  'Config Workbook',
  'Config Check',
  'ABAP Code',
  'Report Code',
  'Interface Code',
  'Code Review',
  'Test Scripts',
  'UAT Package',
  'Triage Report',
  'Regression Scope',
  'Cutover Runbook',
  'Go/No-Go Checklist',
  'Data Quality Rules',
  'Training Material',
  'Release Notes',
  'Incident Report',
  'Knowledge Article',
  'Compliance Assessment',
  'Upgrade Assessment',
  'Other',
];
