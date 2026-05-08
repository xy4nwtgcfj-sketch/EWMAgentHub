'use client';

import { useEffect, useRef } from 'react';
import { COMMANDS, COMMAND_CATEGORIES, type CommandCategory } from '@/lib/commands';
import { cn } from '@/lib/utils';

interface Props {
  query: string;
  onSelect: (cmd: string) => void;
  onClose: () => void;
}

const CATEGORY_COLORS: Record<CommandCategory, string> = {
  Process: 'text-violet-400',
  Artefacts: 'text-slate-400',
  'Pre-Sales': 'text-emerald-400',
  Workshop: 'text-amber-400',
  Specification: 'text-blue-400',
  Configuration: 'text-cyan-400',
  WRICEF: 'text-orange-400',
  Testing: 'text-pink-400',
  Cutover: 'text-red-400',
  Training: 'text-teal-400',
  AMS: 'text-indigo-400',
  Workflow: 'text-purple-400',
};

export function CommandPalette({ query, onSelect, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const filtered = COMMANDS.filter((c) =>
    query.length <= 1
      ? true
      : c.cmd.toLowerCase().includes(query.toLowerCase()) ||
        c.description.toLowerCase().includes(query.toLowerCase())
  );

  // Group by category
  const grouped = COMMAND_CATEGORIES.reduce<Record<string, typeof filtered>>(
    (acc, cat) => {
      const items = filtered.filter((c) => c.category === cat);
      if (items.length) acc[cat] = items;
      return acc;
    },
    {}
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  if (filtered.length === 0) return null;

  return (
    <div
      ref={ref}
      className="command-palette-enter absolute bottom-full left-0 right-0 mb-2 bg-surface-raised border border-surface-border rounded-xl shadow-2xl max-h-80 overflow-y-auto z-50"
    >
      {Object.entries(grouped).map(([category, cmds]) => (
        <div key={category}>
          <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 sticky top-0 bg-surface-raised border-b border-surface-border/50">
            {category}
          </div>
          {cmds.map((cmd) => (
            <button
              key={cmd.cmd}
              onClick={() => onSelect(cmd.cmd + (cmd.args ? ' ' : ''))}
              className={cn(
                'w-full flex items-baseline gap-3 px-3 py-2.5 text-left hover:bg-surface-overlay transition-colors'
              )}
            >
              <span className={cn('text-sm font-mono font-medium shrink-0', CATEGORY_COLORS[cmd.category])}>
                {cmd.cmd}
              </span>
              {cmd.args && (
                <span className="text-xs text-slate-600 font-mono shrink-0">{cmd.args}</span>
              )}
              <span className="text-xs text-slate-500 truncate">{cmd.description}</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
