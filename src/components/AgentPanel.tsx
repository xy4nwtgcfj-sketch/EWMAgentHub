'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Download, Eye, ChevronRight } from 'lucide-react';
import { AGENT_CATEGORIES } from '@/lib/agent-catalog';
import { useSessionStore } from '@/lib/store';
import { cn, downloadArtefact, formatDate } from '@/lib/utils';
import type { PanelView } from '@/lib/agent-catalog';
import type { Artefact, Process } from '@/types';
import { ProcessDialog } from './ProcessDialog';
import { SaveArtefactDialog } from './SaveArtefactDialog';

/* ── Artefact viewer modal ─────────────────────────────────────────── */
function ArtefactViewer({ artefact, onClose }: { artefact: Artefact; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700 shrink-0">
          <div>
            <span className="text-xs text-emerald-400 font-mono">{artefact.id}</span>
            <h2 className="text-sm font-semibold text-gray-100 mt-0.5">{artefact.title}</h2>
            <div className="flex gap-3 mt-0.5 text-xs text-gray-500">
              <span>{artefact.type}</span>
              {artefact.linkedProcess && <span>· {artefact.linkedProcess}</span>}
              <span>· {formatDate(artefact.createdAt)}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => downloadArtefact(artefact)}
              className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-400 hover:text-gray-200 border border-gray-700 rounded-lg transition-colors"
            >
              <Download className="w-3 h-3" /> Download
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-gray-400 hover:text-gray-200 border border-gray-700 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
            {artefact.content}
          </pre>
        </div>
      </div>
    </div>
  );
}

