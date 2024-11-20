import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatSession, Message } from '@/types/chat';

interface ChatStore {
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  loading: boolean;
  error: string | null;
  createSession: () => void;
  setCurrentSession: (sessionId: string) => void;
  addMessage: (sessionId: string, message: Message) => void;
  updateMessage: (sessionId: string, messageId: string, content: string) => void;
  deleteMessage: (sessionId: string, messageId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSession: null,
      loading: false,
      error: null,

      createSession: () => {
        const newSession: ChatSession = {
          id: crypto.randomUUID(),
          name: `Chat ${get().sessions.length + 1}`,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({
          sessions: [...state.sessions, newSession],
          currentSession: newSession,
        }));
      },

      setCurrentSession: (sessionId: string) => {
        const session = get().sessions.find((s) => s.id === sessionId);
        if (session) {
          set({ currentSession: session });
        }
      },

      addMessage: (sessionId: string, message: Message) => {
        set((state) => {
          const sessions = state.sessions.map((session) => {
            if (session.id === sessionId) {
              return {
                ...session,
                messages: [...session.messages, { ...message, id: message.id || crypto.randomUUID() }],
                updatedAt: new Date(),
              };
            }
            return session;
          });

          const currentSession = sessions.find((s) => s.id === sessionId) || null;

          return {
            sessions,
            currentSession,
          };
        });
      },

      updateMessage: (sessionId: string, messageId: string, content: string) => {
        set((state) => {
          const sessions = state.sessions.map((session) => {
            if (session.id === sessionId) {
              return {
                ...session,
                messages: session.messages.map((msg) =>
                  msg.id === messageId ? { ...msg, content } : msg
                ),
                updatedAt: new Date(),
              };
            }
            return session;
          });

          const currentSession = sessions.find((s) => s.id === sessionId) || null;

          return {
            sessions,
            currentSession,
          };
        });
      },

      deleteMessage: (sessionId: string, messageId: string) => {
        set((state) => {
          const sessions = state.sessions.map((session) => {
            if (session.id === sessionId) {
              return {
                ...session,
                messages: session.messages.filter((msg) => msg.id !== messageId),
                updatedAt: new Date(),
              };
            }
            return session;
          });

          const currentSession = sessions.find((s) => s.id === sessionId) || null;

          return {
            sessions,
            currentSession,
          };
        });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'chat-store',
    }
  )
);
