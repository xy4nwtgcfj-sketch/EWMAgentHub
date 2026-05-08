'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Download, Eye, ChevronRight, BookOpen, Archive } from 'lucide-react';
import { useSessionStore } from '@/lib/store';
import { cn, downloadArtefact, formatDate } from '@/lib/utils';
import type { Artefact, Process } from '@/types';
import { ProcessDialog } from './ProcessDialog';
import { SaveArtefactDialog } from './SaveArtefactDialog';

type Tab = 'processes' | 'artefacts';

interface ArtefactViewerProps {
  artefact: Artefact;
  onClose: () => void;
}

function ArtefactViewer({ artefact, onClose }: ArtefactViewerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-surface-raised border border-surface-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border shrink-0">
          <div>
            <span className="text-xs text-blue-400 font-mono">{artefact.id}</span>
            <h2 className="text-base font-semibold text-slate-100 mt-0.5">{artefact.title}</h2>
            <div className="flex gap-3 mt-0.5 text-xs text-slate-500">
              <span>{artefact.type}</span>
              {artefact.linkedProcess && <span>· {artefact.linkedProcess}</span>}
              <span>· {formatDate(artefact.createdAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadArtefact(artefact)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 border border-surface-border rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 border border-surface-border rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
            {artefact.content}
          </pre>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  const { processes, artefacts, deleteProcess, deleteArtefact } = useSessionStore();
  const [tab, setTab] = useState<Tab>('processes');
  const [showProcessDialog, setShowProcessDialog] = useState(false);
  const [editingProcess, setEditingProcess] = useState<Process | undefined>();
  const [viewingArtefact, setViewingArtefact] = useState<Artefact | undefined>();
  const [expandedProcess, setExpandedProcess] = useState<string | null>(null);

  function handleDeleteProcess(id: string) {
    const linked = artefacts.filter((a) => {
      const proc = processes.find((p) => p.id === id);
      return proc && a.linkedProcess === proc.name;
    });
    const msg =
      linked.length > 0
        ? `This process has ${linked.length} linked artefact(s). Delete anyway?`
        : 'Delete this process?';
    if (confirm(msg)) deleteProcess(id);
  }

  return (
    <>
      <aside className="w-64 shrink-0 bg-surface-raised border-r border-surface-border flex flex-col h-full">
        {/* Tab bar */}
        <div className="flex border-b border-surface-border">
          <button
            onClick={() => setTab('processes')}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors',
              tab === 'processes'
                ? 'text-slate-100 border-b-2 border-blue-500'
                : 'text-slate-500 hover:text-slate-300'
            )}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Processes
            {processes.length > 0 && (
              <span className="bg-surface-overlay text-slate-400 text-[10px] px-1.5 py-0.5 rounded-full">
                {processes.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('artefacts')}
            className={cn(
              'flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors',
              tab === 'artefacts'
                ? 'text-slate-100 border-b-2 border-blue-500'
                : 'text-slate-500 hover:text-slate-300'
            )}
          >
            <Archive className="w-3.5 h-3.5" />
            Artefacts
            {artefacts.length > 0 && (
              <span className="bg-surface-overlay text-slate-400 text-[10px] px-1.5 py-0.5 rounded-full">
                {artefacts.length}
              </span>
            )}
          </button>
        </div>

        {/* Processes tab */}
        {tab === 'processes' && (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="px-3 py-2 border-b border-surface-border/50">
              <button
                onClick={() => {
                  setEditingProcess(undefined);
                  setShowProcessDialog(true);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-blue-400 hover:text-blue-300 border border-blue-500/30 hover:border-blue-400/50 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Define process
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {processes.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <p className="text-xs text-slate-600">No processes defined yet.</p>
                  <p className="text-xs text-slate-700 mt-1">
                    Use /define-process or the button above.
                  </p>
                </div>
              ) : (
                processes.map((p) => (
                  <div key={p.id} className="border-b border-surface-border/40">
                    <div className="flex items-center gap-1 px-3 py-2.5 hover:bg-surface-overlay group transition-colors">
                      <button
                        onClick={() =>
                          setExpandedProcess(expandedProcess === p.id ? null : p.id)
                        }
                        className="shrink-0"
                      >
                        <ChevronRight
                          className={cn(
                            'w-3.5 h-3.5 text-slate-600 transition-transform',
                            expandedProcess === p.id && 'rotate-90'
                          )}
                        />
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-200 truncate">{p.name}</p>
                        <p className="text-[10px] text-slate-600 font-mono">{p.id}</p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 shrink-0">
                        <button
                          onClick={() => {
                            setEditingProcess(p);
                            setShowProcessDialog(true);
                          }}
                          className="text-slate-600 hover:text-slate-300 transition-colors"
                        >
                          <Pencil className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteProcess(p.id)}
                          className="text-slate-600 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    {expandedProcess === p.id && (
                      <div className="px-4 pb-2 space-y-1">
                        <p className="text-[11px] text-slate-500 leading-relaxed">{p.description}</p>
                        {p.steps.map((s) => (
                          <p key={s.number} className="text-[11px] text-slate-600">
                            <span className="text-slate-500">{s.number}.</span> {s.text}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Artefacts tab */}
        {tab === 'artefacts' && (
          <div className="flex-1 overflow-y-auto">
            {artefacts.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <p className="text-xs text-slate-600">No artefacts saved yet.</p>
                <p className="text-xs text-slate-700 mt-1">
                  Hover any assistant message and click &ldquo;Save as artefact&rdquo;.
                </p>
              </div>
            ) : (
              artefacts.map((a) => (
                <div
                  key={a.id}
                  className="border-b border-surface-border/40 px-3 py-2.5 hover:bg-surface-overlay group transition-colors"
                >
                  <div className="flex items-start justify-between gap-1">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-200 truncate">{a.title}</p>
                      <div className="flex gap-2 mt-0.5">
                        <span className="text-[10px] text-slate-600 font-mono">{a.id}</span>
                        <span className="text-[10px] text-blue-500">{a.type}</span>
                      </div>
                      {a.linkedProcess && (
                        <p className="text-[10px] text-slate-600 truncate mt-0.5">
                          ↳ {a.linkedProcess}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 shrink-0 mt-0.5">
                      <button
                        onClick={() => setViewingArtefact(a)}
                        className="text-slate-600 hover:text-slate-300 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => downloadArtefact(a)}
                        className="text-slate-600 hover:text-slate-300 transition-colors"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => confirm('Delete this artefact?') && deleteArtefact(a.id)}
                        className="text-slate-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </aside>

      {showProcessDialog && (
        <ProcessDialog
          process={editingProcess}
          onClose={() => {
            setShowProcessDialog(false);
            setEditingProcess(undefined);
          }}
        />
      )}

      {viewingArtefact && (
        <ArtefactViewer artefact={viewingArtefact} onClose={() => setViewingArtefact(undefined)} />
      )}
    </>
  );
}
