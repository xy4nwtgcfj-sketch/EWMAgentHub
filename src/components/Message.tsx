'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { BookmarkPlus, Copy, Check, User, Bot } from 'lucide-react';
import type { Message as AIMessage } from 'ai';
import { cn, copyToClipboard } from '@/lib/utils';
import { SaveArtefactDialog } from './SaveArtefactDialog';

interface Props {
  message: AIMessage;
  isStreaming?: boolean;
}

function extractTitle(content: string): string {
  const heading = content.match(/^#{1,2}\s+(.+)/m);
  if (heading) return heading[1].replace(/\*\*/g, '').trim().slice(0, 80);
  const firstLine = content.split('\n').find((l) => l.trim().length > 10);
  return firstLine?.trim().slice(0, 80) ?? 'Untitled Artefact';
}

export function Message({ message, isStreaming }: Props) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  async function handleCopy() {
    await copyToClipboard(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const content = typeof message.content === 'string' ? message.content : '';

  return (
    <>
      <div
        className={cn(
          'group flex gap-3 py-4 px-4',
          isUser ? 'justify-end' : 'justify-start'
        )}
      >
        {!isUser && (
          <div className="shrink-0 w-7 h-7 rounded-full bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center mt-0.5">
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        )}

        <div className={cn('flex flex-col gap-1 max-w-[85%]', isUser && 'items-end')}>
          {isUser ? (
            <div className="bg-blue-600/20 border border-blue-500/20 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-slate-200 whitespace-pre-wrap">
              {content}
            </div>
          ) : (
            <div
              className={cn(
                'prose prose-invert prose-sm max-w-none',
                'prose-headings:text-slate-100 prose-headings:font-semibold',
                'prose-p:text-slate-300 prose-p:leading-relaxed',
                'prose-strong:text-slate-200',
                'prose-ul:text-slate-300 prose-ol:text-slate-300',
                'prose-li:text-slate-300',
                'prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline',
                isStreaming && !content.endsWith('\n') && 'streaming-cursor'
              )}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  code({ className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    const isBlock = match || String(children).includes('\n');
                    if (isBlock) {
                      return (
                        <SyntaxHighlighter
                          style={vscDarkPlus as Record<string, React.CSSProperties>}
                          language={match ? match[1] : 'text'}
                          PreTag="div"
                          customStyle={{
                            margin: '0.75rem 0',
                            borderRadius: '0.5rem',
                            border: '1px solid #1e2d45',
                            fontSize: '0.8125rem',
                          }}
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      );
                    }
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}

          {/* Action buttons — visible on hover for assistant messages */}
          {!isUser && !isStreaming && content.length > 50 && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-slate-300 rounded-md hover:bg-surface-overlay transition-all"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-green-400" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy
                  </>
                )}
              </button>
              <button
                onClick={() => setShowSave(true)}
                className="flex items-center gap-1 px-2 py-1 text-xs text-slate-500 hover:text-emerald-400 rounded-md hover:bg-surface-overlay transition-all"
              >
                <BookmarkPlus className="w-3 h-3" />
                {savedId ? `Saved (${savedId})` : 'Save as artefact'}
              </button>

            </div>
          )}
        </div>

        {isUser && (
          <div className="shrink-0 w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center mt-0.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
          </div>
        )}
      </div>

      {showSave && (
        <SaveArtefactDialog
          content={content}
          suggestedTitle={extractTitle(content)}
          onClose={() => setShowSave(false)}
          onSaved={(id) => setSavedId(id)}
        />
      )}
    </>
  );
}
