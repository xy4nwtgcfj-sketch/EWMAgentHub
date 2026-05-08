import { streamText } from 'ai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { buildSystemPrompt } from '@/lib/system-prompt';
import type { Process, Artefact } from '@/types';

export const runtime = 'edge';
export const maxDuration = 60;

export async function POST(req: Request) {
  const apiKey = req.headers.get('x-api-key') ?? '';

  if (!apiKey || !apiKey.startsWith('sk-ant-')) {
    return new Response(
      JSON.stringify({ error: 'A valid Anthropic API key is required. Enter your key in Settings.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let body: { messages: unknown[]; processes?: Process[]; artefacts?: Artefact[] };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { messages, processes = [], artefacts = [] } = body;

  const anthropic = createAnthropic({ apiKey });

  const result = await streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: buildSystemPrompt(processes, artefacts),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messages: messages as any,
    maxTokens: 8192,
    temperature: 0.3,
  });

  return result.toDataStreamResponse();
}
