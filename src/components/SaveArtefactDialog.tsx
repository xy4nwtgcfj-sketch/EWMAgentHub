'use client';

import { useState } from 'react';
import { X, BookmarkPlus } from 'lucide-react';
import { useSessionStore } from '@/lib/store';
import { ARTEFACT_TYPES, type ArtefactType } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  content: string;
  suggestedTitle?: string;
  onClose: () => void;
  onSaved?: (id: string) => void;
}

export function SaveArtefactDialog({ content, suggestedTitle = '', onClose, onSaved }: Props) {
  const { processes, addArtefact } = useSessionStore();
  const [title, setTitle] = useState(suggestedTitle);
  const [type, setType] = useState<ArtefactType>('Other');
  const [linkedProcess, setLinkedProcess] = useState('');
  const [error, setError] = useState('');

  function handleSave() {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setError('');
    const artefact = addArtefact({
      type,
      title: title.trim(),
      content,
      linkedProcess: linkedProcess || undefined,
    });
    onSaved?.(artefact.id);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-surface-raised border border-surface-border rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <BookmarkPlus className="w-4 h-4 text-blue-400" />
            <h2 className="text-base font-semibold text-slate-100">Save as Artefact</h2>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. FS-001 Inbound Goods Receipt"
              className={cn(
                'w-full bg-surface-overlay border rounded-lg px-3 py-2 text-sm text-slate-200',
                'placeholder:text-slate-600 focus:outline-none focus:ring-1',
                error ? 'border-red-500/60' : 'border-surface-border focus:ring-blue-500/40'
              )}
            />
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as ArtefactType)}
              className="w-full bg-surface-overlay border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
            >
              {ARTEFACT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Linked Process <span className="text-slate-600">(optional)</span>
            </label>
            <select
              value={linkedProcess}
              onChange={(e) => setLinkedProcess(e.target.value)}
              className="w-full bg-surface-overlay border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/40"
            >
              <option value="">— None —</option>
              {processes.map((p) => (
                <option key={p.id} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <p className="text-xs text-slate-500">
            The artefact is saved to your browser session and can be downloaded as a Markdown file.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-surface-border">
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
            Save artefact
          </button>
        </div>
      </div>
    </div>
  );
}
