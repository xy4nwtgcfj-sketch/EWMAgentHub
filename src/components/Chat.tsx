'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { useChat } from 'ai/react';
import { Send, Square, Loader2 } from 'lucide-react';
import { useSessionStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Message } from './Message';
import { CommandPalette } from './CommandPalette';

const WELCOME: import('ai').Message = {
  id: 'welcome',
  role: 'assistant',
  content: `**EWM Agent Hub ready.**

I'm your SAP EWM implementation assistant. I can help across the full project lifecycle — from RFP responses to go-live support.

**To get started, I recommend:**

1. \`/define-process\` — tell me which EWM processes you're implementing (I'll use these as context in every agent)
2. Or jump straight to any agent — type \`/\` to see all commands

**What are you working on today?**`,
};

export function Chat() {
  const { apiKey, processes, artefacts } = useSessionStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showPalette, setShowPalette] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, isLoading, stop, setInput } = useChat({
    api: '/api/chat',
    headers: { 'x-api-key': apiKey },
    body: { processes, artefacts },
    initialMessages: [WELCOME],
    onError: (err) => {
      console.error('Chat error:', err);
    },
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show/hide command palette based on input
  useEffect(() => {
    setShowPalette(input.startsWith('/'));
  }, [input]);

  function handleSelectCommand(cmd: string) {
    setInput(cmd);
    setShowPalette(false);
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
        setShowPalette(false);
      }
    }
    if (e.key === 'Escape') {
      setShowPalette(false);
    }
  }

  // Auto-resize textarea
  const autoResize = useCallback((el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  }, []);

  useEffect(() => {
    if (inputRef.current) autoResize(inputRef.current);
  }, [input, autoResize]);

  const lastMessage = messages[messages.length - 1];
  const isStreaming = isLoading && lastMessage?.role === 'assistant';

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {messages.map((m, i) => (
            <Message
              key={m.id}
              message={m}
              isStreaming={isStreaming && i === messages.length - 1}
            />
          ))}

          {/* Loading indicator (before first streaming token) */}
          {isLoading && !isStreaming && (
            <div className="flex items-center gap-3 py-4 px-4">
              <div className="shrink-0 w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin" />
              </div>
              <span className="text-xs text-slate-500">Thinking…</span>
            </div>
          )}

          <div ref={bottomRef} className="h-4" />
        </div>
      </div>

      {/* Input area */}
      <div className="shrink-0 border-t border-surface-border bg-surface-base/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!isLoading && input.trim()) {
                handleSubmit(e);
                setShowPalette(false);
              }
            }}
            className="relative"
          >
            {showPalette && (
              <CommandPalette
                query={input}
                onSelect={handleSelectCommand}
                onClose={() => setShowPalette(false)}
              />
            )}

            <div
              className={cn(
                'flex items-end gap-2 bg-surface-raised border rounded-xl px-3 py-2.5 transition-colors',
                'focus-within:border-blue-500/50',
                !apiKey ? 'border-amber-500/30' : 'border-surface-border'
              )}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={
                  !apiKey
                    ? 'Enter your Anthropic API key in Settings first…'
                    : 'Type a message or / for commands…'
                }
                disabled={!apiKey}
                rows={1}
                className={cn(
                  'flex-1 bg-transparent text-sm text-slate-200 placeholder:text-slate-600',
                  'resize-none focus:outline-none leading-relaxed',
                  'max-h-40 overflow-y-auto',
                  !apiKey && 'cursor-not-allowed opacity-50'
                )}
              />

              {isLoading ? (
                <button
                  type="button"
                  onClick={stop}
                  className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                  title="Stop generating"
                >
                  <Square className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim() || !apiKey}
                  className={cn(
                    'shrink-0 w-8 h-8 flex items-center justify-center rounded-lg transition-colors',
                    input.trim() && apiKey
                      ? 'bg-blue-600 hover:bg-blue-500 text-white'
                      : 'bg-surface-overlay text-slate-600 cursor-not-allowed'
                  )}
                  title="Send (Enter)"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {!apiKey && (
              <p className="text-[11px] text-amber-400/70 mt-1.5 text-center">
                API key required — click Settings in the header to add yours
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
