'use client';

import { useState } from 'react';
import { Settings, X, Layers } from 'lucide-react';
import { useSessionStore } from '@/lib/store';
import { Chat } from '@/components/Chat';
import { Sidebar } from '@/components/Sidebar';
import { ApiKeyPrompt } from '@/components/ApiKeyPrompt';

export default function Home() {
  const { apiKey } = useSessionStore();
  const [showSettings, setShowSettings] = useState(!apiKey);

  return (
    <div className="flex flex-col h-screen bg-surface-base">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-4 py-3 border-b border-surface-border bg-surface-raised/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-100 leading-none">EWM Agent Hub</h1>
            <p className="text-[10px] text-slate-500 mt-0.5">SAP EWM implementation assistant</p>
          </div>
        </div>

        <button
          onClick={() => setShowSettings((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 border border-surface-border hover:border-slate-500 rounded-lg transition-colors"
        >
          <Settings className="w-3.5 h-3.5" />
          Settings
          {!apiKey && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          )}
        </button>
      </header>

      {/* Settings panel (slide-in overlay) */}
      {showSettings && (
        <div className="absolute inset-0 z-40 flex" onClick={(e) => e.target === e.currentTarget && setShowSettings(false)}>
          <div className="ml-auto w-full max-w-sm bg-surface-raised border-l border-surface-border h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-border">
              <h2 className="text-sm font-semibold text-slate-100">Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5">
              <ApiKeyPrompt onSaved={() => setShowSettings(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Main layout: sidebar + chat */}
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <main className="flex-1 flex flex-col min-h-0 min-w-0">
          <Chat />
        </main>
      </div>
    </div>
  );
}
