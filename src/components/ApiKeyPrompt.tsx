'use client';

import { useState } from 'react';
import { KeyRound, ExternalLink } from 'lucide-react';
import { useSessionStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface Props {
  onSaved?: () => void;
}

export function ApiKeyPrompt({ onSaved }: Props) {
  const { apiKey, setApiKey } = useSessionStore();
  const [draft, setDraft] = useState(apiKey);
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');

  function handleSave() {
    const trimmed = draft.trim();
    if (!trimmed.startsWith('sk-ant-')) {
      setError('Key must start with sk-ant-');
      return;
    }
    setError('');
    setApiKey(trimmed);
    onSaved?.();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-slate-300">
        <KeyRound className="w-4 h-4 text-blue-400 shrink-0" />
        <span className="text-sm font-medium">Anthropic API Key</span>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed">
        Your key is stored only in your browser (localStorage) and sent directly to the Anthropic API.
        It is never stored on a server.
      </p>

      <div className="flex gap-2">
        <input
          type={visible ? 'text' : 'password'}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder="sk-ant-api03-..."
          className={cn(
            'flex-1 bg-surface-overlay border rounded-lg px-3 py-2 text-sm text-slate-200',
            'placeholder:text-slate-600 focus:outline-none focus:ring-1',
            error
              ? 'border-red-500/60 focus:ring-red-500/40'
              : 'border-surface-border focus:ring-blue-500/40'
          )}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="px-3 py-2 text-xs text-slate-500 hover:text-slate-300 border border-surface-border rounded-lg transition-colors"
        >
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex items-center justify-between">
        <a
          href="https://console.anthropic.com/settings/keys"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          Get an API key
          <ExternalLink className="w-3 h-3" />
        </a>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
        >
          Save key
        </button>
      </div>
    </div>
  );
}