/* ── Process list ──────────────────────────────────────────────────── */
function ProcessList() {
  const { processes, artefacts, deleteProcess } = useSessionStore();
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<Process | undefined>();
  const [expanded, setExpanded] = useState<string | null>(null);

  function handleDelete(id: string) {
    const proc = processes.find((p) => p.id === id);
    const linked = artefacts.filter((a) => a.linkedProcess === proc?.name).length;
    const msg = linked > 0 ? `${linked} artefact(s) linked. Delete anyway?` : 'Delete this process?';
    if (confirm(msg)) deleteProcess(id);
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        {processes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
            <span className="text-4xl">📁</span>
            <p className="text-sm text-gray-400">No processes defined yet.</p>
            <p className="text-xs text-gray-600">
              Define your EWM processes and I&apos;ll use them as context in every agent.
            </p>
            <button
              onClick={() => { setEditing(undefined); setShowDialog(true); }}
              className="mt-2 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Define first process
            </button>
          </div>
        ) : (
          <div className="p-3 space-y-1">
            <button
              onClick={() => { setEditing(undefined); setShowDialog(true); }}
              className="w-full flex items-center justify-center gap-1.5 py-2 text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-700/40 hover:border-emerald-600/60 rounded-lg transition-colors mb-3"
            >
              <Plus className="w-3.5 h-3.5" /> Define process
            </button>
            {processes.map((p) => (
              <div key={p.id} className="rounded-lg border border-gray-700/60 overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2.5 hover:bg-gray-800/50 group transition-colors">
                  <button
                    onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                    className="shrink-0"
                  >
                    <ChevronRight
                      className={cn(
                        'w-3.5 h-3.5 text-gray-600 transition-transform',
                        expanded === p.id && 'rotate-90'
                      )}
                    />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-200 truncate">{p.name}</p>
                    <p className="text-[10px] text-gray-600 font-mono">{p.id}</p>
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => { setEditing(p); setShowDialog(true); }}
                      className="text-gray-600 hover:text-gray-300 transition-colors"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-gray-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                {expanded === p.id && (
                  <div className="px-4 pb-3 bg-gray-800/30 space-y-1.5 border-t border-gray-700/40">
                    <p className="text-[11px] text-gray-500 leading-relaxed mt-2">{p.description}</p>
                    {p.steps.map((s) => (
                      <p key={s.number} className="text-[11px] text-gray-600">
                        <span className="text-gray-500 mr-1">{s.number}.</span>
                        {s.text}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {showDialog && (
        <ProcessDialog
          process={editing}
          onClose={() => { setShowDialog(false); setEditing(undefined); }}
        />
      )}
    </>
  );
}

/* ── Artefact list ─────────────────────────────────────────────────── */
function ArtefactList() {
  const { artefacts, deleteArtefact } = useSessionStore();
  const [viewing, setViewing] = useState<Artefact | undefined>();

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        {artefacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
            <span className="text-4xl">🗂️</span>
            <p className="text-sm text-gray-400">No artefacts saved yet.</p>
            <p className="text-xs text-gray-600">
              Hover any assistant message and click &ldquo;Save as artefact&rdquo; to store outputs here.
            </p>
          </div>
        ) : (
          <div className="p-3 space-y-1">
            {artefacts.map((a) => (
              <div
                key={a.id}
                className="rounded-lg border border-gray-700/60 px-3 py-2.5 hover:bg-gray-800/50 group transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-200 truncate">{a.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-gray-600 font-mono">{a.id}</span>
                      <span className="text-[10px] text-emerald-500">{a.type}</span>
                    </div>
                    {a.linkedProcess && (
                      <p className="text-[10px] text-gray-600 truncate mt-0.5">↳ {a.linkedProcess}</p>
                    )}
                    <p className="text-[10px] text-gray-700 mt-0.5">{formatDate(a.createdAt)}</p>
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5">
                    <button
                      onClick={() => setViewing(a)}
                      className="text-gray-600 hover:text-gray-300 transition-colors"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => downloadArtefact(a)}
                      className="text-gray-600 hover:text-gray-300 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => confirm('Delete this artefact?') && deleteArtefact(a.id)}
                      className="text-gray-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {viewing && <ArtefactViewer artefact={viewing} onClose={() => setViewing(undefined)} />}
    </>
  );
}

/* ── Agent list ────────────────────────────────────────────────────── */
interface AgentListProps {
  categoryLabel: string;
  onSelectAgent: (cmd: string) => void;
}

function AgentList({ categoryLabel, onSelectAgent }: AgentListProps) {
  const category = AGENT_CATEGORIES.find((c) => c.label === categoryLabel);
  if (!category) return null;

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-2">
      {category.agents.map((agent) => (
        <button
          key={agent.cmd}
          onClick={() => onSelectAgent(agent.cmd + ' ')}
          className="w-full text-left rounded-xl border border-gray-700/60 px-4 py-3.5 hover:bg-gray-800/60 hover:border-emerald-700/40 group transition-all"
        >
          <p className="text-sm font-semibold text-gray-100 group-hover:text-emerald-300 transition-colors">
            {agent.name}
          </p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{agent.description}</p>
          <p className="text-[10px] text-gray-700 font-mono mt-2 group-hover:text-emerald-700 transition-colors">
            {agent.cmd}
          </p>
        </button>
      ))}
    </div>
  );
}

/* ── AgentPanel root ───────────────────────────────────────────────── */
interface AgentPanelProps {
  activeView: PanelView;
  onSelectAgent: (cmd: string) => void;
}

export function AgentPanel({ activeView, onSelectAgent }: AgentPanelProps) {
  const category = AGENT_CATEGORIES.find((c) => c.label === activeView);

  const headerLabel =
    activeView === 'processes'
      ? 'Processes'
      : activeView === 'artefacts'
        ? 'Artefacts'
        : activeView.toUpperCase();

  return (
    <div className="w-72 shrink-0 bg-gray-950 border-r border-gray-800 flex flex-col h-full">
      {/* Panel header */}
      <div className="px-4 py-3.5 border-b border-gray-800 shrink-0">
        {category ? (
          <div className="flex items-center gap-2">
            <span className="text-xl">{category.icon}</span>
            <div>
              <p className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase">
                {headerLabel}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{category.agents.length} agents</p>
            </div>
          </div>
        ) : (
          <p className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase">
            {headerLabel}
          </p>
        )}
      </div>

      {/* Panel content */}
      {activeView === 'processes' && <ProcessList />}
      {activeView === 'artefacts' && <ArtefactList />}
      {category && <AgentList categoryLabel={activeView} onSelectAgent={onSelectAgent} />}
    </div>
  );
}
