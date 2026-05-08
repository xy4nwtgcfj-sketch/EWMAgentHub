import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Process, Artefact, ArtefactType } from '@/types';
import { generateId } from './utils';

interface SessionStore {
  apiKey: string;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;

  processes: Process[];
  addProcess: (data: { name: string; description: string; steps: { number: number; text: string; description?: string }[] }) => Process;
  updateProcess: (id: string, updates: Partial<Omit<Process, 'id' | 'createdAt'>>) => void;
  deleteProcess: (id: string) => void;
  getProcess: (id: string) => Process | undefined;

  artefacts: Artefact[];
  addArtefact: (data: { type: ArtefactType; title: string; content: string; linkedProcess?: string }) => Artefact;
  deleteArtefact: (id: string) => void;
  getArtefact: (id: string) => Artefact | undefined;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      apiKey: '',
      setApiKey: (key) => set({ apiKey: key }),
      clearApiKey: () => set({ apiKey: '' }),

      processes: [],
      addProcess: (data) => {
        const now = new Date().toISOString();
        const process: Process = {
          id: `P-${generateId()}`,
          ...data,
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ processes: [...s.processes, process] }));
        return process;
      },
      updateProcess: (id, updates) =>
        set((s) => ({
          processes: s.processes.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        })),
      deleteProcess: (id) =>
        set((s) => ({ processes: s.processes.filter((p) => p.id !== id) })),
      getProcess: (id) => get().processes.find((p) => p.id === id),

      artefacts: [],
      addArtefact: (data) => {
        const idx = get().artefacts.length + 1;
        const artefact: Artefact = {
          id: `ART-${String(idx).padStart(3, '0')}`,
          ...data,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ artefacts: [...s.artefacts, artefact] }));
        return artefact;
      },
      deleteArtefact: (id) =>
        set((s) => ({ artefacts: s.artefacts.filter((a) => a.id !== id) })),
      getArtefact: (id) => get().artefacts.find((a) => a.id === id),
    }),
    {
      name: 'ewm-agent-hub-session',
      partialize: (s) => ({
        apiKey: s.apiKey,
        processes: s.processes,
        artefacts: s.artefacts,
      }),
    }
  )
);
