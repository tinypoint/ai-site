
import { Message, AIMessage } from '@/types';
import { create } from "zustand";

export interface User {
  id: number;
  avatar: string;
  messages: Message[];
  name: string;
}

interface State {
  input: string;
  messages: Message[];
}

interface Actions {
  selectedUser: any;
  setInput: (input: string) => void;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  setMessages: (fn: (messages: Message[]) => Message[]) => void;
  parseStreamResponse: (reader: ReadableStreamDefaultReader<Uint8Array>) => void;
  getLastAIMessage: () => AIMessage | undefined;
}

const useChatStore = create<State & Actions>()((set, get) => ({
  selectedUser: {
    id: 4,
    avatar:
      "https://images.freeimages.com/images/large-previews/023/geek-avatar-1632962.jpg?fmt=webp&h=350",
    messages: [],
    name: "John Smith",
  },

  input: "",

  setInput: (input) => set({ input }),
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => set({ input: e.target.value }),

  messages: [],
  setMessages: (fn) => set(({ messages }) => ({ messages: fn(messages) })),
  parseStreamResponse: async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
    const decoder = new TextDecoder();
    let buffer = '';
    let aiMessageReceived: Record<string, string> = {};

    const progress: { runningSteps: string[]; compeleteSteps: string[] } = {
      runningSteps: [],
      compeleteSteps: []
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let boundary = buffer.indexOf('\n\n');
      while (boundary !== -1) {
        const chunk = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);

        if (chunk.startsWith('data: ')) {
          const jsonData = JSON.parse(chunk.slice(6));
          set((state) => {
            const updatedMessages = [...state.messages];
            const lastAIMessage = updatedMessages.findLast((content) => content.role === 'ai');
            if (lastAIMessage) {

              if (jsonData.type === 'progress') {
                const { runningStep, compeleteStep } = JSON.parse(jsonData.data);
                if (runningStep) {
                  progress.runningSteps.push(runningStep);
                }
                if (compeleteStep) {
                  progress.runningSteps = progress.runningSteps.filter((step) => step !== compeleteStep);
                  progress.compeleteSteps.push(compeleteStep);
                }
              } else {
                if (aiMessageReceived[jsonData.type] === undefined) {
                  aiMessageReceived[jsonData.type] = '';
                }
                if (jsonData.type === 'finalJSON') {
                  aiMessageReceived[jsonData.type] = jsonData.data;
                } else {
                  aiMessageReceived[jsonData.type] += jsonData.data;
                }
              }

              const { plan, ...rest } = aiMessageReceived;
              lastAIMessage.content = plan;
              lastAIMessage.artifact = rest;
              lastAIMessage.progress = { ...progress };
            }
            return { messages: updatedMessages };
          });
        }

        boundary = buffer.indexOf('\n\n');
      }

      set((state) => {
        const updatedMessages = [...state.messages];
        const lastAIMessage = updatedMessages.findLast((content) => content.role === 'ai');
        if (lastAIMessage) {
          lastAIMessage.isLoading = false;
        }
        return { messages: updatedMessages };
      });
    }
  },
  getLastAIMessage: () => {
    const messages = get().messages;
    return messages.slice().reverse().find((message) => message.role === 'ai');
  },
}));

export default useChatStore;

