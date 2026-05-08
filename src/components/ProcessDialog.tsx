'use client';

import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useSessionStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import type { Process } from '@/types';

interface Props {
  process?: Process;
  onClose: () => void;
}

interface StepDraft {
  text: string;
  description: string;
}

export function ProcessDialog({ process, onClose }: Props) {
  const { addProcess, updateProcess } = useSessionStore();
  const isEdit = !!process;

  const [name, setName] = useState(process?.name ?? '');
  const [description, setDescription] = useState(process?.description ?? '');
  const [steps, setSteps] = useState<StepDraft[]>(
    process?.steps.map((s) => ({ text: s.text, description: s.description ?? '' })) ?? [
      { text: '', description: '' },
    ]
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Process name is required';
    if (!description.trim()) e.description = 'Description is required';
    steps.forEach((s, i) => {
      if (!s.text.trim()) e[`step_${i}`] = 'Step text is required';
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    const data = {
      name: name.trim(),
      description: description.trim(),
      steps: steps.map((s, i) => ({
        number: i + 1,
        text: s.text.trim(),
        description: s.description.trim() || undefined,
      })),
    };
    if (isEdit && process) {
      updateProcess(process.id, data);
    } else {
      addProcess(data);
    }
    onClose();
  }

  function addStep() {
    setSteps((prev) => [...prev, { text: '', description: '' }]);
  }

  function removeStep(i: number) {
    setSteps((prev) => prev.filter((_, idx) => idx !== i));
  }

  function updateStep(i: number, field: keyof StepDraft, value: string) {
    setSteps((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: value } : s)));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-surface-raised border border-surface-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border shrink-0">
          <h2 className="text-base font-semibold text-slate-100">
            {isEdit ? 'Edit Process' : 'Define Process'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Process Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Inbound Goods Receipt with Quality Inspection"
              className={cn(
                'w-full bg-surface-overlay border rounded-lg px-3 py-2 text-sm text-slate-200',
                'placeholder:text-slate-600 focus:outline-none focus:ring-1',
                errors.name ? 'border-red-500/60' : 'border-surface-border focus:ring-blue-500/40'
              )}
            />
            {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Description — when triggered, what it achieves
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Triggered when a delivery arrives at the goods receipt door..."
              className={cn(
                'w-full bg-surface-overlay border rounded-lg px-3 py-2 text-sm text-slate-200',
                'placeholder:text-slate-600 focus:outline-none focus:ring-1 resize-none',
                errors.description ? 'border-red-500/60' : 'border-surface-border focus:ring-blue-500/40'
              )}
            />
            {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-400">Process Steps</label>
              <button
                onClick={addStep}
                className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Plus className="w-3 h-3" /> Add step
              </button>
            </div>
            <div className="space-y-2">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <span className="shrink-0 w-6 h-8 flex items-center justify-center text-xs text-slate-500">
                    {i + 1}.
                  </span>
                  <div className="flex-1 space-y-1">
                    <input
                      value={step.text}
                      onChange={(e) => updateStep(i, 'text', e.target.value)}
                      placeholder="Step description"
                      className={cn(
                        'w-full bg-surface-overlay border rounded-lg px-3 py-1.5 text-sm text-slate-200',
                        'placeholder:text-slate-600 focus:outline-none focus:ring-1',
                        errors[`step_${i}`]
                          ? 'border-red-500/60'
                          : 'border-surface-border focus:ring-blue-500/40'
                      )}
                    />
                    <input
                      value={step.description}
                      onChange={(e) => updateStep(i, 'description', e.target.value)}
                      placeholder="Optional detail..."
                      className="w-full bg-surface-overlay border border-surface-border rounded-lg px-3 py-1.5 text-xs text-slate-400 placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
                    />
                  </div>
                  {steps.length > 1 && (
                    <button
                      onClick={() => removeStep(i)}
                      className="shrink-0 mt-1.5 text-slate-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-surface-border shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            {isEdit ? 'Save changes' : 'Define process'}
          </button>
        </div>
      </div>
    </div>
  );
}
