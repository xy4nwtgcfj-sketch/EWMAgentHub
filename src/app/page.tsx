'use client';

import { useState, useCallback } from 'react';
import { CategoryNav } from '@/components/CategoryNav';
import { AgentPanel } from '@/components/AgentPanel';
import { Chat } from '@/components/Chat';
import type { PanelView } from '@/lib/agent-catalog';

export default function Home() {
  const [activeView, setActiveView] = useState<PanelView>('Pre-Sales & Proposals');
  const [injectedCommand, setInjectedCommand] = useState('');

  const handleSelectAgent = useCallback((cmd: string) => {
    setInjectedCommand(cmd);
  }, []);

  const handleCommandConsumed = useCallback(() => {
    setInjectedCommand('');
  }, []);

  return (
    <div className="flex h-screen bg-surface-base overflow-hidden">
      {/* Column 1: white category navigation */}
      <CategoryNav activeView={activeView} onSelectView={setActiveView} />

      {/* Column 2: dark agent panel */}
      <AgentPanel activeView={activeView} onSelectAgent={handleSelectAgent} />

      {/* Column 3: chat */}
      <main className="flex-1 flex flex-col min-h-0 min-w-0">
        <Chat injectedCommand={injectedCommand} onCommandConsumed={handleCommandConsumed} />
      </main>
    </div>
  );
}
