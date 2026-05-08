'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, KeyRound, ExternalLink } from 'lucide-react';
import { AGENT_CATEGORIES, WORKSPACE_ITEMS, type PanelView } from '@/lib/agent-catalog';
import { useSessionStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface Props {
  activeView: PanelView;
  onSelectView: (view: PanelView) => void;
}

function ApiKeySection() {
  const { apiKey, setApiKey } = useSessionStore();
  const [draft, setDraft] = useState(apiKey);
  const [visible, setVisible] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setApiKey(trimmed);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const isValid = apiKey.startsWith('sk-ant-');

  return (
    <div className="px-4 py-3 border-b border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
          Anthropic API Key
        </span>
        {isValid && (
          <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        )}
      </div>
      <div className="flex gap-1.5">
        <div className="relative flex-1">
          <KeyRound className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400" />
          <input
            type={visible ? 'text' : 'password'}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            placeholder="sk-ant-..."
            className={cn(
              'w-full pl-7 pr-2 py-1.5 text-xs rounded-lg border bg-gray-50 text-gray-800',
              'placeholder:text-gray-400 focus:outline-none focus:ring-2',
              isValid && draft === apiKey
                ? 'border-emerald-300 focus:ring-emerald-200'
                : 'border-gray-200 focus:ring-gray-200'
            )}
          />
        </div>
        <button
          onClick={() => setVisible((v) => !v)}
          className="px-2 text-[10px] text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg bg-gray-50 transition-colors"
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
      <div className="flex items-center justify-between mt-1.5">
        <a
          href="https://console.anthropic.com/settings/keys"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-0.5 text-[10px] text-gray-400 hover:text-emerald-600 transition-colors"
        >
          Get a key <ExternalLink className="w-2.5 h-2.5" />
        </a>
        <button
          onClick={handleSave}
          disabled={!draft.trim() || draft === apiKey}
          className={cn(
            'text-[10px] px-2 py-0.5 rounded font-medium transition-colors',
            saved
              ? 'text-emerald-600 bg-emerald-50'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed'
          )}
        >
          {saved ? 'Saved ✓' : 'Save'}
        </button>
      </div>
    </div>
  );
}

export function CategoryNav({ activeView, onSelectView }: Props) {
  const { processes, artefacts } = useSessionStore();
  const [workspaceOpen, setWorkspaceOpen] = useState(true);

  return (
    <nav className="w-64 shrink-0 bg-white border-r border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Branding */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center shadow-sm">
            <span className="text-base">⚡</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">EWM Agent Hub</p>
            <p className="text-[10px] font-semibold tracking-widest text-gray-400 uppercase mt-0.5">
              SAP EWM Practice
            </p>
          </div>
        </div>
      </div>

      {/* API Key */}
      <ApiKeySection />

      {/* Category list */}
      <div className="flex-1 overflow-y-auto py-2">
        {AGENT_CATEGORIES.map((cat) => {
          const isActive = activeView === cat.label;
          return (
            <button
              key={cat.label}
              onClick={() => onSelectView(cat.label)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors border-l-2',
                isActive
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                  : 'border-transparent hover:bg-gray-50 text-gray-700'
              )}
            >
              <span className="text-base shrink-0">{cat.icon}</span>
              <span
                className={cn(
                  'flex-1 text-sm font-medium leading-tight',
                  isActive ? 'text-emerald-800' : 'text-gray-700'
                )}
              >
                {cat.label}
              </span>
              <span
                className={cn(
                  'shrink-0 text-[11px] font-semibold w-5 h-5 rounded-full flex items-center justify-center',
                  isActive
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-500'
                )}
              >
                {cat.agents.length}
              </span>
            </button>
          );
        })}

        {/* Workspace section */}
        <div className="mt-2 border-t border-gray-100 pt-2">
          <button
            onClick={() => setWorkspaceOpen((v) => !v)}
            className="w-full flex items-center gap-2 px-4 py-1.5 text-[10px] font-semibold tracking-widest text-gray-400 uppercase hover:text-gray-600 transition-colors"
          >
            Workspace
            {workspaceOpen ? (
              <ChevronUp className="w-3 h-3 ml-auto" />
            ) : (
              <ChevronDown className="w-3 h-3 ml-auto" />
            )}
          </button>
          {workspaceOpen &&
            WORKSPACE_ITEMS.map((item) => {
              const isActive = activeView === item.id;
              const count = item.id === 'processes' ? processes.length : artefacts.length;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectView(item.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-2 text-left transition-colors border-l-2',
                    isActive
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                      : 'border-transparent hover:bg-gray-50 text-gray-600'
                  )}
                >
                  <span className="text-sm shrink-0">{item.icon}</span>
                  <span className={cn('flex-1 text-sm', isActive ? 'font-medium' : '')}>
                    {item.label}
                  </span>
                  {count > 0 && (
                    <span
                      className={cn(
                        'shrink-0 text-[11px] font-semibold w-5 h-5 rounded-full flex items-center justify-center',
                        isActive ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-500'
                      )}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
        </div>
      </div>
    </nav>
  );
}
